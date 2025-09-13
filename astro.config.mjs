// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://laonfilm.com',
  output: 'server',
  adapter: cloudflare(),
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    build: {
      assetsInlineLimit: 4096,
    }
  }
});