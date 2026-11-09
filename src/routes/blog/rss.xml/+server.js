import { getPosts } from '$lib/js/posts.js';
import { base } from '$app/paths';

export const prerender = true;

export async function GET() {
	const modules = import.meta.glob('/src/content/blog/*/*.md');
	let posts = await getPosts(modules);

	posts = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

	const siteUrl = 'https://abhimanyuuuuu.github.io' + base;
	const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>_manyuuu's blog</title>
		<description>posts about various topics.</description>
		<link>${siteUrl}/blog</link>
		<atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<language>en-us</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		${posts
			.map(
				(post) => `
		<item>
			<title>${escapeXml(post.name)}</title>
			<description>${escapeXml(post.description)}</description>
			<link>${siteUrl}/blog/${post.slug}</link>
			<guid>${siteUrl}/blog/${post.slug}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
		</item>`
			)
			.join('')}
	</channel>
</rss>`;

	return new Response(rssContent, {
		headers: {
			'Content-Type': 'application/rss+xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}

function escapeXml(text) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
