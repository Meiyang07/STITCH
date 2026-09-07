import { motion } from 'framer-motion';

export default function PageHero({ eyebrow, title, copy, image, align = 'left', compact = false }) {
  return (
    <section className={`relative overflow-hidden bg-charcoal ${compact ? 'min-h-[60vh]' : 'min-h-[76vh]'} flex items-end`}>
      {image && <motion.img initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 1.3 }} src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20" />
      <div className={`container-lux relative z-10 pb-14 pt-40 sm:pb-20 ${align === 'center' ? 'text-center' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          {eyebrow && <p className="eyebrow text-[#d3b783]">{eyebrow}</p>}
          <h1 className={`display-title mt-5 max-w-5xl text-cream ${align === 'center' ? 'mx-auto' : ''}`}>{title}</h1>
          {copy && <p className={`mt-6 max-w-xl text-sm leading-7 text-white/70 ${align === 'center' ? 'mx-auto' : ''}`}>{copy}</p>}
        </motion.div>
      </div>
    </section>
  );
}
