import adapter from '@sveltejs/adapter-static';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { codeToHtml } from 'shiki';
import {
	transformerNotationDiff,
	transformerMetaHighlight,
	transformerNotationHighlight
} from '@shikijs/transformers';

const mdsvexOptions = {
	extensions: ['.md'],
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const html = await codeToHtml(code, {
				lang,
				theme: 'catppuccin-mocha',
				colorReplacements: {
					'#1e1e2e': 'none'
				},
				transformers: [
					transformerNotationDiff(),
					transformerMetaHighlight(),
					transformerNotationHighlight()
				]
			});
			const escaped = escapeSvelte(html);
			return `{@html \`${escaped}\` }`;
		}
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex(mdsvexOptions)],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			fallback: '404.html'
		}),
		prerender: {
			handleHttpError: ({ path, message }) => {
				const base = process.env.BASE_PATH ?? '';
				if (base && path.startsWith(`${base}${base}/_app/`)) return;
				throw new Error(message);
			}
		},
		paths: {
			relative: false,
			base: process.env.BASE_PATH ?? ''
		},
		inlineStyleThreshold: Infinity
	}
};

export default config;
