<script>
	import { page } from '$app/stores';

	let { title, description, type = 'website', image = null } = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:site_name" content="_manyuuu" />
	<meta property="og:title" content={title} />
	<meta property="og:type" content={type} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={'https://example.com' + $page.url.pathname} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@_manyuuu" />
	<meta name="twitter:creator" content="@_manyuuu" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta property="og:image" content={'https://example.com' + image.img.src} />
		<meta property="og:image:width" content={image.img.w} />
		<meta property="og:image:height" content={image.img.h} />
		<meta property="og:image:alt" content={title} />
		<meta name="twitter:image" content={'https://example.com' + image.img.src} />
		<meta name="twitter:image:alt" content={title} />
	{/if}
</svelte:head>
