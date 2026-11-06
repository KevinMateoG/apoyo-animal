"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import type { Animal } from "@/src/features/catalogo/domain/animal";
import { HttpError } from "@/src/features/common/http";
import {
  buildThankYouMessage,
  INITIAL_SPONSORSHIP_VALUES,
  type SponsorshipFormValues,
  toSponsorshipRequest,
  validateSponsorship,
} from "../domain/sponsorship";
import { createSponsorship } from "../services/sponsorship.service";

export function useSponsorshipForm(animals: Animal[]) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [values, setValues] = useState(INITIAL_SPONSORSHIP_VALUES);
  const [errors, setErrors] = useState<string[]>([]);
  const [thankYouMessage, setThankYouMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectiveValues: SponsorshipFormValues = {
    ...values,
    name: values.name || user?.name || "",
    email: values.email || user?.email || "",
  };

  const setField = <K extends keyof SponsorshipFormValues>(
    key: K,
    value: SponsorshipFormValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const validationErrors = validateSponsorship(effectiveValues);
    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createSponsorship(toSponsorshipRequest(effectiveValues));

      const animalName =
        effectiveValues.donationType === "animal"
          ? (animals.find((a) => a.id === effectiveValues.animalId)?.name ??
            effectiveValues.animalId)
          : null;

      setThankYouMessage(
        buildThankYouMessage(
          effectiveValues.name.trim(),
          effectiveValues.donationType,
          animalName,
        ),
      );
      setValues(INITIAL_SPONSORSHIP_VALUES);
    } catch (error) {
      if (error instanceof HttpError) {
        const detailMessages = error.details
          ? Object.values(error.details).flat()
          : [];
        setErrors(
          detailMessages.length > 0 ? detailMessages : [error.message],
        );
      } else {
        setErrors(["No pudimos registrar tu aporte. Inténtalo de nuevo."]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values: effectiveValues,
    setField,
    errors,
    thankYouMessage,
    isSubmitting,
    handleSubmit,
    isAuthenticated,
  };
}
