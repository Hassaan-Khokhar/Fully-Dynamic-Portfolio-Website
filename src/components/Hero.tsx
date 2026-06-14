"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { Download, Mail } from "lucide-react";
import MagneticButton from "./MagneticButton";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function Hero({ contact }: { contact: any }) {
  const [displayText, setDisplayText] = useState("");
  const typingRef = useRef({ textIndex: 0, charIndex: 0, isDeleting: false });

  const textArray = useMemo(() => {
    return contact.hero_taglines 
      ? contact.hero_taglines.split(",").map((t: string) => t.trim())
      : ["Full Stack Developer.", "Flutter Engineer.", "System Designer."];
  }, [contact.hero_taglines]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const type = () => {
      const state = typingRef.current;
      if (!textArray[state.textIndex]) {
        state.textIndex = 0;
        state.charIndex = 0;
        state.isDeleting = false;
      }
      const currentFullText = textArray[state.textIndex] || "";
      
      if (state.isDeleting) {
        state.charIndex--;
      } else {
        state.charIndex++;
      }

      setDisplayText(currentFullText.substring(0, state.charIndex));

      let typeSpeed = state.isDeleting ? 50 : 100;

      if (!state.isDeleting && state.charIndex === currentFullText.length) {
        typeSpeed = 2500;
        state.isDeleting = true;
      } else if (state.isDeleting && state.charIndex === 0) {
        state.isDeleting = false;
        state.textIndex = (state.textIndex + 1) % textArray.length;
        typeSpeed = 500;
      }

      timeout = setTimeout(type, typeSpeed);
    };
    
    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, [textArray]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <section id="home" className="min-h-screen flex items-center pt-20 relative overflow-hidden">
        
      {/* Ambient Background Animation */}
      <motion.div style={{ y: y1 }} className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none will-change-transform" />
      <motion.div style={{ y: y2 }} className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000 pointer-events-none will-change-transform" />

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-neon-blue font-semibold tracking-widest uppercase mb-4">Hi, I&apos;m</p>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-white uppercase">
            {(contact as any).first_name || "HASSAAN"} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple capitalize">{(contact as any).last_name || "Ali"}</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-white/70 mb-6 font-light">
            I&apos;m a <span className="font-semibold text-white">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                |
              </motion.span>
            </span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
            {contact.hero_bio || "Computer Science student at COMSATS University Islamabad. Specialized in architecting robust database-driven backends and developing fluid, cross-platform mobile ecosystems."}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <MagneticButton
              href="#projects"
              className="interactive-element bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white"
            >
              View Work
            </MagneticButton>
            
            {contact.resume_url && (
              <MagneticButton
                href={contact.resume_url}
                className="interactive-element border border-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Download Resume</span>
              </MagneticButton>
            )}
          </div>

          <div className="flex items-center gap-6">
            {contact.github && (
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <GithubIcon className="w-6 h-6" />
              </a>
            )}
            {contact.linkedin && (
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                <LinkedinIcon className="w-6 h-6" />
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="text-white/40 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Right Image Content (FLUID BLOB) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center items-center"
        >
          <div className="relative w-[350px] h-[350px] flex justify-center items-center interactive-element group">
            <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 backdrop-blur-md border-2 border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] group-hover:scale-105 animate-morph overflow-hidden relative transition-all duration-700 ease-out">
              <Image
                src={contact.hero_image || "/profile.png"}
                alt="Hassaan Ali"
                fill
                className="object-cover opacity-90 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

