// A production-only, mandatory fail-closed canary gate.
// Even if all generic production receiver approvals are true, only one pinned
// run may be delivered within a short time window. Deliberately no broad
// production fallback until a separate release explicitly changes this source.
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const REQUIRED_PACKAGE="COM-001";
const REQUIRED_ENGINE="knowledge-v1";
const MAX_WINDOW_MS=15*60*1000;

function deny() {
  const e=new Error("QS_PRODUCTION_CANARY_SCOPE_DENIED");
  e.code="QS_PRODUCTION_CANARY_SCOPE_DENIED";
  throw e;
}

export function assertProdCanaryRequest(runId,env=process.env,now=Date.now()) {
  const allowed=env.EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID;
  const expires=env.EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT;
  if(env.EXAMTREE_QS_PRODUCTION_CANARY_ONLY!=="true" ||
     typeof allowed!=="string" || !UUID.test(allowed) ||
     runId!==allowed || typeof expires!=="string" ||
     !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(expires)) deny();
  const until=Date.parse(expires);
  if(!Number.isFinite(now) || !Number.isFinite(until) ||
     until<=now || until-now>MAX_WINDOW_MS) deny();
  return true;
}

// Pure, no-DB guard. Called INSIDE the transactional claim lock BEFORE
// an attempt count, lease, or run state is changed.
export function isProdCanarySnapshot(snapshot) {
  if(!snapshot || typeof snapshot!=="object" || Array.isArray(snapshot)) return false;
  const req=snapshot.request;
  if(!req || typeof req!=="object" || Array.isArray(req)) return false;
  if(snapshot.queueVersion!==1 || snapshot.count!==1 || req.count!==1 ||
     req.packageId!==REQUIRED_PACKAGE || req.engineId!==REQUIRED_ENGINE ||
     typeof req.seed!=="string" || req.seed.length<8 ||
     req.language!=="en") return false;
  if(!Array.isArray(snapshot.selectedCpIds) || snapshot.selectedCpIds.length!==1 ||
     snapshot.selectedCpIds[0]!=="COM-001-CP-001") return false;
  if(req.canonicalProblemId!==undefined && req.canonicalProblemId!=="COM-001-CP-001") return false;
  return true;
}
