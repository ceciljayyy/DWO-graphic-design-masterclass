export type SocialProofTestimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  highlights: string[];
  initials: string;
};

export type SocialProofStat = {
  id: string;
  target: number;
  suffix: "+" | "%";
  label: string;
  icon: "students" | "satisfaction" | "projects" | "career";
};

export type SocialProofTransformationImage = {
  src: string;
  alt: string;
};

export const socialProof = {
  eyebrow: "Student success",
  titleLead: "Real students.",
  titleAccent: "Real transformation.",
  description:
    "Students from our first edition don't just learn design — they evolve. Here's what some of them have to say.",
  testimonials: [
    {
      id: "student-1",
      name: "NK-CIL",
      role: "Digital Creator · 1st Edition Graduate",
      quote:
        "The first class completely changed how I approach design and content creation.",
      highlights: ["first class", "design", "content creation"],
      initials: "NK",
    },
    {
      id: "student-2",
      name: "Kweku Adu",
      role: "Freelance Designer · 1st Edition",
      quote:
        "Before the 1st class, I struggled with confidence. Now I create professional designs for clients with ease.",
      highlights: ["1st class", "confidence", "professional designs"],
      initials: "KA",
    },
    {
      id: "student-3",
      name: "Abena Serwaa",
      role: "Social Media Manager · 1st Edition",
      quote:
        "After the first edition, the content creation and reels modules helped me grow my clients' pages and engage better audiences.",
      highlights: ["first edition", "content creation", "reels", "engage"],
      initials: "AS",
    },
    {
      id: "student-4",
      name: "Yaw Mensah",
      role: "Junior Designer · 1st Edition",
      quote:
        "I landed my first design job two months after completing the first class. The training was practical and hands-on.",
      highlights: ["first design job", "first class", "practical"],
      initials: "YM",
    },
  ] satisfies SocialProofTestimonial[],
  stats: [
    {
      id: "students-trained",
      target: 30,
      suffix: "+",
      label: "Students trained",
      icon: "students",
    },
    {
      id: "satisfaction",
      target: 97,
      suffix: "%",
      label: "Satisfaction rate",
      icon: "satisfaction",
    },
    {
      id: "projects",
      target: 70,
      suffix: "+",
      label: "Projects completed",
      icon: "projects",
    },
    {
      id: "career",
      target: 87,
      suffix: "%",
      label: "Career improvement",
      icon: "career",
    },
  ] satisfies SocialProofStat[],
  transformation: {
    title: "Student work transformation",
    beforeLabel: "Before",
    afterLabel: "After",
    beforeSummary:
      "Where many first-edition students started — unpolished layouts, inconsistent branding, limited confidence.",
    afterSummary:
      "What they produced after the first class — professional campaigns, cohesive visuals, client-ready output.",
  },
  featuredQuote: {
    quote:
      "Design With Otabil changed the way I see design and creativity. The first class was practical, hands-on, and transformed me from a beginner to a professional.",
    name: "Kwame Boateng",
    role: "Graphic Designer · 1st Edition",
  },
  classPhotos: {
    title: "First edition class moments",
    description: "Snapshots from the first Graphic Design & Media Class.",
    images: [] as SocialProofTransformationImage[],
  },
} as const;

export function highlightQuoteText(quote: string, highlights: string[]) {
  if (highlights.length === 0) {
    return [{ text: quote, highlighted: false }];
  }

  const pattern = new RegExp(`(${highlights.map(escapeRegExp).join("|")})`, "gi");
  const parts = quote.split(pattern).filter(Boolean);

  return parts.map((part) => ({
    text: part,
    highlighted: highlights.some(
      (term) => term.toLowerCase() === part.toLowerCase(),
    ),
  }));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
