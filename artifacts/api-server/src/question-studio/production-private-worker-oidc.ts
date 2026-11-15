// Only the dedicated production Question Studio receiver may acquire an
// identity token to call a PRIVATE production Cloud Run universal worker.
// This never runs on staging or on the canonical student/admin API.
const IDENTITY_ENDPOINT="http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";
const GOOGLE_JWT=/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export class PrivateQuestionStudioWorkerAuthError extends Error {
  readonly code="QS_PRIVATE_WORKER_IDENTITY_UNAVAILABLE";
  constructor() {
    super("Production Cloud Run worker identity unavailable");
    this.name="PrivateQuestionStudioWorkerAuthError";
  }
}

export async function getPrivateProductionWorkerIdentityToken(
  audience:string,
  request:typeof fetch=fetch,
  env:Record<string,string|undefined>=process.env,
):Promise<string> {
  if(env.EXAMTREE_API_RUNTIME!=="cloud-run" ||
     env.EXAMTREE_API_STAGING!=="false" ||
     env.K_SERVICE!=="examtree-qs-receiver-prod" ||
     env.EXAMTREE_QS_PRODUCTION_WORKER_BINDING_VERIFIED!=="true") {
    throw new PrivateQuestionStudioWorkerAuthError();
  }
  let origin:URL;
  try {origin=new URL(audience);}
  catch {throw new PrivateQuestionStudioWorkerAuthError();}
  const nativeTagPrefix="qs-native-candidate---";
  const tagged=origin.hostname.startsWith(nativeTagPrefix+"examtree-universal-prod-");
  const standard=origin.hostname.startsWith("examtree-universal-prod-");
  if(origin.protocol!=="https:" ||
     !(standard || (tagged && env.EXAMTREE_QS_NATIVE_CANDIDATE_BINDING_ENABLED==="true")) ||
     !origin.hostname.endsWith(".run.app") ||
     origin.pathname!=="/" || origin.search || origin.hash ||
     origin.username || origin.password) {
    throw new PrivateQuestionStudioWorkerAuthError();
  }
  const endpoint=new URL(IDENTITY_ENDPOINT);
  // Cloud Run authenticated traffic tags share the service's canonical
  // identity audience. Send requests to the tagged hostname, but mint the
  // OIDC token for the untagged service URL, not the tag URL.
  const canonicalAudience=tagged
    ?"https://"+origin.hostname.slice(nativeTagPrefix.length)
    :origin.origin;
  endpoint.searchParams.set("audience",canonicalAudience);
  endpoint.searchParams.set("format","full");
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),5000);
  try {
    const res=await request(endpoint.toString(),{
      headers:{"Metadata-Flavor":"Google"},signal:controller.signal,
    });
    if(!res.ok) throw new PrivateQuestionStudioWorkerAuthError();
    const idToken=(await res.text()).trim();
    if(idToken.length<64 || idToken.length>12000 || !GOOGLE_JWT.test(idToken)){
      throw new PrivateQuestionStudioWorkerAuthError();
    }
    // Never log, decode, cache or persist the identity token.
    return idToken;
  } catch {
    throw new PrivateQuestionStudioWorkerAuthError();
  } finally {
    clearTimeout(timer);
  }
}
