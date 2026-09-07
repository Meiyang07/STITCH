import { motion } from 'framer-motion';
import { ArrowDown, Check, Scissors } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppointmentCTA from '../components/common/AppointmentCTA';
import Button from '../components/common/Button';
import ImageReveal from '../components/common/ImageReveal';
import ImageSlot from '../components/common/ImageSlot';
import Newsletter from '../components/common/Newsletter';
import SectionHeader from '../components/common/SectionHeader';
import CollectionCard from '../components/collections/CollectionCard';
import ProcessTimeline from '../components/home/ProcessTimeline';
import TestimonialSlider from '../components/home/TestimonialSlider';
import { editorialCategories } from '../data/collections';
import { fabricGroups } from '../data/fabrics';
import { images, galleries } from '../data/images';

const customization = {
  Lapel: 'Notch, peak or shawl. Width and gorge height are balanced to your frame and the jacket style.',
  Buttons: 'Horn, corozo or mother-of-pearl. We show samples and explain what works where.',
  Lining: 'Full, half or quarter. Interior fabric can be tonal or quietly contrasted.',
  Monogram: 'Initials, a date, or a small detail that matters only to you. Placed where it stays private.',
  Pocket: 'Flap, jetted, patch or ticket pocket. Decided by formality and how you actually use them.',
  Vent: 'Single, double or no vent. Chosen around movement, posture and the jacket line.',
  Cuff: 'Working buttons, kiss spacing, surgeon\'s cuffs. Small signals that change proportion.',
  'Trouser Style': 'Pleated or flat front, side adjusters, cuffs and break. Built around how you stand and sit.'
};

function Counter({ end, suffix = '' }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === 'undefined') { setValue(end); return; }
    const ob = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let start = null;
      const run = (t) => {
        if (!start) start = t;
        const p = Math.min((t - start) / 900, 1);
        setValue(Math.round(end * p));
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
      ob.disconnect();
    }, { threshold: .5 });
    ob.observe(node);
    return () => ob.disconnect();
  }, [end]);
  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const [selected, setSelected] = useState('Lapel');
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-end overflow-hidden bg-ink text-white">
        {images.homeHero ? (
          <motion.img 
            initial={{ scale: 1.05 }} 
            animate={{ scale: 1 }} 
            transition={{ duration: 10, ease: 'linear' }} 
            src={images.homeHero} 
            alt={images.homeHeroAlt} 
            className="absolute inset-0 h-full w-full object-cover" 
          />
        ) : (
          <div className="absolute inset-0 bg-[#252525]">
            <ImageSlot label="Home hero image" className="border-0 bg-transparent text-white" />
          </div>
        )}
        <div className="hero-gradient absolute inset-0" />
        <div className="container-lux relative z-10 pb-16 pt-40 sm:pb-24 lg:pb-28">
          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: .2 }} 
            className="text-[11px] font-medium uppercase tracking-[.28em] text-[#d5b983]"
          >
            BESPOKE TAILORING · KATHMANDU
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 25 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: .35, duration: .6 }} 
            className="display-title mt-6 max-w-4xl text-balance"
          >
            Made For One.<br />Made For You.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: .5 }} 
            className="mt-7 max-w-xl text-[15px] leading-7 text-white/65"
          >
            Cut to your measurements, shaped around the way you stand, move and live.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: .65 }} 
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Button to="/appointment" variant="light">Book a Fitting</Button>
            <Button to="/bespoke" variant="outline">Discover Bespoke</Button>
          </motion.div>
          <a 
            href="#house" 
            className="mt-14 inline-flex items-center gap-3 text-[9px] uppercase tracking-[.22em] text-white/50 transition-colors hover:text-white/80"
          >
            Scroll to discover <ArrowDown size={13} strokeWidth={1.5} />
          </a>
        </div>
      </section>

      {/* Introduction */}
      <section id="house" className="py-24 sm:py-32 lg:py-36">
        <div className="container-lux grid gap-16 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeader 
              label="THE HOUSE" 
              title={<>Cut Around You,<br />Not Around A Size.</>} 
              copy="Every client begins with a conversation. We look at how you dress, where you'll wear the garment, how you stand and how you want it to feel." 
            />
            <p className="mt-10 max-w-md font-serif text-[22px] italic leading-relaxed text-muted">
              The best fit is the one you stop thinking about.
            </p>
          </div>
          <ImageReveal 
            src={images.homeIntroduction} 
            alt={images.homeIntroductionAlt} 
            className="aspect-[4/5] lg:ml-auto lg:w-[90%]" 
          />
        </div>
      </section>

      {/* Collections */}
      <section className="border-y border-black/10 bg-white/30 py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="SIGNATURE TAILORING" 
            title="From The Everyday To The Once In A Lifetime" 
            copy="A considered wardrobe of business, ceremony and traditional tailoring. Each is a starting point, not a fixed template." 
          />
          <div className="mt-14 grid gap-x-6 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {editorialCategories.map((item, i) => (
              <CollectionCard 
                key={item.name} 
                item={item} 
                editorial 
                className={i === 1 || i === 4 ? 'lg:mt-16' : ''} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bespoke Process */}
      <section className="bg-charcoal py-24 text-white sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            dark 
            label="THE BESPOKE EXPERIENCE" 
            title="How It Works" 
            copy="A measured sequence of conversation, observation and refinement. Allow approximately 4–6 weeks for most bespoke garments. Wedding clients are encouraged to begin earlier." 
          />
          <ProcessTimeline />
          <div className="mt-12">
            <Button to="/bespoke" variant="outline" arrow>Discover the Process</Button>
          </div>
        </div>
      </section>

      {/* Craftsmanship Split */}
      <section className="grid min-h-[680px] lg:grid-cols-2">
        <ImageReveal 
          src={images.homeCraftsmanship} 
          alt={images.homeCraftsmanshipAlt} 
          className="min-h-[480px]" 
        />
        <div className="flex items-center bg-cream px-5 py-20 sm:px-10 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <SectionHeader 
              label="OUR CRAFT" 
              title={<>Made By Hand.<br />Measured Twice.</>} 
              copy="A good suit should feel like yours before anyone notices the tailoring. That comes from pattern, cut, canvas, stitch and fitting." 
            />
            <ul className="mt-10 grid gap-3 text-sm text-muted sm:grid-cols-2">
              {[
                'Hand-finished construction',
                'Precision measurements',
                'Personal paper pattern',
                'Premium fabric selection',
                'Detailed finishing'
              ].map(x => (
                <li key={x} className="flex items-center gap-3 border-b border-black/10 pb-3">
                  <Check size={15} className="text-gold" />
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button to="/craftsmanship" variant="outline" arrow>
                Explore Craftsmanship
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fabrics */}
      <section className="py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="THE CLOTH" 
            title="A World of Fabric" 
            copy="From clean worsteds to summer linen and evening velvet, cloth determines structure, comfort, season and character." 
          />
          <div className="no-scrollbar -mx-5 mt-12 flex gap-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            {fabricGroups.slice(0, 6).map(f => (
              <Link 
                key={f.id} 
                to="/fabrics" 
                className="group min-w-[260px] sm:min-w-[320px]"
              >
                <div className="aspect-square overflow-hidden bg-warm">
                  {f.image ? (
                    <img 
                      src={f.image} 
                      alt={f.name} 
                      loading="lazy" 
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" 
                    />
                  ) : (
                    <ImageSlot label={`${f.name} fabric`} />
                  )}
                </div>
                <div className="mt-4 border-t border-black/15 pt-4">
                  <p className="text-[10px] uppercase tracking-[.18em] text-gold">{f.season}</p>
                  <h3 className="mt-1 font-serif text-2xl">{f.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{f.description}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Button to="/fabrics" variant="outline" arrow>Explore All Fabrics</Button>
          </div>
        </div>
      </section>

      {/* Wedding */}
      <section className="relative min-h-[72vh] overflow-hidden bg-ink text-white">
        {images.homeWedding ? (
          <img 
            src={images.homeWedding} 
            alt={images.homeWeddingAlt} 
            loading="lazy" 
            className="absolute inset-0 h-full w-full object-cover opacity-60" 
          />
        ) : (
          <div className="absolute inset-0 bg-[#252525]">
            <ImageSlot label="Home wedding image" className="border-0 bg-transparent" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-transparent" />
        <div className="container-lux relative z-10 flex min-h-[72vh] items-center py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] font-medium uppercase tracking-[.28em] text-[#d5b983]">
              THE WEDDING EDIT
            </p>
            <h2 className="section-title mt-6">
              A Suit Worth<br />Remembering.
            </h2>
            <p className="mt-7 max-w-xl text-[15px] leading-7 text-white/65">
              From the first fitting to the final week, we build the suit around the day you're planning.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button to="/wedding" variant="light">Explore Wedding</Button>
              <Button to="/appointment" variant="outline">Plan Your Wedding Suit</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Customization */}
      <section className="py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="CUSTOMIZATION" 
            title={<>Every Detail,<br />Your Decision.</>} 
            copy="The choices below demonstrate how a bespoke consultation can translate preferences into specific construction and styling decisions." 
          />
          <div className="mt-14 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div className="grid grid-cols-2 border-l border-t border-black/15 sm:grid-cols-4">
              {Object.keys(customization).map(name => (
                <button 
                  key={name} 
                  onClick={() => setSelected(name)} 
                  className={`focus-lux min-h-24 border-b border-r border-black/15 p-4 text-left text-xs uppercase tracking-[.14em] transition-colors ${
                    selected === name ? 'bg-ink text-white' : 'hover:bg-white/50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            <motion.div 
              key={selected} 
              initial={{ opacity: 0, y: 12 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex min-h-[290px] flex-col justify-between bg-charcoal p-8 text-cream sm:p-10"
            >
              <Scissors className="text-gold" strokeWidth={1.4} />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[.28em] text-[#c3a674]">
                  SELECTED DETAIL
                </p>
                <h3 className="mt-3 font-serif text-4xl sm:text-5xl">{selected}</h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">
                  {customization[selected]}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-black/10 bg-white/30 py-16">
        <div className="container-lux grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {[
            [4, '+', 'Weeks Completion'],
            [30, '+', 'Measurements'],
            [5000, '+', 'Fabric Choices'],
            [100, '%', 'Personalized']
          ].map(([n, s, label]) => (
            <div key={label} className="border-l border-black/15 pl-5 sm:pl-7">
              <p className="font-serif text-4xl sm:text-5xl">
                <Counter end={n} suffix={s} />
              </p>
              <p className="mt-2 text-[10px] uppercase tracking-[.16em] text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="CLIENT STORIES" 
            title="What People Say" 
          />
          <TestimonialSlider />
        </div>
      </section>

      {/* Atelier Gallery */}
      <section className="bg-white/35 py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="INSIDE THE ATELIER" 
            title="Work In Progress" 
            copy="An editorial glimpse of the gestures that happen between consultation and handover." 
          />
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {galleries.atelier.map((item, i) => (
              <div 
                key={item.label} 
                className={`group relative overflow-hidden ${
                  i === 1 || i === 4 ? 'aspect-[3/4]' : 'aspect-square'
                }`}
              >
                {item.src ? (
                  <img 
                    src={item.src} 
                    alt={item.alt} 
                    loading="lazy" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <ImageSlot label={`${item.label} image`} />
                )}
                <div className="absolute inset-0 flex items-end bg-black/0 p-4 transition-colors group-hover:bg-black/35">
                  <span className="translate-y-3 text-[9px] uppercase tracking-[.2em] text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AppointmentCTA />
      <Newsletter />
    </>
  );
}
