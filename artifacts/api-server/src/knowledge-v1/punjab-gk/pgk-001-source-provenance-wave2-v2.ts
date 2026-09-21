import { auditPgk001SourceCoverageModule } from "./pgk-001-source-provenance-v2";

import * as facts013 from "./pgk-001-cp013-facts";
import * as facts014 from "./pgk-001-cp014-facts";
import * as facts015 from "./pgk-001-cp015-facts";
import * as facts016 from "./pgk-001-cp016-facts";
import * as facts017 from "./pgk-001-cp017-facts";
import * as facts018 from "./pgk-001-cp018-facts";

import * as review013 from "./pgk-001-cp013-review-batch-v1";
import * as review014 from "./pgk-001-cp014-review-batch-v3";
import * as review015 from "./pgk-001-cp015-review-batch-v1";
import * as review016 from "./pgk-001-cp016-review-batch-v1";
import * as review017 from "./pgk-001-cp017-review-batch-v1";
import * as review018 from "./pgk-001-cp018-review-batch-v1";

const modules = Object.freeze([
  { cpId: "PGK-001-CP-013", facts: facts013, review: review013 },
  { cpId: "PGK-001-CP-014", facts: facts014, review: review014 },
  { cpId: "PGK-001-CP-015", facts: facts015, review: review015 },
  { cpId: "PGK-001-CP-016", facts: facts016, review: review016 },
  { cpId: "PGK-001-CP-017", facts: facts017, review: review017 },
  { cpId: "PGK-001-CP-018", facts: facts018, review: review018 },
] as const);

export const PGK_001_SOURCE_COVERAGE_CP013_TO_CP018_V2 = Object.freeze(
  modules.map(({ cpId, facts, review }) =>
    auditPgk001SourceCoverageModule(cpId, facts, review),
  ),
);

export function auditPgk001SourceCoverageCp013ToCp018V2() {
  const issues = PGK_001_SOURCE_COVERAGE_CP013_TO_CP018_V2.flatMap((result) =>
    result.issues.map((issue) => `${result.cpId}: ${issue}`),
  );
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    cpCount: PGK_001_SOURCE_COVERAGE_CP013_TO_CP018_V2.length,
    factCount: PGK_001_SOURCE_COVERAGE_CP013_TO_CP018_V2.reduce(
      (sum, result) => sum + result.canonicalFactCount,
      0,
    ),
  });
}
