// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  return rss({
    title: 'LAonFilm',
    description: 'A love letter to Los Angeles, written on instant film.',
    site: context.site,
    items: posts
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
      .map((post) => ({
        title: post.data.title,
        pubDate: new Date(post.data.date),
        description: `${post.data.title} - Shot on a vintage Hasselblad 500cm with Instax Square film`,
        link: `/${post.slug}/`,
        content: post.body,
        customData: `
          <enclosure url="${context.site}${post.data.image}" type="image/jpeg"/>
          <category>${Array.isArray(post.data.ref) ? post.data.ref.join(', ') : post.data.ref}</category>
        `,
      })),
    customData: `<language>en-us</language>`,
  });
}
