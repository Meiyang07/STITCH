import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CollectionCard from '../components/collections/CollectionCard';
import SectionHeader from '../components/common/SectionHeader';
import { collectionFilters, collections } from '../data/collections';

export default function Collections({ forcedType = null }) {
  const [params] = useSearchParams();
  const initial = params.get('filter') || 'All';
  const [filter, setFilter] = useState(collectionFilters.includes(initial) ? initial : 'All');
  const list = useMemo(() => collections.filter((x) => {
    const matchesType = forcedType ? x.type.toLowerCase().includes(forcedType.toLowerCase()) : true;
    const matchesFilter = filter === 'All' ? true : x.category === filter;
    return matchesType && matchesFilter;
  }), [filter, forcedType]);

  return (
    <section className="pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="container-lux">
        <SectionHeader label={forcedType ? forcedType.toUpperCase() : 'COLLECTIONS'} title={forcedType ? `${forcedType} Collection` : 'Styles to begin the conversation'} copy="These are reference silhouettes rather than ready-made stock. Starting prices are shown for orientation; the final quote depends on cloth, construction and customization." />
        {!forcedType && <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto pb-2">{collectionFilters.map(x => x === 'Accessories' ? <Link key={x} to="/accessories" className="focus-lux whitespace-nowrap border border-black/20 px-4 py-2 text-[10px] uppercase tracking-[.16em] transition-colors hover:border-gold hover:text-gold">{x}</Link> : <button key={x} onClick={() => setFilter(x)} className={`focus-lux whitespace-nowrap border px-4 py-2 text-[10px] uppercase tracking-[.16em] ${filter===x?'border-ink bg-ink text-white':'border-black/20 hover:border-gold hover:text-gold'}`}>{x}</button>)}</div>}
        {list.length ? <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{list.map((item) => <CollectionCard key={item.id} item={item} />)}</div> : <div className="mt-16 border-y border-black/15 py-14 text-center"><h3 className="font-serif text-3xl">No styles in this filter yet.</h3><p className="mt-3 text-sm text-muted">Try another category or return to the full collection.</p></div>}
      </div>
    </section>
  );
}
