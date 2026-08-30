import { runPrt001PilotPipeline } from "./index";
for (let id = 85; id <= 103; id += 1) {
  const ql = `PRT-QL-${String(id).padStart(3, "0")}`;
  for (let index = 0; index < 12; index += 1) {
    const seed = `prt-pilot:${ql}:${index}`;
    try {
      runPrt001PilotPipeline({ questionLanguageId: ql, seed, language: "en" });
    } catch (error) {
      console.error(JSON.stringify({ ql, seed, message: error instanceof Error ? error.message : String(error) }, null, 2));
      process.exit(1);
    }
  }
}
console.log(JSON.stringify({ wave: "E5", status: "DIAGNOSTIC_PASS" }));
