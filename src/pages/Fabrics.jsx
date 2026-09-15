import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FabricCard from '../components/collections/FabricCard';
import Modal from '../components/common/Modal';
import SectionHeader from '../components/common/SectionHeader';
import { fabricGroups } from '../data/fabrics';
import { getAdminInventory } from '../utils/adminStorage';

const filterDefs = {
  material: ['All', ...new Set(fabricGroups.map((fabric) => fabric.material))],
  pattern: ['All', ...new Set(fabricGroups.map((fabric) => fabric.pattern))],
  season: ['All', ...new Set(fabricGroups.map((fabric) => fabric.season))]
};

export default function Fabrics() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState({material:'All', pattern:'All', season:'All'});
  const [selected, setSelected] = useState(null);
  const [inventory, setInventory] = useState(() => getAdminInventory());
  const requestedFabric = params.get('fabric');

  useEffect(() => {
    if (!requestedFabric) return;
    const match = fabricGroups.find((fabric) => fabric.id === requestedFabric);
    if (match) setSelected(match);
  }, [requestedFabric]);

  useEffect(() => {
    const refreshInventory = () => setInventory(getAdminInventory());
    window.addEventListener('focus', refreshInventory);
    window.addEventListener('storage', refreshInventory);
    return () => {
      window.removeEventListener('focus', refreshInventory);
      window.removeEventListener('storage', refreshInventory);
    };
  }, []);

  const closeFabric = () => {
    setSelected(null);
    if (requestedFabric) {
      const next = new URLSearchParams(params);
      next.delete('fabric');
      setParams(next, { replace: true });
    }
  };
  const list = useMemo(() => fabricGroups.filter(f => Object.entries(filters).every(([k,v]) => v==='All' || f[k]===v)), [filters]);
  const stockFor = (fabric) => {
    const row = inventory.find((entry) => String(entry.item || '').trim().toLowerCase() === fabric.name.trim().toLowerCase());
    return Math.max(0, Number(row?.stock) || 0);
  };
  return <>
    <section className="pb-20 pt-36 sm:pb-28 sm:pt-44"><div className="container-lux"><SectionHeader label="FABRIC COLLECTION" title="Cloth Sets The Character" copy="Browse cloth options by material, pattern and season. Availability is linked to the admin raw-material inventory." />
      <div className="mt-10 grid gap-4 border-y border-black/15 py-5 md:grid-cols-3">{Object.entries(filterDefs).map(([key,options])=><label key={key} className="text-[10px] uppercase tracking-[.15em] text-muted">{key}<select value={filters[key]} onChange={e=>setFilters({...filters,[key]:e.target.value})} className="mt-2 bg-transparent normal-case tracking-normal">{options.map(o=><option key={o}>{o}</option>)}</select></label>)}</div>
      <p className="mt-6 text-xs text-muted">{list.length} fabrics shown</p><div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{list.map(f => { const stock = stockFor(f); return <FabricCard key={f.id} fabric={f} onOpen={setSelected} stock={stock} available={stock > 0}/>; })}</div>
    </div></section>
    <Modal open={!!selected} onClose={closeFabric} title={selected?.name || ''}>{selected && <div className="grid gap-7 sm:grid-cols-2"><img src={selected.image} alt={selected.name} onError={(event) => { event.currentTarget.src = '/images/fabrics/fallback-fabric.svg'; }} className="aspect-square w-full object-cover"/><div><p className="eyebrow">{selected.code}</p><div className={`mt-4 inline-flex border px-3 py-2 text-[9px] uppercase tracking-[.16em] ${stockFor(selected) > 0 ? 'border-emerald-700/25 text-emerald-800' : 'border-red-900/20 text-red-900'}`}>{stockFor(selected) > 0 ? `Available · ${stockFor(selected)} ${inventory.find((entry) => String(entry.item || '').trim().toLowerCase() === selected.name.trim().toLowerCase())?.unit || ''}` : 'Not Available'}</div><p className="mt-4 text-sm leading-7 text-muted">{selected.description}</p><dl className="mt-6 space-y-3 text-sm">{[['Composition',selected.composition],['Weight',selected.weight],['Season',selected.season],['Pattern',selected.pattern],['Occasion',selected.occasion],['Color',selected.color]].map(([k,v])=><div key={k} className="flex justify-between gap-5 border-t border-black/10 pt-3"><dt className="text-muted">{k}</dt><dd className="text-right">{v}</dd></div>)}</dl></div></div>}</Modal>
  </>;
}
