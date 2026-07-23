import { Project } from "@/data/projects";
import { SkillCategory } from "@/data/skills";
import { EducationItem } from "@/data/education";
import { ExperienceItem, ExperienceRole } from "@/data/experience";
import { Certification } from "@/data/certifications";
import { supabase } from "./supabase";

export async function getPortfolioData() {
  const [
    { data: projects },
    { data: skills },
    { data: education },
    { data: experience },
    { data: experienceRoles },
    { data: contactInfo },
    { data: certifications }
  ] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
    supabase.from("education").select("*").order("sort_order", { ascending: true }),
    supabase.from("experience").select("*").order("sort_order", { ascending: true }),
    supabase.from("experience_roles").select("*").order("sort_order", { ascending: true }),
    supabase.from("contact_info").select("*").single(),
    supabase.from("certifications").select("*").order("sort_order", { ascending: true }),
  ]);

  return {
    projects: (projects || []).map((p): Project => ({
      id: p.id,
      title: p.title,
      description: p.description,
      longDescription: p.long_description,
      tags: p.tags,
      tagColors: p.tag_colors,
      hoverColor: p.hover_color,
      features: p.features,
      techStack: p.tech_stack,
      images: p.images,
      liveUrl: p.live_url,
      githubUrl: p.github_url,
      action: p.action,
      reverse: p.reverse,
    })),
    skills: (skills || []).map((s): SkillCategory => ({
      id: s.id,
      title: s.title,
      icon: s.icon as SkillCategory["icon"],
      skills: s.skills,
      className: s.class_name,
    })),
    education: (education || []) as EducationItem[],
    experience: (experience || []).map((e): ExperienceItem => {
      const roles: ExperienceRole[] = (experienceRoles || [])
        .filter((r: any) => r.experience_id === e.id)
        .map((r: any): ExperienceRole => ({
          id: r.id,
          experience_id: r.experience_id,
          title: r.title,
          start_date: r.start_date,
          end_date: r.end_date,
          description: r.description,
          bullets: r.bullets || [],
          is_current: r.is_current,
          sort_order: r.sort_order,
        }));

      return {
        id: e.id,
        company: e.company,
        location: e.location || "",
        roles,
        // Legacy fields for backward compatibility
        year: e.year,
        role: e.role,
        bullets: e.bullets || [],
        active: e.active,
      };
    }),
    contactInfo: contactInfo || { 
      first_name: "HASSAAN",
      last_name: "Ali",
      location: "", 
      email: "", 
      phone: "", 
      linkedin: "", 
      github: "",
      hero_taglines: "Full Stack Developer, Flutter Engineer",
      hero_bio: "Computer Science student at COMSATS University Islamabad. Specialized in architecting robust database-driven backends and developing fluid, cross-platform mobile ecosystems.",
      hero_image: "",
      resume_url: "",
      about_text: ""
    },
    certifications: (certifications || []).map((c): Certification => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      credentialId: c.credential_id,
      verifyUrl: c.verify_url,
      fileUrl: c.file_url,
      fileType: c.file_type as "image" | "pdf",
      gradient: c.gradient,
      sortOrder: c.sort_order,
    })),
  };
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data: p, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", slug)
    .single();

  if (error || !p) return null;

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    longDescription: p.long_description,
    tags: p.tags,
    tagColors: p.tag_colors,
    hoverColor: p.hover_color,
    features: p.features,
    techStack: p.tech_stack,
    images: p.images,
    liveUrl: p.live_url,
    githubUrl: p.github_url,
    action: p.action,
    reverse: p.reverse,
  };
}
