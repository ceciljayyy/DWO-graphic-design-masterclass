/**
 * @deprecated Prefer `@/lib/paystack` for server-side Paystack operations.
 * These types remain for compatibility with earlier service-layer stubs.
 */
export type PaystackInitializationInput = {
  email: string;
  amountInKobo: number;
  reference: string;
  metadata?: Record<string, unknown>;
};

export type PaystackVerificationInput = {
  reference: string;
};

export type PaystackWebhookEvent = {
  event: string;
  data: Record<string, unknown>;
};
