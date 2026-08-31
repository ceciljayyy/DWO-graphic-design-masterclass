import type { NavigationItem } from "@/types/navigation";

export type MasterclassFaq = {
  question: string;
  answer: string;
};

export type MasterclassListItem = {
  title: string;
  description?: string;
};

export type MasterclassStat = {
  label: string;
  value: string;
};

export type MasterclassContact = {
  phoneNumbers: {
    label: string;
    href: string;
  }[];
  instagram: {
    handle: string;
    href: string;
    label: string;
  };
};

export const registrationFee = {
  currency: "GHS",
  amount: 700,
  display: "GHS 700",
} as const;

/** Paystack expects the fee in the smallest currency unit (pesewas for GHS). */
export function getRegistrationFeeInMinorUnits(
  amountMajor: number = registrationFee.amount,
) {
  return Math.round(amountMajor * 100);
}

export const masterclass = {
  brand: "DWO",
  brandFull: "Design With Otabil",
  brandAssets: {
    logo: "/brand/dwo-logo-white.png",
  },
  name: "Graphic Design & Media Class",
  shortName: "Design & Media Class",
  description:
    "Join the Graphic Design & Media Class and learn Graphic Design, Content Creation, Social Media Management, and Reels Making.",
  coursePeriod: {
    start: "2026-09-21",
    end: "2026-10-21",
    display: "21 September – 21 October 2026",
    shortDisplay: "21st Sept. – 21st Oct. 2026",
  },
  registrationStarts: {
    date: "2026-09-04",
    display: "4 September 2026",
    shortDisplay: "4th September 2026",
  },
  price: registrationFee,
  skills: [
    { title: "Graphic Design" },
    { title: "Content Creation" },
    { title: "Social Media Management" },
    { title: "Reels Making" },
  ] satisfies MasterclassListItem[],
  contact: {
    phoneNumbers: [
      { label: "+233 59 925 8957", href: "tel:+233599258957" },
      { label: "+233 53 013 8872", href: "tel:+233530138872" },
    ],
    instagram: {
      handle: "@design_with_otabil",
      href: "https://www.instagram.com/design_with_otabil/",
      label: "Follow the work",
    },
  } satisfies MasterclassContact,
  hero: {
    titleLines: ["GRAPHIC DESIGN", "& MEDIA"],
    titleAccent: "CLASS",
    description:
      "A focused creative class covering Graphic Design, Content Creation, Social Media Management, and Reels Making.",
    secondaryCta: "EXPLORE DETAILS",
  },
  intro: {
    title: "A practical creative media class",
    body: "The Graphic Design & Media Class brings together the core creative skills from the official course flyer: design, content creation, social media management, and reels making.",
    bodySecondary: `Registration opens on 4 September 2026. The course runs from 21 September to 21 October 2026 at a rate of ${registrationFee.display}.`,
  },
  navigation: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#learn" },
    { label: "Work", href: "#work" },
    { label: "Results", href: "#success" },
    { label: "Instructor", href: "#instructor" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavigationItem[],
  audience: [
    {
      title: "Beginners",
      description:
        "For learners who want to start building practical creative media skills.",
    },
    {
      title: "Content Creators",
      description:
        "For creators who want stronger visuals, planning, and short-form media output.",
    },
    {
      title: "Social Media Managers",
      description:
        "For people managing brand or personal pages and improving content consistency.",
    },
  ] satisfies MasterclassListItem[],
  instructor: {
    sectionLabel: "Instructor",
    name: "James Baiden Otabil",
    role: "Creative Director · Design With Otabil",
    bio: "James Baiden Otabil isn’t just a graphic designer — he’s a visual storyteller. With over six years of hands-on experience, he transforms ideas into designs that speak, sell, and stick. His work includes collaborations with brands and personalities from Raphiya to theBandFRA! and Dave Da Musicbox.",
    imageSrc: "/instructor/james-baiden-otabil.jpg",
    imageAlt:
      "James Baiden Otabil, graphic design instructor and Creative Director at Design With Otabil in Ghana",
  },
  details: [
    {
      label: "Course Period",
      value: "21 September – 21 October 2026",
    },
    {
      label: "Registration Starts",
      value: "4 September 2026",
    },
    {
      label: "Rate",
      value: registrationFee.display,
    },
  ] satisfies MasterclassStat[],
  faqs: [
    {
      question: "Who can register for the class?",
      answer:
        "The class is suited to people who want to learn practical creative media skills. Contact the provided numbers for any specific eligibility questions.",
    },
    {
      question: "What skills will be taught?",
      answer:
        "The confirmed skills are Graphic Design, Content Creation, Social Media Management, and Reels Making.",
    },
    {
      question: "How much is registration?",
      answer: `The confirmed rate is ${registrationFee.display}.`,
    },
    {
      question: "When does the course begin?",
      answer: "The course begins on 21 September 2026.",
    },
    {
      question: "How long does the course run?",
      answer: "The course runs from 21 September 2026 to 21 October 2026.",
    },
    {
      question: "When does registration start?",
      answer: "Registration starts on 4 September 2026.",
    },
    {
      question: "How do I register?",
      answer:
        "Use the Register Now button to open the registration page. For extra guidance, contact +233 59 925 8957 or +233 53 013 8872.",
    },
  ] satisfies MasterclassFaq[],
  footer: {
    description:
      "Official digital landing page for the Graphic Design & Media Class by DWO.",
  },
} as const;
