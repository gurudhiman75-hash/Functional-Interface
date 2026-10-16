// Build-time CI-only. No production Dockerfile imports this worker.
import {build} from "esbuild";
import {mkdir} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
const here=path.dirname(fileURLToPath(import.meta.url));
const dist=path.resolve(here,"dist");
await mkdir(dist,{recursive:true});
await build({
 entryPoints:[path.resolve(here,"src/question-studio/universal-compute-coverage-worker.ts")],
 outfile:path.resolve(dist,"qs-universal-coverage-worker.mjs"),
 platform:"node",target:"node22",format:"esm",bundle:true,
 external:["*.node","sharp","better-sqlite3","sqlite3","canvas","postgres"],
 banner:{js:"import { createRequire as __auditRequire } from 'node:module'; globalThis.require = __auditRequire(import.meta.url);"},
});
console.log("QS_COVERAGE_WARM_WORKER_BUILT");
