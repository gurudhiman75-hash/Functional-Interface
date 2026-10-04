import assert from "node:assert/strict";
import { createHash } from "node:crypto";

import {
  generateClsCp001Question,
} from "./CLS-CP-001/cp001-multilingual-runtime.ts";
import {
  generateClsCp001CoherentGroupPrototype,
  independentlyVerifyClsCp001CoherentGroupQuestion,
} from "./CLS-CP-001/cp001-coherent-group-runtime.ts";
import {
  generateClsCp001Prototype,
  independentlyVerifyClsCp001Question,
} from "./CLS-CP-001/runtime.ts";

import {
  generateClsCp002Question,
} from "./CLS-CP-002/cp002-multilingual-runtime.ts";
import {
  independentlyVerifyClsCp002Question,
} from "./CLS-CP-002/runtime.ts";

import {
  generateClsCp003EnglishQuestion,
} from "./CLS-CP-003/cp003-english-runtime.ts";
import {
  independentlyVerifyClsCp003LocalizedQuestionV5,
} from "./CLS-CP-003/cp003-localized-runtime-v5.ts";

import {
  generateClsCp004EnglishQuestion,
} from "./CLS-CP-004/cp004-english-runtime.ts";
import {
  independentlyVerifyClsCp004Question,
} from "./CLS-CP-004/runtime.ts";

import {
  generateClsCp005EnglishQuestion,
} from "./CLS-CP-005/cp005-english-runtime.ts";
import {
  generateClsCp005FrozenQuestion,
} from "./CLS-CP-005/cp005-multilingual-freeze.ts";

import {
  generateClsCp006EnglishQuestion,
} from "./CLS-CP-006/cp006-english-runtime.ts";
import {
  generateClsCp006FrozenQuestion,
} from "./CLS-CP-006/cp006-multilingual-freeze.ts";

import {
  generateClsCp007PermanentClusterPairQuestion,
  generateClsCp007PermanentClusterQuestion,
} from "./CLS-CP-007/cp007-english-contracts.ts";
import {
  independentlyVerifyClsCp007Question,
} from "./CLS-CP-007/audit.ts";
import {
  independentlyVerifyClsCp007PairQuestion,
} from "./CLS-CP-007/cluster-pair-audit.ts";

import {
  CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY,
  assertCls001PostClosureLifecycle,
  generateClsCp003PostClosureFrozenQuestion,
  generateClsCp004PostClosureFrozenQuestion,
  generateClsCp007PostClosureFrozenClusterQuestion,
  generateClsCp007PostClosureFrozenPairQuestion,
} from "./post-closure-multilingual-governance.ts";

type Locale = "en-IN" | "hi-IN" | "pa-IN";
const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const satisfies readonly Locale[];
const SEEDS = 24;
const fingerprints = new Set<string>();
const qlCounts = new Map<string, number>();
let audited = 0;
let governanceOverlays = 0;

function record(question: Readonly<Record<string, any>>) {
  const qlId = String(question.permanentQlId ?? question.qlId);
  assert.match(qlId, /^CLS-QL-0(?:0[1-9]|1[0-3])$/u);
  assert.ok(question.options.length === 4 || question.options.length === 5);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(new Set(question.options).size, question.options.length);
  assert.equal(question.questionStudioVisible, false);
  assert.equal(question.lifecycle.questionStudioDiscoverable, false);
  assert.equal(question.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(question.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(question.lifecycle.publiclyPublishable, false);
  qlCounts.set(qlId, (qlCounts.get(qlId) ?? 0) + 1);
  fingerprints.add(createHash("sha256").update(JSON.stringify([
    qlId,
    question.stem,
    question.options,
    question.correctIndex,
    question.answer,
  ])).digest("hex"));
  audited += 1;
}

// CP001 — QL001..003: multilingual runtime with independent semantic solver.
for (const qlId of ["CLS-QL-001", "CLS-QL-002", "CLS-QL-003"] as const) {
  for (let seed = 0; seed < SEEDS; seed += 1) {
    const english = generateClsCp001Question(qlId, "en-IN", seed);
    const source = english.metadata.sourcePrototypeId === "CLS-CP001-PROT-008"
      ? generateClsCp001CoherentGroupPrototype(
        english.metadata.sourcePrototypeSeed,
        english.metadata.sourceOptionCount,
      )
      : generateClsCp001Prototype(
        english.metadata.sourcePrototypeId,
        english.metadata.sourcePrototypeSeed,
        english.metadata.sourceOptionCount,
      );
    const independent = english.task === "SELECT_COHERENT_GROUP"
      ? independentlyVerifyClsCp001CoherentGroupQuestion(source)
      : independentlyVerifyClsCp001Question(source);
    assert.equal(independent.correctIndex, english.correctIndex);

    for (const locale of LOCALES) {
      const question = generateClsCp001Question(qlId, locale, seed);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.answer, question.options[question.correctIndex]);
      record(question);
    }
  }
}

// CP002 — QL004: multilingual parity + independent relation solver.
for (let seed = 0; seed < SEEDS; seed += 1) {
  const english = generateClsCp002Question("CLS-QL-004", "en-IN", seed);
  const independent = independentlyVerifyClsCp002Question(english as unknown as Parameters<typeof independentlyVerifyClsCp002Question>[0]);
  assert.equal(independent.result, "UNIQUE");
  assert.equal(independent.winningOutlierIndex, english.correctIndex);
  for (const locale of LOCALES) {
    const question = generateClsCp002Question("CLS-QL-004", locale, seed);
    assert.equal(question.correctIndex, english.correctIndex);
    assert.equal(question.answer, english.answer);
    record(question);
  }
}

// CP003 — QL005..006: English authority + approved post-closure review-freeze overlay.
for (const qlId of ["CLS-QL-005", "CLS-QL-006"] as const) {
  for (let seed = 0; seed < SEEDS; seed += 1) {
    const english = generateClsCp003EnglishQuestion(qlId, seed);
    record(english);
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const question = generateClsCp003PostClosureFrozenQuestion(qlId, locale, seed);
      const independent = independentlyVerifyClsCp003LocalizedQuestionV5(question);
      assert.equal(independent.result, "UNIQUE");
      assert.equal(independent.outlierIndex, question.correctIndex);
      assert.equal(question.lifecycle.reviewStatus, "APPROVED_MULTILINGUAL_REVIEW_FROZEN");
      assert.equal(
        question.metadata.postClosureGovernanceAuthority,
        CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY,
      );
      assertCls001PostClosureLifecycle(question);
      governanceOverlays += 1;
      record(question);
    }
  }
}

// CP004 — QL007: independently solve English state, preserve it in native frozen-review overlay.
for (let seed = 0; seed < SEEDS; seed += 1) {
  const english = generateClsCp004EnglishQuestion("CLS-QL-007", seed);
  const independent = independentlyVerifyClsCp004Question(english as unknown as Parameters<typeof independentlyVerifyClsCp004Question>[0]);
  assert.equal(independent.result, "UNIQUE");
  assert.equal(independent.outlierIndex, english.correctIndex);
  record(english);
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const question = generateClsCp004PostClosureFrozenQuestion(locale, seed);
    assert.equal(question.correctIndex, english.correctIndex);
    assert.equal(question.answer, english.answer);
    assert.equal(question.lifecycle.reviewStatus, "APPROVED_MULTILINGUAL_REVIEW_FROZEN");
    assert.equal(question.metadata.localizationStatus, "MULTILINGUAL_REVIEW_FROZEN");
    assertCls001PostClosureLifecycle(question);
    governanceOverlays += 1;
    record(question);
  }
}

// CP005 — QL008..009: frozen multilingual runtime must preserve canonical English state.
for (const qlId of ["CLS-QL-008", "CLS-QL-009"] as const) {
  for (let seed = 0; seed < SEEDS; seed += 1) {
    const english = generateClsCp005EnglishQuestion(qlId, seed);
    record(english);
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const question = generateClsCp005FrozenQuestion(qlId, locale, seed);
      assert.deepEqual(question.options, english.options);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.answer, question.options[question.correctIndex]);
      record(question);
    }
  }
}

// CP006 — QL010..011: frozen multilingual runtime must preserve canonical English state.
for (const qlId of ["CLS-QL-010", "CLS-QL-011"] as const) {
  for (let seed = 0; seed < SEEDS; seed += 1) {
    const english = generateClsCp006EnglishQuestion(qlId, seed);
    record(english);
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const question = generateClsCp006FrozenQuestion(qlId, locale, seed);
      assert.deepEqual(question.options, english.options);
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.answer, english.answer);
      record(question);
    }
  }
}

// CP007 — QL012: all 13 single-cluster prototype families.
const CP007_PROTOTYPES = [
  "CLS-CP007-PROT-001","CLS-CP007-PROT-002","CLS-CP007-PROT-003",
  "CLS-CP007-PROT-004","CLS-CP007-PROT-005","CLS-CP007-PROT-006",
  "CLS-CP007-PROT-007","CLS-CP007-PROT-008","CLS-CP007-PROT-009",
  "CLS-CP007-PROT-010","CLS-CP007-PROT-011","CLS-CP007-PROT-012",
  "CLS-CP007-PROT-013",
] as const;

for (let p = 0; p < CP007_PROTOTYPES.length; p += 1) {
  const prototypeId = CP007_PROTOTYPES[p]!;
  for (let localSeed = 0; localSeed < 3; localSeed += 1) {
    const seed = p * 17 + localSeed;
    const optionCount = seed % 2 === 0 ? 4 : 5;
    const english = generateClsCp007PermanentClusterQuestion(prototypeId, seed, optionCount);
    const independent = independentlyVerifyClsCp007Question(english as unknown as Parameters<typeof independentlyVerifyClsCp007Question>[0]);
    assert.equal(independent.result, "UNIQUE");
    assert.equal(independent.answerIndex, english.correctIndex);
    record(english);
    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const question = generateClsCp007PostClosureFrozenClusterQuestion(
        locale, prototypeId, seed, optionCount,
      );
      assert.equal(question.correctIndex, english.correctIndex);
      assert.equal(question.answer, english.answer);
      assert.equal(question.lifecycle.reviewStatus, "APPROVED_MULTILINGUAL_REVIEW_FROZEN");
      assert.equal(question.metadata.localizationStatus, "MULTILINGUAL_REVIEW_FROZEN");
      assertCls001PostClosureLifecycle(question);
      governanceOverlays += 1;
      record(question);
    }
  }
}

// CP007 — QL013: cluster-pair contract.
for (let seed = 0; seed < SEEDS; seed += 1) {
  const optionCount = seed % 2 === 0 ? 4 : 5;
  const english = generateClsCp007PermanentClusterPairQuestion(seed, optionCount);
  const independent = independentlyVerifyClsCp007PairQuestion(english as unknown as Parameters<typeof independentlyVerifyClsCp007PairQuestion>[0]);
  assert.equal(independent.result, "UNIQUE");
  assert.equal(independent.answerIndex, english.correctIndex);
  record(english);
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const question = generateClsCp007PostClosureFrozenPairQuestion(locale, seed, optionCount);
    assert.equal(question.correctIndex, english.correctIndex);
    assert.equal(question.answer, english.answer);
    assert.equal(question.lifecycle.reviewStatus, "APPROVED_MULTILINGUAL_REVIEW_FROZEN");
    assert.equal(question.metadata.localizationStatus, "MULTILINGUAL_REVIEW_FROZEN");
    assertCls001PostClosureLifecycle(question);
    governanceOverlays += 1;
    record(question);
  }
}

assert.deepEqual(
  [...qlCounts.keys()].sort(),
  Array.from({ length: 13 }, (_, index) => `CLS-QL-${String(index + 1).padStart(3, "0")}`),
);
for (const [qlId, count] of qlCounts) {
  assert.ok(count > 0, `${qlId}: no current-head surfaces audited`);
}
assert.ok(fingerprints.size > audited * 0.7, "CLS post-closure current-head sample diversity unexpectedly low");

console.log(JSON.stringify({
  status: "PASS_CLS_001_POST_CLOSURE_AUDIT_20261004",
  permanentQlCount: qlCounts.size,
  qlCounts: Object.fromEntries([...qlCounts].sort()),
  auditedCurrentHeadSurfaces: audited,
  uniqueSurfaceFingerprints: fingerprints.size,
  governanceOverlaySurfaces: governanceOverlays,
  reviewFrozenCheckpoints: ["CLS-CP-003","CLS-CP-004","CLS-CP-007"],
  questionStudioActivated: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  governanceAuthority: CLS_001_POST_CLOSURE_MULTILINGUAL_GOVERNANCE_AUTHORITY,
}, null, 2));
