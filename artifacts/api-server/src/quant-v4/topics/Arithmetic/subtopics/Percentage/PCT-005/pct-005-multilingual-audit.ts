import { runMultilingualContentAudit } from "../pct-multilingual-content-audit-common";
import { runPct005Pipeline } from "./foundation/pipeline";
import { PCT_005_CP_IDS } from "./foundation/types";

runMultilingualContentAudit({
  packageId: "PCT-005",
  cpIds: PCT_005_CP_IDS,
  run: runPct005Pipeline,
});
