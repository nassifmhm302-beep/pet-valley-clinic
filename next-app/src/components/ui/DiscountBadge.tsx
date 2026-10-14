export default function DiscountBadge({ percent }: { percent: number }) {
  if (!percent || percent <= 0) return null;
  return (
    <span className="pv-pulse absolute right-3 top-3 z-10 rounded-full bg-pv-honey px-2.5 py-1 text-[11px] font-extrabold text-pv-green-dark shadow-sm">
      خصم {percent}%
    </span>
  );
}
