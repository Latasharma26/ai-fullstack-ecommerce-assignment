import React from "react";
import { Button } from "./ui/button";

interface LaunchSectionProps {
  onExploreProducts: () => void;
  onLearnMethod: () => void;
}

export const LaunchSection: React.FC<LaunchSectionProps> = ({
  onExploreProducts,
  onLearnMethod,
}) => {
  return (
    <section className="relative w-full overflow-hidden bg-[#F3FDFF] py-16 sm:py-24 lg:py-28">
      {/* Decorative Top Right Leaves */}
      <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 lg:w-[480px] pointer-events-none select-none z-10 opacity-90">
        <img
          src="/images/leaves.webp"
          alt=""
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Launch Copy & Badges (50% balanced) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            {/* "New In Store" Italicized Script Header */}
            <div className="flex flex-col items-center lg:items-start mb-3">
              <span className="font-script italic text-2xl sm:text-3xl text-slate-800 tracking-wider">
                New In Store
              </span>
              <img
                src="/images/curlyline.svg"
                alt=""
                className="w-28 sm:w-36 h-auto object-contain -mt-1"
              />
            </div>

            {/* Launch Logo */}
            <div className="w-40 sm:w-48 mb-5">
              <img
                src="/images/hydracurllaunchlogo.webp"
                alt="Parachute Advansed Hydra Curls"
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Description (constrained line length 65-75 chars) */}
            <p className="font-script text-slate-700 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-xl mb-8">
              Introducing a revolutionary hair care range specially designed for Arab curly, coily &amp; wavy hair. Experience 48-hour hydration with natural ingredients like Hyaluronic Acid, Coconut &amp; Avocado.
            </p>

            {/* Highlight Badges with Authentic SVG Icons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-3.5 mb-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#00D5FD]/10 border border-[#00D5FD]/25 shadow-sm hover:scale-105 transition-transform">
                <img
                  src="/icons/charm_circle-tick.svg"
                  alt=""
                  className="w-4 h-4 object-contain"
                />
                <span className="text-slate-800 text-xs sm:text-sm font-bison font-bold tracking-[1.5px] uppercase">
                  No SLS, Silicones, Parabens
                </span>
              </div>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#00D5FD]/10 border border-[#00D5FD]/25 shadow-sm hover:scale-105 transition-transform">
                <img
                  src="/icons/ic_outline-water-drop.svg"
                  alt=""
                  className="w-3.5 h-4 object-contain"
                />
                <span className="text-slate-800 text-xs sm:text-sm font-bison font-bold tracking-[1.5px] uppercase">
                  48-Hour Hydration
                </span>
              </div>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#00D5FD]/10 border border-[#00D5FD]/25 shadow-sm hover:scale-105 transition-transform">
                <img
                  src="/icons/boxicons_sparkles.svg"
                  alt=""
                  className="w-4 h-4 object-contain"
                />
                <span className="text-slate-800 text-xs sm:text-sm font-bison font-bold tracking-[1.5px] uppercase">
                  Hair Types 2(Wavy), 3(Curly), 4(Coily)
                </span>
              </div>
            </div>

            {/* Primary Solid vs Secondary Outline CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                onClick={onExploreProducts}
                size="lg"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-[#00D5FD] hover:bg-[#02D3FC] text-slate-950 font-bison font-extrabold uppercase tracking-[2px] rounded-full px-8 py-4 shadow-[0_0_20px_rgba(0,213,253,0.35)] hover:scale-105 transition-all"
              >
                <span>EXPLORE PRODUCTS</span>
                <img
                  src="/icons/buynowrightarrow.svg"
                  alt=""
                  className="w-3.5 h-3.5 object-contain"
                />
              </Button>
              <Button
                onClick={onLearnMethod}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-[#00D5FD] text-[#00D5FD] hover:bg-[#00D5FD] hover:text-slate-950 font-bison font-bold uppercase tracking-[2px] rounded-full px-8 py-4 bg-transparent transition-all"
              >
                <span>LEARN CURLY GIRL METHOD</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Visual Product + Water Splash (50% balanced) */}
          <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[480px] lg:min-h-[580px] order-1 lg:order-2">
            {/* Water Splash */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
              <img
                src="/images/water-splash.webp"
                alt=""
                className="w-[85%] sm:w-[92%] max-w-[560px] h-auto object-contain opacity-85 transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Floating Tilted Shampoo Bottle */}
            <div className="relative z-20 w-[190px] sm:w-[240px] md:w-[280px] transform rotate-[18deg] hover:rotate-[12deg] transition-transform duration-500 cursor-pointer drop-shadow-[0_25px_40px_rgba(0,0,0,0.25)]">
              <img
                src="/images/SHAMPOO.webp"
                alt="Hydra Curls Hydrating Shampoo Bottle"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curly Divider Bottom */}
      <div className="w-full mt-14 overflow-hidden">
        <img
          src="/images/curlydivider.svg"
          alt=""
          className="w-full h-auto object-cover"
        />
      </div>
    </section>
  );
};
