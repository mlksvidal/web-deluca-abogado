import { ImageResponse } from "next/og";
import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { siteConfig } from "@/lib/site-config";

export const runtime = "edge";
export const alt = "Artículo del blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title: string = siteConfig.seoTitle;
  let excerpt: string = siteConfig.taglineShort;

  try {
    const [post] = await db
      .select({ title: blogPosts.title, excerpt: blogPosts.excerpt })
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);

    if (post) {
      title = post.title;
      excerpt = post.excerpt.slice(0, 120);
    }
  } catch {
    // Fallback graceful si DB no disponible
  }

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
      {/* Badge */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "60px",
          background: "rgba(201, 168, 92, 0.15)",
          border: "1px solid #c9a85c",
          borderRadius: "4px",
          padding: "6px 16px",
          color: "#c9a85c",
          fontSize: "14px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Blog Jurídico
      </div>

      {/* Monogram */}
      <div
        style={{
          position: "absolute",
          top: "50px",
          right: "60px",
          color: "rgba(201, 168, 92, 0.5)",
          fontSize: "32px",
          fontWeight: "700",
          letterSpacing: "0.1em",
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

      {/* Post title */}
      <div
        style={{
          fontSize: "44px",
          fontWeight: "700",
          color: "#ffffff",
          lineHeight: 1.15,
          marginBottom: "20px",
          maxWidth: "900px",
        }}
      >
        {title}
      </div>

      {/* Excerpt */}
      <div
        style={{
          fontSize: "20px",
          color: "rgba(255,255,255,0.65)",
          maxWidth: "800px",
          lineHeight: 1.4,
        }}
      >
        {excerpt}
      </div>

      {/* Author */}
      <div
        style={{
          marginTop: "32px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "#c9a85c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1a1a2e",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          PD
        </div>
        <div
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {siteConfig.drName} · {siteConfig.city}, {siteConfig.province}
        </div>
      </div>
    </div>,
    { ...size }
  );
}
