/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useInView } from 'framer-motion';
import { 
  FaLinkedin, FaUsers, FaCode, FaDatabase, FaPaintBrush,
  FaServer, FaLaptopCode, FaGithub, FaTimes, FaEnvelope, FaPhone, FaJava
} from 'react-icons/fa';
import { 
  SiNextdotjs, SiTailwindcss, SiFigma, SiReact, SiNodedotjs, SiJest,
  SiMongodb, SiFirebase, SiAdobexd, SiTypescript, SiMysql, SiPostgresql
  
} from 'react-icons/si';
import { DiLinux } from "react-icons/di";
import Image from 'next/image';



const supervisor = {
  name: "Mrs. R.P.G.S. Maleesha",
  role: "Project Supervisor",
  department: "Department of Technology",
  university: "Gampaha Wickramarachchi University Of Indigenous Medicine",
  email: "no-reply@classroom.google.com",
  phone: "+94 77 123 4567",
  linkedin: "https://www.linkedin.com/in/sandali-maleesha-33b3011a5?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  image: "/team/mani.png",

  color: "from-violet-600 via-blue-600 to-cyan-500",
};

const teamMembers = [
  {
    id: 1,
    name: "J.A.J. Thatcroos",
    role: "Full Stack Developer",
    department: "Health Information Technology",
    bio: "Full Stack Developer with expertise in modern web technologies. Leading the development of the e-MedCare Hub platform with a focus on performance and scalability.",
    email: "jebarsanthatcroos@gmail.com",
    github: "https://github.com/jebarsanthatcroos",
    linkedin: "https://linkedin.com/in/jebarsanthatcroos",
    skills: ["React", "Next.js", "Node.js", "Firebase", "TypeScript", "Jest", "MongoDB"],
    contribution: "Frontend Architecture, API Integration, System Design",
    icon: <FaCode />,
    techStack: [ 
      { icon: <SiReact />, name: "React", color: "#61DAFB" },
      { icon: <SiNextdotjs />, name: "Next.js", color: "#fff" },
      {icon: <SiTypescript />, name: "TypeScript", color: "#3178C6" },
      { icon: <SiNodedotjs />, name: "Node.js", color: "#68A063" },
      {icon: <SiMongodb />, name: "MongoDB", color: "#4CAF50" },
      {icon: <SiJest />, name: "Jest", color: "#FFCA28" },
      { icon: <SiFirebase />, name: "Firebase", color: "#FFCA28" },
    ],
    image: "/team/jebarsan.png",
    accent: "#6366f1",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-violet-600",
    number: "01",
  },
  {
    id: 2,
    name: "T. Larkshanan",
    role: "Backend Developer ,Scrum Master",
    
    department: "Health Information Technology",
    bio: "Backend Specialist focused on building robust server-side solutions, REST APIs, and ensuring data security and integrity.",
    email: "larkshanan0918@gmail.com",
    github: "https://github.com/Larksanan",
    linkedin: "https://www.linkedin.com/in/t-laksanan-4a969334a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    skills: ["Node.js", "java", "MongoDB", "MySQL", "REST APIs", "Security"],
    contribution: "Backend Logic, Database Design, API Development",
    icon: <FaServer />,
    techStack: [
      { icon: <SiNodedotjs />, name: "Node.js", color: "#68A063" },
      { icon: <FaJava />, name: "Java", color: "#ED8936" },
      { icon: <SiMongodb />, name: "MongoDB", color: "#4CAF50" },
      { icon: <SiMysql />, name: "MySQL", color: "#336791" },
    ],
    image: "/team/lar.png",
    accent: "#4ade80",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    number: "02",
  },
  {
    id: 3,
    name: "S. Sathuska",
    role: "Database Manager",
    department: "Health Information Technology",
    bio: "Database expert managing data integrity, optimizing queries, and implementing security rules for patient data protection.",
    email: "gwu-hict-2021-37@gwu.ac.lk",
    github: "https://github.com/sathu713",
    linkedin: "https://linkedin.com/in/sathuska",
    skills: ["SQL", "Firebase", "Data Modeling", "Security Rules", "Indexing", "Backup/Recovery"],
    contribution: "Database Schema, Security Rules, Data Optimization",
    icon: <FaDatabase />,
    techStack: [
      { icon: <SiFirebase />, name: "Firebase", color: "#FFCA28" },
      { icon: <SiPostgresql />, name: "PostgreSQL", color: "#336791" },
      { icon: <SiMysql />, name: "MySQL", color: "#336791" },
    ],
    image: "/team/sathu.jpeg",
    accent: "#fb923c",
    gradientFrom: "from-orange-500",
    gradientTo: "to-amber-500",
    number: "03",
  },
  {
    id: 4,
    name: "N.M. Farwais",
    role: "Frontend Developer",
    department: "Health Information Technology",
    bio: "Creative Frontend Developer passionate about creating intuitive and responsive user interfaces that enhance patient experience.",
    email: "farwais@example.com",
    github: "https://github.com/farwais2000",
    linkedin: "https://linkedin.com/in/farwais",
    skills: ["React", "Next.js", "Tailwind CSS", "Figma", "TypeScript", "HTML/CSS"],
    contribution: "UI/UX Design, Component Development, Responsive Design",
    icon: <FaLaptopCode />,
    techStack: [
      { icon: <SiReact />, name: "React", color: "#61DAFB" },
      { icon: <SiNextdotjs />, name: "Next.js", color: "#fff" },
      { icon: <SiTailwindcss />, name: "Tailwind", color: "#38BDF8" },
      { icon: <SiFigma />, name: "Figma", color: "#A259FF" },
    ],
    image: "/team/farwais.jpeg",
    accent: "#22d3ee",
    gradientFrom: "from-cyan-500",
    gradientTo: "to-blue-600",
    number: "04",
  },
  {
    id: 5,
    name: "P. Sovika",
    role: "UI/UX Designer , DevOps Engineer",
    department: "Health Information Technology",
    bio: "User-centered designer creating accessible and engaging healthcare interfaces that prioritize patient needs.",
    email: "sovika@example.com",
    github: "https://github.com/sovisovika",
    linkedin: "https://linkedin.com/in/sovika",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Wireframing", "Usability Testing"],
    contribution: "Wireframes, Prototypes, User Testing, Design System",
    icon: <FaPaintBrush />,
    techStack: [
      { icon: <SiFigma />, name: "Figma", color: "#A259FF" },
      { icon: <SiAdobexd />, name: "Adobe XD", color: "#FF61F6" },
      { icon: < DiLinux />, name: "Linux", color: "#A259FF" },
    ],
    image: "/team/sovi.jpeg",
    accent: "#f472b6",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-600",
    number: "05",
  },
  
];

// ─── PARTICLE FIELD ───────────────────────────────────────────────────────────

function ParticleField() {
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    randomX: number;
  }[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        randomX: Math.random() > 0.5 ? 20 : -20,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.randomX, 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}



function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-0 w-75 h-75 rounded-full"
      style={{
        x: springX,
        y: springY,
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
      }}
    />
  );
}



function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── MAGNETIC BUTTON ──────────────────────────────────────────────────────────

function MagneticButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={handleMove} onMouseLeave={handleLeave} className={className}>
      {children}
    </motion.div>
  );
}



function SkillBar({ skill, index, accent }: { skill: string; index: number; accent: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const pct = 75 + (index * 7 % 20);

  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-200">{skill}</span>
        <span className="text-xs text-gray-400">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}99)` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}



function TeamCard({ member, index, onClick }: { member: typeof teamMembers[0]; index: number; onClick: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);

  return (


    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 10 }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      className="relative cursor-pointer group"
      style={{ perspective: 1000 }}
    >
      {/* Glow ring */}
      <motion.div
        className={`absolute -inset-0.5 rounded-2xl bg-linear-to-br ${member.gradientFrom} ${member.gradientTo} opacity-0 blur-sm`}
        animate={{ opacity: hovered ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative bg-[#0d1117] border border-white/10 rounded-2xl overflow-hidden">
        {/* Top accent strip */}
        <div className={`h-1 w-full bg-linear-to-r ${member.gradientFrom} ${member.gradientTo}`} />

        {/* Number watermark */}
        <div className="absolute top-3 right-4 font-black text-5xl text-white/5 select-none leading-none">
          {member.number}
        </div>

        <div className="p-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 mb-5">
            <div className={`absolute inset-0 rounded-full bg-linear-to-br ${member.gradientFrom} ${member.gradientTo} blur-md opacity-60`} />
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 bg-gray-900">
              <Image 
                src={member.image} 
                alt={member.name} 
                fill 
                className="object-cover"
                sizes="80px"
              />
            </div>
            {/* Online pulse */}
            <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0d1117]">
              <motion.span
                className="absolute inset-0 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-0.5">{member.name}</h3>
          <p className="text-sm font-semibold mb-1" style={{ color: member.accent }}>{member.role}</p>
          <p className="text-xs text-gray-500 mb-4">{member.department}</p>

          {/* Skills pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {member.skills.slice(0, 4).map((s, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                {s}
              </span>
            ))}
          </div>

          {/* Tech stack icons */}
          <div className="flex gap-3 items-center">
            {member.techStack.map((t, i) => (
              <motion.span
                key={i}
                className="text-xl"
                style={{ color: t.color }}
                animate={{ y: hovered ? [0, -4, 0] : 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                title={t.name}
              >
                {t.icon}
              </motion.span>
            ))}
          </div>

          {/* Hover CTA */}
          <motion.div
            className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100"
            initial={false}
            animate={{ x: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full bg-linear-to-r ${member.gradientFrom} ${member.gradientTo} text-white`}>
              View →
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}


function MemberModal({ member, onClose }: { member: typeof teamMembers[0]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      <motion.div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0d1117] border border-white/10 shadow-2xl"
        initial={{ scale: 0.85, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className={`relative h-32 bg-linear-to-br ${member.gradientFrom} ${member.gradientTo} overflow-hidden`}>
          <ParticleField />
          {/* Large number */}
          <div className="absolute bottom-2 right-6 text-8xl font-black text-white/10 leading-none select-none">
            {member.number}
          </div>
        </div>

        {/* Avatar overlapping header */}
        <div className="px-8 pb-8">
          <div className="-mt-10 mb-5 flex items-end justify-between">
            <div className="relative">
              <div className={`absolute -inset-1 rounded-full bg-linear-to-br ${member.gradientFrom} ${member.gradientTo} blur-md opacity-80`} />
              <div className="relative w-20 h-20 rounded-full border-4 border-[#0d1117] overflow-hidden bg-gray-900">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill 
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white">{member.name}</h2>
          <p className="font-semibold mb-1" style={{ color: member.accent }}>{member.role}</p>
          <p className="text-sm text-gray-500 mb-6">{member.department}</p>

          {/* Bio */}
          <p className="text-gray-400 leading-relaxed mb-6 text-sm">{member.bio}</p>

          {/* Contribution */}
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Key Contribution</p>
            <p className="text-gray-300 text-sm">{member.contribution}</p>
          </div>

          {/* Skill bars */}
          <div className="mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Skills & Expertise</p>
            {member.skills.map((skill, i) => (
              <SkillBar key={i} skill={skill} index={i} accent={member.accent} />
            ))}
          </div>

          {/* Tech stack */}
          <div className="mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Tech Stack</p>
            <div className="flex flex-wrap gap-3">
              {member.techStack.map((t, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                  whileHover={{ scale: 1.05, borderColor: t.color }}
                  transition={{ duration: 0.2 }}
                >
                  <span style={{ color: t.color }}>{t.icon}</span>
                  <span className="text-gray-300 font-medium">{t.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div className="flex gap-3 pt-6 border-t border-white/10">
            {[
              { href: `mailto:${member.email}`, icon: <FaEnvelope />, label: "Email" },
              { href: member.github, icon: <FaGithub />, label: "GitHub" },
              { href: member.linkedin, icon: <FaLinkedin />, label: "LinkedIn" },
            ].map((link, i) => (
              <MagneticButton key={i}>
                <motion.a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </motion.a>
              </MagneticButton>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}



function StatsStrip() {
  const stats = [
    { value: 5, suffix: "", label: "Team Members" },
    { value: 12, suffix: "+", label: "Technologies" },
    { value: 1000, suffix: "+", label: "Commits" },
    { value: 6, suffix: " mo", label: "In Development" },
  ];

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center p-6 rounded-2xl bg-white/3 border border-white/10"
          >
            <div className="text-3xl md:text-4xl font-black text-white mb-1">
              <AnimatedNumber target={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#060810] text-white relative">
      <CursorGlow />

      {/* ── HERO ── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        {/* Mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px]" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 rounded-full bg-cyan-600/10 blur-[100px]" />
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <ParticleField />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-sm text-gray-300 mb-8"
          >
            <FaUsers className="text-indigo-400" />
            <span className="uppercase tracking-widest font-semibold text-xs">e-MedCare Hub</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight mb-6"
          >
            <span className="block text-white">The people</span>
            <span className="block bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              behind the care
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-gray-400 max-w-xl mx-auto"
          >
            Five specialists united by one mission — transforming healthcare delivery through thoughtful technology.
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-5 h-8 border border-white/30 rounded-full flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 bg-white/50 rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── STATS ── */}
      <StatsStrip />

      {/* ── SUPERVISOR ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-2">Guidance</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Project Supervisor</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative group"
        >
          {/* Animated border */}
          <motion.div
            className="absolute -inset-px rounded-3xl opacity-60"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899, #6366f1)",
              backgroundSize: "300% 300%",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative bg-[#0d1117] rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-violet-900/20 via-transparent to-blue-900/20 pointer-events-none" />
            <ParticleField />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 p-8 md:p-12">
              {/* Avatar */}
              <div className="shrink-0 relative">
                <div className="absolute inset-0 scale-110 rounded-full bg-linear-to-br from-violet-500 to-blue-500 blur-xl opacity-50" />
                <div
                  className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-white/20"
                  style={{ background: "conic-gradient(from 0deg, #6366f1, #8b5cf6, #ec4899, #6366f1)" }}
                >
                  <div className="absolute inset-1 rounded-full bg-[#0d1117] overflow-hidden">
                    <Image 
                      src={supervisor.image} 
                      alt={supervisor.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 768px) 144px, 176px"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-xs text-violet-400 uppercase tracking-widest font-semibold mb-2">{supervisor.role}</p>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2">{supervisor.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{supervisor.department}</p>
                <p className="text-gray-500 text-sm mb-4">{supervisor.university}</p>
            
                <div className="flex gap-3 justify-center md:justify-start">
                  {[
                    { href: `mailto:${supervisor.email}`, icon: <FaEnvelope /> },
                    { href: `tel:${supervisor.phone}`, icon: <FaPhone /> },
                    { href: supervisor.linkedin, icon: <FaLinkedin /> },
                  ].map((link, i) => (
                    <MagneticButton key={i}>
                      <motion.a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all block"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {link.icon}
                      </motion.a>
                    </MagneticButton>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── TEAM MEMBERS ── */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-2">The Builders</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Core Team</h2>
          <p className="text-gray-500 max-w-lg text-sm">
            Click any card to explore their full contribution, skills, and contact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((member, index) => (
            <TeamCard
              key={member.id}
              member={member}
              index={index}
              onClick={() => setSelectedMember(member)}
            />
          ))}
        </div>
      </section>


      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}