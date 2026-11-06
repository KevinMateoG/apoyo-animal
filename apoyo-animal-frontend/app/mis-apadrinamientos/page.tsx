import type { Metadata } from "next";
import MySponsorshipsPage from "@/src/features/interaccion/components/MySponsorshipsPage";

export const metadata: Metadata = { title: "Mis apadrinamientos" };

export default function Page() {
  return <MySponsorshipsPage />;
}

