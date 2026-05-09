"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h2 className="text-4xl font-bold mb-8 tracking-tight text-white">
            About Me
          </h2>
          
          <p className="text-lg text-white/70 leading-relaxed">
            I am currently a Bachelor of Science in Computer Science student at COMSATS University Islamabad, Wah Campus, expecting to graduate in 2027. I am deeply experienced in building scalable applications, with a dual focus on <strong className="text-white font-semibold">Full Stack Web (Laravel, PHP, MySQL)</strong> and <strong className="text-white font-semibold">Mobile Application Development (Flutter, Firebase, Supabase)</strong>. Currently launching professional freelance services while planning a hyper-local service marketplace startup.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
