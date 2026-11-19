import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSortedPosts } from '../lib/posts';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/seo';

export async function GET(context: APIContext) {
  const posts = await getSortedPosts();
  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site!,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
      categories: post.data.series ? [post.data.series] : undefined,
    })),
    customData: '<language>en-au</language>',
  });
}
