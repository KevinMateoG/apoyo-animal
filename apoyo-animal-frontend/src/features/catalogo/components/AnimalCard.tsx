import Image from "next/image";
import { ButtonLink } from "@/src/features/common/components/Button";
import { type Animal, getAnimalImage } from "../domain/animal";

export default function AnimalCard({ animal }: { animal: Animal }) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] [transition:border-color_var(--transition),background_var(--transition)] hover:border-[var(--clr-text-muted)]">
      <div>
        <header className="relative aspect-[4/3] overflow-hidden bg-[var(--clr-bg-elevated)]">
          <Image
            src={getAnimalImage(animal)}
            alt={animal.typeAnimal}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <span className="absolute left-[var(--space-sm)] top-[var(--space-sm)] rounded-[var(--radius)] border border-[var(--clr-border)] bg-[color-mix(in_srgb,var(--clr-surface-white)_90%,transparent)] px-[0.625rem] py-1 text-[0.7rem] font-semibold uppercase tracking-[0.04em] text-[var(--clr-text)]">
            {animal.typeAnimal}
          </span>
        </header>

        <div className="p-[var(--space-lg)]">
          <div className="mb-[var(--space-sm)] flex items-baseline justify-between gap-[var(--space-sm)]">
            <h2 className="font-[family-name:var(--font-serif)] text-[1.5rem] font-normal leading-[1.2]">
              {animal.name}
            </h2>
            <span className="whitespace-nowrap text-[0.75rem] text-[var(--clr-text-muted)]">
              {animal.gender} - {animal.age} años
            </span>
          </div>
          <p className="text-[0.8rem] font-light leading-[1.65] text-[var(--clr-text-secondary)]">
            {animal.description}
          </p>
        </div>
      </div>

      <div className="px-[var(--space-lg)] pb-[var(--space-lg)]">
        <ButtonLink href="/apadrinar" fullWidth>
          Apadrinar a {animal.name}
        </ButtonLink>
      </div>
    </article>
  );
}
