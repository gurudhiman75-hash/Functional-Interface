import { apiRequest } from "@/lib/api";
export interface StudentProfile {
  fullName: string; dateOfBirth: string | null; state: string | null; city: string | null;
  address: string | null; socialCategory: string | null; preferredLanguageCode: string;
  hasPhoto: boolean; email: string | null; phoneNumber: string | null;
  emailVerified: boolean; phoneVerified: boolean;
}
export type StudentProfileFields = Pick<StudentProfile, "fullName" | "dateOfBirth" | "state" | "city" | "address" | "socialCategory" | "preferredLanguageCode">;
export const loadStudentProfile = () => apiRequest<StudentProfile>("/users/me/profile");
export const saveStudentProfile = (fields: StudentProfileFields) => apiRequest<StudentProfile>("/users/me/profile", { method: "PUT", body: JSON.stringify(fields) });
export const syncProfileContacts = () => apiRequest<StudentProfile>("/users/me/profile/sync-contacts", { method: "POST", body: "{}" });
export const checkProfileContact = (contact: { email?: string; phoneNumber?: string }) => apiRequest("/users/me/profile/contact-availability", { method: "POST", body: JSON.stringify(contact) });
export const loadProfilePhoto = () => apiRequest<{ photo: string | null }>("/users/me/profile/photo");
export const uploadProfilePhoto = (photo: string) => apiRequest<{ photo: string }>("/users/me/profile/photo", { method: "PUT", body: JSON.stringify({ photo }) });

export async function prepareProfilePhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5_000_000) throw new Error("Choose a JPG, PNG or WebP photo under 5 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url; await image.decode();
    const canvas = document.createElement("canvas"); canvas.width = 320; canvas.height = 320;
    const ctx = canvas.getContext("2d");
    if (!ctx || !image.naturalWidth || !image.naturalHeight) throw new Error("Unable to open this photo.");
    const size = Math.min(image.naturalWidth, image.naturalHeight);
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 320, 320);
    ctx.drawImage(image, (image.naturalWidth - size) / 2, (image.naturalHeight - size) / 2, size, size, 0, 0, 320, 320);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally { URL.revokeObjectURL(url); }
}
