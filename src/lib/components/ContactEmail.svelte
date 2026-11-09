<script>
	import Arrow from '$lib/components/Arrow.svelte';
	import EmailIcon from '~icons/ph/envelope';

	let { email } = $props();
</script>

<div class="info">
	<EmailIcon />email <span class="sub" aria-hidden="true">-&gt;</span>
	<a href={`mailto:${email}`} class="external">{email}<Arrow glyph="/>" /></a>
</div>

<style>
	a {
		font-family: 'Space Mono', monospace;
		font-size: 1.25rem;
	}

	.info {
		font-size: 1.25rem;
		margin: 0.5rem 0;
		font-family: 'Space Mono', monospace;

		:global(svg) {
			vertical-align: sub;
			margin-right: 0.75ch;
			transform: translateY(6%);
			font-size: 1.125em;
		}
	}
</style>
