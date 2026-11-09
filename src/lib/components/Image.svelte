<script>
	let { image, alt, sizes = '', loading = 'eager', fetchpriority = 'auto' } = $props();

	// Check if the image is an external URL
	const isExternalUrl = $derived(image ? /^https?:\/\//.test(image) : false);
	const isGif = $derived(image ? image.endsWith('.gif') : false);

	const gifs = import.meta.glob('/src/content/**/*.gif', {
		import: 'default',
		eager: true
	});

	const pictures = import.meta.glob('/src/content/**/*.{avif,heif,jpeg,jpg,png,tiff,webp}', {
		import: 'default',
		eager: true,
		query: {
			enhanced: true,
			w: '2400;2000;1600;1200;800;400'
		}
	});

	function importImage(image) {
		if (image.endsWith('.gif')) {
			for (const [path, src] of Object.entries(gifs)) {
				if (path.includes(image)) {
					return src;
				}
			}
			return;
		}

		for (const [path, src] of Object.entries(pictures)) {
			if (path.includes(image)) {
				return src;
			}
		}
	}

	const src = $derived(image && !isExternalUrl ? importImage(image) : null);
</script>

{#if isExternalUrl}
	<img
		src={image}
		{alt}
		{loading}
		{fetchpriority}
		{sizes}
		onload={(e) => (e.target.style.opacity = 1)}
	/>
{:else if isGif}
	{#if src}
		<img {src} {alt} {loading} {fetchpriority} onload={(e) => (e.target.style.opacity = 1)} />
	{/if}
{:else if image}
	<picture>
		{#if src}
			<source srcset={src.sources.avif} type="image/avif" {sizes} />
			<source srcset={src.sources.webp} type="image/webp" {sizes} />
			<img
				src={src.img.src}
				{alt}
				{loading}
				{fetchpriority}
				width={src.img.w}
				height={src.img.h}
				onload={(e) => (e.target.style.opacity = 1)}
			/>
		{/if}
	</picture>
{/if}

<style>
	picture {
		aspect-ratio: var(--aspect-ratio, auto);
	}

	img {
		display: block;
		width: var(--width, 100%);
		height: var(--height, auto);
		aspect-ratio: var(--aspect-ratio, auto);
		object-fit: cover;
		transition: opacity 0.2s;
		opacity: 0;
		margin: auto;
	}
</style>
