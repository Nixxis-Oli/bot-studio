import { chatbotIds, getChatbot } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

// Tells the prerenderer which ids to visit, since there is no server to resolve
// them on demand.
export const entries: EntryGenerator = () => chatbotIds().map((id) => ({ id }));

export const load: PageLoad = ({ params }) => {
	const bot = getChatbot(params.id);

	if (!bot) {
		error(404, `Unknown context ${params.id}`);
	}

	return { bot };
};
