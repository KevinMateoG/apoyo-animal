import { http } from "@/src/features/common/http";
import type { Animal } from "../domain/animal";

export interface ApiAnimalSpeciesSummary {
  id: string;
  scientificName: string;
  commonName: string;
  imageUrl: string;
}

export interface ApiAnimal {
  id: string;
  name: string;
  speciesId: string;
  sex: "MALE" | "FEMALE";
  birthDate: string | null;
  ageYears: number | null;
  description: string;
  imageUrl: string | null;
  status: "ACTIVE" | "INACTIVE";
  isAvailableForSponsorship: boolean;
  species?: ApiAnimalSpeciesSummary;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedAnimals {
  pagination: PaginationMeta;
  data: Animal[];
}

export interface UpsertAnimalPayload {
  name: string;
  speciesId: string;
  sex: "MALE" | "FEMALE";
  ageYears?: number;
  description: string;
  imageUrl?: string | null;
  status?: "ACTIVE" | "INACTIVE";
  isAvailableForSponsorship?: boolean;
}

function mapApiAnimalToDomain(item: ApiAnimal): Animal {
  return {
    id: item.id,
    name: item.name,
    typeAnimal: (item.species?.commonName ?? "Especie").toLowerCase(),
    speciesId: item.speciesId,
    age: item.ageYears ?? 1,
    gender: item.sex === "MALE" ? "Macho" : "Hembra",
    description: item.description,
    imageUrl: item.imageUrl ?? item.species?.imageUrl ?? undefined,
  };
}

export async function getAnimalsPage(params: {
  page?: number;
  pageSize?: number;
  speciesId?: string;
} = {}): Promise<PaginatedAnimals> {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? 6));
  if (params.speciesId && params.speciesId !== "all") {
    query.set("speciesId", params.speciesId);
  }

  const response = await http<{
    pagination: PaginationMeta;
    data: ApiAnimal[];
  }>(`/api/animals?${query.toString()}`, {
    method: "GET",
  });

  return {
    pagination: response.pagination,
    data: response.data.map(mapApiAnimalToDomain),
  };
}

export async function getAnimals(): Promise<Animal[]> {
  const result = await getAnimalsPage({ page: 1, pageSize: 12 });
  return result.data;
}

export async function createAnimal(
  payload: UpsertAnimalPayload,
): Promise<Animal> {
  const response = await http<{ data: ApiAnimal }>("/api/animals", {
    method: "POST",
    body: payload,
  });
  return mapApiAnimalToDomain(response.data);
}

export async function updateAnimal(
  id: string,
  payload: Partial<UpsertAnimalPayload>,
): Promise<Animal> {
  const response = await http<{ data: ApiAnimal }>(`/api/animals/${id}`, {
    method: "PUT",
    body: payload,
  });
  return mapApiAnimalToDomain(response.data);
}

export async function deleteAnimal(id: string): Promise<void> {
  await http<void>(`/api/animals/${id}`, {
    method: "DELETE",
  });
}
