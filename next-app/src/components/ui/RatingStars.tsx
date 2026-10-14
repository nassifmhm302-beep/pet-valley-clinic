import { Star } from "lucide-react";

export default function RatingStars({
  rating,
  count,
  size = "sm",
}: {
  rating: number | string | null | undefined;
  count?: number;
  size?: "sm" | "md";
}) {
  const value = rating ? Number(rating) : 0;
  if (!value || !count) return null;
  const starSize = size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i <= Math.round(value) ? "fill-pv-honey text-pv-honey" : "fill-transparent text-pv-border"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-pv-stone">({count})</span>
    </div>
  );
}
