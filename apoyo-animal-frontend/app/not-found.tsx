import { ButtonLink } from "@/src/features/common/components/Button";
import {
  HeroDescription,
  HeroTitle,
  SectionEyebrow,
} from "@/src/features/common/components/Headings";
import SiteFooter from "@/src/features/common/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <main className="flex grow items-center">
        <section className="mx-auto max-w-[38rem] px-[var(--space-lg)] py-[var(--space-3xl)] text-center">
          <SectionEyebrow>Error 404</SectionEyebrow>
          <HeroTitle>Sendero no encontrado</HeroTitle>
          <div className="mt-[var(--space-md)] flex flex-col items-center gap-[var(--space-lg)]">
            <HeroDescription>
              La página que buscas no existe o fue trasladada dentro de la
              reserva. Regresa al inicio o explora nuestros ejemplares.
            </HeroDescription>
            <div className="flex flex-wrap justify-center gap-[var(--space-sm)]">
              <ButtonLink href="/">Volver al inicio</ButtonLink>
              <ButtonLink href="/catalogo">Ver ejemplares</ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter>
        <span>Colaboraciones Salvajes</span>
        <p>Reserva Biológica Certificada</p>
      </SiteFooter>
    </>
  );
}

