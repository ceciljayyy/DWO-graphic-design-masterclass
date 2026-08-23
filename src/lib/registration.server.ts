import { randomUUID } from "crypto";

import { Prisma, type Registration } from "@prisma/client";

import { getPrismaClient } from "@/lib/prisma";
import { registrationConfiguration } from "@/lib/registration";
import type { NormalizedRegistrationInput } from "@/lib/registration";

function generateRegistrationReference() {
  const token = randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
  return `DWO-${token}`;
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
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const target = error.meta?.target;
        if (Array.isArray(target) && target.includes("registrationReference")) {
          continue;
        }
      }

      throw error;
    }
  }

  throw new Error("Unable to generate a unique registration reference.");
}

export async function createRegistrationRecord(data: NormalizedRegistrationInput) {
  return createWithUniqueReference(data);
}

export function isDuplicateEmailError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta?.target.includes("email")
  );
}