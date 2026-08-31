import { randomInt } from "crypto";

import { Prisma, type Registration } from "@prisma/client";

import {
  getPrismaClient,
  isDatabaseConnectionError,
  resetPrismaClient,
} from "@/lib/prisma";
import { registrationConfiguration } from "@/lib/registration";
import type { NormalizedRegistrationInput } from "@/lib/registration";

/** Readable public reference format: DWO-8K4P2M */
const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateRegistrationReference() {
  let token = "";

  for (let index = 0; index < 6; index += 1) {
    token += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }

  return `DWO-${token}`;
}

function getUniqueConstraintTargets(error: Prisma.PrismaClientKnownRequestError) {
  const target = error.meta?.target;

  if (Array.isArray(target)) {
    return target.map(String);
  }

  if (typeof target === "string") {
    return [target];
  }

  return [];
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export class DuplicateRegistrationError extends Error {
  readonly field: "email";
  readonly paymentStatus: "PAID" | "PENDING" | "FAILED";

  constructor(
    paymentStatus: "PAID" | "PENDING" | "FAILED" = "PAID",
    field: "email" = "email",
  ) {
    super("Duplicate registration");
    this.name = "DuplicateRegistrationError";
    this.field = field;
    this.paymentStatus = paymentStatus;
  }
}

function isUniqueConstraintError(error: unknown, constraintHint: string) {
  const hint = constraintHint.toLowerCase();

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    const targets = getUniqueConstraintTargets(error);
    if (targets.some((value) => value.toLowerCase().includes(hint))) {
      return true;
    }
  }

  // Adapter/driver wording for MySQL unique indexes (do not match field names alone).
  const message = getErrorMessage(error).toLowerCase();
  return (
    message.includes(`registration_${hint}_key`) ||
    message.includes(`unique constraint failed on the constraint: \`${hint}`) ||
    message.includes(`unique constraint failed on the fields: (\`${hint}\`)`)
  );
}

async function createWithUniqueReference(
  data: NormalizedRegistrationInput,
  maxAttempts = 5,
): Promise<Registration> {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const registrationReference = generateRegistrationReference();

    try {
      return await getPrismaClient().registration.create({
        data: {
          registrationReference,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          location: data.location,
          experienceLevel: data.experienceLevel,
          paymentStatus: "PENDING",
          amount: new Prisma.Decimal(registrationConfiguration.fee.amount),
          paystackReference: null,
          marketingSource: data.marketing.marketingSource,
          utmSource: data.marketing.utmSource,
          utmMedium: data.marketing.utmMedium,
          utmCampaign: data.marketing.utmCampaign,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const targets = getUniqueConstraintTargets(error);

        if (targets.some((value) => value.includes("registrationReference"))) {
          continue;
        }

        if (targets.some((value) => value.toLowerCase().includes("email"))) {
          throw new DuplicateRegistrationError("PENDING");
        }
      }

      if (isUniqueConstraintError(error, "email")) {
        throw new DuplicateRegistrationError("PENDING");
      }

      throw error;
    }
  }

  throw new Error("Unable to generate a unique registration reference.");
}

async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isDatabaseConnectionError(error)) {
      throw error;
    }

    await resetPrismaClient();
    return operation();
  }
}

export async function createRegistrationRecord(data: NormalizedRegistrationInput) {
  return withDatabaseRetry(async () => {
    const existing = await getPrismaClient().registration.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      if (existing.paymentStatus === "PAID") {
        throw new DuplicateRegistrationError("PAID");
      }

      // Resume unpaid registrations with the latest submitted details.
      return getPrismaClient().registration.update({
        where: { id: existing.id },
        data: {
          fullName: data.fullName,
          phone: data.phone,
          whatsapp: data.whatsapp,
          location: data.location,
          experienceLevel: data.experienceLevel,
          paymentStatus:
            existing.paymentStatus === "FAILED" ? "PENDING" : existing.paymentStatus,
        },
      });
    }

    try {
      return await createWithUniqueReference(data);
    } catch (error) {
      if (error instanceof DuplicateRegistrationError) {
        throw error;
      }

      if (isUniqueConstraintError(error, "email")) {
        // Race: another request created the same email — resume if unpaid.
        const raced = await getPrismaClient().registration.findUnique({
          where: { email: data.email },
        });

        if (raced) {
          if (raced.paymentStatus === "PAID") {
            throw new DuplicateRegistrationError("PAID");
          }

          return getPrismaClient().registration.update({
            where: { id: raced.id },
            data: {
              fullName: data.fullName,
              phone: data.phone,
              whatsapp: data.whatsapp,
              location: data.location,
              experienceLevel: data.experienceLevel,
              paymentStatus:
                raced.paymentStatus === "FAILED" ? "PENDING" : raced.paymentStatus,
            },
          });
        }

        throw new DuplicateRegistrationError("PENDING");
      }

      throw error;
    }
  });
}

export function isDuplicateEmailError(error: unknown) {
  return error instanceof DuplicateRegistrationError;
}

export function getDuplicateRegistrationMessage(error: unknown) {
  if (error instanceof DuplicateRegistrationError && error.paymentStatus === "PAID") {
    return "This email is already registered and paid. Contact DWO if you need help with your confirmation.";
  }

  return "A registration already exists with this email. Continue with payment using the same details, or use a different email.";
}
