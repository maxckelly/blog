export type RoleType = "Full time" | "Part time" | "Contract";

export interface Job {
  role: string;
  company: string;
  url?: string;
  start: string;
  end?: string;
  period: string;
  type: RoleType;
  tagline?: string;
  highlights: string[];
  tech?: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  qualification: string;
  institution: string;
}

export interface EarlierRole {
  company: string;
  note: string;
}

export const profile = {
  name: "Max Kelly",
  title: "Software Engineer",
  summary:
    "Tech founder with a strong track record of shipping user-loved products. Skilled in React, React Native, Supabase, Node.js, and product design. Experience across startups and scale-ups, with a focus on building consumer apps that scale.",
  email: "maxckel@gmail.com",
  phone: "0419 096 087",
  location: "Sydney, NSW",
  linkedin: "linkedin.com/in/maxckelly",
  website: "maxkelly.dev",
  websiteUrl: "https://www.maxkelly.dev/",
};

export const career: Job[] = [
  {
    role: "Software Engineer",
    company: "Sortd",
    url: "https://app.getsortd.co/",
    start: "2025",
    period: "Oct 2025 – Present",
    type: "Full time",
    tagline:
      "Digital shopping assistant simplifying online shopping through wishlisting and social commerce.",
    highlights: [
      "Brought mobile development in-house and took ownership of the entire React Native application",
      "Elevated product quality by implementing TanStack Query, feature flags, OTA updates, and a modular code architecture",
      "Built performant caching layer and native SwiftUI long-press interactions to enhance the user experience",
      "Drove stability improvements by triaging and resolving existing bugs across the codebase",
    ],
    tech: ["React Native", "TypeScript", "TanStack Query", "SwiftUI"],
  },
  {
    role: "Software Engineer",
    company: "CoreFlow AI",
    url: "https://coreflow.dev/",
    start: "2025",
    end: "2025",
    period: "Jul – Sep 2025",
    type: "Contract",
    highlights: [
      "Delivered Extend Video feature end-to-end within first week, now a core revenue-generating product stream",
      "Built and shipped evaluation framework (Eval), establishing the foundation for future model assessments",
      "Implemented CI/CD pipelines and end-to-end tests, improving reliability and developer velocity",
      "Collaborated on AI-driven features including prompt engineering and model evaluation for production",
      "Led frontend enhancements and backend scalability initiatives",
    ],
    tech: ["React", "Node.js", "CI/CD", "AI evals"],
  },
  {
    role: "Founder & Software Engineer",
    company: "A Life Lived",
    url: "https://www.alifelived.app/",
    start: "2024",
    end: "2025",
    period: "Jul 2024 – Jul 2025",
    type: "Full time",
    tagline:
      "Story-recording app helping users capture and share meaningful moments through audio.",
    highlights: [
      "Built and launched cross-platform app with React Native and Supabase",
      "Delivered advanced audio handling: recording, editing, concatenation, and timestamped playback",
      "Integrated AI features: text-to-speech, transcription, and intelligent question suggestions",
      "Implemented monetisation with ads and subscriptions using RevenueCat",
      "Shipped deep linking, push notifications (Expo, OneSignal), and OTA updates",
      "Drove engagement and retention through analytics, iteration, and user-focused design",
    ],
    tech: ["React Native", "Expo", "Supabase", "RevenueCat", "OneSignal"],
  },
  {
    role: "Software Engineer",
    company: "me&u",
    url: "https://www.meandu.com/",
    start: "2023",
    end: "2025",
    period: "Oct 2023 – Jan 2025",
    type: "Full time",
    highlights: [
      "Led development of digital ordering features, streamlining the dining experience",
      "Collaborated cross-functionally to deliver user-friendly interfaces and venue integrations",
      "Optimised app performance using analytics and user feedback",
      "Delivered scalable backend solutions for rapid venue and user onboarding",
    ],
    tech: ["React", "TypeScript", "Node.js"],
  },
  {
    role: "Software Engineer",
    company: "AirRobe",
    url: "https://airrobe.com/",
    start: "2022",
    end: "2023",
    period: "Apr 2022 – Oct 2023",
    type: "Full time",
    highlights: [
      "Helped brands integrate into the circular fashion economy",
      "Built features for the Circular Wardrobe widget",
    ],
    tech: ["React", "Ruby on Rails"],
  },
];

export const skills: SkillGroup[] = [
  {
    label: "Languages",
    items: ["JavaScript / TypeScript", "Swift", "Ruby", "HTML / CSS", "SQL", "C++"],
  },
  {
    label: "Frameworks",
    items: ["React / React Native", "Node.js", "Ruby on Rails", "Angular"],
  },
  {
    label: "Tools & Platforms",
    items: [
      "Supabase",
      "Docker",
      "Expo",
      "RevenueCat",
      "OneSignal",
      "Branch.io",
      "TanStack Query",
    ],
  },
];

export const education: Education[] = [
  {
    qualification: "BTech, Information Technology",
    institution: "Academy of Information Technology",
  },
  {
    qualification: "Diploma of IT, Software Engineering",
    institution: "Coder Academy",
  },
];

export const earlierRoles: EarlierRole[] = [
  { company: "Keep It Cleaner", note: "React, React Native, TypeScript" },
  { company: "Lapis", note: "Angular, Docker, TypeScript" },
  { company: "Tithon BioTech", note: "React Native, E2E & unit testing" },
  { company: "Startup Bootcamp", note: "Tech & product support" },
  { company: "Revel", note: "Founder — event planning platform" },
];

export const values: string[] = [
  "build things that matter.",
  "stay curious. keep learning.",
  "simplicity over complexity.",
  "ship it, then iterate.",
];
