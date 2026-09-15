import { Link } from 'react-router-dom';
import siteConfig from '../../config/siteConfig';

const groups = [
  ['THE HOUSE', [
    ['Our Story', '/story'],
    ['Craftsmanship', '/craftsmanship'],
    ['Fabrics', '/fabrics'],
    ['Contact', '/contact'],
  ]],
  ['SERVICES', [
    ['Bespoke', '/bespoke'],
    ['Wedding', '/wedding'],
    ['Collections', '/collections'],
    ['Ready-Made', '/readymade'],
    ['Accessories', '/accessories'],
    ['Book a Fitting', '/appointment'],
  ]],
  ['CLIENT CARE', [
    ['Profile', '/profile'],
    ['Measurements', '/measurements'],
    ['Wishlist', '/wishlist'],
    ['Cart', '/cart'],
    ['FAQs', '/faq'],
  ]],
];

export default function Footer() {
  const socials = [
    ['Instagram', siteConfig.instagram],
    ['Facebook', siteConfig.facebook],
    ['TikTok', siteConfig.tiktok],
  ].filter(([, href]) => href && !/^https?:\/\/(www\.)?(instagram|facebook|tiktok)\.com\/?$/i.test(href));

  return (
    <footer className="bg-ink text-cream">
      <div className="container-lux py-16 sm:py-20 lg:py-24">
        <div className="grid gap-12 border-b border-white/12 pb-14 md:grid-cols-2 lg:grid-cols-5 lg:pb-16">
          <div className="lg:col-span-2">
            <p className="font-serif text-4xl uppercase tracking-[.14em] sm:text-5xl">{siteConfig.brandName}</p>
            <p className="mt-3 text-[10px] uppercase tracking-[.28em] text-[#c3a674]">Bespoke Tailoring · Pokhara</p>
            <p className="mt-7 max-w-sm text-sm leading-7 text-white/55">
              Individually cut garments, considered cloth and fittings shaped around the person wearing them.
            </p>
            <Link to="/appointment" className="mt-8 inline-block border-b border-[#c3a674] pb-1 text-[10px] uppercase tracking-[.18em] text-white/80 transition-colors hover:text-[#c3a674]">
              Book a private fitting
            </Link>
          </div>

          {groups.map(([title, links]) => (
            <div key={title}>
              <p className="text-[10px] uppercase tracking-[.22em] text-[#c3a674]">{title}</p>
              <div className="mt-5 space-y-3 text-sm text-white/62">
                {links.map(([label, to]) => (
                  <Link className="block transition-colors hover:text-white" key={label} to={to}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-9 py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-[9px] uppercase tracking-[.2em] text-white/35">Studio</p>
            <p className="mt-3 text-sm text-white/62">{siteConfig.address}</p>
            <p className="mt-2 text-sm text-white/62">Fittings by appointment</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[.2em] text-white/35">Contact</p>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, '')}`} className="mt-3 block text-sm text-white/62 hover:text-white">{siteConfig.phone}</a>
            <a href={`mailto:${siteConfig.email}`} className="mt-2 block text-sm text-white/62 hover:text-white">{siteConfig.email}</a>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[.2em] text-white/35">Opening hours</p>
            {siteConfig.openingHours.map((x) => <p className="mt-2 text-sm text-white/62" key={x}>{x}</p>)}
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[.2em] text-white/35">Follow</p>
            {socials.length ? (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/62">
                {socials.map(([label, href]) => <a key={label} href={href} target="_blank" rel="noreferrer" className="hover:text-white">{label}</a>)}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-white/38">Social links can be added in siteConfig.js.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-[9px] uppercase tracking-[.15em] text-white/32 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.brandName}. Pokhara, Nepal.</p>
          <p>Made to measure the person, not the size.</p>
        </div>
      </div>
    </footer>
  );
}
