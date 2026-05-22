import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = siteConfig.seoTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "60px",
        fontFamily: "serif",
      }}
    >
      {/* Monogram */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: "60px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          border: "2px solid #c9a85c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#c9a85c",
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        {siteConfig.monogram}
      </div>

      {/* Decorative line */}
      <div
        style={{
          width: "60px",
          height: "3px",
          background: "#c9a85c",
          marginBottom: "24px",
        }}
      />

      {/* Studio name */}
      <div
        style={{
          fontSize: "20px",
          color: "#c9a85c",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}
      >
        {siteConfig.studioNameShort}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: "52px",
          fontWeight: "700",
          color: "#ffffff",
          lineHeight: 1.1,
          marginBottom: "20px",
          maxWidth: "800px",
        }}
      >
        {siteConfig.drName}
      </div>

      {/* Tagline */}
      <div
        style={{
          fontSize: "22px",
          color: "rgba(255,255,255,0.7)",
          maxWidth: "700px",
        }}
      >
        {siteConfig.taglineShort}
      </div>

      {/* Location */}
      <div
        style={{
          marginTop: "32px",
          fontSize: "16px",
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.05em",
        }}
      >
        {siteConfig.city}, {siteConfig.province}
      </div>
    </div>,
    { ...size }
  );
}
