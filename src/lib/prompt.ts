import { personalityAxes, type AxisKey } from '$lib/axes';
import { wordingFor } from '$lib/axis-wording';

export interface PromptInput {
	botName: string;
	companyName: string;
	axes: Record<AxisKey, number>;
}

export interface PromptLine {
	/** The axis this line came from, or null for the identity preamble. */
	key: AxisKey | null;
	text: string;
}

// Assembles what the bot's `common` prompt resolves to, the way the engine does:
// a fixed preamble, then one fragment per personality axis in catalogue order.
// Returned line by line so the UI can show which control produced which sentence.
export function buildPrompt(input: PromptInput): PromptLine[] {
	const name = input.botName.trim() || 'the assistant';
	const company = input.companyName.trim();

	const preamble = company
		? `You are ${name}, a customer service assistant for ${company}.`
		: `You are ${name}, a customer service assistant.`;

	return [
		{ key: null, text: preamble },
		...personalityAxes.map((axis) => ({
			key: axis.key as AxisKey,
			text: wordingFor(axis.key as AxisKey, input.axes[axis.key as AxisKey])
		}))
	];
}
