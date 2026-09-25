import React, { useState } from "react";
import { Product } from "../types";
import { X, Check, ShoppingBag, Heart } from "lucide-react";
import { Button } from "./ui/button";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
}) => {
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-cyan-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Showcase Display */}
          <div className="relative bg-gradient-to-b from-[#DAF6FF] to-[#F3FDFF] p-8 flex items-center justify-center min-h-[300px] md:min-h-[420px]">
            <div className="relative w-48 h-64 md:w-56 md:h-80 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bison font-bold tracking-wider text-[#2A1850] shadow-sm uppercase">
              {product.step}
            </span>
          </div>

          {/* Right: Details & Purchase */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bison tracking-[2px] uppercase text-[#00D5FD]">
                  Parachute Advansed
                </span>
                <button
                  onClick={() => setLiked(!liked)}
                  className="text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      liked ? "fill-rose-500 text-rose-500" : ""
                    }`}
                  />
                </button>
              </div>

              <h3 className="font-bison font-bold text-2xl md:text-3xl uppercase tracking-wider text-slate-900 leading-tight">
                {product.name}
              </h3>
              <p className="font-script text-slate-500 text-sm mt-1 mb-4">
                {product.tagline}
              </p>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-bison font-bold text-3xl text-slate-900">
                  {product.price}
                </span>
                <span className="text-sm text-slate-400">
                  / {product.volume}
                </span>
                <span className="ml-auto text-xs bg-emerald-50 text-emerald-600 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                  In Stock
                </span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Key Benefits */}
              <div className="space-y-2 mb-6">
                <span className="text-xs uppercase font-bison font-bold tracking-wider text-slate-400 block">
                  Formulation Highlights
                </span>
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <Button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 font-bison font-bold tracking-wider uppercase ${
                  added
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "bg-[#00D5FD] hover:bg-[#02D3FC] text-white"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {product.price}</span>
                  </>
                )}
              </Button>

              <p className="text-[11px] text-center text-slate-400">
                Free standard delivery on all GCC orders above AED 150
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
