import Image from "next/image";
import Link from "next/link";
import type { Species } from "../domain/species";

export default function SpeciesCard({ species }: { species: Species }) {
  const linkLabel =
    species.catalogLinkLabel ??
    `ver ejemplares de ${species.usualName.toLowerCase()}`;

  return (
    <article className="group flex flex-col gap-[var(--space-sm)] rounded-[var(--radius-2xl)] border border-[var(--clr-border)] bg-[color-mix(in_srgb,var(--clr-bg)_60%,var(--clr-surface-card))] p-[var(--space-lg)] transition-[border-color,background] duration-300 ease-in-out hover:border-[var(--clr-text-muted)]">
      <header>
        <div className="relative mb-[var(--space-xs)] aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--clr-bg-elevated)]">
          <Image
            src={species.imageUrl}
            alt={species.usualName}
            fill
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="mb-[0.15rem]">
          <span className="font-[family-name:var(--font-serif)] text-[0.75rem] italic text-[var(--clr-text-muted)]">
            {species.scientificName}
          </span>
        </div>
      </header>

      <h3 className="font-[family-name:var(--font-serif)] text-[1.15rem] font-normal text-[var(--clr-text)]">
        {species.usualName}
      </h3>
      <p className="text-[0.8rem] font-light leading-[1.65] text-[var(--clr-text-secondary)]">
        {species.description}
      </p>

      <DataRow label="Morfologia" value={species.dataMorphology} />
      <DataRow label="Hábitat" value={species.dataHabitat} />
      <DataRow label="Dieta" value={species.dataDiet} />

      <div>
        <Link
          href="/catalogo"
          className="inline-block border-t border-[var(--clr-border)] pt-[var(--space-sm)] text-[0.78rem] font-medium text-[var(--clr-primary)] [transition:opacity_var(--transition)] hover:underline hover:opacity-75"
        >
          {linkLabel}
        </Link>
      </div>
    </article>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col border-t border-[var(--clr-border)] pt-[var(--space-sm)]">
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.04em] text-[var(--clr-text)]">
        {label}
      </span>
      <span className="mt-[0.1rem] text-[0.78rem] font-light text-[var(--clr-text-muted)]">
        {value}
      </span>
    </div>
  );
}
