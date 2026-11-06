"use client";

import type { ReactNode } from "react";
import Pagination from "@/src/features/common/components/Pagination";
import { useAnimalFilter } from "../hooks/useAnimalFilter";
import AnimalCard from "./AnimalCard";

interface CatalogBrowserProps {
  children: ReactNode;
}

export default function CatalogBrowser({ children }: CatalogBrowserProps) {
  const {
    filter,
    setFilter,
    filters,
    visibleAnimals,
    pagination,
    setPage,
    isLoading,
    error,
    reload,
  } = useAnimalFilter();

  return (
    <>
      <section className="mx-auto max-w-[var(--max-w)] border-b border-[var(--clr-border)] px-[var(--space-lg)] pb-[var(--space-xl)] pt-[var(--space-3xl)]">
        <div className="max-w-[42rem]">{children}</div>

        <div className="mt-[var(--space-xl)] flex flex-wrap items-center gap-[var(--space-sm)] border-t border-[var(--clr-border)] pt-[var(--space-lg)]">
          <div
            role="group"
            aria-label="Filtrar por especie"
            className="flex flex-wrap gap-[var(--space-xs)]"
          >
            {filters.map(({ value, label }) => {
              const isActive = filter === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(value)}
                  className={`cursor-pointer rounded-[var(--radius-full)] border px-[0.85rem] py-[0.45rem] text-[0.75rem] font-medium [transition:background_var(--transition),border-color_var(--transition),color_var(--transition)] ${
                    isActive
                      ? "border-[var(--clr-primary)] bg-[var(--clr-primary)] text-[var(--clr-primary-text)]"
                      : "border-[var(--clr-border)] bg-[var(--clr-surface-white)] text-[var(--clr-text-secondary)] hover:border-[var(--clr-text-secondary)] hover:text-[var(--clr-text)]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)] pt-[var(--space-xl)]">
        {isLoading ? (
          <div
            role="status"
            className="rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-2xl)] text-center text-[0.9rem] text-[var(--clr-text-secondary)]"
          >
            Cargando ejemplares desde la reserva...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-[var(--space-md)] rounded-[var(--radius-xl)] border border-[#b91c1c]/40 bg-[#b91c1c]/10 p-[var(--space-2xl)] text-center text-[0.9rem] text-[#b91c1c]"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => void reload()}
              className="cursor-pointer rounded-[var(--radius)] border border-[#b91c1c] px-4 py-2 text-[0.8rem] font-medium hover:bg-[#b91c1c]/10"
            >
              Reintentar
            </button>
          </div>
        ) : visibleAnimals.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-2xl)] text-center text-[0.9rem] text-[var(--clr-text-secondary)]">
            No se encontraron ejemplares disponibles para este filtro.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-[var(--space-xl)] sm:grid-cols-2 lg:grid-cols-3">
              {visibleAnimals.map((animal) => (
                <AnimalCard key={animal.id} animal={animal} />
              ))}
            </div>

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
}
