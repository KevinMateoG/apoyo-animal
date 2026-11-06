"use client";

import { useCallback, useEffect, useState } from "react";
import type { SponsorshipRecord } from "../domain/sponsorship";
import { getMySponsorships } from "../services/sponsorship.service";

export function useMySponsorships(enabled: boolean) {
  const [sponsorships, setSponsorships] = useState<SponsorshipRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMySponsorships();
      setSponsorships(data);
    } catch {
      setError("No se pudieron cargar tus apadrinamientos.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(async () => {
        if (!enabled) {
          if (active) setIsLoading(false);
          return;
        }
        const data = await getMySponsorships();
        if (active) {
          setSponsorships(data);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError("No se pudieron cargar tus apadrinamientos.");
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
  }, [enabled]);

  return {
    sponsorships,
    isLoading,
    error,
    reload,
  };
}

