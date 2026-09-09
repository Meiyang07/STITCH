import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    if (!email.includes('@')) return;
    localStorage.setItem('stitch_newsletter', email);
    setDone(true);
  };

  return (
    <section id="journal" className="bg-cream py-16 sm:py-20">
      <div className="container-lux grid gap-8 border-t border-black/15 pt-10 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="eyebrow">THE JOURNAL</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl">Notes on cloth, fit and personal style.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">Occasional tailoring guides, wardrobe notes and collection updates.</p>
        </div>
        {done ? (
          <div>
            <p className="border-b border-gold pb-4 text-sm">Email saved on this device.</p>
            <p className="mt-3 text-xs leading-5 text-muted">Connect this form to your mailing platform before launch.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">Email address</label>
            <input id="newsletter-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="min-h-12 flex-1 border-x-0 border-t-0 bg-transparent px-0" />
            <button className="focus-lux min-h-12 border-b border-ink px-5 text-[10px] uppercase tracking-[.2em] transition-colors hover:border-gold hover:text-gold">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
}
