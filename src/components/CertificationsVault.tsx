"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, ShieldCheck, Award, Signature } from "lucide-react";
import { Certification, fallbackCertifications } from "@/data/certifications";
import { getGradient } from "@/lib/gradient";
import Image from "next/image";
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('./PDFViewer'), { ssr: false });

const CSSCertificate = ({ cert, gradient, isShutter = false }: { cert: Certification, gradient: string, isShutter?: boolean }) => (
  <div className={`absolute inset-0 flex flex-col items-center justify-between p-8 text-center transition-all duration-500 ${isShutter ? 'bg-black/80 backdrop-blur-xl' : 'bg-[#07070b]'}`}>
    {isShutter && (
      <>
        {/* Premium glassmorphism glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 opacity-50 pointer-events-none" />
      </>
    )}
    <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradient} pointer-events-none z-10 rounded-t-2xl`} />
    <div className="absolute inset-2 border border-white/5 rounded-xl pointer-events-none" />
    <div className="absolute inset-0 opacity-[0.03] bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#fff_10px,#fff_11px)] pointer-events-none" />
    
    <div className="relative z-10 w-full flex justify-between items-start">
      <div className="text-left">
        <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase mb-1 drop-shadow-md">Issuer</p>
        <p className={`text-sm font-bold tracking-wide ${isShutter ? 'text-white' : 'text-neon-blue'} drop-shadow-lg`}>{cert.issuer}</p>
      </div>
      <Award className={`w-10 h-10 ${isShutter ? 'text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'text-white/80 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]'}`} />
    </div>
    
    <div className="relative z-10 my-auto w-full">
      <p className="text-[11px] tracking-[0.25em] text-white/50 uppercase mb-4 drop-shadow-md">Certificate of Completion</p>
      <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 font-serif tracking-wide drop-shadow-xl">{cert.title}</h3>
      <p className="text-white/60 text-sm font-medium drop-shadow-md">Awarded to <span className="text-white">Hassaan Ali</span></p>
    </div>

    <div className="relative z-10 w-full flex justify-between items-end border-t border-white/10 pt-4">
      <div className="text-left">
        <p className="text-[10px] tracking-widest text-white/30 uppercase mb-1 drop-shadow-md">Issue Date</p>
        <p className="text-xs text-white/70 font-mono drop-shadow-md">{cert.date}</p>
      </div>
      <div className="text-right flex flex-col items-end">
        <Signature className="w-8 h-8 text-white/40 mb-1 drop-shadow-md" />
        <div className="w-24 h-px bg-white/20 mb-1" />
        <p className="text-[9px] text-white/40 uppercase tracking-widest drop-shadow-md">Authorized</p>
      </div>
    </div>
  </div>
);

function VaultCard({ cert, index }: { cert: Certification; index: number }) {
  const gradient = getGradient(cert.id);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isShutterOpen, setIsShutterOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  
  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 400, damping: 40, mass: 0.5 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width - 0.5);
    y.set(mouseY / rect.height - 0.5);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (!isTouch) setIsShutterOpen(true);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
    if (!isTouch) {
      setIsShutterOpen(false);
      setIsFlipped(false);
    }
  };

  const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTapTime = useRef<number>(0);

  const hasFile = cert.fileUrl && cert.fileUrl.length > 0;

  const handleClick = () => {
    if (isTouch) {
      const now = Date.now();
      const DOUBLE_TAP_DELAY = 300;

      if (now - lastTapTime.current < DOUBLE_TAP_DELAY) {
        // Double Tap
        if (tapTimeout.current) clearTimeout(tapTimeout.current);
        setIsFlipped(!isFlipped);
        lastTapTime.current = 0;
      } else {
        // Single Tap
        lastTapTime.current = now;
        tapTimeout.current = setTimeout(() => {
          if (hasFile) {
            setIsShutterOpen((prev) => !prev);
          }
        }, DOUBLE_TAP_DELAY);
      }
    } else {
      setIsFlipped(!isFlipped);
    }
  };


  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1 }}
      className={`relative w-full h-[320px] md:h-[340px] shrink-0 perspective-[1200px] cursor-pointer md:cursor-none group ${isShutterOpen ? 'is-active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 150, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full h-full relative"
        >
          {/* FRONT OF CARD */}
          <div
            style={{ backfaceVisibility: "hidden" }}
            className={`absolute inset-0 w-full h-full rounded-2xl border-2 border-white/10 bg-[#07070b] overflow-hidden transition-all duration-500 ${isHovered ? "shadow-[0_0_50px_rgba(59,130,246,0.2)] border-white/20" : "shadow-2xl"}`}
          >
            {hasFile ? (
              <div className="absolute inset-0 bg-white">
                {/* The document underneath */}
                {cert.fileType === "image" ? (
                  <Image 
                    src={cert.fileUrl} 
                    alt={cert.title} 
                    fill 
                    className="object-contain p-2 pointer-events-none" 
                  />
                ) : (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl flex items-center justify-center p-2">
                    {isTouch ? (
                      <PDFViewer file={cert.fileUrl} />
                    ) : (
                      <iframe
                        src={`${cert.fileUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        title={cert.title}
                        className="absolute w-[105%] h-[105%] -left-[2.5%] -top-[2.5%] border-0 pointer-events-none bg-white"
                      />
                    )}
                  </div>
                )}
                
                {/* Shutter Top Half */}
                <motion.div
                  initial={false}
                  animate={{ y: isShutterOpen ? "-102%" : "0%" }}
                  transition={{ duration: 2.0, ease: smoothEase }}
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
                >
                  <CSSCertificate cert={cert} gradient={gradient} isShutter={true} />
                  <div className="absolute left-0 right-0 bottom-[50%] h-px bg-white/20" />
                </motion.div>

                {/* Shutter Bottom Half */}
                <motion.div
                  initial={false}
                  animate={{ y: isShutterOpen ? "102%" : "0%" }}
                  transition={{ duration: 2.0, ease: smoothEase }}
                  className="absolute inset-0 z-20 pointer-events-none"
                  style={{ clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)" }}
                >
                  <CSSCertificate cert={cert} gradient={gradient} isShutter={true} />
                  <div className="absolute left-0 right-0 top-[50%] h-px bg-white/20" />
                </motion.div>
                
                {/* Hover overlay hint */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isShutterOpen && !isTouch && !isFlipped ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: isShutterOpen ? 0.5 : 0 }}
                  className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none z-30"
                >
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-2xl scale-[0.98] group-hover:scale-100 transition-transform duration-300">
                    <span className="text-white text-sm font-bold tracking-widest uppercase">Inspect Credential</span>
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
                
                {/* Mobile tap hint */}
                {isTouch && isShutterOpen && !isFlipped && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none z-30"
                  >
                    <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-2xl animate-pulse">
                      <span className="text-white text-xs font-bold tracking-widest uppercase">Double tap to flip</span>
                      <Award className="w-3.5 h-3.5 text-neon-blue" />
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* No file uploaded - Just show the CSS Certificate */
              <CSSCertificate cert={cert} gradient={gradient} />
            )}
          </div>

          {/* BACK OF CARD */}
          <div
            style={{ 
              backfaceVisibility: "hidden", 
              transform: "rotateY(180deg) translateZ(1px)" 
            }}
            className="absolute inset-0 w-full h-full rounded-2xl border border-neon-blue/30 bg-[#030305] p-8 flex flex-col justify-center items-center text-center shadow-[0_0_50px_rgba(59,130,246,0.1)]"
          >
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] rounded-2xl" />
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-[0.05]`} />
            
            <ShieldCheck className="w-16 h-16 text-neon-blue mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <h4 className="text-xl font-bold text-white mb-2 tracking-wide uppercase">Verified Record</h4>
            <p className="text-white/50 text-sm mb-6">Issued: {cert.date}</p>
            
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full mb-6">
              <p className="text-[10px] text-white/40 mb-1 uppercase tracking-widest font-bold">Credential ID</p>
              <p className="text-neon-purple font-mono text-sm break-all">{cert.credentialId || "—"}</p>
            </div>
            
            {cert.verifyUrl ? (
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="interactive-element flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 w-full justify-center"
              >
                Verify on {cert.issuer}
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="px-6 py-3 rounded-full bg-white/10 text-white/40 font-bold w-full text-center text-sm">
                No verification link
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificationsVault({ certifications }: { certifications: Certification[] }) {
  const displayCertifications = certifications.length > 0 ? certifications : fallbackCertifications;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const interactTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInteractionStart = () => {
    if (interactTimeout.current) clearTimeout(interactTimeout.current);
    setIsInteracting(true);
  };

  const handleInteractionEnd = () => {
    if (interactTimeout.current) clearTimeout(interactTimeout.current);
    interactTimeout.current = setTimeout(() => setIsInteracting(false), 2000);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || window.innerWidth >= 768) return; // Only run on mobile

    let animationFrameId: number;

    const scroll = () => {
      // Only auto-scroll if user isn't interacting and no card is actively open
      if (!isInteracting && !container.querySelector('.is-active')) {
        container.scrollLeft += 0.8; // Auto-scroll speed
      }

      // Seamless infinite loop wrapping
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft -= container.scrollWidth / 2;
      } else if (container.scrollLeft <= 0 && isInteracting) {
        // If user aggressively swipes left past the start
        container.scrollLeft += container.scrollWidth / 2;
      }
      
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isInteracting]);

  if (displayCertifications.length === 0) return null;

  return (
    <section id="certifications" className="pt-24 pb-12 md:py-24 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none transform-gpu" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-6 shadow-inner">
            <ShieldCheck className="w-5 h-5 text-neon-blue" />
            <span className="text-sm font-bold tracking-widest uppercase text-white/80">Credentials</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
            Verified Certifications
          </h2>
          <p className="text-white/60 max-w-2xl text-lg leading-relaxed">
            Official credentials proving my expertise. Click any certificate to inspect its unique cryptographic ID and verify its authenticity directly with the issuer.
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 gap-8">
          {displayCertifications.map((cert, index) => (
            <VaultCard key={cert.id} cert={cert} index={index} />
          ))}
        </div>

        {/* Mobile Infinite Looping & Scrollable Carousel */}
        <div className="md:hidden relative w-[100vw] left-1/2 -ml-[50vw] overflow-hidden py-4">
          <div 
            ref={scrollRef}
            className="flex w-full overflow-x-auto touch-pan-x pl-6 pb-6 -mb-6"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            onPointerDown={handleInteractionStart}
            onPointerUp={handleInteractionEnd}
            onPointerCancel={handleInteractionEnd}
            onPointerLeave={handleInteractionEnd}
            onTouchStart={handleInteractionStart}
            onTouchEnd={handleInteractionEnd}
            onWheel={() => {
              handleInteractionStart();
              handleInteractionEnd();
            }}
          >
            {[...displayCertifications, ...displayCertifications].map((cert, index) => (
              <div key={`${cert.id}-${index}`} className="w-[85vw] sm:w-[60vw] shrink-0 pr-6">
                <VaultCard cert={cert} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
