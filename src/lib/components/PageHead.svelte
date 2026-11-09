<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	let { title, description, type = 'website', image = null } = $props();
	const siteOrigin = 'https://abhimanyuuuuu.github.io';
	const siteUrl = (path) => {
		const normalizedPath = path.startsWith('/') ? path : `/${path}`;
		const basePrefix =
			base && (normalizedPath === base || normalizedPath.startsWith(`${base}/`)) ? '' : base;
		return `${siteOrigin}${basePrefix}${normalizedPath}`;
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:site_name" content="_manyuuu" />
	<meta property="og:title" content={title} />
	<meta property="og:type" content={type} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={siteUrl($page.url.pathname)} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta property="og:image" content={siteUrl(image.img.src)} />
		<meta property="og:image:width" content={image.img.w} />
		<meta property="og:image:height" content={image.img.h} />
		<meta property="og:image:alt" content={title} />
		<meta name="twitter:image:alt" content={title} />
	{/if}
</svelte:head>
