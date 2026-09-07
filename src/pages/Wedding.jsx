import AppointmentCTA from '../components/common/AppointmentCTA';
import Button from '../components/common/Button';
import ImageReveal from '../components/common/ImageReveal';
import PageHero from '../components/common/PageHero';
import SectionHeader from '../components/common/SectionHeader';
import { images } from '../data/images';

const looks = [
  [
    'Groom', 
    'A singular suit built around the ceremony, venue, season and personal style.', 
    images.weddingGroom
  ],
  [
    'Groomsmen', 
    'Coordinated without making everyone identical. Cloth, tone and details can create visual cohesion.', 
    images.weddingGroomsmen
  ],
  [
    'Reception', 
    'A second look can move from ceremonial formality to a sharper evening silhouette.', 
    images.weddingReception
  ],
  [
    'Engagement', 
    'Tailoring with enough refinement for the event and enough versatility for afterwards.', 
    images.weddingEngagement
  ],
  [
    'Traditional', 
    'Daura Suruwal and waistcoat tailoring can be coordinated with the wider wedding wardrobe.', 
    images.weddingTraditional
  ]
];

export default function Wedding() {
  return (
    <>
      <PageHero 
        eyebrow="THE WEDDING EDIT" 
        title={<>A Suit Worth<br />Remembering.</>} 
        copy="From the first fitting to the final week, we build the suit around the day you're planning." 
        image={images.weddingHero} 
      />
      
      <section className="py-24 sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            label="WEDDING TAILORING" 
            title="One Wardrobe, Many Moments" 
            copy="From engagement to ceremony and reception, the tailoring can be planned as a connected set of looks rather than separate purchases." 
          />
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {looks.map(([name, copy, image], i) => (
              <article 
                key={name} 
                className={i === 4 ? 'lg:col-start-2' : ''}
              >
                <ImageReveal src={image} alt={name} className="aspect-[4/5]" />
                <h3 className="mt-6 border-t border-black/15 pt-5 font-serif text-3xl">
                  {name}
                </h3>
                <p className="mt-3 text-[15px] leading-6 text-muted">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-charcoal py-24 text-cream sm:py-32">
        <div className="container-lux">
          <SectionHeader 
            dark 
            label="PLAN EARLY" 
            title="A Calm Wedding Timeline" 
            copy="Begin approximately 6–8 weeks before the wedding. Final timelines depend on fitting adjustments and fabric availability." 
          />
          <div className="mt-14 grid gap-px bg-white/15 md:grid-cols-4">
            {[
              ['6–8 weeks before', 'Consultation'],
              ['4–6 weeks', 'First fitting'],
              ['2–3 weeks', 'Refinement'],
              ['Final week', 'Final fitting']
            ].map(([when, what]) => (
              <div key={when} className="bg-charcoal p-6 sm:p-8">
                <p className="text-[10px] font-medium uppercase tracking-[.28em] text-[#c3a674]">
                  {when}
                </p>
                <p className="mt-5 font-serif text-3xl">{what}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-24 sm:py-32">
        <div className="container-lux grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-16">
          <ImageReveal 
            src={images.weddingDetail} 
            alt="Wedding party tailoring" 
            className="aspect-[4/3]" 
          />
          <div>
            <SectionHeader 
              label="WEDDING CONSULTATION" 
              title="Plan The Look Before Choosing The Cloth" 
              copy="Date, venue, photography, ceremony format, expected temperature and the role of traditional dress. Those constraints should shape the tailoring before colour is selected." 
            />
            <div className="mt-10">
              <Button to="/appointment">Book Wedding Consultation</Button>
            </div>
          </div>
        </div>
      </section>
      
      <AppointmentCTA compact />
    </>
  );
}
