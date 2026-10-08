import { randomUUID } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { sqlClient } from "../lib/db";
import { storage } from "../lib/firebase-admin";
import { authenticate } from "../middlewares/auth";
import { validateStudentProfile, validatedAvatar } from "../lib/student-profile-validation";

const router = Router();
router.use(authenticate);
async function studentId(req: Request): Promise<string | null> {
  const [row] = await sqlClient`
    SELECT u.id::text AS id FROM identity.users u
    JOIN identity.auth_identities ai ON ai.user_id = u.id AND ai.provider = 'firebase'
    JOIN identity.student_profiles sp ON sp.user_id = u.id
    WHERE ai.provider_subject = ${req.user?.id ?? ""} AND u.deleted_at IS NULL AND u.status = 'active'::user_status
    LIMIT 1
  `;
  return row?.id ? String(row.id) : null;
}
function failure(res: Response, error: unknown) {
  const code = (error as { code?: string })?.code;
  if (code === "23505") return res.status(409).json({ error: "That email or mobile number is already linked to another account." });
  console.error("Student profile request failed", error instanceof Error ? error.message : "Unknown error");
  return res.status(500).json({ error: "Unable to update your profile. Please try again." });
}
async function profile(userId: string, req: Request) {
  const [row] = await sqlClient`
    SELECT COALESCE(d.full_name, u.display_name) AS "fullName",
      to_char(d.date_of_birth, 'YYYY-MM-DD') AS "dateOfBirth",
      d.state, d.city, d.address, d.social_category AS "socialCategory",
      COALESCE(d.preferred_language_code, sp.preferred_language_code, 'en') AS "preferredLanguageCode",
      (d.avatar_key IS NOT NULL) AS "hasPhoto", u.email, u.phone AS "phoneNumber"
    FROM identity.users u JOIN identity.student_profiles sp ON sp.user_id = u.id
    LEFT JOIN identity.student_profile_details d ON d.user_id = u.id
    WHERE u.id = ${userId}::uuid
  `;
  return { ...row, emailVerified: !!req.user?.emailVerified && req.user?.email?.toLowerCase() === String(row?.email ?? "").toLowerCase(),
    phoneVerified: !!req.user?.phoneNumber && req.user.phoneNumber === row?.phoneNumber };
}
router.get("/me/profile", async (req, res) => {
  try {
    const id = await studentId(req);
    if (!id) return res.status(403).json({ error: "Active student account required" });
    res.setHeader("Cache-Control", "private, no-store");
    return res.json(await profile(id, req));
  } catch (error) { return failure(res, error); }
});
router.put("/me/profile", async (req, res) => {
  let input;
  try { input = validateStudentProfile(req.body); }
  catch (error) { return res.status(400).json({ error: (error as Error).message }); }
  try {
    const id = await studentId(req);
    if (!id) return res.status(403).json({ error: "Active student account required" });
    await sqlClient.begin(async tx => {
      await tx`
        INSERT INTO identity.student_profile_details (user_id, full_name, date_of_birth, state, city, address, social_category, preferred_language_code)
        VALUES (${id}::uuid, ${input.fullName}, ${input.dateOfBirth}::date, ${input.state}, ${input.city}, ${input.address}, ${input.socialCategory}, ${input.preferredLanguageCode})
        ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, date_of_birth = EXCLUDED.date_of_birth,
          state = EXCLUDED.state, city = EXCLUDED.city, address = EXCLUDED.address, social_category = EXCLUDED.social_category,
          preferred_language_code = EXCLUDED.preferred_language_code, updated_at = now()
      `;
      await tx`UPDATE identity.users SET display_name = ${input.fullName}, updated_at = now() WHERE id = ${id}::uuid`;
      await tx`UPDATE identity.student_profiles SET preferred_language_code = ${input.preferredLanguageCode} WHERE user_id = ${id}::uuid`;
    });
    return res.json(await profile(id, req));
  } catch (error) { return failure(res, error); }
});
router.post("/me/profile/contact-availability", async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const phone = typeof req.body?.phoneNumber === "string" ? req.body.phoneNumber.trim() : "";
  if ((!email && !phone) || (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) || (phone && !/^\+[1-9]\d{7,14}$/.test(phone))) {
    return res.status(400).json({ error: "Enter a valid email or mobile number" });
  }
  try {
    const id = await studentId(req);
    if (!id) return res.status(403).json({ error: "Active student account required" });
    const rows = await sqlClient`SELECT id FROM identity.users WHERE id <> ${id}::uuid
      AND ((${email} <> '' AND lower(email) = ${email}) OR (${phone} <> '' AND phone = ${phone})) LIMIT 1`;
    if (rows.length) return res.status(409).json({ error: "That email or mobile number is already linked to another account." });
    return res.json({ available: true });
  } catch (error) { return failure(res, error); }
});
router.post("/me/profile/sync-contacts", async (req, res) => {
  // Values come only from the verified Firebase token, never a form body.
  const email = req.user?.emailVerified ? req.user.email?.trim().toLowerCase() ?? null : null;
  const phone = req.user?.phoneNumber ?? null;
  try {
    const id = await studentId(req);
    if (!id) return res.status(403).json({ error: "Active student account required" });
    const conflicts = await sqlClient`SELECT id FROM identity.users WHERE id <> ${id}::uuid
      AND ((${email}::text IS NOT NULL AND lower(email) = ${email}) OR (${phone}::text IS NOT NULL AND phone = ${phone})) LIMIT 1`;
    if (conflicts.length) return res.status(409).json({ error: "That email or mobile number is already linked to another account." });
    await sqlClient`UPDATE identity.users SET email = COALESCE(${email}, email), phone = COALESCE(${phone}, phone),
      updated_at = now() WHERE id = ${id}::uuid`;
    return res.json(await profile(id, req));
  } catch (error) { return failure(res, error); }
});
router.get("/me/profile/photo", async (req, res) => {
  try {
    const id = await studentId(req);
    if (!id) return res.status(403).json({ error: "Active student account required" });
    const [row] = await sqlClient`SELECT avatar_key AS key FROM identity.student_profile_details WHERE user_id = ${id}::uuid`;
    if (!row?.key) return res.json({ photo: null });
    if (!storage) return res.status(503).json({ error: "Photo storage is unavailable" });
    res.setHeader("Cache-Control", "private, no-store");
    const [bytes] = await storage.bucket().file(String(row.key)).download();
    return res.json({ photo: "data:image/jpeg;base64," + bytes.toString("base64") });
  } catch (error) { return failure(res, error); }
});
router.put("/me/profile/photo", async (req, res) => {
  let bytes;
  try { bytes = validatedAvatar(req.body?.photo); }
  catch (error) { return res.status(400).json({ error: (error as Error).message }); }
  try {
    const id = await studentId(req);
    if (!id) return res.status(403).json({ error: "Active student account required" });
    if (!storage) return res.status(503).json({ error: "Photo storage is unavailable" });
    const [previous] = await sqlClient`SELECT avatar_key AS key FROM identity.student_profile_details WHERE user_id = ${id}::uuid`;
    const key = "student-profile-photos/" + id + "/" + randomUUID() + ".jpg";
    const file = storage.bucket().file(key);
    await file.save(bytes, { resumable: false, metadata: { contentType: "image/jpeg", cacheControl: "private, no-store" } });
    try {
      await sqlClient`INSERT INTO identity.student_profile_details (user_id, avatar_key, preferred_language_code)
        SELECT user_id, ${key}, preferred_language_code FROM identity.student_profiles WHERE user_id = ${id}::uuid ON CONFLICT (user_id) DO UPDATE SET avatar_key = EXCLUDED.avatar_key, updated_at = now()`;
    } catch (error) { await file.delete().catch(() => undefined); throw error; }
    if (previous?.key) await storage.bucket().file(String(previous.key)).delete().catch(() => undefined);
    res.setHeader("Cache-Control", "private, no-store");
    return res.json({ photo: "data:image/jpeg;base64," + bytes.toString("base64") });
  } catch (error) { return failure(res, error); }
});
export default router;
