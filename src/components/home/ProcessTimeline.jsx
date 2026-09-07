import { motion } from 'framer-motion';

const steps = [
  [
    '01', 
    'Conversation', 
    'Tell us where the garment is going and how you like to wear your clothes.'
  ],
  [
    '02', 
    'Fabric', 
    'Choose the cloth, weight, texture and colour that make sense for you.'
  ],
  [
    '03', 
    'Measurements', 
    'We take detailed body and posture measurements.'
  ],
  [
    '04', 
    'First Fitting', 
    'The first fitting is where proportions begin to settle.'
  ],
  [
    '05', 
    'Refinement', 
    'Small adjustments make the difference.'
  ],
  [
    '06', 
    'Final Fitting', 
    'Pressed, checked and ready to wear.'
  ]
];

export default function ProcessTimeline() {
  return (
    <div className="relative mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
      {steps.map(([num, title, copy], i) => (
        <motion.div 
          key={num} 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ delay: i * .08 }} 
          className="relative border-l border-white/20 pl-6"
        >
          <div className="absolute -left-[13px] top-0 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-[#c3a674] bg-charcoal text-[10px] font-medium text-[#d8bc89]">
            {num}
          </div>
          <h3 className="font-serif text-2xl text-cream">{title}</h3>
          <p className="mt-3 text-[14px] leading-6 text-white/55">{copy}</p>
        </motion.div>
      ))}
    </div>
  );
}
