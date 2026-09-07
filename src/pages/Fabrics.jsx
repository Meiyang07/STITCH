import { useMemo, useState } from 'react';
import FabricCard from '../components/collections/FabricCard';
import Modal from '../components/common/Modal';
import ImageSlot from '../components/common/ImageSlot';
import SectionHeader from '../components/common/SectionHeader';
import { fabricGroups } from '../data/fabrics';

const filterDefs = {
  material: ['All','Wool','Cotton','Linen','Cashmere','Velvet','Wool Blend','Allo','Pashmina','Hemp Blend'],
  pattern: ['All','Solid','Pinstripe','Windowpane','Checks','Herringbone','Geometric','Handwoven','Textured'],
  season: ['All','All Season','Spring/Summer','Autumn/Winter']
};

export default function Fabrics() {
  const [filters, setFilters] = useState({material:'All', pattern:'All', season:'All'});
  const [selected, setSelected] = useState(null);
  const list = useMemo(() => fabricGroups.filter(f => Object.entries(filters).every(([k,v]) => v==='All' || f[k]===v)), [filters]);
  return <>
    <section className="pb-20 pt-36 sm:pb-28 sm:pt-44"><div className="container-lux"><SectionHeader label="FABRIC COLLECTION" title="Cloth Sets The Character" copy="Filter the development catalogue by material, pattern and season. Each card opens a details modal and can be saved to the browser wishlist." />
      <div className="mt-10 grid gap-4 border-y border-black/15 py-5 md:grid-cols-3">{Object.entries(filterDefs).map(([key,options])=><label key={key} className="text-[10px] uppercase tracking-[.15em] text-muted">{key}<select value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})} className="mt-2 bg-transparent normal-case tracking-normal">{options.map(o=><option key={o}>{o}</option>)}</select></label>)}</div>
      <p className="mt-6 text-xs text-muted">{list.length} fabrics shown</p><div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{list.map(f=><FabricCard key={f.id} fabric={f} onOpen={setSelected}/>)}</div>
    </div></section>
    <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected?.name || ''}>{selected && <div className="grid gap-7 sm:grid-cols-2">{selected.image ? <img src={selected.image} alt={selected.name} className="aspect-square w-full object-cover"/> : <div className="aspect-square"><ImageSlot label={`${selected.name} fabric`} /></div>}<div><p className="eyebrow">{selected.code}</p><p className="mt-4 text-sm leading-7 text-muted">{selected.description}</p><dl className="mt-6 space-y-3 text-sm">{[['Composition',selected.composition],['Weight',selected.weight],['Season',selected.season],['Pattern',selected.pattern],['Occasion',selected.occasion],['Color',selected.color]].map(([k,v])=><div key={k} className="flex justify-between gap-5 border-t border-black/10 pt-3"><dt className="text-muted">{k}</dt><dd className="text-right">{v}</dd></div>)}</dl></div></div>}</Modal>
  </>;
}
