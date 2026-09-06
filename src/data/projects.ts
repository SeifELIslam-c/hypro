import cheragaImg from "@/assets/cheraga-1.webp";
import blidaImg from "@/assets/blida-1.webp";
import hammaImg from "@/assets/hamma-1.webp";
import interiorImg from "@/assets/interior-1.webp";
import detailImg from "@/assets/detail-1.webp";
import heroImg from "@/assets/hero.webp";
import blocA1Img from "@/assets/bloc-a-1.webp";
import blocA2Img from "@/assets/bloc-a-2.webp";
import f4TerrasseImg from "@/assets/f4-terrasse.webp";
import f4EtageImg from "@/assets/f4-etage.webp";
import localCommercial1Img from "@/assets/local-commercial-1.webp";
import localCommercial2Img from "@/assets/local-commercial-2.webp";
import blocB1Img from "@/assets/bloc-b-1.webp";
import f3TerrasseBlocBImg from "@/assets/f3-terrasse-bloc-b.webp";
import blocbScaledImg from "@/assets/blocb-scaled.webp";
import cheragaInterneImg from "@/assets/Cheraga-Bloc-B-interne-2-scaled.webp";
import courScaledImg from "@/assets/cour-scaled.webp";

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
  youtubeId?: string;
  plans?: string[];
  images?: string[];
  surfaces?: SurfaceRow[];
  totals?: SurfaceRow[];
};

export type Block = {
  id: string;
  name: string;
  headline: string;
  desc: string;
  heroImage?: string;
  heroImages?: { src: string; title: string; desc?: string }[];
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
  "Smart Home",
  "Climatisation centralisée",
  "Chauffage central",
  "Cuisines et salle de bain équipées",
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
    heroImage: blocA1Img,
    heroImages: [
      {
        src: blocA1Img,
        title: "Vue Principale",
      },
      {
        src: blocA2Img,
        title: "Perspective d'Angle",
      },
    ],
    stats: [
      { label: "Appartements", value: "12" },
      { label: "Niveaux", value: "06" },
      { label: "Par palier", value: "02" },
    ],
    units: [
      {
        code: "A1",
        name: "F4 avec terrasse",
        tag: "3 chambres + terrasse privative",
        desc: "Le summum du confort urbain : un espace de vie traversant prolongé par une vaste terrasse privative plein ciel de 10,00 m², conçue pour capter la lumière du soir et offrir un cadre de vie extérieur privilégié.",
        poster: f4TerrasseImg,
        plans: [f4TerrasseImg],
        images: [f4TerrasseImg],
        youtubeId: "vmgB7GhO4oQ",
        videoUrl: "https://www.youtube.com/watch?v=vmgB7GhO4oQ",
        surfaces: [
          { label: "Salon de réception", value: "18,61 m²" },
          { label: "Terrasse privative", value: "10,00 m²" },
          { label: "Cuisine ergonomique", value: "17,80 m²" },
          { label: "Chambre 01 (Suite)", value: "14,69 m²" },
          { label: "Chambre 02", value: "14,30 m²" },
          { label: "Chambre 03", value: "12,62 m²" },
          { label: "Hall & Dégagement", value: "16,65 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "94,67 m²" },
          { label: "Terrasse plein ciel", value: "10,00 m²" },
          { label: "Surface totale", value: "104,67 m²" },
        ],
      },
      {
        code: "A2",
        name: "F4 étage courant",
        tag: "3 chambres + salon panoramique",
        desc: "Un agencement contemporain aux volumes généreux répartis sur les étages courants : salon panoramique baigné de lumière naturelle, cuisine ergonomique équipée, trois chambres indépendantes et balcons dégagés.",
        poster: f4EtageImg,
        plans: [f4EtageImg],
        images: [f4EtageImg],
        youtubeId: "wSPYwWVIBsk",
        videoUrl: "https://www.youtube.com/watch?v=wSPYwWVIBsk",
        surfaces: [
          { label: "Salon", value: "23,10 m²" },
          { label: "Cuisine", value: "17,80 m²" },
          { label: "Chambre 01 (Master)", value: "14,69 m²" },
          { label: "Chambre 02", value: "14,30 m²" },
          { label: "Chambre 03", value: "12,62 m²" },
          { label: "Hall", value: "16,65 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "99,16 m²" },
          { label: "Balcons", value: "7,43 m²" },
          { label: "Surface totale", value: "106,59 m²" },
        ],
      },
      {
        code: "A3",
        name: "Local commercial",
        tag: "Rez-de-chaussée · Vitrine",
        desc: "Une surface commerciale prestigieuse en pied d'immeuble, en double hauteur de vitrine, pensée pour un commerce de proximité ou une activité professionnelle libérale.",
        poster: localCommercial1Img,
        plans: [localCommercial1Img, localCommercial2Img],
        youtubeId: "_-mgoGdCcAA",
        videoUrl: "https://www.youtube.com/watch?v=_-mgoGdCcAA",
        surfaces: [
          { label: "ESPACE ATTENTE HOMME", value: "15,78 m²" },
          { label: "ESPACE ATTENTE FEMME", value: "10,47 m²" },
          { label: "WC", value: "2,25 m²" },
          { label: "RECEPTION", value: "25,28 m²" },
          { label: "ESPACE PRELEVEMENT", value: "9,00 m²" },
          { label: "ESPACE ANALYSE", value: "17,87 m²" },
          { label: "ESPACE DE RADIOLOGIE", value: "18,96 m²" },
        ],
        totals: [
          { label: "SURFACE HABITABLE", value: "126,66 m²" },
          { label: "SURFACE TOTALE", value: "128,04 m²" },
        ],
      },
    ],
  },
  {
    id: "bloc-b",
    name: "Bloc B",
    headline: "Intimité, cours privatives et vue dégagée",
    desc: "Dix appartements sur cinq niveaux, deux logements par étage. Les unités du rez-de-chaussée bénéficient d'une cour privative, les étages d'une vue dégagée sur l'aire de jeux.",
    heroImage: blocB1Img,
    heroImages: [
      {
        src: blocB1Img,
        title: "Façade Principale",
      },
    ],
    stats: [
      { label: "Appartements", value: "10" },
      { label: "Niveaux", value: "05" },
      { label: "Par palier", value: "02" },
    ],
    units: [
      {
        code: "B1",
        name: "F3 avec cours",
        tag: "2 chambres + cour privative",
        desc: "Un rez-de-chaussée traversant et lumineux prolongé par une superbe cour privative, pensé pour concilier confort intérieur et vie en plein air.",
        poster: f3TerrasseBlocBImg,
        plans: [f3TerrasseBlocBImg],
        youtubeId: "HfgGeEFyNKU",
        videoUrl: "https://www.youtube.com/watch?v=HfgGeEFyNKU",
        surfaces: [
          { label: "Salon de réception", value: "24,80 m²" },
          { label: "Cour privative", value: "22,50 m²" },
          { label: "Cuisine ergonomique", value: "12,60 m²" },
          { label: "Chambre 01 (Suite)", value: "16,40 m²" },
          { label: "Chambre 02", value: "13,20 m²" },
          { label: "Hall & Dégagement", value: "11,50 m²" },
          { label: "Salle de bain", value: "4,80 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "83,30 m²" },
          { label: "Cour privative", value: "22,50 m²" },
          { label: "Surface totale", value: "105,80 m²" },
        ],
      },
      {
        code: "B2",
        name: "F4 Simplex",
        tag: "3 chambres + salon panoramique",
        desc: "Un agencement contemporain aux volumes généreux répartis sur les étages courants : salon panoramique baigné de lumière naturelle, cuisine ergonomique équipée, trois chambres indépendantes et balcons dégagés.",
        poster: f4EtageImg,
        plans: [f4EtageImg],
        images: [f4EtageImg],
        youtubeId: "wSPYwWVIBsk",
        videoUrl: "https://www.youtube.com/watch?v=wSPYwWVIBsk",
        surfaces: [
          { label: "Salon", value: "23,10 m²" },
          { label: "Cuisine", value: "17,80 m²" },
          { label: "Chambre 01 (Master)", value: "14,69 m²" },
          { label: "Chambre 02", value: "14,30 m²" },
          { label: "Chambre 03", value: "12,62 m²" },
          { label: "Hall", value: "16,65 m²" },
        ],
        totals: [
          { label: "Surface habitable", value: "99,16 m²" },
          { label: "Balcons", value: "7,43 m²" },
          { label: "Surface totale", value: "106,59 m²" },
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
    hero: blocA2Img,
    heroVideo: CHERAGA_VIDEO,
    videoUrl: CHERAGA_VIDEO,
    vrUrl: "https://kuula.co/share/collection/710cN?logo=1&info=1&fs=1&vr=0&zoom=1&thumbs=0",
    media: [
      { type: "image", src: blocA2Img, alt: "Façade — Résidence HYPRO Cheraga" },
      { type: "image", src: blocbScaledImg, alt: "Perspective — Résidence HYPRO Cheraga" },
      { type: "image", src: cheragaInterneImg, alt: "Espace — Résidence HYPRO Cheraga" },
      { type: "image", src: courScaledImg, alt: "Cour — Résidence HYPRO Cheraga" },
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
