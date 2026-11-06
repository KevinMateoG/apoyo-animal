import { http } from "@/src/features/common/http";

export type UploadFolder = "animals" | "species";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("No se pudo leer el archivo seleccionado"));
      }
    };
    reader.onerror = () =>
      reject(new Error("Error al leer el archivo seleccionado"));
    reader.readAsDataURL(file);
  });
}

export async function uploadCatalogImage(
  file: File,
  folder: UploadFolder = "animals",
): Promise<string> {
  const dataBase64 = await fileToBase64(file);

  const response = await http<{ data: { imageUrl: string; key: string } }>(
    "/api/uploads",
    {
      method: "POST",
      body: {
        fileName: file.name,
        contentType: file.type || "image/jpeg",
        dataBase64,
        folder,
      },
    },
  );

  return response.data.imageUrl;
}

