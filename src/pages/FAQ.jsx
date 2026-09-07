import Accordion from '../components/common/Accordion';
import AppointmentCTA from '../components/common/AppointmentCTA';
import SectionHeader from '../components/common/SectionHeader';
import { faqItems } from '../data/faq';

export default function FAQ() {
  return <><section className="pb-20 pt-36 sm:pb-28 sm:pt-44"><div className="container-lux"><SectionHeader label="CUSTOMER CARE" title="Frequently Asked Questions" copy="Operational answers in this demo are placeholders. Confirm real turnaround times, delivery policies and alteration terms before publishing." /><div className="mt-12 max-w-4xl"><Accordion items={faqItems} /></div></div></section><AppointmentCTA compact /></>;
}
