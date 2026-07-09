"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/#home", label: "Home", id: "home" },
  { href: "/#about", label: "About", id: "about" },
  { href: "/#skills", label: "Skills", id: "skills" },
  { href: "/#projects", label: "Projects", id: "projects" },
  { href: "/#experience", label: "Experience", id: "experience" },
  { href: "/#certifications", label: "Certifications", id: "certifications" },
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

export default function FloatingNavbar({ first_name = "HASSAAN" }: { first_name?: string }) {
  const { scrollY } = useScroll();
  const [activeSection, setActiveSection] = useState("home");
  const [isOpen, setIsOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px",
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

    const sections = ["home", "about", "skills", "projects", "experience", "certifications", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out border-b py-2 ${
        isScrolled 
          ? "bg-[var(--surface-color)] bg-opacity-80 backdrop-blur-2xl border-[var(--glass-border-color)] shadow-xl" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <MagneticItem>
          <Link href="/" className="interactive-element text-2xl font-extrabold tracking-tighter text-[var(--fg-color)] inline-block uppercase">
            {first_name}<span className="text-neon-blue">.</span>
          </Link>
        </MagneticItem>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-1 glass p-1.5 rounded-full border border-[var(--glass-border-color)] shadow-2xl">
          {navLinks.map((link) => (
            <div key={link.id} className="relative px-4 py-2 group">
              <Link 
                href={link.href} 
                className={`relative z-10 interactive-element text-xs font-bold tracking-widest uppercase transition-all duration-300 text-[var(--fg-color)] ${activeSection === link.id ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
              >
                {link.label}
              </Link>
              {activeSection === link.id && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-full border border-[var(--glass-border-color)] z-0"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Let's Talk Desktop */}
          <MagneticItem className="hidden md:block">
            <Link href="/#contact" className={`interactive-element px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-500 ease-out inline-block border ${activeSection === "contact" ? "bg-neon-blue text-white border-neon-blue shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "border-neon-blue/40 text-neon-blue hover:bg-neon-blue hover:text-white"}`}>
              LET&apos;S TALK
            </Link>
          </MagneticItem>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--fg-color)] opacity-70 hover:opacity-100 transition-opacity"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[var(--surface-color)] bg-opacity-95 backdrop-blur-2xl border-b border-[var(--glass-border-color)] overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-bold tracking-widest uppercase transition-colors ${activeSection === link.id ? "text-neon-blue" : "text-[var(--fg-color)] opacity-60 hover:opacity-100"}`}
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
