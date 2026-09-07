import { Heart, Menu, Search, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';
import { useWishlist } from '../../context/WishlistContext';
import MobileMenu from './MobileMenu';

const links = [
  ['Bespoke', '/bespoke'], 
  ['Collections', '/collections'], 
  ['Wedding', '/wedding'], 
  ['Fabrics', '/fabrics'], 
  ['Our Craft', '/craftsmanship'], 
  ['Our Story', '/story']
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { wishlist } = useWishlist();
  const overlayRoutes = ['/', '/bespoke', '/wedding', '/craftsmanship', '/story'];
  const transparent = overlayRoutes.includes(pathname) && !scrolled;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    fn(); window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${transparent ? 'bg-transparent text-white' : 'border-b border-black/10 bg-cream/95 text-ink backdrop-blur-sm'}`}>
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link to="/" className="focus-lux font-serif text-xl uppercase tracking-[.18em] sm:text-2xl">
            {siteConfig.brandName}
          </Link>
          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
            {links.map(([label, to]) => (
              <NavLink 
                key={to} 
                to={to} 
                className={({ isActive }) => 
                  `focus-lux text-[10px] uppercase tracking-[.16em] transition-colors hover:text-gold ${isActive ? 'text-gold' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <Link 
              aria-label="Search collections" 
              to="/collections" 
              className="focus-lux hidden p-2 transition-opacity hover:opacity-70 sm:block"
            >
              <Search size={18} strokeWidth={1.8} />
            </Link>
            <Link 
              aria-label={`Wishlist with ${wishlist.length} items`} 
              to="/wishlist" 
              className="focus-lux relative p-2 transition-opacity hover:opacity-70"
            >
              <Heart size={18} strokeWidth={1.8} />
              {wishlist.length > 0 && (
                <span className="absolute right-0 top-0 min-w-4 rounded-full bg-gold px-1 text-center text-[9px] leading-4 text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link 
              aria-label="Account" 
              to="/measurements" 
              className="focus-lux hidden p-2 transition-opacity hover:opacity-70 sm:block"
            >
              <UserRound size={18} strokeWidth={1.8} />
            </Link>
            <Link 
              to="/appointment" 
              className={`focus-lux ml-2 hidden border px-4 py-2.5 text-[10px] uppercase tracking-[.16em] transition-colors md:block ${
                transparent 
                  ? 'border-white/60 hover:border-gold hover:text-gold' 
                  : 'border-ink hover:border-gold hover:text-gold'
              }`}
            >
              Book Appointment
            </Link>
            <button 
              aria-label="Open navigation menu" 
              onClick={() => setMenuOpen(true)} 
              className="focus-lux p-2 transition-opacity hover:opacity-70 lg:hidden"
            >
              <Menu size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
