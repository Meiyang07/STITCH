import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const { toast } = useWishlist();
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.22 });

  useEffect(() => {
    const titles = {
      '/': 'Premium Bespoke Tailoring in Nepal | Stitch',
      '/bespoke': 'Bespoke Suits in Pokhara | Stitch',
      '/collections': 'Tailored Collections | Stitch',
      '/wedding': 'Wedding Suits in Nepal | Stitch',
      '/fabrics': 'Suit & Traditional Fabrics | Stitch',
      '/craftsmanship': 'Bespoke Craftsmanship | Stitch',
      '/story': 'Our Story | Stitch',
      '/appointment': 'Book a Tailoring Appointment | Stitch',
      '/profile': 'Profile | Stitch',
      '/login': 'Login | Stitch',
      '/signup': 'Create Account | Stitch',
      '/measurements': 'Measurement Guide | Stitch',
      '/wishlist': 'Wishlist | Stitch',
      '/contact': 'Custom Tailoring Pokhara | Stitch',
      '/faq': 'Tailoring FAQs | Stitch',
    };
    document.title = titles[location.pathname] || (location.pathname.startsWith('/style/') ? 'Bespoke Style | Stitch' : 'Stitch — Bespoke Tailoring');
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <motion.div style={{ scaleX: progress }} className="fixed left-0 right-0 top-0 z-[120] h-[2px] origin-left bg-gold" />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />

      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="focus-lux fixed bottom-5 right-5 z-30 hidden h-11 w-11 items-center justify-center border border-black/15 bg-cream/92 backdrop-blur md:flex"
          >
            <ArrowUp size={16} strokeWidth={1.6}/>
          </motion.button>
        )}
      </AnimatePresence>

      <Link to="/appointment" className="fixed inset-x-4 bottom-4 z-40 border border-white/10 bg-ink px-5 py-4 text-center text-[10px] uppercase tracking-[.2em] text-white shadow-soft md:hidden">Book a Fitting</Link>
      <AnimatePresence>{toast && <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="fixed bottom-20 left-1/2 z-[80] -translate-x-1/2 bg-ink px-5 py-3 text-xs text-white shadow-soft md:bottom-6">{toast}</motion.div>}</AnimatePresence>
    </div>
  );
}
