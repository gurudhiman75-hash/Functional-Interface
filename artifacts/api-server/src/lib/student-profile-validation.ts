export interface StudentProfileInput {
  fullName: string;
  dateOfBirth: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  socialCategory: string | null;
  preferredLanguageCode: string;
}
export function validateStudentProfile(body: unknown, today = new Date().toISOString().slice(0, 10)): StudentProfileInput {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid profile");
  const value = body as Record<string, unknown>;
  const allowed = new Set(["fullName", "dateOfBirth", "state", "city", "address", "socialCategory", "preferredLanguageCode"]);
  if (Object.keys(value).some(key => !allowed.has(key))) throw new Error("Unsupported profile field");
  function text(key: string, max: number): string | null {
    const item = value[key];
    if (item == null || item === "") return null;
    if (typeof item !== "string" || item.trim().length > max || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(item)) throw new Error("Invalid " + key);
    return item.trim() || null;
  }
  const fullName = text("fullName", 120);
  if (!fullName) throw new Error("Enter your name");
  const dateOfBirth = text("dateOfBirth", 10);
  if (dateOfBirth) {
    const parsed = new Date(dateOfBirth + "T00:00:00Z");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) || Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== dateOfBirth || dateOfBirth < "1900-01-01" || dateOfBirth > today) {
      throw new Error("Enter a valid date of birth");
    }
  }
  const socialCategory = text("socialCategory", 20);
  if (socialCategory && !["General", "SC", "ST", "OBC", "EWS", "BC", "Other"].includes(socialCategory)) throw new Error("Invalid social category");
  const preferredLanguageCode = text("preferredLanguageCode", 2) ?? "en";
  if (!["en", "hi", "pa"].includes(preferredLanguageCode)) throw new Error("Invalid language");
  return { fullName, dateOfBirth, state: text("state", 80), city: text("city", 100), address: text("address", 500), socialCategory, preferredLanguageCode };
}
export function validatedAvatar(value: unknown): Buffer {
  if (typeof value !== "string" || value.length > 350000 || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value)) throw new Error("Choose a JPEG photo under 250 KB");
  const bytes = Buffer.from(value.split(",")[1], "base64");
  if (bytes.length > 250000 || bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) throw new Error("Invalid JPEG photo");
  return bytes;
}
