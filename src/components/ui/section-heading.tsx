import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto text-center" : null,
        "max-w-3xl xl:max-w-4xl",
        className,
      )}
    >
      {eyebrow ? (
        <p className="font-display text-xs font-semibold uppercase tracking-[0.32em] text-accent sm:text-sm xl:text-base">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tightest text-foreground sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[4.25rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-muted sm:text-base xl:text-lg 2xl:text-xl">
          {description}
        </p>
      ) : null}
    </div>
  );
}
