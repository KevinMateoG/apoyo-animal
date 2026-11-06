import { http } from "@/src/features/common/http";
import type {
  SponsorshipRecord,
  SponsorshipRequest,
  SponsorshipStatus,
} from "../domain/sponsorship";

export async function createSponsorship(
  request: SponsorshipRequest,
): Promise<SponsorshipRecord> {
  const response = await http<{ data: SponsorshipRecord }>(
    "/api/sponsorships",
    {
      method: "POST",
      body: {
        type: request.donationType === "animal" ? "ANIMAL" : "GENERAL",
        frequency: request.frequency === "recurring" ? "RECURRING" : "SINGLE",
        amount: request.amount,
        animalId: request.animalId,
        donorName: request.name,
        donorEmail: request.email,
        donorAddress: request.address,
        consent: true,
      },
    },
  );
  return response.data;
}

export async function getMySponsorships(): Promise<SponsorshipRecord[]> {
  const response = await http<{ data: SponsorshipRecord[] }>(
    "/api/sponsorships/mias",
    {
      method: "GET",
    },
  );
  return response.data;
}

export async function getAllSponsorships(): Promise<SponsorshipRecord[]> {
  const response = await http<{ data: SponsorshipRecord[] }>(
    "/api/sponsorships",
    {
      method: "GET",
    },
  );
  return response.data;
}

export async function updateSponsorshipStatus(
  id: string,
  status: SponsorshipStatus,
): Promise<SponsorshipRecord> {
  const response = await http<{ data: SponsorshipRecord }>(
    `/api/sponsorships/${id}/status`,
    {
      method: "PATCH",
      body: { status },
    },
  );
  return response.data;
}
