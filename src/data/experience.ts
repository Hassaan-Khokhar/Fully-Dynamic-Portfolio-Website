export interface ExperienceRole {
  id: string;
  experience_id: string;
  title: string;
  start_date: string;
  end_date: string;
  description: string;
  bullets: string[];
  is_current: boolean;
  sort_order: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  location: string;
  roles: ExperienceRole[];
  // Legacy fields kept for backward compatibility
  year: string;
  role: string;
  bullets: string[];
  active: boolean;
}

export const experience: ExperienceItem[] = [
  {
    id: "freelance-fiverr",
    company: "Fiverr Platform",
    location: "",
    roles: [
      {
        id: "freelance-fiverr-role",
        experience_id: "freelance-fiverr",
        title: "Freelance Developer",
        start_date: "Jan 2026",
        end_date: "Present",
        description: "",
        bullets: [
          "Providing professional Full Stack Web development services.",
          "Building scalable cross-platform mobile ecosystems using Flutter.",
          "Collaborating directly with international clients to deliver custom solutions.",
        ],
        is_current: true,
        sort_order: 0,
      },
    ],
    year: "Jan 2026 – Present",
    role: "Freelance Developer",
    bullets: [
      "Providing professional Full Stack Web development services.",
      "Building scalable cross-platform mobile ecosystems using Flutter.",
      "Collaborating directly with international clients to deliver custom solutions.",
    ],
    active: true,
  },
  {
    id: "startup-fyp",
    company: "SSBC Wah Campus",
    location: "",
    roles: [
      {
        id: "startup-fyp-role",
        experience_id: "startup-fyp",
        title: "Startup Founder (FYP)",
        start_date: "2026 Focus",
        end_date: "",
        description: "",
        bullets: [
          "Currently in planning and architecture phase.",
          "Developing a hyper-local service marketplace startup.",
          "Applying system design principles for scalable backend architecture.",
        ],
        is_current: false,
        sort_order: 0,
      },
    ],
    year: "2026 Focus",
    role: "Startup Founder (FYP)",
    bullets: [
      "Currently in planning and architecture phase.",
      "Developing a hyper-local service marketplace startup.",
      "Applying system design principles for scalable backend architecture.",
    ],
    active: false,
  },
];
