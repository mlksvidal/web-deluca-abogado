"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogPaginationProps = {
  page: number;
  total: number;
  pageSize: number;
};

export function BlogPagination({ page, total, pageSize }: BlogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p === 1) {
      params.delete("page");
    } else {
      params.set("page", String(p));
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Paginación del blog" className="flex items-center justify-center gap-1 mt-10">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-[6px]",
          "font-ui text-sm",
          "border border-border-default",
          "transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2",
          page === 1
            ? "opacity-40 cursor-not-allowed bg-transparent text-text-tertiary"
            : "bg-bg text-carbon-soft hover:border-marino hover:text-marino"
        )}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          aria-label={`Ir a la página ${p}`}
          aria-current={p === page ? "page" : undefined}
          className={cn(
            "inline-flex items-center justify-center w-9 h-9 rounded-[6px]",
            "font-ui text-sm font-medium",
            "border transition-colors duration-150",
            "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2",
            p === page
              ? "bg-marino text-bg border-marino"
              : "bg-bg text-carbon-soft border-border-default hover:border-marino hover:text-marino"
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        className={cn(
          "inline-flex items-center justify-center w-9 h-9 rounded-[6px]",
          "font-ui text-sm",
          "border border-border-default",
          "transition-colors duration-150",
          "focus-visible:outline-2 focus-visible:outline-dorado focus-visible:outline-offset-2",
          page === totalPages
            ? "opacity-40 cursor-not-allowed bg-transparent text-text-tertiary"
            : "bg-bg text-carbon-soft hover:border-marino hover:text-marino"
        )}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  );
}
