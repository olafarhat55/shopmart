import { Star } from "lucide-react";

export const Stars = ({ value }: { value: number }) => {
  const clamped = Math.max(0, Math.min(5, Number(value) || 0));
  const stars = Array.from({ length: 5 });

  return (
    <div
      role="img"
      aria-label={`Rating: ${value} out of 5`}
      className="flex items-center gap-1"
    >
      {stars.map((_, i) => {
        const fill = Math.max(0, Math.min(1, clamped - i)); // 0..1 fill for this star
        return (
          <span key={i} className="relative inline-block h-4 w-4">
            {/* base (unfilled) star using muted foreground */}
            <Star className="h-4 w-4 text-muted-foreground" />

            {/* filled overlay clipped to the fraction — use yellow fill */}
            {fill > 0 && (
              <span
                className="absolute left-0 top-0 overflow-hidden pointer-events-none"
                style={{ width: `${fill * 100}%`, height: "100%" }}
                aria-hidden
              >
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};
