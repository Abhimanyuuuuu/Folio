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
			<div class="covers">
				{#each data.songs as song (song.image)}
					<figure>
						<img
							src={mediaPath('songs', song.image)}
							alt={song.title}
							title={song.title}
							loading="lazy"
							onerror={hideMissingImage}
						/>
						<figcaption>{song.title}</figcaption>
					</figure>
				{/each}
			</div>
		</section>

		<section class="media-section reading" aria-labelledby="reading-heading">
			<h2 id="reading-heading">recent reads...</h2>
			<div class="covers">
				{#each data.books as book (book.image)}
					<figure>
						<img
							src={mediaPath('recent reads', book.image)}
							alt={book.title}
							title={book.title}
							loading="lazy"
							onerror={hideMissingImage}
						/>
						<figcaption>{book.title}</figcaption>
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
		border-right: 1px solid var(--bg-3);
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

	.music {
		border-bottom: 1px solid var(--bg-3);
	}

	.covers {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(5rem, 7rem));
		align-content: center;
		justify-content: center;
		gap: 1rem;
		flex: 1;
		min-height: 0;
	}

	.covers figure {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		max-height: 9rem;
		margin: 0;
		outline-offset: 3px;
	}

	.covers img {
		display: block;
		max-width: 100%;
		max-height: 9rem;
		object-fit: contain;
	}

	.covers figcaption {
		position: absolute;
		inset: auto 0 0;
		padding: 0.35rem;
		background: var(--bg-2);
		color: var(--txt-0);
		font-size: 0.875rem;
		line-height: 1.25;
		text-align: center;
		opacity: 0;
		pointer-events: none;
	}

	.covers figure:hover figcaption {
		opacity: 1;
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
			border-right: 0;
			border-bottom: 1px solid var(--bg-3);
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

		.music {
			border-bottom: 1px solid var(--bg-3);
		}

		.covers {
			grid-template-columns: repeat(auto-fit, minmax(4.5rem, 6rem));
			gap: 0.75rem;
		}
	}
</style>
