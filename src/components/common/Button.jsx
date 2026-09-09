import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const styles = {
  dark: 'bg-ink text-white border-ink hover:bg-charcoal',
  light: 'bg-white text-ink border-white hover:bg-cream',
  outline: 'bg-transparent text-current border-current/40 hover:border-gold hover:text-gold',
  gold: 'bg-gold text-white border-gold hover:bg-[#856536]'
};

export default function Button({ children, to, href, variant = 'dark', className = '', arrow = false, ...props }) {
  const cls = `group focus-lux inline-flex min-h-12 items-center justify-center gap-3 border px-5 sm:px-6 text-[11px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-px ${styles[variant]} ${className}`;
  const content = <>{children}{arrow && <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={15} strokeWidth={1.6} />}</>;
  if (to) return <Link className={cls} to={to}>{content}</Link>;
  if (href) return <a className={cls} href={href} {...props}>{content}</a>;
  return <button className={cls} {...props}>{content}</button>;
}
