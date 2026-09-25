import React from "react";
import { ArrowRight, Droplets, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";

interface RitualSectionProps {
  onLearnMoreLeft: () => void;
  onLearnMoreRight: () => void;
}

export const RitualSection: React.FC<RitualSectionProps> = ({
  onLearnMoreLeft,
  onLearnMoreRight,
}) => {
  return (
    <section id="content-section" className="w-full bg-[#F3FDFF]">
      {/* ========================================================= */}
      {/* 1. Featured Purple Banner with Model & Bottles (slice_1.png bottom) */}
      {/* ========================================================= */}
      <div
        className="w-full text-white py-16 sm:py-20 lg:py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2A1850 0%, #1f103d 50%, #130826 100%)",
        }}
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D5FD]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Brand Info & Feature Highlights (6 cols) */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Parachute Advansed Emblem */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/icons/footericon.svg"
                  alt="Parachute Advansed"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(0,213,253,0.5)]"
                />
                <span className="font-bison font-bold text-xs uppercase tracking-[3px] text-cyan-200">
                  PARACHUTE ADVANSED
                </span>
              </div>

              {/* Cursive Brand Title */}
              <h2
                className="font-script text-4xl sm:text-5xl lg:text-6xl text-[#00D5FD] mb-3 leading-none"
                style={{ textShadow: "0 2px 20px rgba(0,213,253,0.5)" }}
              >
                Hydra Curls
              </h2>

              {/* Headline */}
              <h3 className="font-bison font-extrabold text-2xl sm:text-3xl lg:text-4xl uppercase tracking-[2px] text-white leading-tight mb-4">
                Say hello to curls that feel as good as they look.
              </h3>

              {/* Description */}
              <p className="font-script text-slate-200 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Parachute Advansed Hydra Curls is a revolutionary range crafted for Arab curly, coily &amp; wavy hair. Powered by Hyaluronic Acid, Coconut &amp; Avocado, it delivers up to 48-hour continuous hydration your curls truly need.
              </p>

              {/* 3 Floating Ingredient / Safety Pills */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-white/95 text-xs sm:text-sm font-bison font-bold tracking-[2px] uppercase shadow-md bg-white/10 border border-white/20">
                  <Droplets className="w-4 h-4 text-[#00D5FD]" />
                  <span>HYALURONIC ACID</span>
                </div>
                <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-white/95 text-xs sm:text-sm font-bison font-bold tracking-[2px] uppercase shadow-md bg-white/10 border border-white/20">
                  <Sparkles className="w-4 h-4 text-[#00D5FD]" />
                  <span>COCONUT &amp; AVOCADO</span>
                </div>
                <div className="glass-pill px-4 py-2 rounded-full flex items-center gap-2 text-white/95 text-xs sm:text-sm font-bison font-bold tracking-[2px] uppercase shadow-md bg-white/10 border border-[#00D5FD]/40">
                  <ShieldCheck className="w-4 h-4 text-[#00D5FD]" />
                  <span>0% SLS · SILICONES · PARABENS</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={onLearnMoreLeft}
                className="bg-[#00D5FD] hover:bg-[#02c3ea] text-slate-950 font-bison font-black uppercase tracking-[2px] rounded-full px-8 py-3.5 shadow-[0_0_20px_rgba(0,213,253,0.4)] flex items-center gap-2 group/btn"
              >
                <span>EXPLORE THE SCIENCE</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>

            {/* Right Column: Model Portrait & 5-Product Lineup (6 cols) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Product Bottle Lineup with Ambient Drop Shadow */}
              <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                <img
                  src="/images/grouped.webp"
                  alt="Parachute Advansed Hydra Curls 5-Step System"
                  className="w-full max-w-[500px] h-auto object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.7)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 2-Panel Ritual Cards on Light Cyan (slice_2.png top)   */}
      {/* ========================================================= */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Great Curls aren't a one-step job */}
          <div className="relative rounded-[28px] overflow-hidden shadow-xl min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-8 sm:p-12 border border-cyan-100 bg-white group hover:shadow-2xl transition-all duration-300">
            <div className="relative z-10 flex flex-col items-start">
              <span className="text-xs uppercase font-bison font-bold tracking-[3px] text-[#008ba5] bg-[#00D5FD]/15 px-3.5 py-1.5 rounded-full mb-4">
                THE CGM RITUAL
              </span>
              <h3 className="text-slate-950 text-2xl sm:text-3xl lg:text-4xl font-bison font-extrabold uppercase tracking-[2px] leading-tight mb-4">
                Great curls aren't a one-step job, they're a ritual.
              </h3>
              <p className="font-script text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                Our 5-step CGM system cleanses, deeply hydrates, defines, and seals your curls for 48 hours of bouncy, frizz-free definition tailored specifically for GCC weather.
              </p>
            </div>

            <Button
              onClick={onLearnMoreLeft}
              className="bg-[#00D5FD] hover:bg-[#02c3ea] text-slate-950 font-bison font-black uppercase tracking-[2px] rounded-full px-8 py-3.5 shadow-md flex items-center gap-2 group/btn self-start"
            >
              <span>DISCOVER THE ROUTINE</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>

          {/* Card 2: 48-Hour Continuous Hydration */}
          <div className="relative rounded-[28px] overflow-hidden shadow-xl min-h-[460px] sm:min-h-[500px] flex flex-col justify-between p-8 sm:p-12 border border-cyan-100 bg-white group hover:shadow-2xl transition-all duration-300">
            <div className="relative z-10 flex flex-col items-start">
              <span className="text-xs uppercase font-bison font-bold tracking-[3px] text-[#008ba5] bg-[#00D5FD]/15 px-3.5 py-1.5 rounded-full mb-4">
                COMPLETE CARE SYSTEM
              </span>
              <h3 className="text-slate-950 text-2xl sm:text-3xl lg:text-4xl font-bison font-extrabold uppercase tracking-[2px] leading-tight mb-4">
                Experience 48-hour continuous hydration with all 5 products.
              </h3>
              <p className="font-script text-slate-600 text-base sm:text-lg leading-relaxed mb-4">
                Shampoo, Conditioner, Defining Cream, Defining Gel &amp; Deep Hydrating Mask working together to lock in moisture.
              </p>
            </div>

            {/* Small grouped bottles preview */}
            <div className="py-2 flex items-center justify-center w-full">
              <img
                src="/images/grouped.webp"
                alt="Hydra Curls 5 Products"
                className="max-h-32 object-contain"
              />
            </div>

            <Button
              onClick={onLearnMoreRight}
              className="bg-[#00D5FD] hover:bg-[#02c3ea] text-slate-950 font-bison font-black uppercase tracking-[2px] rounded-full px-8 py-3.5 shadow-md flex items-center gap-2 group/btn self-start"
            >
              <span>SHOP ALL 5 PRODUCTS</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
