import { ImageResponse } from "next/og";

import { masterclass } from "@/lib/masterclass";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          fontSize: 160,
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
