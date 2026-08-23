import type { NavigationItem } from "@/types/navigation";

export const siteConfig = {
  name: "DWO Graphic Design Masterclass",
  description:
    "Premium registration and payment platform foundation for the DWO Graphic Design Masterclass.",
} as const;

export const mainNavigation: NavigationItem[] = [
  { label: "Overview", href: "/" },
  { label: "Structure", href: "#structure" },
  { label: "Setup", href: "#details" },
];

export const phaseOneHighlights = [
  { label: "Framework", value: "Next.js + TypeScript" },
  { label: "Styling", value: "Tailwind CSS tokens" },
  { label: "Data layer", value: "Prisma configured for MySQL" },
  { label: "Readiness", value: "Scalable app structure" },
] as const;