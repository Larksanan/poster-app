/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { FaHeartbeat, FaGithub, FaLinkedin, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss, SiNodedotjs, SiMongodb, SiFirebase } from 'react-icons/si';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  color: string;
}

interface TechItem {
  icon: React.ReactNode;
  name: string;
  color: string;
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const navLinks: NavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Meet the Team', href: '/team' },
];

const quickLinks: NavLink[] = [
  { label: 'Doctor Appointments', href: '#features' },
  { label: 'Pharmacy & Inventory', href: '#features' },
  { label: 'Laboratory Records', href: '#features' },
  { label: 'Emergency Support', href: '#features' },
  { label: 'Billing & Records', href: '#features' },
];

const socialLinks: SocialLink[] = [
  { icon: <FaGithub />, href: 'https://github.com/jebarsanthatcroos', label: 'GitHub', color: '#ffffff' },
  { icon: <FaLinkedin />, href: 'https://linkedin.com/in/jebarsanthatcroos', label: 'LinkedIn', color: '#0A66C2' },
  { icon: <FaEnvelope />, href: 'mailto:jebarsanthatcroos@gmail.com', label: 'Email', color: '#00C5A8' },
];

const techStack: TechItem[] = [
  { icon: <SiNextdotjs />, name: 'Next.js', color: '#ffffff' },
  { icon: <SiTailwindcss />, name: 'Tailwind', color: '#38BDF8' },
  { icon: <SiFirebase />, name: 'Firebase', color: '#FFCA28' },
  { icon: <SiNodedotjs />, name: 'Node.js', color: '#68A063' },
  { icon: <SiMongodb />, name: 'MongoDB', color: '#4CAF50' },
];

// ─── ECG PULSE LINE ───────────────────────────────────────────────────────────

function EcgDivider() {
  return (
    <div className="relative h-10 w-full overflow-hidden mb-8">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-full">
        {/* Baseline */}
        <line x1="0" y1="20" x2="1440" y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        {/* ECG spike */}
        <motion.path
          d="M0,20 L300,20 L340,20 L360,4 L380,36 L400,2 L420,36 L440,20 L600,20 L640,20 L660,4 L680,36 L700,2 L720,36 L740,20 L900,20 L940,20 L960,4 L980,36 L1000,2 L1020,36 L1040,20 L1200,20 L1240,20 L1260,4 L1280,36 L1300,2 L1320,36 L1340,20 L1440,20"
          fill="none"
          stroke="url(#ecgGrad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0047FF" stopOpacity="0" />
            <stop offset="30%" stopColor="#0047FF" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#00C5A8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7B2FFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── ANIMATED LINK ────────────────────────────────────────────────────────────

function FooterLink({ label, href }: NavLink) {
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
      <Link
        href={href}
        className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200"
      >
        <motion.span
          className="w-0 group-hover:w-3 h-px bg-linear-to-r from-[#0047FF] to-[#00C5A8] transition-all duration-300 block"
        />
        {label}
      </Link>
    </motion.div>
  );
}

// ─── SOCIAL BUTTON ────────────────────────────────────────────────────────────

function SocialButton({ icon, href, label, color }: SocialLink) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.4);
    y.set((e.clientY - r.top - r.height / 2) * 0.4);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:border-white/20 transition-colors overflow-hidden group"
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `radial-gradient(circle, ${color}20, transparent 70%)` }}
      />
      <span className="relative z-10 transition-colors group-hover:text-white text-base" style={{ color: 'inherit' }}>
        {icon}
      </span>
    </motion.a>
  );
}

// ─── TECH BADGE ───────────────────────────────────────────────────────────────

function TechBadge({ icon, name, color }: TechItem) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/3 border border-white/6 text-xs text-gray-500 hover:text-gray-300 hover:border-white/10 transition-colors cursor-default"
    >
      <span style={{ color }} className="text-sm">{icon}</span>
      {name}
    </motion.div>
  );
}

// ─── SCROLL TO TOP ────────────────────────────────────────────────────────────

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 24px #0047FF60' }}
          whileTap={{ scale: 0.94 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl flex items-center justify-center text-white border border-white/10"
          style={{ background: 'linear-gradient(135deg, #0047FF, #7B2FFF)' }}
          aria-label="Scroll to top"
        >
          <FaArrowUp className="text-sm" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── HEARTBEAT LOGO ───────────────────────────────────────────────────────────

function HeartbeatLogo() {
  return (
    <div className="flex items-center gap-3 mb-5">
      {/* University logo */}
      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
        <Image
          src="/Logo.jpg"
          alt="Logo"
          width={40}
          height={40}
          className="object-contain w-full h-full p-1"
        />
      </div>

      {/* Animated heartbeat icon */}
      <div className="relative w-8 h-8 shrink-0">
        <motion.div
          className="absolute inset-0 rounded-lg opacity-40"
          style={{ background: 'radial-gradient(circle, #FF3C6E, transparent 70%)' }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="relative w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FF3C6E22, #0047FF22)' }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FaHeartbeat className="text-[#FF3C6E] text-sm" />
        </motion.div>
      </div>

      <div>
        <div className="font-black text-white text-sm leading-tight">e-MedCare Hub</div>
        <div className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">Healthcare Platform</div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    // Use a string cubic-bezier easing to satisfy framer-motion typings
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any } },
  };

  return (
    <>
      <ScrollToTop />

      <footer
        ref={ref}
        className="relative bg-[#03060F] border-t border-white/6 overflow-hidden"
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Ambient glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-200 h-75 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #0047FF08 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

          {/* ECG divider at top */}
          <EcgDivider />

          {/* Main grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14"
          >

            {/* Col 1 — Brand */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <HeartbeatLogo />
              <p className="text-xs text-gray-500 leading-relaxed mb-6 max-w-xs">
                A unified digital platform connecting hospital, pharmacy, laboratory, and emergency services — so care reaches patients faster.
              </p>
              <div className="flex gap-2">
                {socialLinks.map((s, i) => (
                  <SocialButton key={i} {...s} />
                ))}
              </div>
            </motion.div>

            {/* Col 2 — Navigation */}
            <motion.div variants={itemVariants}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0047FF] mb-5">Platform</h4>
              <div className="space-y-3">
                {navLinks.map((l, i) => (
                  <FooterLink key={i} {...l} />
                ))}
              </div>
            </motion.div>

            {/* Col 3 — Services */}
            <motion.div variants={itemVariants}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00C5A8] mb-5">Services</h4>
              <div className="space-y-3">
                {quickLinks.map((l, i) => (
                  <FooterLink key={i} {...l} />
                ))}
              </div>
            </motion.div>

            {/* Col 4 — University */}
            <motion.div variants={itemVariants}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7B2FFF] mb-5">Institution</h4>

              {/* University card */}
              <div className="relative p-5 rounded-2xl bg-white/2 border border-white/[0.07] overflow-hidden group">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle at 30% 30%, #7B2FFF10, transparent 60%)' }} />
                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#7B2FFF40] to-transparent" />

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg border border-white/10 overflow-hidden shrink-0 bg-white/5">
                    <Image
                      src="/Gampaha_Wickramarachchi_University_of_Indigenous_Medicine_logo.png"
                      alt="GWUIM"
                      width={36}
                      height={36}
                      className="object-contain w-full h-full p-0.5"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-snug">Gampaha Wickramarachchi University</p>
                    <p className="text-[10px] text-gray-600 mt-0.5">of Indigenous Medicine</p>
                  </div>
                </div>

                <p className="text-[11px] text-gray-600 leading-relaxed">
                  BHSc (Hons) Health Information and Communication Technology
                </p>

                {/* Status dot */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C5A8] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00C5A8]" />
                  </span>
                  <span className="text-[10px] text-gray-600 font-medium uppercase tracking-wider">Active Project</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Tech stack row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <span className="text-[10px] uppercase tracking-widest text-gray-700 font-bold mr-1">Built with</span>
            {techStack.map((t, i) => (
              <TechBadge key={i} {...t} />
            ))}
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative pt-8"
          >
            {/* Gradient rule */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-600">
                  © {currentYear}{' '}
                  <span className="text-gray-400 font-semibold">J.A.J. Thatcroos</span>
                  {' '}· All rights reserved.
                </p>
                <p className="text-[10px] text-gray-700 mt-1 uppercase tracking-wider">
                  Designed & Developed by J.A.J. Thatcroos
                </p>
              </div>

              {/* Animated pulse badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/3 border border-white/[0.07]">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#FF3C6E]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  e-MedCare Hub System
                </span>
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#00C5A8]"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </footer>
    </>
  );
}