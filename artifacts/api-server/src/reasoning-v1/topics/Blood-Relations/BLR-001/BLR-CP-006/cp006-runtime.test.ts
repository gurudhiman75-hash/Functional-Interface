import {
  BLR_CP006_CONTRACTS,
  relationDisplay,
  type BlrCp006DirectRelation,
  type BlrCp006Gender,
} from "./cp006-model";
import {
  BLR_CP006_PROTOTYPES,
  buildBlrCp006Telemetry,
  generateBlrCp006FrozenBank,
  generateBlrCp006Question,
} from "./cp006-runtime";
import { independentlyAnswer } from "./cp006-independent-verifier";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal(actual: unknown, expected: unknown, message: string): void {
  if (actual !== expected) throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
}

function genderEvidence(
  relationId: BlrCp006DirectRelation,
  leftId: string,
  rightId: string,
): readonly (readonly [string, Exclude<BlrCp006Gender, "UNKNOWN">])[] {
  switch (relationId) {
    case "FATHER":
    case "SON":
    case "BROTHER":
      return [[leftId, "MALE"]];
    case "MOTHER":
    case "DAUGHTER":
    case "SISTER":
      return [[leftId, "FEMALE"]];
    case "HUSBAND":
      return [[leftId, "MALE"], [rightId, "FEMALE"]];
    case "WIFE":
      return [[leftId, "FEMALE"], [rightId, "MALE"]];
  }
}

const bank = generateBlrCp006FrozenBank();
const telemetry = buildBlrCp006Telemetry(bank);

equal(bank.length, 152, "frozen bank size");
equal(telemetry.prototypeCount, 19, "prototype count");
equal(telemetry.authorityCount, 5, "authority count");
equal(telemetry.permanentQlCount, 5, "QL count");
equal(telemetry.statementCount, 440, "decoded statement count");
equal(telemetry.uniqueSignatureCount, 152, "unique semantic signatures");
equal(telemetry.permanentQlRange, "BLR-QL-026..BLR-QL-030", "QL range");
equal(telemetry.nextAvailableChapterQlId, "BLR-QL-031", "next QL");

const expectedQlCounts: Record<string, number> = {
  "BLR-QL-026": 72,
  "BLR-QL-027": 16,
  "BLR-QL-028": 16,
  "BLR-QL-029": 24,
  "BLR-QL-030": 24,
};
for (const [qlId, count] of Object.entries(expectedQlCounts)) {
  equal(telemetry.qlCounts[qlId], count, `${qlId} question count`);
}
assert(telemetry.answerPositions.every((count) => count > 0), "all answer positions must be covered");
assert(Object.keys(telemetry.keyStyleCounts).length === 3, "all three code-token styles must be covered");

const itemIds = new Set<string>();
const signatures = new Set<string>();
const internalDiagnosticPattern = /\[(?:CORRECT_[A-Z0-9_]+|[A-Z][A-Z0-9_]{3,})\]/;
const rawDiagnosticNames = [
  "QUERY_DIRECTION_REVERSAL",
  "GENERATION_LEVEL_ERROR",
  "BLOOD_AFFINAL_CONFUSION",
  "INCOMPLETE_DECODED_PATH",
  "IGNORED_EXPLICIT_GENDER_CODE",
  "FALSE_CONTRADICTION",
  "CODE_DIRECTION_GENDER_SWAP",
  "PAIR_RELATION_MISMATCH",
  "DECODED_RELATION_MISMATCH",
];

for (const question of bank) {
  assert(!itemIds.has(question.itemId), `${question.itemId}: duplicate item ID`);
  assert(!signatures.has(question.metadata.semanticFingerprint), `${question.itemId}: duplicate fingerprint`);
  itemIds.add(question.itemId);
  signatures.add(question.metadata.semanticFingerprint);

  equal(question.options.length, 4, `${question.itemId}: option count`);
  equal(question.options.filter((option) => option.isCorrect).length, 1, `${question.itemId}: correct option count`);
  equal(question.options[question.correctIndex]!.text, question.answer, `${question.itemId}: answer/index parity`);

  const keyTokens = new Set(question.codeKey.map((entry) => entry.token));
  const keyRelations = new Set(question.codeKey.map((entry) => entry.relationId));
  equal(keyTokens.size, question.codeKey.length, `${question.itemId}: unique key tokens`);
  equal(keyRelations.size, question.codeKey.length, `${question.itemId}: one meaning per token`);
  question.codedStatements.forEach((coded) => {
    assert(keyTokens.has(coded.token), `${question.itemId}: statement token missing from key`);
    assert(
      question.sharedPrompt.includes(`${coded.leftId} ${coded.token} ${coded.rightId}`),
      `${question.itemId}: displayed coded statement does not match the decoded assertion`,
    );
  });

  for (const entry of question.codeKey) {
    assert(
      entry.token.toLocaleLowerCase("en-IN") !== relationDisplay(entry.relationId).toLocaleLowerCase("en-IN"),
      `${question.itemId}: token resembles its answer relation`,
    );
  }

  equal(question.decodedStatements.length, question.codedStatements.length, `${question.itemId}: decode coverage`);
  assert(question.sharedPrompt.includes("not arithmetic operators"), `${question.itemId}: precedence warning missing`);
  assert(!/name (?:shows|means|suggests|indicates) gender/i.test(question.sharedPrompt), `${question.itemId}: name inference`);
  equal(question.metadata.nameBasedGenderAssumptions, 0, `${question.itemId}: name-gender metadata`);

  const explicitEvidence = new Map<string, Set<BlrCp006Gender>>();
  const relationByToken = new Map(question.codeKey.map((entry) => [entry.token, entry.relationId]));
  for (const coded of question.codedStatements) {
    const relationId = relationByToken.get(coded.token)!;
    for (const [personId, gender] of genderEvidence(relationId, coded.leftId, coded.rightId)) {
      if (!explicitEvidence.has(personId)) explicitEvidence.set(personId, new Set());
      explicitEvidence.get(personId)!.add(gender);
    }
  }
  for (const person of question.graph.persons) {
    if (person.gender === "UNKNOWN") continue;
    assert(
      explicitEvidence.get(person.personId)?.has(person.gender),
      `${question.itemId}: ${person.personId} has fixed ${person.gender} without decoded evidence`,
    );
  }

  equal(independentlyAnswer(question), question.answer, `${question.itemId}: independent answer`);
  equal(question.explanation.optionAnalysis.length, 4, `${question.itemId}: option analysis count`);
  question.explanation.optionAnalysis.forEach((analysis, index) => {
    const option = question.options[index]!;
    assert(
      !internalDiagnosticPattern.test(analysis.explanation),
      `${question.itemId}: internal diagnostic tag leaked into learner explanation`,
    );
    for (const code of rawDiagnosticNames) {
      assert(
        !analysis.explanation.includes(code),
        `${question.itemId}: raw diagnostic name ${code} leaked into learner explanation`,
      );
    }
    assert(
      analysis.explanation.includes(`Option ${analysis.optionLabel}`),
      `${question.itemId}: option explanation must identify its option`,
    );
    if (option.isCorrect) {
      assert(
        analysis.explanation.includes(question.answer),
        `${question.itemId}: correct-option explanation must state the answer`,
      );
    }
    if (question.query.kind === "RELATION" && !option.isCorrect) {
      assert(
        analysis.explanation.includes(question.answer),
        `${question.itemId}: relation distractor feedback must state the decoded answer`,
      );
      assert(
        analysis.explanation.includes(option.text),
        `${question.itemId}: relation distractor feedback must name the rejected relation`,
      );
    }
  });
  assert(question.explanation.familyTree.nodes.length === question.graph.persons.length, `${question.itemId}: tree node parity`);
  assert(question.explanation.familyTree.edges.length > 0, `${question.itemId}: tree edges`);
  assert(question.explanation.familyTree.asciiFallback.includes("Gender not established"), `${question.itemId}: ASCII legend`);

  const replay = generateBlrCp006Question(question.sourcePrototypeId, question.seed);
  equal(replay.metadata.semanticFingerprint, question.metadata.semanticFingerprint, `${question.itemId}: deterministic replay`);
  equal(replay.answer, question.answer, `${question.itemId}: replay answer`);
}

const actualMapping = Object.fromEntries(
  BLR_CP006_CONTRACTS.map((contract) => [contract.qlId, contract.solveAuthority]),
);
const expectedMapping = {
  "BLR-QL-026": "RESOLVE_CODED_RELATION",
  "BLR-QL-027": "IDENTIFY_PERSON_FROM_CODED_GRAPH",
  "BLR-QL-028": "DETERMINE_GENDER_FROM_CODED_GRAPH",
  "BLR-QL-029": "SELECT_CODED_RELATION_PAIR",
  "BLR-QL-030": "RESOLVE_CODED_FAMILY_SET_RELATION",
};
equal(JSON.stringify(actualMapping), JSON.stringify(expectedMapping), "permanent authority mapping");
equal(BLR_CP006_PROTOTYPES.length, 19, "prototype registry count");

console.log(JSON.stringify({
  recordCount: bank.length,
  prototypeCount: telemetry.prototypeCount,
  authorityCount: telemetry.authorityCount,
  permanentQlCount: telemetry.permanentQlCount,
  decodedStatements: telemetry.statementCount,
  independentlyVerified: bank.length,
  explicitGenderEvidenceFailures: 0,
  nameBasedGenderAssumptions: 0,
  displayedStatementMismatches: 0,
  learnerDiagnosticLeaks: 0,
  relationFeedbackMismatches: 0,
  verdict: "BLR-CP-006 PERMANENT RUNTIME PASSED",
}, null, 2));
