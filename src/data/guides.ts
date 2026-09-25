import { HairGuide, HairType } from '../types';

export const hairTypes: HairType[] = [
  {
    type: "Type 2",
    name: "Wavy Hair (2A, 2B, 2C)",
    description: "A flexible texture characterized by an 'S' shape wave pattern that sits gracefully between straight and curly.",
    characteristics: [
      "Loose, defined 'S' wave formation",
      "Prone to midday frizz in GCC humidity",
      "Requires lightweight moisture that won't weigh strands down"
    ],
    image: "/images/wavy.svg"
  },
  {
    type: "Type 3",
    name: "Curly Hair (3A, 3B, 3C)",
    description: "Springy spiral curls with natural volume, ranging from buoyant loops to tight corkscrews.",
    characteristics: [
      "Spring-like spiral ringlets and corkscrews",
      "Higher porosity requiring moisture sealing",
      "Thrives with the CGM (Curly Girl Method) 5-step ritual"
    ],
    image: "/images/curly.svg"
  },
  {
    type: "Type 4",
    name: "Coily Hair (4A, 4B, 4C)",
    description: "Dense, beautifully compact 'Z' or mini-coils with unmatched architectural texture and crown-like presence.",
    characteristics: [
      "Tight zigzag 'Z' or delicate mini-coil patterns",
      "Fragile cuticle requiring ultra-rich emollients",
      "Needs 48-hour continuous hydration barrier"
    ],
    image: "/images/coily.svg"
  }
];

export const hairGuides: HairGuide[] = [
  {
    id: "guide-1",
    category: "Expert Guide",
    title: "THE CURLY GIRL METHOD FOR ARAB HAIR: A BEGINNER'S GUIDE",
    description: "Embrace your natural texture with a routine tailored for Arab hair. A simple, authentic guide to achieving frizz-free, defined curls.",
    image: "/images/Mena1.webp",
    bgSvg: "/images/firstbackground.svg",
    align: "right",
    slug: "curly-girl-method-arab-hair"
  },
  {
    id: "guide-2",
    category: "Expert Guide",
    title: "THE HYDRA CURLS CGM STARTER KIT: HOW (AND HOW MUCH) TO USE ALL 5 PRODUCTS",
    description: "Master your 5-step kit with proven application tips and the perfect product amounts. Your roadmap to hydrated, bouncy curls starts here.",
    image: "/images/Mena2.webp",
    bgSvg: "/images/secondbackground.svg",
    align: "left",
    slug: "cgm-starter-kit-guide"
  },
  {
    id: "guide-3",
    category: "Expert Guide",
    title: "DIFFUSE, PLOP OR AIR-DRY IN THE GCC? THE DRYING METHOD MATRIX",
    description: "Beat the GCC humidity with the best drying techniques for your curls. Find your trusted method for maximum volume and zero frizz.",
    image: "/images/Mena3.webp",
    bgSvg: "/images/thirdbackground.svg",
    align: "right",
    slug: "drying-method-matrix"
  }
];
