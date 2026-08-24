import { createHmac, timingSafeEqual } from "crypto";

import {
  getRegistrationFeeInMinorUnits,
  registrationFee,
} from "@/lib/masterclass";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export type PaystackInitializeResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export type PaystackVerifiedTransaction = {
  reference: string;
  status: string;
  amount: number;
  currency: string;
  paidAt: string | null;
  customerEmail: string | null;
  metadata: Record<string, unknown>;
};

export class PaystackError extends Error {
  readonly code: string;

  constructor(message: string, code = "PAYSTACK_ERROR") {
    super(message);
    this.name = "PaystackError";
    this.code = code;
  }
}

function getPaystackSecretKey() {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!secret) {
    throw new PaystackError(
      "Payment service is not configured.",
      "PAYSTACK_NOT_CONFIGURED",
    );
  }

  return secret;
}

function getAppUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "");

  if (!appUrl) {
    throw new PaystackError(
      "Application URL is not configured.",
      "APP_URL_NOT_CONFIGURED",
    );
  }

  return appUrl;
}

export function buildPaystackCallbackUrl(reference: string) {
  const url = new URL("/payment/verify", getAppUrl());
  url.searchParams.set("reference", reference);
  return url.toString();
}

export function getExpectedPaystackAmount(
  amountMajor: number = registrationFee.amount,
) {
  return getRegistrationFeeInMinorUnits(amountMajor);
}

async function paystackRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const secret = getPaystackSecretKey();

  let response: Response;

  try {
    response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new PaystackError(
      "We are currently unable to connect to the payment service. Please try again shortly.",
      "PAYSTACK_UNAVAILABLE",
    );
  }

  const payload = (await response.json().catch(() => null)) as {
    status?: boolean;
    message?: string;
    data?: T;
  } | null;

  if (!response.ok || !payload?.status || !payload.data) {
    throw new PaystackError(
      payload?.message ||
        "We are currently unable to connect to the payment service. Please try again shortly.",
      "PAYSTACK_REQUEST_FAILED",
    );
  }

  return payload.data;
}

export async function initializePaystackTransaction(input: {
  email: string;
  amountInMinorUnits: number;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackInitializeResult> {
  const data = await paystackRequest<{
    authorization_url: string;
    access_code: string;
    reference: string;
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amountInMinorUnits,
      currency: registrationFee.currency,
      reference: input.reference,
      callback_url: buildPaystackCallbackUrl(input.reference),
      metadata: input.metadata,
    }),
  });

  return {
    authorizationUrl: data.authorization_url,
    accessCode: data.access_code,
    reference: data.reference,
  };
}

export async function verifyPaystackTransaction(
  reference: string,
): Promise<PaystackVerifiedTransaction> {
  const encoded = encodeURIComponent(reference);
  const data = await paystackRequest<{
    reference: string;
    status: string;
    amount: number;
    currency: string;
    paid_at?: string | null;
    customer?: { email?: string };
    metadata?: Record<string, unknown> | string | null;
  }>(`/transaction/verify/${encoded}`);

  let metadata: Record<string, unknown> = {};

  if (data.metadata && typeof data.metadata === "object") {
    metadata = data.metadata;
  }

  return {
    reference: data.reference,
    status: data.status,
    amount: data.amount,
    currency: data.currency,
    paidAt: data.paid_at ?? null,
    customerEmail: data.customer?.email ?? null,
    metadata,
  };
}

export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | null,
) {
  if (!signatureHeader) {
    return false;
  }

  const secret = getPaystackSecretKey();
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");

  try {
    const expected = Buffer.from(hash, "utf8");
    const received = Buffer.from(signatureHeader, "utf8");

    if (expected.length !== received.length) {
      return false;
    }

    return timingSafeEqual(expected, received);
  } catch {
    return false;
  }
}
