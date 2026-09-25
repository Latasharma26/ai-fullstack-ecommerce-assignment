import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden flex flex-col items-center justify-center bg-[#150926] py-16 sm:py-20 md:py-24"
    >
      {/* Background Graphic & Ambient Radial Purple Lighting matching Figma */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src="/images/background.jpeg"
          alt=""
          className="w-full h-full object-cover opacity-40 mix-blend-screen"
        />
        {/* Soft Radial Ambient Purple Glow in Center */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(131, 78, 153, 0.65) 0%, rgba(42, 24, 80, 0.9) 45%, #150926 85%)",
          }}
        />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 w-full flex flex-col items-center justify-center text-center">
        {/* Brand Crest in Center of Glow */}
        <div className="mb-4 flex flex-col items-center">
          <img
            src="/icons/footericon.svg"
            alt="Parachute Advansed Emblem"
            className="w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 object-contain drop-shadow-[0_0_25px_rgba(0,213,253,0.7)] mb-3"
          />
          <span className="font-bison font-bold text-xs sm:text-sm tracking-[5px] uppercase text-[#00D5FD] drop-shadow-sm">
            PARACHUTE ADVANSED
          </span>
        </div>

        {/* Display Main Title matching Figma */}
        <h1 className="font-bison font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[3px] uppercase text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)] leading-tight mb-2">
          HYDRA <span className="text-[#00D5FD]">CURLS</span>
        </h1>

        {/* Cursive Tagline inside the Glowing Orb matching Figma */}
        <p
          className="font-script text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-cyan-200 mb-8 max-w-2xl leading-relaxed"
          style={{ textShadow: "0 2px 20px rgba(0, 213, 253, 0.7)" }}
        >
          Pure ingredients. Real results. <br className="hidden sm:block" />
          Every drop counts.
        </p>

        {/* Mouse Icon Scroll Indicator */}
        <div className="flex flex-col items-center justify-center gap-2 select-none cursor-pointer pt-2">
          <a
            href="#launch-section"
            className="flex flex-col items-center gap-2 group text-white/80 hover:text-white transition-colors"
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/60 group-hover:border-[#00D5FD] flex items-start justify-center p-1.5 transition-colors">
              <div className="w-1.5 h-2.5 rounded-full bg-[#00D5FD] animate-scroll-dot" />
            </div>
            <p className="font-sans text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-white/70 group-hover:text-cyan-300 transition-colors">
              SCROLL TO EXPLORE
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};
