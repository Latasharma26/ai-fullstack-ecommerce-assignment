import { Product } from '../types';

export const products: Product[] = [
  {
    id: "1",
    name: "Hydrating Shampoo",
    tagline: "Gently Cleanses Without Stripping Natural Moisture",
    volume: "250 ml",
    price: "₹499",
    image: "/images/NewShampoo.webp",
    thumbImage: "/images/thumbs/NewShampoo.webp",
    description: "Formulated specifically for curly, coily, and wavy hair, this sulfate-free shampoo gently removes buildup while infusing moisture with Hyaluronic Acid and Coconut extract.",
    step: "Step 01 - Cleanse",
    benefits: ["Gentle Cleansing", "No Sulfate Stripping", "Deep Hydration", "Safe for Color-Treated Hair"]
  },
  {
    id: "2",
    name: "Hydrating Conditioner",
    tagline: "Ultra-Nourishing Slip & Effortless Detangling",
    volume: "250 ml",
    price: "₹549",
    image: "/images/NewConditioner.webp",
    thumbImage: "/images/thumbs/NewConditioner.webp",
    description: "Rich with Avocado and Coconut oils, it provides maximum slip for quick detangling, restores elasticity, and softens every curl pattern.",
    step: "Step 02 - Condition",
    benefits: ["Instant Slip", "Knot & Tangle Defense", "Cuticle Sealing", "Prevents Breakage"]
  },
  {
    id: "3",
    name: "Defining Cream",
    tagline: "Defines Curl Pattern with Touchably Soft Hold",
    volume: "200 ml",
    price: "₹599",
    image: "/images/NewCream.webp",
    thumbImage: "/images/thumbs/NewCream.webp",
    description: "Locks in essential hydration while providing lightweight bounce, clump formation, and 48-hour frizz control for Arab and Mediterranean hair textures.",
    step: "Step 03 - Define",
    benefits: ["Curl Clump Definition", "Zero Crunch", "Long-Lasting Bounce", "Heat Protection"]
  },
  {
    id: "4",
    name: "Defining Gel",
    tagline: "Strong Yet Flexible Cast for 48H Hold",
    volume: "200 ml",
    price: "₹599",
    image: "/images/NewGel.webp",
    thumbImage: "/images/thumbs/NewGel.webp",
    description: "Forms a weightless protective cast around curls that locks out humidity and holds definition for up to 48 hours without flaking or drying.",
    step: "Step 04 - Lock",
    benefits: ["Humidity Shield", "Zero Flakes", "48H Curl Retention", "Easy Scrunch-Out Cast"]
  },
  {
    id: "5",
    name: "Hydrating Mask",
    tagline: "Intensive Deep Conditioning Treatment",
    volume: "200 ml",
    price: "₹699",
    image: "/images/NewMask.webp",
    thumbImage: "/images/thumbs/NewMask.webp",
    description: "An intensive weekly moisture rescue mask that revives heat-damaged, thirsty curls with a concentrated boost of Hyaluronic Acid and natural plant butters.",
    step: "Step 05 - Deep Nourish",
    benefits: ["Weekly Moisture Recovery", "Intense Softness", "Damage Repair", "Elasticity Boost"]
  }
];
