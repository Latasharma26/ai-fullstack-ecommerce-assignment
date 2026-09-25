import React, { useState } from "react";
import { hairTypes } from "../data/guides";
import { HairType } from "../types";
import { ArrowRight, Sparkles } from "lucide-react";

export const HairfluencersSection: React.FC = () => {
  const [selectedType, setSelectedType] = useState<HairType>(hairTypes[1]);

  // Model portraits matching Figma 3 hair types
  const typeModels: Record<string, { image: string; script: string }> = {
    "Type 2": {
      image: "/images/newafter.webp",
      script: "wavy",
    },
    "Type 3": {
      image: "/images/image (5).png",
      script: "curly",
    },
    "Type 4": {
      image: "/images/image (6).png",
      script: "coily",
    },
  };

  // Hairfluencer Instagram selfies matching slice_4.png bottom
  const influencers = [
    { name: "Noor K.", handle: "@noor.curls", img: "/images/image (7).png" },
    { name: "Fatima A.", handle: "@fatima_curly", img: "/images/image (5).png" },
    { name: "Layla M.", handle: "@layla_coils", img: "/images/image (6).png" },
    { name: "Yara H.", handle: "@yara.waves", img: "/images/newafter.webp" },
    { name: "Sara D.", handle: "@saracurlz", img: "/images/Mena1.webp" },
    { name: "Dana B.", handle: "@dana_curls", img: "/images/Mena2.webp" },
    { name: "Reem S.", handle: "@reem.coily", img: "/images/Mena3.webp" },
    { name: "Mariam T.", handle: "@mariam_natural", img: "/images/image (4).png" },
  ];

  return (
    <section id="experts-section" className="relative w-full py-16 sm:py-24 bg-[#F3FDFF] text-slate-900 overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
        
        {/* ========================================================= */}
        {/* 1. Hairfluencers Selfie Grid (slice_4.png bottom & slice_5.png top) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mb-10">
          <span className="font-script text-slate-700 text-xl sm:text-2xl tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00D5FD]" />
            Designed For You
            <Sparkles className="w-4 h-4 text-[#00D5FD]" />
          </span>
          <img
            src="/images/curlyline.svg"
            alt=""
            className="w-28 sm:w-36 h-auto object-contain mt-1 mb-2"
          />
          <h2 className="font-bison font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-[2px]">
            Expert Care From <span className="text-[#00D5FD]">Top Hairfluencers</span>
          </h2>
          <p className="font-script text-slate-600 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Real Arab women celebrating their natural waves, buoyant curls, and crown-like coils with Parachute Advansed Hydra Curls.
          </p>
        </div>

        {/* 8-Photo Selfie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-20">
          {influencers.map((item, idx) => (
            <div
              key={idx}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-md group border border-slate-200/80 bg-slate-100"
            >
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                <span className="font-bison font-bold text-sm uppercase tracking-wider">{item.name}</span>
                <span className="text-xs text-cyan-300 font-sans">{item.handle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================= */}
        {/* 2. Hair Types Section (slice_5.png bottom & slice_6.png top) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Circular Stamp */}
          <div className="w-14 h-14 rounded-full bg-[#170b2c] border-2 border-[#00D5FD] shadow-lg flex items-center justify-center text-white font-bison font-black text-lg mb-3">
            HC
          </div>
          <p className="font-script text-slate-600 text-lg sm:text-xl">
            Custom Formulation
          </p>
          <h2 className="font-bison font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-[2px] mt-1">
            Perfect Companion For Arab <br className="hidden sm:block" />
            <span className="text-[#00D5FD]">Curly, Coily &amp; Wavy</span> Hair
          </h2>
        </div>

        {/* 3 Large Portrait Cards with Purple Backdrop matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {hairTypes.map((type) => {
            const isSelected = selectedType.type === type.type;
            const model = typeModels[type.type] || { image: type.image, script: "curls" };

            return (
              <div
                key={type.type}
                onClick={() => setSelectedType(type)}
                className={`relative rounded-[28px] overflow-hidden border transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-1.5 flex flex-col ${
                  isSelected
                    ? "border-[#00D5FD] ring-2 ring-[#00D5FD]"
                    : "border-slate-200"
                }`}
              >
                {/* Upper Half: Deep Purple Backdrop with Model Portrait & Cursive Tag */}
                <div
                  className="relative h-72 sm:h-80 w-full overflow-hidden flex flex-col justify-between p-6 text-white"
                  style={{
                    background: "linear-gradient(180deg, #2A1850 0%, #1f103d 60%, #130826 100%)",
                  }}
                >
                  {/* Top Header Badge */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3.5 py-1 rounded-full bg-[#00D5FD] text-slate-950 font-bison font-black text-xs uppercase tracking-[2px]">
                      {type.type}
                    </span>
                    <span className="text-xs uppercase font-bison font-bold tracking-[2px] text-cyan-200">
                      PARACHUTE ADVANSED
                    </span>
                  </div>

                  {/* Model Image */}
                  <div className="absolute inset-0 flex items-center justify-center pt-8">
                    <img
                      src={model.image}
                      alt={type.name}
                      className="w-full h-full object-cover object-top opacity-90 hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#130826] via-transparent to-transparent" />
                  </div>

                  {/* Cursive Type Name in White matching Figma (wavy, curly, coily) */}
                  <div className="relative z-10 flex justify-center w-full">
                    <span className="font-script text-3xl sm:text-4xl text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] capitalize">
                      {model.script}
                    </span>
                  </div>
                </div>

                {/* Lower Half: Characteristics & Routine on Crisp Light Background */}
                <div className="p-6 sm:p-7 bg-white flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bison font-bold text-lg sm:text-xl text-slate-900 uppercase tracking-wide mb-2">
                      {type.name}
                    </h3>
                    <p className="font-script text-slate-600 text-sm leading-relaxed mb-4">
                      {type.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100">
                      <span className="text-[11px] uppercase font-bison font-bold tracking-[2px] text-slate-400 block mb-2">
                        Key Characteristics
                      </span>
                      <ul className="space-y-2">
                        {type.characteristics.map((char, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs sm:text-sm font-script text-slate-700 leading-snug"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00D5FD] shrink-0 mt-1.5" />
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <a
                    href="#products-carousel"
                    className="mt-6 w-full py-2.5 px-4 rounded-full bg-[#00D5FD]/10 hover:bg-[#00D5FD] text-[#008ba5] hover:text-white font-bison font-bold text-xs uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 border border-[#00D5FD]/30 group/btn"
                  >
                    <span>Recommended Routine</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 3. 6-Card Colorful Blog Grid (slice_6.png bottom & slice_7.png top) */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mb-12">
          <p className="font-script text-slate-700 text-xl tracking-wider">
            Curl Education &amp; Rituals
          </p>
          <img
            src="/images/curlyline.svg"
            alt=""
            className="w-28 sm:w-36 h-auto object-contain mt-1 mb-2"
          />
          <h2 className="font-bison font-bold text-3xl sm:text-4xl md:text-5xl uppercase tracking-[2px] mt-1">
            Your Curly Hair <span className="text-[#00D5FD]">Journey Starts Here</span>
          </h2>
        </div>

        {/* 6 Colorful Cards Matching Figma Layout (2 columns x 3 rows or 3 columns x 2 rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Turquoise Photo Card */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[340px] bg-[#14b8a6] flex items-center justify-center group shadow-lg">
            <img
              src="/images/Mena1.webp"
              alt="Curly Hair Ritual"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 font-bison font-black text-xl text-white tracking-widest uppercase">
              CURL CONFIDENCE
            </span>
          </div>

          {/* Card 2: Indigo Text Guide Card */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[340px] bg-[#3730a3] p-8 sm:p-12 flex flex-col justify-between text-white shadow-lg">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bison font-bold uppercase tracking-[2px] bg-white/15 text-cyan-200 mb-4">
                BEGINNER'S GUIDE
              </span>
              <h3 className="font-bison font-extrabold text-2xl sm:text-3xl uppercase tracking-wide leading-tight mb-3">
                The Curly Girl Method for Arab Hair
              </h3>
              <p className="font-script text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
                Tailored for GCC heat and humidity. Learn how to cleanse, hydrate, and seal your curls without silicones or harsh sulfates.
              </p>
            </div>
            <a
              href="#products-carousel"
              className="inline-flex items-center gap-2 font-bison font-bold text-sm uppercase tracking-[2px] text-cyan-300 hover:text-white transition-colors"
            >
              <span>Explore Guide</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 3: Purple Text Guide Card */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[340px] bg-[#6b21a8] p-8 sm:p-12 flex flex-col justify-between text-white shadow-lg">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bison font-bold uppercase tracking-[2px] bg-white/15 text-cyan-200 mb-4">
                STARTER KIT
              </span>
              <h3 className="font-bison font-extrabold text-2xl sm:text-3xl uppercase tracking-wide leading-tight mb-3">
                How (and How Much) to Use All 5 Products
              </h3>
              <p className="font-script text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
                Master your 5-step ritual with exact dosing recommendations for wavy, curly, and coily textures.
              </p>
            </div>
            <a
              href="#products-carousel"
              className="inline-flex items-center gap-2 font-bison font-bold text-sm uppercase tracking-[2px] text-cyan-300 hover:text-white transition-colors"
            >
              <span>Explore Guide</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Card 4: Light Pink Photo Card */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[340px] bg-[#f472b6] flex items-center justify-center group shadow-lg">
            <img
              src="/images/Mena2.webp"
              alt="Hydrated Curls"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 font-bison font-black text-xl text-white tracking-widest uppercase">
              NATURAL TEXTURE
            </span>
          </div>

          {/* Card 5: Amber Photo Card */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[340px] bg-[#f59e0b] flex items-center justify-center group shadow-lg">
            <img
              src="/images/Mena3.webp"
              alt="Curl Styling"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 font-bison font-black text-xl text-white tracking-widest uppercase">
              ARAB CURL CARE
            </span>
          </div>

          {/* Card 6: Teal Text Guide Card */}
          <div className="relative rounded-[28px] overflow-hidden min-h-[340px] bg-[#0f766e] p-8 sm:p-12 flex flex-col justify-between text-white shadow-lg">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bison font-bold uppercase tracking-[2px] bg-white/15 text-cyan-200 mb-4">
                DRYING MATRIX
              </span>
              <h3 className="font-bison font-extrabold text-2xl sm:text-3xl uppercase tracking-wide leading-tight mb-3">
                Diffuse, Plop or Air-Dry in the GCC?
              </h3>
              <p className="font-script text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
                Beat humidity with proven drying techniques tailored to high-heat climates for defined, frizz-free curls.
              </p>
            </div>
            <a
              href="#products-carousel"
              className="inline-flex items-center gap-2 font-bison font-bold text-sm uppercase tracking-[2px] text-cyan-300 hover:text-white transition-colors"
            >
              <span>Explore Guide</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
