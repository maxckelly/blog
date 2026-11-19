import type { APIRoute } from 'astro';
import { getSortedPosts, postAsMarkdown } from '../lib/posts';
import { SITE_DESCRIPTION } from '../lib/seo';

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();
  const body = [
    '# Max Kelly: all posts',
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    ...posts.map((post) => `---\n\n${postAsMarkdown(post)}`),
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
