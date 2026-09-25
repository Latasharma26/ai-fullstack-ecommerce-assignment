import React from "react";

export const WaveRibbon: React.FC = () => {
  const marqueeItems = [
    "HYDRA CURLS",
    "NO SLS · SILICONES · PARABENS",
    "48-HOUR HYDRATION",
    "CURLY · COILY · WAVY",
    "HYALURONIC ACID",
    "COCONUT & AVOCADO",
    "NEW LAUNCH",
    "HAIR TYPES 2, 3, 4",
  ];

  return (
    <div className="relative z-20 w-full overflow-hidden -mt-2 md:-mt-4">
      {/* Cyan Curved SVG Top/Bottom Wave Ribbon */}
      <div className="relative w-full bg-[#00D5FD] shadow-lg py-3.5 sm:py-4.5 overflow-hidden">
        {/* Continuous Seamless Marquee */}
        <div className="animate-marquee flex items-center whitespace-nowrap cursor-default">
          {/* Loop 1 */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
            {marqueeItems.map((text, i) => (
              <span key={`loop1-${i}`} className="inline-flex items-center gap-6 sm:gap-8">
                <span className="font-bison font-bold text-lg sm:text-2xl tracking-[4px] sm:tracking-[6px] uppercase text-[#003d4d]">
                  {text}
                </span>
                {/* 4-Point Custom Vector Sparkle */}
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-[#003d4d] shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </span>
            ))}
          </div>

          {/* Loop 2 (Duplicate for Seamless Infinite Marquee) */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8" aria-hidden="true">
            {marqueeItems.map((text, i) => (
              <span key={`loop2-${i}`} className="inline-flex items-center gap-6 sm:gap-8">
                <span className="font-bison font-bold text-lg sm:text-2xl tracking-[4px] sm:tracking-[6px] uppercase text-[#003d4d]">
                  {text}
                </span>
                {/* 4-Point Custom Vector Sparkle */}
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-[#003d4d] shrink-0"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
