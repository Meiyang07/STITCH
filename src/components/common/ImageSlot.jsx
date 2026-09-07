import { Image as ImageIcon } from 'lucide-react';

export default function ImageSlot({ label = 'Add image', className = '' }) {
  return (
    <div className={`flex h-full w-full items-center justify-center border border-black/10 bg-warm ${className}`}>
      <div className="px-4 text-center text-muted/70">
        <ImageIcon className="mx-auto" size={24} strokeWidth={1.2} />
        <p className="mt-3 text-[9px] font-medium uppercase tracking-[.2em]">{label}</p>
      </div>
    </div>
  );
}
