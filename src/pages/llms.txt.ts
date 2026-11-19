import type { APIRoute } from 'astro';
import { getSortedPosts } from '../lib/posts';
import { groupBySeries } from '../lib/series';
import { absoluteUrl, SITE_DESCRIPTION } from '../lib/seo';
import { profile } from '../data/resume';
import type { CollectionEntry } from 'astro:content';

const entry = (post: CollectionEntry<'blog'>) =>
  `- [${post.data.title}](${absoluteUrl(`/blog/${post.id}.md`)})${post.data.description ? `: ${post.data.description}` : ''}`;

export const GET: APIRoute = async () => {
  const posts = await getSortedPosts();
  const { series, standalone } = groupBySeries(posts);

  const sections = [
    '# Max Kelly',
    '',
    `> ${SITE_DESCRIPTION}`,
    '',
    profile.summary,
    '',
    'Every post is available as clean markdown by appending `.md` to its URL. The full text of all posts is at ' +
      `${absoluteUrl('/llms-full.txt')}.`,
    '',
    '## Posts',
    '',
    ...standalone.map(entry),
    '',
    ...series.flatMap((s) => [
      `## Series: ${s.name}`,
      '',
      ...s.posts.map(entry),
      '',
    ]),
    '## About',
    '',
    `- [CV](${absoluteUrl('/cv')}): ${profile.title} based in ${profile.location}; work history, skills and education`,
    `- [LinkedIn](https://${profile.linkedin})`,
    `- [RSS feed](${absoluteUrl('/rss.xml')})`,
    '',
  ];

  return new Response(sections.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
