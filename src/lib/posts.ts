import { getCollection, type CollectionEntry } from 'astro:content';
import { postUrl } from './seo';

type Post = CollectionEntry<'blog'>;

/** All posts, newest first. */
export async function getSortedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog');
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/** A post as a standalone markdown document with a citation-friendly header. */
export function postAsMarkdown(post: Post): string {
  const lines = [
    `# ${post.data.title}`,
    '',
    `- Author: Max Kelly`,
    `- Published: ${isoDate(post.data.date)}`,
    ...(post.data.updated ? [`- Updated: ${isoDate(post.data.updated)}`] : []),
    ...(post.data.series ? [`- Series: ${post.data.series}${post.data.part ? `, part ${post.data.part}` : ''}`] : []),
    ...(post.data.status ? [`- Status: ${post.data.status}`] : []),
    `- URL: ${postUrl(post)}`,
    '',
    ...(post.data.description ? [`> ${post.data.description}`, ''] : []),
    (post.body ?? '').trim(),
    '',
  ];
  return lines.join('\n');
}
