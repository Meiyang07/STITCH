import { motion } from 'framer-motion';
import { ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

export default function CollectionCard({ item, editorial = false, className = '' }) {
  const { toggle, has } = useWishlist();
  const saved = item.id ? has(item.id, 'style') : false;
  const path = item.slug ? `/style/${item.slug}` : item.path;
  return (
    <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .55 }} className={`group ${className}`}>
      <div className={`relative overflow-hidden bg-warm ${editorial ? 'aspect-[4/5]' : 'aspect-[4/5]'}`}>
        <Link to={path} aria-label={`Explore ${item.name}`}><img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" /></Link>
        {item.id && <button onClick={() => toggle({ id: item.id, kind: 'style', name: item.name, image: item.image, slug: item.slug, price: item.price })} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} className={`focus-lux absolute right-4 top-4 flex h-10 w-10 items-center justify-center bg-cream/90 backdrop-blur ${saved ? 'text-gold' : 'text-ink'}`}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 border-t border-black/15 pt-4">
        <div><h3 className="font-serif text-2xl sm:text-3xl">{item.name}</h3>{item.category && <p className="mt-1 text-[10px] uppercase tracking-[.18em] text-muted">{item.category}</p>}{item.description && <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{item.description}</p>}{item.price && <p className="mt-3 text-xs font-medium">From NPR {item.price.toLocaleString()}</p>}</div>
        <Link to={path} aria-label={`Open ${item.name}`} className="focus-lux mt-1 p-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"><ArrowUpRight size={18} /></Link>
      </div>
    </motion.article>
  );
}
