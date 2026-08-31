"use client";

import { useEffect } from "react";

import { captureMarketingAttribution } from "@/lib/marketing-attribution.client";

export function AttributionCapture() {
  useEffect(() => {
    captureMarketingAttribution();
  }, []);

  return null;
}
