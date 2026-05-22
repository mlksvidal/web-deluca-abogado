import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { BlogPostForm } from "@/components/admin/blog-post-form";

export const metadata: Metadata = {
  title: "Nuevo artículo — Admin Blog",
  robots: { index: false, follow: false },
};

export default function AdminBlogNuevoPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 font-ui text-sm text-text-secondary hover:text-marino transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2 focus-visible:rounded-[4px]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Volver al blog
        </Link>
        <span className="text-border-strong" aria-hidden="true">
          /
        </span>
        <h1 className="font-serif text-2xl font-semibold text-marino">Nuevo artículo</h1>
      </div>

      {/* Form */}
      <BlogPostForm />
    </div>
  );
}
