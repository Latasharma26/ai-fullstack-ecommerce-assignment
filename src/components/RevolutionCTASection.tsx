import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

interface RevolutionCTASectionProps {
  onExploreProducts: () => void;
  onLearnMethod: () => void;
}

export const RevolutionCTASection: React.FC<RevolutionCTASectionProps> = ({
  onExploreProducts,
  onLearnMethod,
}) => {
  return (
    <section
      id="curly-hair-revolution-section"
      className="relative z-10 w-full py-20 md:py-28 text-white overflow-hidden"
      style={{
        backgroundImage: "url('/images/revolutionbackground.svg')",
        backgroundColor: "#201335",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "top center",
      }}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#00D5FD]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
        {/* Main CTA Block */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="font-script text-cyan-300 text-lg sm:text-xl tracking-widest uppercase mb-1">
            Empower Your Curls
          </span>
          <img
            src="/images/whitecurlyline.svg"
            alt=""
            className="w-28 sm:w-36 h-auto mb-4"
          />
          <h2 className="font-bison font-bold text-4xl sm:text-5xl md:text-6xl uppercase tracking-[2px] leading-tight mb-4">
            Join the <span className="text-[#00D5FD]">Curly Hair Revolution</span>
          </h2>
          <p className="font-script text-slate-200 text-base sm:text-xl leading-relaxed mb-8 max-w-2xl">
            Transform your curly hair journey with expert guidance, premium products, and a supportive community.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button
              onClick={onExploreProducts}
              size="lg"
              className="bg-[#00D5FD] hover:bg-[#00b9dc] text-slate-950 font-bison font-extrabold tracking-[2px] uppercase px-8 py-6 rounded-full shadow-lg shadow-[#00D5FD]/25 hover:scale-105 transition-all flex items-center gap-3 text-sm sm:text-base group"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-slate-950" />
            </Button>
            <Button
              onClick={onLearnMethod}
              variant="outline"
              size="lg"
              className="border-2 border-white/60 text-white hover:bg-white/10 hover:border-[#00D5FD] hover:text-[#00D5FD] font-bison font-bold tracking-[2px] uppercase px-8 py-6 rounded-full backdrop-blur-sm transition-all text-sm sm:text-base"
            >
              <span>Learn Curly Girl Method</span>
            </Button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Point 99: Oversized Bold Stats Counter Strip with Dividers */}
        {/* ========================================================= */}
        <div className="w-full max-w-6xl mx-auto rounded-3xl bg-white/[0.04] border border-white/15 backdrop-blur-md p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            {/* Stat 1 */}
            <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bison font-black text-[#00D5FD] tracking-tight leading-none mb-3 drop-shadow-[0_2px_12px_rgba(0,213,253,0.4)]">
                48h
              </p>
              <p className="text-xs sm:text-sm font-bison font-bold uppercase tracking-[3px] text-white/90 leading-tight">
                Continuous Hydration
              </p>
            </div>

            {/* Stat 2 */}
            <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bison font-black text-[#00D5FD] tracking-tight leading-none mb-3 drop-shadow-[0_2px_12px_rgba(0,213,253,0.4)]">
                05
              </p>
              <p className="text-xs sm:text-sm font-bison font-bold uppercase tracking-[3px] text-white/90 leading-tight">
                Ritual Products
              </p>
            </div>

            {/* Stat 3 */}
            <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center pt-6 sm:pt-6">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bison font-black text-[#00D5FD] tracking-tight leading-none mb-3 drop-shadow-[0_2px_12px_rgba(0,213,253,0.4)]">
                3
              </p>
              <p className="text-xs sm:text-sm font-bison font-bold uppercase tracking-[3px] text-white/90 leading-tight">
                Hair Types (2, 3, 4)
              </p>
            </div>

            {/* Stat 4 */}
            <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center pt-6 sm:pt-6">
              <p className="text-5xl sm:text-6xl lg:text-7xl font-bison font-black text-[#00D5FD] tracking-tight leading-none mb-3 drop-shadow-[0_2px_12px_rgba(0,213,253,0.4)]">
                0
              </p>
              <p className="text-xs sm:text-sm font-bison font-bold uppercase tracking-[3px] text-white/90 leading-tight">
                SLS, Silicones, Parabens
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
