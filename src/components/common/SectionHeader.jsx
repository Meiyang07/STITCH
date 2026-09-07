import { motion } from 'framer-motion';

export default function SectionHeader({ label, title, copy, align = 'left', dark = false, className = '' }) {
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65 }}
      className={`${centered ? 'mx-auto text-center' : ''} ${className}`}
    >
      {label && <p className={`eyebrow ${dark ? 'text-[#c3a674]' : ''}`}>{label}</p>}
      <h2 className={`section-title mt-5 text-balance ${dark ? 'text-cream' : 'text-ink'}`}>{title}</h2>
      {copy && <p className={`mt-6 max-w-2xl text-sm leading-7 ${centered ? 'mx-auto' : ''} ${dark ? 'text-white/60' : 'text-muted'}`}>{copy}</p>}
    </motion.div>
  );
}
