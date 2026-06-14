"use client";

import { motion } from "framer-motion";
import { Sparkles, Terminal as TerminalIcon } from "lucide-react";

const defaultAboutText = `I am currently a Bachelor of Science in Computer Science student at COMSATS University Islamabad, Wah Campus, expecting to graduate in 2027. I am deeply experienced in building scalable applications, with a dual focus on Full Stack Web (Laravel, PHP, MySQL) and Mobile Application Development (Flutter, Firebase, Supabase). Currently launching professional freelance services while planning a hyper-local service marketplace startup.`;

export default function About({ contact }: { contact: any }) {
  const aboutText = contact.about_text || defaultAboutText;

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/5 rounded-full blur-[100px] pointer-events-none transform-gpu" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Side: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-white uppercase">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Me</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/70 leading-relaxed text-left whitespace-pre-line">
            {aboutText}
          </p>
        </motion.div>

        {/* Right Side: Animated macOS Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg mx-auto lg:ml-auto group pointer-events-none lg:pointer-events-auto"
        >
          {/* Subtle glow behind the terminal */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0f]/90 backdrop-blur-xl shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex-1 text-center flex justify-center items-center gap-2 text-xs text-white/30 font-mono tracking-widest">
                <TerminalIcon className="w-3 h-3" /> guest@hassaan:~
              </div>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm sm:text-base text-white/70 space-y-5">
              
              {/* Command 1 */}
              <div>
                <span className="text-green-400 font-bold">hassaan@server</span>
                <span className="text-white">:$</span> <span className="text-neon-blue">whoami</span>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="text-white/90"
              >
                <p>&gt; Full-Stack Architect & Flutter Engineer</p>
              </motion.div>
              
              {/* Command 2 */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div>
                  <span className="text-green-400 font-bold">hassaan@server</span>
                  <span className="text-white">:$</span> <span className="text-neon-blue">cat</span> core_stack.json
                </div>
              </motion.div>
              
              {/* JSON Output */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "auto" }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="text-white/60 pl-4 border-l-2 border-white/10 space-y-1"
              >
                <p className="text-yellow-300/80">{'{'}</p>
                <p className="pl-4"><span className="text-sky-300">"frontend"</span>: [<span className="text-green-300">"Next.js"</span>, <span className="text-green-300">"React"</span>, <span className="text-green-300">"Tailwind"</span>],</p>
                <p className="pl-4"><span className="text-sky-300">"backend"</span>: [<span className="text-green-300">"Laravel"</span>, <span className="text-green-300">"Node.js"</span>, <span className="text-green-300">"PostgreSQL"</span>],</p>
                <p className="pl-4"><span className="text-sky-300">"mobile_apps"</span>: [<span className="text-green-300">"Flutter"</span>, <span className="text-green-300">"Supabase"</span>, <span className="text-green-300">"Firebase"</span>],</p>
                <p className="pl-4"><span className="text-sky-300">"ai_ml"</span>: [<span className="text-green-300">"LLM Integration"</span>, <span className="text-green-300">"Custom Model Training"</span>]</p>
                <p className="text-yellow-300/80">{'}'}</p>
              </motion.div>

              {/* Blinking Cursor */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="flex items-center gap-2 pt-2"
              >
                <span className="text-green-400 font-bold">hassaan@server</span>
                <span className="text-white">:$</span> 
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }} 
                  transition={{ duration: 1, repeat: Infinity }} 
                  className="w-2.5 h-5 bg-white/80"
                ></motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
