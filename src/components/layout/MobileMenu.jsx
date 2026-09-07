import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';

const links = [
  ['Bespoke', '/bespoke'], ['Collections', '/collections'], ['Wedding', '/wedding'], ['Fabrics', '/fabrics'], ['Our Craft', '/craftsmanship'], ['Our Story', '/story'], ['Contact', '/contact']
];

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-ink text-cream lg:hidden">
          <div className="container-lux flex h-full flex-col py-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <Link to="/" onClick={onClose} className="font-serif text-2xl uppercase tracking-[.18em]">{siteConfig.brandName}</Link>
              <button className="focus-lux p-2" aria-label="Close menu" onClick={onClose}><X /></button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1">
              {links.map(([label, to], i) => (
                <motion.div key={to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .06 * i }}>
                  <Link to={to} onClick={onClose} className="block py-2 font-serif text-4xl sm:text-5xl">{label}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="border-t border-white/15 pt-6 text-xs leading-6 text-white/60">
              <p>{siteConfig.phone}</p><p>{siteConfig.address}</p>
              <div className="mt-4 flex gap-5 uppercase tracking-[.16em]"><a href={siteConfig.instagram}>Instagram</a><a href={siteConfig.facebook}>Facebook</a><a href={siteConfig.tiktok}>TikTok</a></div>
              <Link to="/appointment" onClick={onClose} className="mt-6 block border border-gold px-5 py-4 text-center text-[11px] uppercase tracking-[.2em] text-gold">Book Appointment</Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
