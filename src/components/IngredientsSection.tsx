import React from "react";
import { ingredients, safetyCertifications } from "../data/ingredients";

export const IngredientsSection: React.FC = () => {
  return (
    <section id="ingredients-section" className="relative w-full py-20 sm:py-28 bg-[#F3FDFF]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-20">
          <span className="font-script text-slate-800 text-2xl sm:text-3xl tracking-widest">
            Unique Formulation
          </span>
          <img
            src="/images/curlyline.svg"
            alt=""
            className="w-36 sm:w-48 h-auto object-contain mt-1 mb-4"
          />
          <h2 className="font-bison font-extrabold text-3xl sm:text-5xl md:text-6xl uppercase tracking-[2px] text-slate-950 leading-tight">
            Powered by <span className="text-[#00D5FD]">Nature's</span> Most Potent Ingredients
          </h2>
          <p className="font-script text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mt-3 leading-relaxed">
            Our formulations combine scientifically-proven active ingredients with natural extracts for superior curly hair care.
          </p>
        </div>

        {/* 3 Symmetrical Equal-Height Ingredient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {ingredients.map((item) => (
            <div
              key={item.id}
              className="relative rounded-3xl overflow-hidden border border-[#E2F4F7] bg-gradient-to-b from-[#FFFFFF] to-[#F0FAFC] shadow-lg hover:shadow-2xl transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between group hover:-translate-y-2"
            >
              {/* Top Accent Icon Circle Frame */}
              <div>
                <div className="w-24 h-24 rounded-full bg-cyan-100/60 border-2 border-cyan-200 flex items-center justify-center p-4 mb-6 shadow-sm group-hover:scale-105 transition-transform">
                  <img
                    src={item.gif}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="font-bison font-extrabold text-2xl sm:text-3xl uppercase tracking-wider text-slate-950 mb-3">
                  {item.name}
                </h3>
                <p className="font-script text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Benefits Checklist with Proper Spacing */}
              <div className="pt-5 border-t border-cyan-100">
                <span className="text-xs uppercase font-bison font-bold tracking-[2px] text-slate-400 block mb-4">
                  {item.subtitle}
                </span>
                <ul className="space-y-3.5">
                  {item.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-3 font-script text-slate-800 text-base sm:text-lg"
                    >
                      <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                        <img
                          src="/icons/charm_circle-tick.svg"
                          alt="Checkmark"
                          className="w-4 h-4 object-contain"
                        />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Free-From Trust Badges Horizontal Ribbon */}
        <div className="mt-14 rounded-2xl border border-cyan-100 bg-white/80 backdrop-blur-md px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4 sm:gap-6">
            {safetyCertifications.map((cert) => (
              <span
                key={cert}
                className="flex items-center gap-2.5 font-bison font-bold text-slate-800 text-sm sm:text-base uppercase tracking-wider"
              >
                <img
                  src="/icons/greencirclecheck.svg"
                  alt="Verified"
                  className="w-5 h-5 object-contain"
                />
                <span>{cert}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
