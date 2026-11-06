"use client";

import type { Animal } from "@/src/features/catalogo/domain/animal";
import { Button, ButtonLink } from "@/src/features/common/components/Button";
import Input from "@/src/features/common/components/Input";
import { MAX_SPONSORSHIP_AMOUNT } from "../domain/sponsorship";
import { useSponsorshipForm } from "../hooks/useSponsorshipForm";
import AnimalPicker from "./AnimalPicker";
import FormErrorBanner from "./FormErrorBanner";
import RadioChoice from "./RadioChoice";

export default function SponsorshipForm({ animals }: { animals: Animal[] }) {
  const {
    values,
    setField,
    errors,
    thankYouMessage,
    isSubmitting,
    handleSubmit,
    isAuthenticated,
  } = useSponsorshipForm(animals);

  return (
    <>
      {!isAuthenticated && (
        <div className="mb-[var(--space-lg)] flex flex-wrap items-center justify-between gap-[var(--space-md)] rounded-[var(--radius-xl)] border border-[var(--clr-border)] bg-[var(--clr-bg)] p-[var(--space-lg)]">
          <div>
            <p className="font-medium text-[var(--clr-text)]">
              Inicia sesión para registrar tu apadrinamiento
            </p>
            <p className="text-[0.82rem] text-[var(--clr-text-secondary)]">
              Para asociar el aporte a tu cuenta y ver tu historial en &quot;Mis
              apadrinamientos&quot;, necesitas tener una sesión activa.
            </p>
          </div>
          <ButtonLink href="/login">Ingresar a mi cuenta</ButtonLink>
        </div>
      )}

      {errors.length > 0 && <FormErrorBanner errors={errors} />}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-[var(--space-xl)] rounded-[var(--radius-2xl)] border border-[var(--clr-border)] bg-[color-mix(in_srgb,var(--clr-bg)_60%,var(--clr-surface-card))] p-[var(--space-xl)] max-[640px]:p-[var(--space-lg)]"
      >
        <fieldset className="flex flex-col gap-[var(--space-md)]">
          <legend className="mb-[var(--space-xs)] font-[family-name:var(--font-serif)] text-[1.15rem] text-[var(--clr-text)]">
            Destino de tu donación
          </legend>
          <div className="grid grid-cols-2 gap-[var(--space-sm)] max-[640px]:grid-cols-1">
            <RadioChoice
              name="donation-type"
              value="animal"
              checked={values.donationType === "animal"}
              onChange={(value) => setField("donationType", value)}
              title="Apoyar a un animal"
              description="Elige un ejemplar y acompaña su recuperación."
            />
            <RadioChoice
              name="donation-type"
              value="general"
              checked={values.donationType === "general"}
              onChange={(value) => setField("donationType", value)}
              title="Donación general"
              description="Ayuda donde la reserva más lo necesite."
            />
          </div>

          {values.donationType === "animal" && (
            <AnimalPicker
              animals={animals}
              selectedId={values.animalId}
              onSelect={(animalId) => setField("animalId", animalId)}
            />
          )}
        </fieldset>

        <div className="grid grid-cols-2 gap-[var(--space-lg)] max-[640px]:grid-cols-1">
          <Input
            id="name"
            label="Nombre completo"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
          />
          <Input
            id="email"
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
          />
          <Input
            id="address"
            label="Dirección"
            type="text"
            autoComplete="street-address"
            placeholder="Calle, número, ciudad"
            fullWidth
            value={values.address}
            onChange={(e) => setField("address", e.target.value)}
          />
          <Input
            id="amount"
            label="Valor de tu aporte"
            type="number"
            min={1}
            max={MAX_SPONSORSHIP_AMOUNT}
            step={1}
            placeholder="0"
            startAdornment="$"
            endAdornment="COP"
            value={values.amount}
            onChange={(e) => setField("amount", e.target.value)}
          />
        </div>

        <fieldset className="flex flex-col gap-[var(--space-md)]">
          <legend className="mb-[var(--space-xs)] font-[family-name:var(--font-serif)] text-[1.15rem] text-[var(--clr-text)]">
            Frecuencia de tu aporte
          </legend>
          <div className="grid grid-cols-2 gap-[var(--space-sm)] max-[640px]:grid-cols-1">
            <RadioChoice
              name="frequency"
              value="recurring"
              checked={values.frequency === "recurring"}
              onChange={(value) => setField("frequency", value)}
              title="Apadrinamiento continuo"
              description="Quiero seguir apoyando este aporte periódicamente."
            />
            <RadioChoice
              name="frequency"
              value="single"
              checked={values.frequency === "single"}
              onChange={(value) => setField("frequency", value)}
              title="Donación única"
              description="Solo quiero depositar este monto por ahora."
            />
          </div>
        </fieldset>

        <label className="flex items-start gap-[var(--space-sm)] text-[0.78rem] text-[var(--clr-text-secondary)]">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => setField("consent", e.target.checked)}
            className="mt-1 shrink-0 accent-[var(--clr-primary)]"
          />
          <span>
            Acepto que el equipo de la reserva se comunique conmigo para
            confirmar la donación.
          </span>
        </label>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="justify-center self-start max-[640px]:w-full"
        >
          {isSubmitting ? "Registrando aporte..." : "Continuar con mi donación"}
        </Button>
      </form>

      {thankYouMessage && (
        <div aria-live="polite" className="animate-fade-up pt-[1%]">
          <pre className="whitespace-pre-wrap rounded-[var(--radius-2xl)] border border-[color-mix(in_srgb,var(--clr-primary)_30%,var(--clr-border))] bg-[color-mix(in_srgb,var(--clr-primary)_6%,var(--clr-bg))] p-[var(--space-xl)] font-[family-name:var(--font-sans)] text-[1rem] font-normal leading-[1.8] text-[var(--clr-text)]">
            {thankYouMessage}
          </pre>
        </div>
      )}
    </>
  );
}
