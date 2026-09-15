import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CollectionCard from '../components/collections/CollectionCard';
import SectionHeader from '../components/common/SectionHeader';
import { collectionFilters, collections, genderFilters } from '../data/collections';

export default function Collections({ forcedType = null }) {
  const [params] = useSearchParams();
  const initial = params.get('filter') || 'All';
  const initialGender = params.get('gender') || 'All';
  const [filter, setFilter] = useState(collectionFilters.includes(initial) && !['Accessories', 'Ready-Made'].includes(initial) ? initial : 'All');
  const [gender, setGender] = useState(genderFilters.includes(initialGender) ? initialGender : 'All');

  const list = useMemo(() => collections.filter((item) => {
    const matchesType = forcedType ? item.type.toLowerCase().includes(forcedType.toLowerCase()) : true;
    const matchesFilter = filter === 'All' ? true : item.category === filter;
    const matchesGender = gender === 'All' ? true : item.gender === gender;
    return matchesType && matchesFilter && matchesGender;
  }), [filter, gender, forcedType]);

  return (
    <section className="pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="container-lux">
        <SectionHeader label={forcedType ? forcedType.toUpperCase() : 'CUSTOM COLLECTIONS'} title={forcedType ? `${forcedType} Collection` : 'Made for you, not picked from a rack'} copy="These are custom reference silhouettes, not ready-made stock. They cannot be purchased directly online because cloth, measurements, construction and fitting must be confirmed first." />

        <div className="mt-9 border-y border-black/12 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[9px] uppercase tracking-[.18em] text-muted">For</span>
            {genderFilters.map((item) => <button key={item} onClick={() => setGender(item)} className={`focus-lux border px-4 py-2 text-[10px] uppercase tracking-[.16em] ${gender === item ? 'border-ink bg-ink text-white' : 'border-black/20 hover:border-gold hover:text-gold'}`}>{item}</button>)}
          </div>
          {!forcedType && <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[9px] uppercase tracking-[.18em] text-muted">Type</span>
            {collectionFilters.map((item) => {
              if (item === 'Accessories') return <Link key={item} to="/accessories" className="focus-lux border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[.16em] hover:border-gold hover:text-gold">Accessories</Link>;
              if (item === 'Ready-Made') return <Link key={item} to="/readymade" className="focus-lux border border-gold/60 px-4 py-2 text-[10px] uppercase tracking-[.16em] text-gold hover:bg-gold hover:text-white">Ready-Made · Buy</Link>;
              return <button key={item} onClick={() => setFilter(item)} className={`focus-lux border px-4 py-2 text-[10px] uppercase tracking-[.16em] ${filter === item ? 'border-ink bg-ink text-white' : 'border-black/20 hover:border-gold hover:text-gold'}`}>{item}</button>;
            })}
          </div>}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted"><span>{list.length} custom styles shown</span><Link to="/readymade" className="border-b border-gold pb-0.5 text-ink hover:text-gold">Want something you can buy now? Shop Ready-Made</Link></div>
        {list.length ? <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{list.map((item) => <CollectionCard key={item.id} item={item} />)}</div> : <div className="mt-16 border-y border-black/15 py-14 text-center"><h3 className="font-serif text-3xl">No custom styles in this selection yet.</h3><p className="mt-3 text-sm text-muted">Try another gender or category.</p></div>}
      </div>
    </section>
  );
}
