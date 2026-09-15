import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import siteConfig from '../config/siteConfig';
import { images } from '../data/images';
import { digitsOnly, isValidPhone } from '../utils/phone';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!isValidPhone(phone)) { setError('Phone number must be exactly 10 digits.'); return; }
    setSent(true);
    setPhone('');
    event.currentTarget.reset();
  };

  const wa = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`;

  return (
    <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container-lux">
        <SectionHeader
          label="CONTACT"
          title="Start with the occasion"
          copy="For general questions, alterations or an upcoming event, send a note below or contact the studio directly."
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div>
            {sent && (
              <div className="mb-6 border-l-2 border-gold bg-white/35 p-5 text-sm leading-6">
                Your message form is complete. This prototype does not send email yet, so connect the form to your email or CRM service before launch.
              </div>
            )}

            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-wider text-muted">Full Name<input required className="mt-2" /></label>
              <label className="text-xs uppercase tracking-wider text-muted">Phone · 10 digits<input required inputMode="numeric" pattern="[0-9]{10}" maxLength="10" value={phone} onChange={(e) => setPhone(digitsOnly(e.target.value))} placeholder="98XXXXXXXX" className="mt-2" /></label>
              <label className="text-xs uppercase tracking-wider text-muted">Email<input required type="email" className="mt-2" /></label>
              <label className="text-xs uppercase tracking-wider text-muted">Subject<input required className="mt-2" /></label>
              <label className="text-xs uppercase tracking-wider text-muted sm:col-span-2">Message<textarea required rows="6" className="mt-2" placeholder="Tell us what you are looking for, your event date if relevant, and any fit or style questions." /></label>
              {error && <p className="sm:col-span-2 border-l-2 border-red-700 pl-3 text-sm normal-case tracking-normal text-red-800">{error}</p>}<div className="sm:col-span-2"><Button type="submit">Prepare Enquiry</Button></div>
            </form>

            <div className="mt-12 grid gap-6 border-y border-black/15 py-7 sm:grid-cols-3">
              <div><p className="micro-meta">Studio</p><p className="mt-2 text-sm">{siteConfig.address}</p></div>
              <div><p className="micro-meta">Phone</p><p className="mt-2 text-sm">{siteConfig.phone}</p></div>
              <div><p className="micro-meta">Email</p><p className="mt-2 break-all text-sm">{siteConfig.email}</p></div>
            </div>
          </div>

          <aside className="overflow-hidden bg-charcoal text-cream">
            <div className="aspect-[16/10] overflow-hidden bg-black/20">
              <img src={images.studio} alt={images.studioAlt} className="h-full w-full object-cover opacity-80" />
            </div>
            <div className="p-8 sm:p-10">
              <p className="text-[10px] font-medium uppercase tracking-[.28em] text-[#c3a674]">VISIT THE STUDIO</p>
              <h2 className="mt-5 font-serif text-4xl">{siteConfig.address}</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/58">Private fittings give enough time to talk through the garment, cloth, measurements and timeline without rushing the decisions.</p>

              <div className="mt-8 flex items-start gap-3 border-t border-white/15 pt-6">
                <MapPin className="mt-0.5 text-gold" size={19} strokeWidth={1.5}/>
                <div className="text-sm text-white/60"><p className="text-white">Pokhara, Nepal</p><p className="mt-1">Fittings by appointment</p></div>
              </div>

              <div className="mt-7 space-y-2 text-sm text-white/58">
                {siteConfig.openingHours.map((h) => <p key={h}>{h}</p>)}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Button href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} variant="outline" className="justify-center"><Phone size={14}/> Call</Button>
                <Button href={wa} target="_blank" rel="noreferrer" variant="outline" className="justify-center"><MessageCircle size={14}/> WhatsApp</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
