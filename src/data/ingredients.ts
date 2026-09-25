import { Ingredient } from '../types';

export const ingredients: Ingredient[] = [
  {
    id: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    subtitle: "Premium Ingredients",
    description: "A proven moisture magnet that holds 1000x its weight in water for empowering, long-lasting hydration and bounce.",
    gif: "/animation/Acid.gif",
    features: ["Deep Hydration", "Moisture Lock", "Plump Curls"]
  },
  {
    id: "coconut-extract",
    name: "Coconut Extract",
    subtitle: "Premium Ingredients",
    description: "A trusted essential that penetrates deep into the shaft to provide nourishing repair and prevent protein loss.",
    gif: "/animation/Nature.gif",
    features: ["Hair Strength", "Natural Shine", "Frizz Control"]
  },
  {
    id: "avocado-extract",
    name: "Avocado Extract",
    subtitle: "Premium Ingredients",
    description: "Rich in natural fats and biotin to provide a gentle shield against breakage while boosting authentic shine.",
    gif: "/animation/Avocado.gif",
    features: ["Curl Definition", "Softness", "Nutrient Rich"]
  }
];

export const safetyCertifications = [
  "No SLS",
  "No Silicones",
  "No Parabens",
  "No Sulphates",
  "No Phthalates",
  "Dermatologically Tested"
];
