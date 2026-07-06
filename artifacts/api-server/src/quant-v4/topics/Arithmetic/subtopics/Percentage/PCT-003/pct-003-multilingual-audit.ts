import { runMultilingualContentAudit } from "../pct-multilingual-content-audit-common";
import { runPct003Pipeline } from "./foundation/pipeline";
import { PCT_003_CP_IDS } from "./foundation/types";

runMultilingualContentAudit({
  packageId: "PCT-003",
  cpIds: PCT_003_CP_IDS,
  run: runPct003Pipeline,
});
