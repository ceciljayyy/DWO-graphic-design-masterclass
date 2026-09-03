import { cn } from "@/lib/utils";

type PaymentStatusBadgeProps = {
  status: string;
  className?: string;
};

function statusLabel(status: string) {
  switch (status) {
    case "PAYMENT_SUBMITTED":
      return "Submitted";
    case "PAYMENT_REJECTED":
      return "Rejected";
    default:
      return status;
  }
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const styles =
    status === "PAID"
      ? "border-accent/40 text-accent"
      : status === "FAILED" || status === "PAYMENT_REJECTED"
        ? "border-red/50 text-red"
        : status === "PAYMENT_SUBMITTED"
          ? "border-accent/30 text-foreground"
          : "border-border text-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2.5 py-1 font-display text-[11px] font-bold uppercase tracking-[0.16em]",
        styles,
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
