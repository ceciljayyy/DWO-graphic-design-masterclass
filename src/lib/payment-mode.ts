export type PaymentMode = "MANUAL" | "PAYSTACK";

/**
 * Active customer payment channel.
 * Paystack code remains intact; switch via PAYMENT_MODE=PAYSTACK when ready.
 */
export function getPaymentMode(): PaymentMode {
  const mode = process.env.PAYMENT_MODE?.trim().toUpperCase();
  return mode === "PAYSTACK" ? "PAYSTACK" : "MANUAL";
}

export function isManualPaymentMode() {
  return getPaymentMode() === "MANUAL";
}

export function isPaystackPaymentMode() {
  return getPaymentMode() === "PAYSTACK";
}
