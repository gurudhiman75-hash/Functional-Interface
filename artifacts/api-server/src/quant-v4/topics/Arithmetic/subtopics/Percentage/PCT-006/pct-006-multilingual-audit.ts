import { runMultilingualContentAudit } from "../pct-multilingual-content-audit-common";
import { runPct006Pipeline } from "./foundation/pipeline";
import { PCT_006_CP_IDS } from "./foundation/types";

runMultilingualContentAudit({
  packageId: "PCT-006",
  cpIds: PCT_006_CP_IDS,
  run: runPct006Pipeline,
});
