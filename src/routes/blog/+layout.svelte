<script>
	let { children } = $props();
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<link
		rel="alternate"
		type="application/rss+xml"
		title="to_manyuuu - blog rss feed"
		href={resolve('/blog/rss.xml')}
	/>
</svelte:head>

{@render children()}
