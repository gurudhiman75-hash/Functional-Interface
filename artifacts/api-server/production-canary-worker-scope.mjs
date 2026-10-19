// Production-only worker safety gate. This file is inert in staging.
// It blocks compute after the canary TTL even if Cloud Shell disconnects.
// This does not replace scheduled env cleanup.
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_AHEAD=15*60*1000;
export function assertProductionWorkerCanaryEnvironment(env=process.env,now=Date.now()) {
  const id=env.EXAMTREE_QS_PRODUCTION_CANARY_RUN_ID;
  const expires=env.EXAMTREE_QS_PRODUCTION_CANARY_EXPIRES_AT;
  if(env.EXAMTREE_QS_PRODUCTION_CANARY_ONLY!=="true" ||
     typeof id!=="string" || !UUID.test(id) ||
     typeof expires!=="string" ||
     !/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{3})?Z$/.test(expires)) {
    throw new Error("QS_PROD_WORKER_CANARY_SCOPE_INVALID");
  }
  const deadline=Date.parse(expires);
  if(!Number.isFinite(now) || !Number.isFinite(deadline) ||
     deadline<=now || deadline-now>MAX_AHEAD) {
    throw new Error("QS_PROD_WORKER_CANARY_EXPIRED");
  }
  return id;
}
export function assertProductionWorkerCanaryInput(input,env=process.env,now=Date.now()) {
  const id=assertProductionWorkerCanaryEnvironment(env,now);
  const req=input?.request;
  if(!req || input.count!==1 || req.count!==1 ||
     req.engineId!=="knowledge-v1" || req.packageId!=="COM-001" ||
     req.canonicalProblemId!=="COM-001-CP-001" ||
     req.language!=="en" || req.difficulty!=="Easy" ||
     req.seed!==("qs-async:"+id) ||
     !Array.isArray(input.selectedCpIds) ||
     input.selectedCpIds.length!==1 ||
     input.selectedCpIds[0]!=="COM-001-CP-001") {
    throw new Error("QS_PROD_WORKER_CANARY_INPUT_INVALID");
  }
  return true;
}
