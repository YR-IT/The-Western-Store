import React from 'react';
import { motion } from 'motion/react';
import { INITIAL_INSTAGRAM_POSTS, STORE_INFO } from '../data/mockData';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';

export const InstagramFeed: React.FC = () => {
  return (
    <motion.section
      id="instagram-feed"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-14 sm:py-18 bg-[#F8F5EE] border-t border-[#EAE4D9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-[#721B29] text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Instagram className="w-4 h-4" />
            <span>Join Our Style Diary</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] tracking-tight">
            Follow Us {STORE_INFO.instagram}
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-[#736B63] font-normal">
            Tag us in your fits from Kurukshetra & beyond for a chance to be featured on our official grid.
          </p>

          <a
            href={STORE_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-gradient-to-r from-[#721B29] to-[#8C2335] text-white text-xs font-semibold rounded-full shadow-sm hover:shadow-md hover:opacity-95 transition-all"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Follow on Instagram</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>

        {/* 6-Grid of tagged customer photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INITIAL_INSTAGRAM_POSTS.map((post) => (
            <a
              key={post.id}
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-lg overflow-hidden bg-[#ECE6DB] border border-[#E0D7C8] block shadow-2xs cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Hover overlay with Instagram stats */}
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-between text-white">
                <div className="flex justify-end">
                  <Instagram className="w-4 h-4 text-white/90" />
                </div>

                <div>
                  <p className="text-[10px] text-white/90 line-clamp-2 mb-2 font-light leading-snug">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-[#E6C280]">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-current" />
                      <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 fill-current" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
