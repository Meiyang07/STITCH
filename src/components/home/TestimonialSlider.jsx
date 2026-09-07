import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { testimonials } from '../../data/testimonials';

export default function TestimonialSlider() {
  const [i, setI] = useState(0);
  const t = testimonials[i];
  const move = (dir) => setI((i + dir + testimonials.length) % testimonials.length);
  return (
    <div className="mt-10 border-y border-black/15 py-10 sm:py-14">
      <blockquote className="max-w-4xl font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">“{t.quote}”</blockquote>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-5"><div><p className="text-sm font-medium">{t.customer}</p><p className="mt-1 text-[10px] uppercase tracking-[.18em] text-muted">{t.service}</p></div><div className="flex gap-2"><button aria-label="Previous testimonial" className="focus-lux flex h-11 w-11 items-center justify-center border border-black/20" onClick={() => move(-1)}><ChevronLeft size={17} /></button><button aria-label="Next testimonial" className="focus-lux flex h-11 w-11 items-center justify-center border border-black/20" onClick={() => move(1)}><ChevronRight size={17} /></button></div></div>
    </div>
  );
}
