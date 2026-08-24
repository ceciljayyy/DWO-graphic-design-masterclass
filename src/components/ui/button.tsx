import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
};

export function ButtonLink({
  href,
  children,
  className,
  variant = "primary",
}: ButtonLinkProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-sm px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background";

  const variantStyles =
    variant === "primary"
      ? "bg-accent text-background hover:bg-accent/90 focus:ring-accent"
      : "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent focus:ring-accent";

  return (
    <Link href={href} className={cn(baseStyles, variantStyles, className)}>
      {children}
    </Link>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-sm px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.18em] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60";

  const variantStyles =
    variant === "primary"
      ? "bg-accent text-background hover:bg-accent/90 focus:ring-accent"
      : "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent focus:ring-accent";

  return (
    <button
      type={type}
      className={cn(baseStyles, variantStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
}
