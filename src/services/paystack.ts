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