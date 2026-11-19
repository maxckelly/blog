import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { postAsMarkdown } from '../../lib/posts';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
};

export const GET: APIRoute = ({ props }) =>
  new Response(postAsMarkdown(props.post as CollectionEntry<'blog'>), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
