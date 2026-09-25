export interface Product {
  id: string;
  name: string;
  tagline: string;
  volume: string;
  price: string;
  image: string;
  thumbImage: string;
  description: string;
  step: string;
  benefits: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  quote: string;
}

export interface Ingredient {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  gif: string;
  videoUrl?: string;
  features: string[];
}

export interface HairGuide {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  bgSvg: string;
  align: 'left' | 'right';
  slug: string;
}

export interface HairType {
  type: string;
  name: string;
  description: string;
  characteristics: string[];
  image: string;
}
