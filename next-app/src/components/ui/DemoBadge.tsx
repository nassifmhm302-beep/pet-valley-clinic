export default function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`absolute left-3 top-3 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-pv-stone shadow-sm ring-1 ring-pv-border ${className}`}
    >
      نموذج تجريبي
    </span>
  );
}
