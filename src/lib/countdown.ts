import { masterclass } from "@/lib/masterclass";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export type CountdownPhase = "registration" | "masterclass" | "active" | "ended";

export type CountdownSnapshot = {
  phase: CountdownPhase;
  heading: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  targetLabel: string;
  isVisible: boolean;
};

function parseAccraMidnight(date: string) {
  return new Date(`${date}T00:00:00.000+00:00`);
}

function getCourseEndExclusive() {
  const end = parseAccraMidnight(masterclass.coursePeriod.end);
  return new Date(end.getTime() + DAY_MS);
}

export function getCountdownSnapshot(now = new Date()): CountdownSnapshot {
  const registrationOpens = parseAccraMidnight(
    masterclass.registrationStarts.date,
  );
  const courseStarts = parseAccraMidnight(masterclass.coursePeriod.start);
  const courseEnded = getCourseEndExclusive();

  if (now >= courseEnded) {
    return {
      phase: "ended",
      heading: "Masterclass completed",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetLabel: masterclass.coursePeriod.display,
      isVisible: false,
    };
  }

  if (now >= courseStarts) {
    return {
      phase: "active",
      heading: "Masterclass in session",
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      targetLabel: masterclass.coursePeriod.display,
      isVisible: false,
    };
  }

  const target =
    now < registrationOpens ? registrationOpens : courseStarts;
  const remainingMs = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(remainingMs / DAY_MS);
  const hours = Math.floor((remainingMs % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((remainingMs % HOUR_MS) / MINUTE_MS);
  const seconds = Math.floor((remainingMs % MINUTE_MS) / SECOND_MS);
  const beforeRegistration = now < registrationOpens;

  return {
    phase: beforeRegistration ? "registration" : "masterclass",
    heading: beforeRegistration
      ? "Registration opens in"
      : "Masterclass starts in",
    days,
    hours,
    minutes,
    seconds,
    targetLabel: beforeRegistration
      ? masterclass.registrationStarts.display
      : masterclass.coursePeriod.display,
    isVisible: true,
  };
}

export function formatCountdownUnit(value: number) {
  return String(value).padStart(2, "0");
}
