import React, { useState, useEffect } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onOpenProductModal?: (productId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenProductModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section tracking for active indicator
      const sections = [
        { id: "home", el: document.getElementById("home") },
        { id: "products-carousel", el: document.getElementById("products-carousel") },
        { id: "clinical-section", el: document.getElementById("clinical-section") },
        { id: "ingredients-section", el: document.getElementById("ingredients-section") },
        { id: "community-section", el: document.getElementById("community-section") },
        { id: "experts-section", el: document.getElementById("experts-section") },
      ];

      const scrollPos = window.scrollY + 180;
      for (let i = sections.length - 1; i >= 0; i--) {
        const item = sections[i];
        if (item.el && item.el.offsetTop <= scrollPos) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "#home", id: "home" },
    { name: "PRODUCTS", href: "#products-carousel", id: "products-carousel" },
    { name: "CLINICAL RESULTS", href: "#clinical-section", id: "clinical-section" },
    { name: "INGREDIENTS", href: "#ingredients-section", id: "ingredients-section" },
    { name: "COMMUNITY", href: "#community-section", id: "community-section" },
    { name: "HAIR TYPES", href: "#experts-section", id: "experts-section" },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 w-full z-50 transition-all duration-200 bg-[#170b2c] ${
        scrolled
          ? "border-b border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2.5"
          : "border-b border-white/10 py-3.5"
      }`}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        {/* Single Unified Brand Logo (No duplicate logo/text) */}
        <a href="#home" className="flex items-center select-none group">
          <img
            src="/images/hydra-curls-logo.webp"
            alt="Parachute Advansed Hydra Curls"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </a>

        {/* Center: Desktop Navigation Links (Always visible on Desktop/Laptop >= 768px) */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className="relative py-1.5 text-xs lg:text-sm font-bison font-bold uppercase tracking-[1.5px] transition-colors text-white/80 hover:text-[#00D5FD] group"
              >
                <span className={isActive ? "text-[#00D5FD]" : ""}>
                  {link.name}
                </span>
                {/* Active Cyan Dot Indicator */}
                {isActive ? (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00D5FD] shadow-[0_0_8px_#00D5FD]" />
                ) : (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#00D5FD] transition-all group-hover:w-full group-hover:left-0 group-hover:translate-x-0" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Pill CTA Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <Button
            size="default"
            onClick={() => onOpenProductModal && onOpenProductModal("1")}
            className="inline-flex items-center justify-center gap-1.5 bg-[#00D5FD] hover:bg-[#02c3ea] text-slate-950 font-bison font-black uppercase tracking-[1.5px] rounded-full px-5 sm:px-6 py-2 h-9 sm:h-10 text-xs sm:text-sm shadow-[0_0_15px_rgba(0,213,253,0.4)] hover:shadow-[0_0_25px_rgba(0,213,253,0.7)] hover:scale-105 transition-all"
          >
            {/* Centered 4-Point Star Sparkle Vector */}
            <svg
              className="w-3.5 h-3.5 fill-current text-slate-950 shrink-0"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span className="leading-none pt-0.5">SHOP ROUTINE</span>
          </Button>

          {/* Mobile Menu Button (<768px only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-white/90 hover:text-[#00D5FD] rounded-lg focus:outline-none transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Only on small screens <768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#170b2c] border-b border-white/20 px-6 py-6 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bison font-bold uppercase tracking-[2px] text-white/90 hover:text-[#00D5FD] py-2 flex items-center justify-between border-b border-white/5"
              >
                <span>{link.name}</span>
                {activeSection === link.id && (
                  <span className="w-2 h-2 rounded-full bg-[#00D5FD]" />
                )}
              </a>
            ))}
            <div className="pt-4">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenProductModal) onOpenProductModal("1");
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#00D5FD] text-slate-950 font-bison font-black tracking-[2px] rounded-full py-3"
              >
                <ShoppingBag className="w-4 h-4 text-slate-950" />
                <span>EXPLORE 5-STEP ROUTINE</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
