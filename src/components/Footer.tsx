import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer
      className="relative w-full overflow-hidden text-white"
      style={{
        background: "linear-gradient(to bottom, #1f103d 0%, #150926 40%, #0a0314 100%)",
      }}
    >
      {/* Top Floating Badge Icon */}
      <div className="pointer-events-none select-none absolute top-0 left-0 right-0 hidden md:flex justify-center -translate-y-1/2 z-20">
        <img
          src="/icons/footericon.svg"
          alt=""
          className="w-14 h-14 object-contain shadow-2xl"
        />
      </div>

      {/* Subtle Floating Curly Loops */}
      <span className="pointer-events-none select-none absolute top-8 left-8 opacity-15 scale-x-[-1]">
        <img
          src="/icons/twemoji_curly-loop.svg"
          alt=""
          className="w-10 h-10 object-contain"
        />
      </span>
      <span className="pointer-events-none select-none absolute top-8 right-8 opacity-20">
        <img
          src="/icons/twemoji_curly-loop.svg"
          alt=""
          className="w-10 h-10 object-contain"
        />
      </span>

      {/* Footer Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10 pt-20 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* ========================================================= */}
          {/* Col 1: Brand Info & Single Unified Logo                   */}
          {/* ========================================================= */}
          <div className="flex flex-col items-start">
            <a href="#home" className="mb-5 block">
              <img
                src="/images/hydra-curls-logo.webp"
                alt="Parachute Advansed Hydra Curls"
                className="h-11 sm:h-12 w-auto object-contain"
              />
            </a>

            <p className="text-white/90 text-sm font-semibold mb-2">
              Ready to transform your curl care routine?
            </p>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5">
              Switch to Parachute Advansed Hydra Curls and give your curls the pampering &amp; hydration that they deserve. With 48 hours of continuous hydration, experience your best curl days.
            </p>

            {/* Vertically Centered Bullet Dot with Baseline Alignment */}
            <div className="flex items-center gap-2 text-xs font-sans text-cyan-300">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D5FD] shrink-0" />
              <span>Dermatologically Certified • Cruelty Free</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* Col 2: Explore Links (Clean sans-serif, zero indent)       */}
          {/* ========================================================= */}
          <div>
            <h3 className="font-bison font-bold text-lg uppercase tracking-[2px] text-white mb-4">
              Explore
            </h3>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-white/75 p-0 m-0 list-none">
              <li>
                <a href="#" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Home
                </a>
              </li>
              <li>
                <a href="#products-carousel" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Products
                </a>
              </li>
              <li>
                <a href="#clinical-section" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Clinical Results
                </a>
              </li>
              <li>
                <a href="#ingredients-section" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Ingredients
                </a>
              </li>
              <li>
                <a href="#community-section" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Community Reviews
                </a>
              </li>
              <li>
                <a href="#experts-section" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Hair Types &amp; Guides
                </a>
              </li>
            </ul>
          </div>

          {/* ========================================================= */}
          {/* Col 3: Products Links (Clean sans-serif, zero indent)      */}
          {/* ========================================================= */}
          <div>
            <h3 className="font-bison font-bold text-lg uppercase tracking-[2px] text-white mb-4">
              Products
            </h3>
            <ul className="space-y-3 font-sans text-xs sm:text-sm text-white/75 p-0 m-0 list-none">
              <li>
                <a href="#products-carousel" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Hydrating Shampoo (250 ml)
                </a>
              </li>
              <li>
                <a href="#products-carousel" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Hydrating Conditioner (250 ml)
                </a>
              </li>
              <li>
                <a href="#products-carousel" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Defining Cream (200 ml)
                </a>
              </li>
              <li>
                <a href="#products-carousel" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Defining Gel (200 ml)
                </a>
              </li>
              <li>
                <a href="#products-carousel" className="hover:text-[#00D5FD] transition-colors inline-block">
                  Hydrating Mask (200 ml)
                </a>
              </li>
            </ul>
          </div>

          {/* ========================================================= */}
          {/* Col 4: Connect & Glass Social Cards                       */}
          {/* ========================================================= */}
          <div className="flex flex-col">
            <h3 className="font-bison font-bold text-lg uppercase tracking-[2px] text-white mb-4">
              Connect
            </h3>
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-5 font-sans">
              Follow us to stay updated about everything Hydra Curls related. From tips &amp; curl care routines to community activities, never miss anything.
            </p>

            {/* Social Media Rounded Glass Cards */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/hydra.curls/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 rounded-xl bg-white/[0.08] hover:bg-[#00D5FD] hover:text-slate-950 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 shadow-sm transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 rounded-xl bg-white/[0.08] hover:bg-[#00D5FD] hover:text-slate-950 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 shadow-sm transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-11 h-11 rounded-xl bg-white/[0.08] hover:bg-[#00D5FD] hover:text-slate-950 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 shadow-sm transition-all hover:scale-105"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-11 h-11 rounded-xl bg-white/[0.08] hover:bg-[#00D5FD] hover:text-slate-950 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white/90 shadow-sm transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Bottom Legal Links & Copyright (Clean Sans-Serif Font)   */}
        {/* ========================================================= */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-sans">
          <p>
            &copy; {new Date().getFullYear()} Parachute Advansed Hydra Curls. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6 text-white/60">
            <a href="#" className="hover:text-[#00D5FD] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#00D5FD] transition-colors">
              Terms &amp; Conditions
            </a>
            <a href="#" className="hover:text-[#00D5FD] transition-colors">
              Shipping &amp; Returns
            </a>
            <a href="#" className="hover:text-[#00D5FD] transition-colors">
              Cookie Preferences
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
