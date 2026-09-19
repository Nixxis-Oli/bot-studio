import { base } from '$app/paths';

// The intro page listing the three mockups sits one level above each app's base:
// the apps are published at /<repo>/<mockup>/ and the intro at /<repo>/.
//
// With no base - local dev - there is no intro page, so this falls back to the
// app's own root, which redirects to the chat bots screen.
export const introHref = base ? `${base.slice(0, base.lastIndexOf('/'))}/` : '/';
