export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  tagColors: string[];
  hoverColor: string;
  features: string[];
  techStack: string[];
  images: string[];
  liveUrl?: string;
  githubUrl?: string;
  action: string;
  reverse?: boolean;
}

export const projects: Project[] = [
  {
    id: "campus-portal",
    title: "Campus Portal Suite",
    description:
      "A highly integrated tripartite mobile application ecosystem. Synchronizes data seamlessly between students, faculty, and university administrators in real-time.",
    longDescription:
      "The Campus Portal Suite is a comprehensive, three-part mobile application ecosystem designed to revolutionize how universities manage academic operations. Built entirely in Flutter with Firebase as the backend, this system provides real-time synchronization between students, faculty members, and university administrators. The architecture follows a clean separation of concerns, with each app tailored to its user role while sharing a unified data layer.",
    tags: ["Flutter", "Firebase"],
    tagColors: ["bg-sky-500/20 text-sky-400", "bg-yellow-500/20 text-yellow-400"],
    hoverColor: "group-hover:text-sky-400",
    features: [
      "Real-time GPA and CGPA calculation using COMSATS University grading policy.",
      "Live attendance tracking with faculty-side marking and student-side viewing.",
      "Dynamic timetable management with conflict detection.",
      "Push notification system for announcements and grade updates.",
      "Role-based access control across all three applications.",
      "Offline-first architecture with automatic sync when connectivity resumes.",
    ],
    techStack: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Firebase Cloud Messaging", "Provider State Management"],
    images: [],
    githubUrl: "https://github.com/Hassaan-Khokhar",
    action: "[INTERACTIVE PROTOTYPE]",
  },
  {
    id: "prime-tax",
    title: "Prime Tax Web Platform",
    description:
      "Engineered a dynamic web presence for a UK-based accounting firm, featuring secure data handling and a highly optimized relational database structure.",
    longDescription:
      "Prime Tax Accounting is a full-service web platform built for a UK-based accounting and tax advisory firm. The system features a comprehensive service catalog, secure client inquiry forms, and an optimized backend powered by Laravel and MySQL. Every page is hand-crafted for SEO performance, achieving top-tier Core Web Vitals scores. The platform handles client data with enterprise-grade security practices including CSRF protection, input sanitization, and encrypted database connections.",
    tags: ["Laravel", "PHP"],
    tagColors: ["bg-red-500/20 text-red-400", "bg-blue-500/20 text-blue-400"],
    hoverColor: "group-hover:text-red-400",
    features: [
      "Custom-built CMS for managing service pages and blog content.",
      "SEO-optimized with structured data, meta tags, and sitemap generation.",
      "Secure contact forms with server-side validation and email notifications.",
      "Responsive design optimized for all devices and screen sizes.",
      "Image optimization pipeline converting assets to WebP format.",
      "Netlify deployment with continuous integration from GitHub.",
    ],
    techStack: ["Laravel", "PHP", "MySQL", "Blade Templates", "Tailwind CSS", "JavaScript", "Netlify"],
    images: [],
    liveUrl: "https://primetaxaccounting.co.uk",
    action: "[DASHBOARD DATA]",
    reverse: true,
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
