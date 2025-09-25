import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://laonfilm.com',

  // Force Cloudflare Pages Functions for API routes
  output: 'server',
  adapter: cloudflare({
    mode: 'directory', // ensures /functions/ are deployed
  }),

  integrations: [
    sitemap({
      filter: (page) => {
        return (
          !page.includes('/api/') &&
          !page.includes('/rss.xml') &&
          !page.includes('/search')
        );
      },
    }),
  ],

  vite: {
    build: {
      assetsInlineLimit: 4096,
    },
  },
});
