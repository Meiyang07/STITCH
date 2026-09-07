import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/common/Button';
import SectionHeader from '../components/common/SectionHeader';
import siteConfig from '../config/siteConfig';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    e.currentTarget.reset();
  };
  const wa = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`;
  
  return (
    <section className="pb-24 pt-36 sm:pb-32 sm:pt-44">
      <div className="container-lux">
        <SectionHeader 
          label="CONTACT" 
          title="Get In Touch" 
          copy="Use the form for a general enquiry or choose a direct contact method below. Fittings by appointment." 
        />
        
        <div className="mt-16 grid gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            {sent && (
              <div className="mb-6 border border-gold/40 bg-white/40 p-5 text-sm">
                Thank you. This is a demo form showing a success state. No email was actually sent.
              </div>
            )}
            <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-wider text-muted">
                Full Name
                <input required className="mt-2" />
              </label>
              <label className="text-xs uppercase tracking-wider text-muted">
                Phone
                <input required placeholder="+977" className="mt-2" />
              </label>
              <label className="text-xs uppercase tracking-wider text-muted">
                Email
                <input required type="email" className="mt-2" />
              </label>
              <label className="text-xs uppercase tracking-wider text-muted">
                Subject
                <input required className="mt-2" />
              </label>
              <label className="text-xs uppercase tracking-wider text-muted sm:col-span-2">
                Message
                <textarea required rows="6" className="mt-2" />
              </label>
              <div className="sm:col-span-2">
                <Button type="submit">Send Enquiry</Button>
              </div>
            </form>
          </div>
          
          <aside className="bg-charcoal p-8 text-cream sm:p-10 lg:p-12">
            <p className="text-[10px] font-medium uppercase tracking-[.28em] text-[#c3a674]">
              STUDIO DETAILS
            </p>
            <h2 className="mt-5 font-serif text-4xl">{siteConfig.address}</h2>
            
            <div className="mt-10 border border-white/15 bg-white/5 p-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <MapPin className="text-gold" size={32} strokeWidth={1.5} />
                <div className="text-sm text-white/60">
                  <p className="font-semibold text-white">Kathmandu</p>
                  <p className="mt-1">Nepal</p>
                </div>
                <Button 
                  href="https://maps.google.com/?q=Kathmandu,Nepal" 
                  target="_blank" 
                  rel="noreferrer" 
                  variant="outline"
                  className="mt-4"
                >
                  Get Directions
                </Button>
              </div>
            </div>
            
            <div className="mt-8 space-y-3 text-sm text-white/65">
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.email}</p>
              {siteConfig.openingHours.map(h => (
                <p key={h}>{h}</p>
              ))}
            </div>
            
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button 
                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} 
                variant="outline"
                className="justify-center"
              >
                <Phone size={14} />
                Call Now
              </Button>
              <Button 
                href={wa} 
                target="_blank" 
                rel="noreferrer" 
                variant="outline"
                className="justify-center"
              >
                <MessageCircle size={14} />
                WhatsApp
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
