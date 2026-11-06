"use client";

import SpeciesCard from "@/src/features/catalogo/components/SpeciesCard";
import { useSpecies } from "@/src/features/catalogo/hooks/useSpecies";
import { ButtonLink } from "@/src/features/common/components/Button";
import {
  CtaBox,
  CtaDescription,
  CtaTitle,
} from "@/src/features/common/components/CtaBox";
import {
  HeroDescription,
  HeroTitle,
  SectionEyebrow,
  SectionSubtitle,
  SectionTitle,
} from "@/src/features/common/components/Headings";
import SiteFooter from "@/src/features/common/components/SiteFooter";

export default function HomePage() {
  const { species, isLoading, error, reload } = useSpecies();

  return (
    <>
      <main className="grow">
        <section className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)] py-[var(--space-3xl)]">
          <div className="flex max-w-[42rem] flex-col gap-[var(--space-lg)]">
            <HeroTitle>Protege la vida silvestre: Apadrina hoy</HeroTitle>
            <HeroDescription>
              Descubre el fascinante mundo de nuestra fauna rescatada. Con tu
              apadrinamiento, no solo aprendes sobre el hábitat natural, la
              dieta y las características físicas de especies únicas como el
              tejón melero, el panda rojo y el león marino, sino que financias
              directamente su cuidado diario. Conviértete en su mayor aliado.
            </HeroDescription>
            <ButtonLink href="/catalogo">Ver animales para apadrinar</ButtonLink>

            <div className="flex gap-[var(--space-2xl)] border-t border-[var(--clr-border)] pt-[var(--space-lg)]">
              <Stat value="100%" label="Alimentación natural" />
              <Stat value="24/7" label="Monitoreo médico" />
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--clr-border)] bg-[var(--clr-surface-white)] py-[var(--space-3xl)] transition-colors duration-300">
          <div className="mx-auto mb-[var(--space-2xl)] max-w-[var(--max-w)] px-[var(--space-lg)]">
            <SectionEyebrow>Biodiversidad en Custodia</SectionEyebrow>
            <SectionTitle>Especies Representativas</SectionTitle>
            <SectionSubtitle>
              Fichas biológicas de las tres especies clave que estructuran
              nuestros programas de conservación
            </SectionSubtitle>
          </div>

          <div className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)]">
            {isLoading ? (
              <div
                role="status"
                className="rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-bg)] p-[var(--space-2xl)] text-center text-[0.9rem] text-[var(--clr-text-secondary)]"
              >
                Cargando especies representativas...
              </div>
            ) : error ? (
              <div
                role="alert"
                className="flex flex-col items-center gap-[var(--space-md)] rounded-[var(--radius-xl)] border border-[#b91c1c]/40 bg-[#b91c1c]/10 p-[var(--space-2xl)] text-center text-[0.9rem] text-[#b91c1c]"
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() => void reload()}
                  className="cursor-pointer rounded-[var(--radius)] border border-[#b91c1c] px-4 py-2 text-[0.8rem] font-medium hover:bg-[#b91c1c]/10"
                >
                  Reintentar
                </button>
              </div>
            ) : species.length === 0 ? (
              <div className="rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-bg)] p-[var(--space-2xl)] text-center text-[0.9rem] text-[var(--clr-text-secondary)]">
                Aún no hay especies registradas.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-[var(--space-xl)] md:grid-cols-3">
                {species.map((item) => (
                  <SpeciesCard key={item.id} species={item} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)] py-[var(--space-2xl)]">
          <CtaBox>
            <div>
              <CtaTitle>¿Listo para formar parte de la reserva?</CtaTitle>
              <CtaDescription>
                Inicia tu apadrinamiento hoy. Cada donación respalda nutrición
                clínica y hábitats protegidos.
              </CtaDescription>
            </div>
            <div>
              <ButtonLink href="/apadrinar">Comenzar Apadrinamiento</ButtonLink>
            </div>
          </CtaBox>
        </section>
      </main>

      <SiteFooter>
        <div className="flex items-center gap-[var(--space-xs)] text-[0.8rem] font-light text-[var(--clr-text-muted)]">
          <span className="font-medium text-[var(--clr-text)]">
            Colaboraciones Salvajes
          </span>
          <span>Reserva Biológica Certificada</span>
        </div>
        <div className="flex gap-[var(--space-lg)] text-[0.8rem] font-light text-[var(--clr-text-muted)]">
          <span className="cursor-pointer [transition:color_var(--transition)] hover:text-[var(--clr-text)]">
            Privacidad
          </span>
          <span className="cursor-pointer [transition:color_var(--transition)] hover:text-[var(--clr-text)]">
            Transparencia y contacto
          </span>
        </div>
      </SiteFooter>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-[family-name:var(--font-serif)] text-[1.5rem] font-normal leading-none text-[var(--clr-text)]">
        {value}
      </p>
      <p className="mt-1 text-[0.7rem] uppercase tracking-[0.08em] text-[var(--clr-text-muted)]">
        {label}
      </p>
    </div>
  );
}
