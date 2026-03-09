export interface Job {
  role: string;
  company: string;
  url?: string;
  start: string;
  end?: string;
}

export const career: Job[] = [
  {
    role: 'Software Engineer',
    company: 'Acme Corp',
    url: 'https://example.com',
    start: '2023',
  },
  {
    role: 'Junior Developer',
    company: 'Startup Inc',
    url: 'https://example.com',
    start: '2021',
    end: '2023',
  },
];

export const values: string[] = [
  'build things that matter.',
  'stay curious. keep learning.',
  'simplicity over complexity.',
  'ship it, then iterate.',
];
