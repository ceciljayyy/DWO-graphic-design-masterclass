import type { PaymentStatus } from "@/types/registration";

export type PaymentSummaryData = {
  registrationReference: string;
  fullName: string;
  courseName: string;
  amount: string;
  amountDisplay: string;
  paymentStatus: PaymentStatus;
  paystackReference: string | null;
  paidAt: string | null;
};

export type PaymentInitializeSuccess = {
  success: true;
  data: {
    authorizationUrl: string;
    paystackReference: string;
    registrationReference: string;
    amountDisplay: string;
  };
};

export type PaymentVerifySuccess = {
  success: true;
  data: {
    outcome: "paid" | "already_paid" | "failed" | "pending";
    summary: PaymentSummaryData;
  };
};

export type PaymentApiError = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
