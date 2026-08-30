import type { Metadata } from "next";

import { PaymentVerification } from "@/components/payment/PaymentVerification";
import { noIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...noIndexMetadata,
  title: "Payment Verification",
  description:
    "Verify your payment for the Graphic Design & Media Class registration.",
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
