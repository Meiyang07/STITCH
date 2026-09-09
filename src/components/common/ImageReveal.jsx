import { motion } from 'framer-motion';
import { fallbackImage } from '../../data/images';

export default function ImageReveal({ src, alt, className = '', imgClassName = '', eager = false }) {
  const handleError = (event) => {
    if (event.currentTarget.dataset.fallbackApplied === 'true') return;
    event.currentTarget.dataset.fallbackApplied = 'true';
    event.currentTarget.src = fallbackImage;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden bg-warm ${className}`}
    >
      <motion.img
        src={src || fallbackImage}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={handleError}
        whileHover={{ scale: 1.028 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </motion.div>
  );
}
