"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { ButtonLink } from "@/src/features/common/components/Button";
import {
  HeroDescription,
  HeroTitle,
  SectionEyebrow,
} from "@/src/features/common/components/Headings";
import SiteFooter from "@/src/features/common/components/SiteFooter";
import { useMySponsorships } from "../hooks/useMySponsorships";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  CONFIRMED: "Confirmado",
  CANCELLED: "Cancelado",
};

export default function MySponsorshipsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { sponsorships, isLoading, error, reload } =
    useMySponsorships(isAuthenticated);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <main className="grow">
        <div className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)] py-[var(--space-3xl)] text-[0.9rem] text-[var(--clr-text-secondary)]">
          Verificando sesión...
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="grow">
        <section className="mx-auto max-w-[var(--max-w)] border-b border-[var(--clr-border)] px-[var(--space-lg)] py-[var(--space-3xl)]">
          <div className="flex flex-wrap items-end justify-between gap-[var(--space-md)]">
            <div className="max-w-[42rem]">
              <SectionEyebrow>Tu historial solidario</SectionEyebrow>
              <HeroTitle>Mis apadrinamientos y aportes</HeroTitle>
              <HeroDescription>
                Aquí puedes consultar todos los ejemplares que acompañas y las
                donaciones registradas con tu cuenta.
              </HeroDescription>
            </div>
            <ButtonLink href="/apadrinar">Nuevo apadrinamiento</ButtonLink>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--max-w)] px-[var(--space-lg)] py-[var(--space-2xl)]">
          {isLoading ? (
            <div
              role="status"
              className="rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-2xl)] text-center text-[0.9rem] text-[var(--clr-text-secondary)]"
            >
              Cargando tus apadrinamientos...
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
                className="cursor-pointer rounded-[var(--radius)] border border-[#b91c1c] px-4 py-2 text-[0.8rem] font-medium"
              >
                Reintentar
              </button>
            </div>
          ) : sponsorships.length === 0 ? (
            <div className="flex flex-col items-center gap-[var(--space-md)] rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-2xl)] text-center">
              <p className="text-[0.95rem] text-[var(--clr-text-secondary)]">
                Aún no tienes apadrinamientos registrados en tu cuenta.
              </p>
              <ButtonLink href="/apadrinar">
                Realizar mi primer aporte
              </ButtonLink>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-[var(--space-lg)] md:grid-cols-2">
              {sponsorships.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between gap-[var(--space-md)] rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-surface-white)] p-[var(--space-lg)]"
                >
                  <div className="flex items-start justify-between gap-[var(--space-sm)]">
                    <div>
                      <span className="text-[0.72rem] font-semibold uppercase tracking-[0.06em] text-[var(--clr-primary-hover)]">
                        {item.type === "ANIMAL"
                          ? "Apadrinamiento de ejemplar"
                          : "Donación general"}
                      </span>
                      <h2 className="mt-1 font-[family-name:var(--font-serif)] text-[1.3rem] text-[var(--clr-text)]">
                        {item.animal
                          ? `${item.animal.name}${item.animal.speciesCommonName ? ` (${item.animal.speciesCommonName})` : ""}`
                          : "Fondo general de la reserva"}
                      </h2>
                    </div>
                    <span className="rounded-[var(--radius-full)] border border-[var(--clr-border)] bg-[var(--clr-bg)] px-3 py-1 text-[0.72rem] font-medium text-[var(--clr-text-secondary)]">
                      {STATUS_LABELS[item.status] ?? item.status}
                    </span>
                  </div>

                  <dl className="grid grid-cols-2 gap-[var(--space-sm)] border-t border-[var(--clr-border)] pt-[var(--space-md)] text-[0.82rem]">
                    <div>
                      <dt className="text-[var(--clr-text-muted)]">Monto</dt>
                      <dd className="font-medium text-[var(--clr-text)]">
                        ${item.amount.toLocaleString("es-CO")} COP
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--clr-text-muted)]">
                        Frecuencia
                      </dt>
                      <dd className="font-medium text-[var(--clr-text)]">
                        {item.frequency === "RECURRING"
                          ? "Apadrinamiento continuo"
                          : "Donación única"}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-[var(--clr-text-muted)]">
                        Fecha de registro
                      </dt>
                      <dd className="text-[var(--clr-text-secondary)]">
                        {new Date(item.createdAt).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter>
        <span>Colaboraciones Salvajes</span>
        <p>Gracias por proteger nuestra fauna silvestre.</p>
      </SiteFooter>
    </>
  );
}

