import { randomInt } from "crypto";

import { Prisma, type Registration } from "@prisma/client";

import { getPrismaClient } from "@/lib/prisma";
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
        const targets = getUniqueConstraintTargets(error);

        if (targets.some((value) => value.includes("registrationReference"))) {
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
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002") {
    return false;
  }

  return getUniqueConstraintTargets(error).some((value) => value.includes("email"));
}
