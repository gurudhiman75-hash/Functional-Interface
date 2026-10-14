// Dedicated receiver build. Legacy API and generator imports are never
// bundled into the HTTP entrypoint. A separate child process generates the
// immutable package/lifecycle authority JSON and then exits.
import {execFile} from "node:child_process";
import {promisify} from "node:util";
import {fileURLToPath} from "node:url";
import {mkdir,rm} from "node:fs/promises";
import path from "node:path";
import {build} from "esbuild";

const execFileAsync=promisify(execFile);
const root=path.dirname(fileURLToPath(import.meta.url));
const dist=path.join(root,"dist");
await mkdir(dist,{recursive:true});
const builder=path.join(dist,"qs-build-capabilities.mjs");
const manifest=path.join(dist,"question-studio-capabilities.json");
await build({
  entryPoints:[path.join(root,"src/question-studio/build-question-studio-capabilities-manifest.ts")],
  bundle:true,platform:"node",format:"esm",outfile:builder,logLevel:"info",
  external:["*.node","sharp","better-sqlite3","sqlite3","canvas","postgres"],
});
try {
  await execFileAsync(process.execPath,[builder],{
    cwd:root,
    env:{...process.env,QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT:manifest},
    maxBuffer:16*1024*1024,
  });
}finally{
  await rm(builder,{force:true});
}
await build({
  entryPoints:[path.join(root,"src/async-task-receiver-standalone.ts")],
  bundle:true,platform:"node",format:"esm",target:"node22",
  splitting:true,outdir:dist,outExtension:{".js":".mjs"},
  entryNames:"[name]",chunkNames:"qs-[name]-[hash]",
  packages:"external",sourcemap:false,logLevel:"info",
});
console.log("QS_STANDALONE_RECEIVER_BUNDLE_READY");
