import { Router } from "express";
import { sqlClient } from "../lib/db";
import { requireAdminPermission } from "../lib/admin-rbac";

import { evaluateTranslationQuality, type TranslationOptionInput } from "../lib/admin-translation-operations";
import { readPersistedNativeSnapshot, nativeSourceQuestion } from "../question-studio/persisted-native-review-format";

const router = Router();
// Separate opt-in from the existing read-only native preview. Schema migration
// must be verified before enabling editorial persistence in a candidate.
router.use((req,res,next)=>{
  // This router is mounted beside other Question Studio routes. Do not gate
  // normal generation, queue reads or the existing native preview.
  if (!req.path.includes("/native-editorial")) { next();return; }
  if(process.env.EXAMTREE_NATIVE_EDITORIAL_ENABLED!=="true"){
    res.status(404).json({code:"NATIVE_EDITORIAL_NOT_ENABLED"});return;
  }
  next();
});
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
  if (String(row.status)==="rejected")
    return {code:"NATIVE_EDITORIAL_SOURCE_REJECTED",http:409} as const;
  const payload=row.payload as Record<string,unknown>;
  const source=nativeSourceQuestion(payload);
  if (payload.language!=="en" || !validQuestion(source) ||
    !text(payload.seed) || !text(payload.packageId) ||
    !text(payload.canonicalProblemId||payload.selectedCpId||payload.cpId) ||
    !text(payload.questionLanguageId||payload.qlId))
      return {code:"NATIVE_EDITORIAL_SOURCE_NOT_ELIGIBLE",http:422} as const;
  // A generator-verified immutable snapshot is bound to a sha256 fingerprint
  // of the original English question. Editing or replacing the source
  // invalidates the snapshot, forcing the existing exact native parity check.
  if(!readPersistedNativeSnapshot(payload)){
    const {nativeLocalizedQuestion,assertNativeEnglishSourceParity}=await import("../question-studio/native-linked-localization");
    try {assertNativeEnglishSourceParity(source,await nativeLocalizedQuestion(payload,"en"));}
    catch {return {code:"NATIVE_EDITORIAL_SOURCE_PARITY_FAILED",http:409} as const;}
  }
  return {row,source,payload,sourceVersionId:String(row.sourceVersionId)};
}
const itemPath="/items/:itemId/native-editorial";
router.get(itemPath,requireAdminPermission("content.generation.read"),async(req,res)=>{
  res.setHeader("Cache-Control","private, no-store");
  const id=text(req.params.itemId),version=Number(req.query.version);
  if (!UUID.test(id)||!Number.isInteger(version)||version<1) {res.status(400).json({code:"NATIVE_EDITORIAL_INVALID_REQUEST"});return;}
  try {
    // Listing saved editorial drafts is a lightweight database read. Generator
    // parity remains mandatory for every mutation in sourceFor(), while the
    // separate native preview endpoint verifies generated language content.
    const versions=await sqlClient`
      SELECT i.current_version_number AS version,i.status::text AS status,
        v.id::text AS "sourceVersionId",v.payload->>'language' AS language
      FROM content.generation_run_items i
      JOIN content.generation_item_versions v ON v.generation_item_id=i.id
        AND v.version_number=i.current_version_number
      WHERE i.id=${id}::uuid LIMIT 1`;
    const result=versions[0];
    if(!result){res.status(404).json({code:"NATIVE_EDITORIAL_ITEM_NOT_FOUND"});return;}
    if(Number(result.version)!==version){res.status(409).json({code:"NATIVE_EDITORIAL_SOURCE_CHANGED"});return;}
    if(result.status==="rejected"||result.language!=="en"){
      res.status(422).json({code:"NATIVE_EDITORIAL_SOURCE_NOT_ELIGIBLE"});return;
    }
    const rows=await sqlClient`
      SELECT language_code AS language,stem,explanation,options,correct_index AS "correctIndex",
             status,revision,change_reason AS "changeReason",
             updated_at AS "updatedAt",reviewed_at AS "reviewedAt"
      FROM content.question_studio_native_locales
      WHERE source_generation_version_id=${String(result.sourceVersionId)}::uuid
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
    if('code' in result){res.status(result.http).json({code:result.code});return;}
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
      const sourceLock=await tx`SELECT current_version_number AS version
        FROM content.generation_run_items WHERE id=${itemId}::uuid FOR UPDATE`;
      if(Number(sourceLock[0]?.version)!==version) return null;
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
    if('code' in result){res.status(result.http).json({code:result.code});return;}
    const {listQuestionStudioPackages}=await import("../question-studio/engine-registry");
    const pkg=listQuestionStudioPackages().find(p=>p.enabled && p.packageId===result.payload.packageId);
    if(!pkg?.supportedLanguages.includes(language)){
      res.status(422).json({code:"NATIVE_EDITORIAL_LANGUAGE_UNSUPPORTED"});return;
    }
    const updated=await sqlClient.begin(async tx=>{
      const sourceLock=await tx`SELECT current_version_number AS version,status::text AS status
        FROM content.generation_run_items WHERE id=${itemId}::uuid FOR UPDATE`;
      if(Number(sourceLock[0]?.version)!==version) return null;
      if(decision==="approved" && sourceLock[0]?.status!=="approved") return "english_first";
      const rows=await tx`
        SELECT id::text AS id,revision,stem,explanation,options,correct_index AS "correctIndex"
        FROM content.question_studio_native_locales
        WHERE source_generation_version_id=${result.sourceVersionId}::uuid AND language_code=${language} FOR UPDATE`;
      const old=rows[0];
      if(!old||Number(old.revision)!==revision) return null;
      const editorRows=await tx`SELECT editor_user_id::text AS "editorUserId"
        FROM content.question_studio_native_locales WHERE id=${old.id}::uuid`;
      if(decision==="approved" && String(editorRows[0]?.editorUserId)===userId) return "self_approval_blocked";
      const q={stem:old.stem,explanation:old.explanation,options:old.options,correctIndex:Number(old.correctIndex)};
      if(!validQuestion(q)||q.correctIndex!==result.source.correctIndex||
         q.options.length!==result.source.options.length) return null;
      if(decision==="approved"){
        const asOptions=(values:string[]):TranslationOptionInput[]=>values.map((value,index)=>({
          key:String.fromCharCode(65+index),text:value,sortOrder:index+1,
        }));
        const quality=evaluateTranslationQuality({
          source:{stem:result.source.stem,explanation:result.source.explanation,
            options:asOptions(result.source.options)},
          target:{stem:q.stem,explanation:q.explanation,options:asOptions(q.options)},
          languageCode:language,
        });
        if(!quality.approvable) return "quality_blocked";
      }
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
    if(updated==="english_first"){res.status(409).json({code:"NATIVE_APPROVE_ENGLISH_FIRST"});return;}
    if(updated==="quality_blocked"){res.status(409).json({code:"NATIVE_EDITORIAL_QUALITY_BLOCKED"});return;}
    if(updated==="self_approval_blocked"){res.status(409).json({code:"NATIVE_EDITORIAL_SELF_APPROVAL_BLOCKED"});return;}
    if(!updated){res.status(409).json({code:"NATIVE_EDITORIAL_REVISION_OR_CONTENT_CHANGED"});return;}
    res.json(updated);
  }catch(error){
    console.error("Native editorial decision failed",error instanceof Error?error.message:"unknown");
    res.status(500).json({code:"NATIVE_EDITORIAL_DECISION_UNAVAILABLE"});
  }
});


function abortNativeReview(code:string):never {
  throw Object.assign(new Error(code),{nativeReviewCode:code});
}

/** One atomic editorial decision across any subset of generated languages.
 * English is approved first using the existing canonical Question Studio flow.
 * Generated (not human-edited) variants may be approved without an extra Save
 * click, but human edits retain the independent-reviewer rule.
 */
router.post(itemPath+"/approve-languages",requireAdminPermission("content.generation.review"),async(req,res)=>{
  res.setHeader("Cache-Control","private, no-store");
  const itemId=text(req.params.itemId);
  const body=req.body as Record<string,unknown>|undefined;
  const version=Number(body?.expectedVersion),reason=text(body?.reason);
  const actor=req.adminSession?.user.id;
  const selected=body?.languages;
  const revisions=(body?.revisions??{}) as Record<string,unknown>;
  if(!actor||!UUID.test(itemId)||!Number.isInteger(version)||version<1||
    !Array.isArray(selected)||selected.length<1||selected.length>2||
    new Set(selected).size!==selected.length||
    !selected.every(x=>x==="hi"||x==="pa")||reason.length<8||reason.length>2000||
    !selected.every(x=>Number.isInteger(revisions[x])&&Number(revisions[x])>=0)){
    res.status(400).json({code:"NATIVE_APPROVE_INVALID_REQUEST"});return;
  }
  try {
    const result=await sourceFor(itemId,version);
    if("code" in result){res.status(result.http).json({code:result.code});return;}
    const {listQuestionStudioPackages}=await import("../question-studio/engine-registry");
    const pkg=listQuestionStudioPackages().find(p=>p.enabled && p.packageId===result.payload.packageId);
    if(!pkg||!selected.every(x=>pkg.supportedLanguages.includes(x))){
      res.status(422).json({code:"NATIVE_APPROVE_UNSUPPORTED_LANGUAGE"});return;
    }
    // A persisted generator-verified snapshot avoids any expensive work.
    // Legacy questions are reconstructed once on demand using the same
    // immutable CP/QL/seed. No machine translation or alternate question.
    const embedded=readPersistedNativeSnapshot(result.payload);
    const precomputed:Record<string,{stem:string;explanation:string;options:string[];correctIndex:number}>={};
    for(const language of selected as ("hi"|"pa")[]){
      const v=embedded?.variants.find(v=>v.language===language);
      if(v?.status==="verified"){
        precomputed[language]={stem:v.stem,explanation:v.explanation,options:v.options,correctIndex:v.correctIndex};
      }else if(!embedded){
        const {nativeLocalizedQuestion,assertNativeLocalizedAnswerParity}=await import("../question-studio/native-linked-localization");
        try {
          const native=await nativeLocalizedQuestion(result.payload,language);
          assertNativeLocalizedAnswerParity(result.source,native);
          precomputed[language]=native;
        }catch {
          res.status(409).json({code:"NATIVE_APPROVE_GENERATION_BLOCKED",language});return;
        }
      }
    }
    const asOptions=(values:string[]):TranslationOptionInput[]=>values.map((value,index)=>({
      key:String.fromCharCode(65+index),text:value,sortOrder:index+1,
    }));
    const approved=await sqlClient.begin(async tx=>{
      const sourceRows=await tx`
        SELECT i.current_version_number AS version,i.status::text AS status,
          v.id::text AS "sourceVersionId"
        FROM content.generation_run_items i
        JOIN content.generation_item_versions v ON v.generation_item_id=i.id
          AND v.version_number=i.current_version_number
        WHERE i.id=${itemId}::uuid FOR UPDATE OF i`;
      const src=sourceRows[0];
      if(!src||Number(src.version)!==version||src.sourceVersionId!==result.sourceVersionId)
        abortNativeReview("NATIVE_APPROVE_SOURCE_CHANGED");
      if(src.status!=="approved")
        abortNativeReview("NATIVE_APPROVE_ENGLISH_FIRST");
      const outcome:Array<{language:string;status:string;revision:number}>=[];
      for(const language of selected as ("hi"|"pa")[]){
        const rows=await tx`
          SELECT id::text AS id,revision,status,stem,explanation,options,
                 correct_index AS "correctIndex",editor_user_id::text AS "editorUserId"
          FROM content.question_studio_native_locales
          WHERE source_generation_version_id=${result.sourceVersionId}::uuid
            AND language_code=${language} FOR UPDATE`;
        const old=rows[0];
        const expected=Number(revisions[language]);
        if((old?Number(old.revision):0)!==expected)
          abortNativeReview("NATIVE_APPROVE_REVISION_CHANGED");
        if(old?.status==="approved"){
          outcome.push({language,status:"approved",revision:Number(old.revision)});
          continue;
        }
        if(old?.status==="needs_fix")
          abortNativeReview("NATIVE_APPROVE_FIX_REQUIRED");
        const q=old?{stem:String(old.stem),explanation:String(old.explanation),
          options:old.options as string[],correctIndex:Number(old.correctIndex)}
          :precomputed[language];
        if(!q||!validQuestion(q)||q.correctIndex!==result.source.correctIndex||
           q.options.length!==result.source.options.length)
          abortNativeReview("NATIVE_APPROVE_ANSWER_MAPPING_CHANGED");
        const quality=evaluateTranslationQuality({
          source:{stem:result.source.stem,explanation:result.source.explanation,
            options:asOptions(result.source.options)},
          target:{stem:q.stem,explanation:q.explanation,options:asOptions(q.options)},
          languageCode:language,
        });
        if(!quality.approvable)abortNativeReview("NATIVE_APPROVE_QUALITY_BLOCKED");
        let nativeId:string;
        let newRevision:number;
        if(old){
          // An actual human edit requires a different reviewer. The machine
          // generated no-edit draft is distinguishable by its audited origin.
          if(String(old.editorUserId)===actor){
            const audit=await tx`
              SELECT snapshot->>'machineGenerated' AS "machineGenerated"
              FROM content.question_studio_native_locale_events
              WHERE native_locale_id=${String(old.id)}::uuid
              ORDER BY created_at DESC,id DESC LIMIT 1`;
            if(audit[0]?.machineGenerated!=="true")
              abortNativeReview("NATIVE_APPROVE_SELF_REVIEW_BLOCKED");
          }
          const updated=await tx`
            UPDATE content.question_studio_native_locales
            SET status='approved',revision=revision+1,reviewer_user_id=${actor}::uuid,
                reviewed_at=now(),updated_at=now()
            WHERE id=${String(old.id)}::uuid RETURNING revision`;
          nativeId=String(old.id);
          newRevision=Number(updated[0]!.revision);
        }else{
          const inserted=await tx`
            INSERT INTO content.question_studio_native_locales
              (source_generation_version_id,language_code,stem,explanation,
                options,correct_index,status,change_reason,editor_user_id,
                reviewer_user_id,reviewed_at)
            VALUES(${result.sourceVersionId}::uuid,${language},${q.stem},
              ${q.explanation},${JSON.stringify(q.options)}::jsonb,${q.correctIndex},
              'approved','Native machine-generated snapshot',${actor}::uuid,${actor}::uuid,now())
            ON CONFLICT (source_generation_version_id,language_code) DO NOTHING
            RETURNING id::text AS id,revision`;
          if(!inserted[0])abortNativeReview("NATIVE_APPROVE_CONCURRENT_EDIT");
          nativeId=String(inserted[0].id);
          newRevision=Number(inserted[0].revision);
        }
        await tx`
          INSERT INTO content.question_studio_native_locale_events
            (native_locale_id,revision,action,actor_user_id,reason,snapshot)
          VALUES(${nativeId}::uuid,${newRevision},'approve',${actor}::uuid,${reason},
            ${JSON.stringify({language,...q,status:"approved",machineGenerated:!old,quality})}::jsonb)`;
        outcome.push({language,status:"approved",revision:newRevision});
      }
      return {approved:outcome,englishStatus:"approved"};
    });
    res.json(approved);
  }catch(error){
    if(error && typeof error==="object" && "nativeReviewCode" in error){
      res.status(409).json({code:String(error.nativeReviewCode)});return;
    }
    console.error("Native grouped approval failed",error instanceof Error?error.message:"unknown");
    res.status(500).json({code:"NATIVE_APPROVE_UNAVAILABLE"});
  }
});
/** Explicit promotion to the existing Question Bank translation review queue.
 * Not a publish operation: creates DRAFT canonical translations only. Both
 * independent editorial approvals must exist, and canonical English must
 * already have been accepted as the same immutable source version. */
router.post(itemPath+"/promote",requireAdminPermission("content.translations.review"),async(req,res)=>{
  res.setHeader("Cache-Control","private, no-store");
  const itemId=text(req.params.itemId),body=req.body as Record<string,unknown>|undefined;
  const version=Number(body?.expectedVersion),reason=text(body?.reason),userId=req.adminSession?.user.id;
  const revisions=body?.revisions as Record<string,unknown>|undefined;
  const hi=Number(revisions?.hi),pa=Number(revisions?.pa);
  if(!userId||!UUID.test(itemId)||!Number.isInteger(version)||version<1||
    !Number.isInteger(hi)||hi<1||!Number.isInteger(pa)||pa<1||
    reason.length<8||reason.length>2000){
    res.status(400).json({code:"NATIVE_PROMOTION_INVALID_REQUEST"});return;
  }
  try {
    const source=await sourceFor(itemId,version);
    if('code' in source){res.status(source.http).json({code:source.code});return;}
    const outcome=await sqlClient.begin(async tx=>{
      const items=await tx`SELECT i.status::text AS status,
           i.current_version_number AS version,
           i.accepted_question_id::text AS "questionId",
           i.accepted_question_version_id::text AS "questionVersionId",
           v.id::text AS "generationVersionId"
        FROM content.generation_run_items i
        JOIN content.generation_item_versions v ON v.generation_item_id=i.id
          AND v.version_number=i.current_version_number
        WHERE i.id=${itemId}::uuid FOR UPDATE OF i`;
      const item=items[0];
      if(!item || Number(item.version)!==version ||
         String(item.generationVersionId)!==source.sourceVersionId) return {code:"NATIVE_PROMOTION_SOURCE_CHANGED",http:409};
      if(item.status!=="approved"||!item.questionVersionId||!item.questionId)
        return {code:"NATIVE_PROMOTION_ENGLISH_NOT_ACCEPTED",http:409};
      await tx`SELECT id FROM content.questions WHERE id=${String(item.questionId)}::uuid FOR UPDATE`;
      const bank=await tx`SELECT q.id::text AS "questionId",q.status::text AS status,
            q.approved_version_id::text AS "approvedVersionId",
            q.published_version_id::text AS "publishedVersionId",
            v.id::text AS "versionId",v.stem,v.explanation,
            v.exam_version_id::text AS "examVersionId",
            v.answer_model->'generation'->>'language' AS "sourceLanguage",
            v.answer_model->'generation'->>'questionBankAcceptanceMode' AS "bankAcceptanceMode",
            q.primary_taxonomy_node_id::text AS "taxonomyNodeId",
            COALESCE(json_agg(json_build_object('key',o.option_key,'text',o.text,
              'sortOrder',o.sort_order,'isCorrect',o.is_correct) ORDER BY o.sort_order)
              FILTER (WHERE o.id IS NOT NULL),'[]'::json) AS options
          FROM content.questions q JOIN content.question_versions v ON v.question_id=q.id
          LEFT JOIN content.question_options o ON o.question_version_id=v.id
          WHERE q.id=${String(item.questionId)}::uuid
            AND v.id=${String(item.questionVersionId)}::uuid AND q.deleted_at IS NULL
          GROUP BY q.id,v.id`;
      const b=bank[0];
      if(!b||!["approved","published"].includes(String(b.status))||
         ![b.approvedVersionId,b.publishedVersionId].includes(item.questionVersionId))
        return {code:"NATIVE_PROMOTION_BANK_SOURCE_NOT_APPROVED",http:409};
      const sourceOptions=source.source.options;
      const bankOptions=Array.isArray(b.options)?b.options as Array<Record<string,unknown>>:[];
      if(text(b.sourceLanguage)&&b.sourceLanguage!=="en" ||
         text(b.stem)!==source.source.stem || text(b.explanation)!==source.source.explanation ||
         bankOptions.length!==sourceOptions.length ||
         bankOptions.some((o,index)=>text(o.text)!==sourceOptions[index] ||
           Boolean(o.isCorrect)!==(index===source.source.correctIndex) ||
           text(o.key)!==String.fromCharCode(65+index)))
        return {code:"NATIVE_PROMOTION_BANK_SOURCE_PARITY_FAILED",http:409};
      if(!b.examVersionId && b.bankAcceptanceMode!=="BANK_ONLY")
        return {code:"NATIVE_PROMOTION_BANK_TAXONOMY_REQUIRED",http:409};

      const drafts=await tx`SELECT id::text AS id,language_code AS language,
          stem,explanation,options,correct_index AS "correctIndex",revision,status,
          editor_user_id::text AS "editorUserId",reviewer_user_id::text AS "reviewerUserId"
        FROM content.question_studio_native_locales
        WHERE source_generation_version_id=${source.sourceVersionId}::uuid
          AND language_code IN ('hi','pa')
        ORDER BY language_code FOR UPDATE`;
      if(drafts.length!==2 || drafts.some(d=>d.status!=="approved" ||
          Number(d.revision)!==(d.language==="hi"?hi:pa) ||
          !d.reviewerUserId || d.correctIndex!==source.source.correctIndex ||
          !Array.isArray(d.options)||d.options.length!==sourceOptions.length))
        return {code:"NATIVE_PROMOTION_LOCALES_NOT_APPROVED",http:409};
      const machineAuthored=new Set<string>();
      for(const d of drafts) {
        if(d.editorUserId!==d.reviewerUserId)continue;
        // Generated language content has no human translator. Only a
        // machine-origin audit event for this exact approved revision
        // qualifies; manually edited self-reviews never qualify.
        const events=await tx`
          SELECT snapshot->>'machineGenerated' AS "machineGenerated",revision
          FROM content.question_studio_native_locale_events
          WHERE native_locale_id=${String(d.id)}::uuid AND action='approve'
          ORDER BY created_at DESC,id DESC LIMIT 1`;
        if(events[0]?.machineGenerated!=="true" ||
           Number(events[0]?.revision)!==Number(d.revision))
          return {code:"NATIVE_PROMOTION_SELF_REVIEW_BLOCKED",http:409};
        machineAuthored.add(String(d.language));
      }

      const result:Record<string,string>={};
      for(const d of drafts){
        const language=String(d.language);
        const languageRows=b.examVersionId ? await tx`
          SELECT l.id::text AS id FROM catalog.languages l
          JOIN catalog.exam_version_languages evl ON evl.language_id=l.id
          WHERE lower(l.code)=${language} AND l.is_active=true
            AND evl.exam_version_id=${String(b.examVersionId)}::uuid LIMIT 1` : await tx`
          SELECT l.id::text AS id FROM catalog.languages l
          WHERE lower(l.code)=${language} AND l.is_active=true LIMIT 1`;
        const languageId=String(languageRows[0]?.id??"");
        if(!languageId) return {code:"NATIVE_PROMOTION_LANGUAGE_NOT_ALLOWED",http:409};
        const existing=await tx`SELECT id::text AS id FROM content.question_translations
          WHERE question_version_id=${String(b.versionId)}::uuid
            AND language_id=${languageId}::uuid FOR UPDATE`;
        // Never replace an existing translation or its review history.
        if(existing.length) return {code:"NATIVE_PROMOTION_TRANSLATION_ALREADY_EXISTS",http:409};
        const options=(d.options as string[]).map((option,index)=>({
          key:String.fromCharCode(65+index),text:String(option),sortOrder:index+1,
        }));
        const baseOptions=sourceOptions.map((option,index)=>({
          key:String.fromCharCode(65+index),text:option,sortOrder:index+1,
        }));
        const termRows=await tx`SELECT source_text AS "sourceText",
          preferred_text AS "preferredText",forbidden_variants AS "forbiddenVariants"
          FROM content.translation_terms
          WHERE language_id=${languageId}::uuid AND is_active=true
            AND (scope_taxonomy_node_id IS NULL OR scope_taxonomy_node_id=${b.taxonomyNodeId??null}::uuid)`;
        const quality=evaluateTranslationQuality({
          source:{stem:source.source.stem,explanation:source.source.explanation,options:baseOptions},
          target:{stem:String(d.stem),explanation:String(d.explanation),options},
          languageCode:language,
          terms:termRows.map(t=>({
            sourceText:String(t.sourceText),preferredText:String(t.preferredText),
            forbiddenVariants:Array.isArray(t.forbiddenVariants)?t.forbiddenVariants.map(String):[],
          })),
        });
        if(!quality.approvable) return {code:"NATIVE_PROMOTION_QUALITY_BLOCKED",http:409};
        const inserted=await tx`
          INSERT INTO content.question_translations
            (question_version_id,language_id,stem,explanation,status,translator_user_id,
              reviewer_user_id,quality_snapshot)
          VALUES(${String(b.versionId)}::uuid,${languageId}::uuid,${String(d.stem)},
            ${String(d.explanation)},'draft',
            ${machineAuthored.has(language)?null:String(d.editorUserId)}::uuid,
            NULL,${JSON.stringify(quality)}::jsonb)
          ON CONFLICT (question_version_id,language_id) DO NOTHING RETURNING id::text AS id`;
        if(!inserted.length) return {code:"NATIVE_PROMOTION_TRANSLATION_ALREADY_EXISTS",http:409};
        const translationId=String(inserted[0]!.id);
        for(const option of options) await tx`
          INSERT INTO content.question_translation_options
            (question_translation_id,option_key,text,sort_order)
          VALUES(${translationId}::uuid,${option.key},${option.text},${option.sortOrder})`;
        await tx`INSERT INTO content.question_studio_native_locale_events
          (native_locale_id,revision,action,actor_user_id,reason,snapshot)
          VALUES(${String(d.id)}::uuid,${Number(d.revision)},'send_to_bank_review',
            ${userId}::uuid,${reason},
            ${JSON.stringify({translationId,questionVersionId:b.versionId,language,quality})}::jsonb)`;
        result[language]=translationId;
      }
      return {translations:result,questionVersionId:String(b.versionId),status:"draft"};
    });
    if("code" in outcome){res.status(outcome.http).json({code:outcome.code});return;}
    res.json(outcome);
  }catch(error){
    console.error("Native translation promotion failed",error instanceof Error?error.message:"unknown");
    res.status(500).json({code:"NATIVE_PROMOTION_UNAVAILABLE"});
  }
});
export default router;
