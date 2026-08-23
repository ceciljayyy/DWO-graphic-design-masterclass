import type { NavigationItem } from "@/types/navigation";

export type MasterclassFaq = {
  question: string;
  answer: string;
};

export type MasterclassListItem = {
  title: string;
  description: string;
};

export type MasterclassStat = {
  label: string;
  value: string;
};

export const registrationFee = {
  currency: "GHS",
  display: "[GHS XXX]",
  amount: "0.00",
} as const;

export const masterclass = {
  brand: "DWO",
  name: "DWO Graphic Design Masterclass",
  tagline: "Premium creative education for aspiring graphic designers.",
  hero: {
    eyebrow: "DWO Graphic Design Masterclass",
    headline: "MASTER THE ART OF GRAPHIC DESIGN.",
    description:
      "A premium landing page foundation for the future DWO registration experience. Replace this placeholder copy with the final masterclass message when it is confirmed.",
    date: "[Masterclass Date Placeholder]",
    location: "[Masterclass Location Placeholder]",
    price: registrationFee.display,
    secondaryCta: "EXPLORE MASTERCLASS",
  },
  intro: {
    title: "A focused introduction to the masterclass",
    body:
      "Use this section to explain the purpose of the DWO Graphic Design Masterclass in the final content. This placeholder copy is intentionally neutral so it can be replaced without rewriting the page structure.",
    bodySecondary:
      "The layout is designed to communicate a premium creative education brand while keeping the copy clearly editable for future phases.",
  },
  navigation: [
    { label: "About", href: "#about" },
    { label: "What You'll Learn", href: "#learn" },
    { label: "Instructor", href: "#instructor" },
    { label: "FAQ", href: "#faq" },
  ] satisfies NavigationItem[],
  learningOutcomes: [
    {
      title: "Design Fundamentals",
      description: "Editable module placeholder for the core building blocks of visual design.",
    },
    {
      title: "Typography",
      description: "Editable module placeholder for type selection, hierarchy, and readability.",
    },
    {
      title: "Colour Theory",
      description: "Editable module placeholder for colour systems and visual mood.",
    },
    {
      title: "Composition",
      description: "Editable module placeholder for balance, spacing, and layout rhythm.",
    },
    {
      title: "Branding",
      description: "Editable module placeholder for identity thinking and visual consistency.",
    },
    {
      title: "Social Media Design",
      description: "Editable module placeholder for platform-ready creative assets.",
    },
    {
      title: "Professional Workflow",
      description: "Editable module placeholder for practical design process and delivery.",
    },
    {
      title: "Creative Direction",
      description: "Editable module placeholder for concept development and refinement.",
    },
  ] satisfies MasterclassListItem[],
  audience: [
    {
      title: "Beginners",
      description: "Placeholder audience note for participants starting from the basics.",
    },
    {
      title: "Aspiring Graphic Designers",
      description: "Placeholder audience note for learners building a creative path.",
    },
    {
      title: "Content Creators",
      description: "Placeholder audience note for creators improving visual output.",
    },
    {
      title: "Entrepreneurs",
      description: "Placeholder audience note for founders who need stronger branding.",
    },
    {
      title: "Students",
      description: "Placeholder audience note for students exploring design skills.",
    },
    {
      title: "Existing Designers",
      description: "Placeholder audience note for designers refining their approach.",
    },
  ] satisfies MasterclassListItem[],
  instructor: {
    sectionLabel: "About DWO",
    name: "[DWO Name Placeholder]",
    role: "[Instructor Role Placeholder]",
    bio: "[Short bio placeholder. Replace with the approved DWO biography when available.]",
    details: [
      "[Experience placeholder]",
      "[Credentials placeholder]",
      "[Additional background placeholder]",
    ],
    imageAlt: "Placeholder portrait for DWO",
  },
  details: [
    { label: "Date", value: "[Masterclass Date Placeholder]" },
    { label: "Time", value: "[Masterclass Time Placeholder]" },
    { label: "Location", value: "[Masterclass Location Placeholder]" },
    { label: "Duration", value: "[Masterclass Duration Placeholder]" },
    { label: "Registration Fee", value: registrationFee.display },
    { label: "Deadline", value: "[Registration Deadline Placeholder]" },
  ] satisfies MasterclassStat[],
  faqs: [
    {
      question: "Who can attend?",
      answer:
        "[Placeholder answer. Replace with the final attendance policy when it is confirmed.]",
    },
    {
      question: "Is this suitable for beginners?",
      answer:
        "[Placeholder answer. Replace with the final suitability guidance when it is confirmed.]",
    },
    {
      question: "What will I need for the masterclass?",
      answer:
        "[Placeholder answer. Replace with the final equipment or materials list when it is confirmed.]",
    },
    {
      question: "Where will the masterclass take place?",
      answer:
        "[Placeholder answer. Replace with the final venue details when it is confirmed.]",
    },
    {
      question: "How much is registration?",
      answer:
        "[Placeholder answer. Replace with the final pricing and payment details when it is confirmed.]",
    },
    {
      question: "How do I register?",
      answer:
        "[Placeholder answer. The registration workflow will be added in a later phase.]",
    },
    {
      question: "What happens after payment?",
      answer:
        "[Placeholder answer. Confirmation and payment processing will be introduced later.]",
    },
  ] satisfies MasterclassFaq[],
  footer: {
    description:
      "Premium creative education landing page foundation for the DWO Graphic Design Masterclass.",
    contact: "[Contact details placeholder]",
    social: "[Social media placeholder]",
  },
} as const;
