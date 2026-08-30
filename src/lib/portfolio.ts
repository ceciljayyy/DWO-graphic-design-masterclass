export type PortfolioCategory =
  | "Branding"
  | "Campaign Design"
  | "Social Media"
  | "Event Design"
  | "Content Creation"
  | "Poster Design"
  | "Album Art";

export type PortfolioItem = {
  id: string;
  src: string;
  alt: string;
  category: PortfolioCategory;
  width: number;
  height: number;
};

const categories: PortfolioCategory[] = [
  "Campaign Design",
  "Poster Design",
  "Album Art",
  "Event Design",
  "Branding",
  "Social Media",
  "Content Creation",
];

const workFiles = [
  { file: "a01.jpg", width: 1281, height: 1495 },
  { file: "a02.jpg", width: 1240, height: 1653 },
  { file: "a1.jpg", width: 1440, height: 1680 },
  { file: "a2.jpg", width: 1440, height: 1680 },
  { file: "a3.jpg", width: 1440, height: 1680 },
  { file: "a4.jpg", width: 1440, height: 1680 },
  { file: "a5.jpg", width: 2160, height: 2700 },
  { file: "a6.jpg", width: 3000, height: 3000 },
  { file: "a7.jpg", width: 1440, height: 1440 },
  { file: "a8.jpg", width: 1440, height: 1680 },
  { file: "a9.jpg", width: 1440, height: 1728 },
  { file: "a10.jpg", width: 1440, height: 1440 },
  { file: "a11.jpg", width: 1080, height: 1350 },
  { file: "a12.jpg", width: 1440, height: 1920 },
  { file: "a13.jpg", width: 3000, height: 3000 },
  { file: "a14.jpg", width: 1440, height: 1680 },
  { file: "a15.jpg", width: 1440, height: 1680 },
  { file: "a16.jpg", width: 1440, height: 1440 },
  { file: "a17.jpg", width: 1440, height: 1440 },
  { file: "a18.jpg", width: 1273, height: 1571 },
  { file: "a19.jpg", width: 1440, height: 1440 },
  { file: "a20.jpg", width: 1080, height: 1080 },
  { file: "a21.jpg", width: 1440, height: 1682 },
  { file: "a22.jpg", width: 2700, height: 3375 },
  { file: "a23.jpg", width: 1440, height: 1800 },
  { file: "a24.jpg", width: 1440, height: 1800 },
  { file: "a25.jpg", width: 1440, height: 1920 },
  { file: "a26.jpg", width: 1440, height: 1920 },
  { file: "a27.jpg", width: 1440, height: 1440 },
  { file: "a28.jpg", width: 1440, height: 1726 },
] as const;

export const portfolioItems: PortfolioItem[] = workFiles.map((entry, index) => {
  const category = categories[index % categories.length];

  return {
    id: entry.file.replace(/\.jpg$/i, ""),
    src: `/work/${entry.file}`,
    alt: `DWO graphic design work — ${category.toLowerCase()} by Design With Otabil`,
    category,
    width: entry.width,
    height: entry.height,
  };
});

export const portfolioSection = {
  eyebrow: "The work",
  title: "Selected creative work",
  description:
    "A selection of visual identities, campaigns, and creative work by DWO.",
} as const;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

export function getPortfolioNeighbors(
  activeIndex: number,
  length: number,
  radius = 2,
) {
  const offsets: number[] = [];

  for (let offset = -radius; offset <= radius; offset += 1) {
    offsets.push(wrapIndex(activeIndex + offset, length));
  }

  return offsets.map((itemIndex, slot) => ({
    itemIndex,
    offset: slot - radius,
  }));
}

export function getPortfolioDisplaySize(
  item: PortfolioItem,
  role: "hero" | "near" | "far",
) {
  const aspect = item.width / item.height;

  const heights = {
    hero: 34,
    near: 20,
    far: 14,
  } as const;

  const heightRem = heights[role];
  let widthRem = heightRem * aspect;

  // Keep the hero prominent without letting ultra-wide pieces overflow the stage.
  if (role === "hero" && widthRem > 30) {
    widthRem = 30;
    return {
      height: `${widthRem / aspect}rem`,
      width: `${widthRem}rem`,
    };
  }

  return {
    height: `${heightRem}rem`,
    width: `${widthRem}rem`,
  };
}
