import { Router } from "express";
import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";
import { nativeLocalizedQuestion, nativeExplanationText, assertNativeEnglishSourceParity, assertNativeLocalizedAnswerParity } from "../question-studio/native-linked-localization";

const router = Router();
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type Locale = "hi" | "pa";
function text(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function validQuestion(value: unknown): value is {stem:string;explanation:string;options:string[];correctIndex:number} {
  if (!value || typeof value !== "object") return false;
  const q=value as Record<string,unknown>;
  return typeof q.stem==="string" && q.stem.trim().length>0 && q.stem.length<=12000 &&
    typeof q.explanation==="string" && q.explanation.trim().length>0 && q.explanation.length<=30000 &&
    Array.isArray(q.options) && q.options.length>=2 && q.options.length<=8 &&
    q.options.every(o=>typeof o==="string" && o.trim() && o.length<=4000) &&
    new Set(q.options.map(o=>(o as string).trim())).size===q.options.length &&
    Number.isInteger(q.correctIndex) && (q.correctIndex as number)>=0 &&
    (q.correctIndex as number)<q.options.length;
}
async function sourceFor(itemId: string, expectedVersion: number) {
  const rows=await sqlClient`
    SELECT i.current_version_number AS "version",i.status::text AS status,
           v.id::text AS "sourceVersionId",v.payload
    FROM content.generation_run_items i
    JOIN content.generation_item_versions v ON v.generation_item_id=i.id
      AND v.version_number=i.current_version_number
    WHERE i.id=${itemId}::uuid LIMIT 1`;
  const row=rows[0];
  if (!row) return {code:"NATIVE_EDITORIAL_ITEM_NOT_FOUND",http:404} as const;
  if (Number(row.version)!==expectedVersion)
    return {code:"NATIVE_EDITORIAL_SOURCE_CHANGED",http:409} as const;
  const payload=row.payload as Record<string,unknown>;
  const source={
    stem:text(payload.text)||text(payload.stem),
    explanation:nativeExplanationText(payload.explanation),
    options:Array.isArray(payload.options)?payload.options.map(x=>typeof x==="string"?x.trim():text((x as {text?:unknown})?.text)):[],
    correctIndex:Number(payload.correctIndex??payload.correct),
  };
  if (payload.language!=="en" || !validQuestion(source) ||
    !text(payload.seed) || !text(payload.packageId) ||
    !text(payload.canonicalProblemId||payload.selectedCpId||payload.cpId) ||
    !text(payload.questionLanguageId||payload.qlId))
      return {code:"NATIVE_EDITORIAL_SOURCE_NOT_ELIGIBLE",http:422} as const;
  try { assertNativeEnglishSourceParity(source,await nativeLocalizedQuestion(payload,"en")); }
  catch { return {code:"NATIVE_EDITORIAL_SOURCE_PARITY_FAILED",http:409} as const; }
  return {row,source,payload,sourceVersionId:String(row.sourceVersionId)};
}
function invalidSource(value: Awaited<ReturnType<typeof sourceFor>>): value is {code:string;http:number} {
  return "code" in value;
}
const itemPath="/items/:itemId/native-editorial";
router.get(itemPath,requireAdminPermission("content.generation.read"),async(req,res)=>{
  res.setHeader("Cache-Control","private, no-store");
  const id=text(req.params.itemId),version=Number(req.query.version);
  if (!UUID.test(id)||!Number.isInteger(version)||version<1) {res.status(400).json({code:"NATIVE_EDITORIAL_INVALID_REQUEST"});return;}
  try {
    const result=await sourceFor(id,version);
    if(invalidSource(result)){res.status(result.http).json({code:result.code});return;}
    const rows=await sqlClient`
      SELECT language_code AS language,stem,explanation,options,correct_index AS "correctIndex",
             status,revision,change_reason AS "changeReason",
             updated_at AS "updatedAt",reviewed_at AS "reviewedAt"
      FROM content.question_studio_native_locales
      WHERE source_generation_version_id=${result.sourceVersionId}::uuid
      ORDER BY language_code`;
    res.json({itemId:id,version,locales:rows});
  }catch(error){
    console.error("Native editorial read failed",error instanceof Error?error.message:"unknown");
    res.status(500).json({code:"NATIVE_EDITORIAL_UNAVAILABLE"});
  }
});
router.put(itemPath+"/:language",requireAdminPermission("content.generation.review"),async(req,res)=>{
  res.setHeader("Cache-Control","private, no-store");
  const itemId=text(req.params.itemId),language=text(req.params.language) as Locale;
  const body=req.body as Record<string,unknown>|undefined;
  const version=Number(body?.expectedVersion),revision=Number(body?.expectedRevision),reason=text(body?.changeReason);
  const userId=req.adminSession?.user.id;
  if (!userId){res.status(403).json({code:"NATIVE_EDITORIAL_ADMIN_REQUIRED"});return;}
  if (!UUID.test(itemId)||!["hi","pa"].includes(language)||!Number.isInteger(version)||version<1||
      !Number.isInteger(revision)||revision<0||reason.length<8||reason.length>2000||
      !validQuestion(body?.question)) {
    res.status(400).json({code:"NATIVE_EDITORIAL_INVALID_DRAFT"});return;
  }
  const question=body!.question as {stem:string;explanation:string;options:string[];correctIndex:number};
  try {
    const result=await sourceFor(itemId,version);
    if(invalidSource(result)){res.status(result.http).json({code:result.code});return;}
    if (question.correctIndex!==result.source.correctIndex || question.options.length!==result.source.options.length) {
      res.status(422).json({code:"NATIVE_EDITORIAL_ANSWER_MAPPING_CHANGED"});return;
    }
    // Never silently link an unsupported language, even if a draft exists.
    const {listQuestionStudioPackages}=await import("../question-studio/engine-registry");
    const pkg=listQuestionStudioPackages().find(p=>p.enabled && p.packageId===result.payload.packageId);
    if(!pkg?.supportedLanguages.includes(language)){res.status(422).json({code:"NATIVE_EDITORIAL_LANGUAGE_UNSUPPORTED"});return;}
    // Exact source is verified above. A manually edited locale is always a draft,
    // and must receive a new explicit human decision after each edit.
    const saved=await sqlClient.begin(async tx=>{
      const rows=await tx`
        SELECT id::text AS id, revision FROM content.question_studio_native_locales
        WHERE source_generation_version_id=${result.sourceVersionId}::uuid AND language_code=${language} FOR UPDATE`;
      const old=rows[0];
      if ((old?Number(old.revision):0)!==revision) return null;
      const records=old ? await tx`
        UPDATE content.question_studio_native_locales
        SET stem=${question.stem.trim()},explanation=${question.explanation.trim()},
            options=${JSON.stringify(question.options.map(o=>o.trim()))}::jsonb,
            correct_index=${question.correctIndex},status='draft',revision=revision+1,
            change_reason=${reason},editor_user_id=${userId}::uuid,
            reviewer_user_id=NULL,reviewed_at=NULL,updated_at=now()
        WHERE id=${old.id}::uuid RETURNING id::text AS id,revision`
      : await tx`
        INSERT INTO content.question_studio_native_locales
          (source_generation_version_id,language_code,stem,explanation,options,correct_index,change_reason,editor_user_id)
        VALUES (${result.sourceVersionId}::uuid,${language},${question.stem.trim()},
          ${question.explanation.trim()},${JSON.stringify(question.options.map(o=>o.trim()))}::jsonb,
          ${question.correctIndex},${reason},${userId}::uuid)
        ON CONFLICT (source_generation_version_id,language_code) DO NOTHING
        RETURNING id::text AS id,revision`;
      if (!records.length) return null;
      const next=records[0]!;
      await tx`INSERT INTO content.question_studio_native_locale_events
        (native_locale_id,revision,action,actor_user_id,reason,snapshot)
        VALUES (${next.id}::uuid,${next.revision},'save_draft',${userId}::uuid,${reason},
          ${JSON.stringify({language,...question})}::jsonb)`;
      return {language,revision:Number(next.revision),status:"draft"};
    });
    if(!saved){res.status(409).json({code:"NATIVE_EDITORIAL_REVISION_CHANGED"});return;}
    res.json(saved);
  } catch(error) {
    console.error("Native editorial save failed",error instanceof Error?error.message:"unknown");
    res.status(500).json({code:"NATIVE_EDITORIAL_SAVE_UNAVAILABLE"});
  }
});
router.post(itemPath+"/:language/decision",requireAdminPermission("content.generation.review"),async(req,res)=>{
  res.setHeader("Cache-Control","private, no-store");
  const itemId=text(req.params.itemId),language=text(req.params.language);
  const body=req.body as Record<string,unknown>|undefined;
  const version=Number(body?.expectedVersion),revision=Number(body?.expectedRevision);
  const decision=text(body?.decision),reason=text(body?.reason),userId=req.adminSession?.user.id;
  if(!userId||!UUID.test(itemId)||!["hi","pa"].includes(language)||!["approved","needs_fix"].includes(decision)||
     !Number.isInteger(version)||version<1||!Number.isInteger(revision)||revision<1||
     reason.length<8||reason.length>2000){
    res.status(400).json({code:"NATIVE_EDITORIAL_INVALID_DECISION"});return;
  }
  try {
    const result=await sourceFor(itemId,version);
    if(invalidSource(result)){res.status(result.http).json({code:result.code});return;}
    const updated=await sqlClient.begin(async tx=>{
      const rows=await tx`
        SELECT id::text AS id,revision,stem,explanation,options,correct_index AS "correctIndex"
        FROM content.question_studio_native_locales
        WHERE source_generation_version_id=${result.sourceVersionId}::uuid AND language_code=${language} FOR UPDATE`;
      const old=rows[0];
      if(!old||Number(old.revision)!==revision) return null;
      const q={stem:old.stem,explanation:old.explanation,options:old.options,correctIndex:Number(old.correctIndex)};
      if(!validQuestion(q)||q.correctIndex!==result.source.correctIndex||
         q.options.length!==result.source.options.length) return null;
      // Never conflate editorial approval with a published translation.
      const next=await tx`
        UPDATE content.question_studio_native_locales
        SET status=${decision},revision=revision+1,reviewer_user_id=${userId}::uuid,
            reviewed_at=now(),updated_at=now()
        WHERE id=${old.id}::uuid
        RETURNING revision`;
      await tx`INSERT INTO content.question_studio_native_locale_events
        (native_locale_id,revision,action,actor_user_id,reason,snapshot)
        VALUES(${old.id}::uuid,${next[0]!.revision},
          ${decision==="approved"?"approve":"needs_fix"},${userId}::uuid,${reason},
          ${JSON.stringify({language,...q,status:decision})}::jsonb)`;
      return {language,status:decision,revision:Number(next[0]!.revision)};
    });
    if(!updated){res.status(409).json({code:"NATIVE_EDITORIAL_REVISION_OR_CONTENT_CHANGED"});return;}
    res.json(updated);
  }catch(error){
    console.error("Native editorial decision failed",error instanceof Error?error.message:"unknown");
    res.status(500).json({code:"NATIVE_EDITORIAL_DECISION_UNAVAILABLE"});
  }
});
export default router;
