import { ImageResponse } from "next/og";

import { masterclass } from "@/lib/masterclass";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0505",
          color: "#f4b942",
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: "-0.06em",
        }}
      >
        {masterclass.brand}
      </div>
    ),
    size,
  );
}
