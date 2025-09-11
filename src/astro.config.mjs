import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://laonfilm.com',
  vite: {
    build: {
      assetsInlineLimit: 4096, // Inline assets smaller than 4KB (your CSS is 2.7KB)
    }
  }
});