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
  SelectedWork,
  StudentSuccess,
} from "@/components/sections";
import { StructuredData } from "@/components/seo/StructuredData";
import { createHomeMetadata } from "@/lib/seo";

export const metadata: Metadata = createHomeMetadata();

export default function Home() {
  return (
    <main className="bg-background">
      <StructuredData pathname="/" />
      <Header />
      <Hero />
      <AboutMasterclass />
      <LearningOutcomes />
      <Audience />
      <Instructor />
      <StudentSuccess />
      <SelectedWork />
      <MasterclassDetails />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
