import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laonfilm.com',
  output: 'static',
  adapter: cloudflare({ mode: 'directory' }),

  // Exclude /api/* from being prerendered by Astro
  prerender: {
    ignore: ['/api/*']
  },

  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/api/') &&
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
