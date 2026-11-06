import type { Metadata } from "next";
import CatalogPage from "@/src/features/catalogo/components/CatalogPage";

export const metadata: Metadata = { title: "Ejemplares" };

export default function Page() {
  return <CatalogPage />;
}
