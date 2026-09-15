import { motion } from 'framer-motion';
import { ArrowUpRight, Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { getInventoryItemByName } from '../../utils/adminStorage';

export default function ReadyMadeCard({ item }) {
  const { toggle, has } = useWishlist();
  const saved = has(item.id, 'readymade');
  const inventoryItem = getInventoryItemByName(item.name);
  const stock = Math.max(0, Number(inventoryItem?.stock || 0));
  const available = stock > 0;

  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .5 }} className="group">
      <div className="relative aspect-[4/5] overflow-hidden border border-black/8 bg-[#f7f4ee]">
        <Link to={`/readymade/${item.slug}`} className="block h-full" aria-label={`View ${item.name}`}>
          <img src={item.image} alt={item.name} loading="lazy" onError={(event) => { event.currentTarget.src = '/images/fallback-product.svg'; }} className="h-full w-full object-contain p-5 sm:p-7 transition-transform duration-700 group-hover:scale-[1.04]" />
        </Link>
        <span className={`absolute left-3 top-3 z-10 border px-3 py-2 text-[9px] font-medium uppercase tracking-[.14em] backdrop-blur ${available ? 'border-emerald-800/25 bg-cream/95 text-emerald-800' : 'border-red-900/20 bg-cream/95 text-red-900'}`}>
          {available ? 'Available' : 'Not Available'}
        </span>
        <button onClick={() => toggle({ id: item.id, kind: 'readymade', name: item.name, image: item.image, slug: item.slug, price: item.price, path: `/readymade/${item.slug}` })} aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'} className={`focus-lux absolute right-3 top-3 flex h-10 w-10 items-center justify-center border border-black/10 bg-cream/92 ${saved ? 'text-gold' : 'text-ink'}`}>
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.6}/>
        </button>
      </div>
      <div className="mt-4 border-t border-black/15 pt-4">
        <p className="text-[9px] uppercase tracking-[.18em] text-gold">{item.gender} · {item.category}</p>
        <div className="mt-1 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-[28px] leading-tight">{item.name}</h3>
            <p className="mt-2 text-xs text-muted">{item.material} · Sizes {item.sizes.join(', ')}</p>
            <p className="mt-3 text-sm font-medium">Rs. {item.price.toLocaleString()}</p>
            <p className={`mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.14em] ${available ? 'text-emerald-800' : 'text-red-900'}`}><ShoppingBag size={13}/> {available ? 'Available' : 'Not Available'}</p>
            {available ? <Link to={`/readymade/${item.slug}`} className="focus-lux mt-4 inline-flex border border-ink bg-ink px-4 py-2.5 text-[9px] uppercase tracking-[.14em] text-white transition hover:border-gold hover:bg-gold">Select Size & Buy</Link> : <span className="mt-4 inline-flex cursor-not-allowed border border-black/15 px-4 py-2.5 text-[9px] uppercase tracking-[.14em] text-muted">Not Available</span>}
          </div>
          <Link to={`/readymade/${item.slug}`} className="focus-lux mt-1 p-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" aria-label={`Open ${item.name}`}><ArrowUpRight size={18} strokeWidth={1.5}/></Link>
        </div>
      </div>
    </motion.article>
  );
}
