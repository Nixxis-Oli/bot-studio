import type { AxisKey } from '$lib/axes';

// One sentence per axis position. The guided setup stores the selected wording in
// the payload's `fragments`, and the prompt templates interpolate it as
// {{fragments.warmth}} and so on - so moving a control really does rewrite the
// prompt the bot runs with.
//
// The level-3 and level-4 sentences below are the ones actually found in the
// captured snapshot; the rest are written in the same voice to fill the scales.
const WORDING: Record<AxisKey, string[]> = {
	warmthLevel: [
		'Answer factually and get straight to the point. Do not use empathetic or reassuring wording.',
		"Be polite and considerate. Acknowledge the customer's situation briefly before answering.",
		'Be warm and reassuring. Acknowledge how the customer feels before answering, and confirm you are taking care of their request.'
	],
	verbosityLevel: [
		'Answer in one or two sentences. No preamble, no restatement of the question.',
		'Keep answers short. Add detail only when the answer would be ambiguous without it.',
		'Give a complete but compact answer. Add a short explanation when it helps the customer act on it.',
		'Explain your answers. Give the reasoning behind them and mention the relevant conditions or exceptions.',
		'Be thorough. Walk through the reasoning, the conditions, the exceptions and what to do in each case.'
	],
	initiativeLevel: [
		'Answer what was asked. Offer a next step only when the request is clearly incomplete without one.',
		'Answer what was asked, then offer one relevant next step when there is an obvious one.',
		'Anticipate. Answer, then propose the next steps you can already see, and offer to start them.'
	],
	addressLevel: [
		'Address the customer casually, by first name, using the familiar form where a language has one.',
		'Keep the tone relaxed. Use the familiar form, but stay respectful.',
		'Use a neutral register, neither familiar nor stiff.',
		'Address the customer politely, using the polite form in languages that distinguish one.',
		'Address the customer formally, using the polite form in languages that distinguish one (French vouvoiement).'
	],
	expertiseLevel: [
		'Assume no prior knowledge. Define any term that is not everyday language.',
		'Assume little familiarity. Explain the concepts behind your answer briefly.',
		'Assume average familiarity with the product. Explain only what is specific to the case.',
		'Assume the customer knows the product well. Skip introductions.',
		'Assume the customer is technical. Use precise terminology, skip basic explanations, and go straight to the relevant detail.'
	]
};

// Levels are 1-based in the payload; the arrays are not.
export function wordingFor(key: AxisKey, level: number): string {
	const scale = WORDING[key];
	const index = Math.min(scale.length, Math.max(1, level)) - 1;

	return scale[index];
}
