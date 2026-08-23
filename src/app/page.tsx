import type { Metadata } from "next";

import { Footer, Header } from "@/components/layout";
import {
  AboutMasterclass,
  Audience,
  FAQ,
  FinalCTA,
  Hero,
  Instructor,
  LearningOutcomes,
  MasterclassDetails,
} from "@/components/sections";
import { masterclass } from "@/lib/masterclass";

export const metadata: Metadata = {
  title: masterclass.name,
  description:
    "Premium black-and-white landing page for the DWO Graphic Design Masterclass.",
  openGraph: {
    title: masterclass.name,
    description:
      "Premium black-and-white landing page for the DWO Graphic Design Masterclass.",
    type: "website",
  },
};

export default function Home() {
  return (
    <main className="bg-background">
      <Header />
      <Hero />
      <AboutMasterclass />
      <LearningOutcomes />
      <Audience />
      <Instructor />
      <MasterclassDetails />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}