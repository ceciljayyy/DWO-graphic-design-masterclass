import type { Metadata } from "next";

import { PaymentVerification } from "@/components/payment/PaymentVerification";
import { masterclass } from "@/lib/masterclass";

export const metadata: Metadata = {
  title: `Payment Verification | ${masterclass.name}`,
  description: `Verify your payment for the ${masterclass.name}.`,
};

type PaymentVerifyPageProps = {
  searchParams: Promise<{ reference?: string | string[] }>;
};

export default async function PaymentVerifyPage({
  searchParams,
}: PaymentVerifyPageProps) {
  const params = await searchParams;
  const referenceValue = params.reference;
  const reference = Array.isArray(referenceValue)
    ? referenceValue[0] ?? null
    : referenceValue ?? null;

  return <PaymentVerification reference={reference} />;
}
