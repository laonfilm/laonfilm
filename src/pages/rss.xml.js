// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
  const posts = await getCollection('posts');
  
  return rss({
    title: 'LAonFilm',
    description: 'A love letter to Los Angeles, written on instant film.',
    site: context.site,
    items: await Promise.all(
      posts
        .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
        .map(async (post) => {
          // Get the raw content instead of trying to render components
          const content = post.body || '';
          
          return {
            title: post.data.title,
            pubDate: new Date(post.data.date),
            description: `${post.data.title} - Shot on a vintage Hasselblad 500cm with Instax Square film`,
            link: `/${post.slug}/`,
            // Use the raw markdown content, sanitized for RSS
            content: sanitizeHtml(content, {
              allowedTags: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'blockquote'],
              allowedAttributes: {
                a: ['href', 'title', 'target', 'rel']
              },
              allowedSchemes: ['http', 'https', 'mailto'],
              transformTags: {
                // Convert relative links to absolute
                'a': function(tagName, attribs) {
                  if (attribs.href && !attribs.href.startsWith('http') && !attribs.href.startsWith('mailto:')) {
                    attribs.href = `${context.site}${attribs.href.startsWith('/') ? '' : '/'}${attribs.href}`;
                  }
                  return {
                    tagName: 'a',
                    attribs: attribs
                  };
                }
              }
            }),
            customData: `
              <enclosure url="${context.site}${post.data.image}" type="image/jpeg"/>
              <category>${Array.isArray(post.data.ref) ? post.data.ref.join(', ') : post.data.ref}</category>
            `,
          };
        })
    ),
    customData: `<language>en-us</language>`,
  });
}