import Button from './Button';
import siteConfig from '../../config/siteConfig';

export default function AppointmentCTA({ compact = false }) {
  return (
    <section className={`relative overflow-hidden bg-charcoal text-cream ${compact ? 'py-16 sm:py-20' : 'py-20 sm:py-28'}`}>
      <div className="absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-white/[.04]" />
      <div className="container-lux relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="eyebrow text-[#c3a674]">PRIVATE FITTINGS</p>
          <h2 className="section-title mt-5 max-w-4xl">Begin with a conversation.</h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-white/58">
            Tell us what you need, when you need it and how you want it to feel. We’ll use the consultation to narrow the cloth, silhouette and fitting plan.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
          <Button to="/appointment" variant="light">Book a Fitting</Button>
          <Button href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} variant="outline">Call the Studio</Button>
        </div>
      </div>
    </section>
  );
}
