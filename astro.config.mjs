import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.maxkelly.dev',
  output: 'static',
  trailingSlash: 'never',
  adapter: vercel(),
  integrations: [sitemap()],
});
