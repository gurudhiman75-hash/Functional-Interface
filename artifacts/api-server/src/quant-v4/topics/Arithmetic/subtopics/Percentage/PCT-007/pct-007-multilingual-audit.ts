import { runMultilingualContentAudit } from "../pct-multilingual-content-audit-common";
import { runPct007Pipeline } from "./foundation/pipeline";
import { PCT_007_CP_IDS } from "./foundation/types";

runMultilingualContentAudit({
  packageId: "PCT-007",
  cpIds: PCT_007_CP_IDS,
  run: runPct007Pipeline,
});
