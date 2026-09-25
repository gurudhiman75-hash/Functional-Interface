function fail(message: string): never { throw new Error(message); }
const assert = {
  equal(actual: unknown, expected: unknown, message = "Values are not equal"): void { if (actual !== expected) fail(`${message}: ${String(actual)} !== ${String(expected)}`); },
  ok(value: unknown, message = "Assertion failed"): void { if (!value) fail(message); },
  deepEqual(actual: unknown, expected: unknown, message = "Values are not deeply equal"): void {
    const left = JSON.stringify(actual);
    const right = JSON.stringify(expected);
    if (left !== right) fail(`${message}: ${left} !== ${right}`);
  },
};
import { DIRECTIONS, type Coordinate, type Direction } from "../foundation/types";
import { CODE_SYMBOLS, type CodeRecoveryEvidence, type CodedMovementStep, type CodedRelation, type DirectionCodeMap } from "./types";
import { codeMapFingerprint } from "./code-system";
import {
  independentDirection,
  recoverCodeMapsIndependent,
  recoverMissingOperatorIndependent,
  solveCodedMovementIndependent,
  solveCodedRelationsIndependent,
} from "./independent-solver";
import { generateDirCp006Question } from "./generator";
import { DIR_CP006_QLS } from "./task-registry";

assert.deepEqual(DIR_CP006_QLS.map((ql) => ql.qlId), [
  "DIR-QL-023", "DIR-QL-024", "DIR-QL-025", "DIR-QL-026", "DIR-QL-027", "DIR-QL-028", "DIR-QL-029",
]);
assert.equal(new Set(DIR_CP006_QLS.map((ql) => ql.ruleId)).size, DIR_CP006_QLS.length);
assert.ok(DIR_CP006_QLS.every((ql) => ql.solveMode === undefined));
assert.ok(DIR_CP006_QLS.every((ql) => ql.status === "DRAFT"));

const answerPositions = [0, 0, 0, 0];
const stemDiversity = new Map<string, Set<string>>();
const directionCoverage = new Map<string, Set<string>>();
const symbolCoverage = new Map<string, Set<string>>();
const mapFingerprints = new Set<string>();
const difficulties = new Set<string>();
const targetCardinals = new Map<string, Set<string>>();

function count(svg: string, token: string): number {
  return (svg.match(new RegExp(token, "g")) ?? []).length;
}

function asMap(value: unknown): DirectionCodeMap {
  return value as DirectionCodeMap;
}

for (const ql of DIR_CP006_QLS) {
  const stems = new Set<string>();
  const directions = new Set<string>();
  const symbols = new Set<string>();
  const cardinals = new Set<string>();
  stemDiversity.set(ql.qlId, stems);
  directionCoverage.set(ql.qlId, directions);
  symbolCoverage.set(ql.qlId, symbols);
  targetCardinals.set(ql.qlId, cardinals);

  for (let seed = 0; seed < 120; seed += 1) {
    const generated = generateDirCp006Question(ql.qlId, seed);
    const replay = generateDirCp006Question(ql.qlId, seed);
    assert.deepEqual(replay, generated, `${ql.qlId} seed ${seed} is not deterministic`);
    assert.equal(generated.checkpointId, "DIR-CP-006");
    assert.equal(generated.options.length, 4);
    assert.equal(new Set(generated.options.map((option) => option.label.trim().toLocaleLowerCase("en-IN"))).size, 4);
    assert.equal(generated.options.filter((option) => option.errorLabel === null).length, 1);
    assert.equal(generated.options[generated.correctIndex].errorLabel, null);
    assert.deepEqual(generated.options[generated.correctIndex].value, generated.correctAnswer);
    assert.equal(generated.metadata.solverVerified, true);
    assert.equal(generated.metadata.solveMode, null);
    assert.equal(generated.metadata.activeCodeCount, 4);
    assert.equal(generated.stem.split("\n").length, 1);
    assert.ok(!generated.stem.includes("coordinate"));
    assert.ok(!generated.stem.includes("internal"));
    assert.ok(generated.explanation.given.length > 20);
    assert.equal(generated.explanation.decodeLines.length >= 2, true);
    assert.equal(generated.explanation.workingLines.length >= 1, true);
    assert.ok(generated.explanation.resultLine.length > 15);
    assert.ok(generated.explanation.conclusion.length > 15);
    assert.ok(generated.explanation.diagram.svg.includes('data-role="compass"'));
    assert.equal(count(generated.explanation.diagram.svg, 'data-role="code-key-row"'), 4);
    assert.ok(!generated.explanation.diagram.svg.includes("solution"));
    assert.ok(!generated.explanation.diagram.svg.includes("machine-answer"));
    assert.ok(generated.explanation.diagram.svg.indexOf('x="590"') > -1, "Code key must remain in its protected right-side zone");

    const prompt = generated.structuredPrompt;
    const map = prompt.codeMap ? asMap(prompt.codeMap) : prompt.recoveredCodeMap ? asMap(prompt.recoveredCodeMap) : null;
    if (map) {
      assert.equal(new Set(CODE_SYMBOLS.map((symbol) => map[symbol])).size, 4);
      mapFingerprints.add(codeMapFingerprint(map));
    }

    if (ql.answerDemand === "CODED_RELATION_DIRECTION") {
      const relations = prompt.relations as readonly CodedRelation[];
      const query = prompt.query as { readonly subject: string; readonly reference: string };
      const independentCoordinates = solveCodedRelationsIndependent(relations, map!);
      const answer = generated.correctAnswer as Extract<typeof generated.correctAnswer, { readonly kind: "DIRECTION" }>;
      assert.equal(independentDirection(independentCoordinates, query.subject, query.reference), answer.direction);
      directions.add(answer.direction);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-relation-edge"'), relations.length);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-query-guide"'), 1);
      assert.ok(generated.stem.includes("coded chain"));
    } else if (ql.answerDemand === "CODED_ENTITY_LOOKUP") {
      const relations = prompt.relations as readonly CodedRelation[];
      const query = prompt.query as { readonly direction: Direction; readonly reference: string };
      const independentCoordinates = solveCodedRelationsIndependent(relations, map!);
      const answer = generated.correctAnswer as Extract<typeof generated.correctAnswer, { readonly kind: "ENTITY" }>;
      const matches = Object.keys(independentCoordinates).filter((entity) => entity !== query.reference && independentDirection(independentCoordinates, entity, query.reference) === query.direction);
      assert.deepEqual(matches, [answer.entity]);
      cardinals.add(query.direction);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-relation-edge"'), 4);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-query-guide"'), 1);
      assert.ok(generated.stem.includes("Who is"));
    } else if (ql.answerDemand === "RECOVER_DIRECTION_CODE_MAP") {
      const evidence = prompt.evidence as readonly CodeRecoveryEvidence[];
      const recovered = recoverCodeMapsIndependent(evidence);
      const answer = generated.correctAnswer as Extract<typeof generated.correctAnswer, { readonly kind: "CODE_SYMBOL" }>;
      const targetDirection = prompt.targetDirection as string;
      assert.equal(recovered.length, 1);
      assert.equal(codeMapFingerprint(recovered[0]), codeMapFingerprint(map!));
      assert.equal(map![answer.symbol], targetDirection);
      assert.equal(generated.metadata.mappingRecoveredUniquely, true);
      assert.ok(evidence.length >= 2 && evidence.length <= 5);
      assert.ok(evidence.every((item) => item.symbols.length >= 2));
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="recovery-evidence"'), evidence.length);
      symbols.add(answer.symbol);
      cardinals.add(targetDirection);
    } else if (ql.answerDemand === "EQUIVALENT_CODED_STATEMENT") {
      const target = prompt.targetRelation as { readonly subject: string; readonly reference: string; readonly direction: "NORTH" | "EAST" | "SOUTH" | "WEST" };
      const answer = generated.correctAnswer as Extract<typeof generated.correctAnswer, { readonly kind: "CODED_STATEMENT" }>;
      const parts = answer.statement.split(" ");
      assert.deepEqual(parts, [target.subject, parts[1], target.reference]);
      assert.ok(CODE_SYMBOLS.includes(parts[1] as (typeof CODE_SYMBOLS)[number]));
      assert.equal(map![parts[1] as (typeof CODE_SYMBOLS)[number]], target.direction);
      cardinals.add(target.direction);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-relation-edge"'), 1);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-query-guide"'), 1);
    } else if (ql.answerDemand === "VALID_CODED_CONCLUSION") {
      const relations = prompt.relations as readonly CodedRelation[];
      const correctConclusion = prompt.correctConclusion as { readonly subject: string; readonly reference: string; readonly direction: Direction };
      const independentCoordinates = solveCodedRelationsIndependent(relations, map!);
      assert.equal(independentDirection(independentCoordinates, correctConclusion.subject, correctConclusion.reference), correctConclusion.direction);
      const answer = generated.correctAnswer as Extract<typeof generated.correctAnswer, { readonly kind: "CONCLUSION" }>;
      assert.ok(answer.statement.includes(correctConclusion.subject));
      assert.ok(answer.statement.includes(correctConclusion.reference));
      directions.add(correctConclusion.direction);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-query-guide"'), 1);
      assert.ok(generated.stem.includes("Which of the following conclusions"));
    } else if (ql.answerDemand === "MISSING_CODE_OPERATOR") {
      const relations = prompt.relations as readonly CodedRelation[];
      const hiddenIndex = prompt.hiddenIndex as number;
      const target = prompt.targetRelation as { readonly subject: string; readonly reference: string; readonly direction: Direction };
      const satisfying = recoverMissingOperatorIndependent(relations, hiddenIndex, target.subject, target.reference, target.direction, map!);
      const answer = generated.correctAnswer as Extract<typeof generated.correctAnswer, { readonly kind: "CODE_SYMBOL" }>;
      assert.deepEqual(satisfying, [answer.symbol]);
      assert.equal(generated.explanation.workingLines.length, 4);
      assert.ok(generated.stem.includes(" ? "));
      assert.ok(generated.stem.includes("replace ?"));
      symbols.add(answer.symbol);
      directions.add(target.direction);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-query-guide"'), 1);
    } else {
      const steps = prompt.steps as readonly CodedMovementStep[];
      const endpoint = prompt.endpoint as Coordinate;
      const independent = solveCodedMovementIndependent(steps, map!);
      const answer = generated.correctAnswer as Extract<typeof generated.correctAnswer, { readonly kind: "DIRECTION" }>;
      assert.deepEqual(independent.endpoint, endpoint);
      assert.equal(independent.direction, answer.direction);
      directions.add(answer.direction);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-movement-segment"'), steps.length);
      assert.equal(count(generated.explanation.diagram.svg, 'data-role="coded-endpoint-guide"'), 1);
      assert.ok(generated.stem.includes("coded movement system"));
      assert.ok(generated.explanation.workingLines.every((line) => line.includes("metres") && !/\(-?\d+,\s*-?\d+\)/.test(line)), "Movement working must use plain language without coordinate tuples");
      assert.ok(generated.explanation.resultLine.includes("metres") && !generated.explanation.resultLine.includes(" step"), "Movement result must preserve the stated distance unit");
    }

    stems.add(generated.stem);
    difficulties.add(generated.difficulty);
    answerPositions[generated.correctIndex] += 1;
  }
}

assert.equal(directionCoverage.get("DIR-QL-023")!.size, DIRECTIONS.length);
assert.equal(directionCoverage.get("DIR-QL-027")!.size, DIRECTIONS.length);
assert.equal(directionCoverage.get("DIR-QL-029")!.size, DIRECTIONS.length);
assert.equal(targetCardinals.get("DIR-QL-024")!.size, 4);
assert.equal(targetCardinals.get("DIR-QL-025")!.size, 4);
assert.equal(targetCardinals.get("DIR-QL-026")!.size, 4);
assert.equal(symbolCoverage.get("DIR-QL-025")!.size, 4);
assert.equal(symbolCoverage.get("DIR-QL-028")!.size, 4);
assert.ok(mapFingerprints.size >= 20, `Code-map diversity too low: ${mapFingerprints.size}`);
for (const [qlId, stems] of stemDiversity) assert.ok(stems.size >= 110, `${qlId} stem diversity too low: ${stems.size}`);
assert.ok(difficulties.has("EASY"));
assert.ok(difficulties.has("MEDIUM"));
assert.ok(difficulties.has("HARD"));
const minPosition = Math.min(...answerPositions);
const maxPosition = Math.max(...answerPositions);
assert.ok(maxPosition / minPosition < 1.35, `Answer positions are imbalanced: ${answerPositions.join(", ")}`);

console.log("DIR-CP-006 coded-direction proof passed.", {
  qlCount: DIR_CP006_QLS.length,
  generatedCases: DIR_CP006_QLS.length * 120,
  directionCoverage: Object.fromEntries([...directionCoverage].map(([qlId, values]) => [qlId, [...values].sort()])),
  symbolCoverage: Object.fromEntries([...symbolCoverage].map(([qlId, values]) => [qlId, [...values].sort()])),
  answerPositions,
  stemDiversity: Object.fromEntries([...stemDiversity].map(([qlId, stems]) => [qlId, stems.size])),
  codeMapFingerprints: mapFingerprints.size,
});
