import assert from "node:assert/strict";

import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { REASONING_V1_NOVELTY_PROVIDERS_V1 } from "../shared/reasoning-novelty-provider-registry-v1";
import { ANA_CP008_QLS } from "../topics/Analogy/ANA-001/ANA-CP-008/question-language.en";
import { ANA_CP007_QLS } from "../topics/Analogy/ANA-001/ANA-CP-007/question-language.en";

const inventory = REASONING_V1_NOVELTY_INVENTORY_V1.find(
  (entry) => entry.topicDirectory === "Analogy",
);
assert.ok(inventory, "Analogy novelty inventory entry missing");
assert.equal(inventory?.chapterId, "ANA-001");
assert.equal(
  inventory?.status,
  "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER",
);
assert.equal(inventory?.countsTowardControlledNovelTargetNow, false);
assert.ok((inventory?.evidence.length ?? 0) >= 4);

const anaProviders = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
  (provider) => provider.chapterId === "ANA-001",
);
assert.deepEqual(
  anaProviders,
  [],
  "ANA-001 must not gain a controlled-novel provider without reopening its explicit audit authority.",
);

assert.ok(
  ANA_CP007_QLS.some((ql) => ql.presentationMode === "DIRECT_COMPLETION")
  && ANA_CP007_QLS.some((ql) => ql.presentationMode === "PAIR_SELECTION"),
  "Existing word-analogy presentation directions must remain represented by CP007.",
);

assert.ok(
  ANA_CP008_QLS.some((ql) => ql.presentationMode === "DIRECT_COMPLETION")
  && ANA_CP008_QLS.some((ql) => ql.presentationMode === "ODD_PAIR_SELECTION"),
  "Existing mixed-analogy direct and odd-pair contracts must remain represented by CP008.",
);

console.log(JSON.stringify({
  status: "PASS_ANA_001_CONTROLLED_NOVELTY_AUDIT_CLOSURE_20261002",
  noveltyStatus: inventory?.status,
  providerCount: anaProviders.length,
  cp007QlCount: ANA_CP007_QLS.length,
  cp008QlCount: ANA_CP008_QLS.length,
}, null, 2));
