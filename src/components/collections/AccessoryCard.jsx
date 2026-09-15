import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Heart, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { getInventoryItemByName } from '../../utils/adminStorage';

export default function AccessoryCard({ item, onOpen }) {
  const { toggle, has } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const saved = has(item.id, 'accessory');
  const inventoryItem = getInventoryItemByName(item.name);
  const stock = Math.max(0, Number(inventoryItem?.stock || 0));
  const available = stock > 0;

  const cartItem = { id: item.id, kind: 'accessory', name: item.name, image: item.image, price: item.price, slug: item.slug, path: `/accessories?item=${item.slug}` };
  const saveItem = () => toggle({ ...cartItem });
  const addToCart = () => {
    if (!available) return;
    addItem(cartItem, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };
  const handleImageError = (event) => {
    const img = event.currentTarget;
    if (item.fallbackImage && img.src !== item.fallbackImage) img.src = item.fallbackImage;
    else if (!img.src.endsWith('/images/fallback-product.svg')) img.src = '/images/fallback-product.svg';
  };

  return (
    <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .5 }} className="group">
      <div className="relative aspect-[4/5] overflow-hidden border border-black/8 bg-[#f7f4ee]">
        <button type="button" onClick={() => onOpen(item)} className="h-full w-full" aria-label={`View ${item.name} details`}>
          <img src={item.image} alt={item.name} loading="lazy" onError={handleImageError} className="h-full w-full object-contain p-5 sm:p-7 transition-transform duration-700 ease-out group-hover:scale-[1.045]" />
        </button>
        <span className={`absolute left-3 top-3 z-10 border px-3 py-2 text-[9px] font-medium uppercase tracking-[.14em] backdrop-blur ${available ? 'border-emerald-800/25 bg-cream/95 text-emerald-800' : 'border-red-900/20 bg-cream/95 text-red-900'}`}>
          {available ? 'Available' : 'Not Available'}
        </span>
        <button type="button" onClick={saveItem} aria-label={saved ? `Remove ${item.name} from wishlist` : `Save ${item.name}`} className={`focus-lux absolute right-3 top-3 flex h-10 w-10 items-center justify-center border border-black/10 bg-cream/92 backdrop-blur ${saved ? 'text-gold' : 'text-ink'}`}>
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.6}/>
        </button>
      </div>
      <div className="mt-4 border-t border-black/15 pt-4">
        <p className="text-[9px] uppercase tracking-[.18em] text-gold">{item.category}</p>
        <div className="mt-1 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-[27px] leading-tight sm:text-[29px]">{item.name}</h3>
            <p className="mt-2 text-xs leading-5 text-muted">{item.material} · {item.color}</p>
            <p className="mt-3 text-[11px] font-medium tracking-wide">Rs. {item.price.toLocaleString()}</p>
            <p className={`mt-3 inline-flex items-center gap-2 text-[10px] uppercase tracking-[.14em] ${available ? 'text-emerald-800' : 'text-red-900'}`}><ShoppingBag size={13}/> {available ? 'Available' : 'Not Available'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={addToCart} disabled={!available} className="focus-lux inline-flex items-center gap-2 border border-ink bg-ink px-3.5 py-2.5 text-[9px] uppercase tracking-[.14em] text-white transition hover:bg-gold hover:border-gold disabled:cursor-not-allowed disabled:border-black/15 disabled:bg-transparent disabled:text-muted">
                {available ? (added ? <Check size={13}/> : <ShoppingBag size={13}/>) : <ShoppingBag size={13}/>} {available ? (added ? 'Added' : 'Add to Cart') : 'Not Available'}
              </button>
              <button type="button" onClick={() => onOpen(item)} className="focus-lux border border-black/20 px-3.5 py-2.5 text-[9px] uppercase tracking-[.14em] transition hover:border-gold hover:text-gold">Details</button>
            </div>
          </div>
          <button type="button" onClick={() => onOpen(item)} className="focus-lux mt-1 p-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-label={`Open ${item.name}`}><ArrowUpRight size={18} strokeWidth={1.5}/></button>
        </div>
      </div>
    </motion.article>
  );
}
