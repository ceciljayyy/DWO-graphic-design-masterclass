export function formatAdminDate(value: string | Date | null | undefined) {
  if (!value) {
    return "—";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Accra",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatExperienceLevel(level: string) {
  switch (level) {
    case "BEGINNER":
      return "Beginner";
    case "INTERMEDIATE":
      return "Intermediate";
    case "ADVANCED":
      return "Advanced";
    default:
      return level;
  }
}

export function formatAmountDisplay(amount: string | number, currency = "GHS") {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) {
    return `${currency} 0.00`;
  }
  return `${currency} ${value.toFixed(2)}`;
}

export function formatMarketingSource(
  source: string | null | undefined,
  fallback = "Direct",
) {
  if (!source) {
    return fallback;
  }

  switch (source) {
    case "INSTAGRAM":
      return "Instagram";
    case "TIKTOK":
      return "TikTok";
    case "WHATSAPP":
      return "WhatsApp";
    case "FACEBOOK":
      return "Facebook";
    case "GOOGLE":
      return "Google";
    case "DIRECT":
      return "Direct";
    case "OTHER":
      return "Other";
    default:
      return fallback;
  }
}
