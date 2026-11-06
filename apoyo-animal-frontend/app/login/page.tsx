import type { Metadata } from "next";
import LoginForm from "@/src/features/auth/components/LoginForm";
import {
  HeroDescription,
  HeroTitle,
  SectionEyebrow,
} from "@/src/features/common/components/Headings";
import SiteFooter from "@/src/features/common/components/SiteFooter";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function Page() {
  return (
    <>
      <main className="grow">
        <section className="mx-auto max-w-[32rem] px-[var(--space-lg)] py-[var(--space-3xl)]">
          <div className="mb-[var(--space-xl)]">
            <SectionEyebrow>Acceso a padrinos</SectionEyebrow>
            <HeroTitle>Inicia sesión</HeroTitle>
            <HeroDescription>
              Ingresa a tu cuenta para gestionar tus apadrinamientos y apoyar a
              la fauna de nuestra reserva.
            </HeroDescription>
          </div>

          <LoginForm />
        </section>
      </main>

      <SiteFooter>
        <span>Colaboraciones Salvajes</span>
        <p>Custodia responsable de especies amenazadas.</p>
      </SiteFooter>
    </>
  );
}

