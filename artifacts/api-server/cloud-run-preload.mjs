// Cloud Run API and job use bundled ESM chunks. Some legacy chapters retain
// "if (import.meta.url === file://process.argv[1])" CLI-only export guards.
// Prevent those embedded exports from running on HTTP/job startup, before any
// static imports execute. The real CLI scripts retain their original behavior.
if (process.env.EXAMTREE_API_RUNTIME === "cloud-run") {
  process.argv[1] = "/__examtree_cloud_run_runtime_not_cli__.mjs";
}
