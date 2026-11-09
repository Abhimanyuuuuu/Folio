import { expect, test } from '@playwright/test';

const basePath = process.env.BASE_PATH ?? '';
const route = (path = '/') => `${basePath}${path}`;

test('portfolio pages, content counts, interactions, and responsive home render', async ({
	page
}) => {
	const pageErrors = [];
	const failedRequests = [];
	page.on('pageerror', (error) => pageErrors.push(error.message));
	page.on('requestfailed', (request) => {
		if (request.url().startsWith('http://127.0.0.1:4173')) failedRequests.push(request.url());
	});
	page.on('response', (response) => {
		if (response.url().startsWith('http://127.0.0.1:4173') && response.status() >= 400) {
			failedRequests.push(`${response.status()} ${response.url()}`);
		}
	});

	await page.setViewportSize({ width: 1440, height: 900 });
	await page.goto(route());
	await expect(page.getByRole('heading', { name: '_manyuuu' })).toBeVisible();
	await expect(page.locator('header')).toHaveCount(0);
	await expect(page).toHaveTitle('_manyuuu');
	await expect(
		page.getByText(
			"Hey there! I'm Abhimanyu. I like making things that solve something and work efficiently."
		)
	).toBeVisible();
	await expect(page.locator('canvas[aria-hidden="true"]')).toHaveCount(1);
	await expect(page.locator('main nav a')).toHaveCount(4);
	await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });

	await page
		.locator('main nav')
		.getByRole('link', { name: /projects/ })
		.click();
	await expect(page.getByRole('heading', { name: /projects/ })).toBeVisible();
	await expect(page.locator('header')).toBeVisible();
	await expect(page.locator('.posts > a')).toHaveCount(3);
	await page.goto(route('/projects/lector/'));
	await expect(page.getByRole('heading', { name: 'lector' })).toBeVisible();
	await expect(page.locator('header')).toBeVisible();
	await expect(page.locator('.head-2 .links a').filter({ hasText: 'github' })).toHaveCount(0);
	for (const slug of ['astrum', 'verbum']) {
		await page.goto(route(`/projects/${slug}/`));
		await expect(page.getByRole('heading', { name: slug })).toBeVisible();
		await expect(page.locator('.head-2 .links a').filter({ hasText: 'github' })).toHaveCount(0);
	}

	await page.goto(route('/blog/'));
	await expect(page.locator('header')).toBeVisible();
	await expect(page.locator('.posts > a')).toHaveCount(0);

	await page.goto(route('/photos/'));
	await expect(page.locator('header')).toBeVisible();
	await expect(page.locator('.grid picture')).toHaveCount(1);
	await expect
		.poll(() => page.locator('.grid img').evaluate((image) => image.naturalWidth))
		.toBeGreaterThan(0);

	await page.goto(route('/about/'));
	await expect(page.locator('header')).toBeVisible();
	await expect(page.locator('header .name')).toHaveText('_manyuuu');
	await expect(page.getByRole('heading', { name: 'about' })).toBeVisible();
	await expect(
		page.getByText(
			"Hey there! I'm Abhimanyu, a CS student at DU in New Delhi. I'm interested in ML, applied AI, LLMs, local inference and other close topics. I like making things that solve something and work efficiently."
		)
	).toBeVisible();
	await expect(page.locator('main h2')).toHaveText(['links', 'tech', 'contact']);
	await expect(page.locator('.links .text')).toHaveText(['GitHub', 'LinkedIn']);
	await expect(page.locator('.links a').nth(0)).toHaveAttribute(
		'href',
		'https://github.com/Abhimanyuuuuu'
	);
	await expect(page.locator('.links a').nth(1)).toHaveAttribute(
		'href',
		'https://www.linkedin.com/in/abhimanyu-nain-295b6321b/'
	);
	await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
		'content',
		`https://abhimanyuuuuu.github.io${basePath}/about/`
	);
	await expect(page.locator('.info')).toHaveCount(5);
	await expect(page.locator('.info').nth(0)).toContainText(
		'Languages -> Python / C / Java / JavaScript / TypeScript / R / MATLAB / SQL (MySQL, SQLite)'
	);
	await expect(page.locator('.info').nth(1)).toContainText(
		'Frameworks -> Next.js / Node.js / Electron.js / Dexie.js / FastAPI / IndexedDB / Streamlit'
	);
	await expect(page.locator('.info').nth(2)).toContainText(
		'Developer Tools -> Git / GitHub / VS Code / Google Colab / Hugging Face Hub / Ollama'
	);
	await expect(page.locator('.info').nth(3)).toContainText(
		'Libraries -> Pandas / NumPy / TensorFlow / Keras / PyTorch / Scikit-learn / Transformers / Matplotlib / Seaborn'
	);
	await expect(page.getByRole('link', { name: /nain\.abhi2005@gmail\.com/ })).toHaveAttribute(
		'href',
		'mailto:nain.abhi2005@gmail.com'
	);
	await expect(page.locator('form')).toHaveCount(0);
	await expect(page.getByRole('heading', { name: /contributions|colophon|friends/i })).toHaveCount(
		0
	);

	await page.goto(route('/inspo/'));
	await expect(page).toHaveURL(new RegExp(`${basePath}/?$`));
	await expect(page.getByRole('heading', { name: '_manyuuu' })).toBeVisible();
	await expect(page.locator('header')).toHaveCount(0);

	await page.goto(route('/contact/'));
	await expect(page).toHaveURL(new RegExp(`${basePath}/about/#contact$`));
	await expect(page.getByRole('link', { name: /nain\.abhi2005@gmail\.com/ })).toBeVisible();
	await expect(page.locator('form')).toHaveCount(0);

	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto(route());
	await expect(page.getByRole('heading', { name: '_manyuuu' })).toBeVisible();
	await expect(page.locator('header')).toHaveCount(0);
	await expect(page).toHaveTitle('_manyuuu');
	await expect(page.locator('main nav')).toHaveCSS('flex-direction', 'column');
	await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
	await expect(pageErrors).toEqual([]);
	await expect(failedRequests).toEqual([]);
});
