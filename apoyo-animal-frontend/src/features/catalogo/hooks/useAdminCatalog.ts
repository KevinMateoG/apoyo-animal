"use client";

import { useCallback, useEffect, useState } from "react";
import type { SponsorshipRecord } from "@/src/features/interaccion/domain/sponsorship";
import {
  getAllSponsorships,
  updateSponsorshipStatus,
} from "@/src/features/interaccion/services/sponsorship.service";
import type { Animal } from "../domain/animal";
import type { Species } from "../domain/species";
import {
  createAnimal,
  deleteAnimal,
  getAnimals,
  type UpsertAnimalPayload,
  updateAnimal,
} from "../services/animal.service";
import {
  createSpecies,
  deleteSpecies,
  getSpecies,
  type UpsertSpeciesPayload,
  updateSpecies,
} from "../services/species.service";

export function useAdminCatalog(enabled: boolean) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [species, setSpecies] = useState<Species[]>([]);
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
      const [animalsData, speciesData, sponsorshipsData] = await Promise.all([
        getAnimals(),
        getSpecies(),
        getAllSponsorships(),
      ]);
      setAnimals(animalsData);
      setSpecies(speciesData);
      setSponsorships(sponsorshipsData);
    } catch {
      setError("No se pudo cargar la información del panel de administración.");
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
        const [animalsData, speciesData, sponsorshipsData] = await Promise.all([
          getAnimals(),
          getSpecies(),
          getAllSponsorships(),
        ]);
        if (active) {
          setAnimals(animalsData);
          setSpecies(speciesData);
          setSponsorships(sponsorshipsData);
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "No se pudo cargar la información del panel de administración.",
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
  }, [enabled]);

  const handleCreateAnimal = async (payload: UpsertAnimalPayload) => {
    await createAnimal(payload);
    await reload();
  };

  const handleUpdateAnimal = async (
    id: string,
    payload: Partial<UpsertAnimalPayload>,
  ) => {
    await updateAnimal(id, payload);
    await reload();
  };

  const handleDeleteAnimal = async (id: string) => {
    await deleteAnimal(id);
    await reload();
  };

  const handleCreateSpecies = async (payload: UpsertSpeciesPayload) => {
    await createSpecies(payload);
    await reload();
  };

  const handleUpdateSpecies = async (
    id: string,
    payload: Partial<UpsertSpeciesPayload>,
  ) => {
    await updateSpecies(id, payload);
    await reload();
  };

  const handleDeleteSpecies = async (id: string) => {
    await deleteSpecies(id);
    await reload();
  };

  const handleStatusChange = async (
    id: string,
    status: "PENDING" | "CONFIRMED" | "CANCELLED",
  ) => {
    await updateSponsorshipStatus(id, status);
    await reload();
  };

  return {
    animals,
    species,
    sponsorships,
    isLoading,
    error,
    reload,
    handleCreateAnimal,
    handleUpdateAnimal,
    handleDeleteAnimal,
    handleCreateSpecies,
    handleUpdateSpecies,
    handleDeleteSpecies,
    handleStatusChange,
  };
}

