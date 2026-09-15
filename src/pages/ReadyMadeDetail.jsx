import { Heart, ShoppingBag, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { readyMadeProducts } from '../data/readymade';
import { getInventoryItemByName } from '../utils/adminStorage';

export default function ReadyMadeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = readyMadeProducts.find((product) => product.slug === slug);
  const [size, setSize] = useState(item?.sizes?.[0] || '');
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const inventoryItem = item ? getInventoryItemByName(item.name) : null;
  const stock = Math.max(0, Number(inventoryItem?.stock || 0));
  const available = stock > 0;

  if (!item) return <section className="pb-24 pt-40"><div className="container-lux"><h1 className="font-serif text-5xl">Ready-made item not found.</h1><Link to="/readymade" className="mt-6 inline-block border-b border-ink">Back to Ready-Made</Link></div></section>;

  const cartItem = { id: item.id, kind: 'readymade', name: item.name, image: item.image, price: item.price, size, slug: item.slug, path: `/readymade/${item.slug}` };
  const saved = has(item.id, 'readymade');

  const addToCart = () => {
    if (!available) return;
    addItem(cartItem, Math.min(qty, stock));
  };

  const buyNow = () => {
    if (!available) return;
    addItem(cartItem, Math.min(qty, stock));
    navigate('/checkout');
  };

  return (
    <section className="pb-24 pt-28 sm:pt-32">
      <div className="container-lux grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
        <div className="overflow-hidden border border-black/8 bg-[#f7f4ee] aspect-[4/5] sm:aspect-[5/4]">
          <img src={item.image} alt={item.name} className="h-full w-full object-contain p-6 sm:p-10" onError={(event) => { event.currentTarget.src = '/images/fallback-product.svg'; }} />
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow">READY-MADE · {item.gender}</p>
          <h1 className="mt-4 font-serif text-5xl leading-[.95] sm:text-6xl">{item.name}</h1>
          <p className="mt-5 text-2xl font-medium">Rs. {item.price.toLocaleString()}</p>
          <p className={`mt-4 inline-flex border px-3 py-2 text-[9px] uppercase tracking-[.16em] ${available ? 'border-emerald-700/25 text-emerald-800' : 'border-red-900/20 text-red-900'}`}>{available ? `Available · ${stock} in stock` : 'Not Available'}</p>
          <p className="mt-6 text-[15px] leading-7 text-muted">{item.description}</p>

          <div className="mt-8 border-y border-black/15 py-6">
            <p className="text-[10px] uppercase tracking-[.18em] text-muted">Choose size</p>
            <div className="mt-3 flex flex-wrap gap-2">{item.sizes.map((value) => <button key={value} disabled={!available} onClick={() => setSize(value)} className={`focus-lux min-w-12 border px-4 py-3 text-xs disabled:cursor-not-allowed disabled:opacity-40 ${size === value ? 'border-ink bg-ink text-white' : 'border-black/20 hover:border-gold'}`}>{value}</button>)}</div>
            <label className="mt-5 block max-w-28 text-[10px] uppercase tracking-[.16em] text-muted">Quantity<input className="mt-2" type="number" min="1" max={Math.max(1, Math.min(10, stock))} disabled={!available} value={qty} onChange={(event) => setQty(Math.max(1, Math.min(Math.max(1, Math.min(10, stock)), Number(event.target.value) || 1)))}/></label>
          </div>

          <div className="mt-7 space-y-3">
            <Button onClick={addToCart} disabled={!available} className="w-full disabled:cursor-not-allowed disabled:opacity-40"><ShoppingBag size={15}/> {available ? 'Add to Cart' : 'Not Available'}</Button>
            <Button onClick={buyNow} disabled={!available} variant="gold" className="w-full disabled:cursor-not-allowed disabled:opacity-40"><Zap size={15}/> {available ? 'Buy Now' : 'Not Available'}</Button>
            <Button onClick={() => toggle({ id: item.id, kind: 'readymade', name: item.name, image: item.image, slug: item.slug, price: item.price, path: `/readymade/${item.slug}` })} variant="outline" className="w-full"><Heart size={15} fill={saved ? 'currentColor' : 'none'}/> {saved ? 'Saved to Wishlist' : 'Save to Wishlist'}</Button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 border-t border-black/15 pt-6 text-sm"><div><p className="micro-meta">Material</p><p className="mt-2">{item.material}</p></div><div><p className="micro-meta">Colours</p><p className="mt-2">{item.colors.join(', ')}</p></div></div>
          <p className="mt-6 text-xs leading-6 text-muted">This item is ready-made and sold by standard size. If you want individual measurements, cloth selection or pattern adjustments, choose a bespoke style and book a fitting.</p>
        </aside>
      </div>
    </section>
  );
}
