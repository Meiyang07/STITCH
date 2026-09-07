import Button from './Button';
import siteConfig from '../../config/siteConfig';

export default function AppointmentCTA({ compact = false }) {
  return (
    <section className={`bg-charcoal text-cream ${compact ? 'py-16' : 'py-20 sm:py-28'}`}>
      <div className="container-lux text-center"><p className="eyebrow text-[#c3a674]">PRIVATE CONSULTATIONS</p><h2 className="section-title mx-auto mt-5 max-w-4xl">Begin Your<br />Bespoke Journey.</h2><p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/60">A private consultation gives us time to understand the garment, occasion, fit and details before any cloth is cut.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button to="/appointment" variant="light">Book an Appointment</Button><Button href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} variant="outline">Call the Studio</Button></div></div>
    </section>
  );
}
