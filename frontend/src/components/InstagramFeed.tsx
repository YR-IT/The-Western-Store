import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import {
  Instagram,
  ExternalLink,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  Video,
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { InstagramPost } from '../types';

interface VideoReelCardProps {
  post: InstagramPost;
  index: number;
}

const VideoReelCard: React.FC<VideoReelCardProps> = ({ post, index }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Video source - prefer videoUrl or reelUrl (if direct file)
  const videoSrc = post.videoUrl || post.reelUrl || '';
  const posterSrc = post.thumbnail || post.image;

  // 1. Lookahead prefetch: Attach src when within 400px of viewport to buffer early without wasting bandwidth
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !videoSrc) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: '400px 0px 400px 0px', threshold: 0 }
    );

    loadObserver.observe(el);
    return () => loadObserver.disconnect();
  }, [videoSrc]);

  // 2. Play/Pause controller: Autoplay only when actually visible in viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !videoSrc) return;

    if (!('IntersectionObserver' in window)) return;

    const playObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const vid = videoRef.current;
        if (!vid) return;

        if (entry?.isIntersecting) {
          vid.play().catch(() => {});
        } else {
          if (!vid.paused) {
            vid.pause();
          }
        }
      },
      { threshold: 0.2 }
    );

    playObserver.observe(el);
    return () => playObserver.disconnect();
  }, [videoSrc, shouldLoad]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid) return;
    const newMuted = !vid.muted;
    vid.muted = newMuted;
    setIsMuted(newMuted);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onClick={togglePlay}
      className="group relative flex flex-col justify-between bg-black rounded-2xl overflow-hidden border border-[#E8DFD1] shadow-sm hover:shadow-2xl hover:border-[#721B29]/50 transition-all duration-300 aspect-[9/16] w-full cursor-pointer select-none"
    >
      {/* Background Video Player */}
      <div className="absolute inset-0 w-full h-full bg-[#1A1415] flex items-center justify-center overflow-hidden">
        {videoSrc && !hasError ? (
          <video
            ref={videoRef}
            src={shouldLoad ? videoSrc : undefined}
            poster={posterSrc}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            onError={() => setHasError(true)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        ) : (
          /* Fallback for Empty Video */
          <div className="relative w-full h-full bg-gradient-to-b from-[#2A1E20] via-[#1F1718] to-[#120D0E] flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] flex items-center justify-center text-white mb-3 shadow-lg ring-4 ring-white/10">
              <Video className="w-6 h-6" />
            </div>
            <span className="font-serif font-bold text-white text-sm mb-1 line-clamp-1">
              {post.title || 'Boutique Video'}
            </span>
          </div>
        )}
      </div>

      {/* Top Floating Mute / Unmute Audio Toggle */}
      <div className="relative z-20 p-3.5 flex items-center justify-end pointer-events-none">
        <button
          type="button"
          onClick={toggleMute}
          className="pointer-events-auto p-2 rounded-full bg-black/50 text-white/90 hover:text-white hover:bg-black/75 backdrop-blur-md transition-all shadow-md active:scale-95 cursor-pointer border border-white/15 opacity-80 group-hover:opacity-100"
          title={isMuted ? 'Unmute video audio' : 'Mute audio'}
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-amber-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
        </button>
      </div>

      {/* Center Play/Pause Overlay Indicator (shows when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black/35 backdrop-blur-[1px] animate-in fade-in duration-200">
          <div className="w-14 h-14 rounded-full bg-black/75 text-white flex items-center justify-center shadow-2xl border border-white/20">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const InstagramFeed: React.FC = () => {
  const { instagramPosts, instagramHandle, homeSections } = useStore();

  const sec = homeSections.find((s) => s.id === 'instagram' || s.type === 'instagram');
  const tagline = sec?.tagline || instagramHandle || '@the_western_store_kkr';
  const title = sec?.title || 'Trending On Instagram Reels';
  const subtitle =
    sec?.subtitle ||
    'Watch real drape trials, bridal styling sessions, and packaging videos live from our Kurukshetra boutique.';

  return (
    <section
      id="instagram-feed"
      className="py-18 sm:py-24 bg-[#FAF7F2] text-[#242120] border-t border-[#EAE2D2] relative overflow-hidden"
    >
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-35 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-[#B8860B]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#721B29]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b border-[#EAE2D2]">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF0E1] border border-[#EADBBD] text-[#8F6808] text-[11px] font-bold uppercase tracking-widest mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{tagline}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#242120] tracking-tight">
              {title}
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[#736B63] font-normal max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#721B29] hover:bg-[#59141F] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all self-start md:self-auto shrink-0 active:scale-95"
          >
            <Instagram className="w-4 h-4 text-white" />
            <span>Follow {instagramHandle || '@the_western_store_kkr'}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </a>
        </div>

        {/* Video Reels Grid (Vertical 9:16 Auto-Play Muted Smartphone Showcase) */}
        {instagramPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EAE4D9] shadow-xs">
            <Video className="w-10 h-10 text-[#B8860B] mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-[#242120]">No Videos Uploaded Yet</h3>
            <p className="text-xs text-[#736B63] mt-1">
              Upload videos via the Admin Panel to showcase them here with instant autoplay.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {instagramPosts.map((post, idx) => (
              <VideoReelCard key={post.id || idx} post={post} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
