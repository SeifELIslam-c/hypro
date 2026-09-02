import cheragaImg from "@/assets/cheraga-1.webp";
import blidaImg from "@/assets/blida-1.webp";
import hammaImg from "@/assets/hamma-1.webp";
import interiorImg from "@/assets/interior-1.webp";
import detailImg from "@/assets/detail-1.webp";
import heroImg from "@/assets/hero.webp";

export type MediaItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
};

export type SurfaceRow = { label: string; value: string };

export type UnitType = {
  code: string;
  name: string;
  tag: string;
  desc: string;
  poster: string;
  videoUrl?: string;
  surfaces?: SurfaceRow[];
  totals?: SurfaceRow[];
};

export type Block = {
  id: string;
  name: string;
  headline: string;
  desc: string;
  stats: { label: string; value: string }[];
  units: UnitType[];
};

export type Project = {
  slug: string;
  index: string;
  name: string;
  shortName: string;
  location: string;
  district?: string;
  completion?: number;
  description: string[];
  features: string[];
  blocks?: Block[];
  surfaces?: SurfaceRow[];
  totals?: SurfaceRow[];
  hero: string;
  media: MediaItem[];
  heroVideo?: string;
  videoUrl?: string;
  vrUrl?: string;
  mapQuery: string;
};

const CHERAGA_VIDEO = "https://res.cloudinary.com/nyuasexa/video/upload/v1786898836/cheraga.mp4";

const COMMON_DESCRIPTION = (city: string) => [
  "Découvrez une variété d'espaces de vie modernes à la Résidence HYPRO, proposant plusieurs configurations d'appartements de 2 à 4 chambres avec des agencements spacieux, des cours privées et des balcons.",
  "Offrant une surface habitable allant de 63,72 m² à 124,94 m², ces résidences allient parfaitement confort et praticité, avec des biens conçus aussi bien pour la vie familiale que pour les besoins commerciaux.",
  "Chaque unité dispose d'équipements modernes, comprenant plusieurs salles de bains, cuisines, salons et balcons.",
  city,
];

const FEATURES = [
  "Maison intelligente",
  "Climatisation centralisée",
  "Chauffage central",
  "Cuisines et salles de bain équipées",
  "Caméras de surveillance",
  "Parking sous-sol",
  "Aire de jeux",
  "Chambres spacieuses",
];

const CHERAGA_BLOCKS: Block[] = [
  {
    id: "bloc-a",
    name: "Bloc A",
    headline: "Verticalité, lumière et double exposition",
    desc: "Douze appartements répartis sur six niveaux, deux logements par palier. Une double exposition, un ascenseur desservant chaque étage et un local commercial en rez-de-chaussée.",
    stats: [
      { label: "Appartements", value: "12" },
      { label: "Niveaux", value: "06" },
      { label: "Par palier", value: "02" },
    ],
    units: [
      {
        code: "A1",
        name: "F4 Simplex",
        tag: "3 chambres + salon",
        desc: "Un plan traversant, généreux et fluide : trois chambres, un salon largement ouvert sur la façade principale et une cuisine pensée pour la vie de famille.",
        poster: interiorImg,
        videoUrl: CHERAGA_VIDEO,
        surfaces: [
          { label: "Salon", value: "26,87 m²" },
          { label: "Cuisine", value: "14,41 m²" },
          { label: "Chambre 01", value: "11,62 m²" },
          { label: "Chambre 02", value: "18,52 m²" },
          { label: "Chambre 03", value: "15,92 m²" },
          { label: "Hall", value: "20,77 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "107,00 m²" },
          { label: "Surface totale", value: "114,43 m²" },
        ],
      },
      {
        code: "A2",
        name: "F4 avec terrasse",
        tag: "3 chambres + terrasse",
        desc: "Le même plan porté par un extérieur privatif : une terrasse orientée pour capter la lumière du soir, prolongement naturel du séjour.",
        poster: cheragaImg,
        videoUrl: CHERAGA_VIDEO,
        surfaces: [
          { label: "Salon", value: "26,87 m²" },
          { label: "Terrasse", value: "24,10 m²" },
          { label: "Cuisine", value: "14,41 m²" },
          { label: "Chambres", value: "3 × " },
        ],
        totals: [
          { label: "Surface habitable", value: "114,43 m²" },
          { label: "Surface totale", value: "138,53 m²" },
        ],
      },
      {
        code: "A3",
        name: "Local commercial",
        tag: "Rez-de-chaussée",
        desc: "Une surface commerciale en pied d'immeuble, en double hauteur de vitrine, pensée pour un commerce de proximité ou une activité libérale.",
        poster: detailImg,
        videoUrl: CHERAGA_VIDEO,
        surfaces: [
          { label: "Réception", value: "25,28 m²" },
          { label: "Espace 01", value: "17,87 m²" },
          { label: "Espace 02", value: "18,96 m²" },
          { label: "Sanitaires", value: "2,25 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "126,66 m²" },
          { label: "Surface totale", value: "128,04 m²" },
        ],
      },
    ],
  },
  {
    id: "bloc-b",
    name: "Bloc B",
    headline: "Intimité, cours privatives et vue dégagée",
    desc: "Dix appartements sur cinq niveaux, deux logements par étage. Les unités du rez-de-chaussée bénéficient d'une cour privative, les étages d'une vue dégagée sur l'aire de jeux.",
    stats: [
      { label: "Appartements", value: "10" },
      { label: "Niveaux", value: "05" },
      { label: "Par palier", value: "02" },
    ],
    units: [
      {
        code: "B1",
        name: "F2 avec cour",
        tag: "1 chambre + cour",
        desc: "Le format idéal pour un jeune couple : un séjour lumineux, une chambre calme et une cour privative qui double l'espace de vie.",
        poster: interiorImg,
        videoUrl: CHERAGA_VIDEO,
        surfaces: [
          { label: "Salon", value: "25,48 m²" },
          { label: "Chambre", value: "11,24 m²" },
          { label: "Hall", value: "8,62 m²" },
          { label: "SDB", value: "3,91 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "63,72 m²" },
          { label: "Cour", value: "42,01 m²" },
          { label: "Surface totale", value: "119,87 m²" },
        ],
      },
      {
        code: "B2",
        name: "F4 avec cour",
        tag: "3 chambres + cour",
        desc: "Un rez-de-chaussée familial : trois chambres, un vaste hall de distribution et une cour privative orientée sur l'aire de jeux.",
        poster: cheragaImg,
        videoUrl: CHERAGA_VIDEO,
        surfaces: [
          { label: "Salon", value: "26,87 m²" },
          { label: "Cuisine", value: "14,41 m²" },
          { label: "Chambre 01", value: "11,62 m²" },
          { label: "Chambre 02", value: "18,52 m²" },
          { label: "Chambre 03", value: "15,92 m²" },
          { label: "Hall", value: "20,77 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "124,94 m²" },
          { label: "Cour", value: "44,06 m²" },
          { label: "Surface totale", value: "189,32 m²" },
        ],
      },
      {
        code: "B3",
        name: "F4 Simplex",
        tag: "3 chambres, étages",
        desc: "Aux niveaux supérieurs : un plan simplex spacieux et fonctionnel, entièrement tourné vers la vue dégagée entre les blocs A et B.",
        poster: heroImg,
        videoUrl: CHERAGA_VIDEO,
        surfaces: [
          { label: "Salon", value: "25,08 m²" },
          { label: "Cuisine", value: "13,37 m²" },
          { label: "Chambre 01", value: "11,14 m²" },
          { label: "Chambre 02", value: "18,28 m²" },
          { label: "Chambre 03", value: "13,47 m²" },
          { label: "Balcons", value: "2 × 4,45 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "111,29 m²" },
          { label: "Surface utile", value: "120,19 m²" },
          { label: "Surface totale", value: "132,71 m²" },
        ],
      },
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "residence-hypro-cheraga",
    index: "01",
    name: "Résidence HYPRO Cheraga",
    shortName: "Résidence HYPRO Cheraga",
    location: "Cheraga, Algérie",
    district: "Petit Staoueli",
    description: COMMON_DESCRIPTION(
      "Située dans le quartier prisé de Petit Staoueli, cette résidence garantit une qualité de vie exceptionnelle.",
    ),
    features: FEATURES,
    blocks: CHERAGA_BLOCKS,
    hero: cheragaImg,
    heroVideo: CHERAGA_VIDEO,
    videoUrl: CHERAGA_VIDEO,
    vrUrl: "https://kuula.co/share/collection/710cN?logo=1&info=1&fs=1&vr=0&zoom=1&thumbs=0",
    media: [
      { type: "image", src: cheragaImg, alt: "Façade de la Résidence HYPRO Cheraga" },
      { type: "image", src: interiorImg, alt: "Intérieur d'un appartement type" },
      { type: "image", src: detailImg, alt: "Détail architectural de la résidence" },
      { type: "image", src: heroImg, alt: "Vue d'ensemble de la résidence" },
    ],
    mapQuery: "Cheraga, Alger, Algérie",
  },
  {
    slug: "residence-blida",
    index: "02",
    name: "Résidence HYPRO Blida",
    shortName: "Résidence HYPRO Blida",
    location: "Blida, Algérie",
    completion: 94,
    description: COMMON_DESCRIPTION(
      "Située à Blida, cette résidence garantit une qualité de vie exceptionnelle.",
    ),
    features: FEATURES,
    surfaces: [
      { label: "Salle", value: "15,47 m²" },
      { label: "Chambre 01", value: "11,14 m²" },
      { label: "Salon", value: "25,08 m²" },
      { label: "Cuisine", value: "13,37 m²" },
      { label: "Toilettes", value: "2,01 m²" },
      { label: "Chambre 02", value: "18,28 m²" },
      { label: "SDB", value: "5,65 m²" },
      { label: "Chambre 03", value: "13,47 m²" },
      { label: "SDB", value: "3,73 m²" },
      { label: "Balcon", value: "4,45 m²" },
      { label: "Balcon", value: "4,45 m²" },
    ],
    totals: [
      { label: "Surface habitable", value: "111,29 m²" },
      { label: "Surface utile", value: "120,19 m²" },
      { label: "Surface totale", value: "132,71 m²" },
    ],
    hero: blidaImg,
    vrUrl: "https://kuula.co/share/collection/710cN?logo=1&info=1&fs=1&vr=0&zoom=1&thumbs=0",
    media: [
      { type: "image", src: blidaImg, alt: "Façade de la Résidence HYPRO Blida" },
      { type: "image", src: interiorImg, alt: "Séjour lumineux d'un appartement" },
      { type: "image", src: detailImg, alt: "Détail architectural" },
    ],
    mapQuery: "Blida, Algérie",
  },
  {
    slug: "residence-hamma",
    index: "03",
    name: "Résidence HYPRO Hamma",
    shortName: "Résidence HYPRO Hamma",
    location: "Hamma, Algérie",
    completion: 80,
    description: COMMON_DESCRIPTION(
      "Située à Hamma, cette résidence garantit une qualité de vie exceptionnelle.",
    ),
    features: FEATURES,
    surfaces: [
      { label: "Salon", value: "26,87 m²" },
      { label: "Cuisine", value: "14,41 m²" },
      { label: "Chambre 01", value: "11,62 m²" },
      { label: "Chambre 02", value: "18,52 m²" },
      { label: "Chambre 03", value: "15,92 m²" },
      { label: "SDB", value: "4,38 m²" },
      { label: "Hall", value: "20,77 m²" },
      { label: "WC", value: "2,72 m²" },
    ],
    totals: [
      { label: "Surface habitable", value: "124,94 m²" },
      { label: "Surface utile", value: "169,00 m²" },
      { label: "Surface totale", value: "189,32 m²" },
    ],
    hero: hammaImg,
    vrUrl: "https://kuula.co/share/collection/710cN?logo=1&info=1&fs=1&vr=0&zoom=1&thumbs=0",
    media: [
      { type: "image", src: hammaImg, alt: "Façade de la Résidence HYPRO Hamma" },
      { type: "image", src: heroImg, alt: "Vue architecturale de la résidence" },
      { type: "image", src: interiorImg, alt: "Intérieur d'un appartement" },
    ],
    mapQuery: "Hamma, Alger, Algérie",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const contact = {
  phones: ["+213 556 331 688", "+213 661 474 547", "+213 541 801 951", "+213 556 228 923"],
  email: "HYPROMOTION16@GMAIL.COM",
  address: "Cité Makoudi 2, lot N°13, El Alia, Alger",
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
};

export const images = { heroImg, cheragaImg, blidaImg, hammaImg, interiorImg, detailImg };
