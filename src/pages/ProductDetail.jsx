import { Heart, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppointmentCTA from '../components/common/AppointmentCTA';
import Button from '../components/common/Button';
import CollectionCard from '../components/collections/CollectionCard';
import siteConfig from '../config/siteConfig';
import { useWishlist } from '../context/WishlistContext';
import { collections } from '../data/collections';

export default function ProductDetail() {
  const { slug } = useParams();
  const item = collections.find((x) => x.slug === slug);
  const { toggle, has } = useWishlist();

  useEffect(() => {
    if (!item) return;
    const prev = JSON.parse(localStorage.getItem('stitch_recent') || '[]');
    const next = [item.slug, ...prev.filter((x) => x !== item.slug)].slice(0, 5);
    localStorage.setItem('stitch_recent', JSON.stringify(next));
  }, [item]);

  if (!item) {
    return (
      <section className="pb-24 pt-40">
        <div className="container-lux">
          <h1 className="font-serif text-5xl">Style not found.</h1>
          <Link className="mt-6 inline-block border-b border-ink" to="/collections">Back to collections</Link>
        </div>
      </section>
    );
  }

  const saved = has(item.id, 'style');
  const recommended = collections.filter((x) => x.id !== item.id).slice(0, 3);
  const whatsappText = encodeURIComponent(`Hello, I would like to ask about the ${item.name}.`);

  return (
    <>
      <section className="pb-20 pt-28 sm:pt-32">
        <div className="container-lux grid gap-10 lg:grid-cols-[1.16fr_.84fr] lg:gap-14">
          <div className="grid gap-3 sm:grid-cols-2">
            {item.gallery.map((src, i) => (
              <div key={`${src}-${i}`} className={`overflow-hidden bg-warm ${i === 0 ? 'aspect-[4/5] sm:col-span-2 sm:aspect-[5/4]' : 'aspect-[4/5]'}`}>
                <img src={src} alt={`${item.name} view ${i + 1}`} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border-t border-black/15 pt-5">
              <p className="eyebrow">{item.type}</p>
              <h1 className="mt-4 font-serif text-5xl leading-[.95] sm:text-6xl">{item.name}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-black/15 pb-6">
                <p className="text-sm font-medium">From Rs. {item.price.toLocaleString()}</p>
                <span className="h-1 w-1 rounded-full bg-black/25" />
                <p className="text-xs text-muted">Typical lead time {item.completion}</p>
              </div>
              <p className="mt-6 text-[15px] leading-7 text-muted">{item.description}</p>
            </div>

            <div className="mt-7 grid gap-6 border-y border-black/15 py-6 sm:grid-cols-2">
              <div>
                <p className="eyebrow">CLOTH DIRECTION</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.fabrics.join(', ')}</p>
              </div>
              <div>
                <p className="eyebrow">COLOUR DIRECTION</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.colors.join(', ')}</p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-6 text-muted">
              Starting price is a guide. Your final quote is confirmed after cloth, construction and customization are selected.
            </p>

            <div className="mt-7 space-y-3">
              <Button to="/appointment" className="w-full">Book a Fitting</Button>
              <Button
                onClick={() => toggle({ id: item.id, kind: 'style', name: item.name, image: item.image, slug: item.slug, price: item.price })}
                variant="outline"
                className="w-full"
              >
                <Heart size={15} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved to Wishlist' : 'Save This Style'}
              </Button>
              <Button
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${whatsappText}`}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                className="w-full"
              >
                <MessageCircle size={15}/> Ask on WhatsApp
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-black/10 bg-white/30 py-20 sm:py-24">
        <div className="container-lux grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">STYLE DETAILS</p>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Built as a system of choices.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-muted">The silhouette is the starting point. Cloth, structure and details are resolved together at consultation.</p>
          </div>
          <div>
            {[
              ['Fabric', item.fabrics.join(' / ')],
              ['Construction', item.features.join(' · ')],
              ['Customization', 'Lapel, buttons, lining, monogram, pockets, vent, cuffs and trouser details.'],
              ['Care', 'Brush after wear, rotate between wears and use professional pressing or dry cleaning only when needed.'],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-2 border-t border-black/15 py-5 sm:grid-cols-[150px_1fr] sm:gap-8">
                <p className="text-[9px] uppercase tracking-[.18em] text-gold">{k}</p>
                <p className="text-sm leading-6 text-muted">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="container-lux">
          <p className="eyebrow">RELATED STYLES</p>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl">Continue exploring</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{recommended.map((x) => <CollectionCard key={x.id} item={x}/>)}</div>
          <div className="mt-14 flex flex-col gap-5 border-y border-black/12 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="eyebrow">COMPLETE THE LOOK</p><p className="mt-2 text-sm text-muted">Explore ties, cufflinks, pocket squares, lapel pins and finishing details.</p></div>
            <Button to="/accessories" variant="outline">Explore Accessories</Button>
          </div>
        </div>
      </section>

      <AppointmentCTA compact />
    </>
  );
}
