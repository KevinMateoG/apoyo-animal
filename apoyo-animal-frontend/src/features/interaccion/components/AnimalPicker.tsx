"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  type Animal,
  getAnimalImage,
} from "@/src/features/catalogo/domain/animal";

interface AnimalPickerProps {
  animals: Animal[];
  selectedId: string;
  onSelect: (animalId: string) => void;
}

export default function AnimalPicker({
  animals,
  selectedId,
  onSelect,
}: AnimalPickerProps) {
  /** `isMounted` mantiene el nodo en el DOM mientras corre la animación de salida controlada por `isVisible`. */
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const selected = animals.find((animal) => animal.id === selectedId);

  const close = () => {
    setIsVisible(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isMounted) return;
    closeRef.current?.focus();
    const frame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(frame);
  }, [isMounted]);

  useEffect(() => {
    if (!isVisible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsVisible(false);
        triggerRef.current?.focus();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isVisible]);

  const handleSelect = (animalId: string) => {
    onSelect(animalId);
    close();
  };

  return (
    <div className="flex flex-col gap-[0.35rem]">
      <span
        id="animal-picker-label"
        className="text-[0.8rem] font-medium text-[var(--clr-text-secondary)]"
      >
        Animal que quieres apadrinar
      </span>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsMounted(true)}
        aria-haspopup="dialog"
        aria-expanded={isVisible}
        aria-controls="animal-picker-modal"
        aria-labelledby="animal-picker-label animal-picker-trigger"
        id="animal-picker-trigger"
        className="group flex min-h-[2.75rem] w-full cursor-pointer items-center justify-between gap-[var(--space-sm)] rounded-[var(--radius)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] px-[0.8rem] py-2 text-left text-[0.875rem] text-[var(--clr-text)] [transition:border-color_var(--transition),box-shadow_var(--transition)] hover:border-[var(--clr-text-muted)] focus-visible:border-[var(--clr-primary)] focus-visible:outline-2 focus-visible:outline-[color-mix(in_srgb,var(--clr-primary)_35%,transparent)] aria-expanded:border-[var(--clr-primary)] aria-expanded:shadow-[inset_0_0_0_1px_var(--clr-primary)]"
      >
        <span className="flex min-w-0 flex-1 items-center gap-[var(--space-sm)]">
          {selected ? (
            <>
              <Image
                src={getAnimalImage(selected)}
                alt={selected.name}
                width={32}
                height={32}
                className="size-8 shrink-0 rounded-[var(--radius)] object-cover"
              />
              <span className="flex min-w-0 flex-col gap-[0.1rem]">
                <strong className="truncate text-[0.875rem] font-medium">
                  {selected.name}
                </strong>
                <small className="whitespace-nowrap text-[0.72rem] text-[var(--clr-text-muted)]">
                  {selected.typeAnimal} · {selected.gender}
                </small>
              </span>
            </>
          ) : (
            <span className="text-[var(--clr-text-muted)]">
              Selecciona un ejemplar
            </span>
          )}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="shrink-0 text-[var(--clr-text-muted)] [transition:transform_var(--transition)] group-aria-expanded:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isMounted && (
        <div
          id="animal-picker-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Selecciona un animal para apadrinar"
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && !isVisible) {
              setIsMounted(false);
            }
          }}
          className={`fixed inset-0 z-[200] flex items-center justify-center p-[var(--space-lg)] transition-opacity duration-[250ms] ease-in-out ${
            isVisible ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            onClick={close}
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--clr-text)_40%,transparent)] backdrop-blur-[4px]"
          />

          <div
            className={`relative flex max-h-[min(80vh,620px)] w-full max-w-[680px] flex-col overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--clr-border)] bg-[var(--clr-bg)] shadow-picker transition-[translate,scale] duration-[250ms] ease-in-out ${
              isVisible
                ? "translate-y-0 scale-100"
                : "translate-y-4 scale-[0.98]"
            }`}
          >
            <div className="flex shrink-0 items-start justify-between gap-[var(--space-md)] border-b border-[var(--clr-border)] px-[var(--space-lg)] pb-[var(--space-md)] pt-[var(--space-lg)]">
              <div>
                <h3 className="font-[family-name:var(--font-serif)] text-[1.15rem] font-normal text-[var(--clr-text)]">
                  Elige tu animal
                </h3>
                <p className="mt-[0.15rem] text-[0.78rem] text-[var(--clr-text-muted)]">
                  Selecciona el ejemplar que quieres acompañar
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Cerrar selector de animales"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-full)] border border-[var(--clr-border)] bg-transparent text-[var(--clr-text-muted)] [transition:background_var(--transition),color_var(--transition),border-color_var(--transition)] hover:border-[var(--clr-text-muted)] hover:bg-[var(--clr-bg-elevated)] hover:text-[var(--clr-text)]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-[var(--space-sm)] overflow-y-auto overscroll-contain p-[var(--space-lg)] max-[560px]:grid-cols-2 max-[560px]:gap-[var(--space-xs)] max-[560px]:p-[var(--space-md)] max-[360px]:grid-cols-1">
              {animals.map((animal) => (
                <PickerAnimalCard
                  key={animal.id}
                  animal={animal}
                  isSelected={animal.id === selectedId}
                  onSelect={() => handleSelect(animal.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PickerAnimalCard({
  animal,
  isSelected,
  onSelect,
}: {
  animal: Animal;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Seleccionar a ${animal.name}`}
      aria-pressed={isSelected}
      className={`group flex h-[200px] cursor-pointer flex-col overflow-hidden rounded-[var(--radius-lg)] border bg-[var(--clr-surface-white)] p-0 text-left [transition:border-color_var(--transition),box-shadow_var(--transition),transform_var(--transition)] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--clr-primary)] ${
        isSelected
          ? "border-[var(--clr-primary)] shadow-picker-card-selected"
          : "border-[var(--clr-border)] hover:border-[var(--clr-text-muted)] hover:shadow-picker-card-hover"
      }`}
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[var(--clr-bg-elevated)]">
        <Image
          src={getAnimalImage(animal)}
          alt={animal.typeAnimal}
          fill
          sizes="(max-width: 560px) 50vw, 200px"
          className="object-cover transition-transform duration-[400ms] ease-in-out group-hover:scale-105"
        />
        <span
          className={`absolute left-[var(--space-xs)] top-[var(--space-xs)] whitespace-nowrap rounded-[var(--radius)] border px-2 py-[0.2rem] text-[0.65rem] font-semibold uppercase tracking-[0.04em] ${
            isSelected
              ? "border-[var(--clr-primary)] bg-[var(--clr-primary)] text-[var(--clr-primary-text)]"
              : "border-[var(--clr-border)] bg-[color-mix(in_srgb,var(--clr-surface-white)_88%,transparent)] text-[var(--clr-text)]"
          }`}
        >
          {animal.typeAnimal}
        </span>
      </div>
      <div className="flex flex-col gap-[0.1rem] px-[var(--space-sm)] py-[var(--space-xs)]">
        <span className="font-[family-name:var(--font-serif)] text-[0.95rem] font-normal text-[var(--clr-text)]">
          {animal.name}
        </span>
        <span className="text-[0.7rem] text-[var(--clr-text-muted)]">
          {animal.gender} · {animal.age} años
        </span>
      </div>
    </button>
  );
}
