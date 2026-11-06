export type DonationType = "animal" | "general";
export type DonationFrequency = "recurring" | "single";
export type SponsorshipStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface SponsorshipFormValues {
  donationType: DonationType;
  animalId: string;
  name: string;
  email: string;
  address: string;
  amount: string;
  frequency: DonationFrequency;
  consent: boolean;
}

export interface SponsorshipRequest {
  donationType: DonationType;
  animalId: string | null;
  name: string;
  email: string;
  address: string;
  amount: number;
  frequency: DonationFrequency;
}

export interface SponsorshipRecord {
  id: string;
  type: "ANIMAL" | "GENERAL";
  frequency: "SINGLE" | "RECURRING";
  status: SponsorshipStatus;
  amount: number;
  userId: string;
  animalId: string | null;
  donorName: string;
  donorEmail: string;
  donorAddress: string;
  animal?: {
    id: string;
    name: string;
    speciesId: string;
    speciesCommonName?: string;
  } | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export const INITIAL_SPONSORSHIP_VALUES: SponsorshipFormValues = {
  donationType: "animal",
  animalId: "",
  name: "",
  email: "",
  address: "",
  amount: "",
  frequency: "recurring",
  consent: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_SPONSORSHIP_AMOUNT = 10_000_000;

export function validateSponsorship(values: SponsorshipFormValues): string[] {
  const errors: string[] = [];

  if (values.donationType === "animal" && !values.animalId) {
    errors.push("Debes seleccionar el animal que quieres apadrinar.");
  }

  if (!values.name.trim()) {
    errors.push("El nombre completo es obligatorio.");
  }

  const email = values.email.trim();
  if (!email) {
    errors.push("El correo electrónico es obligatorio.");
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push("El correo electrónico no tiene un formato válido.");
  }

  if (!values.address.trim()) {
    errors.push("La dirección es obligatoria.");
  }

  const amount = Number(values.amount);
  if (!Number.isFinite(amount) || amount < 1) {
    errors.push("El valor del aporte debe ser un número mayor a 0.");
  } else if (amount > MAX_SPONSORSHIP_AMOUNT) {
    errors.push(
      "El valor del aporte no puede superar los $10.000.000 COP.",
    );
  }

  if (!values.consent) {
    errors.push("Debes aceptar que el equipo se comunique contigo.");
  }

  return errors;
}

export function toSponsorshipRequest(
  values: SponsorshipFormValues,
): SponsorshipRequest {
  return {
    donationType: values.donationType,
    animalId: values.donationType === "animal" ? values.animalId : null,
    name: values.name.trim(),
    email: values.email.trim(),
    address: values.address.trim(),
    amount: Number(values.amount),
    frequency: values.frequency,
  };
}

export function buildThankYouMessage(
  userName: string,
  donationType: DonationType,
  animalName: string | null,
): string {
  return donationType === "animal"
    ? `¡Muchas gracias! ${userName}, ${animalName} va a estar muy agradecido contigo, gracias por tu grano de arena 🌿`
    : `¡Muchas gracias! ${userName}, tu generosidad ayuda directamente al bienestar de toda la reserva. Cada aporte cuenta y el nuestro lo sabe 🌿`;
}
