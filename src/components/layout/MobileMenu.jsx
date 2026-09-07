import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';
import { useAuth } from '../../context/AuthContext';

const links = [
  ['Bespoke', '/bespoke'], ['Collections', '/collections'], ['Wedding', '/wedding'], ['Fabrics', '/fabrics'], ['Our Craft', '/craftsmanship'], ['Our Story', '/story'], ['Contact', '/contact']
];

export default function MobileMenu({ open, onClose }) {
  const { session } = useAuth();
  const accountPath = session?.role === 'admin' ? '/admin' : session?.role === 'customer' ? '/account' : '/login';
  const accountLabel = session?.role === 'admin' ? 'Admin Dashboard' : session?.role === 'customer' ? 'My Account' : 'Login';

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] bg-ink text-cream lg:hidden">
          <div className="container-lux flex h-full flex-col py-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <Link to="/" onClick={onClose} className="font-serif text-2xl uppercase tracking-[.18em]">{siteConfig.brandName}</Link>
              <button className="focus-lux p-2" aria-label="Close menu" onClick={onClose}><X /></button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-4">
              {links.map(([label, to], i) => (
                <motion.div key={to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 * i }}>
                  <Link to={to} onClick={onClose} className="block py-1.5 font-serif text-3xl sm:text-4xl">{label}</Link>
                </motion.div>
              ))}
            </nav>
            <div className="border-t border-white/15 pt-5 text-xs leading-6 text-white/60">
              <div className="mb-5 flex gap-3">
                <Link to={accountPath} onClick={onClose} className="border border-white/20 px-4 py-2.5 text-[10px] uppercase tracking-[.16em] text-white">{accountLabel}</Link>
              </div>
              <p>{siteConfig.phone}</p><p>{siteConfig.address}</p>
              <div className="mt-3 flex gap-5 uppercase tracking-[.16em]"><a href={siteConfig.instagram}>Instagram</a><a href={siteConfig.facebook}>Facebook</a><a href={siteConfig.tiktok}>TikTok</a></div>
              <Link to="/appointment" onClick={onClose} className="mt-5 block border border-gold px-5 py-3 text-center text-[11px] uppercase tracking-[.2em] text-gold">Book Appointment</Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
