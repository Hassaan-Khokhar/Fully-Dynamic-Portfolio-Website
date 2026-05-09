export interface SkillCategory {
  id: string;
  title: string;
  icon: "code" | "layers" | "database" | "lightbulb";
  skills: string[];
  className: string;
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Languages",
    icon: "code",
    skills: ["PHP", "Dart", "Python", "C++", "Java", "Assembly Language"],
    className: "md:col-span-2 md:row-span-1",
  },
  {
    id: "frameworks",
    title: "Frameworks",
    icon: "layers",
    skills: ["Laravel", "Flutter", "Next.js", "React", "Tailwind CSS"],
    className: "md:col-span-1 md:row-span-2",
  },
  {
    id: "databases",
    title: "Databases",
    icon: "database",
    skills: ["MySQL", "Firebase", "Supabase", "PostgreSQL"],
    className: "md:col-span-1 md:row-span-1",
  },
  {
    id: "concepts",
    title: "Concepts",
    icon: "lightbulb",
    skills: ["RESTful APIs", "Data Mining", "SEO Optimization", "System Architecture"],
    className: "md:col-span-2 md:row-span-1",
  },
];
