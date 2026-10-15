// Compile only the production-gated one-shot Question Studio outbox dispatcher.
// No API server, worker engine, migration, scheduler or automatic activation.
import {mkdir} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {build} from "esbuild";

const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,"dist");
await mkdir(dist,{recursive:true});
await build({
  entryPoints:[path.join(root,"src/question-studio/async-cloud-tasks-dispatch-prod-once.ts")],
  bundle:true,packages:"external",platform:"node",format:"esm",target:"node22",
  outfile:path.join(dist,"qs-prod-dispatch-once.mjs"),sourcemap:false,
  logLevel:"info",
});
console.log("QS_PRODUCTION_DISPATCH_JOB_BUNDLE_READY");
