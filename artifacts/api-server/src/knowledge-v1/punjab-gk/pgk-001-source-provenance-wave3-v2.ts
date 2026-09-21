import { auditPgk001SourceCoverageModule } from "./pgk-001-source-provenance-v2";

import * as facts019 from "./pgk-001-cp019-facts";
import * as facts020 from "./pgk-001-cp020-facts";
import * as facts021 from "./pgk-001-cp021-facts";
import * as facts022 from "./pgk-001-cp022-facts";
import * as facts023 from "./pgk-001-cp023-facts";
import * as facts024 from "./pgk-001-cp024-facts";
import * as facts025 from "./pgk-001-cp025-facts";
import * as facts026 from "./pgk-001-cp026-facts";

import * as review019 from "./pgk-001-cp019-review-batch-v1";
import * as review020 from "./pgk-001-cp020-review-batch-v1";
import * as review021 from "./pgk-001-cp021-review-batch-v1";
import * as review022 from "./pgk-001-cp022-review-batch-v1";
import * as review023 from "./pgk-001-cp023-review-batch-v2";
import * as review024 from "./pgk-001-cp024-review-batch-v1";
import * as review025 from "./pgk-001-cp025-review-batch-v1";
import * as review026 from "./pgk-001-cp026-review-batch-v1";

const modules = Object.freeze([
  { cpId: "PGK-001-CP-019", facts: facts019, review: review019 },
  { cpId: "PGK-001-CP-020", facts: facts020, review: review020 },
  { cpId: "PGK-001-CP-021", facts: facts021, review: review021 },
  { cpId: "PGK-001-CP-022", facts: facts022, review: review022 },
  { cpId: "PGK-001-CP-023", facts: facts023, review: review023 },
  { cpId: "PGK-001-CP-024", facts: facts024, review: review024 },
  { cpId: "PGK-001-CP-025", facts: facts025, review: review025 },
  { cpId: "PGK-001-CP-026", facts: facts026, review: review026 },
] as const);

export const PGK_001_SOURCE_COVERAGE_CP019_TO_CP026_V2 = Object.freeze(
  modules.map(({ cpId, facts, review }) =>
    auditPgk001SourceCoverageModule(cpId, facts, review),
  ),
);

export function auditPgk001SourceCoverageCp019ToCp026V2() {
  const issues = PGK_001_SOURCE_COVERAGE_CP019_TO_CP026_V2.flatMap((result) =>
    result.issues.map((issue) => `${result.cpId}: ${issue}`),
  );
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    cpCount: PGK_001_SOURCE_COVERAGE_CP019_TO_CP026_V2.length,
    factCount: PGK_001_SOURCE_COVERAGE_CP019_TO_CP026_V2.reduce(
      (sum, result) => sum + result.canonicalFactCount,
      0,
    ),
  });
}
