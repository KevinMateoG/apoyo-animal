"use client";

import { useEffect, useState } from "react";
import type { Animal } from "@/src/features/catalogo/domain/animal";
import { getAnimals } from "@/src/features/catalogo/services/animal.service";
import {
  HeroDescription,
  HeroTitle,
  SectionEyebrow,
  SectionSubtitle,
  SectionTitle,
} from "@/src/features/common/components/Headings";
import SiteFooter from "@/src/features/common/components/SiteFooter";
import SponsorshipForm from "./SponsorshipForm";

export default function SponsorshipPage() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    let active = true;
    getAnimals()
      .then((data) => {
        if (active) setAnimals(data);
      })
      .catch(() => {
        if (active) setAnimals([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <main className="grow">
        <section className="mx-auto max-w-[var(--max-w)] border-b border-[var(--clr-border)] px-[var(--space-lg)] py-[var(--space-3xl)]">
          <div className="max-w-[44rem]">
            <SectionEyebrow>Tu apoyo transforma vidas</SectionEyebrow>
            <HeroTitle>Apadrina o haz una donación</HeroTitle>
            <HeroDescription>
              Elige un animal para acompañar su cuidado o contribuye al fondo
              general de la reserva. Completa tus datos y dinos cómo quieres
              participar.
            </HeroDescription>
          </div>
        </section>

        <section className="bg-[var(--clr-surface-white)] px-[var(--space-lg)] py-[var(--space-3xl)]">
          <div className="mx-auto max-w-[52rem]">
            <div className="mb-[var(--space-xl)]">
              <SectionEyebrow>Formulario de apoyo</SectionEyebrow>
              <SectionTitle>Cuéntanos cómo quieres ayudar</SectionTitle>
              <SectionSubtitle>
                Usaremos tus datos únicamente para confirmar tu aporte y
                mantenerte informado sobre su destino.
              </SectionSubtitle>
            </div>

            <SponsorshipForm animals={animals} />
          </div>
        </section>
      </main>

      <SiteFooter>
        <span>Colaboraciones Salvajes</span>
        <p>Gracias por convertir tu solidaridad en cuidado.</p>
      </SiteFooter>
    </>
  );
}
