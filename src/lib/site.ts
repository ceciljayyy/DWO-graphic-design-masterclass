import type { NavigationItem } from "@/types/navigation";

import { masterclass } from "@/lib/masterclass";

export const siteConfig = {
  name: masterclass.name,
  description: masterclass.description,
} as const;

export const mainNavigation: NavigationItem[] = [
  { label: "Overview", href: "/" },
  { label: "Skills", href: "#learn" },
  { label: "Details", href: "#details" },
];

export const phaseOneHighlights = [
  { label: "Framework", value: "Next.js + TypeScript" },
  { label: "Styling", value: "Tailwind CSS tokens" },
  { label: "Data layer", value: "Prisma configured for MySQL" },
  { label: "Readiness", value: "Scalable app structure" },
] as const;
