import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { fallbackImage } from '../../data/images';

export default function PageHero({ eyebrow, title, copy, image, align = 'left', compact = false, imagePosition = 'center' }) {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.035]);

  const handleError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied === 'true') return;
    event.currentTarget.dataset.fallbackApplied = 'true';
    event.currentTarget.src = fallbackImage;
  };

  return (
    <section ref={sectionRef} className={`relative flex items-end overflow-hidden bg-charcoal ${compact ? 'min-h-[58svh]' : 'min-h-[70svh] lg:min-h-[74svh]'}`}>
      <motion.img
        src={image || fallbackImage}
        alt=""
        onError={handleError}
        style={{ objectPosition: imagePosition, y: imageY, scale: imageScale }}
        className="absolute inset-0 h-[108%] w-full object-cover opacity-[.78] will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/34 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

      <div className={`container-lux relative z-10 pb-14 pt-40 sm:pb-18 lg:pb-20 ${align === 'center' ? 'text-center' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}>
          {eyebrow && <p className="eyebrow text-[#d3b783]">{eyebrow}</p>}
          <h1 className={`display-title mt-5 max-w-5xl text-cream ${align === 'center' ? 'mx-auto' : ''}`}>{title}</h1>
          {copy && <p className={`mt-6 max-w-xl text-[15px] leading-7 text-white/70 ${align === 'center' ? 'mx-auto' : ''}`}>{copy}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .4, duration: .6 }}
          className={`mt-10 flex items-center gap-4 text-[9px] uppercase tracking-[.2em] text-white/42 ${align === 'center' ? 'justify-center' : ''}`}
        >
          <span>Pokhara, Nepal</span><span className="h-px w-8 bg-white/30"/><span>Fittings by appointment</span>
        </motion.div>
      </div>
    </section>
  );
}
