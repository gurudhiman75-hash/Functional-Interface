import { strict as assert } from "node:assert";
import { COM003_LOCALIZATION_MIGRATION_DELTA_V1 } from "./com003-localization-migration-delta-v1";

const audit = COM003_LOCALIZATION_MIGRATION_DELTA_V1;
assert.equal(audit.valid, true, audit.issues.join("\n"));
assert.equal(audit.questions, 228);
assert.equal(audit.localizedArtifactsAffected, 456);
assert.equal(audit.perQl.length, 19);
assert.ok(audit.perQl.every((item) => item.questions === 12));
assert.ok(audit.fullArtifactReuse >= 0 && audit.fullArtifactReuse <= 228);
assert.ok(audit.orderedOptionReuse >= audit.fullArtifactReuse);
assert.ok(audit.vocabularyOptionReuse >= audit.fullArtifactReuse);
assert.ok(audit.answerTermReuse >= audit.fullArtifactReuse);
assert.equal(
  audit.fullLocalizedArtifactsReusable + audit.localizedArtifactsRequiringNewStemOrMore,
  456,
);

console.log("[COM003-LOCALIZATION-MIGRATION-DELTA-V1]", {
  questions: audit.questions,
  localizedArtifactsAffected: audit.localizedArtifactsAffected,
  fullArtifactReuse: audit.fullArtifactReuse,
  fullLocalizedArtifactsReusable: audit.fullLocalizedArtifactsReusable,
  orderedOptionReuse: audit.orderedOptionReuse,
  vocabularyOptionReuse: audit.vocabularyOptionReuse,
  answerTermReuse: audit.answerTermReuse,
  actionCounts: audit.actionCounts,
  classCounts: audit.classCounts,
  perQl: audit.perQl,
  policy: audit.policy,
});
