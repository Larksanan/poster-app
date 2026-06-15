/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion, useScroll, useTransform, AnimatePresence,
  useMotionValue, useSpring, useInView, motionValue
} from 'framer-motion';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Image from 'next/image';
import {
  FaLink, FaSmile, FaTruck, FaStopwatch, FaClipboardList, FaTools,
  FaFlask, FaCheckCircle, FaUsers, FaUserMd, FaUser, FaUserShield,
  FaLock, FaCapsules, FaUserCircle, FaInbox, FaKey, FaBoxOpen,
  FaFileInvoice, FaMicroscope, FaChartBar, FaBell, FaClipboardCheck,
  FaChartPie, FaChevronLeft, FaChevronRight, FaCheckDouble, FaLightbulb,
  FaHeartbeat, FaArrowRight, FaChevronUp,
} from 'react-icons/fa';
import {
  SiNextdotjs, SiTailwindcss, SiNodedotjs, SiMongodb,
  SiGithub, SiPostman, SiJest, SiVercel, SiTrello, SiFirebase
} from 'react-icons/si';

 import VideoPoster from '@/components/videoposter';



const HeartBeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);



function StarField() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.1,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 0.2, s.opacity] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ─── ECG LINE HERO ANIMATION ──────────────────────────────────────────────────

function EcgLine() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden opacity-20 pointer-events-none">
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          d="M0,40 L200,40 L220,40 L235,10 L250,70 L265,5 L280,70 L295,40 L450,40 L470,40 L485,10 L500,70 L515,5 L530,70 L545,40 L700,40 L720,40 L735,10 L750,70 L765,5 L780,70 L795,40 L950,40 L970,40 L985,10 L1000,70 L1015,5 L1030,70 L1045,40 L1200,40 L1220,40 L1235,10 L1250,70 L1265,5 L1280,70 L1295,40 L1440,40"
          fill="none"
          stroke="#00C5A8"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
        />
      </svg>
    </div>
  );
}

// ─── CURSOR GLOW ──────────────────────────────────────────────────────────────

function CursorGlow() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const move = (e: MouseEvent) => { mouseX.set(e.clientX - 200); mouseY.set(e.clientY - 200); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed pointer-events-none z-0 w-100 h-100 rounded-full"
      style={{
        x: springX, y: springY,
        background: 'radial-gradient(circle, rgba(0,71,255,0.06) 0%, transparent 65%)',
      }}
    />
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────

function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let cur = 0;
    const inc = target / 50;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(cur));
    }, 24);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{val}{suffix}</span>;
}

// ─── TILT CARD ────────────────────────────────────────────────────────────────

function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 30 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 30 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    rotX.set(-y * 10);
    rotY.set(x * 10);
  };
  const reset = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: sRotX, rotateY: sRotY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── SECTION LABEL ────────────────────────────────────────────────────────────

function SectionLabel({ label, center }: { label: string; center?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}
    >
      <div className="w-8 h-px bg-linear-to-r from-[#0047FF] to-[#00C5A8]" />
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00C5A8]">{label}</span>
      <div className="w-8 h-px bg-linear-to-r from-[#00C5A8] to-[#7B2FFF]" />
    </motion.div>
  );
}

// ─── GLOWING BADGE ────────────────────────────────────────────────────────────

function GlowBadge({ children, color = '#0047FF' }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
        color,
        boxShadow: `0 0 20px ${color}20`,
      }}
    >
      {children}
    </span>
  );
}

// ─── LAUNCH COUNTDOWN ─────────────────────────────────────────────────────────

function LaunchCountdown() {
  const [time, setTime] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth(), 23, 0, 0, 0);
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
      return {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      };
    };
    setTime(calc());
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!time) return null;
  const launched = !time.d && !time.h && !time.m && !time.s;
  const items = [
    { label: 'Days', v: time.d },
    { label: 'Hours', v: time.h },
    { label: 'Mins', v: time.m },
    { label: 'Secs', v: time.s },
  ];

  return (
    <div className="flex flex-col items-center gap-4 my-8">
      {!launched ? (
        <>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Launch countdown</p>
          <div className="flex gap-3">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center min-w-17 relative"
              >
                {/* Glow border */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-b from-[#0047FF]/30 to-[#7B2FFF]/20 blur-sm" />
                <div className="relative w-full px-3 py-3 rounded-xl bg-[#050B1A] border border-[#0047FF]/30 text-center">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={item.v}
                      initial={{ y: -15, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 15, opacity: 0 }}
                      className="block text-2xl font-black text-white tabular-nums"
                    >
                      {String(item.v).padStart(2, '0')}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[9px] uppercase tracking-widest text-[#0047FF] font-bold">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#00C5A8]/10 border border-[#00C5A8]/30"
        >
          <span className="w-2 h-2 rounded-full bg-[#00C5A8] animate-pulse" />
          <span className="text-[#00C5A8] text-xs font-black uppercase tracking-widest">Platform is Live</span>
        </motion.div>
      )}
    </div>
  );
}

// ─── MODULE CAROUSEL ──────────────────────────────────────────────────────────

const systemShowcase = [
  { title: 'Admin Dashboard', category: 'Management', image: '/showcase/AdminDashboard.png' },
  { title: 'Pharmacy Dashboard', category: 'Stock Control', image: '/showcase/PharmacyDashboard.png' },
  { title: 'Laboratory Dashboard', category: 'Digital Records', image: '/showcase/LaboratoryDashboard.png' },
  { title: 'Receptionist Dashboard', category: 'Finance', image: '/showcase/Receptinist.png' },
  { title: 'Patient Dashboard', category: 'Health History', image: '/showcase/PatientDashboard.png' },
  { title: 'Doctor Dashboard', category: 'Live Tracking', image: '/showcase/Doctor.png' },
];

function ModuleCarousel() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(0);

  const go = (d: number) => {
    setDir(d);
    setIdx((p) => (p + d + systemShowcase.length) % systemShowcase.length);
  };

  const item = systemShowcase[idx];

  return (
    <div className="relative h-120 w-full overflow-hidden rounded-3xl border border-white/10 group">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={idx}
          custom={dir}
          variants={{
            enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          className="absolute inset-0 bg-[#050B1A]"
        >
          <Image src={item.image} alt={item.title} fill className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-linear-to-t from-[#03060F] via-[#03060F]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00C5A8] block mb-3">
              {item.category}
            </span>
            <h4 className="text-white font-black text-4xl md:text-6xl leading-none">
              {item.title}
            </h4>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
        <motion.div
          className="h-full bg-linear-to-r from-[#0047FF] to-[#00C5A8]"
          initial={{ width: 0 }}
          animate={{ width: `${((idx + 1) / systemShowcase.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-3">
        <button onClick={() => go(-1)}
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#0047FF]/20 hover:border-[#0047FF]/50 transition-all active:scale-95">
          <FaChevronLeft />
        </button>
        <button onClick={() => go(1)}
          className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[#0047FF]/20 hover:border-[#0047FF]/50 transition-all active:scale-95">
          <FaChevronRight />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-10 z-20 flex gap-2">
        {systemShowcase.map((_, i) => (
          <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }}
            className={`h-1 rounded-full transition-all duration-500 ${i === idx ? 'w-8 bg-[#0047FF]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── LIVE DASHBOARD PREVIEW ───────────────────────────────────────────────────

function DashboardPreview() {
  const inventoryBars = [
    { label: 'Antibiotics', value: 85, color: '#0047FF' },
    { label: 'Painkillers', value: 40, color: '#FF3C6E' },
    { label: 'Vaccines', value: 92, color: '#00C5A8' },
    { label: 'First Aid', value: 65, color: '#7B2FFF' },
  ];
  const billingBars = [45, 60, 40, 80, 55, 90, 70, 85, 65, 95];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Inventory */}
      <TiltCard className="p-6 rounded-2xl bg-[#050B1A] border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-white text-sm">Inventory Overview</h4>
          <GlowBadge color="#00C5A8">Live Stock</GlowBadge>
        </div>
        <div className="space-y-4">
          {inventoryBars.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-400">{item.label}</span>
                <span className="text-xs font-bold text-white">{item.value}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }}
                />
              </div>
            </div>
          ))}
        </div>
      </TiltCard>

      {/* Billing chart */}
      <TiltCard className="p-6 rounded-2xl bg-[#050B1A] border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-white text-sm">Billing Insights</h4>
          <GlowBadge color="#0047FF">Revenue</GlowBadge>
        </div>
        <div className="h-36 flex items-end gap-1.5 px-1">
          {billingBars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: 'backOut' }}
              className="flex-1 rounded-t relative group cursor-pointer"
              style={{ background: `linear-gradient(to top, #0047FF, #7B2FFF88)` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0047FF] text-white text-[10px] py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                Rs. {h * 1000}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[10px] text-gray-600 font-medium px-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </TiltCard>
    </div>
  );
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const features = [
  { icon: '📅', title: 'Doctor Appointments', description: 'Book specialist consultations instantly — no waiting on hold or lost call queues.', accent: '#0047FF', delay: 0 },
  { icon: '🧪', title: 'Laboratory Records', description: 'Manage lab records comprehensively and receive digital results directly in-account.', accent: '#7B2FFF', delay: 0.08 },
  { icon: '💊', title: 'Inventory & Pharmacy', description: 'Manage medicines with automatic stock alerts, batch tracking, and live visibility.', accent: '#00C5A8', delay: 0.16 },
  { icon: '🚑', title: 'Emergency Support', description: 'One-tap ambulance dispatch with real-time GPS location sharing and ETA.', accent: '#FF3C6E', delay: 0.24 },
  { icon: '🚚', title: 'Fast Delivery', description: 'Prescribed medicines delivered with guaranteed speed, accuracy, and full tracking.', accent: '#F5A623', delay: 0.32 },
  { icon: '🔐', title: 'Employee Management', description: 'Role-based access control protecting sensitive pharmacy and patient data.', accent: '#0047FF', delay: 0.40 },
  { icon: '🧾', title: 'Billing & Records', description: 'Transparent billing tightly integrated with complete digital medical histories.', accent: '#00C5A8', delay: 0.48 },
  { icon: '🔔', title: 'Real-time Alerts', description: 'Instant push notifications for prescriptions, restocks, and appointment changes.', accent: '#7B2FFF', delay: 0.56 },
];

const howItWorks = [
  { step: 'I', title: 'Register', description: 'Create an account and choose your role — patient, doctor, or pharmacy staff.', icon: '📝' },
  { step: 'II', title: 'Book', description: 'Select a doctor, request a lab test, or place a pharmacy order.', icon: '📅' },
  { step: 'III', title: 'Receive', description: 'Get your care delivered to your door or attend your visit.', icon: '💊' },
  { step: 'IV', title: 'Track', description: 'Monitor records, reports, and follow-up reminders any time, any device.', icon: '📊' },
];

const objectives = [
  { title: 'Integrated Platform', description: 'Connecting all pharmacy services — laboratory, hospital, and emergency care — in one place.', icon: <FaLink />, color: '#0047FF' },
  { title: 'User Friendly', description: 'Providing an intuitive and accessible digital medical platform for every user type.', icon: <FaSmile />, color: '#00C5A8' },
  { title: 'Reliable Delivery', description: 'Ensuring quick and dependable medicine delivery directly to the patient\'s doorstep.', icon: <FaTruck />, color: '#7B2FFF' },
  { title: 'Efficiency', description: 'Significantly reducing patient waiting times through fully automated digital workflows.', icon: <FaStopwatch />, color: '#FF3C6E' },
];

const methodologySteps = [
  { title: 'Planning', icon: <FaClipboardList />, color: '#0047FF', desc: 'Sprint mapping and requirement analysis with stakeholders.' },
  { title: 'Development', icon: <FaTools />, color: '#7B2FFF', desc: 'Modular feature development in 2-week agile cycles.' },
  { title: 'Testing', icon: <FaFlask />, color: '#FF3C6E', desc: 'Unit, integration, and end-to-end testing across all roles.' },
  { title: 'Evaluation', icon: <FaCheckCircle />, color: '#00C5A8', desc: 'User acceptance testing and iterative feedback loops.' },
];

const toolsUsed = [
  { category: 'Frontend', items: 'Next.js · Tailwind CSS', icon: <SiNextdotjs />, color: '#ffffff' },
  { category: 'Authentication', items: 'Firebase Auth', icon: <SiFirebase />, color: '#FFCA28' },
  { category: 'Backend', items: 'Node.js', icon: <SiNodedotjs />, color: '#68A063' },
  { category: 'Database', items: 'MongoDB', icon: <SiMongodb />, color: '#4CAF50' },
  { category: 'Version Control', items: 'GitHub', icon: <SiGithub />, color: '#ffffff' },
  { category: 'Testing', items: 'Postman · Jest', icon: <SiPostman />, color: '#FF6C37' },
  { category: 'Deployment', items: 'Vercel / AWS', icon: <SiVercel />, color: '#ffffff' },
  { category: 'Management', items: 'Trello', icon: <SiTrello />, color: '#0052CC' },
];

const samplingRoles = [
  { role: 'Pharmacy Staff', icon: <FaUsers />, color: '#0047FF' },
  { role: 'Doctors', icon: <FaUserMd />, color: '#00C5A8' },
  { role: 'Patients', icon: <FaUser />, color: '#7B2FFF' },
  { role: 'Administrators', icon: <FaUserShield />, color: '#FF3C6E' },
];

const systemInputs = [
  { category: 'Authentication', description: 'User credentials for login and secure multi-role authentication.', icon: <FaLock />, color: '#0047FF' },
  { category: 'Medicine Inventory', description: 'Details including name, batch number, quantity, price, and expiry date.', icon: <FaCapsules />, color: '#00C5A8' },
  { category: 'User Records', description: 'Customer and doctor profiles for accurate prescriptions and billing.', icon: <FaUserCircle />, color: '#7B2FFF' },
  { category: 'Service Operations', description: 'Lab reports, delivery requests, and emergency service entries.', icon: <FaInbox />, color: '#FF3C6E' },
];

const systemProcesses = [
  { category: 'Auth & Role Management', description: 'Validates user roles to ensure secure and scoped system access.', icon: <FaKey />, color: '#0047FF' },
  { category: 'Medicine Management', description: 'Tracks stock with alerts for expiry dates and low-stock thresholds.', icon: <FaBoxOpen />, color: '#00C5A8' },
  { category: 'Billing System', description: 'Auto-generates and stores digital invoices for all transactions.', icon: <FaFileInvoice />, color: '#7B2FFF' },
  { category: 'Lab & Delivery Sync', description: 'Synchronizes lab results with pharmacy orders and delivery tracking.', icon: <FaMicroscope />, color: '#FF3C6E' },
  { category: 'Report Generation', description: 'Summarizes sales, stock status, and employee activity for admin.', icon: <FaChartBar />, color: '#F5A623' },
];

const systemOutputs = [
  { category: 'Updated Inventory', description: 'Real-time medicine stock reflecting all movements and batch changes.', icon: <FaBoxOpen />, color: '#0047FF' },
  { category: 'Billing & Records', description: 'Generated customer invoices and comprehensive payment histories.', icon: <FaFileInvoice />, color: '#7B2FFF' },
  { category: 'Stock & Expiry Reports', description: 'Detailed reports for low-stock items and near-expiry medicines.', icon: <FaClipboardCheck />, color: '#FF3C6E' },
  { category: 'Admin Analytics', description: 'Summarized data for monitoring hospital and pharmacy performance.', icon: <FaChartPie />, color: '#00C5A8' },
  { category: 'Smart Notifications', description: 'System-wide alerts for low stock or expired medical batches.', icon: <FaBell />, color: '#F5A623' },
  { category: 'Delivery Services', description: 'Fast, accurate doorstep medicine delivery coordinated via platform.', icon: <FaTruck />, color: '#0047FF' },
];

const advantages = [
  { emoji: '🏥', text: 'One platform for complete hospital care', color: '#0047FF' },
  { emoji: '⚡', text: 'Faster services — fewer queues, less paperwork', color: '#F5A623' },
  { emoji: '🔒', text: 'Encrypted, role-based medical records', color: '#FF3C6E' },
  { emoji: '💊', text: 'Automated stock alerts and medicine delivery', color: '#00C5A8' },
  { emoji: '🚑', text: 'Integrated emergency dispatch and tracking', color: '#FF3C6E' },
  { emoji: '📱', text: '24/7 access from any device, anywhere', color: '#7B2FFF' },
];

const testimonials = [
  { name: 'Dr. T. Larkshanan', role: 'Cardiologist', content: 'e-MedCare Hub has transformed how I manage patient appointments. Everything is in one place and the workflow is genuinely intuitive.', rating: 5 },
  { name: 'S. Sathuska', role: 'Patient', content: 'I uploaded my prescription at noon and the medicines arrived by 2 pm. I genuinely did not expect it to be that fast.', rating: 5 },
  { name: 'J.A.J. Thatcroos', role: 'Pharmacy Manager', content: 'Stock alerts and delivery tracking in one dashboard have cut our manual checking time in half.', rating: 4 },
];

const conclusionHighlights = [
  { title: 'Operational Excellence', text: 'Successfully automated manual pharmacy records and billing workflows.', icon: <FaCheckDouble /> },
  { title: 'Patient Safety', text: 'Ensured accurate medicine delivery through secure digital verification.', icon: <FaCheckDouble /> },
];

const futureScope = [
  { title: 'AI Diagnostics', text: 'Integrating machine learning for automated prescription pattern analysis.', icon: <FaLightbulb /> },
  { title: 'Telehealth Expansion', text: 'Expanding to live video consultations and remote patient monitoring.', icon: <FaLightbulb /> },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Use window-level scroll — avoids the "ref not hydrated" error that occurs
  // when useScroll({ target }) runs before the DOM node is mounted.
  const { scrollYProgress } = useScroll();
  // Hero parallax runs over the first ~30% of page scroll
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => { unsub(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus('loading');
    setTimeout(() => { setSubStatus('success'); setEmail(''); setTimeout(() => setSubStatus('idle'), 3500); }, 1400);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03060F]">
        <div className="text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border border-[#0047FF]/30" />
            <motion.div
              className="absolute inset-0 rounded-full border-t border-[#0047FF]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-3 flex items-center justify-center text-[#00C5A8]">
              <FaHeartbeat className="animate-pulse" />
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-600 font-bold">Loading e-MedCare Hub</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03060F] text-white relative overflow-x-hidden">
      <CursorGlow />

      {/* Global grid texture */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <motion.section
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 pt-16"
      >
        <StarField />
        <EcgLine />

        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-150 h-150 rounded-full"
            style={{ background: 'radial-gradient(circle, #0047FF18 0%, transparent 60%)' }}
            animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-125 h-125 rounded-full"
            style={{ background: 'radial-gradient(circle, #7B2FFF15 0%, transparent 60%)' }}
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/2 w-100 h-100 rounded-full"
            style={{ background: 'radial-gradient(circle, #00C5A810 0%, transparent 60%)' }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Rotating logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className="relative w-20 h-20 mx-auto mb-8"
          >
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'conic-gradient(from 0deg, #0047FF, #7B2FFF, #00C5A8, #0047FF)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0.5 rounded-2xl bg-[#03060F] flex items-center justify-center text-[#0047FF] p-3.5">
               <Image
                        src="/Logo.jpg"
                        alt="Logo"
                        width={200}
                        height={200}
                        />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <GlowBadge color="#00C5A8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C5A8] animate-pulse" />
              Smart Digital Healthcare Management
            </GlowBadge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl sm:text-7xl md:text-9xl font-black leading-[0.88] tracking-tight mb-6"
          >
            <span className="block text-white">e-MedCare</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #0047FF 0%, #7B2FFF 50%, #00C5A8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Hub System
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-2"
          >
            Connecting hospital, pharmacy, laboratory, and emergency care on one
            unified digital platform — so treatment reaches patients faster.
          </motion.p>

          <LaunchCountdown />
          

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 40px #0047FF60' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #0047FF, #7B2FFF)' }}
            >
              Explore Features
              <FaArrowRight className="text-xs" />
            </motion.button>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm border border-white/20 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Meet the Team
                <FaUsers className="text-xs" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

      

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-[#0047FF]" />
          </div>
        </motion.div>
      </motion.section>

         <VideoPoster/>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 8, suffix: '', label: 'Core Modules', color: '#0047FF' },
              { value: 5, suffix: '+', label: 'Team Members', color: '#00C5A8' },
              { value: 12, suffix: '+', label: 'Technologies', color: '#7B2FFF' },
              { value: 4, suffix: '', label: 'User Roles', color: '#FF3C6E' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-[#050B1A] border border-white/10 text-center overflow-hidden"
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}, transparent 70%)` }}
                />
                <div className="text-3xl font-black mb-1" style={{ color: s.color }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT AIM ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <SectionLabel label="Overview" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-8 leading-tight"
          >
            Project Aim
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative p-8 rounded-2xl bg-[#050B1A] border border-white/10"
          >
            <div className="absolute top-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-[#0047FF] to-transparent" />
            <p className="text-gray-300 text-lg leading-relaxed">
              The main aim of this project is to develop an efficient online platform that connects{' '}
              <span className="text-white font-bold">hospitals and pharmacies</span>{' '}
              to deliver prescribed medicines directly to patients in a fast and accurate manner.
              The system manages medicines, inventory, billing, laboratory records, and employee details
              while ensuring{' '}
              <span className="font-bold" style={{ color: '#00C5A8' }}>accuracy, transparency, and reliability</span>{' '}
              in daily healthcare activities.
            </p>
            <div className="absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-[#7B2FFF] to-transparent" />
          </motion.div>
        </div>
      </section>



      {/* ── OBJECTIVES ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Goals" center />
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black">Project Objectives</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {objectives.map((obj, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-7 rounded-2xl bg-[#050B1A] border border-white/10 h-full overflow-hidden group hover:border-white/20 transition-all"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${obj.color}15, transparent 60%)` }}
                  />
                  <div className="text-2xl mb-5 p-3 rounded-xl inline-flex" style={{ background: `${obj.color}15`, color: obj.color }}>
                    {obj.icon}
                  </div>
                  <h3 className="font-black text-white mb-3">{obj.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{obj.description}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(90deg, transparent, ${obj.color}, transparent)` }} />
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Execution" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-6">
            Development Methodology
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gray-400 text-lg leading-relaxed mb-12 max-w-3xl">
            Built on the <span className="text-white font-bold">Agile Software Development Methodology</span> — iterative cycles of planning, development, testing, and evaluation ensure continuous improvement and active collaboration.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-1/2 left-[12.5%] right-[12.5%] h-px -translate-y-1/2 z-0"
              style={{ background: 'linear-gradient(90deg, #0047FF, #7B2FFF, #FF3C6E, #00C5A8)' }} />
            {methodologySteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 p-6 rounded-2xl bg-[#050B1A] border border-white/10 text-center"
              >
                <div className="text-2xl mb-4 p-3 rounded-xl inline-flex mx-auto" style={{ background: `${step.color}15`, color: step.color }}>
                  {step.icon}
                </div>
                <h4 className="font-black mb-2" style={{ color: step.color }}>{step.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Architecture" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-8">
            Project Design
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-gray-400 text-lg leading-relaxed mb-10">
            A <span className="text-white font-bold">modular, web-based application</span> integrating all core pharmacy operations — medicine management, billing, lab coordination, doctor connections, and emergency services.
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { layer: 'Frontend', tech: 'Next.js + React.js', desc: 'Responsive, accessible interfaces with server-side rendering.', color: '#0047FF' },
              { layer: 'Auth', tech: 'Firebase Auth', desc: 'Secure role-based access control for all user types.', color: '#F5A623' },
              { layer: 'Backend', tech: 'Node.js + MongoDB', desc: 'Scalable APIs and flexible document-based data storage.', color: '#00C5A8' },
            ].map((l, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="p-6 rounded-2xl bg-[#050B1A] border border-white/10 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${l.color}, transparent)` }} />
                  <span className="text-[10px] font-black uppercase tracking-widest mb-3 block" style={{ color: l.color }}>{l.layer}</span>
                  <h4 className="font-black text-white text-lg mb-2">{l.tech}</h4>
                  <p className="text-sm text-gray-500">{l.desc}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Stack" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10">
            Tools & Materials
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {toolsUsed.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04, borderColor: `${item.color}60` }}
                className="p-5 rounded-2xl bg-[#050B1A] border border-white/10 transition-all cursor-default"
              >
                <div className="text-2xl mb-3" style={{ color: item.color }}>{item.icon}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-1">{item.category}</div>
                <div className="text-sm font-bold text-white">{item.items}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SAMPLING ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Testing" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-6">Sampling Strategy</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gray-400 text-lg leading-relaxed mb-10 max-w-3xl">
            Users from all functional roles participated during the <span className="text-white font-bold">evaluation and testing phase</span>, selected via <span className="font-bold" style={{ color: '#0047FF' }}>purposive sampling</span> to ensure complete role coverage.
          </motion.p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {samplingRoles.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#050B1A] border border-white/10 text-center"
              >
                <div className="text-2xl p-3 rounded-xl" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                <span className="text-sm font-bold text-white">{item.role}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INPUTS ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Data Flow" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10">
            System Inputs
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {systemInputs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 p-6 rounded-2xl bg-[#050B1A] border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="text-xl p-3 rounded-xl shrink-0 h-fit" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                <div>
                  <h4 className="font-black text-white mb-1">{item.category}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSES ────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Logic" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10">
            System Processes
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {systemProcesses.map((item, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-[#050B1A] border border-white/10 h-full group hover:border-white/20 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${item.color}10, transparent 60%)` }} />
                  <div className="text-xl mb-4 p-2 rounded-lg inline-flex" style={{ color: item.color, background: `${item.color}15` }}>{item.icon}</div>
                  <h4 className="font-black text-white mb-2 text-sm">{item.category}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAROUSEL ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Live Tour" center />
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black">
              Experience the Interface
            </motion.h2>
          </div>
          <ModuleCarousel />
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Live Data" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10">
            Dashboard Preview
          </motion.h2>
          <DashboardPreview />
        </div>
      </section>

      {/* ── OUTPUTS ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Results" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-10">
            System Outputs
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {systemOutputs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center p-7 rounded-2xl bg-[#050B1A] border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="text-2xl mb-4 p-4 rounded-2xl group-hover:scale-110 transition-transform" style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
                <h4 className="font-black text-white mb-2 text-sm">{item.category}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Services" center />
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-4">Key Features</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gray-500 max-w-xl mx-auto">
              Every module built to reduce friction for patients, staff, and administrators alike.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: f.delay }}
                  whileHover={{ y: -4 }}
                  className="p-6 rounded-2xl bg-[#050B1A] border border-white/10 hover:border-white/20 transition-all h-full flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 20% 20%, ${f.accent}12, transparent 55%)` }} />
                  <div className="text-3xl mb-5">{f.icon}</div>
                  <h3 className="font-black text-white mb-3">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{f.description}</p>
                  <div className="h-px mt-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, ${f.accent}, transparent)` }} />
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Process" center />
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black">How It Works</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 relative">
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px z-0"
              style={{ background: 'linear-gradient(90deg, #0047FF, #7B2FFF, #FF3C6E, #00C5A8)' }} />
            {howItWorks.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative z-10 p-6 rounded-2xl bg-[#050B1A] border border-white/10 text-center"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black mx-auto mb-4 border"
                  style={{ background: '#03060F', borderColor: '#0047FF50', color: '#0047FF' }}>
                  {item.step}
                </div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-black text-white mb-2">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVANTAGES ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Benefits" center />
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black">Why e-MedCare Hub?</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {advantages.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#050B1A] border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${a.color}15` }}>
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-sm font-medium text-gray-300">
                  <span className="mr-2">{a.emoji}</span>{a.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel label="Testimonials" center />
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black">What Our Users Say</motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <TiltCard key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-7 rounded-2xl bg-[#050B1A] border border-white/10 h-full flex flex-col gap-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#0047FF] to-transparent" />
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg"
                      style={{ background: 'linear-gradient(135deg, #0047FF, #7B2FFF)' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-black text-sm text-white">{t.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className="text-sm" style={{ color: j < t.rating ? '#F5A623' : '#ffffff15' }}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed flex-1 italic">&ldquo;{t.content}&rdquo;</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONCLUSION ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SectionLabel label="Summary" />
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-black mb-8">
            Conclusion & Future Work
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-gray-400 text-lg leading-relaxed mb-12 max-w-3xl">
            The <span className="text-white font-bold">e-MedCare Hub</span> successfully addresses traditional healthcare management challenges, providing a seamless, automated, and secure digital environment that significantly reduces patient waiting times.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00C5A8]">Key Achievements</h4>
              {conclusionHighlights.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-5 rounded-2xl bg-[#050B1A] border border-[#00C5A8]/20">
                  <div className="text-[#00C5A8] mt-0.5">{item.icon}</div>
                  <div>
                    <h5 className="font-black text-white text-sm">{item.title}</h5>
                    <p className="text-xs text-gray-500 mt-1">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7B2FFF]">Future Scope</h4>
              {futureScope.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-5 rounded-2xl bg-[#050B1A] border border-[#7B2FFF]/20 hover:border-[#7B2FFF]/40 transition-all group">
                  <div className="text-[#7B2FFF] group-hover:scale-110 transition-transform mt-0.5">{item.icon}</div>
                  <div>
                    <h5 className="font-black text-white text-sm">{item.title}</h5>
                    <p className="text-xs text-gray-500 mt-1">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-10 rounded-3xl bg-[#050B1A] border border-white/10 text-center overflow-hidden"
          >
            <div className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, #0047FF20, transparent 60%)' }} />
            <div className="absolute top-0 left-10 right-10 h-px bg-linear-to-r from-transparent via-[#0047FF] to-transparent" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white mb-2">Stay Updated</h3>
              <p className="text-gray-500 text-sm mb-8">Health tips, platform updates, and new features — directly to your inbox.</p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 text-sm rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#0047FF]/50 focus:bg-white/8 transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px #0047FF50' }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0047FF, #7B2FFF)' }}
                >
                  {subStatus === 'loading' ? 'Subscribing…' : 'Subscribe'}
                  <FaArrowRight className="text-xs" />
                </motion.button>
              </form>
              <AnimatePresence>
                {subStatus === 'success' && (
                  <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="text-[#00C5A8] mt-4 text-sm font-bold">
                    ✓ You&apos;re subscribed — welcome aboard!
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}