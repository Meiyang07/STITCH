import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import useLocalStorage from '../hooks/useLocalStorage';

const services = ['Bespoke Suit','Wedding Suit','Shirt','Tuxedo','Traditional Wear','Alteration','Style Consultation'];
const times = ['10:00 AM','11:30 AM','1:00 PM','2:30 PM','4:00 PM','5:30 PM'];
const steps = ['Service','Location','Date','Time','Details','Notes','Confirm'];

const defaultForm = { service:'', location:'At Studio', date:'', time:'', name:'', phone:'', email:'', contact:'Phone', occasion:'', eventDate:'', notes:'' };

export default function Appointment() {
  const [form, setForm] = useLocalStorage('stitch_appointment_draft', defaultForm);
  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const canNext = useMemo(() => {
    if (step===0) return !!form.service;
    if (step===1) return !!form.location;
    if (step===2) return !!form.date;
    if (step===3) return !!form.time;
    if (step===4) return form.name && form.phone && form.email.includes('@');
    return true;
  }, [step, form]);
  const update = (k,v) => setForm({...form,[k]:v});
  const submit = () => { localStorage.setItem('stitch_booking', JSON.stringify({...form, createdAt:new Date().toISOString()})); setConfirmed(true); };

  if (confirmed) return <section className="flex min-h-[78vh] items-center pb-20 pt-32"><div className="container-lux"><div className="mx-auto max-w-2xl border border-black/15 bg-white/35 p-8 text-center sm:p-12"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold text-gold"><Check /></div><p className="eyebrow mt-7">REQUEST SAVED</p><h1 className="mt-4 font-serif text-5xl">Appointment Request Received</h1><p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-muted">This frontend demo saved the booking in your browser only. No message has been sent to a real studio because there is no backend connected.</p><div className="mt-8 border-y border-black/15 py-6 text-left text-sm"><p><strong>{form.service}</strong> · {form.location}</p><p className="mt-2 text-muted">{form.date} at {form.time}</p><p className="mt-2 text-muted">{form.name} · {form.phone}</p></div><Button onClick={()=>{setConfirmed(false);setStep(0)}} variant="outline" className="mt-7">Make Another Request</Button></div></div></section>;

  return <section className="pb-20 pt-36 sm:pb-28 sm:pt-44"><div className="container-lux"><SectionHeader label="PRIVATE CONSULTATION" title="Book An Appointment" copy="A seven-step frontend booking flow. The draft is saved locally as you move through it." />
    <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="h-fit border border-black/15 p-5"><p className="text-[10px] uppercase tracking-[.18em] text-muted">Progress</p><div className="mt-5 space-y-1">{steps.map((s,i)=><div key={s} className={`flex items-center gap-3 py-2 text-sm ${i===step?'text-ink':i<step?'text-gold':'text-muted'}`}><span className="w-6 text-[10px]">{String(i+1).padStart(2,'0')}</span><span>{s}</span></div>)}</div></aside>
      <div className="min-h-[500px] border-t border-black/15 pt-8">
        {step===0 && <div><p className="eyebrow">STEP 1</p><h2 className="mt-3 font-serif text-4xl">What are we tailoring?</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{services.map(s=><button key={s} onClick={()=>update('service',s)} className={`focus-lux border p-5 text-left text-sm ${form.service===s?'border-ink bg-ink text-white':'border-black/15 hover:border-gold'}`}>{s}</button>)}</div></div>}
        {step===1 && <div><p className="eyebrow">STEP 2</p><h2 className="mt-3 font-serif text-4xl">Where should we meet?</h2><div className="mt-7 grid gap-3 sm:grid-cols-2">{['At Studio','Virtual Consultation'].map(s=><button key={s} onClick={()=>update('location',s)} className={`focus-lux min-h-28 border p-5 text-left ${form.location===s?'border-ink bg-ink text-white':'border-black/15'}`}><strong>{s}</strong><p className="mt-2 text-xs opacity-65">{s==='At Studio'?'Private fitting in Kathmandu.':'Initial discussion online; physical fitting may still be required.'}</p></button>)}</div></div>}
        {step===2 && <div className="max-w-lg"><p className="eyebrow">STEP 3</p><h2 className="mt-3 font-serif text-4xl">Choose a preferred date.</h2><label className="mt-7 block text-xs uppercase tracking-[.14em] text-muted">Appointment date<input type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e=>update('date',e.target.value)} className="mt-2"/></label><p className="mt-4 text-xs leading-5 text-muted">This demo does not check real studio availability.</p></div>}
        {step===3 && <div><p className="eyebrow">STEP 4</p><h2 className="mt-3 font-serif text-4xl">Select a preferred time.</h2><div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">{times.map(t=><button key={t} onClick={()=>update('time',t)} className={`focus-lux border p-4 text-sm ${form.time===t?'border-ink bg-ink text-white':'border-black/15 hover:border-gold'}`}>{t}</button>)}</div></div>}
        {step===4 && <div><p className="eyebrow">STEP 5</p><h2 className="mt-3 font-serif text-4xl">Your details.</h2><div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="text-xs text-muted">Full name<input value={form.name} onChange={e=>update('name',e.target.value)} className="mt-2"/></label><label className="text-xs text-muted">Phone<input value={form.phone} onChange={e=>update('phone',e.target.value)} placeholder="+977" className="mt-2"/></label><label className="text-xs text-muted">Email<input type="email" value={form.email} onChange={e=>update('email',e.target.value)} className="mt-2"/></label><label className="text-xs text-muted">Preferred contact<select value={form.contact} onChange={e=>update('contact',e.target.value)} className="mt-2"><option>Phone</option><option>WhatsApp</option><option>Email</option></select></label></div></div>}
        {step===5 && <div><p className="eyebrow">STEP 6</p><h2 className="mt-3 font-serif text-4xl">Anything we should know?</h2><div className="mt-7 grid gap-4 sm:grid-cols-2"><label className="text-xs text-muted">Occasion<input value={form.occasion} onChange={e=>update('occasion',e.target.value)} className="mt-2"/></label><label className="text-xs text-muted">Event date<input type="date" value={form.eventDate} onChange={e=>update('eventDate',e.target.value)} className="mt-2"/></label><label className="text-xs text-muted sm:col-span-2">Requirements<textarea rows="5" value={form.notes} onChange={e=>update('notes',e.target.value)} className="mt-2" placeholder="Preferred style, color, dress code, concerns about fit..."/></label></div></div>}
        {step===6 && <div><p className="eyebrow">STEP 7</p><h2 className="mt-3 font-serif text-4xl">Review your request.</h2><div className="mt-7 divide-y divide-black/10 border-y border-black/15">{[['Service',form.service],['Location',form.location],['Date',form.date],['Time',form.time],['Name',form.name],['Phone',form.phone],['Email',form.email],['Occasion',form.occasion||'—'],['Event Date',form.eventDate||'—'],['Notes',form.notes||'—']].map(([k,v])=><div key={k} className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm"><span className="text-muted">{k}</span><span>{v}</span></div>)}</div><Button onClick={submit} className="mt-7">Confirm Appointment</Button></div>}
        <div className="mt-10 flex justify-between border-t border-black/15 pt-6"><Button disabled={step===0} onClick={()=>setStep(Math.max(0,step-1))} variant="outline" className={step===0?'invisible':''}><ChevronLeft size={15}/> Back</Button>{step<6 && <Button disabled={!canNext} onClick={()=>canNext&&setStep(step+1)} className={!canNext?'opacity-40':''}>Continue <ChevronRight size={15}/></Button>}</div>
      </div>
    </div>
  </div></section>;
}
