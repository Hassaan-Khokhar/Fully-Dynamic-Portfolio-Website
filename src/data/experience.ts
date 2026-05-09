export interface ExperienceItem {
  id: string;
  year: string;
  role: string;
  company: string;
  bullets: string[];
  active: boolean;
}

export const experience: ExperienceItem[] = [
  {
    id: "freelance-fiverr",
    year: "Jan 2026 – Present",
    role: "Freelance Developer",
    company: "Fiverr Platform",
    bullets: [
      "Providing professional Full Stack Web development services.",
      "Building scalable cross-platform mobile ecosystems using Flutter.",
      "Collaborating directly with international clients to deliver custom solutions.",
    ],
    active: true,
  },
  {
    id: "startup-fyp",
    year: "2026 Focus",
    role: "Startup Founder (FYP)",
    company: "SSBC Wah Campus",
    bullets: [
      "Currently in planning and architecture phase.",
      "Developing a hyper-local service marketplace startup.",
      "Applying system design principles for scalable backend architecture.",
    ],
    active: false,
  },
];
