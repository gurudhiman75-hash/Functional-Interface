import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const PLACEMENTS = new Set(["home", "login_popup", "learn", "tests", "results"]);
const DESTINATION_TYPES = new Set(["exam", "test_series", "learn", "page", "url", "none"]);
const CAMPAIGN_KINDS = new Set(["internal", "external"]);

function text(value: unknown, max = 1000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function dateOrNull(value: unknown): string | null {
  const raw = text(value, 80);
  if (!raw) return null;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}
function integerOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}
function stringList(value: unknown, maxItems = 100): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => text(item, 100)).filter(Boolean))].slice(0, maxItems);
}
function normalizeAudience(value: unknown) {
  const raw = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const languageCodes = stringList(raw.languageCodes, 3)
    .map((value) => value.toLowerCase())
    .filter((value) => ["en", "hi", "pa"].includes(value));
  const examIds = stringList(raw.examIds, 100)
    .filter((value) => /^[0-9a-f-]{36}$/i.test(value));
  return { languageCodes, examIds };
}
function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}
function normalize(input: unknown) {
  const raw = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const placement = text(raw.placement, 40) || "home";
  const destinationType = text(raw.destinationType, 40) || "none";
  const campaignKind = text(raw.campaignKind, 40) || "internal";
  const frequencyCapPerDay = integerOrNull(raw.frequencyCapPerDay);
  return {
    title: text(raw.title, 140),
    subtitle: text(raw.subtitle, 280),
    imageUrl: text(raw.imageUrl, 1000),
    placement: PLACEMENTS.has(placement) ? placement : "home",
    destinationType: DESTINATION_TYPES.has(destinationType) ? destinationType : "none",
    destinationValue: text(raw.destinationValue, 1000),
    campaignKind: CAMPAIGN_KINDS.has(campaignKind) ? campaignKind : "internal",
    isDismissible: raw.isDismissible !== false,
    frequencyCapPerDay: frequencyCapPerDay == null ? null : Math.max(1, Math.min(50, frequencyCapPerDay)),
    audience: normalizeAudience(raw.audience),
    isActive: raw.isActive !== false,
    startAt: dateOrNull(raw.startAt),
    endAt: dateOrNull(raw.endAt),
    sortOrder: Number.isFinite(Number(raw.sortOrder)) ? Math.max(0, Math.min(999, Number(raw.sortOrder))) : 1,
  };
}
function assertValid(input: ReturnType<typeof normalize>) {
  if (input.title.length < 2) throw Object.assign(new Error("Promotion title must contain at least 2 characters."), { statusCode: 400, code: "MOBILE_PROMOTION_TITLE_INVALID" });
  if (input.startAt && input.endAt && new Date(input.endAt) < new Date(input.startAt)) throw Object.assign(new Error("Promotion end time cannot be before its start time."), { statusCode: 400, code: "MOBILE_PROMOTION_WINDOW_INVALID" });
  if (input.campaignKind === "external" && input.destinationType !== "url") throw Object.assign(new Error("External campaigns must use a URL destination."), { statusCode: 400, code: "MOBILE_PROMOTION_EXTERNAL_DESTINATION_INVALID" });
  if (["exam", "test_series", "page"].includes(input.destinationType) && !input.destinationValue) throw Object.assign(new Error("This destination requires a target identifier."), { statusCode: 400, code: "MOBILE_PROMOTION_DESTINATION_REQUIRED" });
  if (input.destinationType === "url" && !isHttpUrl(input.destinationValue)) throw Object.assign(new Error("URL destinations must use http:// or https://."), { statusCode: 400, code: "MOBILE_PROMOTION_URL_INVALID" });
}

router.use(authenticate);

router.get("/", requireAdminPermission("content.taxonomy.read"), async (_req, res) => {
  try {
    const [rows, exams] = await Promise.all([
      sqlClient`
        SELECT
          id::text AS id,
          title,
          subtitle,
          image_url AS "imageUrl",
          placement,
          destination_type AS "destinationType",
          destination_value AS "destinationValue",
          campaign_kind AS "campaignKind",
          is_dismissible AS "isDismissible",
          frequency_cap_per_day AS "frequencyCapPerDay",
          audience,
          is_active AS "isActive",
          start_at AS "startAt",
          end_at AS "endAt",
          sort_order AS "sortOrder",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM platform.mobile_promotions
        ORDER BY placement, sort_order, updated_at DESC
      `,
      sqlClient`
        SELECT e.id::text AS id, e.code, e.name, f.name AS "familyName"
        FROM catalog.exams e
        JOIN catalog.exam_families f ON f.id=e.family_id
        WHERE e.is_active=true AND f.is_active=true
        ORDER BY f.name,e.name
        LIMIT 500
      `
    ]);
    res.json({ promotions: rows, catalog: { exams }, generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Unable to load mobile promotions", error);
    res.status(500).json({ error: "Unable to load mobile promotions", code: "MOBILE_PROMOTIONS_LOAD_FAILED" });
  }
});

router.post("/", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  try {
    const input = normalize(req.body);
    assertValid(input);
    const id = randomUUID();
    const actorUserId = req.adminSession!.user.id;
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO platform.mobile_promotions (
          id,title,subtitle,image_url,placement,destination_type,destination_value,campaign_kind,
          is_dismissible,frequency_cap_per_day,audience,is_active,start_at,end_at,sort_order,
          created_by,updated_by,created_at,updated_at
        ) VALUES (
          ${id}::uuid,${input.title},${input.subtitle},${input.imageUrl},${input.placement},${input.destinationType},${input.destinationValue},${input.campaignKind},
          ${input.isDismissible},${input.frequencyCapPerDay},${tx.json(input.audience)},${input.isActive},${input.startAt}::timestamptz,${input.endAt}::timestamptz,${input.sortOrder},
          ${actorUserId}::uuid,${actorUserId}::uuid,now(),now()
        )
      `;
      await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata)
        VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actorUserId}::uuid,'mobile.promotion.created','mobile_promotion',${id}::uuid,'Created mobile promotion','Admin created a mobile promotion campaign',${tx.json({ title: input.title, placement: input.placement, campaignKind: input.campaignKind })})`;
    });
    res.status(201).json({ id });
  } catch (error) {
    const typed=error as {statusCode?:number;code?:string;message?:string};
    res.status(typed.statusCode??500).json({error:typed.message??"Unable to create mobile promotion",code:typed.code??"MOBILE_PROMOTION_CREATE_FAILED"});
  }
});

router.put("/:id", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  try {
    const id=text(req.params.id,80);
    if(!/^[0-9a-f-]{36}$/i.test(id)) return void res.status(400).json({error:"Invalid promotion identifier",code:"MOBILE_PROMOTION_ID_INVALID"});
    const input=normalize(req.body);assertValid(input);const actorUserId=req.adminSession!.user.id;
    const rows=await sqlClient`
      UPDATE platform.mobile_promotions SET
        title=${input.title},subtitle=${input.subtitle},image_url=${input.imageUrl},placement=${input.placement},
        destination_type=${input.destinationType},destination_value=${input.destinationValue},campaign_kind=${input.campaignKind},
        is_dismissible=${input.isDismissible},frequency_cap_per_day=${input.frequencyCapPerDay},audience=${sqlClient.json(input.audience)},
        is_active=${input.isActive},start_at=${input.startAt}::timestamptz,end_at=${input.endAt}::timestamptz,sort_order=${input.sortOrder},
        updated_by=${actorUserId}::uuid,updated_at=now()
      WHERE id=${id}::uuid
      RETURNING id::text AS id
    `;
    if(rows.length===0)return void res.status(404).json({error:"Promotion not found",code:"MOBILE_PROMOTION_NOT_FOUND"});
    await sqlClient`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata)
      VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actorUserId}::uuid,'mobile.promotion.updated','mobile_promotion',${id}::uuid,'Updated mobile promotion','Admin updated a mobile promotion campaign',${sqlClient.json({ title: input.title, placement: input.placement, isActive: input.isActive })})`;
    res.json({id});
  } catch(error){const typed=error as {statusCode?:number;code?:string;message?:string};res.status(typed.statusCode??500).json({error:typed.message??"Unable to update mobile promotion",code:typed.code??"MOBILE_PROMOTION_UPDATE_FAILED"});}
});


router.delete("/:id", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  try {
    const id=text(req.params.id,80);
    if(!/^[0-9a-f-]{36}$/i.test(id)) return void res.status(400).json({error:"Invalid promotion identifier",code:"MOBILE_PROMOTION_ID_INVALID"});
    const actorUserId=req.adminSession!.user.id;
    const rows=await sqlClient`
      DELETE FROM platform.mobile_promotions
      WHERE id=${id}::uuid
      RETURNING id::text AS id,title,placement
    `;
    if(rows.length===0)return void res.status(404).json({error:"Promotion not found",code:"MOBILE_PROMOTION_NOT_FOUND"});
    await sqlClient`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata)
      VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${actorUserId}::uuid,'mobile.promotion.deleted','mobile_promotion',${id}::uuid,'Deleted mobile promotion','Admin deleted a mobile promotion campaign',${sqlClient.json({ title: rows[0]!.title, placement: rows[0]!.placement })})`;
    res.json({id});
  } catch(error){const typed=error as {statusCode?:number;code?:string;message?:string};res.status(typed.statusCode??500).json({error:typed.message??"Unable to delete mobile promotion",code:typed.code??"MOBILE_PROMOTION_DELETE_FAILED"});}
});

export default router;
