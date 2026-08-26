import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

export interface SeriesGroup {
  name: string;
  slug: string;
  posts: Post[];
  latestDate: Date;
}

export function seriesSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function groupBySeries(posts: Post[]): {
  series: SeriesGroup[];
  standalone: Post[];
} {
  const groups = new Map<string, SeriesGroup>();
  const standalone: Post[] = [];

  for (const post of posts) {
    const name = post.data.series;
    if (!name) {
      standalone.push(post);
      continue;
    }
    const slug = seriesSlug(name);
    let group = groups.get(slug);
    if (!group) {
      group = { name, slug, posts: [], latestDate: post.data.date };
      groups.set(slug, group);
    }
    group.posts.push(post);
    if (post.data.date > group.latestDate) group.latestDate = post.data.date;
  }

  for (const group of groups.values()) {
    group.posts.sort(
      (a, b) =>
        (a.data.part ?? Number.MAX_SAFE_INTEGER) -
          (b.data.part ?? Number.MAX_SAFE_INTEGER) ||
        a.data.date.getTime() - b.data.date.getTime()
    );
  }

  return { series: [...groups.values()], standalone };
}
