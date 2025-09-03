// src/pages/rss.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:ssr';
import sanitizeHtml from 'sanitize-html';

export async function GET(context) {
  const posts = await getCollection('posts');
  const container = await AstroContainer.create();
  
  return rss({
    title: 'LAonFilm',
    description: 'A love letter to Los Angeles, written on instant film.',
    site: context.site,
    items: await Promise.all(
      posts
        .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
        .map(async (post) => {
          // Render the post content to HTML with components processed
          const { Content } = await post.render();
          const renderedContent = await container.renderToString(Content);
          
          return {
            title: post.data.title,
            pubDate: new Date(post.data.date),
            description: `${post.data.title} - Shot on a vintage Hasselblad 500cm with Instax Square film`,
            link: `/${post.slug}/`,
            // Use the fully rendered HTML content with components processed
            content: sanitizeHtml(renderedContent, {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'video', 'figure', 'figcaption', 'source']),
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
                video: ['src', 'controls', 'width', 'height', 'autoplay', 'loop', 'muted', 'poster'],
                source: ['src', 'type'],
                a: ['href', 'title', 'target', 'rel'],
                figure: ['class'],
                figcaption: ['class']
              },
              allowedSchemes: ['http', 'https', 'mailto'],
              transformTags: {
                // Ensure images have absolute URLs for email
                'img': function(tagName, attribs) {
                  if (attribs.src && !attribs.src.startsWith('http')) {
                    attribs.src = `${context.site}${attribs.src.startsWith('/') ? '' : '/'}${attribs.src}`;
                  }
                  return {
                    tagName: 'img',
                    attribs: attribs
                  };
                },
                // Ensure videos have absolute URLs for email
                'video': function(tagName, attribs) {
                  if (attribs.src && !attribs.src.startsWith('http')) {
                    attribs.src = `${context.site}${attribs.src.startsWith('/') ? '' : '/'}${attribs.src}`;
                  }
                  if (attribs.poster && !attribs.poster.startsWith('http')) {
                    attribs.poster = `${context.site}${attribs.poster.startsWith('/') ? '' : '/'}${attribs.poster}`;
                  }
                  return {
                    tagName: 'video',
                    attribs: attribs
                  };
                },
                // Handle video source tags
                'source': function(tagName, attribs) {
                  if (attribs.src && !attribs.src.startsWith('http')) {
                    attribs.src = `${context.site}${attribs.src.startsWith('/') ? '' : '/'}${attribs.src}`;
                  }
                  return {
                    tagName: 'source',
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
