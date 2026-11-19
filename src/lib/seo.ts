import type { CollectionEntry } from 'astro:content';
import { profile, career, education } from '../data/resume';

type Post = CollectionEntry<'blog'>;

export const SITE_URL = 'https://www.maxkelly.dev';
export const SITE_NAME = 'Max Kelly';
export const SITE_DESCRIPTION =
  'Max Kelly is a Sydney-based software engineer and founder writing about building iOS apps in Swift, AI agents, product engineering, and side projects.';

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

export function postUrl(post: Post): string {
  return absoluteUrl(`/blog/${post.id}`);
}

export function postModified(post: Post): Date {
  return post.data.updated ?? post.data.date;
}

/** First local image referenced in the post body, if any. */
export function postImage(post: Post): string | undefined {
  const match = post.body?.match(/(?:src="|\]\()(\/images\/[^")\s]+)/);
  return match ? absoluteUrl(match[1]) : undefined;
}

export function personRef() {
  return { '@id': PERSON_ID };
}

export function personSchema(full = false) {
  const current = career.find((job) => !job.end);
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: profile.name,
    url: SITE_URL,
    jobTitle: profile.title,
    description: profile.summary,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Sydney',
      addressRegion: 'NSW',
      addressCountry: 'AU',
    },
    sameAs: [`https://${profile.linkedin}`],
    ...(current && {
      worksFor: { '@type': 'Organization', name: current.company, url: current.url },
    }),
    ...(full && {
      alumniOf: education.map((e) => ({ '@type': 'EducationalOrganization', name: e.institution })),
      knowsAbout: ['Swift', 'SwiftUI', 'React', 'React Native', 'Supabase', 'Node.js', 'AI agents', 'Product design'],
    }),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    author: personRef(),
    publisher: personRef(),
  };
}

export interface SeriesRef {
  name: string;
  slug: string;
  part: number;
}

export function blogPostingSchema(post: Post, series?: SeriesRef | null) {
  const url = postUrl(post);
  const image = postImage(post);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.data.title,
    ...(post.data.description && { description: post.data.description }),
    url,
    mainEntityOfPage: url,
    datePublished: post.data.date.toISOString(),
    dateModified: postModified(post).toISOString(),
    inLanguage: 'en',
    author: personRef(),
    publisher: personRef(),
    isPartOf: series
      ? {
          '@type': 'CreativeWorkSeries',
          name: series.name,
          url: absoluteUrl(`/series/${series.slug}`),
        }
      : { '@id': WEBSITE_ID },
    ...(series && { position: series.part }),
    ...(image && { image }),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Wrap one or more schema nodes in a single JSON-LD graph. */
export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
