import Image from "next/image";

import { masterclass } from "@/lib/masterclass";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { width: 130, height: 64, className: "h-9 w-auto" },
  md: { width: 170, height: 84, className: "h-11 w-auto" },
  lg: { width: 240, height: 118, className: "h-14 w-auto sm:h-16" },
} as const;

export function BrandLogo({
  className,
  priority = false,
  size = "md",
}: BrandLogoProps) {
  const dimensions = sizeMap[size];

  return (
    <Image
      src={masterclass.brandAssets.logo}
      alt={`${masterclass.brand} — ${masterclass.brandFull}`}
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      unoptimized
      className={cn(
        dimensions.className,
        "bg-transparent object-contain object-left invert dark:invert-0",
        className,
      )}
    />
  );
}
