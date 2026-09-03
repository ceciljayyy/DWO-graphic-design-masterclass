import { masterclass, registrationFee } from "@/lib/masterclass";

/**
 * Convert E.164 (+233...) or local digits into a wa.me phone id (digits only).
 */
export function toWhatsAppPhoneId(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits || null;
}

export function buildWhatsAppLink(phone: string, message: string) {
  const phoneId = toWhatsAppPhoneId(phone);
  if (!phoneId) {
    return null;
  }

  return `https://wa.me/${phoneId}?text=${encodeURIComponent(message)}`;
}

export function buildPaymentVerifiedWhatsAppMessage(input: {
  fullName: string;
  registrationReference: string;
  amountDisplay?: string;
}) {
  const firstName = input.fullName.trim().split(/\s+/)[0] || "there";
  const amount = input.amountDisplay ?? registrationFee.display;

  return [
    `Hi ${firstName},`,
    "",
    `You're officially registered for the DWO ${masterclass.name}! 🎉`,
    "",
    "Your Mobile Money payment has been verified and your place in the class is secured.",
    "",
    `Registration reference: ${input.registrationReference}`,
    `Amount paid: ${amount}`,
    `Course period: ${masterclass.coursePeriod.display}`,
    "",
    "Please keep this message and your registration reference for your records.",
    "",
    "— Design With Otabil (DWO)",
  ].join("\n");
}
