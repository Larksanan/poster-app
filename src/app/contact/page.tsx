 'use client';
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { 
  doc, 
  getDoc, 
  addDoc, 
  collection, 
  serverTimestamp 
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  FaEnvelope, 
  FaUser, 
  FaComment, 
  FaPaperPlane, 
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowLeft,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaHeartbeat
} from 'react-icons/fa';


export default function ContactPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  const [form, setForm] = useState({
    username: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setForm((prev) => ({ ...prev, email: user.email || '' }));
        
        // Try to fetch username from Firestore if available
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setForm((prev) => ({ 
              ...prev, 
              username: userData.displayName || user.displayName || user.email?.split('@')[0] || '' 
            }));
          } else {
            setForm((prev) => ({ 
              ...prev, 
              username: user.displayName || user.email?.split('@')[0] || '' 
            }));
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      } else {
        setUser(null);
        router.push('/signin');
      }
      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    
    if (form.message.length < 10) {
      setError('Message must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await addDoc(collection(db, 'contacts'), {
        username: form.username.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        timestamp: serverTimestamp(),
        userId: user!.uid,
        status: 'unread'
      });
      
      setSuccess(true);
      setForm({ 
        username: user!.displayName || user!.email?.split('@')[0] || '', 
        email: user!.email || '', 
        message: '' 
      });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      if (err instanceof FirebaseError) {
        setError(`Failed to send message: ${err.message}`);
      } else {
        setError('Failed to send message. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="min-h-screen bg-linear-to-br from-[#03060F] via-[#0A0F1A] to-[#1A1F2E] py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-[#0047FF] rounded-full filter blur-[120px] opacity-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-150 h-150 bg-[#00C5A8] rounded-full filter blur-[100px] opacity-5" />
        <div className="absolute top-1/2 left-0 w-100 h-100 bg-[#7B2FFF] rounded-full filter blur-[80px] opacity-5" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 71, 255, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 71, 255, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-linear-to-br from-[#1A1F2E]/90 to-[#0A0F1A]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
          >
            {/* Header */}
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047FF]/20 border border-[#0047FF]/30 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <FaHeartbeat className="text-[#00C5A8] text-xs" />
                <span className="text-xs font-medium text-[#00C5A8]">Get in Touch</span>
              </motion.div>
              
              <h1 className="text-3xl font-bold bg-linear-to-r from-white via-[#00C5A8] to-[#0047FF] bg-clip-text text-transparent mb-2">
                Contact Support
              </h1>
              <p className="text-gray-400 text-sm">
                Have questions or feedback? We&apos;d love to hear from you.
              </p>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-lg bg-[#00C5A8]/10 border border-[#00C5A8]/30 text-[#00C5A8] flex items-center gap-3"
                >
                  <FaCheckCircle className="text-xl" />
                  <span className="text-sm">Message sent successfully! We&apos;ll get back to you soon.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3"
                >
                  <FaExclamationCircle className="text-xl" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative group">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C5A8] transition-colors" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00C5A8] focus:ring-2 focus:ring-[#00C5A8]/20 transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00C5A8] transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                    placeholder="your@email.com"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Email is linked to your account
                </p>
              </div>

              {/* Message Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <div className="relative group">
                  <FaComment className="absolute left-3 top-4 text-gray-500 group-focus-within:text-[#00C5A8] transition-colors" />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00C5A8] focus:ring-2 focus:ring-[#00C5A8]/20 transition-all resize-none"
                    placeholder="How can we help you? Please provide details..."
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    Minimum 10 characters
                  </p>
                  <p className="text-xs text-gray-500">
                    {form.message.length}/500
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg bg-linear-to-r from-[#0047FF] to-[#7B2FFF] text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#0047FF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <FaPaperPlane />
                    </motion.div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Quick Info Cards */}
            <div className="bg-linear-to-br from-[#1A1F2E]/90 to-[#0A0F1A]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Image
                        src="/Logo.jpg"
                        alt="Logo"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        />
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[#0047FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaPhone className="text-[#00C5A8]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-white">+94 76 239 7951</p>
                    <p className="text-xs text-gray-600">Mon-Fri, 9AM-6PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[#0047FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaEnvelope className="text-[#00C5A8]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-white">jebarsanthatcroos@gmail.com</p>
                    <p className="text-xs text-gray-600">24/7 Support</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[#0047FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaMapMarkerAlt className="text-[#00C5A8]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-white"> batticaloa main road,  NO 23 pandiruppu </p>
                    <p className="text-xs text-gray-600"> Sri Lanka</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-[#0047FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FaClock className="text-[#00C5A8]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Response Time</p>
                    <p className="text-sm text-white">Within 24 hours</p>
                    <p className="text-xs text-gray-600">Emergency: Immediate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-linear-to-br from-[#FF3C6E]/10 to-[#7B2FFF]/10 backdrop-blur-xl rounded-2xl border border-[#FF3C6E]/30 p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF3C6E]/20 mb-4">
                <FaHeartbeat className="text-3xl text-[#FF3C6E]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Emergency Support</h3>
              <p className="text-gray-400 text-sm mb-4">
                For medical emergencies, please contact emergency services immediately.
              </p>
              <div className="text-2xl font-bold bg-linear-to-r from-[#FF3C6E] to-[#FF8C00] bg-clip-text text-transparent">
          +94 75 589 8275
              </div>
              <p className="text-xs text-gray-500 mt-2">24/7 Emergency Hotline</p>
            </motion.div>

            {/* Availability Status */}
            <div className="bg-linear-to-br from-[#1A1F2E]/90 to-[#0A0F1A]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white">Support Status</h3>
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#00C5A8]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-xs text-[#00C5A8]">Online</span>
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-[#0047FF] to-[#00C5A8] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Average response time: &lt; 2 hours
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}