'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { 
  FaHeartbeat, 
  FaUserMd, 
  FaSignOutAlt, 
  FaUserCircle, 
  FaBars, 
  FaTimes,
  FaGlobe,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';



interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  requiresAuth?: boolean;
  glowColor?: string;
}



function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href="/" 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(0,71,255,0.3), transparent 70%)',
        }}
        animate={{
          scale: isHovered ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />
      
      <div className="flex items-center gap-3 relative">
        {/* 3D Hexagon Icon */}
        <motion.div
          className="relative w-10 h-10"
          animate={{
            rotateY: isHovered ? 360 : 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 bg-linear-to-br from-[#0047FF] to-[#7B2FFF] rounded-xl shadow-lg" />
          <div className="absolute inset-0.5 bg-linear-to-br from-[#0047FF20] to-[#7B2FFF20] rounded-xl backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/Logo.jpg"
          alt="Logo"
          width={24}
          height={24}
          className="w-6 h-6"
          />
          </div>
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: isHovered 
                ? ['0 0 0px rgba(0,71,255,0)', '0 0 20px rgba(0,71,255,0.8)', '0 0 0px rgba(0,71,255,0)']
                : '0 0 0px rgba(0,71,255,0)',
            }}
            transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
          />
        </motion.div>

        {/* Text Logo with gradient animation */}
        <div className="relative">
          <motion.span
            className="font-bold text-xl bg-linear-to-r from-[#0047FF] via-[#00C5A8] to-[#7B2FFF] bg-clip-text text-transparent"
            animate={{
              backgroundPosition: isHovered ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%',
            }}
            transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
            style={{ backgroundSize: '200% auto' }}
          >
            e-MedCare Hub
          </motion.span>
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#00C5A8] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Pulse heart indicator */}
        <motion.div
          className="absolute -top-1 -right-2"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FaHeartbeat className="text-[#FF3C6E] text-xs" />
        </motion.div>
      </div>
    </Link>
  );
}

// ─── ANIMATED NAVIGATION LINK ─────────────────────────────────────────────────

function AnimatedNavLink({ href, label, icon: Icon, glowColor = '#0047FF' }: NavItem) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const x = useMotionValue<number>(0);
  const y = useMotionValue<number>(0);
  const background = useTransform([x, y], (latest: number[]) =>
    `radial-gradient(circle at ${latest[0] * 100}% ${latest[1] * 100}%, ${glowColor}, transparent 60%)`
  );
  
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div className="relative group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link href={href} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <motion.div
          className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
            isActive
              ? 'text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {/* Active indicator */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-linear-to-r from-[#0047FF] to-[#7B2FFF] opacity-20"
              layoutId="activeNav"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
            style={{ background }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />
          
          <div className="relative flex items-center gap-2 z-10">
            <Icon className="text-sm" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          
          {/* Bottom border animation */}
          {isActive && (
            <motion.div
              className="absolute bottom-0 left-2 right-2 h-px bg-linear-to-r from-transparent via-[#00C5A8] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2 }}
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── USER DROPDOWN WITH 3D EFFECT ────────────────────────────────────────────

function UserDropdown({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ripple, setRipple] = useState({ x: 0, y: 0, show: false });

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });
    setTimeout(() => setRipple({ ...ripple, show: false }), 500);
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        className="relative flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-linear-to-r from-white/5 to-white/0 border border-white/10 hover:border-white/20 transition-all duration-300 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Ripple effect */}
        {ripple.show && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 10, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ left: ripple.x, top: ripple.y }}
          />
        )}
        
        {/* Avatar with ring */}
        <div className="relative">
          {user.photoURL ? (
            <div className="relative">
              <Image
                src={user.photoURL}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full ring-2 ring-[#0047FF] ring-offset-2 ring-offset-transparent"
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ boxShadow: '0 0 0 2px rgba(0,71,255,0.5)' }}
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#0047FF] to-[#7B2FFF] flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          <motion.div
            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00C5A8] border-2 border-gray-900"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        
        {/* User info */}
        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium text-white">
            {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
          </p>
        </div>
        
        {/* Dropdown arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-2 w-64 bg-linear-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Menu header */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-gray-400">Signed in as</p>
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
            </div>
            
            {/* Menu items */}
            <div className="py-2">
              <Link href="/profile" onClick={() => setIsOpen(false)}>
                <motion.div
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors cursor-pointer group"
                  whileHover={{ x: 5 }}
                >
                  <FaUserCircle className="text-gray-400 group-hover:text-[#00C5A8] transition-colors" />
                  <span className="text-sm text-gray-300 group-hover:text-white">My Profile</span>
                </motion.div>
              </Link>
              
            </div>
            
            {/* Sign out button */}
            <div className="border-t border-white/10 py-2">
              <button
                onClick={() => {
                  onSignOut();
                  setIsOpen(false);
                }}
                className="w-full"
              >
                <motion.div
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors cursor-pointer group"
                  whileHover={{ x: 5 }}
                >
                  <FaSignOutAlt className="text-red-400 group-hover:text-red-400" />
                  <span className="text-sm text-red-400 group-hover:text-red-300">Sign Out</span>
                </motion.div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MOBILE MENU ────────────────────────────────────────────────────────────

function MobileMenu({ items, user, onClose, onSignOut }: { 
  items: NavItem[]; 
  user: User | null; 
  onClose: () => void;
  onSignOut: () => void;
}) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden bg-linear-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden"
    >
      <div className="px-4 py-4 space-y-2">
        {/* Navigation items */}
        {items.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={item.href} onClick={onClose}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-linear-to-r from-[#0047FF20] to-[#7B2FFF20] border border-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="text-sm" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="ml-auto w-1 h-6 rounded-full bg-linear-to-b from-[#0047FF] to-[#00C5A8]"
                      layoutId="mobileActive"
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
        
        {/* User section for mobile */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 mt-2 border-t border-white/10"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-[#0047FF]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#0047FF] to-[#7B2FFF] flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {user.displayName || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 mt-2 border-t border-white/10 space-y-2"
          >
            <Link href="/signin" onClick={onClose}>
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition-all">
                Sign In
              </div>
            </Link>
            <Link href="/signup" onClick={onClose}>
              <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-linear-to-r from-[#0047FF] to-[#7B2FFF] text-white font-medium">
                Sign Up
              </div>
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── MAIN NAVBAR COMPONENT ───────────────────────────────────────────────────

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: FaGlobe, glowColor: '#0047FF' },
  { href: '/#features', label: 'Services', icon: FaUserMd, glowColor: '#00C5A8' },
  { href: '/team', label: 'Team', icon: FaUserCircle, glowColor: '#7B2FFF' },
  { href: '/contact', label: 'Contact', icon: FaGlobe, glowColor: '#FF3C6E' },
  { href: '/dashboard', label: 'Dashboard', icon: MdDashboard, requiresAuth: true, glowColor: '#0047FF' },
];

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const scrollY = useMotionValue(0);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
      scrollY.set(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const filteredNavItems = navItems.filter(item => !item.requiresAuth || user);
  const navbarOpacity = useTransform(scrollY, [0, 100], [0.95, 0.98]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-linear-to-b from-gray-900/95 to-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-linear-to-b from-gray-900/80 to-black/80 backdrop-blur-md border-b border-white/5'
        }`}
        style={{ opacity: navbarOpacity }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 0% 50%, rgba(0,71,255,0.1), transparent 50%)',
                'radial-gradient(circle at 100% 50%, rgba(0,197,168,0.1), transparent 50%)',
                'radial-gradient(circle at 0% 50%, rgba(0,71,255,0.1), transparent 50%)',
              ],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <AnimatedLogo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center md:gap-1 lg:gap-4">
              {filteredNavItems.map((item) => (
                <AnimatedNavLink key={item.href} {...item} />
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden md:flex items-center md:gap-2 lg:gap-6">
             

              {/* Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                
              </motion.button>

              {user ? (
                <UserDropdown user={user} onSignOut={handleSignOut} />
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/signin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      Sign In
                    </motion.button>
                  </Link>
                  <Link href="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2 rounded-lg bg-linear-to-r from-[#0047FF] to-[#7B2FFF] text-white font-medium shadow-lg hover:shadow-[#0047FF]/50 transition-all"
                    >
                      Sign Up
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative w-10 h-10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaTimes className="text-xl" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaBars className="text-xl" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <MobileMenu 
              items={filteredNavItems}
              user={user}
              onClose={() => setIsMenuOpen(false)}
              onSignOut={handleSignOut}
            />
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}