import { HeartOff, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist(){
  const {wishlist,remove}=useWishlist();
  return <section className="min-h-[70vh] pb-20 pt-36 sm:pb-28 sm:pt-44"><div className="container-lux"><SectionHeader label="SAVED" title="Your Wishlist" copy="Styles and fabrics saved here are stored only in this browser."/>{wishlist.length===0?<div className="mt-16 border-y border-black/15 py-16 text-center"><HeartOff className="mx-auto text-gold"/><h2 className="mt-5 font-serif text-4xl">Your Wishlist Is Empty</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">Save suits, fabrics and style references while you explore.</p><Button to="/collections" className="mt-7">Explore Collections</Button></div>:<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{wishlist.map(item=><article key={`${item.kind}-${item.id}`}><div className="aspect-[4/5] bg-warm"><img src={item.image} alt={item.name} className="h-full w-full object-cover"/></div><div className="mt-4 flex items-start justify-between border-t border-black/15 pt-4"><div><p className="text-[10px] uppercase tracking-[.16em] text-gold">{item.kind}</p><h3 className="mt-1 font-serif text-2xl">{item.name}</h3>{item.price&&<p className="mt-2 text-xs text-muted">From NPR {item.price.toLocaleString()}</p>}{item.slug&&<Link to={`/style/${item.slug}`} className="mt-3 inline-block border-b border-black/20 text-xs">View style</Link>}</div><button aria-label={`Remove ${item.name}`} onClick={()=>remove(item.id,item.kind)} className="focus-lux p-2 text-muted hover:text-ink"><Trash2 size={17}/></button></div></article>)}</div>}</div></section>;
}
