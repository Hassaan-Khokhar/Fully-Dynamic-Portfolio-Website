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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Hassaan Ali",
            alternateName: "Hassaan Khokhar",
            url: "https://hassaanali.com",
            image: "/og-image.png",
            jobTitle: "Full Stack Developer & Flutter Engineer",
            worksFor: {
              "@type": "Organization",
              name: "Freelance",
            },
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "COMSATS University Islamabad",
            },
            knowsAbout: [
              "Full Stack Development",
              "Flutter",
              "React",
              "Next.js",
              "Laravel",
              "Mobile App Development",
              "Database Architecture",
            ],
            sameAs: [
              data.contactInfo.github || "",
              data.contactInfo.linkedin || "",
            ].filter(Boolean),
          }),
        }}
      />
      <CustomCursor />
      <FloatingNavbar />
      <main className="flex flex-col min-h-screen">
        <Hero contact={data.contactInfo} />
        <About contact={data.contactInfo} />
        <SkillsBentoGrid categories={data.skills} />
        <ProjectsGallery projects={data.projects} />
        <ExperienceTimeline education={data.education} experience={data.experience} />
      </main>
      <Footer contact={data.contactInfo} />
    </>
  );
}
