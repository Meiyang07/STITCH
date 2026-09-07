import { Heart } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function FabricCard({ fabric, onOpen }) {
  const { toggle, has } = useWishlist();
  const saved = has(fabric.id, 'fabric');
  return (
    <article className="group">
      <div className="relative aspect-square overflow-hidden bg-warm">
        <button onClick={() => onOpen(fabric)} className="h-full w-full text-left" aria-label={`View ${fabric.name} details`}><img src={fabric.image} alt={`${fabric.name} fabric texture`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /></button>
        <button onClick={() => toggle({ id: fabric.id, kind: 'fabric', name: fabric.name, image: fabric.image, code: fabric.code })} className={`focus-lux absolute right-3 top-3 flex h-9 w-9 items-center justify-center bg-cream/90 ${saved ? 'text-gold' : ''}`} aria-label="Save fabric"><Heart size={16} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
      <button onClick={() => onOpen(fabric)} className="focus-lux mt-4 w-full border-t border-black/15 pt-4 text-left"><p className="text-[10px] uppercase tracking-[.18em] text-muted">{fabric.code} · {fabric.season}</p><h3 className="mt-1 font-serif text-2xl">{fabric.name}</h3><p className="mt-2 text-xs text-muted">{fabric.composition} · {fabric.weight}</p></button>
    </article>
  );
}
