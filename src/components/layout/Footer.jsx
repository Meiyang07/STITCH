import { Link } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';

const groups = [
  [
    'THE HOUSE', 
    [
      ['About', '/story'], 
      ['Craftsmanship', '/craftsmanship'], 
      ['Our Story', '/story'], 
      ['Contact', '/contact']
    ]
  ],
  [
    'SERVICES', 
    [
      ['Bespoke', '/bespoke'], 
      ['Wedding', '/wedding'], 
      ['Alterations', '/contact'], 
      ['Corporate', '/contact']
    ]
  ],
  [
    'CUSTOMER CARE', 
    [
      ['Contact', '/contact'], 
      ['FAQs', '/faq'], 
      ['Book Appointment', '/appointment'], 
      ['Measurement Guide', '/measurements'],
      ['Login', '/login']
    ]
  ],
];

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="container-lux py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-serif text-4xl uppercase tracking-[.12em]">{siteConfig.brandName}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[.28em] text-white/40">
              BESPOKE TAILORING
            </p>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              Cut to your measurements, shaped around the way you stand, move and live.
            </p>
            <p className="mt-4 text-sm text-white/55">
              Kathmandu, Nepal
            </p>
          </div>
          {groups.map(([title, links]) => <div key={title}><p className="text-[10px] uppercase tracking-[.22em] text-[#c3a674]">{title}</p><div className="mt-5 space-y-3 text-sm text-white/65">{links.map(([label, to]) => <Link className="block hover:text-white" key={label} to={to}>{label}</Link>)}</div></div>)}
        </div>
        <div className="mt-14 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow text-[#c3a674]">VISIT</p>
            <p className="mt-4 text-sm text-white/60">{siteConfig.address}</p>
            <p className="mt-2 text-sm text-white/60">{siteConfig.phone}</p>
            <p className="mt-1 text-sm text-white/60">{siteConfig.email}</p>
          </div>
          <div>
            <p className="eyebrow text-[#c3a674]">OPENING HOURS</p>
            {siteConfig.openingHours.map(x => (
              <p className="mt-2 text-sm text-white/60" key={x}>{x}</p>
            ))}
          </div>
          <div>
            <p className="eyebrow text-[#c3a674]">SOCIAL</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/60">
              <a href={siteConfig.instagram} className="hover:text-white transition-colors">Instagram</a>
              <a href={siteConfig.facebook} className="hover:text-white transition-colors">Facebook</a>
              <a href={siteConfig.tiktok} className="hover:text-white transition-colors">TikTok</a>
            </div>
          </div>
          <div>
            <p className="eyebrow text-[#c3a674]">BOOK A FITTING</p>
            <Link 
              to="/appointment" 
              className="mt-4 inline-block border-b border-gold pb-1 text-sm transition-colors hover:text-gold"
            >
              Start appointment
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[10px] uppercase tracking-[.13em] text-white/35 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 {siteConfig.brandName}. Demo frontend.</p><div className="flex gap-5"><span>Privacy</span><span>Terms</span></div></div>
      </div>
    </footer>
  );
}
