// Opt-in production chapter/CP batch authorization. No DB, routes or publishing.
// The canonical build-time registry is the authority; operator scope never
// creates new packages or bypasses lifecycle locks. Default: deny.
import {readFileSync} from "node:fs";
import path from "node:path";

const ENGINES=new Set(["quant-v4","reasoning-v1","language-v1","knowledge-v1"]);
const ID=/^[A-Z][A-Z0-9-]{1,80}$/;
// Package identifiers are registry keys, not CP identifiers. Canonical language
// and reasoning packages also use lowercase slugs and colon namespaces.
const PACKAGE_ID=/^[A-Za-z][A-Za-z0-9:_-]{1,127}$/;
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const MAX_CHAPTER_REVIEW_BATCH=20;
export const MAX_RELEASE_WINDOW_MS=24*60*60*1000;

export function productionChapterReleaseActive(env=process.env,now=Date.now()){
  if(env?.EXAMTREE_API_RUNTIME!=="cloud-run" ||
     env?.EXAMTREE_API_STAGING!=="false" ||
     env?.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_APPROVED!=="true" ||
     !Number.isFinite(now)) return false;
  const raw=env.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_EXPIRES_AT;
  if(typeof raw!=="string" ||
     !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(raw)) return false;
  const expires=Date.parse(raw);
  return Number.isFinite(expires) && expires>now && expires-now<=MAX_RELEASE_WINDOW_MS;
}

export function readCanonicalChapterManifest(){
  const candidates=[
    path.join(process.cwd(), "artifacts/api-server/dist/question-studio-chapter-review-capabilities.json"),
    path.join(process.cwd(), "dist/question-studio-chapter-review-capabilities.json"),
    path.join(process.cwd(),"artifacts/api-server/dist/question-studio-capabilities.json"),
    path.join(process.cwd(),"dist/question-studio-capabilities.json"),
  ];
  for(const file of candidates) {
    try {
      const manifest=JSON.parse(readFileSync(file,"utf8"));
      if(manifest?.source==="canonical-question-studio-engine-registry" &&
         manifest?.schemaVersion===1 && Array.isArray(manifest.packages))
        return manifest;
    } catch {}
  }
  throw new Error("QS_PROD_CHAPTER_MANIFEST_MISSING");
}

// Two explicit operator scopes:
// 1. An array of named canonical chapters (legacy narrow release).
// 2. An opt-in catalog-wide release derived ONLY from each immutable image's
//    canonical registry. This authorizes all eligible chapters, not arbitrary
//    new packages/CPs, while every generated item remains review-only.
export function readProductionChapterScope(env=process.env,manifest=null){
  const raw=env?.EXAMTREE_QS_PRODUCTION_CHAPTER_REVIEW_SCOPE_JSON;
  if(typeof raw!=="string" || raw.length<2 || raw.length>32768)
    throw new Error("QS_PROD_CHAPTER_SCOPE_MISSING");
  let scope;
  try {scope=JSON.parse(raw);} catch {throw new Error("QS_PROD_CHAPTER_SCOPE_INVALID");}
  if(scope && typeof scope==="object" && !Array.isArray(scope)){
    if(Object.keys(scope).sort().join(",")!=="chapterWide,mode,reviewOnly" ||
       scope.mode!=="all-eligible-chapters" || scope.reviewOnly!==true ||
       scope.chapterWide!==true)
      throw new Error("QS_PROD_CHAPTER_SCOPE_INVALID");
    const catalog=manifest ?? readCanonicalChapterManifest();
    if(catalog?.source!=="canonical-question-studio-engine-registry" ||
       catalog.schemaVersion!==1 || !Array.isArray(catalog.packages))
      throw new Error("QS_PROD_CHAPTER_MANIFEST_INVALID");
    const entries=catalog.packages.filter(p=>
      ENGINES.has(p?.engineId) && PACKAGE_ID.test(p?.packageId??"") &&
      isProductionChapterGenerationEligiblePackage(p));
    const unique=new Set(entries.map(p=>p.engineId+":"+p.packageId));
    if(entries.length<1 || entries.length>5000 || unique.size!==entries.length)
      throw new Error("QS_PROD_CHAPTER_CATALOG_INVALID");
    return entries.map(p=>({
      engineId:p.engineId,packageId:p.packageId,reviewOnly:true,chapterWide:true,
    }));
  }
  if(!Array.isArray(scope) || scope.length<1 || scope.length>100 ||
     scope.some(x=>!x || typeof x!=="object" || Array.isArray(x) ||
       !ENGINES.has(x.engineId) || !PACKAGE_ID.test(x.packageId) ||
       x.reviewOnly!==true || x.chapterWide!==true ||
       Object.keys(x).some(k=>!["engineId","packageId","reviewOnly","chapterWide"].includes(k))) ||
     new Set(scope.map(x=>x.engineId+":"+x.packageId)).size!==scope.length)
    throw new Error("QS_PROD_CHAPTER_SCOPE_INVALID");
  return scope;
}

// Chapter admission is independent of source Question Bank lifecycle. BANK_ONLY
// chapters can generate REVIEW candidates, but no unsafe source package can be
// automatically student-published or promoted by this production pathway.
export function isProductionChapterGenerationEligiblePackage(p){
  return !!p && p.enabled===true &&
    p.reviewSurfaceRequired===true && p.manualApprovalRequired===true &&
    p.productionReleaseAuthorized===false &&
    p.automaticStudentPublication===false && p.publiclyPublishable===false &&
    Array.isArray(p.cpIds) && p.cpIds.length>0 &&
    new Set(p.cpIds).size===p.cpIds.length &&
    p.cpIds.every(cp=>typeof cp==="string" && ID.test(cp));
}

// selectedCpIds=[] means an entire canonical package, not an arbitrary CP.
// Exactly one package per request; batches can cover its full CP pool.
// CP filters may target multiple CPs without granting access to other chapters.
export function validateProductionChapterReview(snapshot,manifest,scope,
                                                {runId=null}={}){
  if(!snapshot || typeof snapshot!=="object" || Array.isArray(snapshot) ||
     snapshot.queueVersion!==1 || !snapshot.request ||
     typeof snapshot.request!=="object" || Array.isArray(snapshot.request)) return false;
  const r=snapshot.request;
  if(!Number.isInteger(snapshot.count) || snapshot.count<1 ||
     snapshot.count>MAX_CHAPTER_REVIEW_BATCH || r.count!==snapshot.count ||
     !ENGINES.has(r.engineId) || !PACKAGE_ID.test(r.packageId) ||
     !["en","hi","pa"].includes(r.language) ||
     !Array.isArray(snapshot.selectedCpIds) ||
     snapshot.selectedCpIds.length>snapshot.count ||
     snapshot.selectedCpIds.length>MAX_CHAPTER_REVIEW_BATCH ||
     snapshot.selectedCpIds.some(cp=>typeof cp!=="string" || !ID.test(cp)) ||
     new Set(snapshot.selectedCpIds).size!==snapshot.selectedCpIds.length) return false;
  if(runId!==null && (typeof runId!=="string" || !UUID.test(runId) ||
    r.seed!=="qs-async:"+runId)) return false;
  if(runId===null && r.seed!==undefined) return false; // server assigns an immutable run seed
  if(r.canonicalProblemId!==undefined &&
     (snapshot.selectedCpIds.length!==1 ||
      r.canonicalProblemId!==snapshot.selectedCpIds[0])) return false;
  if(!manifest || manifest.source!=="canonical-question-studio-engine-registry" ||
     manifest.schemaVersion!==1 || !Array.isArray(manifest.packages) ||
     !Array.isArray(scope)) return false;
  const matchingScope=scope.filter(x=>x.engineId===r.engineId &&
    x.packageId===r.packageId && x.reviewOnly===true && x.chapterWide===true);
  if(matchingScope.length!==1) return false;
  const candidates=manifest.packages.filter(p=>p && p.enabled===true &&
    p.engineId===r.engineId && p.packageId===r.packageId);
  if(candidates.length!==1) return false;
  const p=candidates[0];
  if(!isProductionChapterGenerationEligiblePackage(p) ||
     !Array.isArray(p.supportedLanguages) ||
     !p.supportedLanguages.includes(r.language)) return false;
  // Dynamic/unreviewed candidates cannot be silently selected.
  if(snapshot.selectedCpIds.some(cp=>!p.cpIds.includes(cp))) return false;
  if(p.difficultyFilterSupported===false){
    if(r.difficulty!==undefined && r.difficulty!=="Mixed") return false;
  } else if(r.difficulty!=="Mixed" &&
      (!["Easy","Medium","Hard"].includes(r.difficulty) ||
       (Array.isArray(p.supportedDifficulties) &&
        !p.supportedDifficulties.includes(r.difficulty)))) return false;
  if(r.runtimeMode!==undefined &&
     (!Array.isArray(p.supportedRuntimeModes) ||
      !p.supportedRuntimeModes.includes(r.runtimeMode))) return false;
  return true;
}
