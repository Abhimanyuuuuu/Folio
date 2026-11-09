import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default [
	{
		ignores: [
			'**/.DS_Store',
			'node_modules/**',
			'build/**',
			'.svelte-kit/**',
			'package/**',
			'.env',
			'.env.*',
			'pnpm-lock.yaml',
			'package-lock.json',
			'yarn.lock',
			'test-results/**'
		]
	},
	js.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		files: ['**/*.js', '**/*.svelte'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	prettier
];
