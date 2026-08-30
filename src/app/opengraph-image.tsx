import { ImageResponse } from "next/og";

import { masterclass } from "@/lib/masterclass";
import { seoDescription, seoTitle } from "@/lib/seo";

export const alt = `${masterclass.name} — graphic design course in Ghana`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(145deg, #0a0505 0%, #130d0d 45%, #2a1010 100%)",
          color: "#f5f0e6",
          padding: "64px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#f4b942",
          }}
        >
          {masterclass.brand} · {masterclass.brandFull}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              maxWidth: "980px",
            }}
          >
            {seoTitle.replace(" | DWO Masterclass 2026", "")}
          </div>
          <div
            style={{
              fontSize: 30,
              lineHeight: 1.4,
              color: "#b8aa9a",
              maxWidth: "920px",
            }}
          >
            {seoDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 28,
            color: "#f4b942",
          }}
        >
          <span>{masterclass.coursePeriod.display}</span>
          <span>{masterclass.price.display}</span>
        </div>
      </div>
    ),
    size,
  );
}
