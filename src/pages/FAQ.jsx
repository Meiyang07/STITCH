import Accordion from '../components/common/Accordion';
import AppointmentCTA from '../components/common/AppointmentCTA';
import SectionHeader from '../components/common/SectionHeader';
import { faqItems } from '../data/faq';

export default function FAQ() {
  return (
    <>
      <section className="pb-20 pt-36 sm:pb-28 sm:pt-44">
        <div className="container-lux grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
          <SectionHeader
            label="CLIENT CARE"
            title="Questions before a fitting"
            copy="A few practical answers about timing, measurements, pricing and the consultation process."
          />
          <div className="lg:pt-3"><Accordion items={faqItems} /></div>
        </div>
      </section>
      <AppointmentCTA compact />
    </>
  );
}
