import type { Metadata } from "next";
import AdminPage from "@/src/features/catalogo/components/AdminPage";

export const metadata: Metadata = { title: "Administración" };

export default function Page() {
  return <AdminPage />;
}

