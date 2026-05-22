import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { db } from "@/lib/db";
import { blogPosts } from "@/lib/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { BlogPostForm } from "@/components/admin/blog-post-form";

export const metadata: Metadata = {
  title: "Editar artículo — Admin Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogEditarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch directo a DB (admin — no usa la server action pública que filtra published)
  const [post] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, slug), isNull(blogPosts.deletedAt)))
    .limit(1);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 font-ui text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-marino)] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--color-dorado)] focus-visible:outline-offset-2 focus-visible:rounded-[4px]"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Volver al blog
        </Link>
        <span className="text-[var(--color-border-strong)]" aria-hidden="true">
          /
        </span>
        <h1
          className="font-serif text-2xl font-semibold text-[var(--color-marino)] truncate"
          title={post.title}
        >
          {post.title}
        </h1>
      </div>

      {/* Form con datos del post */}
      <BlogPostForm post={post} />
    </div>
  );
}
