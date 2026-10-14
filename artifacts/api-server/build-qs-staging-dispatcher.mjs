// Build only the gated one-shot Cloud Tasks outbox dispatcher.
// Do not bundle app.ts, worker engines or the HTTP receiver into this job.
import {mkdir} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import path from "node:path";
import {build} from "esbuild";

const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,"dist");
await mkdir(dist,{recursive:true});
await build({
  entryPoints:[path.join(root,"src/question-studio/async-cloud-tasks-dispatch-once.ts")],
  bundle:true,packages:"external",platform:"node",format:"esm",target:"node22",
  outfile:path.join(dist,"qs-staging-dispatch-once.mjs"),sourcemap:false,
  logLevel:"info",
});
console.log("QS_STAGING_DISPATCH_JOB_BUNDLE_READY");
