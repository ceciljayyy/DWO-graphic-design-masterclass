export type TransformationSlide = {
  src: string;
  alt: string;
};

const beforeFiles = [
  "01.jpg",
  "02.jpg",
  "03.jpg",
  "04.jpg",
  "05.jpg",
  "download (9).jpg",
  "Nollywood movie.jpg",
  "The 46 Art Scholarships You Need to Know About · PrepScholar.jpg",
  "This is a bad design because of the random mix of colours, shapes and fonts_.jpg",
] as const;

const afterFiles = [
  "1a.jpg",
  "2a.jpg",
  "3a.jpg",
  "4a.jpg",
  "Church Flyer Designs.jpg",
  "Church Flyer.jpg",
  "Creative Birthday Designs (1).jpg",
  "Creative Birthday Designs.jpg",
  "Creative new month August design 2026.jpg",
  "Design Challenge 2.jpg",
  "Second Chances.jpg",
] as const;

function toWorkSrc(folder: "before" | "after", file: string) {
  return `/work/${folder}/${encodeURIComponent(file)}`;
}

export const studentTransformationSlides = {
  before: beforeFiles.map((file, index) => ({
    src: toWorkSrc("before", file),
    alt: `First-edition student work before training — sample ${index + 1}`,
  })),
  after: afterFiles.map((file, index) => ({
    src: toWorkSrc("after", file),
    alt: `First-edition student work after the first DWO class — sample ${index + 1}`,
  })),
  intervalMs: 3600,
} as const;

export function getTransformationSlideCount() {
  return Math.max(
    studentTransformationSlides.before.length,
    studentTransformationSlides.after.length,
  );
}
