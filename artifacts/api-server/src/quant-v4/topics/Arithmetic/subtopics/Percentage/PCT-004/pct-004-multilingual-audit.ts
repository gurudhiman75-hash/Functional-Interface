import { runMultilingualContentAudit } from "../pct-multilingual-content-audit-common";
import { runPct004Pipeline } from "./foundation/pipeline";
import { PCT_004_CP_IDS } from "./foundation/types";

runMultilingualContentAudit({
  packageId: "PCT-004",
  cpIds: PCT_004_CP_IDS,
  run: runPct004Pipeline,
});
