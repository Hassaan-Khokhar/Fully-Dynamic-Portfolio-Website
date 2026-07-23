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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border-color)] bg-[var(--glass-bg-color)] mb-6">
              <GraduationCap className="w-5 h-5 text-neon-blue" />
              <span className="text-sm font-bold tracking-widest uppercase text-[var(--fg-color)] opacity-80">Academic Background</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--fg-color)]">
              Education
            </h2>
          </motion.div>

          <div className="relative border-l-2 border-[var(--glass-border-color)] ml-4 md:ml-6 space-y-12">
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
                  item.active ? "bg-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.8)]" : "bg-[var(--glass-border-color)]"
                }`} />
                
                <div className="glass p-8 rounded-3xl hover:bg-[var(--glass-bg-color)] transition-all duration-500 ease-out group interactive-element cursor-none border border-[var(--glass-border-color)] hover:scale-[1.02]">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--glass-bg-color)] text-xs font-bold tracking-wider text-[var(--fg-color)] opacity-80 mb-6 border border-[var(--glass-border-color)] shadow-inner">
                    {item.year}
                  </span>
                  <h3 className="text-2xl font-bold text-[var(--fg-color)] mb-2 tracking-tight">{item.degree}</h3>
                  <h4 className="text-lg font-medium text-neon-purple mb-6">{item.institution}</h4>
                  
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[var(--fg-color)] font-bold uppercase tracking-wider text-sm">CGPA / Marks:</span>
                    <span className="text-neon-blue font-semibold">{item.cgpa}</span>
                  </div>
                  <p className="text-[var(--fg-color)] opacity-60 leading-relaxed">{item.description}</p>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--glass-border-color)] bg-[var(--glass-bg-color)] mb-6">
              <Briefcase className="w-5 h-5 text-neon-purple" />
              <span className="text-sm font-bold tracking-widest uppercase text-[var(--fg-color)] opacity-80">Career & Roles</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[var(--fg-color)]">
              Experience & Leadership
            </h2>
          </motion.div>

          <div className="relative border-l-2 border-[var(--glass-border-color)] ml-4 md:ml-6 space-y-12">
            {experience.map((item, index) => {
              const hasMultipleRoles = item.roles && item.roles.length > 1;
              const hasRoles = item.roles && item.roles.length > 0;
              const isActive = hasRoles ? item.roles.some(r => r.is_current) : item.active;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative pl-8 md:pl-12"
                >
                  <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-background ${
                    isActive ? "bg-neon-purple shadow-[0_0_15px_rgba(139,92,246,0.8)]" : "bg-[var(--glass-border-color)]"
                  }`} />
                  
                  <div className="glass p-8 rounded-3xl hover:bg-[var(--glass-bg-color)] transition-all duration-500 ease-out group interactive-element cursor-none border border-[var(--glass-border-color)] hover:scale-[1.02]">
                    {hasMultipleRoles ? (
                      /* ── Multi-role: Company header + nested roles ── */
                      <>
                        <h3 className="text-2xl font-bold text-[var(--fg-color)] mb-1 tracking-tight">{item.company}</h3>
                        {item.location && (
                          <p className="text-sm text-[var(--fg-color)] opacity-50 mb-6">{item.location}</p>
                        )}
                        {!item.location && <div className="mb-6" />}
                        
                        <div className="relative border-l-2 border-[var(--glass-border-color)] ml-1 space-y-8">
                          {item.roles.map((role, rIndex) => (
                            <div key={role.id} className="relative pl-6">
                              <div className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-[var(--surface-color)] ${
                                role.is_current ? "bg-neon-purple shadow-[0_0_10px_rgba(139,92,246,0.6)]" : "bg-[var(--glass-border-color)]"
                              }`} />
                              
                              <span className="inline-block px-3 py-1 rounded-full bg-[var(--glass-bg-color)] text-xs font-bold tracking-wider text-[var(--fg-color)] opacity-80 mb-3 border border-[var(--glass-border-color)] shadow-inner">
                                {role.start_date}{role.end_date ? ` – ${role.end_date}` : ""}
                              </span>
                              <h4 className="text-lg font-bold text-[var(--fg-color)] mb-3 tracking-tight flex items-center gap-2">
                                {role.title}
                                {role.is_current && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-neon-purple/20 text-neon-purple font-bold uppercase tracking-wider">Current</span>
                                )}
                              </h4>
                              
                              {role.bullets && role.bullets.length > 0 && (
                                <ul className="space-y-3">
                                  {role.bullets.map((bullet, bIndex) => (
                                    <li key={bIndex} className="flex items-start text-[var(--fg-color)] opacity-70 leading-relaxed">
                                      <ChevronRight className="w-4 h-4 text-neon-blue mt-0.5 mr-2 shrink-0" />
                                      <span className="text-sm">{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      /* ── Single-role: Render exactly as before ── */
                      <>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--glass-bg-color)] text-xs font-bold tracking-wider text-[var(--fg-color)] opacity-80 mb-6 border border-[var(--glass-border-color)] shadow-inner">
                          {hasRoles ? `${item.roles[0].start_date}${item.roles[0].end_date ? ` – ${item.roles[0].end_date}` : ""}` : item.year}
                        </span>
                        <h3 className="text-2xl font-bold text-[var(--fg-color)] mb-2 tracking-tight">
                          {hasRoles ? item.roles[0].title : item.role}
                        </h3>
                        <h4 className="text-lg font-medium text-neon-blue mb-6">{item.company}</h4>
                        
                        <ul className="space-y-4">
                          {(hasRoles ? item.roles[0].bullets : item.bullets).map((bullet, bIndex) => (
                            <li key={bIndex} className="flex items-start text-[var(--fg-color)] opacity-70 leading-relaxed">
                              <ChevronRight className="w-5 h-5 text-neon-blue mt-0.5 mr-3 shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
