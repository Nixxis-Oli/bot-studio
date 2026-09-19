import { personalityAxes, type AxisKey } from '$lib/axes';
import fixtures from '$lib/fixtures/contexts.json';

// Static build: the admin API is not called at runtime. `contexts.json` is a
// snapshot captured from it, so the demo can be published without exposing a
// key or serving live tenant data. Re-capture it to refresh the demo.

interface ContextMeta {
	objectId: string;
	name?: string;
	createdAt?: number;
	updatedAt?: number;
	defaultVersion?: string | null;
	versionsCount?: number;
	status?: string | null;
}

interface ContextPayload {
	settings?: Record<string, unknown>;
	prompts?: Record<string, unknown[]>;
	topics?: { key?: string; default?: boolean; description?: string; model?: string }[];
	config?: Record<string, unknown>;
}

interface Fixture {
	meta: ContextMeta;
	payload: ContextPayload;
}

// TypeScript infers a precise literal type for the imported JSON; the two
// shapes are compatible at runtime but not structurally comparable.
const entries = fixtures as unknown as Fixture[];

export interface Chatbot {
	id: string;
	name: string;
	description: string;
	botName: string;
	companyName: string;
	topicsCount: number;
	promptModes: string[];
	models: string[];
	versionsCount: number;
	published: boolean;
	createdAt: number | null;
	updatedAt: number | null;
}

export interface ChatbotDetail {
	id: string;
	name: string;
	botName: string;
	companyName: string;
	timezone: string;
	axes: Record<AxisKey, number>;
	mainModel: string;
	lightModel: string;
	classifierModel: string;
	summarizerModel: string;
	allowDebug: boolean;
	maxTokens: number;
	topics: { key: string; default: boolean; model: string }[];
	promptModes: string[];
	versionsCount: number;
	defaultVersion: string | null;
	createdAt: number | null;
	updatedAt: number | null;
}

function readString(value: unknown, fallback = ''): string {
	return typeof value === 'string' ? value : fallback;
}

// A level arrives as a string ("3") in the payload. Axes do not all share the
// same ceiling, so a stored value above an axis's top is pulled down to it -
// warmth 4 in the snapshot becomes 3 on a three-level scale.
function readLevel(value: unknown, levels: number): number {
	const parsed = Number(value);

	if (!Number.isFinite(parsed)) {
		return Math.ceil(levels / 2);
	}

	return Math.min(levels, Math.max(1, Math.round(parsed)));
}

// The admin API exposes no description field on a context. The Angular app
// derives a summary from the draft payload, so we do the same.
function describe(payload: ContextPayload): string {
	const settings = payload.settings ?? {};
	const botName = readString(settings.botName).trim();
	const company = readString(settings.companyName).trim();
	const topics = payload.topics ?? [];
	const defaultTopic = topics.find((topic) => topic?.default === true);

	if (defaultTopic?.description?.trim()) {
		return defaultTopic.description.trim();
	}

	const parts: string[] = [];

	if (botName) {
		parts.push(company ? `${botName}, assistant for ${company}` : `Assistant ${botName}`);
	}

	if (topics.length) {
		parts.push(`${topics.length} topic${topics.length > 1 ? 's' : ''}`);
	}

	const modes = Object.keys(payload.prompts ?? {});

	if (modes.length) {
		parts.push(`${modes.length} prompt mode${modes.length > 1 ? 's' : ''}`);
	}

	return parts.length ? parts.join(' - ') : 'No draft payload configured yet.';
}

export function listChatbots(): Chatbot[] {
	return entries
		.map(({ meta, payload }) => {
			const settings = payload.settings ?? {};
			const config = payload.config ?? {};

			return {
				id: meta.objectId,
				name: meta.name ?? '',
				description: describe(payload),
				botName: readString(settings.botName),
				companyName: readString(settings.companyName),
				topicsCount: (payload.topics ?? []).length,
				promptModes: Object.keys(payload.prompts ?? {}).sort(),
				models: [config.mainModel, config.lightModel].filter(
					(model): model is string => typeof model === 'string' && !!model
				),
				versionsCount: meta.versionsCount ?? 0,
				published: !!meta.defaultVersion,
				createdAt: meta.createdAt ?? null,
				updatedAt: meta.updatedAt ?? null
			} satisfies Chatbot;
		})
		.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
}

export function chatbotIds(): string[] {
	return entries.map((entry) => entry.meta.objectId);
}

export function getChatbot(id: string): ChatbotDetail | null {
	const entry = entries.find((candidate) => candidate.meta.objectId === id);

	if (!entry) {
		return null;
	}

	const { meta, payload } = entry;
	const settings = payload.settings ?? {};
	const config = payload.config ?? {};

	const axes = Object.fromEntries(
		personalityAxes.map((axis) => [axis.key, readLevel(settings[axis.key], axis.levels)])
	) as Record<AxisKey, number>;

	return {
		id: meta.objectId,
		name: meta.name ?? '',
		botName: readString(settings.botName),
		companyName: readString(settings.companyName),
		timezone: readString(settings.tz),
		axes,
		mainModel: readString(config.mainModel, 'haiku'),
		lightModel: readString(config.lightModel, 'nova-lite'),
		classifierModel: readString(config.classifierModel, 'nova-lite'),
		summarizerModel: readString(config.summarizerModel, 'haiku'),
		allowDebug: config.allowDebug === true,
		maxTokens: Number.isFinite(Number(config.maxTokens)) ? Number(config.maxTokens) : 4096,
		topics: (payload.topics ?? []).map((topic) => ({
			key: readString(topic?.key, '(unnamed)'),
			default: topic?.default === true,
			model: readString(topic?.model, 'both')
		})),
		promptModes: Object.keys(payload.prompts ?? {}).sort(),
		versionsCount: meta.versionsCount ?? 0,
		defaultVersion: meta.defaultVersion ?? null,
		createdAt: meta.createdAt ?? null,
		updatedAt: meta.updatedAt ?? null
	};
}
