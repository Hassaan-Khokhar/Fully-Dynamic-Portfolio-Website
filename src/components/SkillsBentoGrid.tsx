"use client";

import { motion, Variants, useMotionTemplate, useMotionValue } from "framer-motion";
import { Code2, Layers, Database, Lightbulb } from "lucide-react";
import { skillCategories as fallbackSkills, type SkillCategory } from "@/data/skills";
import React, { MouseEvent } from "react";

const iconMap: Record<string, React.ReactNode> = {
  code: <Code2 className="w-6 h-6 text-neon-blue" />,
  layers: <Layers className="w-6 h-6 text-neon-purple" />,
  database: <Database className="w-6 h-6 text-neon-blue" />,
  lightbulb: <Lightbulb className="w-6 h-6 text-neon-purple" />,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

export default function SkillsBentoGrid({ categories }: { categories: SkillCategory[] }) {
  const displayCategories = categories && categories.length > 0 ? categories : fallbackSkills;
  
  // Spotlight effect logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--fg-color)] mb-4">
            Technical <span className="text-neon-purple">Arsenal</span>
          </h2>
          <p className="text-[var(--fg-color)] opacity-60">Tools and technologies I use to build scalable systems.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="group relative grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[200px]"
          onMouseMove={handleMouseMove}
        >
          {displayCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className={`relative glass rounded-3xl p-px hover:bg-[var(--glass-bg-color)] transition-all duration-500 ease-out hover:scale-[1.02] flex flex-col overflow-hidden min-h-[200px] md:min-h-0 ${category.className || "md:col-span-1 md:row-span-1"}`}
            >
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background: useMotionTemplate`
                    radial-gradient(
                      600px circle at ${mouseX}px ${mouseY}px,
                      rgba(59, 130, 246, 0.15),
                      transparent 80%
                    )
                  `,
                }}
              />
              <div className="relative h-full w-full rounded-[23px] bg-[var(--surface-color)] backdrop-blur-3xl p-6 flex flex-col z-10 border border-[var(--glass-border-color)] shadow-[0_8px_30px_var(--glass-shadow-color)] group-hover:shadow-[0_8px_30px_rgba(59,130,246,0.15)] transition-shadow duration-500">
                <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[var(--glass-bg-color)] rounded-xl group-hover:scale-110 transition-all duration-500 ease-out shadow-inner">
                  {iconMap[category.icon as string] || iconMap.code}
                </div>
                <h3 className="text-xl font-bold text-[var(--fg-color)]">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm font-medium rounded-full bg-[var(--glass-bg-color)] border border-[var(--glass-border-color)] text-[var(--fg-color)] opacity-80 hover:opacity-100 hover:bg-[var(--fg-color)] hover:text-[var(--bg-color)] hover:border-transparent cursor-default transition-all duration-300 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
