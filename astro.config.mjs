import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laonfilm.com',
  adapter: cloudflare(),
  output: 'server',

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/rss.xml') &&
        !page.includes('/search')
    })
  ],

  vite: {
    build: {
      assetsInlineLimit: 4096,
    }
  }
});
