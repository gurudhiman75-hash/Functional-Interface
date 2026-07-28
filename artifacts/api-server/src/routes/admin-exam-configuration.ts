import { randomUUID } from "node:crypto";
import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const codePattern = /^[A-Z][A-Z0-9_-]{1,79}$/;

router.use(authenticate);

function text(value: unknown, max = 500): string { return typeof value === "string" ? value.trim().slice(0, max) : ""; }
function positiveInt(value: unknown, fallback: number): number { const number = Math.floor(Number(value)); return Number.isSafeInteger(number) && number > 0 ? number : fallback; }
function finiteNumber(value: unknown, fallback: number): number { const number = Number(value); return Number.isFinite(number) ? number : fallback; }
function ruleProfile(body: Record<string, unknown>) {
  const durationMinutes = positiveInt(body.durationMinutes, 60);
  const totalQuestions = positiveInt(body.totalQuestions, 100);
  const marksPerCorrect = finiteNumber(body.marksPerCorrect, 1);
  const negativeMarksPerWrong = Math.max(0, finiteNumber(body.negativeMarksPerWrong, 0));
  const unattemptedMarks = finiteNumber(body.unattemptedMarks, 0);
  if (durationMinutes > 600 || totalQuestions > 1000 || marksPerCorrect <= 0 || marksPerCorrect > 100 || negativeMarksPerWrong > 100 || Math.abs(unattemptedMarks) > 100) {
    throw Object.assign(new Error("Exam rule profile is outside supported limits"), { statusCode: 400, code: "INVALID_EXAM_RULE_PROFILE" });
  }
  return { durationMinutes, totalQuestions, marksPerCorrect, negativeMarksPerWrong, unattemptedMarks };
}

router.get("/", requireAdminPermission("content.taxonomy.read"), async (_req, res) => {
  try {
    const [families, exams, versions, languages] = await Promise.all([
      sqlClient`SELECT f.id::text AS id,f.code,f.name,f.description,f.is_active AS "isActive",COUNT(e.id)::int AS "examCount" FROM catalog.exam_families f LEFT JOIN catalog.exams e ON e.family_id=f.id GROUP BY f.id ORDER BY f.name`,
      sqlClient`SELECT e.id::text AS id,e.family_id::text AS "familyId",e.code,e.name,e.description,e.is_active AS "isActive",e.updated_at AS "updatedAt",COUNT(v.id)::int AS "versionCount",MAX(v.version_number)::int AS "latestVersionNumber",MAX(v.id::text) FILTER (WHERE v.is_current) AS "currentVersionId" FROM catalog.exams e LEFT JOIN catalog.exam_versions v ON v.exam_id=e.id GROUP BY e.id ORDER BY e.name`,
      sqlClient`
        SELECT v.id::text AS id,v.exam_id::text AS "examId",v.version_number AS "versionNumber",v.name,v.effective_from AS "effectiveFrom",v.effective_until AS "effectiveUntil",v.is_current AS "isCurrent",v.created_at AS "createdAt",
          COALESCE((SELECT json_agg(json_build_object('id',l.id::text,'code',l.code,'name',l.name,'isPrimary',evl.is_primary) ORDER BY evl.is_primary DESC,l.name) FROM catalog.exam_version_languages evl JOIN catalog.languages l ON l.id=evl.language_id WHERE evl.exam_version_id=v.id),'[]'::json) AS languages,
          latest.metadata->'ruleProfile' AS "ruleProfile",latest.reason AS "changeReason",latest.occurred_at AS "configuredAt"
        FROM catalog.exam_versions v
        LEFT JOIN LATERAL (SELECT ae.metadata,ae.reason,ae.occurred_at FROM platform.audit_events ae WHERE ae.entity_type='exam_version' AND ae.entity_id=v.id AND ae.action_key='settings.exam_version.created' ORDER BY ae.occurred_at DESC,ae.id DESC LIMIT 1) latest ON true
        ORDER BY v.exam_id,v.version_number DESC`,
      sqlClient`SELECT id::text AS id,code,name,native_name AS "nativeName",is_active AS "isActive" FROM catalog.languages ORDER BY name`,
    ]);
    res.json({ families, exams, versions, languages, generatedAt: new Date().toISOString(), ruleStorage: "immutable_creation_audit_metadata" });
  } catch (error) { console.error("Unable to load exam configuration", error); res.status(500).json({ error: "Unable to load exam configuration", code: "EXAM_CONFIGURATION_LOAD_FAILED" }); }
});

router.post("/families", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const code = text(req.body?.code, 80).toUpperCase(); const name = text(req.body?.name, 200); const description = text(req.body?.description, 2000);
  if (!codePattern.test(code) || name.length < 2) return void res.status(400).json({ error: "A valid family code and name are required", code: "INVALID_EXAM_FAMILY" });
  try {
    const id = randomUUID();
    await sqlClient.begin(async (tx) => { await tx`INSERT INTO catalog.exam_families (id,code,name,description,is_active) VALUES (${id}::uuid,${code},${name},${description || null},true)`; await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata) VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${req.adminSession!.user.id}::uuid,'settings.exam_family.created','exam_family',${id}::uuid,${`Created exam family ${code}`},${description || null},${tx.json({ code,name })})`; });
    res.status(201).json({ id });
  } catch (error) { console.error("Unable to create exam family", error); res.status(409).json({ error: "Unable to create exam family; the code may already exist", code: "EXAM_FAMILY_CREATE_FAILED" }); }
});

router.post("/exams", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const familyId = text(req.body?.familyId, 50); const code = text(req.body?.code, 80).toUpperCase(); const name = text(req.body?.name, 200); const description = text(req.body?.description, 2000);
  if (!uuid.test(familyId) || !codePattern.test(code) || name.length < 2) return void res.status(400).json({ error: "A valid family, exam code and name are required", code: "INVALID_EXAM" });
  try { const id=randomUUID(); await sqlClient.begin(async(tx)=>{ await tx`INSERT INTO catalog.exams (id,family_id,code,name,description,is_active) VALUES (${id}::uuid,${familyId}::uuid,${code},${name},${description||null},true)`; await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata) VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${req.adminSession!.user.id}::uuid,'settings.exam.created','exam',${id}::uuid,${`Created exam ${code}`},${description||null},${tx.json({ familyId,code,name })})`; }); res.status(201).json({id}); } catch(error){console.error("Unable to create exam",error);res.status(409).json({error:"Unable to create exam; verify the family and unique code",code:"EXAM_CREATE_FAILED"});}
});

router.post("/exams/:examId/versions", requireAdminPermission("content.taxonomy.manage"), async (req, res) => {
  const examId=String(req.params.examId??""); const name=text(req.body?.name,200); const reason=text(req.body?.changeReason,1000); const languageIds=Array.isArray(req.body?.languageIds)?[...new Set(req.body.languageIds.map((v:unknown)=>String(v)).filter((v:string)=>uuid.test(v)))]:[]; const primaryLanguageId=text(req.body?.primaryLanguageId,50);
  if(!uuid.test(examId)||name.length<2||reason.length<8||languageIds.length===0||!languageIds.includes(primaryLanguageId)) return void res.status(400).json({error:"Version name, change reason and at least one primary language are required",code:"INVALID_EXAM_VERSION"});
  try { const profile=ruleProfile(req.body??{}); const id=randomUUID(); const result=await sqlClient.begin(async(tx)=>{ await tx`SELECT pg_advisory_xact_lock(hashtext(${`exam-version:${examId}`}))`; const rows=await tx`SELECT COALESCE(MAX(version_number),0)::int+1 AS next FROM catalog.exam_versions WHERE exam_id=${examId}::uuid`; const versionNumber=Number(rows[0].next); await tx`INSERT INTO catalog.exam_versions (id,exam_id,version_number,name,effective_from,effective_until,is_current) VALUES (${id}::uuid,${examId}::uuid,${versionNumber},${name},${req.body?.effectiveFrom||null},${req.body?.effectiveUntil||null},false)`; for(const languageId of languageIds) await tx`INSERT INTO catalog.exam_version_languages (exam_version_id,language_id,is_primary) VALUES (${id}::uuid,${languageId}::uuid,${languageId===primaryLanguageId})`; await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata) VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${req.adminSession!.user.id}::uuid,'settings.exam_version.created','exam_version',${id}::uuid,${`Created immutable exam version ${versionNumber}`},${reason},${tx.json({ examId,versionNumber,name,languageIds,primaryLanguageId,ruleProfile:profile })})`; return {versionNumber}; }); res.status(201).json({id,...result}); } catch(error){const typed=error as {statusCode?:number;code?:string;message?:string};console.error("Unable to create exam version",error);res.status(typed.statusCode??500).json({error:typed.message??"Unable to create exam version",code:typed.code??"EXAM_VERSION_CREATE_FAILED"});}
});

router.post("/versions/:versionId/activate", requireAdminPermission("content.taxonomy.manage"), async (req,res)=>{const versionId=String(req.params.versionId??"");const reason=text(req.body?.reason,1000);if(!uuid.test(versionId)||reason.length<8)return void res.status(400).json({error:"A valid version and activation reason are required",code:"INVALID_VERSION_ACTIVATION"});try{await sqlClient.begin(async(tx)=>{const rows=await tx`SELECT id::text AS id,exam_id::text AS "examId",version_number AS "versionNumber" FROM catalog.exam_versions WHERE id=${versionId}::uuid FOR UPDATE`;if(!rows[0])throw Object.assign(new Error("Exam version not found"),{statusCode:404,code:"EXAM_VERSION_NOT_FOUND"});await tx`UPDATE catalog.exam_versions SET is_current=false WHERE exam_id=${String(rows[0].examId)}::uuid AND is_current=true`;await tx`UPDATE catalog.exam_versions SET is_current=true,effective_from=COALESCE(effective_from,now()) WHERE id=${versionId}::uuid`;await tx`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata) VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${req.adminSession!.user.id}::uuid,'settings.exam_version.activated','exam_version',${versionId}::uuid,${`Activated exam version ${rows[0].versionNumber}`},${reason},${tx.json({examId:rows[0].examId,versionNumber:rows[0].versionNumber})})`;});res.json({ok:true});}catch(error){const typed=error as {statusCode?:number;code?:string;message?:string};res.status(typed.statusCode??500).json({error:typed.message??"Unable to activate version",code:typed.code??"EXAM_VERSION_ACTIVATE_FAILED"});}});

router.patch("/exams/:examId/status", requireAdminPermission("content.taxonomy.manage"), async(req,res)=>{const examId=String(req.params.examId??"");const active=req.body?.active===true;const reason=text(req.body?.reason,1000);if(!uuid.test(examId)||reason.length<8)return void res.status(400).json({error:"A valid exam and reason are required",code:"INVALID_EXAM_STATUS"});try{const rows=await sqlClient`UPDATE catalog.exams SET is_active=${active},updated_at=now() WHERE id=${examId}::uuid RETURNING code`;if(!rows[0])return void res.status(404).json({error:"Exam not found"});await sqlClient`INSERT INTO platform.audit_events (id,actor_type,actor_user_id,action_key,entity_type,entity_id,summary,reason,metadata) VALUES (${randomUUID()}::uuid,'user'::audit_actor_type,${req.adminSession!.user.id}::uuid,'settings.exam.status_changed','exam',${examId}::uuid,${`${active?'Activated':'Retired'} exam ${rows[0].code}`},${reason},${sqlClient.json({active})})`;res.json({ok:true});}catch(error){console.error("Unable to change exam status",error);res.status(500).json({error:"Unable to change exam status",code:"EXAM_STATUS_FAILED"});}});

export default router;
