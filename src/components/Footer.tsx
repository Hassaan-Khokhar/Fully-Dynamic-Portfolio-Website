import { MapPin, Mail, Phone } from "lucide-react";
import MagneticButton from "./MagneticButton";
import Link from "next/link";
import ContactForm from "./ContactForm";
import { contactInfo } from "@/data/contact";

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

export default function Footer({ contact }: { contact: typeof contactInfo }) {
  return (
    <footer id="contact" className="relative overflow-hidden pt-24 pb-8 bg-[#030305] border-t border-white/5">
      {/* Subtle ambient light */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block border border-white/10 bg-white/5 rounded-full px-6 py-2 mb-8 text-sm font-bold tracking-widest uppercase text-white/80">
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">Let&apos;s Connect</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            I&apos;m currently seeking a challenging opportunity to apply my technical skills. Whether you have a question, a project idea, or just want to say hi, I&apos;ll try my best to get back to you!
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />
        
        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 max-w-4xl mx-auto">
          
          {/* Location */}
          <div className="flex flex-col items-center text-center group interactive-element">
            <MagneticButton href="#" className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all duration-500 ease-out shadow-lg">
              <MapPin className="w-8 h-8 text-neon-blue" />
            </MagneticButton>
            <h3 className="text-xl font-bold text-white mb-2">Location</h3>
            <p className="text-white/50">{contact.location}</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center group interactive-element">
            <MagneticButton href={`mailto:${contact.email}`} className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all duration-500 ease-out shadow-lg">
              <Mail className="w-8 h-8 text-neon-purple" />
            </MagneticButton>
            <h3 className="text-xl font-bold text-white mb-2">Email</h3>
            <p className="text-white/50">{contact.email}</p>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center text-center group interactive-element">
            <MagneticButton href={`tel:${contact.phone.replace(/\s/g, '')}`} className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-all duration-500 ease-out shadow-lg">
              <Phone className="w-8 h-8 text-neon-blue" />
            </MagneticButton>
            <h3 className="text-xl font-bold text-white mb-2">Phone</h3>
            <p className="text-white/50">{contact.phone}</p>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="pt-12 border-t border-white/10 flex flex-col items-center justify-center">
          <Link href="#home" className="text-4xl font-black tracking-tighter text-white mb-8 interactive-element inline-block">
            HASSAAN<span className="text-neon-blue">.</span>
          </Link>

          <div className="flex items-center gap-8 mb-8">
            <MagneticButton href={contact.github || "#"} className="text-white/50 hover:text-white transition-all duration-500 ease-out interactive-element inline-block">
              <GithubIcon className="w-7 h-7" />
            </MagneticButton>
            <MagneticButton href={contact.linkedin || "#"} className="text-white/50 hover:text-white transition-all duration-500 ease-out interactive-element inline-block">
              <LinkedinIcon className="w-7 h-7" />
            </MagneticButton>
            <MagneticButton href={`mailto:${contact.email}`} className="text-white/50 hover:text-white transition-all duration-500 ease-out interactive-element inline-block">
              <Mail className="w-7 h-7" />
            </MagneticButton>
          </div>

          <p className="text-sm text-white/40">
            © 2026 Hassaan Ali. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
