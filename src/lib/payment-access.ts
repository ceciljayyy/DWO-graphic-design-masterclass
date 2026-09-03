import { randomBytes } from "crypto";

export function generatePaymentAccessToken() {
  return randomBytes(24).toString("hex");
}
