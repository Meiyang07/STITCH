import { motion } from 'framer-motion';
import ImageSlot from './ImageSlot';

export default function ImageReveal({ src, alt, className = '', imgClassName = '', eager = false, placeholderLabel = 'Add image' }) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className={`overflow-hidden bg-warm ${className}`}
    >
      {src ? (
        <motion.img
          initial={{ scale: 1.06 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <ImageSlot label={placeholderLabel} />
      )}
    </motion.div>
  );
}
