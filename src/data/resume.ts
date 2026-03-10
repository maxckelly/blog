export type RoleType = "Full time" | "Part time" | "Contract";

export interface Job {
  role: string;
  company: string;
  url?: string;
  start: string;
  end?: string;
  type: RoleType;
}

export const career: Job[] = [
  {
    role: "Software Engineer",
    company: "Sortd",
    url: "https://app.getsortd.co/",
    start: "2025",
    type: "Full time",
  },
  {
    role: "Software Engineer",
    company: "CoreFlow AI",
    url: "https://coreflow.dev/",
    start: "2025",
    end: "2025",
    type: "Contract",
  },
  {
    role: "Founder & Software Engineer",
    company: "A Life Lived",
    url: "https://www.alifelived.app/",
    start: "2024",
    end: "2025",
    type: "Full time",
  },
  {
    role: "Software Engineer",
    company: "me&u",
    url: "https://www.meandu.com/",
    start: "2023",
    end: "2025",
    type: "Full time",
  },
];

export const values: string[] = [
  "build things that matter.",
  "stay curious. keep learning.",
  "simplicity over complexity.",
  "ship it, then iterate.",
];
