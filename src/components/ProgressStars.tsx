import React from "react";
import { Star } from "lucide-react";

interface ProgressStarsProps {
  stars: number;
  maxStars?: number;
  size?: number;
  animate?: boolean;
}

export const ProgressStars: React.FC<ProgressStarsProps> = ({
  stars,
  maxStars = 3,
  size = 20,
  animate = false,
}) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, idx) => {
        const isActive = idx < stars;
        return (
          <Star
            key={idx}
            size={size}
            className={`transition-all duration-300 ${
              isActive
                ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                : "text-zinc-600 opacity-30"
            } ${
              animate && isActive
                ? "animate-bounce"
                : ""
            }`}
            style={{
              animationDelay: `${idx * 150}ms`,
              animationIterationCount: animate ? 2 : undefined
            }}
          />
        );
      })}
    </div>
  );
};
