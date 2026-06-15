'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp,
  FaVolumeMute, FaRedo, FaHeartbeat
} from 'react-icons/fa';



interface VideoPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  subtitle?: string;
}


function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}



function EcgPulse({ playing }: { playing: boolean }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden pointer-events-none opacity-30">
      <svg viewBox="0 0 800 32" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          d="M0,16 L120,16 L140,16 L155,4 L168,28 L180,1 L193,28 L206,16 L360,16 L380,16 L395,4 L408,28 L420,1 L433,28 L446,16 L600,16 L620,16 L635,4 L648,28 L660,1 L673,28 L686,16 L800,16"
          fill="none"
          stroke="url(#ecgFoot)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: playing ? 1 : 0.3 }}
          transition={{ duration: playing ? 2 : 1, ease: 'easeInOut', repeat: playing ? Infinity : 0, repeatDelay: 0.5 }}
        />
        <defs>
          <linearGradient id="ecgFoot" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0047FF" stopOpacity="0" />
            <stop offset="40%" stopColor="#0047FF" />
            <stop offset="70%" stopColor="#00C5A8" />
            <stop offset="100%" stopColor="#7B2FFF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}



function ProgressBar({
  progress,
  buffered,
  onSeek,
}: {
  progress: number;
  buffered: number;
  onSeek: (pct: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const getPercent = (e: React.MouseEvent) => {
    if (!trackRef.current) return 0;
    const r = trackRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
  };

  return (
    <div
      ref={trackRef}
      className="relative h-1 group cursor-pointer"
      onClick={(e) => onSeek(getPercent(e))}
      onMouseMove={(e) => setHoverPct(getPercent(e))}
      onMouseLeave={() => setHoverPct(null)}
    >
      {/* Track */}
      <div className="absolute inset-0 rounded-full bg-white/10" />

      {/* Buffered */}
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-white/20 transition-all"
        style={{ width: `${buffered * 100}%` }}
      />

      {/* Played */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          width: `${progress * 100}%`,
          background: 'linear-gradient(90deg, #0047FF, #00C5A8)',
        }}
      />

      {/* Hover ghost */}
      {hoverPct !== null && (
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-white/10"
          style={{ width: `${hoverPct * 100}%` }}
        />
      )}

      {/* Thumb */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          left: `calc(${progress * 100}% - 6px)`,
          boxShadow: '0 0 10px #0047FF',
        }}
      />
    </div>
  );
}



function VolumeSlider({ volume, onChange }: { volume: number; onChange: (v: number) => void }) {
  const [visible, setVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const seek = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const r = trackRef.current.getBoundingClientRect();
    onChange(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
  };

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <button onClick={() => onChange(volume > 0 ? 0 : 1)} className="text-white/70 hover:text-white transition-colors text-sm">
        {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={trackRef}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 60, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative h-1 cursor-pointer overflow-hidden rounded-full"
            onClick={seek}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${volume * 100}%`,
                background: 'linear-gradient(90deg, #0047FF, #00C5A8)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


interface Ripple {
  id: number;
  x: number;
  y: number;
}


export default function VideoPoster({
  src = '/postervideo.mp4',
  poster,
  title = 'e-MedCare Hub System',
  subtitle = 'Smart Digital Healthcare Management',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [ended, setEnded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [loaded, setLoaded] = useState(false);

  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - r.left) / r.width - 0.5);
    mouseY.set((e.clientY - r.top) / r.height - 0.5);
  };
  const resetTilt = () => { mouseX.set(0); mouseY.set(0); };

 
  const resetHideTimer = () => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setControlsVisible(false), 2800);
    }
  };

  useEffect(() => {
    let raf: number | null = null;
    if (!playing) {
      // defer state update to avoid synchronous setState inside effect
      raf = requestAnimationFrame(() => setControlsVisible(true));
    }
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [playing]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTime = () => {
      setCurrentTime(v.currentTime);
      setProgress(v.duration ? v.currentTime / v.duration : 0);
    };
    const onDuration = () => setDuration(v.duration);
    const onEnded = () => { setPlaying(false); setEnded(true); };
    const onProgress = () => {
      if (v.buffered.length) {
        setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
      }
    };
    const onLoaded = () => setLoaded(true);

    v.addEventListener('timeupdate', onTime);
    v.addEventListener('durationchange', onDuration);
    v.addEventListener('ended', onEnded);
    v.addEventListener('progress', onProgress);
    v.addEventListener('canplay', onLoaded);

    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('durationchange', onDuration);
      v.removeEventListener('ended', onEnded);
      v.removeEventListener('progress', onProgress);
      v.removeEventListener('canplay', onLoaded);
    };
  }, []);


  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);


  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);



  const togglePlay = (e?: React.MouseEvent) => {
    const v = videoRef.current;
    if (!v) return;

    // Ripple
    if (e && containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      setTimeout(() => setRipples((prev) => prev.filter((rr) => rr.id !== id)), 700);
    }

    if (ended) {
      v.currentTime = 0;
      setEnded(false);
      v.play();
      setPlaying(true);
    } else if (playing) {
      v.pause();
      setPlaying(false);
    } else {
      v.play();
      setPlaying(true);
      resetHideTimer();
    }
  };

  const seek = (pct: number) => {
    if (!videoRef.current || !duration) return;
    videoRef.current.currentTime = pct * duration;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1200 }}
      onMouseMove={(e) => { handleMouseMove(e); resetHideTimer(); }}
      onMouseLeave={resetTilt}
      className="relative w-full max-w-4xl mx-auto select-none"
    >

      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-xl pointer-events-none"
        animate={{
          opacity: playing ? 0.6 : 0.2,
          background: playing
            ? 'linear-gradient(135deg, #0047FF, #7B2FFF, #00C5A8)'
            : 'linear-gradient(135deg, #0047FF40, #7B2FFF40)',
        }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative rounded-2xl overflow-hidden bg-[#020508] border border-white/10">

        <AnimatePresence>
          {!loaded && (
            <motion.div
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center"
              style={{ background: '#020508' }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-14 h-14">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#0047FF]/30"
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-t border-[#0047FF]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <div className="absolute inset-3 flex items-center justify-center text-[#00C5A8]">
                    <FaHeartbeat className="animate-pulse" />
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-bold">Loading</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

     
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          preload="metadata"
          className="w-full h-auto block"
          onClick={togglePlay}
          style={{ cursor: 'pointer' }}
        />


        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #020508ee 0%, transparent 40%, transparent 70%, #020508aa 100%)' }}
        />


        <motion.div
          animate={{ opacity: controlsVisible ? 1 : 0, y: controlsVisible ? 0 : -8 }}
          transition={{ duration: 0.25 }}
          className="absolute top-0 left-0 right-0 p-5 pointer-events-none"
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-5 h-5 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0047FF, #7B2FFF)' }}
            >
              <FaHeartbeat className="text-white text-[9px]" />
            </motion.div>
            <div>
              <p className="text-white font-black text-sm leading-tight">{title}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{subtitle}</p>
            </div>
          </div>
        </motion.div>

  
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={togglePlay}
          style={{ cursor: 'pointer' }}
        >
          {/* Ripples */}
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              className="absolute rounded-full border border-white/30 pointer-events-none"
              style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 120, height: 120, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            />
          ))}

          <AnimatePresence>
            {!playing && !ended && (
              <motion.div
                key="play-btn"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.3, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full blur-2xl opacity-60"
                  style={{ background: '#0047FF' }} />
                <div className="relative w-18 h-18 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md"
                  style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.1)' }}>
                  <FaPlay className="text-white text-2xl ml-1" />
                </div>
              </motion.div>
            )}
            {ended && (
              <motion.div
                key="replay-btn"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.3, opacity: 0 }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full blur-2xl opacity-60"
                  style={{ background: '#00C5A8' }} />
                <div className="relative flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md"
                    style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <FaRedo className="text-white text-xl" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">Replay</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        <EcgPulse playing={playing} />

        <motion.div
          animate={{ opacity: controlsVisible ? 1 : 0, y: controlsVisible ? 0 : 10 }}
          transition={{ duration: 0.25 }}
          className="absolute bottom-0 left-0 right-0 p-4 pb-5 space-y-3"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress bar */}
          <ProgressBar progress={progress} buffered={buffered} onSeek={seek} />

          {/* Control row */}
          <div className="flex items-center justify-between">
            {/* Left controls */}
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => togglePlay()}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #0047FF, #7B2FFF)' }}
              >
                {ended
                  ? <FaRedo className="text-xs" />
                  : playing
                    ? <FaPause className="text-xs" />
                    : <FaPlay className="text-xs ml-0.5" />
                }
              </motion.button>

              {/* Volume */}
              <VolumeSlider
                volume={muted ? 0 : volume}
                onChange={(v) => { setVolume(v); setMuted(v === 0); }}
              />

              {/* Time */}
              <span className="text-[11px] text-gray-400 font-mono tabular-nums">
                {formatTime(currentTime)}{' '}
                <span className="text-gray-700">/</span>{' '}
                {formatTime(duration)}
              </span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Status pill */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-white/5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: playing ? '#00C5A8' : '#FF3C6E' }}
                  animate={{ scale: playing ? [1, 1.4, 1] : 1, opacity: playing ? [1, 0.5, 1] : 0.5 }}
                  transition={{ duration: 1.2, repeat: playing ? Infinity : 0 }}
                />
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
                  {playing ? 'Live' : 'Paused'}
                </span>
              </div>

              {/* Fullscreen */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
              >
                {fullscreen ? <FaCompress className="text-xs" /> : <FaExpand className="text-xs" />}
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>

      <div
        className="w-full h-12 mt-0.5 rounded-b-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,71,255,0.06), transparent)',
          maskImage: 'linear-gradient(to bottom, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
          transform: 'scaleY(-1)',
          filter: 'blur(2px)',
        }}
      />
    </motion.div>
  );
}