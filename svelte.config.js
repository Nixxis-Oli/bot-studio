import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Static build: every route is prerendered to plain files, so the output can be
// served by any static host. BASE_PATH covers project pages served from a
// subdirectory (GitHub Pages: BASE_PATH=/repo-name/mockup npm run build).
const base = process.env.BASE_PATH ?? '';

// The intro page listing the three mockups is published one level above this
// app, as a sibling static file rather than a route of it.
const introPath = base ? `${base.slice(0, base.lastIndexOf('/'))}/` : '/';

/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
    }),
    // relative:false makes `base` a plain absolute string. The default (true)
    // rewrites links relative to each page, which double-counts a manual
    // `{base}` prefix in our markup.
    paths: { base, relative: false },
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // The header links back to the intro page, which this app does not own.
        if (path === introPath) {
          return;
        }

        throw new Error(`${message} (linked from ${referrer})`);
      }
    }
  }
};
