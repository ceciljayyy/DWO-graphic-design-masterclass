import { cn } from "@/lib/utils";

type PaymentStatusBadgeProps = {
  status: "PAID" | "PENDING" | "FAILED" | string;
  className?: string;
};

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const styles =
    status === "PAID"
      ? "border-accent/40 text-accent"
      : status === "FAILED"
        ? "border-red/50 text-red"
        : "border-border text-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.16em]",
        styles,
        className,
      )}
    >
      {status}
    </span>
  );
}
