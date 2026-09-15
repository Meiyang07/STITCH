import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeItem, updateQuantity, subtotal } = useCart();
  return (
    <section className="min-h-[70vh] pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container-lux">
        <SectionHeader label="SHOPPING BAG" title="Your cart" copy="Ready-made garments and accessories can be purchased directly. Bespoke/custom styles stay consultation-only."/>
        {!cart.length ? <div className="mt-14 border-y border-black/15 py-16 text-center"><ShoppingBag className="mx-auto text-gold"/><h2 className="mt-5 font-serif text-4xl">Your cart is empty.</h2><div className="mt-7 flex flex-wrap justify-center gap-3"><Button to="/readymade">Shop Ready-Made</Button><Button to="/accessories" variant="outline">Shop Accessories</Button></div></div> : (
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="divide-y divide-black/15 border-y border-black/15">{cart.map((item) => <article key={`${item.kind}-${item.id}-${item.size || 'standard'}`} className="grid gap-5 py-6 sm:grid-cols-[120px_1fr_auto] sm:items-center"><img src={item.image} alt={item.name} className="aspect-[4/5] h-36 w-28 border border-black/8 bg-[#f7f4ee] object-contain p-2"/><div><p className="text-[9px] uppercase tracking-[.17em] text-gold">{item.kind === 'readymade' ? 'Ready-Made' : 'Accessory'}</p><h3 className="mt-1 font-serif text-2xl">{item.name}</h3>{item.size && <p className="mt-2 text-xs text-muted">Size {item.size}</p>}<p className="mt-2 text-sm">Rs. {Number(item.price).toLocaleString()}</p><div className="mt-4 inline-flex items-center border border-black/15"><button onClick={() => updateQuantity(item, Math.max(1, item.quantity - 1))} className="p-2"><Minus size={14}/></button><span className="min-w-9 text-center text-xs">{item.quantity}</span><button onClick={() => updateQuantity(item, Math.min(10, item.quantity + 1))} className="p-2"><Plus size={14}/></button></div></div><div className="flex items-center justify-between gap-5 sm:block sm:text-right"><p className="font-medium">Rs. {(Number(item.price) * item.quantity).toLocaleString()}</p><button onClick={() => removeItem(item)} className="mt-3 inline-flex items-center gap-2 text-xs text-muted hover:text-red-800"><Trash2 size={14}/> Remove</button></div></article>)}</div>
            <aside className="h-fit border border-black/15 bg-white/30 p-6 lg:sticky lg:top-28"><p className="eyebrow">ORDER SUMMARY</p><div className="mt-5 flex justify-between border-b border-black/15 pb-5 text-sm"><span className="text-muted">Subtotal</span><strong>Rs. {subtotal.toLocaleString()}</strong></div><p className="mt-4 text-xs leading-6 text-muted">Delivery charges, if any, are confirmed at checkout. Custom garments cannot be purchased from the cart.</p><Button to="/checkout" className="mt-6 w-full">Proceed to Checkout</Button><Link to="/readymade" className="mt-5 block text-center text-xs text-muted hover:text-gold">Continue shopping</Link></aside>
          </div>
        )}
      </div>
    </section>
  );
}
