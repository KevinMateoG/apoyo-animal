import type { Metadata } from "next";
import SponsorshipPage from "@/src/features/interaccion/components/SponsorshipPage";

export const metadata: Metadata = { title: "Apadrinar y donar" };

export default function Page() {
  return <SponsorshipPage />;
}
