import { error } from '@sveltejs/kit';

export function entries() {
	return Object.keys(import.meta.glob('/src/content/projects/*/*.md'))
		.filter((path) => !path.split('/').at(-1).startsWith('+'))
		.map((path) => {
			const segments = path.split('/');
			return {
				slug: segments.at(-2),
				doc: segments.at(-1).replace(/\.md$/, '')
			};
		});
}

export async function load({ params }) {
	const { slug, doc } = params;

	try {
		const modules = import.meta.glob('/src/content/projects/*/*.md');
		let match = null;

		for (const [path, resolver] of Object.entries(modules)) {
			if (path.includes(`/${slug}/${doc}.md`)) {
				match = resolver;
				break;
			}
		}

		if (!match) {
			throw error(404, 'Document not found');
		}

		const document = await match();

		return {
			document,
			slug,
			docType: doc,
			meta: {
				title: `${slug} - ${doc.replace('-', ' ')}`,
				description: `${doc.replace('-', ' ')} for ${slug}`
			}
		};
	} catch {
		throw error(404, 'Document not found');
	}
}
