import React from "react";
import { Droplet, Sparkles } from "lucide-react";

export const ClinicalSection: React.FC = () => {
  return (
    <section
      id="clinical-section"
      className="relative z-10 w-full overflow-hidden py-20 sm:py-28 lg:py-32 bg-[#DAF6FF]/70"
    >
      {/* Background SVG Wave Motif */}
      <div className="absolute inset-0 pointer-events-none select-none -z-10 opacity-70">
        <svg
          viewBox="0 0 1920 1080"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,0 C600,200 1200,50 1920,180 L1920,1080 L0,1080 Z"
            fill="#EAF9FF"
          />
        </svg>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-20">
          <span className="font-script text-slate-800 text-2xl sm:text-3xl md:text-4xl tracking-wide">
            The Hydra Curls Promise
          </span>
          <img
            src="/images/curlyline.svg"
            alt=""
            className="w-40 sm:w-56 h-auto object-contain mt-1 mb-4"
          />
          <h2 className="font-bison font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl uppercase tracking-[3px] text-slate-950 leading-tight">
            Clinically Proven <br className="hidden sm:block" />
            <span className="text-[#00D5FD]">48-Hour</span> Hydration
          </h2>
          <p className="font-script text-slate-700 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto mt-4">
            Our advanced formula with Hyaluronic Acid doesn't just coat your hair; it penetrates the cuticle to lock in moisture from the inside out, providing continuous hydration for two full days.
          </p>
        </div>

        {/* Content Layout: 2 Scientific Cards + 48H Clock Meter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: 2 Balanced Side-by-Side Science Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Card 1: Moisture Retention */}
            <div className="glass-card-clinical rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Droplet className="w-7 h-7 text-[#00D5FD]" />
                </div>
                <h4 className="font-bison font-extrabold uppercase text-xl sm:text-2xl text-slate-950 tracking-wider mb-3">
                  Moisture Retention
                </h4>
                <p className="font-script text-slate-600 text-base sm:text-lg leading-relaxed">
                  Hyaluronic Acid acts like a magnet for moisture, drawing and binding deep hydration into each strand for long-lasting elasticity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-cyan-100/60 flex items-center gap-2 text-xs font-bison font-bold uppercase tracking-widest text-[#00D5FD]">
                <span>1000X MOISTURE BINDING</span>
              </div>
            </div>

            {/* Card 2: Strengthening Seal */}
            <div className="glass-card-clinical rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:-translate-y-2 transition-all duration-300 group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-[#00D5FD]" />
                </div>
                <h4 className="font-bison font-extrabold uppercase text-xl sm:text-2xl text-slate-950 tracking-wider mb-3">
                  Strengthening Seal
                </h4>
                <p className="font-script text-slate-600 text-base sm:text-lg leading-relaxed">
                  Coconut &amp; Avocado oils seal the cuticle tightly, preventing moisture loss and defending against GCC humidity and heat.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-cyan-100/60 flex items-center gap-2 text-xs font-bison font-bold uppercase tracking-widest text-[#00D5FD]">
                <span>CUTICLE PROTECTION</span>
              </div>
            </div>
          </div>

          {/* Right: 48-Hour Dial Centerpiece (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6">
            {/* Clock Circle with Animated Arc */}
            <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-68 md:h-68 flex items-center justify-center">
              {/* Rotating Arc SVG */}
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 200 200"
                className="absolute inset-0 animate-spin-arc pointer-events-none"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="#00D5FD"
                  strokeWidth="7"
                  strokeDasharray="240 320"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>

              {/* Animated Clock GIF */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-2xl p-2 border-4 border-cyan-200">
                <img
                  src="/animation/clock.gif"
                  alt="48 Hour Clock"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Giant 48 Number & Hours Tag */}
            <div className="relative inline-flex items-end justify-center mt-5">
              <span className="font-bison font-black text-8xl sm:text-9xl md:text-[130px] text-slate-950 leading-none select-none tracking-tight drop-shadow-sm">
                48
              </span>
              <span
                className="absolute text-slate-950 text-sm sm:text-base font-bison font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-md bg-[#00D5FD]"
                style={{
                  bottom: "12px",
                  right: "-54px",
                  transform: "rotate(-8deg)",
                }}
              >
                Hours
              </span>
            </div>

            <p className="text-slate-800 text-center font-bison font-extrabold text-base sm:text-lg uppercase tracking-[2px] mt-3">
              OF CONTINUOUS CURL HYDRATION <br />
              AND FRIZZ CONTROL.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
