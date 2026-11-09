import { books, songs } from '$lib/data/stuff.js';

const imports = import.meta.glob('/src/content/images/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}', {
	import: 'default',
	eager: true,
	query: {
		enhanced: true,
		w: '2000;1200;800'
	}
});

const images = Object.entries(imports).map(([path, image]) => ({
	image,
	alt: path
		.split('/')
		.at(-1)
		.replace(/\.[^.]+$/, '')
		.replace(/[-_]/g, ' ')
}));

for (let i = images.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[images[i], images[j]] = [images[j], images[i]];
}

export const prerender = true;

export function load() {
	return {
		images,
		songs,
		books,
		meta: {
			title: 'stuff',
			description: 'random clicks, music, and recent reads.'
		}
	};
}
