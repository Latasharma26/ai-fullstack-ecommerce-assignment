import React, { useState } from "react";
import { products } from "../data/products";
import { Product } from "../types";
import { Eye } from "lucide-react";

interface ProductCarouselSectionProps {
  onSelectProduct: (product: Product) => void;
}

export const ProductCarouselSection: React.FC<ProductCarouselSectionProps> = ({
  onSelectProduct,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevProduct = () => {
    setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const nextProduct = () => {
    setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const activeProduct = products[activeIndex];
  const prevIndex = activeIndex === 0 ? products.length - 1 : activeIndex - 1;
  const nextIndex = activeIndex === products.length - 1 ? 0 : activeIndex + 1;

  return (
    <section id="products-carousel" className="relative w-full overflow-hidden select-none py-12 bg-[#F3FDFF]">
      {/* Decorative Cloud */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 relative z-10 -mb-6 md:-mb-14">
        <div className="w-52 sm:w-72 md:w-96 h-auto pointer-events-none opacity-90">
          <img
            src="/images/cloudsimage.webp"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Layered Purple Bowl / Curved Architectural Stage */}
      <div className="relative w-full overflow-visible">
        <div
          className="bowl-shape relative overflow-visible w-[140%] -ml-[20%] md:w-[108%] md:-ml-[4%] pt-20 sm:pt-28 pb-16 sm:pb-24 shadow-2xl"
          style={{
            background: "#D5CBD9",
            boxShadow: "0 28px 80px rgba(118, 70, 138, 0.28)",
          }}
        >
          {/* Top Decorative Cyan Wave on the Bowl */}
          <div className="absolute top-0 left-0 w-full overflow-hidden -mt-10 sm:-mt-16 z-10 pointer-events-none">
            <svg
              viewBox="0 0 1920 180"
              preserveAspectRatio="none"
              className="w-full h-16 sm:h-24 md:h-28"
            >
              <defs>
                <path
                  id="bowlWavePath"
                  d="M0 45 C303 100 503 115 806 100 C965 90 1268 40 1410 42 C1495 45 1638 75 1750 82 C1830 87 1920 65 1920 65"
                />
              </defs>
              <path
                d="M0 0C0 0 303 70 502 75C806 83 964 -12 1268 2.5C1410 9 1495 32 1638 42C1750 49 1920 24 1920 24V115C1920 115 1776 124 1663 118C1521 110 1410 86 1268 83C964 76 806 173 502 169C304 166 0 101 0 101V0Z"
                fill="#00D5FD"
              />
            </svg>
          </div>

          {/* Inner Layer 1 (Muted Lavender) */}
          <div
            className="absolute top-0 bottom-5 left-[0.8%] right-[0.8%] z-0 bowl-shape"
            style={{ background: "#B199BA" }}
          />

          {/* Inner Layer 2 (Deep Violet Purple) */}
          <div
            className="absolute top-0 bottom-9 left-[1.6%] right-[1.6%] z-[1] bowl-shape"
            style={{ background: "#76468A" }}
          />

          {/* Stage Center Content */}
          <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center pt-8">
            {/* Step Routine Pill Badge */}
            <div className="mb-4">
              <span className="bg-[#00D5FD] text-slate-950 font-bison font-extrabold text-xs sm:text-sm uppercase tracking-[2.5px] px-5 py-1.5 rounded-full shadow-lg">
                {activeProduct.step}
              </span>
            </div>

            {/* 3D Pill Carousel View */}
            <div className="relative flex items-center justify-center w-full max-w-[900px] h-[320px] sm:h-[420px] md:h-[480px]">
              {/* Ghost Left Item */}
              <button
                onClick={prevProduct}
                className="hidden sm:block absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-[2] cursor-pointer transition-all duration-300 opacity-60 hover:opacity-90 transform hover:scale-105"
                style={{
                  width: "clamp(90px, 12vw, 170px)",
                  height: "clamp(130px, 18vw, 250px)",
                }}
                aria-label={`View ${products[prevIndex].name}`}
              >
                <div className="relative w-full h-full rounded-[140px] border-2 border-white/60 bg-[#9BEDFE]/85 overflow-hidden p-3 shadow-xl">
                  <img
                    src={products[prevIndex].image}
                    alt={products[prevIndex].name}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
              </button>

              {/* Center Active Product Pill */}
              <div
                onClick={() => onSelectProduct(activeProduct)}
                className="relative z-[4] transition-all duration-500 ease-out cursor-pointer group"
                style={{
                  width: "clamp(190px, 25vw, 340px)",
                  height: "clamp(250px, 33vw, 440px)",
                }}
              >
                {/* Outer Pill with Glow & Border */}
                <div className="relative w-full h-full rounded-[180px] border-4 border-white/95 bg-[#9BEDFE] shadow-[0_20px_50px_rgba(0,213,253,0.5)] overflow-hidden flex flex-col items-center justify-center p-4">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="w-[90%] h-[90%] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* "Quick View" Floating Hover Pill */}
                  <div className="absolute inset-0 bg-[#2A1850]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[180px]">
                    <span className="bg-white text-slate-900 font-bison font-extrabold text-xs uppercase tracking-[1.5px] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      <Eye className="w-4 h-4 text-[#00D5FD]" />
                      QUICK VIEW
                    </span>
                  </div>
                </div>
              </div>

              {/* Ghost Right Item */}
              <button
                onClick={nextProduct}
                className="hidden sm:block absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-[2] cursor-pointer transition-all duration-300 opacity-60 hover:opacity-90 transform hover:scale-105"
                style={{
                  width: "clamp(90px, 12vw, 170px)",
                  height: "clamp(130px, 18vw, 250px)",
                }}
                aria-label={`View ${products[nextIndex].name}`}
              >
                <div className="relative w-full h-full rounded-[140px] border-2 border-white/60 bg-[#9BEDFE]/85 overflow-hidden p-3 shadow-xl">
                  <img
                    src={products[nextIndex].image}
                    alt={products[nextIndex].name}
                    className="w-full h-full object-contain filter drop-shadow"
                  />
                </div>
              </button>
            </div>

            {/* Desktop / Mobile Carousel Arrows */}
            <div className="flex items-center justify-between w-full max-w-[440px] sm:max-w-[620px] -mt-10 sm:-mt-14 relative z-10 px-4">
              <button
                onClick={prevProduct}
                className="bg-white/25 hover:bg-white/45 active:scale-95 transition-all p-2 rounded-full backdrop-blur-md cursor-pointer text-white border border-white/40 shadow-lg"
                aria-label="Previous Product"
              >
                <img
                  src="/icons/lightleftarrow.svg"
                  alt="Previous"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </button>

              <button
                onClick={nextProduct}
                className="bg-white/25 hover:bg-white/45 active:scale-95 transition-all p-2 rounded-full backdrop-blur-md cursor-pointer text-white border border-white/40 shadow-lg"
                aria-label="Next Product"
              >
                <img
                  src="/icons/darkrightarrow.svg"
                  alt="Next"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
              </button>
            </div>

            {/* Product Title & Details */}
            <div className="flex flex-col items-center text-center mt-6">
              <h3 className="text-white font-bison font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-[2px] uppercase drop-shadow mt-1">
                {activeProduct.name}
              </h3>
              <p className="text-slate-100 font-script text-lg sm:text-xl max-w-lg mt-1 px-4 leading-relaxed">
                {activeProduct.tagline}
              </p>

              {/* Price & Specs Layout matching Figma card hierarchy */}
              <div className="flex items-center justify-center gap-4 mt-5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-extrabold font-bison text-[#00D5FD] tracking-wider drop-shadow-sm">
                    {activeProduct.price}
                  </span>
                  <span className="text-white/75 font-bison text-sm sm:text-base tracking-wider uppercase">
                    ({activeProduct.volume})
                  </span>
                </div>
                <button
                  onClick={() => onSelectProduct(activeProduct)}
                  className="inline-flex items-center gap-1.5 bg-[#00D5FD] hover:bg-[#02c2e9] text-slate-950 font-bison font-black text-xs uppercase tracking-[2px] rounded-full px-6 py-2.5 shadow-[0_0_20px_rgba(0,213,253,0.5)] hover:scale-105 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-950" />
                  <span>VIEW SPECS</span>
                </button>
              </div>
            </div>

            {/* Routine 5-Step Carousel Thumbnails with Glowing Active Outline Stroke & Transitions */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mt-8 pb-4">
              {products.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`group/thumb flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 relative ${
                      isActive ? "scale-105" : "opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`Select ${item.name}`}
                  >
                    <div
                      className={`rounded-full p-1 transition-all duration-300 ${
                        isActive
                          ? "w-14 h-14 sm:w-16 sm:h-16 ring-4 ring-[#00D5FD] shadow-[0_0_22px_rgba(0,213,253,0.9)] bg-white"
                          : "w-11 h-11 sm:w-12 sm:h-12 border-2 border-white/50 bg-white/20 hover:border-white"
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        <img
                          src={item.thumbImage}
                          alt={item.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover/thumb:scale-110"
                        />
                      </div>
                    </div>
                    <span
                      className={`text-[9px] sm:text-[11px] font-bison font-bold uppercase tracking-wider transition-colors ${
                        isActive ? "text-[#00D5FD]" : "text-white/60"
                      }`}
                    >
                      {item.step.split(" - ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Curved Tagline Below */}
      <div className="w-full flex justify-center items-center -mt-6 sm:-mt-10 pb-6 px-4">
        <svg
          viewBox="0 40 1200 200"
          className="w-full max-w-4xl h-24 sm:h-32 md:h-40 overflow-visible"
        >
          <defs>
            <path id="taglineCurve" d="M20,55 C350,320 850,320 1180,55" />
          </defs>
          <text
            fill="#73797A"
            letterSpacing="2.5"
            opacity="0.95"
            className="font-script text-[32px] sm:text-[40px] md:text-[48px]"
            dominantBaseline="middle"
          >
            <textPath href="#taglineCurve" startOffset="50%" textAnchor="middle">
              Experience the power of hydration in every drop.
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
};
