"use client";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  onPageChange: (nextPage: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1 && (totalItems === undefined || totalItems === 0)) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Paginación del catálogo"
      className="mt-[var(--space-2xl)] flex flex-wrap items-center justify-between gap-[var(--space-md)] border-t border-[var(--clr-border)] pt-[var(--space-lg)]"
    >
      <p className="text-[0.8rem] text-[var(--clr-text-muted)]">
        Página <strong className="text-[var(--clr-text)]">{page}</strong> de{" "}
        <strong className="text-[var(--clr-text)]">{totalPages}</strong>
        {totalItems !== undefined ? ` (${totalItems} ejemplares)` : ""}
      </p>

      <div className="flex items-center gap-[var(--space-xs)]">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] px-3 py-1.5 text-[0.8rem] text-[var(--clr-text-secondary)] [transition:border-color_var(--transition),color_var(--transition)] hover:border-[var(--clr-text-secondary)] hover:text-[var(--clr-text)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        {pages.map((pageNumber) => {
          const isCurrent = pageNumber === page;
          return (
            <button
              key={pageNumber}
              type="button"
              aria-current={isCurrent ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={`min-w-8 cursor-pointer rounded-[var(--radius)] border px-2.5 py-1.5 text-[0.8rem] font-medium [transition:background_var(--transition),border-color_var(--transition),color_var(--transition)] ${
                isCurrent
                  ? "border-[var(--clr-primary)] bg-[var(--clr-primary)] text-[var(--clr-primary-text)]"
                  : "border-[var(--clr-border)] bg-[var(--clr-surface-white)] text-[var(--clr-text-secondary)] hover:border-[var(--clr-text-secondary)] hover:text-[var(--clr-text)]"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] px-3 py-1.5 text-[0.8rem] text-[var(--clr-text-secondary)] [transition:border-color_var(--transition),color_var(--transition)] hover:border-[var(--clr-text-secondary)] hover:text-[var(--clr-text)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </nav>
  );
}

