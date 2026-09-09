import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function FabricCard({ fabric, onOpen }) {
  const { toggle, has } = useWishlist();
  const saved = has(fabric.id, 'fabric');

  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-warm">
        <button onClick={() => onOpen(fabric)} className="h-full w-full text-left" aria-label={`View ${fabric.name} details`}>
          <img src={fabric.image} alt={`${fabric.name} fabric texture`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]" />
        </button>
        <button
          onClick={() => toggle({ id: fabric.id, kind: 'fabric', name: fabric.name, image: fabric.image, code: fabric.code })}
          className={`focus-lux absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-black/10 bg-cream/92 ${saved ? 'text-gold' : ''}`}
          aria-label={saved ? `Remove ${fabric.name} from wishlist` : `Save ${fabric.name}`}
        >
          <Heart size={16} fill={saved ? 'currentColor' : 'none'} strokeWidth={1.6}/>
        </button>
      </div>
      <button onClick={() => onOpen(fabric)} className="focus-lux mt-4 w-full border-t border-black/15 pt-4 text-left">
        <p className="text-[9px] uppercase tracking-[.18em] text-gold">{fabric.material} · {fabric.season}</p>
        <h3 className="mt-1 font-serif text-[27px]">{fabric.name}</h3>
        <p className="mt-2 text-xs leading-5 text-muted">{fabric.composition} · {fabric.weight}</p>
      </button>
    </article>
  );
}
