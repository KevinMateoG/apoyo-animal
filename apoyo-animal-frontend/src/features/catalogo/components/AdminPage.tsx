"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { Button } from "@/src/features/common/components/Button";
import {
  HeroDescription,
  HeroTitle,
  SectionEyebrow,
  SectionTitle,
} from "@/src/features/common/components/Headings";
import Input from "@/src/features/common/components/Input";
import SiteFooter from "@/src/features/common/components/SiteFooter";
import { HttpError } from "@/src/features/common/http";
import { type Animal, getAnimalImage } from "../domain/animal";
import type { Species } from "../domain/species";
import { useAdminCatalog } from "../hooks/useAdminCatalog";
import { uploadCatalogImage } from "../services/upload.service";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const {
    animals,
    species,
    sponsorships,
    isLoading,
    error,
    handleCreateAnimal,
    handleUpdateAnimal,
    handleDeleteAnimal,
    handleCreateSpecies,
    handleUpdateSpecies,
    handleDeleteSpecies,
    handleStatusChange,
  } = useAdminCatalog(isAuthenticated && isAdmin);

  const [activeTab, setActiveTab] = useState<"animals" | "species">("animals");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [speciesId, setSpeciesId] = useState("");
  const [sex, setSex] = useState<"MALE" | "FEMALE">("FEMALE");
  const [ageYears, setAgeYears] = useState("2");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [animalFile, setAnimalFile] = useState<File | null>(null);
  const [animalPreview, setAnimalPreview] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const [editingSpeciesId, setEditingSpeciesId] = useState<string | null>(null);
  const [scientificName, setScientificName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [speciesDescription, setSpeciesDescription] = useState("");
  const [morphology, setMorphology] = useState("");
  const [habitat, setHabitat] = useState("");
  const [diet, setDiet] = useState("");
  const [catalogLinkLabel, setCatalogLinkLabel] = useState("");
  const [speciesImageUrl, setSpeciesImageUrl] = useState("");
  const [speciesFile, setSpeciesFile] = useState<File | null>(null);
  const [speciesPreview, setSpeciesPreview] = useState<string | null>(null);
  const [speciesErrors, setSpeciesErrors] = useState<Record<string, string>>(
    {},
  );
  const [speciesMessage, setSpeciesMessage] = useState<string | null>(null);
  const [isSavingSpecies, setIsSavingSpecies] = useState(false);
  const [confirmDeleteSpeciesId, setConfirmDeleteSpeciesId] = useState<
    string | null
  >(null);

  const selectedSpeciesId = speciesId || species[0]?.id || "";

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (!isAdmin) {
        router.replace("/");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <main className="grow">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)] py-[var(--space-3xl)] text-[0.9rem] text-[var(--clr-text-secondary)]">
          Verificando permisos de administrador...
        </div>
      </main>
    );
  }

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSpeciesId(species[0]?.id ?? "");
    setSex("FEMALE");
    setAgeYears("2");
    setDescription("");
    setImageUrl("");
    setAnimalFile(null);
    setAnimalPreview(null);
    setFieldErrors({});
  };

  const resetSpeciesForm = () => {
    setEditingSpeciesId(null);
    setScientificName("");
    setCommonName("");
    setSpeciesDescription("");
    setMorphology("");
    setHabitat("");
    setDiet("");
    setCatalogLinkLabel("");
    setSpeciesImageUrl("");
    setSpeciesFile(null);
    setSpeciesPreview(null);
    setSpeciesErrors({});
  };

  const startEdit = (animal: Animal) => {
    setEditingId(animal.id);
    setName(animal.name);
    setSpeciesId(animal.speciesId ?? species[0]?.id ?? "");
    setSex(animal.gender === "Macho" ? "MALE" : "FEMALE");
    setAgeYears(String(animal.age));
    setDescription(animal.description);
    setImageUrl(animal.imageUrl ?? "");
    setAnimalFile(null);
    setAnimalPreview(animal.imageUrl ?? null);
    setFieldErrors({});
    setFormMessage(null);
  };

  const startEditSpecies = (item: Species) => {
    setEditingSpeciesId(item.id);
    setScientificName(item.scientificName);
    setCommonName(item.usualName);
    setSpeciesDescription(item.description);
    setMorphology(item.dataMorphology);
    setHabitat(item.dataHabitat);
    setDiet(item.dataDiet);
    setCatalogLinkLabel(item.catalogLinkLabel ?? "");
    setSpeciesImageUrl(item.imageUrl);
    setSpeciesFile(null);
    setSpeciesPreview(item.imageUrl);
    setSpeciesErrors({});
    setSpeciesMessage(null);
  };

  const onSelectAnimalFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAnimalFile(file);
    if (file) {
      setAnimalPreview(URL.createObjectURL(file));
    }
  };

  const onSelectSpeciesFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSpeciesFile(file);
    if (file) {
      setSpeciesPreview(URL.createObjectURL(file));
    }
  };

  const onSubmitAnimal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(null);

    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "El nombre es obligatorio.";
    if (!selectedSpeciesId) nextErrors.speciesId = "Selecciona una especie.";
    if (!description.trim()) {
      nextErrors.description = "La descripción es obligatoria.";
    }
    const parsedAge = Number(ageYears);
    if (!Number.isInteger(parsedAge) || parsedAge < 0 || parsedAge > 100) {
      nextErrors.ageYears = "La edad debe ser un entero entre 0 y 100.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setIsSaving(true);

    try {
      let resolvedImageUrl = imageUrl.trim() || undefined;
      if (animalFile) {
        resolvedImageUrl = await uploadCatalogImage(animalFile, "animals");
      }

      const payload = {
        name: name.trim(),
        speciesId: selectedSpeciesId,
        sex,
        ageYears: parsedAge,
        description: description.trim(),
        imageUrl: resolvedImageUrl,
      };

      if (editingId) {
        await handleUpdateAnimal(editingId, payload);
        setFormMessage("Ejemplar actualizado correctamente.");
      } else {
        await handleCreateAnimal(payload);
        setFormMessage("Ejemplar creado correctamente.");
      }
      resetForm();
    } catch (err) {
      if (err instanceof HttpError && err.details) {
        setFieldErrors({
          name: err.details.name?.[0] ?? "",
          speciesId: err.details.speciesId?.[0] ?? "",
          description: err.details.description?.[0] ?? "",
          ageYears: err.details.ageYears?.[0] ?? "",
          imageUrl: err.details.file?.[0] ?? err.details.imageUrl?.[0] ?? "",
        });
      }
      setFormMessage(
        err instanceof HttpError
          ? err.message
          : "No se pudo guardar el ejemplar.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitSpecies = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSpeciesMessage(null);

    const nextErrors: Record<string, string> = {};
    if (!scientificName.trim()) {
      nextErrors.scientificName = "El nombre científico es obligatorio.";
    }
    if (!commonName.trim()) {
      nextErrors.commonName = "El nombre común es obligatorio.";
    }
    if (!speciesDescription.trim()) {
      nextErrors.description = "La descripción es obligatoria.";
    }
    if (!morphology.trim()) {
      nextErrors.morphology = "La morfología es obligatoria.";
    }
    if (!habitat.trim()) {
      nextErrors.habitat = "El hábitat es obligatorio.";
    }
    if (!diet.trim()) {
      nextErrors.diet = "La dieta es obligatoria.";
    }
    if (!speciesFile && !speciesImageUrl.trim()) {
      nextErrors.imageUrl =
        "Selecciona un archivo de imagen o ingresa una URL.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setSpeciesErrors(nextErrors);
      return;
    }

    setSpeciesErrors({});
    setIsSavingSpecies(true);

    try {
      let resolvedUrl = speciesImageUrl.trim();
      if (speciesFile) {
        resolvedUrl = await uploadCatalogImage(speciesFile, "species");
      }

      const payload = {
        scientificName: scientificName.trim(),
        commonName: commonName.trim(),
        description: speciesDescription.trim(),
        morphology: morphology.trim(),
        habitat: habitat.trim(),
        diet: diet.trim(),
        imageUrl: resolvedUrl,
        catalogLinkLabel: catalogLinkLabel.trim() || null,
      };

      if (editingSpeciesId) {
        await handleUpdateSpecies(editingSpeciesId, payload);
        setSpeciesMessage("Especie actualizada correctamente.");
      } else {
        await handleCreateSpecies(payload);
        setSpeciesMessage("Especie creada correctamente en Cloudflare R2.");
      }
      resetSpeciesForm();
    } catch (err) {
      if (err instanceof HttpError && err.details) {
        setSpeciesErrors({
          scientificName: err.details.scientificName?.[0] ?? "",
          commonName: err.details.commonName?.[0] ?? "",
          description: err.details.description?.[0] ?? "",
          morphology: err.details.morphology?.[0] ?? "",
          habitat: err.details.habitat?.[0] ?? "",
          diet: err.details.diet?.[0] ?? "",
          imageUrl: err.details.file?.[0] ?? err.details.imageUrl?.[0] ?? "",
        });
      }
      setSpeciesMessage(
        err instanceof HttpError
          ? err.message
          : "No se pudo guardar la especie.",
      );
    } finally {
      setIsSavingSpecies(false);
    }
  };

  const onConfirmDelete = async (id: string) => {
    try {
      await handleDeleteAnimal(id);
      setConfirmDeleteId(null);
    } catch (err) {
      setFormMessage(
        err instanceof HttpError
          ? err.message
          : "No se pudo eliminar el ejemplar.",
      );
      setConfirmDeleteId(null);
    }
  };

  const onConfirmDeleteSpecies = async (id: string) => {
    try {
      await handleDeleteSpecies(id);
      setConfirmDeleteSpeciesId(null);
    } catch (err) {
      setSpeciesMessage(
        err instanceof HttpError
          ? err.message
          : "No se pudo eliminar la especie.",
      );
      setConfirmDeleteSpeciesId(null);
    }
  };

  return (
    <>
      <main className="grow">
        <section className="mx-auto max-w-[var(--max-w)] border-b border-[var(--clr-border)] px-[var(--space-lg)] py-[var(--space-3xl)]">
          <SectionEyebrow>Gestión de la reserva</SectionEyebrow>
          <HeroTitle>Panel de administración</HeroTitle>
          <HeroDescription>
            Crea, edita o elimina ejemplares y especies del catálogo subiendo
            sus fotografías.
          </HeroDescription>

          <div className="mt-[var(--space-xl)] flex gap-[var(--space-sm)]">
            <button
              type="button"
              onClick={() => setActiveTab("animals")}
              className={`cursor-pointer rounded-[var(--radius-full)] border px-4 py-2 text-[0.82rem] font-medium [transition:background_var(--transition),color_var(--transition)] ${
                activeTab === "animals"
                  ? "border-[var(--clr-primary)] bg-[var(--clr-primary)] text-[var(--clr-primary-text)]"
                  : "border-[var(--clr-border)] bg-[var(--clr-surface-white)] text-[var(--clr-text-secondary)]"
              }`}
            >
              Ejemplares ({animals.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("species")}
              className={`cursor-pointer rounded-[var(--radius-full)] border px-4 py-2 text-[0.82rem] font-medium [transition:background_var(--transition),color_var(--transition)] ${
                activeTab === "species"
                  ? "border-[var(--clr-primary)] bg-[var(--clr-primary)] text-[var(--clr-primary-text)]"
                  : "border-[var(--clr-border)] bg-[var(--clr-surface-white)] text-[var(--clr-text-secondary)]"
              }`}
            >
              Especies / Categorías ({species.length})
            </button>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)] py-[var(--space-2xl)]">
          {error && (
            <div
              role="alert"
              className="mb-[var(--space-lg)] rounded-[var(--radius)] border border-[#b91c1c]/40 bg-[#b91c1c]/10 p-4 text-[0.85rem] text-[#b91c1c]"
            >
              {error}
            </div>
          )}

          {activeTab === "animals" ? (
            <div className="grid grid-cols-1 gap-[var(--space-2xl)] lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionTitle>
                  {editingId ? "Editar ejemplar" : "Nuevo ejemplar"}
                </SectionTitle>

                <form
                  onSubmit={onSubmitAnimal}
                  noValidate
                  className="mt-[var(--space-md)] flex flex-col gap-[var(--space-md)] rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-lg)]"
                >
                  {formMessage && (
                    <p className="rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-bg)] px-3 py-2 text-[0.8rem] text-[var(--clr-text)]">
                      {formMessage}
                    </p>
                  )}

                  <Input
                    id="animal-name"
                    label="Nombre del ejemplar"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={fieldErrors.name}
                  />

                  <div className="flex flex-col gap-[0.35rem]">
                    <label
                      htmlFor="animal-species"
                      className="text-[0.8rem] font-medium text-[var(--clr-text-secondary)]"
                    >
                      Especie
                    </label>
                    <select
                      id="animal-species"
                      value={selectedSpeciesId}
                      onChange={(e) => setSpeciesId(e.target.value)}
                      className="min-h-[2.75rem] w-full rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] px-[0.8rem] py-[0.65rem] text-[0.875rem] text-[var(--clr-text)]"
                    >
                      {species.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.usualName} ({item.scientificName})
                        </option>
                      ))}
                    </select>
                    {fieldErrors.speciesId && (
                      <p className="text-[0.75rem] text-[#b91c1c]">
                        {fieldErrors.speciesId}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-[var(--space-md)]">
                    <div className="flex flex-col gap-[0.35rem]">
                      <label
                        htmlFor="animal-sex"
                        className="text-[0.8rem] font-medium text-[var(--clr-text-secondary)]"
                      >
                        Sexo
                      </label>
                      <select
                        id="animal-sex"
                        value={sex}
                        onChange={(e) =>
                          setSex(e.target.value as "MALE" | "FEMALE")
                        }
                        className="min-h-[2.75rem] w-full rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] px-[0.8rem] py-[0.65rem] text-[0.875rem] text-[var(--clr-text)]"
                      >
                        <option value="FEMALE">Hembra (FEMALE)</option>
                        <option value="MALE">Macho (MALE)</option>
                      </select>
                    </div>

                    <Input
                      id="animal-age"
                      label="Edad (años)"
                      type="number"
                      min={0}
                      max={100}
                      value={ageYears}
                      onChange={(e) => setAgeYears(e.target.value)}
                      error={fieldErrors.ageYears}
                    />
                  </div>

                  <Input
                    id="animal-description"
                    label="Descripción biomédica / dieta"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={fieldErrors.description}
                  />

                  <div className="flex flex-col gap-[0.35rem]">
                    <label
                      htmlFor="animal-file"
                      className="text-[0.8rem] font-medium text-[var(--clr-text-secondary)]"
                    >
                      Subir fotografía (opcional)
                    </label>
                    <input
                      id="animal-file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={onSelectAnimalFile}
                      className="w-full rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-bg)] px-3 py-2 text-[0.8rem] text-[var(--clr-text)] file:mr-3 file:cursor-pointer file:rounded-[var(--radius)] file:border-0 file:bg-[var(--clr-primary)] file:px-3 file:py-1 file:text-[0.75rem] file:font-medium file:text-[var(--clr-primary-text)]"
                    />
                    {animalPreview && (
                      <div className="relative mt-2 aspect-[4/3] w-40 overflow-hidden rounded-[var(--radius)] border border-[var(--clr-border)]">
                        <Image
                          src={animalPreview}
                          alt="Vista previa"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {fieldErrors.imageUrl && (
                      <p className="text-[0.75rem] text-[#b91c1c]">
                        {fieldErrors.imageUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-[var(--space-sm)] pt-2">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving
                        ? "Subiendo y guardando..."
                        : editingId
                          ? "Guardar cambios"
                          : "Crear ejemplar"}
                    </Button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] px-4 py-2 text-[0.82rem] text-[var(--clr-text-secondary)]"
                      >
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-7">
                <SectionTitle>
                  Ejemplares registrados ({animals.length})
                </SectionTitle>

                {isLoading ? (
                  <p className="mt-[var(--space-md)] text-[0.9rem] text-[var(--clr-text-secondary)]">
                    Cargando ejemplares...
                  </p>
                ) : (
                  <div className="mt-[var(--space-md)] flex flex-col gap-[var(--space-sm)]">
                    {animals.map((animal) => (
                      <div
                        key={animal.id}
                        className="flex flex-wrap items-center justify-between gap-[var(--space-md)] rounded-[var(--radius-lg)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-md)]"
                      >
                        <div className="flex items-center gap-[var(--space-md)]">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-bg-elevated)]">
                            <Image
                              src={getAnimalImage(animal)}
                              alt={animal.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-[family-name:var(--font-serif)] text-[1.1rem] text-[var(--clr-text)]">
                              {animal.name}{" "}
                              <span className="font-[family-name:var(--font-sans)] text-[0.78rem] text-[var(--clr-text-muted)]">
                                · {animal.typeAnimal} · {animal.gender} ·{" "}
                                {animal.age} años
                              </span>
                            </p>
                            <p className="text-[0.8rem] text-[var(--clr-text-secondary)]">
                              {animal.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-[var(--space-xs)]">
                          <button
                            type="button"
                            onClick={() => startEdit(animal)}
                            className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] px-3 py-1.5 text-[0.78rem] font-medium text-[var(--clr-text)] hover:bg-[var(--clr-bg-elevated)]"
                          >
                            Editar
                          </button>

                          {confirmDeleteId === animal.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => void onConfirmDelete(animal.id)}
                                className="cursor-pointer rounded-[var(--radius)] bg-[#b91c1c] px-3 py-1.5 text-[0.78rem] font-medium text-white"
                              >
                                Confirmar
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] px-2.5 py-1.5 text-[0.78rem] text-[var(--clr-text-secondary)]"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(animal.id)}
                              className="cursor-pointer rounded-[var(--radius)] border border-[#b91c1c]/40 px-3 py-1.5 text-[0.78rem] font-medium text-[#b91c1c] hover:bg-[#b91c1c]/10"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[var(--space-2xl)] lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionTitle>
                  {editingSpeciesId ? "Editar especie" : "Nueva especie"}
                </SectionTitle>

                <form
                  onSubmit={onSubmitSpecies}
                  noValidate
                  className="mt-[var(--space-md)] flex flex-col gap-[var(--space-md)] rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-lg)]"
                >
                  {speciesMessage && (
                    <p className="rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-bg)] px-3 py-2 text-[0.8rem] text-[var(--clr-text)]">
                      {speciesMessage}
                    </p>
                  )}

                  <Input
                    id="species-common-name"
                    label="Nombre común (ej. Oso de Anteojos)"
                    type="text"
                    value={commonName}
                    onChange={(e) => setCommonName(e.target.value)}
                    error={speciesErrors.commonName}
                  />

                  <Input
                    id="species-scientific-name"
                    label="Nombre científico (ej. Tremarctos ornatus)"
                    type="text"
                    value={scientificName}
                    onChange={(e) => setScientificName(e.target.value)}
                    error={speciesErrors.scientificName}
                  />

                  <Input
                    id="species-description"
                    label="Descripción biológica"
                    type="text"
                    value={speciesDescription}
                    onChange={(e) => setSpeciesDescription(e.target.value)}
                    error={speciesErrors.description}
                  />

                  <Input
                    id="species-morphology"
                    label="Morfología"
                    type="text"
                    value={morphology}
                    onChange={(e) => setMorphology(e.target.value)}
                    error={speciesErrors.morphology}
                  />

                  <Input
                    id="species-habitat"
                    label="Hábitat"
                    type="text"
                    value={habitat}
                    onChange={(e) => setHabitat(e.target.value)}
                    error={speciesErrors.habitat}
                  />

                  <Input
                    id="species-diet"
                    label="Dieta"
                    type="text"
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    error={speciesErrors.diet}
                  />

                  <Input
                    id="species-link-label"
                    label="Etiqueta enlace catálogo (opcional)"
                    type="text"
                    placeholder="ver ejemplares de esta especie"
                    value={catalogLinkLabel}
                    onChange={(e) => setCatalogLinkLabel(e.target.value)}
                  />

                  <div className="flex flex-col gap-[0.35rem]">
                    <label
                      htmlFor="species-file"
                      className="text-[0.8rem] font-medium text-[var(--clr-text-secondary)]"
                    >
                      Fotografía de la especie
                    </label>
                    <input
                      id="species-file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      onChange={onSelectSpeciesFile}
                      className="w-full rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-bg)] px-3 py-2 text-[0.8rem] text-[var(--clr-text)] file:mr-3 file:cursor-pointer file:rounded-[var(--radius)] file:border-0 file:bg-[var(--clr-primary)] file:px-3 file:py-1 file:text-[0.75rem] file:font-medium file:text-[var(--clr-primary-text)]"
                    />
                    {speciesPreview && (
                      <div className="relative mt-2 aspect-[4/3] w-40 overflow-hidden rounded-[var(--radius)] border border-[var(--clr-border)]">
                        <Image
                          src={speciesPreview}
                          alt="Vista previa de especie"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {speciesErrors.imageUrl && (
                      <p className="text-[0.75rem] text-[#b91c1c]">
                        {speciesErrors.imageUrl}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-[var(--space-sm)] pt-2">
                    <Button type="submit" disabled={isSavingSpecies}>
                      {isSavingSpecies
                        ? "Subiendo y guardando..."
                        : editingSpeciesId
                          ? "Guardar especie"
                          : "Crear especie"}
                    </Button>
                    {editingSpeciesId && (
                      <button
                        type="button"
                        onClick={resetSpeciesForm}
                        className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] px-4 py-2 text-[0.82rem] text-[var(--clr-text-secondary)]"
                      >
                        Cancelar edición
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="lg:col-span-7">
                <SectionTitle>
                  Especies registradas ({species.length})
                </SectionTitle>

                <div className="mt-[var(--space-md)] flex flex-col gap-[var(--space-sm)]">
                  {species.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-[var(--space-md)] rounded-[var(--radius-lg)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-md)]"
                    >
                      <div className="flex items-center gap-[var(--space-md)]">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-bg-elevated)]">
                          <Image
                            src={item.imageUrl}
                            alt={item.usualName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-[family-name:var(--font-serif)] text-[1.1rem] text-[var(--clr-text)]">
                            {item.usualName}{" "}
                            <span className="font-[family-name:var(--font-sans)] text-[0.78rem] italic text-[var(--clr-text-muted)]">
                              ({item.scientificName})
                            </span>
                          </p>
                          <p className="text-[0.8rem] text-[var(--clr-text-secondary)]">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-[var(--space-xs)]">
                        <button
                          type="button"
                          onClick={() => startEditSpecies(item)}
                          className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] px-3 py-1.5 text-[0.78rem] font-medium text-[var(--clr-text)] hover:bg-[var(--clr-bg-elevated)]"
                        >
                          Editar
                        </button>

                        {confirmDeleteSpeciesId === item.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                void onConfirmDeleteSpecies(item.id)
                              }
                              className="cursor-pointer rounded-[var(--radius)] bg-[#b91c1c] px-3 py-1.5 text-[0.78rem] font-medium text-white"
                            >
                              Confirmar
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteSpeciesId(null)}
                              className="cursor-pointer rounded-[var(--radius)] border border-[var(--clr-border)] px-2.5 py-1.5 text-[0.78rem] text-[var(--clr-text-secondary)]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteSpeciesId(item.id)}
                            className="cursor-pointer rounded-[var(--radius)] border border-[#b91c1c]/40 px-3 py-1.5 text-[0.78rem] font-medium text-[#b91c1c] hover:bg-[#b91c1c]/10"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-[var(--space-3xl)] border-t border-[var(--clr-border)] pt-[var(--space-2xl)]">
            <SectionTitle>
              Todos los apadrinamientos ({sponsorships.length})
            </SectionTitle>

            {sponsorships.length === 0 ? (
              <p className="mt-[var(--space-md)] text-[0.88rem] text-[var(--clr-text-secondary)]">
                Aún no se han registrado apadrinamientos.
              </p>
            ) : (
              <div className="mt-[var(--space-md)] grid grid-cols-1 gap-[var(--space-md)] md:grid-cols-2">
                {sponsorships.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-[var(--space-sm)] rounded-[var(--radius-lg)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-md)]"
                  >
                    <div className="flex items-start justify-between gap-[var(--space-sm)]">
                      <div>
                        <p className="font-medium text-[var(--clr-text)]">
                          {item.donorName} ({item.donorEmail})
                        </p>
                        <p className="text-[0.8rem] text-[var(--clr-text-secondary)]">
                          {item.animal
                            ? `Ejemplar: ${item.animal.name}`
                            : "Donación general"}{" "}
                          · ${item.amount.toLocaleString("es-CO")} COP
                        </p>
                      </div>
                      <select
                        aria-label={`Estado del apadrinamiento de ${item.donorName}`}
                        value={item.status}
                        onChange={(e) =>
                          void handleStatusChange(
                            item.id,
                            e.target.value as
                              | "PENDING"
                              | "CONFIRMED"
                              | "CANCELLED",
                          )
                        }
                        className="rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-bg)] px-2.5 py-1 text-[0.75rem] text-[var(--clr-text)]"
                      >
                        <option value="PENDING">Pendiente</option>
                        <option value="CONFIRMED">Confirmado</option>
                        <option value="CANCELLED">Cancelado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter>
        <span>Colaboraciones Salvajes</span>
        <p>Panel de administración de la reserva.</p>
      </SiteFooter>
    </>
  );
}
