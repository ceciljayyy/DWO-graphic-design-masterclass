export const experienceLevelOptions = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const paymentStatusOptions = ["PENDING", "PAID", "FAILED"] as const;

export type ExperienceLevel = (typeof experienceLevelOptions)[number];

export type PaymentStatus = (typeof paymentStatusOptions)[number];

export type RegistrationFormValues = {
  fullName: string;
  email: string;
  countryCode: string;
  phone?: string;
  whatsapp: string;
  location: string;
  experienceLevel: ExperienceLevel | "";
};

export type RegistrationAttributionValues = {
  marketingSource?: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

export type RegistrationValidationErrors = Partial<
  Record<keyof RegistrationFormValues | "form", string>
>;

export type RegistrationCreateResponseData = {
  registrationId: string;
  registrationReference: string;
  paymentStatus: PaymentStatus;
  amount: string;
};

export type RegistrationApiSuccess = {
  success: true;
  data: RegistrationCreateResponseData;
};

export type RegistrationApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    fieldErrors?: RegistrationValidationErrors;
  };
};
