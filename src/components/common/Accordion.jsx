import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="border-t border-black/15">
      {items.map((item, i) => (
        <div key={item.q} className="border-b border-black/15">
          <button className="focus-lux flex w-full items-center justify-between gap-4 py-5 text-left" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span className="font-serif text-xl sm:text-2xl">{item.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }}><Plus size={19} /></motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="max-w-3xl pb-6 text-sm leading-7 text-muted">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
