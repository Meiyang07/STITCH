import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';

const links = [
  ['Bespoke', '/bespoke'], ['Collections', '/collections'], ['Wedding', '/wedding'], ['Fabrics', '/fabrics'], ['Accessories', '/accessories'],
  ['Our Craft', '/craftsmanship'], ['Our Story', '/story'], ['Profile', '/profile'], ['Measurements', '/measurements'], ['Contact', '/contact'],
];

export default function MobileMenu({ open, onClose }) {
  const socials = [
    ['Instagram', siteConfig.instagram],
    ['Facebook', siteConfig.facebook],
    ['TikTok', siteConfig.tiktok],
  ].filter(([, href]) => href);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-ink text-cream lg:hidden">
          <div className="container-lux flex h-full flex-col py-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <Link to="/" onClick={onClose} className="font-serif text-2xl uppercase tracking-[.2em]">{siteConfig.brandName}</Link>
              <button className="focus-lux p-2" aria-label="Close menu" onClick={onClose}><X strokeWidth={1.6}/></button>
            </div>

            <nav className="no-scrollbar flex flex-1 flex-col justify-center overflow-y-auto py-5">
              {links.map(([label, to], i) => (
                <motion.div key={to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .035 * i }}>
                  <Link to={to} onClick={onClose} className="block border-b border-white/[.07] py-2.5 font-serif text-3xl sm:text-4xl">{label}</Link>
                </motion.div>
              ))}
            </nav>

            <div className="border-t border-white/15 pt-5 text-xs leading-6 text-white/55">
              <div className="flex justify-between gap-5"><span>{siteConfig.address}</span><a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}>{siteConfig.phone}</a></div>
              {socials.length > 0 && <div className="mt-3 flex gap-5 uppercase tracking-[.16em]">{socials.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>)}</div>}
              <Link to="/appointment" onClick={onClose} className="mt-5 block border border-gold px-5 py-3.5 text-center text-[10px] uppercase tracking-[.2em] text-gold">Book a Fitting</Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
