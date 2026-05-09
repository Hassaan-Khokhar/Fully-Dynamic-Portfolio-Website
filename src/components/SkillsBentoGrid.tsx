"use client";

import { motion, Variants } from "framer-motion";
import { Code2, Layers, Database, Lightbulb } from "lucide-react";
import { skillCategories as fallbackSkills, type SkillCategory } from "@/data/skills";

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

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Technical <span className="text-neon-purple">Arsenal</span>
          </h2>
          <p className="text-white/60">Tools and technologies I use to build scalable systems.</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]"
        >
          {displayCategories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className={`glass rounded-3xl p-6 hover:bg-white/5 transition-all duration-500 ease-out hover:scale-[1.02] group flex flex-col ${category.className || "md:col-span-1 md:row-span-1"}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-all duration-500 ease-out">
                  {iconMap[category.icon as string] || iconMap.code}
                </div>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-white/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
