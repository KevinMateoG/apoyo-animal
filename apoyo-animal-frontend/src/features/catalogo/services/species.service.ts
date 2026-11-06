import { http } from "@/src/features/common/http";
import type { Species } from "../domain/species";

export interface ApiSpecies {
  id: string;
  scientificName: string;
  commonName: string;
  description: string;
  morphology: string;
  habitat: string;
  diet: string;
  imageUrl: string;
  catalogLinkLabel: string | null;
  isVisible: boolean;
}

export interface UpsertSpeciesPayload {
  scientificName: string;
  commonName: string;
  description: string;
  morphology: string;
  habitat: string;
  diet: string;
  imageUrl: string;
  catalogLinkLabel?: string | null;
  isVisible?: boolean;
}

function mapApiSpeciesToDomain(item: ApiSpecies): Species {
  return {
    id: item.id,
    scientificName: item.scientificName,
    usualName: item.commonName,
    description: item.description,
    dataMorphology: item.morphology,
    dataHabitat: item.habitat,
    dataDiet: item.diet,
    imageUrl: item.imageUrl,
    catalogLinkLabel: item.catalogLinkLabel ?? undefined,
  };
}

export async function getSpecies(): Promise<Species[]> {
  const response = await http<{ data: ApiSpecies[] }>("/api/species", {
    method: "GET",
  });
  return response.data.map(mapApiSpeciesToDomain);
}

export async function createSpecies(
  payload: UpsertSpeciesPayload,
): Promise<Species> {
  const response = await http<{ data: ApiSpecies }>("/api/species", {
    method: "POST",
    body: payload,
  });
  return mapApiSpeciesToDomain(response.data);
}

export async function updateSpecies(
  id: string,
  payload: Partial<UpsertSpeciesPayload>,
): Promise<Species> {
  const response = await http<{ data: ApiSpecies }>(`/api/species/${id}`, {
    method: "PUT",
    body: payload,
  });
  return mapApiSpeciesToDomain(response.data);
}

export async function deleteSpecies(id: string): Promise<void> {
  await http<void>(`/api/species/${id}`, {
    method: "DELETE",
  });
}

