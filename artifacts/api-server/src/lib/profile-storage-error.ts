export function profileStorageError(error: unknown): { status: number; code: string; error: string } | null {
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
  if (code === "403" || code === "401") return { status: 503, code: "PROFILE_STORAGE_ACCESS_DENIED", error: "Photo storage is unavailable because the server's storage access needs attention. Please contact support." };
  if (code === "404") return { status: 503, code: "PROFILE_STORAGE_NOT_FOUND", error: "The profile photo or its storage location is unavailable. Please contact support." };
  return null;
}
