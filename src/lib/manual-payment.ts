import { registrationFee } from "@/lib/masterclass";

export const manualMobileMoney = {
  methodKey: "MTN_MOBILE_MONEY" as const,
  methodLabel: "MTN Mobile Money",
  number: "0530138872",
  accountName: "JAMES BAIDEN OTABIL",
  amount: registrationFee.amount,
  amountDisplay: registrationFee.display,
  currency: registrationFee.currency,
} as const;

export function formatManualPaymentMethod(method: string) {
  if (method === "MTN_MOBILE_MONEY") {
    return manualMobileMoney.methodLabel;
  }

  return method;
}
