import type { Metadata } from "next";
import RegisterForm from "@/src/features/auth/components/RegisterForm";
import {
  HeroDescription,
  HeroTitle,
  SectionEyebrow,
} from "@/src/features/common/components/Headings";
import SiteFooter from "@/src/features/common/components/SiteFooter";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function Page() {
  return (
    <>
      <main className="grow">
        <section className="mx-auto max-w-[32rem] px-[var(--space-lg)] py-[var(--space-3xl)]">
          <div className="mb-[var(--space-xl)]">
            <SectionEyebrow>Únete a la reserva</SectionEyebrow>
            <HeroTitle>Crea tu cuenta</HeroTitle>
            <HeroDescription>
              Regístrate para apadrinar ejemplares, realizar donaciones y hacer
              seguimiento a tus aportes.
            </HeroDescription>
          </div>

          <RegisterForm />
        </section>
      </main>

      <SiteFooter>
        <span>Colaboraciones Salvajes</span>
        <p>Custodia responsable de especies amenazadas.</p>
      </SiteFooter>
    </>
  );
}

