// The five personality axes the guided setup writes as `<axis>Level` settings.
// Mirrors Client/src/app/mock-api/apps/admin-catalog/data.ts.
//
// `levels` is the top of each scale: most axes run 1-5, but warmth and
// initiative only carry three meaningful positions. Three-level axes are listed
// first so their button groups sit above the sliders on the edit screen - and
// the resulting prompt follows this same order, which keeps each control lined
// up with the sentence it produces.
//
// Deliberately NOT in lib/server: the edit form needs these labels in the
// browser, and lib/server modules cannot be imported from a component.
export const personalityAxes = [
	{ key: 'warmthLevel', label: 'Warmth', low: 'Neutral', high: 'Warm', levels: 3 },
	{ key: 'initiativeLevel', label: 'Initiative', low: 'Reactive', high: 'Proactive', levels: 3 },
	{ key: 'verbosityLevel', label: 'Level of detail', low: 'Terse', high: 'Detailed', levels: 5 },
	{ key: 'addressLevel', label: 'Form of address', low: 'Informal', high: 'Formal', levels: 5 },
	{ key: 'expertiseLevel', label: 'Assumed expertise', low: 'Novice', high: 'Expert', levels: 5 }
] as const;

export type AxisKey = (typeof personalityAxes)[number]['key'];

export function axisLevels(key: AxisKey): number {
	return personalityAxes.find((axis) => axis.key === key)?.levels ?? 5;
}
