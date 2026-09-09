import { Heart, Menu, Search, UserRound } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';
import { useWishlist } from '../../context/WishlistContext';
import SearchOverlay from '../common/SearchOverlay';
import MobileMenu from './MobileMenu';

const links = [
  ['Bespoke', '/bespoke'],
  ['Collections', '/collections'],
  ['Wedding', '/wedding'],
  ['Fabrics', '/fabrics'],
  ['Our Craft', '/craftsmanship'],
  ['Our Story', '/story'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  const { wishlist } = useWishlist();
  const overlayRoutes = ['/', '/bespoke', '/wedding', '/craftsmanship', '/story'];
  const transparent = overlayRoutes.includes(pathname) && !scrolled;


  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${transparent ? 'bg-transparent text-white' : 'border-b border-black/10 bg-cream/95 text-ink shadow-[0_8px_30px_rgba(17,17,17,.035)] backdrop-blur-md'}`}>
        <div className={`mx-auto flex max-w-[1440px] items-center justify-between px-5 transition-[height] duration-500 sm:px-8 lg:px-10 ${scrolled ? 'h-[68px]' : 'h-[76px]'}`}>
          <Link to="/" className="focus-lux group flex items-center gap-3">
            <span className="font-serif text-[22px] uppercase tracking-[.2em] sm:text-[25px]">{siteConfig.brandName}</span>
            <span className={`hidden border-l pl-3 text-[8px] uppercase tracking-[.22em] sm:block ${transparent ? 'border-white/30 text-white/50' : 'border-black/15 text-muted'}`}>
              Pokhara<br />Bespoke
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `focus-lux relative py-2 text-[10px] uppercase tracking-[.17em] transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:text-gold hover:after:scale-x-100 ${isActive ? 'text-gold after:scale-x-100' : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search STITCH"
              aria-haspopup="dialog"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
              className="focus-lux p-2 transition-opacity hover:opacity-65"
              title="Search (⌘K)"
            >
              <Search size={18} strokeWidth={1.6} />
            </button>
            <Link aria-label={`Wishlist with ${wishlist.length} items`} to="/wishlist" className="focus-lux relative p-2 transition-opacity hover:opacity-65">
              <Heart size={18} strokeWidth={1.6} />
              {wishlist.length > 0 && (
                <span className="absolute right-0 top-0 min-w-4 bg-gold px-1 text-center text-[9px] leading-4 text-white">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link aria-label="Profile" to="/profile" className="focus-lux hidden p-2 transition-opacity hover:opacity-65 sm:block">
              <UserRound size={18} strokeWidth={1.6} />
            </Link>
            <Link
              to="/appointment"
              className={`focus-lux ml-2 hidden border px-4 py-2.5 text-[10px] uppercase tracking-[.17em] transition-colors md:block ${
                transparent ? 'border-white/55 hover:border-gold hover:text-gold' : 'border-ink/75 hover:border-gold hover:text-gold'
              }`}
            >
              Book a Fitting
            </Link>
            <button aria-label="Open navigation menu" onClick={() => setMenuOpen(true)} className="focus-lux p-2 transition-opacity hover:opacity-65 lg:hidden">
              <Menu size={22} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
