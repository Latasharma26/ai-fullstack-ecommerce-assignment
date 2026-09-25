import React, { useState, useRef, useCallback } from "react";
import { testimonials } from "../data/testimonials";
import { Star } from "lucide-react";

export const CommunitySliderSection: React.FC = () => {
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = () => {
    isDragging.current = true;
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const prevReview = () => {
    setActiveReviewIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const nextReview = () => {
    setActiveReviewIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const currentReview = testimonials[activeReviewIndex];

  return (
    <section
      id="curly-wave-slider-section"
      className="relative w-full overflow-hidden py-20 sm:py-28 bg-[#180e2b] text-white"
    >
      {/* Background Graphic */}
      <img
        src="/images/background.jpeg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top opacity-35 pointer-events-none select-none z-0"
      />

      {/* Decorative Vectors */}
      <img
        src="/images/communityvector1.svg"
        alt=""
        className="absolute top-[8%] left-[5%] w-16 md:w-24 opacity-30 pointer-events-none z-10"
      />
      <img
        src="/images/communityvector2.svg"
        alt=""
        className="absolute top-[15%] left-[20%] w-14 md:w-20 opacity-25 pointer-events-none z-10"
      />
      <img
        src="/images/communityvector4.svg"
        alt=""
        className="absolute top-[5%] right-[10%] w-16 md:w-24 opacity-25 pointer-events-none z-10"
      />
      <img
        src="/images/communityvector5.svg"
        alt=""
        className="absolute bottom-[10%] right-[5%] w-12 md:w-16 opacity-30 pointer-events-none z-10"
      />

      {/* Spinning Circular Badge Stamp */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-10 pointer-events-none select-none opacity-80">
        <svg
          viewBox="0 0 240 240"
          className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 animate-spin-slow overflow-visible"
        >
          <defs>
            <path
              id="reviewCirclePath"
              d="M 120,120 m -90,0 a 90,90 0 1,1 180,0 a 90,90 0 1,1 -180,0"
              fill="none"
            />
          </defs>
          <text className="fill-white tracking-[0.38em] text-[15px] font-bold uppercase">
            <textPath href="#reviewCirclePath" startOffset="0" spacing="auto">
              Hydra Curls &nbsp; Real Results &nbsp; 48H Hydration &nbsp;
            </textPath>
          </text>
        </svg>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-20">
        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-14 md:mb-20">
          <p className="font-script text-cyan-200 text-2xl sm:text-3xl tracking-widest mb-1">
            Real Women, Real Results
          </p>
          <img
            src="/images/whiteline.svg"
            alt=""
            className="w-40 sm:w-56 h-auto mb-4"
          />
          <h2 className="font-bison font-extrabold text-4xl sm:text-6xl md:text-7xl uppercase tracking-[2px]">
            Hear from Our <span className="text-[#00D5FD]">Community</span>
          </h2>
        </div>

        {/* 2-Column Balanced Split: Before/After Slider + Review Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Interactive Before/After Split View (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Split Comparison Interactive Container */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerMove={handlePointerMove}
              onPointerLeave={handlePointerUp}
              className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize border border-white/20 touch-none group"
            >
              {/* After Image (Full Background) */}
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="/images/newafter.webp"
                  alt="After using Hydra Curls"
                  className="w-full h-full object-cover object-center pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Before Image (Clipped to Slider Percentage) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src="/images/newbefore.webp"
                  alt="Before using Hydra Curls"
                  className="w-full h-full object-cover object-center pointer-events-none filter brightness-90 contrast-95"
                  draggable={false}
                />
              </div>

              {/* Floating Glassmorphism Labels */}
              <div className="absolute top-5 left-5 z-20 pointer-events-none">
                <span className="glass-pill px-4 py-1.5 rounded-full text-xs font-bison font-bold tracking-[2px] uppercase text-white shadow-md">
                  BEFORE HYDRA CURLS
                </span>
              </div>

              <div className="absolute top-5 right-5 z-20 pointer-events-none">
                <span className="px-4 py-1.5 rounded-full text-xs font-bison font-bold tracking-[2px] uppercase text-slate-950 bg-[#00D5FD] shadow-[0_0_15px_rgba(0,213,253,0.7)]">
                  AFTER 48H DEFINITION
                </span>
              </div>

              {/* Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_14px_rgba(0,213,253,0.9)] z-10 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              />

              {/* Custom Round Draggable Glass Knob matching Figma */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-md shadow-[0_0_25px_rgba(0,213,253,0.7)] flex items-center justify-center z-20 cursor-grab active:cursor-grabbing border-2 border-[#00D5FD] hover:scale-110 transition-transform select-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="flex items-center justify-center gap-1 text-[#009bb8]">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                  </svg>
                  <div className="w-[1.5px] h-4 bg-[#00D5FD]/60 rounded-full" />
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-bison tracking-[2px] uppercase text-white/60 mt-3">
              DRAG SLIDER TO REVEAL 48-HOUR HYDRATION TRANSFORMATION
            </p>
          </div>

          {/* Right Column: Testimonial Card & Navigator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative">
              {/* Card Container with Quotation Mark Watermark */}
              <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[360px] p-8 sm:p-10 flex flex-col justify-between shadow-2xl border border-white/15 bg-gradient-to-br from-white/15 via-white/10 to-transparent backdrop-blur-xl">
                {/* Decorative Quotation Mark Watermark */}
                <span className="absolute top-4 right-6 text-8xl font-serif text-white/10 select-none pointer-events-none leading-none">
                  “
                </span>

                {/* 5 Stars */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    {Array.from({ length: currentReview.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>

                  {/* Review Quote */}
                  <p className="font-script text-white text-xl sm:text-2xl leading-relaxed mb-6">
                    "{currentReview.quote}"
                  </p>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4 pt-5 border-t border-white/15">
                  <img
                    src={currentReview.avatar}
                    alt={currentReview.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#00D5FD] shadow-lg"
                  />
                  <div>
                    <h4 className="font-bison font-extrabold text-xl text-white uppercase tracking-wider">
                      {currentReview.name}
                    </h4>
                    <p className="text-sm font-script text-cyan-200">
                      {currentReview.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vertical Navigation & Dynamic Monospaced Counter */}
              <div className="flex items-center justify-between sm:justify-start gap-5 mt-6">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={prevReview}
                    className="w-12 h-12 rounded-full bg-white text-slate-900 hover:bg-[#00D5FD] hover:text-slate-950 transition-all shadow-xl flex items-center justify-center cursor-pointer active:scale-95"
                    aria-label="Previous Review"
                  >
                    <img
                      src="/icons/uparrow.svg"
                      alt="Previous"
                      className="w-5 h-5 object-contain"
                    />
                  </button>
                  <button
                    onClick={nextReview}
                    className="w-12 h-12 rounded-full bg-white text-slate-900 hover:bg-[#00D5FD] hover:text-slate-950 transition-all shadow-xl flex items-center justify-center cursor-pointer active:scale-95"
                    aria-label="Next Review"
                  >
                    <img
                      src="/icons/downarrow.svg"
                      alt="Next"
                      className="w-5 h-5 object-contain"
                    />
                  </button>
                </div>

                {/* Monospaced Dynamic Counter */}
                <div className="text-base font-mono font-bold tracking-[3px] text-white/70">
                  <span className="text-[#00D5FD] text-xl font-bison">
                    0{activeReviewIndex + 1}
                  </span>{" "}
                  / 0{testimonials.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
