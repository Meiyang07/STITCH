import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const { toast } = useWishlist();
  useEffect(() => {
    const titles = {
      '/': 'Premium Bespoke Tailoring in Nepal | Stitch',
      '/bespoke': 'Bespoke Suits in Kathmandu | Stitch',
      '/collections': 'Tailored Collections | Stitch',
      '/wedding': 'Wedding Suits in Nepal | Stitch',
      '/fabrics': 'Premium Suit Fabrics | Stitch',
      '/craftsmanship': 'Bespoke Craftsmanship | Stitch',
      '/story': 'Our Story | Stitch',
      '/appointment': 'Book a Tailoring Appointment | Stitch',
      '/measurements': 'Measurement Guide | Stitch',
      '/wishlist': 'Wishlist | Stitch',
      '/contact': 'Custom Tailoring Kathmandu | Stitch',
      '/faq': 'Tailoring FAQs | Stitch'
    };
    document.title = titles[location.pathname] || (location.pathname.startsWith('/style/') ? 'Bespoke Style | Stitch' : 'Stitch — Bespoke Tailoring');
  }, [location.pathname]);
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <motion.div key={`loader-${location.pathname}`} initial={{ scaleX: 0 }} animate={{ scaleX: [0, .65, 1] }} transition={{ duration: .45 }} className="fixed left-0 right-0 top-0 z-[120] h-[2px] origin-left bg-gold" />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="focus-lux fixed bottom-5 right-5 z-30 hidden h-11 w-11 items-center justify-center border border-black/20 bg-cream/90 backdrop-blur md:flex"><ArrowUp size={17} /></button>
      <a href="/appointment" className="fixed inset-x-4 bottom-4 z-40 bg-ink px-5 py-4 text-center text-[10px] uppercase tracking-[.2em] text-white shadow-soft md:hidden">Book Appointment</a>
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-20 left-1/2 z-[80] -translate-x-1/2 bg-ink px-5 py-3 text-xs text-white shadow-soft md:bottom-6">{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
