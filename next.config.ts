import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Source maps off en producción (seguridad — evitar exponer código fuente)
  productionBrowserSourceMaps: false,

  // Compresión gzip en respuestas
  compress: true,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  // Headers de seguridad base (headers completos van en vercel.json)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-DNS-Prefetch-Control", value: "on" }],
      },
    ];
  },
};

// Bundle analyzer — solo cuando ANALYZE=true (npm run analyze)
// Usamos require para compatibilidad con el target ES2017 del tsconfig
const configWithAnalyzer =
  process.env.ANALYZE === "true"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("@next/bundle-analyzer")({ enabled: true })(nextConfig)
    : nextConfig;

export default configWithAnalyzer;
