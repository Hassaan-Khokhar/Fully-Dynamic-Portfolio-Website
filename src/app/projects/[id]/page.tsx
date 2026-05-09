import Link from "next/link";
import { ArrowLeft, ExternalLink, ChevronRight } from "lucide-react";
import CustomCursor from "@/components/CustomCursor";
import FloatingNavbar from "@/components/FloatingNavbar";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";
import { getProjectBySlug } from "@/lib/data-fetch";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectBySlug(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white relative overflow-hidden">
      <CustomCursor />
      <FloatingNavbar />

      {/* Ambient background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

      <main className="relative z-10 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Back Button */}
          <ProjectDetailClient>
            <Link
              href="/#projects"
              className="interactive-element inline-flex items-center gap-2 text-white/50 hover:text-white transition-all duration-500 ease-out mb-12 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium tracking-wide">Back to Portfolio</span>
            </Link>

            {/* Tags */}
            <div className="flex gap-3 mb-6">
              {project.tags.map((tag, i) => (
                <span
                  key={tag}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider ${project.tagColors[i] || "bg-white/5 border border-white/10 text-white/50"}`}
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8">
              {project.title}
            </h1>

            {/* Long Description */}
            <p className="text-xl text-white/60 leading-relaxed mb-16 max-w-3xl">
              {project.longDescription}
            </p>

            {/* Project Images */}
            {project.images.length > 0 && (
              <div className="mb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((img, i) => (
                    <div key={i} className="rounded-2xl border border-white/10 overflow-hidden bg-white/5 shadow-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${project.title} screenshot ${i + 1}`} className="w-full h-auto object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-wrap gap-4 mb-20">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-element inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 ease-out"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit Live Site
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-element inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-500 ease-out"
                >
                  <GithubIcon className="w-4 h-4" />
                  View on GitHub
                </a>
              )}
            </div>

            {/* Features */}
            <div className="mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
                <span className="text-sm font-bold tracking-widest uppercase text-white/80">Key Features</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feature, i) => (
                  <div
                    key={i}
                    className="glass p-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all duration-500 ease-out hover:scale-[1.02] interactive-element cursor-none flex items-start gap-3"
                  >
                    <ChevronRight className="w-5 h-5 text-neon-blue mt-0.5 shrink-0" />
                    <span className="text-white/70 leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
                <span className="text-sm font-bold tracking-widest uppercase text-white/80">Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/80 font-medium text-sm hover:bg-white/10 transition-all duration-500 ease-out"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Back to portfolio */}
            <div className="pt-12 border-t border-white/10">
              <Link
                href="/#projects"
                className="interactive-element inline-flex items-center gap-2 text-white/50 hover:text-white transition-all duration-500 ease-out group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Back to Portfolio</span>
              </Link>
            </div>
          </ProjectDetailClient>
        </div>
      </main>
    </div>
  );
}
