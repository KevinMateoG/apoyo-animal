export type AnimalGender = "Macho" | "Hembra";
export type AnimalFilter = string;

export interface Animal {
  id: string;
  name: string;
  typeAnimal: string;
  speciesId?: string;
  age: number;
  gender: AnimalGender;
  description: string;
  imageUrl?: string;
}

export interface AnimalFilterOption {
  value: AnimalFilter;
  label: string;
}

const DEFAULT_SPECIES_META: Record<
  string,
  { category: string; label: string; image: string }
> = {
  "tejon melero": {
    category: "tejon",
    label: "Tejon de la miel",
    image: "/tejon-melero.jpg",
  },
  "león marino": {
    category: "seal-lion",
    label: "Leon marino",
    image: "/sea-lion.png",
  },
  "leon marino": {
    category: "seal-lion",
    label: "Leon marino",
    image: "/sea-lion.png",
  },
  "panda rojo": {
    category: "red-panda",
    label: "Panda rojo",
    image: "/panda-rojo.jpg",
  },
};

const BASE_FILTERS: AnimalFilterOption[] = [
  { value: "all", label: "Todos" },
  { value: "tejon", label: "Tejon de la miel" },
  { value: "seal-lion", label: "Leon marino" },
  { value: "red-panda", label: "Panda rojo" },
];

export const toSlug = (text: string) =>
  text.trim().toLowerCase().replace(/\s+/g, "-");

export const toAnimalId = toSlug;

export function getAnimalImage(animal: Animal): string {
  if (animal.imageUrl) return animal.imageUrl;
  const meta = DEFAULT_SPECIES_META[animal.typeAnimal.toLowerCase()];
  return meta?.image ?? "/logo.png";
}

export function getAnimalCategory(animal: Animal): string {
  if (animal.speciesId) return animal.speciesId;
  const meta = DEFAULT_SPECIES_META[animal.typeAnimal.toLowerCase()];
  return meta?.category ?? toSlug(animal.typeAnimal);
}

/** Construye los filtros del catálogo incluyendo cualquier especie nueva que venga de la BD. */
export function buildAnimalFilters(animals: Animal[]): AnimalFilterOption[] {
  const filters = [...BASE_FILTERS];
  const seen = new Set(filters.map((f) => f.value));

  for (const animal of animals) {
    const category = getAnimalCategory(animal);
    if (!seen.has(category)) {
      seen.add(category);
      const meta = DEFAULT_SPECIES_META[animal.typeAnimal.toLowerCase()];
      filters.push({
        value: category,
        label: meta?.label ?? animal.typeAnimal,
      });
    }
  }

  return filters;
}

export function filterAnimals(animals: Animal[], filter: AnimalFilter): Animal[] {
  if (filter === "all") return animals;
  return animals.filter((animal) => getAnimalCategory(animal) === filter);
}

