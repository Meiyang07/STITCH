import { useMemo, useState } from 'react';
import ReadyMadeCard from '../components/collections/ReadyMadeCard';
import SectionHeader from '../components/common/SectionHeader';
import { readyMadeFilters, readyMadeProducts } from '../data/readymade';

export default function ReadyMade() {
  const [gender, setGender] = useState('All');
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...new Set(readyMadeProducts.map((item) => item.category))], []);
  const list = useMemo(() => readyMadeProducts.filter((item) => (gender === 'All' || item.gender === gender) && (category === 'All' || item.category === category)), [gender, category]);

  return (
    <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container-lux">
        <SectionHeader label="READY-MADE" title="Ready to wear. Ready to buy." copy="These garments are sold in standard sizes and can be purchased directly. For personal pattern cutting, custom measurements or made-to-order details, use the Bespoke collection instead." />

        <div className="mt-9 border-y border-black/12 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[9px] uppercase tracking-[.18em] text-muted">For</span>
            {readyMadeFilters.map((item) => <button key={item} onClick={() => setGender(item)} className={`focus-lux border px-4 py-2 text-[10px] uppercase tracking-[.16em] ${gender === item ? 'border-ink bg-ink text-white' : 'border-black/20 hover:border-gold hover:text-gold'}`}>{item}</button>)}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[9px] uppercase tracking-[.18em] text-muted">Type</span>
            {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`focus-lux border px-4 py-2 text-[10px] uppercase tracking-[.16em] ${category === item ? 'border-ink bg-ink text-white' : 'border-black/20 hover:border-gold hover:text-gold'}`}>{item}</button>)}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted"><span>{list.length} items</span><span>Direct purchase · standard sizing</span></div>
        <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{list.map((item) => <ReadyMadeCard key={item.id} item={item}/>)}</div>
      </div>
    </section>
  );
}
