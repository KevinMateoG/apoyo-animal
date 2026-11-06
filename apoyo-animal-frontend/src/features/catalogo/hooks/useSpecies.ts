"use client";

import { useCallback, useEffect, useState } from "react";
import type { Species } from "../domain/species";
import { getSpecies } from "../services/species.service";

export function useSpecies() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSpecies();
      setSpecies(data);
    } catch {
      setError("No se pudieron cargar las especies desde el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getSpecies()
      .then((data) => {
        if (active) {
          setSpecies(data);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar las especies desde el servidor.");
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
  }, []);

  return {
    species,
    isLoading,
    error,
    reload,
  };
}

