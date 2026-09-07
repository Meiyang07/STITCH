import { Heart, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppointmentCTA from '../components/common/AppointmentCTA';
import Button from '../components/common/Button';
import ImageSlot from '../components/common/ImageSlot';
import CollectionCard from '../components/collections/CollectionCard';
import { useWishlist } from '../context/WishlistContext';
import siteConfig from '../config/siteConfig';
import { collections } from '../data/collections';

export default function ProductDetail() {
  const { slug } = useParams();
  const item = collections.find(x => x.slug === slug);
  const { toggle, has } = useWishlist();

  useEffect(() => {
    if (!item) return;
    const prev = JSON.parse(localStorage.getItem('stitch_recent') || '[]');
    const next = [item.slug, ...prev.filter(x => x !== item.slug)].slice(0, 5);
    localStorage.setItem('stitch_recent', JSON.stringify(next));
  }, [item]);

  if (!item) return <section className="pb-24 pt-40"><div className="container-lux"><h1 className="font-serif text-5xl">Style not found.</h1><Link className="mt-6 inline-block border-b border-ink" to="/collections">Back to collections</Link></div></section>;
  const saved = has(item.id, 'style');
  const recommended = collections.filter(x => x.id !== item.id).slice(0,3);
  return <>
    <section className="pb-20 pt-28 sm:pt-32"><div className="container-lux grid gap-10 lg:grid-cols-[1.18fr_.82fr]">
      <div className="grid gap-3 sm:grid-cols-2">{item.gallery.map((src,i)=><div key={`${item.id}-${i}`} className={`${i===0?'aspect-[4/5] sm:col-span-2':'aspect-[4/5]'}`}>{src ? <img src={src} alt={`${item.name} view ${i+1}`} className="h-full w-full object-cover" /> : <ImageSlot label={`${item.name} image ${i+1}`} />}</div>)}</div>
      <div className="lg:sticky lg:top-28 lg:self-start"><p className="eyebrow">{item.type}</p><h1 className="mt-4 font-serif text-5xl sm:text-6xl">{item.name}</h1><p className="mt-4 text-sm font-medium">From NPR {item.price.toLocaleString()}</p><p className="mt-6 text-sm leading-7 text-muted">{item.description}</p>
        <div className="mt-8 border-y border-black/15 py-6"><div className="grid gap-5 sm:grid-cols-2"><div><p className="eyebrow">FABRICS</p><p className="mt-2 text-sm leading-6 text-muted">{item.fabrics.join(', ')}</p></div><div><p className="eyebrow">COLORS</p><p className="mt-2 text-sm leading-6 text-muted">{item.colors.join(', ')}</p></div></div></div>
        <div className="mt-7 space-y-3"><Button to="/appointment" className="w-full">Book a Fitting</Button><Button onClick={() => toggle({id:item.id, kind:'style', name:item.name, image:item.image, slug:item.slug, price:item.price})} variant="outline" className="w-full"><Heart size={15} fill={saved?'currentColor':'none'} /> {saved?'Saved to Wishlist':'Add to Wishlist'}</Button><Button href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(`Hello, I am interested in ${item.name}.`)}`} target="_blank" rel="noreferrer" variant="outline" className="w-full"><MessageCircle size={15}/> Inquire on WhatsApp</Button></div>
        <p className="mt-5 text-xs leading-5 text-muted">Estimated completion: {item.completion}. Confirm final schedule at consultation.</p>
      </div>
    </div></section>
    <section className="border-y border-black/10 bg-white/30 py-20"><div className="container-lux grid gap-12 lg:grid-cols-2"><div><p className="eyebrow">STYLE DETAILS</p><h2 className="mt-4 font-serif text-4xl">Built as a system of choices.</h2></div><div className="space-y-0">{[['Fabric',item.fabrics.join(' / ')],['Construction',item.features.join(' · ')],['Customization','Lapel, buttons, lining, monogram, pockets, vent, cuffs and trouser details.'],['Care','Brush after wear, rotate between wears and use professional pressing/dry cleaning only when needed.']].map(([k,v])=><div key={k} className="border-t border-black/15 py-5"><p className="text-[10px] uppercase tracking-[.18em] text-gold">{k}</p><p className="mt-2 text-sm leading-6 text-muted">{v}</p></div>)}</div></div></section>
    <section className="py-20 sm:py-28"><div className="container-lux"><p className="eyebrow">RECOMMENDED STYLES</p><h2 className="mt-4 font-serif text-4xl sm:text-5xl">Continue Exploring</h2><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{recommended.map(x=><CollectionCard key={x.id} item={x}/>)}</div></div></section>
    <AppointmentCTA compact />
  </>;
}
