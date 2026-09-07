import { HelpCircle, Ruler } from 'lucide-react';
import { useState } from 'react';
import AppointmentCTA from '../components/common/AppointmentCTA';
import Modal from '../components/common/Modal';
import SectionHeader from '../components/common/SectionHeader';
import useLocalStorage from '../hooks/useLocalStorage';

const fields = [
  ['height','Height','Stand barefoot against a wall and measure from floor to top of head.'],['weight','Weight','Enter body weight; this helps provide fit context but is not a tailoring measurement.'],['neck','Neck','Measure around the base of the neck where a shirt collar sits.'],['shoulder','Shoulder','Measure across the back from shoulder point to shoulder point.'],['chest','Chest','Measure around the fullest part of the chest, keeping the tape level.'],['waist','Waist','Measure around the natural waist without pulling the tape tight.'],['hip','Hip','Measure around the fullest point of the seat.'],['sleeve','Sleeve','Measure from shoulder point to wrist with the arm relaxed.'],['bicep','Bicep','Measure around the fullest part of the upper arm.'],['wrist','Wrist','Measure around the wrist where the cuff will sit.'],['jacketLength','Jacket Length','Measure from the base of the neck down to the desired jacket hem.'],['trouserWaist','Trouser Waist','Measure where you prefer trousers to sit.'],['thigh','Thigh','Measure around the fullest part of the upper thigh.'],['knee','Knee','Measure around the knee with the leg relaxed.'],['trouserLength','Trouser Length','Measure from trouser waistband position to desired hem.'],['inseam','Inseam','Measure from crotch seam to desired trouser hem.']
];

export default function Measurements() {
  const [unit,setUnit]=useState('cm');
  const [values,setValues]=useLocalStorage('stitch_measurements',{});
  const [help,setHelp]=useState(null);
  const [saved,setSaved]=useState(false);
  const update=(k,v)=>{setValues({...values,[k]:v});setSaved(false)};
  return <>
    <section className="pb-20 pt-36 sm:pb-28 sm:pt-44"><div className="container-lux"><SectionHeader label="MEASUREMENT GUIDE" title="A Useful Starting Point, Not A Substitute For Fitting" copy="Self-measurements can help with planning, but bespoke production should still use professional measurements and posture assessment." />
      <div className="mt-10 flex items-center justify-between gap-4 border-y border-black/15 py-5"><div className="flex items-center gap-3"><Ruler size={18}/><span className="text-sm">Measurement unit</span></div><div className="flex border border-black/15">{['cm','in'].map(u=><button key={u} onClick={()=>setUnit(u)} className={`focus-lux px-4 py-2 text-xs uppercase ${unit===u?'bg-ink text-white':''}`}>{u}</button>)}</div></div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">{fields.map(([key,label,tip])=><label key={key} className="border-b border-black/15 pb-4 text-xs text-muted"><span className="flex items-center justify-between"><span>{label}</span><button type="button" aria-label={`How to measure ${label}`} onClick={()=>setHelp({label,tip})} className="focus-lux p-1 text-gold"><HelpCircle size={16}/></button></span><div className="relative mt-2"><input type="number" min="0" step="0.1" value={values[key]||''} onChange={e=>update(key,e.target.value)} className="pr-12"/><span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted">{key==='weight'?'kg':unit}</span></div></label>)}</div>
      <div className="mt-8 flex flex-wrap items-center gap-4"><button onClick={()=>{localStorage.setItem('stitch_measurements',JSON.stringify(values));setSaved(true)}} className="focus-lux bg-ink px-6 py-4 text-[10px] uppercase tracking-[.18em] text-white">Save Measurements</button>{saved&&<span className="text-xs text-gold">Saved in this browser.</span>}</div>
    </div></section>
    <Modal open={!!help} onClose={()=>setHelp(null)} title={help?.label||''}>{help&&<p className="text-sm leading-7 text-muted">{help.tip} Keep the tape level and comfortably close to the body; do not compress the body to create a smaller number.</p>}</Modal>
    <AppointmentCTA compact/>
  </>;
}
