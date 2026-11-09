<script>
	import { resolve } from '$app/paths';

	let { data } = $props();

	function mediaPath(folder, filename) {
		const encodedFilename = filename.split('/').map(encodeURIComponent).join('/');
		return resolve(`/${folder}/${encodedFilename}`);
	}

	function hideMissingImage(event) {
		event.currentTarget.parentElement.remove();
	}

	function handleCoverWheel(event) {
		if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
			event.preventDefault();
			event.currentTarget.scrollLeft += event.deltaY;
		}
	}
</script>

<main class="stuff">
	<section class="clicks" aria-labelledby="clicks-heading">
		<h1 id="clicks-heading">random clicks...</h1>
		<div class="photo-scroll">
			<div class="photos-grid">
				{#each data.images as { image, alt } (image.img.src)}
					<picture>
						<source srcset={image.sources.avif} type="image/avif" />
						<source srcset={image.sources.webp} type="image/webp" />
						<img
							src={image.img.src}
							{alt}
							loading="lazy"
							width={image.img.w}
							height={image.img.h}
						/>
					</picture>
				{/each}
			</div>
		</div>
	</section>

	<div class="right-side">
		<section class="media-section music" aria-labelledby="music-heading">
			<h2 id="music-heading">probably listening to...</h2>
			<div class="covers" onwheel={handleCoverWheel}>
				{#each data.songs as song (song.image)}
					<figure>
						<img
							src={mediaPath('songs', song.image)}
							alt={song.title}
							loading="lazy"
							onerror={hideMissingImage}
						/>
					</figure>
				{/each}
			</div>
		</section>

		<section class="media-section reading" aria-labelledby="reading-heading">
			<h2 id="reading-heading">recent reads...</h2>
			<div class="covers" onwheel={handleCoverWheel}>
				{#each data.books as book (book.image)}
					<figure>
						<img
							src={mediaPath('recent reads', book.image)}
							alt={book.title}
							loading="lazy"
							onerror={hideMissingImage}
						/>
					</figure>
				{/each}
			</div>
		</section>
	</div>
</main>

<style>
	.stuff {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
		height: calc(100vh - 5rem);
		height: calc(100dvh - 5rem);
		min-height: 0;
		overflow: hidden;
	}

	.clicks {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: 1.5rem 2rem 0;
	}

	h1,
	h2 {
		flex: 0 0 auto;
		font-size: 1.75rem;
		margin: 0 0 1rem;
	}

	.photo-scroll {
		min-height: 0;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		overscroll-behavior: contain;
		scrollbar-width: thin;
		scrollbar-color: var(--bg-3) transparent;
	}

	.photos-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
		gap: 1rem;
		padding-bottom: 1.5rem;
	}

	.photos-grid picture {
		display: block;
		min-width: 0;
	}

	.photos-grid img {
		display: block;
		width: 100%;
		height: auto;
	}

	.right-side {
		display: grid;
		grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	.media-section {
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		padding: 1.5rem 2rem;
		overflow: hidden;
	}

	.covers {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
		min-height: 0;
		overflow-x: auto;
		overflow-y: hidden;
		scrollbar-width: none;
		-ms-overflow-style: none;
		overscroll-behavior-x: contain;
	}

	.covers::-webkit-scrollbar {
		display: none;
	}

	.covers figure {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 7rem;
		width: 7rem;
		min-width: 0;
		max-height: 9rem;
		margin: 0;
	}

	.covers img {
		display: block;
		max-width: 100%;
		max-height: 9rem;
		object-fit: contain;
	}

	@media (max-width: 720px) {
		.stuff {
			display: flex;
			flex-direction: column;
			height: auto;
			min-height: calc(100vh - 5rem);
			min-height: calc(100dvh - 5rem);
			overflow: visible;
		}

		.clicks {
			min-height: 60vh;
			padding: 1.5rem 1.5rem 0;
		}

		.photo-scroll {
			min-height: auto;
			overflow: visible;
		}

		.right-side {
			display: contents;
		}

		.media-section {
			min-height: 50vh;
			padding: 1.5rem;
		}

		.covers {
			gap: 0.75rem;
		}

		.covers figure {
			flex-basis: 6rem;
			width: 6rem;
		}
	}
</style>
