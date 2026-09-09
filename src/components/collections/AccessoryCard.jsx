import { motion } from 'framer-motion';
import { ArrowUpRight, Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function AccessoryCard({ item, onOpen }) {
  const { toggle, has } = useWishlist();
  const saved = has(item.id, 'accessory');

  const saveItem = () => toggle({
    id: item.id,
    kind: 'accessory',
    name: item.name,
    image: item.image,
    price: item.price,
    slug: item.slug,
    path: `/accessories?item=${item.slug}`,
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      viewport={{ once: true, amount: .12 }}
      transition={{ duration: .5 }}
      className="group"
    >
      <div className="relative aspect-[4/5] overflow-hidden border border-black/8 bg-white">
        <button type="button" onClick={() => onOpen(item)} className="h-full w-full" aria-label={`View ${item.name} details`}>
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={(event) => { event.currentTarget.src = '/images/fallback-tailoring.svg'; }}
            className="h-full w-full object-contain p-3 sm:p-4 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        </button>
        <button
          type="button"
          onClick={saveItem}
          aria-label={saved ? `Remove ${item.name} from wishlist` : `Save ${item.name}`}
          className={`focus-lux absolute right-3 top-3 flex h-10 w-10 items-center justify-center border border-black/10 bg-cream/92 backdrop-blur ${saved ? 'text-gold' : 'text-ink'}`}
        >
          <Heart size={17} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.6}/>
        </button>
      </div>

      <div className="mt-4 border-t border-black/15 pt-4">
        <p className="text-[9px] uppercase tracking-[.18em] text-gold">{item.category}</p>
        <div className="mt-1 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-serif text-[27px] leading-tight sm:text-[29px]">{item.name}</h3>
            <p className="mt-2 text-xs leading-5 text-muted">{item.material} · {item.color}</p>
            <p className="mt-3 text-[11px] font-medium tracking-wide">From Rs. {item.price.toLocaleString()}</p>
            <button type="button" onClick={() => onOpen(item)} className="focus-lux mt-3 border-b border-black/20 pb-0.5 text-[10px] uppercase tracking-[.14em] transition-colors hover:border-gold hover:text-gold">View Details</button>
          </div>
          <button type="button" onClick={() => onOpen(item)} className="focus-lux mt-1 p-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-label={`Open ${item.name}`}>
            <ArrowUpRight size={18} strokeWidth={1.5}/>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
