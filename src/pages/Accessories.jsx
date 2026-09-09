import { Heart, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AccessoryCard from '../components/collections/AccessoryCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SectionHeader from '../components/common/SectionHeader';
import siteConfig from '../config/siteConfig';
import { useWishlist } from '../context/WishlistContext';
import { accessories, accessoryFilters } from '../data/accessories';

export default function Accessories() {
  const [params, setParams] = useSearchParams();
  const requestedCategory = params.get('category');
  const requestedItem = params.get('item');
  const initialCategory = accessoryFilters.includes(requestedCategory) ? requestedCategory : 'All';
  const [filter, setFilter] = useState(initialCategory);
  const [selected, setSelected] = useState(null);
  const { toggle, has } = useWishlist();

  useEffect(() => {
    if (!requestedItem) return;
    const match = accessories.find((item) => item.slug === requestedItem);
    if (match) setSelected(match);
  }, [requestedItem]);

  useEffect(() => {
    if (requestedCategory && accessoryFilters.includes(requestedCategory)) setFilter(requestedCategory);
  }, [requestedCategory]);

  const list = useMemo(
    () => accessories.filter((item) => filter === 'All' || item.category === filter),
    [filter],
  );

  const changeFilter = (category) => {
    setFilter(category);
    const next = new URLSearchParams(params);
    next.delete('item');
    if (category === 'All') next.delete('category'); else next.set('category', category);
    setParams(next, { replace: true });
  };

  const openItem = (item) => {
    setSelected(item);
    const next = new URLSearchParams(params);
    next.set('item', item.slug);
    setParams(next, { replace: true });
  };

  const closeItem = () => {
    setSelected(null);
    const next = new URLSearchParams(params);
    next.delete('item');
    setParams(next, { replace: true });
  };

  const selectedSaved = selected ? has(selected.id, 'accessory') : false;
  const whatsappText = selected ? encodeURIComponent(`Hello, I would like to ask about the ${selected.name}.`) : '';

  return (
    <>
      <section className="pb-20 pt-36 sm:pb-28 sm:pt-44">
        <div className="container-lux">
          <SectionHeader
            label="ACCESSORIES"
            title="The finishing details"
            copy="Ties, cufflinks, pocket squares, belts and small details selected to work with the garment rather than compete with it. Prices are sample starting points and can be updated in accessories.js."
          />

          <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">
            {accessoryFilters.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => changeFilter(category)}
                className={`focus-lux whitespace-nowrap border px-4 py-2 text-[10px] uppercase tracking-[.16em] transition-colors ${filter === category ? 'border-ink bg-ink text-white' : 'border-black/20 hover:border-gold hover:text-gold'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-2 border-y border-black/12 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>{list.length} accessories shown</p>
            <p>Styling items only · no online checkout</p>
          </div>

          <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((item) => <AccessoryCard key={item.id} item={item} onOpen={openItem}/>) }
          </div>

          <div className="mt-20 grid gap-8 border-y border-black/12 py-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow">STYLING CONSULTATION</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Choose details alongside the garment.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">Bring a suit, wedding brief or colour direction and we can coordinate ties, pocket squares, belts, metal accessories and buttons during the fitting.</p>
            </div>
            <Button to="/appointment" variant="outline">Book a Fitting</Button>
          </div>
        </div>
      </section>

      <Modal open={!!selected} onClose={closeItem} title={selected?.name || ''}>
        {selected && (
          <div className="grid gap-8 sm:grid-cols-[.9fr_1.1fr]">
            <img
              src={selected.image}
              alt={selected.name}
              onError={(event) => { event.currentTarget.src = '/images/fallback-tailoring.svg'; }}
              className="aspect-[4/5] w-full border border-black/8 bg-white object-contain p-4 sm:p-5"
            />
            <div>
              <p className="eyebrow">{selected.category}</p>
              <p className="mt-4 text-sm leading-7 text-muted">{selected.description}</p>
              <dl className="mt-6 space-y-3 text-sm">
                {[
                  ['Material', selected.material],
                  ['Color', selected.color],
                  ['Style', selected.style],
                  ['Sample price', `Rs. ${selected.price.toLocaleString()}`],
                ].map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-5 border-t border-black/10 pt-3">
                    <dt className="text-muted">{key}</dt>
                    <dd className="text-right">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 space-y-3">
                <Button
                  onClick={() => toggle({ id: selected.id, kind: 'accessory', name: selected.name, image: selected.image, price: selected.price, slug: selected.slug, path: `/accessories?item=${selected.slug}` })}
                  variant="outline"
                  className="w-full"
                >
                  <Heart size={15} fill={selectedSaved ? 'currentColor' : 'none'}/> {selectedSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </Button>
                <Button
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${whatsappText}`}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  className="w-full"
                >
                  <MessageCircle size={15}/> Ask About This Item
                </Button>
                <Button to="/appointment" className="w-full">Book a Fitting</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
