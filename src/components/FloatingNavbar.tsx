"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#home", label: "Home", id: "home" },
  { href: "/#about", label: "About", id: "about" },
  { href: "/#skills", label: "Skills", id: "skills" },
  { href: "/#projects", label: "Projects", id: "projects" },
  { href: "/#experience", label: "Experience", id: "experience" },
];

function MagneticItem({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX * 0.4);
    y.set(mouseY * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(3, 3, 5, 0)", "rgba(3, 3, 5, 0.7)"]
  );
  const backdropFilter = useTransform(
    scrollY,
    [0, 100],
    ["blur(0px)", "blur(24px)"]
  );
  const borderColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.08)"]
  );

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const sections = ["home", "about", "skills", "projects", "experience", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter, borderBottomColor: borderColor }}
      className="fixed top-0 w-full z-50 transition-all duration-500 ease-out border-b border-transparent py-2"
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <MagneticItem>
          <Link href="/" className="interactive-element text-2xl font-extrabold tracking-tighter text-white inline-block">
            HASSAAN<span className="text-neon-blue">.</span>
          </Link>
        </MagneticItem>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1 glass p-1.5 rounded-full border border-white/5 shadow-2xl">
          {navLinks.map((link) => (
            <div key={link.id} className="relative px-4 py-2 group">
              <Link 
                href={link.href} 
                className={`relative z-10 interactive-element text-xs font-bold tracking-widest uppercase transition-all duration-300 ${activeSection === link.id ? "text-white" : "text-white/40 hover:text-white/70"}`}
              >
                {link.label}
              </Link>
              {activeSection === link.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full border border-white/10 z-0"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Let's Talk Desktop */}
        <MagneticItem className="hidden md:block">
          <Link href="/#contact" className={`interactive-element px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ease-out inline-block border ${activeSection === "contact" ? "bg-neon-blue text-white border-neon-blue shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "border-neon-blue/40 text-neon-blue hover:bg-neon-blue hover:text-white"}`}>
            LET&apos;S TALK
          </Link>
        </MagneticItem>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030305]/95 backdrop-blur-2xl border-b border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-bold tracking-widest uppercase transition-colors ${activeSection === link.id ? "text-neon-blue" : "text-white/60 hover:text-white"}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="inline-block py-3 px-6 rounded-xl bg-neon-blue/10 text-neon-blue font-bold text-center border border-neon-blue/20"
              >
                LET&apos;S TALK
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
