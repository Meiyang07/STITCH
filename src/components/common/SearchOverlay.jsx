import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collections } from '../../data/collections';
import { fabricGroups } from '../../data/fabrics';
import { accessories } from '../../data/accessories';
import { readyMadeProducts } from '../../data/readymade';

const pageResults = [
  {
    title: 'Bespoke Experience',
    type: 'Page',
    path: '/bespoke',
    meta: 'Consultation, measurements, fitting and finishing',
    keywords: 'bespoke custom suit tailoring consultation measurement fitting made to measure',
  },
  {
    title: 'Collections',
    type: 'Page',
    path: '/collections',
    meta: 'Suits, shirts, tuxedos, trousers and traditional wear',
    keywords: 'collection suit shirt tuxedo trouser blazer waistcoat traditional daura suruwal',
  },
  {
    title: 'Ready-Made',
    type: 'Page',
    path: '/readymade',
    meta: 'Standard-size garments available for direct purchase',
    keywords: 'ready made ready-made shop buy men women blazer shirt trouser suit clothing cart checkout',
  },
  {
    title: 'Wedding Tailoring',
    type: 'Page',
    path: '/wedding',
    meta: 'Groom, groomsmen and wedding consultations',
    keywords: 'wedding groom groomsmen marriage reception engagement suit',
  },
  {
    title: 'Fabric Collection',
    type: 'Page',
    path: '/fabrics',
    meta: 'Wool, linen, cotton, cashmere and more',
    keywords: 'fabric cloth wool linen cotton cashmere velvet pattern textile',
  },
  {
    title: 'Accessories',
    type: 'Page',
    path: '/accessories',
    meta: 'Ties, cufflinks, bow ties, lapel pins, tie clips, pocket squares, buttons and belts',
    keywords: 'accessories accessory tie ties cufflink cufflinks bow tie bow ties lapel pin lapel pins tie clip tie clips pocket square pocket squares button buttons belt belts leather belt dress belt',
  },
  {
    title: 'Our Craft',
    type: 'Page',
    path: '/craftsmanship',
    meta: 'Pattern making, cutting, stitching and finishing',
    keywords: 'craft craftsmanship cutting stitching sewing pattern canvas hand finishing buttonhole pressing',
  },
  {
    title: 'Our Story',
    type: 'Page',
    path: '/story',
    meta: 'The approach behind STITCH in Pokhara',
    keywords: 'story studio atelier stitch pokhara about philosophy people',
  },
  {
    title: 'Book a Fitting',
    type: 'Page',
    path: '/appointment',
    meta: 'Choose a service, date and fitting time',
    keywords: 'book booking appointment fitting consultation schedule date time',
  },
  {
    title: 'Measurements',
    type: 'Page',
    path: '/measurements',
    meta: 'Save your tailoring measurements',
    keywords: 'measurements size chest waist shoulder sleeve inseam body',
  },
  {
    title: 'Profile',
    type: 'Page',
    path: '/profile',
    meta: 'Your STITCH account and saved details',
    keywords: 'profile account customer login details',
  },
  {
    title: 'Contact',
    type: 'Page',
    path: '/contact',
    meta: 'Studio contact details and enquiries',
    keywords: 'contact phone whatsapp email address pokhara studio enquiry',
  },
  {
    title: 'FAQ',
    type: 'Page',
    path: '/faq',
    meta: 'Common questions about tailoring and fittings',
    keywords: 'faq questions help delivery fitting price timing',
  },
];

const formatPrice = (price) => `Rs. ${Number(price).toLocaleString('en-IN')}`;

const searchableItems = [
  ...pageResults,
  ...collections.map((item) => ({
    title: item.name,
    type: 'Style',
    path: `/style/${item.slug}`,
    image: item.image,
    meta: `${item.category} · From ${formatPrice(item.price)}`,
    keywords: [
      item.shortName,
      item.category,
      item.type,
      item.description,
      ...(item.fabrics || []),
      ...(item.colors || []),
      ...(item.features || []),
    ].join(' '),
  })),
  ...readyMadeProducts.map((item) => ({
    title: item.name,
    type: 'Ready-Made',
    path: `/readymade/${item.slug}`,
    image: item.image,
    meta: `${item.gender} · ${item.category} · ${formatPrice(item.price)}`,
    keywords: [item.gender, item.category, item.material, item.description, ...(item.sizes || []), ...(item.colors || [])].join(' '),
  })),
  ...accessories.map((item) => ({
    title: item.name,
    type: 'Accessory',
    path: `/accessories?item=${item.slug}`,
    image: item.image,
    meta: `${item.category} · From ${formatPrice(item.price)}`,
    keywords: [item.category, item.material, item.color, item.style, item.description].join(' '),
  })),
  ...fabricGroups.map((fabric) => ({
    title: fabric.name,
    type: 'Fabric',
    path: `/fabrics?fabric=${fabric.id}`,
    image: fabric.image,
    meta: `${fabric.composition} · ${fabric.code}`,
    keywords: [
      fabric.material,
      fabric.color,
      fabric.pattern,
      fabric.season,
      fabric.occasion,
      fabric.description,
      fabric.weight,
    ].join(' '),
  })),
];

function getScore(item, query) {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = item.title.toLowerCase();
  const type = item.type.toLowerCase();
  const meta = (item.meta || '').toLowerCase();
  const keywords = (item.keywords || '').toLowerCase();
  const haystack = `${title} ${type} ${meta} ${keywords}`;
  const terms = q.split(/\s+/).filter(Boolean);

  if (!terms.every((term) => haystack.includes(term))) return -1;

  let score = 0;
  if (title === q) score += 120;
  if (title.startsWith(q)) score += 80;
  if (title.includes(q)) score += 55;
  if (type.includes(q)) score += 25;
  if (meta.includes(q)) score += 20;
  terms.forEach((term) => {
    if (title.includes(term)) score += 18;
    if (keywords.includes(term)) score += 7;
  });
  return score;
}

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) onClose();
    // Close after navigating from a search result.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, search]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchableItems
      .map((item) => ({ item, score: getScore(item, query) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ item }) => item);
  }, [query]);

  const suggestions = [
    ['Bespoke suits', 'bespoke suit'],
    ['Ready-Made', 'ready made'],
    ['Wedding', 'wedding'],
    ['Wool fabrics', 'wool'],
    ['Accessories', 'accessories'],
    ['Measurements', 'measurements'],
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] bg-black/55 backdrop-blur-[3px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label="Search STITCH"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto min-h-full w-full bg-cream sm:mt-20 sm:min-h-0 sm:max-w-[920px] sm:border sm:border-black/10 sm:shadow-[0_32px_90px_rgba(0,0,0,.28)]"
          >
            <div className="flex items-center gap-3 border-b border-black/12 px-5 py-4 sm:px-7 sm:py-5">
              <Search className="shrink-0 text-gold" size={21} strokeWidth={1.5} />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search ready-made, suits, fabrics, accessories…"
                aria-label="Search the STITCH website"
                className="!border-0 !bg-transparent !p-0 !text-[16px] !shadow-none placeholder:text-muted/65 focus:!border-0 focus:!shadow-none sm:text-[18px]"
              />
              <button
                type="button"
                onClick={onClose}
                className="focus-lux -mr-1 flex h-10 w-10 shrink-0 items-center justify-center transition-colors hover:text-gold"
                aria-label="Close search"
              >
                <X size={21} strokeWidth={1.5} />
              </button>
            </div>

            <div className="max-h-[calc(100vh-74px)] overflow-y-auto px-5 py-6 sm:max-h-[68vh] sm:px-7 sm:py-7">
              {!query.trim() ? (
                <div>
                  <p className="eyebrow">QUICK SEARCH</p>
                  <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">What are you looking for?</h2>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {suggestions.map(([label, value]) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() => setQuery(value)}
                        className="focus-lux border border-black/15 px-4 py-2.5 text-[10px] uppercase tracking-[.16em] transition-colors hover:border-gold hover:text-gold"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-9 border-t border-black/12 pt-5">
                    <p className="text-xs leading-6 text-muted">
                      Search across collections, fabrics, accessories and STITCH pages. Press <span className="border border-black/15 px-1.5 py-0.5 text-[10px] text-ink">Esc</span> to close.
                    </p>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <div className="mb-4 flex items-end justify-between gap-4 border-b border-black/12 pb-3">
                    <p className="text-[10px] uppercase tracking-[.18em] text-muted">{results.length} result{results.length === 1 ? '' : 's'}</p>
                    <p className="hidden text-[10px] uppercase tracking-[.14em] text-muted sm:block">Select a result to open it</p>
                  </div>
                  <div>
                    {results.map((result) => (
                      <Link
                        key={`${result.type}-${result.path}-${result.title}`}
                        to={result.path}
                        onClick={onClose}
                        className="focus-lux group grid grid-cols-[58px_1fr_auto] items-center gap-4 border-b border-black/10 py-3.5 transition-colors hover:text-gold sm:grid-cols-[72px_1fr_auto] sm:py-4"
                      >
                        {result.image ? (
                          <div className="h-[58px] w-[58px] overflow-hidden bg-warm sm:h-[72px] sm:w-[72px]">
                            <img src={result.image} alt="" onError={(event) => { event.currentTarget.src = '/images/fallback-product.svg'; }} className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.035]" />
                          </div>
                        ) : (
                          <div className="flex h-[58px] w-[58px] items-center justify-center border border-black/12 bg-[#FAF8F3] text-[9px] uppercase tracking-[.13em] text-muted sm:h-[72px] sm:w-[72px]">
                            {result.type}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[.18em] text-gold">{result.type}</p>
                          <h3 className="mt-1 truncate font-serif text-xl text-ink transition-colors group-hover:text-gold sm:text-2xl">{result.title}</h3>
                          <p className="mt-1 truncate text-xs text-muted">{result.meta}</p>
                        </div>
                        <ArrowUpRight size={17} strokeWidth={1.5} className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center sm:py-16">
                  <p className="eyebrow">NO RESULTS</p>
                  <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Nothing matched “{query}”.</h2>
                  <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted">Try a broader term such as suit, tie, cufflink, wedding, wool, shirt or measurements.</p>
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
