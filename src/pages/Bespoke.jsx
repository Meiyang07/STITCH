import AppointmentCTA from '../components/common/AppointmentCTA';
import Accordion from '../components/common/Accordion';
import ImageReveal from '../components/common/ImageReveal';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import { faqItems } from '../data/faq';
import { images } from '../data/images';

const steps = [
  [
    '01', 
    'Conversation', 
    'Tell us where the garment is going and how you like to wear your clothes. We look at fit, posture, occasion and what you already own.', 
    images.consultation
  ],
  [
    '02', 
    'Fabric', 
    'Choose the cloth, weight, texture and colour that make sense for you. We explain what works where and why.', 
    images.fabric_detail
  ],
  [
    '03', 
    'Measurements', 
    'We take detailed body and posture measurements. These are combined with observations about how you stand and move.', 
    images.measuring
  ],
  [
    '04', 
    'First Fitting', 
    'The first fitting is where proportions begin to settle. Balance, shoulder line, length and comfort are checked.', 
    images.fitting
  ],
  [
    '05', 
    'Refinement', 
    'Small adjustments make the difference. Sleeve pitch, suppression, break and stance are tuned to the body.', 
    images.handwork
  ],
  [
    '06', 
    'Final Fitting', 
    'Pressed, checked and ready to wear. We share care guidance so the fit and cloth continue to perform well.', 
    images.pressing
  ]
];

export default function Bespoke() {
  return (
    <>
      <PageHero 
        eyebrow="THE BESPOKE EXPERIENCE" 
        title={<>Not Made To Size.<br />Made Around You.</>} 
        copy="A bespoke garment is built as a sequence of decisions around the individual—cloth, pattern, structure, proportion and fitting." 
        image={images.hero} 
      />
      
      <section className="py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="THE PROCESS" 
            title="How It Works" 
            copy="Allow approximately 4–6 weeks for most bespoke garments. Wedding clients are encouraged to begin earlier. Final timelines depend on fabric availability and fitting requirements." 
          />
          <div className="mt-16 space-y-24 sm:space-y-32">
            {steps.map(([num, title, copy, image], i) => (
              <div 
                key={num} 
                className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <div className={i % 2 ? 'lg:order-2' : ''}>
                  <p className="eyebrow">STEP {num}</p>
                  <h3 className="mt-4 font-serif text-4xl sm:text-5xl">{title}</h3>
                  <p className="mt-6 max-w-xl text-[15px] leading-7 text-muted">{copy}</p>
                </div>
                <ImageReveal 
                  src={image} 
                  alt={title} 
                  className={`aspect-[4/3] ${i % 2 ? 'lg:order-1' : ''}`} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-charcoal py-24 text-cream sm:py-32">
        <div className="container-lux grid gap-14 lg:grid-cols-2">
          <SectionHeader 
            dark 
            label="PERSONALIZATION" 
            title="The Details You Choose" 
            copy="Lapel, pocket, button, lining, vent, monogram and trouser style are discussed as connected choices rather than a checklist." 
          />
          <div className="grid grid-cols-2 border-l border-t border-white/15">
            {[
              'Lapel',
              'Buttons',
              'Lining',
              'Monogram',
              'Pocket',
              'Vent',
              'Cuffs',
              'Trouser Style'
            ].map(x => (
              <div key={x} className="border-b border-r border-white/15 p-6">
                <p className="font-serif text-2xl">{x}</p>
                <p className="mt-2 text-xs leading-5 text-white/45">
                  Chosen during consultation based on garment, proportion and purpose.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="QUESTIONS" 
            title="Before Your First Fitting" 
          />
          <div className="mt-12">
            <Accordion items={faqItems.slice(0, 5)} />
          </div>
        </div>
      </section>
      
      <AppointmentCTA />
    </>
  );
}
