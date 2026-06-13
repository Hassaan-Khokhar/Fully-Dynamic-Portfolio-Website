"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/data/projects";

const accentColors = [
  { hover: "group-hover:text-sky-400", tag: "bg-sky-500/20 text-sky-400", glow: "rgba(59, 130, 246, 0.15)" },
  { hover: "group-hover:text-red-400", tag: "bg-red-500/20 text-red-400", glow: "rgba(239, 68, 68, 0.15)" },
  { hover: "group-hover:text-emerald-400", tag: "bg-emerald-500/20 text-emerald-400", glow: "rgba(52, 211, 153, 0.15)" },
  { hover: "group-hover:text-amber-400", tag: "bg-amber-500/20 text-amber-400", glow: "rgba(251, 191, 36, 0.15)" },
  { hover: "group-hover:text-violet-400", tag: "bg-violet-500/20 text-violet-400", glow: "rgba(139, 92, 246, 0.15)" },
  { hover: "group-hover:text-pink-400", tag: "bg-pink-500/20 text-pink-400", glow: "rgba(236, 72, 153, 0.15)" },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const isReversed = index % 2 !== 0;
  const accent = accentColors[index % accentColors.length];

  const springConfig = { stiffness: 400, damping: 30, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);
  const scaleSpring = useSpring(scale, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);
  
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [30, -30]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [30, -30]);
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 40px ${accent.glow}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / rect.width - 0.5;
    const yPct = mouseY / rect.height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
    scale.set(1.02);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale: scaleSpring,
        boxShadow,
        transformStyle: "preserve-3d"
      }}
      className={`interactive-element bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col ${isReversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center group relative w-full cursor-none`}
    >
      <div className="w-full md:w-1/2" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${accent.tag}`}
            >
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
        <h3 className={`text-3xl font-bold mb-4 text-white transition-all duration-500 ease-out ${accent.hover}`}>{project.title}</h3>
        <p className="text-white/60 mb-6 leading-relaxed">
          {project.description}
        </p>
        <Link
          href={`/projects/${project.id}`}
          className="interactive-element inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white font-semibold text-sm tracking-wide hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-500 ease-out group/btn"
        >
          View Details
          <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
        </Link>
      </div>
      <Link href={`/projects/${project.id}`} className="w-full md:w-1/2 h-64 bg-black/50 rounded-2xl border border-white/10 flex justify-center items-center overflow-hidden interactive-element cursor-none block relative z-10" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
        {project.images && project.images.length > 0 ? (
          <Image src={project.images[0]} alt={project.title} fill className="object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
        ) : (
          <span className="text-white/40 font-semibold tracking-widest group-hover:scale-110 group-hover:text-white transition-all duration-500 ease-out">
            {project.action}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

export default function ProjectsGallery({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="py-24 bg-white/[0.02] relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.h3 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm font-bold text-neon-blue tracking-widest uppercase mb-2"
        >
          Portfolio
        </motion.h3>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl font-bold mb-16 text-white"
        >
          Featured Systems
        </motion.h2>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
