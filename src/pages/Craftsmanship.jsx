import AppointmentCTA from '../components/common/AppointmentCTA';
import ImageReveal from '../components/common/ImageReveal';
import PageHero from '../components/common/PageHero';
import { images, galleries } from '../data/images';

const craft = [
  [
    'Pattern Making',
    'Measurements become a two-dimensional pattern shaped around posture, balance and the silhouette you want.',
    images.craftsmanshipPattern
  ],
  [
    'Cutting',
    'Cloth is aligned, checked and cut with allowance for fitting and refinement.',
    images.craftsmanshipCutting
  ],
  [
    'Canvas Construction',
    'Internal structure supports the jacket front while allowing it to settle and move with the wearer.',
    images.craftsmanshipCanvas
  ],
  [
    'Hand Finishing',
    'Small details are finished by hand where it matters. Not for show, but for how it holds and wears.',
    images.craftsmanshipHandFinishing
  ],
  [
    'Buttonholes',
    'Clean buttonholes and balanced button placement. They reward close inspection without demanding attention.',
    images.craftsmanshipButtonholes
  ],
  [
    'Fitting',
    'The fitting translates a static pattern into a garment that works while standing, sitting and moving.',
    images.craftsmanshipFitting
  ],
  [
    'Pressing',
    'Pressing shapes cloth and seam rather than simply flattening them. It\'s part of construction, not just finishing.',
    images.craftsmanshipPressing
  ],
  [
    'Final Check',
    'Edges, lining, closures and final corrections are checked before the garment leaves the atelier.',
    images.craftsmanshipFinal
  ]
];

export default function Craftsmanship() {
  return (
    <>
      <PageHero 
        eyebrow="OUR CRAFT" 
        title={<>Made By Hand.<br />Measured Twice.</>} 
        copy="A good suit should feel like yours before anyone notices the tailoring. That comes from pattern, cut, canvas, stitch and fitting." 
        image={images.craftsmanshipHero} 
      />
      
      <section className="py-24 sm:py-32">
        <div className="container-lux space-y-28 sm:space-y-36">
          {craft.map(([title, copy, image], i) => (
            <div 
              key={title} 
              className="grid min-h-[480px] items-center gap-14 lg:grid-cols-2 lg:gap-16"
            >
              <ImageReveal 
                src={image} 
                alt={title} 
                className={`aspect-[4/4.5] ${i % 2 ? 'lg:order-2' : ''}`} 
              />
              <div className={i % 2 ? 'lg:order-1' : ''}>
                <p className="text-[10px] font-medium uppercase tracking-[.28em] text-gold">
                  {String(i + 1).padStart(2, '0')} / {String(craft.length).padStart(2, '0')}
                </p>
                <h2 className="mt-5 font-serif text-5xl sm:text-6xl">{title}</h2>
                <p className="mt-7 max-w-lg text-[15px] leading-7 text-muted">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <AppointmentCTA compact />
    </>
  );
}
