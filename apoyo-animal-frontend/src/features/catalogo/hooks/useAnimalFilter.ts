"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Animal, AnimalFilterOption } from "../domain/animal";
import {
  getAnimalsPage,
  type PaginationMeta,
} from "../services/animal.service";
import { getSpecies } from "../services/species.service";

const CATALOG_PAGE_SIZE = 6;

export function useAnimalFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawPage = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;
  const currentSpeciesId = searchParams.get("speciesId") ?? "all";

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: currentPage,
    pageSize: CATALOG_PAGE_SIZE,
    totalItems: 0,
    totalPages: 1,
  });
  const [speciesFilters, setSpeciesFilters] = useState<AnimalFilterOption[]>([
    { value: "all", label: "Todos" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getSpecies()
      .then((speciesList) => {
        if (!active) return;
        setSpeciesFilters([
          { value: "all", label: "Todos" },
          ...speciesList.map((item) => ({
            value: item.id,
            label: item.usualName,
          })),
        ]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAnimalsPage({
        page: currentPage,
        pageSize: CATALOG_PAGE_SIZE,
        speciesId: currentSpeciesId !== "all" ? currentSpeciesId : undefined,
      });
      setAnimals(response.data);
      setPagination(response.pagination);
    } catch {
      setError(
        "No pudimos cargar el catálogo de ejemplares. Verifica tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, currentSpeciesId]);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(() => {
        if (active) {
          setIsLoading(true);
          setError(null);
        }
        return getAnimalsPage({
          page: currentPage,
          pageSize: CATALOG_PAGE_SIZE,
          speciesId: currentSpeciesId !== "all" ? currentSpeciesId : undefined,
        });
      })
      .then((response) => {
        if (active) {
          setAnimals(response.data);
          setPagination(response.pagination);
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "No pudimos cargar el catálogo de ejemplares. Verifica tu conexión e inténtalo de nuevo.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [currentPage, currentSpeciesId]);

  const updateUrl = useCallback(
    (nextPage: number, nextSpeciesId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (nextPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(nextPage));
      }

      if (!nextSpeciesId || nextSpeciesId === "all") {
        params.delete("speciesId");
      } else {
        params.set("speciesId", nextSpeciesId);
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const setFilter = useCallback(
    (nextSpeciesId: string) => {
      updateUrl(1, nextSpeciesId);
    },
    [updateUrl],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      updateUrl(nextPage, currentSpeciesId);
    },
    [currentSpeciesId, updateUrl],
  );

  return useMemo(
    () => ({
      filter: currentSpeciesId,
      setFilter,
      filters: speciesFilters,
      visibleAnimals: animals,
      pagination,
      setPage,
      isLoading,
      error,
      reload: loadCatalog,
    }),
    [
      currentSpeciesId,
      setFilter,
      speciesFilters,
      animals,
      pagination,
      setPage,
      isLoading,
      error,
      loadCatalog,
    ],
  );
}
