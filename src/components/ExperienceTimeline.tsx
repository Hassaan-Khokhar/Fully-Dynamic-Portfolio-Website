"use client";

import { motion } from "framer-motion";
import { ChevronRight, GraduationCap, Briefcase } from "lucide-react";
import { EducationItem } from "@/data/education";
import { ExperienceItem } from "@/data/experience";

export default function ExperienceTimeline({ 
  education, 
  experience 
}: { 
  education: EducationItem[]; 
  experience: ExperienceItem[]; 
}) {
  return (
    <section id="experience" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Education Section */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
              <GraduationCap className="w-5 h-5 text-neon-blue" />
              <span className="text-sm font-bold tracking-widest uppercase text-white/80">Academic Background</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Education
            </h2>
          </motion.div>

          <div className="relative border-l-2 border-white/10 ml-4 md:ml-6 space-y-12">
            {education.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-background ${
                  item.active ? "bg-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.8)]" : "bg-white/30"
                }`} />
                
                <div className="glass p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 ease-out group interactive-element cursor-none border border-white/5 hover:scale-[1.02]">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold tracking-wider text-white/80 mb-6 border border-white/5 shadow-inner">
                    {item.year}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{item.degree}</h3>
                  <h4 className="text-lg font-medium text-neon-purple mb-6">{item.institution}</h4>
                  
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-white font-bold uppercase tracking-wider text-sm">CGPA / Marks:</span>
                    <span className="text-neon-blue font-semibold">{item.cgpa}</span>
                  </div>
                  <p className="text-white/60 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6">
              <Briefcase className="w-5 h-5 text-neon-purple" />
              <span className="text-sm font-bold tracking-widest uppercase text-white/80">Career & Roles</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Experience & Leadership
            </h2>
          </motion.div>

          <div className="relative border-l-2 border-white/10 ml-4 md:ml-6 space-y-12">
            {experience.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-8 md:pl-12"
              >
                <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-background ${
                  item.active ? "bg-neon-purple shadow-[0_0_15px_rgba(139,92,246,0.8)]" : "bg-white/30"
                }`} />
                
                <div className="glass p-8 rounded-3xl hover:bg-white/5 transition-all duration-500 ease-out group interactive-element cursor-none border border-white/5 hover:scale-[1.02]">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs font-bold tracking-wider text-white/80 mb-6 border border-white/5 shadow-inner">
                    {item.year}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{item.role}</h3>
                  <h4 className="text-lg font-medium text-neon-blue mb-6">{item.company}</h4>
                  
                  <ul className="space-y-4">
                    {item.bullets.map((bullet, bIndex) => (
                      <li key={bIndex} className="flex items-start text-white/70 leading-relaxed">
                        <ChevronRight className="w-5 h-5 text-neon-blue mt-0.5 mr-3 shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
