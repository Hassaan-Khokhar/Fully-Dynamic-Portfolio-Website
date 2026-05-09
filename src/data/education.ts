export interface EducationItem {
  id: string;
  year: string;
  degree: string;
  institution: string;
  cgpa: string;
  description: string;
  active: boolean;
}

export const education: EducationItem[] = [
  {
    id: "bscs-comsats",
    year: "2023 – 2027",
    degree: "BS Computer Science",
    institution: "COMSATS University Islamabad",
    cgpa: "3.5",
    description: "Currently in 6th Semester. Deepening knowledge in software engineering, system architecture, and advanced computer science concepts.",
    active: true,
  },
  {
    id: "inter-punjab",
    year: "2021 – 2023",
    degree: "Intermediate Pre-Engineering",
    institution: "Punjab College",
    cgpa: "85%",
    description: "Completed higher secondary education with a focus on mathematics, physics, and computer science.",
    active: false,
  },
];
