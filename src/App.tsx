import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { WaveRibbon } from "./components/WaveRibbon";
import { LaunchSection } from "./components/LaunchSection";
import { RitualSection } from "./components/RitualSection";
import { ProductCarouselSection } from "./components/ProductCarouselSection";
import { ClinicalSection } from "./components/ClinicalSection";
import { IngredientsSection } from "./components/IngredientsSection";
import { CommunitySliderSection } from "./components/CommunitySliderSection";
import { HairfluencersSection } from "./components/HairfluencersSection";
import { RevolutionCTASection } from "./components/RevolutionCTASection";
import { Footer } from "./components/Footer";
import { ProductModal } from "./components/ProductModal";
import { products } from "./data/products";
import { Product } from "./types";

export function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenProductById = (id: string = "1") => {
    const found = products.find((p) => p.id === id) || products[0];
    setSelectedProduct(found);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-[#F3FDFF] text-slate-800 overflow-x-hidden selection:bg-[#00D5FD] selection:text-slate-950">
      {/* 1,920px Base Canvas Container locked to Figma dimensions */}
      <div className="w-full max-w-[1920px] mx-auto flex flex-col min-h-screen relative shadow-[0_0_60px_rgba(0,0,0,0.06)] bg-[#F3FDFF]">
        {/* Navigation */}
        <Navbar onOpenProductModal={() => handleOpenProductById("1")} />

        {/* Main Sections matching Figma Design */}
        <main className="flex-1 w-full">
          {/* 1. Hero Section */}
          <HeroSection />

          {/* 2. Cyan Wave Ribbon with Flowing Text */}
          <WaveRibbon />

          {/* 3. Launch Section (Ice Cyan / White #F3FDFF) */}
          <LaunchSection
            onExploreProducts={() => scrollToSection("products-carousel")}
            onLearnMethod={() => scrollToSection("experts-section")}
          />

          {/* 4. Ritual / 2-Panel Content */}
          <RitualSection
            onLearnMoreLeft={() => scrollToSection("clinical-section")}
            onLearnMoreRight={() => scrollToSection("products-carousel")}
          />

          {/* 5. Essential Products / Purple Bowl 3D Carousel */}
          <ProductCarouselSection
            onSelectProduct={(product) => setSelectedProduct(product)}
          />

          {/* 6. Clinical Results & 48H Proof (Ice Cyan / White #F3FDFF) */}
          <ClinicalSection />

          {/* 7. Ingredients & Safety Guarantee (Ice Cyan / White #F3FDFF) */}
          <IngredientsSection />

          {/* 8. Community Before/After Slider & Testimonials */}
          <CommunitySliderSection />

          {/* 9. Hairfluencers & Arab Hair Journey (Ice Cyan / White #F3FDFF) */}
          <HairfluencersSection />

          {/* 10. Curly Hair Revolution CTA Banner */}
          <RevolutionCTASection
            onExploreProducts={() => scrollToSection("products-carousel")}
            onLearnMethod={() => scrollToSection("experts-section")}
          />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Interactive Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default App;
