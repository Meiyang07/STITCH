import { motion } from 'framer-motion';
import { ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

export default function CollectionCard({ item, editorial = false, className = '' }) {
  const { toggle, has } = useWishlist();
  const saved = item.id ? has(item.id, 'style') : false;
  const path = item.slug ? `/style/${item.slug}` : item.path;

  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .55 }} className={`group ${className}`}>
      <div className={`relative overflow-hidden border border-black/8 bg-[#f7f4ee] ${editorial ? 'aspect-[4/5]' : 'aspect-[4/5]'}`}>
        <Link to={path} aria-label={`Explore ${item.name}`} className="block h-full">
          <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-contain p-5 sm:p-7 transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        </Link>
        {item.id && (
          <button
            onClick={() => toggle({ id: item.id, kind: 'style', name: item.name, image: item.image, slug: item.slug, price: item.price })}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`focus-lux absolute right-3 top-3 flex h-10 w-10 items-center justify-center border border-black/10 bg-cream/92 backdrop-blur ${saved ? 'text-gold' : 'text-ink'}`}
          >
            <Heart size={17} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.6}/>
          </button>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-5 border-t border-black/15 pt-4">
        <div>
          {item.category && <p className="text-[9px] uppercase tracking-[.18em] text-gold">{item.category}</p>}
          <h3 className="mt-1 font-serif text-[28px] leading-tight sm:text-[31px]">{item.name}</h3>
          {item.description && <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{item.description}</p>}
          {item.price && <p className="mt-4 text-[11px] font-medium tracking-wide">From Rs. {item.price.toLocaleString()}</p>}
        </div>
        <Link to={path} aria-label={`Open ${item.name}`} className="focus-lux mt-1 p-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
          <ArrowUpRight size={18} strokeWidth={1.5}/>
        </Link>
      </div>
    </motion.article>
  );
}
