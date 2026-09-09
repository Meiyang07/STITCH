import AppointmentCTA from '../components/common/AppointmentCTA';
import ImageReveal from '../components/common/ImageReveal';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import { images } from '../data/images';

const sections = [
  [
    'Why Stitch',
    'Our story begins with a simple idea: clothes should be made around people, not standard sizes. We cut each garment around the person wearing it.',
    images.story_feature
  ],
  [
    'How We Work',
    'Every client begins with a conversation. We look at how you dress, where you\'ll wear the garment, how you stand and how you want it to feel.',
    images.consultation
  ],
  [
    'The Atelier',
    'A calm space for fittings, fabric consultations and the small decisions that shape a bespoke garment. Appointments are by booking only.',
    images.studio
  ],
  [
    'The People',
    'Pattern making, cutting, canvas construction and hand finishing. Each stage is handled by craftspeople who understand how the parts connect.',
    images.team
  ],
  [
    'What We Care About',
    'Fit that works with posture and movement. Cloth chosen for purpose and climate. Construction that lasts. Details finished by hand where it matters.',
    images.handwork
  ],
  [
    'What Happens Next',
    'Book a fitting. We\'ll talk about what you need, show fabric samples, take measurements and explain how the process works from there.',
    images.measuring
  ]
];

export default function Story() {
  return (
    <>
      <PageHero 
        eyebrow="OUR STORY" 
        title={<>Made Around You,<br />Not Around A Size.</>}
        copy="A contemporary tailoring house in Pokhara focused on personal fit, precise construction and honest service." 
        image={images.studio} 
      />
      
      <section className="py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="WHO WE ARE" 
            title="The Story So Far" 
            copy="STITCH is built around a simple contemporary idea: make fewer assumptions, ask better questions and cut the garment around the person wearing it." 
          />

          <div className="mt-12">
            <ImageReveal
              src={images.story_feature}
              alt={images.storyFeatureAlt}
              className="aspect-[16/8] sm:aspect-[16/7]"
              imgClassName="object-center"
              eager
            />
            <div className="mt-4 flex items-center justify-between gap-6 border-t border-black/10 pt-4 text-[9px] uppercase tracking-[.2em] text-muted">
              <span>Inside STITCH</span>
              <span>Pokhara · By appointment</span>
            </div>
          </div>

          <div className="mt-20 space-y-24 sm:space-y-28">
            {sections.map(([title, copy, image], i) => (
              <div 
                key={title} 
                className="grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16"
              >
                <div className={i % 2 ? 'lg:order-2' : ''}>
                  <p className="text-[10px] font-medium uppercase tracking-[.28em] text-gold">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mt-4 font-serif text-5xl">{title}</h2>
                  <p className="mt-6 max-w-xl text-[15px] leading-7 text-muted">{copy}</p>
                </div>
                <ImageReveal 
                  src={image} 
                  alt={title} 
                  className={`aspect-[5/4] ${i % 2 ? 'lg:order-1' : ''}`} 
                />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <AppointmentCTA compact />
    </>
  );
}
