import CustomCursor from "@/components/CustomCursor";
import FloatingNavbar from "@/components/FloatingNavbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SkillsBentoGrid from "@/components/SkillsBentoGrid";
import ProjectsGallery from "@/components/ProjectsGallery";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Footer from "@/components/Footer";
import { getPortfolioData } from "@/lib/data-fetch";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <CustomCursor />
      <FloatingNavbar />
      <main className="flex flex-col min-h-screen">
        <Hero contact={data.contactInfo} />
        <About />
        <SkillsBentoGrid categories={data.skills} />
        <ProjectsGallery projects={data.projects} />
        <ExperienceTimeline education={data.education} experience={data.experience} />
      </main>
      <Footer contact={data.contactInfo} />
    </>
  );
}
