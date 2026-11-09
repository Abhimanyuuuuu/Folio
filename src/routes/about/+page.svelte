<script>
	import Arrow from '$lib/components/Arrow.svelte';
	import GithubIcon from '~icons/ph/github-logo';
	import LinkedinIcon from '~icons/ph/linkedin-logo';
	import ContactEmail from '$lib/components/ContactEmail.svelte';

	const links = [
		{ name: 'github', url: 'https://github.com/to_manyuuu', icon: GithubIcon },
		{
			name: 'linkedin',
			url: 'https://www.linkedin.com/in/REPLACE_WITH_LINKEDIN_USERNAME/',
			icon: LinkedinIcon
		}
	];

	const tech = {
		Languages: [
			'Python',
			'C',
			'Java',
			'JavaScript',
			'TypeScript',
			'R',
			'MATLAB',
			'SQL (MySQL, SQLite)'
		],
		Frameworks: [
			'Next.js',
			'Node.js',
			'Electron.js',
			'Dexie.js',
			'FastAPI',
			'IndexedDB',
			'Streamlit'
		],
		'Developer Tools': ['Git', 'GitHub', 'VS Code', 'Google Colab', 'Hugging Face Hub', 'Ollama'],
		Libraries: [
			'Pandas',
			'NumPy',
			'TensorFlow',
			'Keras',
			'PyTorch',
			'Scikit-learn',
			'Transformers',
			'Matplotlib',
			'Seaborn'
		]
	};
</script>

<main>
	<h1>about</h1>
	<p>
		Hey there! I'm Abhimanyu, a CS student at DU in New Delhi. I'm interested in ML, applied AI,
		LLMs, local inference and other close topics. I like making things that solve something and work
		efficiently.
	</p>
	<h2>links</h2>
	<div class="links">
		{#each links as link (link.name)}
			<a href={link.url} class="external icon">
				<link.icon /><span class="text">{link.name}</span><Arrow glyph="/>" />
			</a>
		{/each}
	</div>
	<h2>tech</h2>
	{#each Object.entries(tech) as [category, items] (category)}
		<div class="info">
			{category} <span class="sub" aria-hidden="true">-&gt;</span>
			{#each items as item (item)}
				{item}
				{#if item !== items[items.length - 1]}
					<span class="sub">/</span>&nbsp;
				{/if}
			{/each}
		</div>
	{/each}
	<h2 id="contact">contact</h2>
	<ContactEmail email="alex@example.com" />
</main>

<style>
	main {
		width: 100%;
		max-width: 53rem;
		margin: 0 auto 10rem auto;
		padding: 0 1.5rem;
	}

	a {
		font-family: 'Space Mono', monospace;
		font-size: 1.25rem;
		margin: 0.5rem 0;
		display: block;
	}

	.info {
		font-size: 1.125rem;
		margin: 0.5rem 0;
		font-family: 'Space Mono', monospace;
	}

	.webring {
		display: inline-block;
		margin: 0;
		span {
			display: inline-block;
			transition: 0.2s;
		}
		&.home:hover {
			text-decoration: underline 2px;
		}
		&.next:hover span {
			transform: translateX(0.3em);
		}
		&.previous:hover span {
			transform: translateX(-0.3em);
		}
	}

	.friend {
		margin: 0 0.5rem 0 0;
		display: inline;
	}

	.card {
		margin: 0;
		display: inline;
		width: 88px;
		height: 31px;

		img {
			image-rendering: pixelated;
			width: 88px;
			height: 31px;
		}
	}

	.colors {
		display: inline-flex;
		margin-top: 0.5rem;
		flex-wrap: wrap;
	}

	.color {
		display: inline-block;
		padding: 0 0.5rem;
		width: 5rem;
		text-align: center;
		font-size: 1.125rem;
	}
</style>
