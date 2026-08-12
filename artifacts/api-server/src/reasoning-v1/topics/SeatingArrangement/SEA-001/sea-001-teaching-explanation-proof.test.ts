import { compileSea001TeachingExplanationFromUnknown } from "./explanation/checkpoint-teaching.ts";
import { buildSea001SaturationCorpus, type AuditCaselet } from "./saturation/corpus.ts";

const corpus = buildSea001SaturationCorpus(2);
if (corpus.caselets.length !== 40) throw new Error(`Expected 40 teaching-proof caselets, got ${corpus.caselets.length}`);

const bannedInternalTerms = /\b(?:solver|oracle|canonical|model class|search branch|seat zero)\b/i;
const arbitraryCaseLanguage = /several arrangements are still possible|three useful cases/i;
const explanationShortcut = /use the remaining clues|build the arrangement by joining the clues|keep this facing fixed while applying the remaining clues/i;
const internalPersonId = /\bP\d+\b/;
const participantNames = new Set<string>();
const pbaCaseCounts = new Map<string, number>();
const contractsByCheckpointPosition = new Map<string, Set<string>>();
let caseAnalysisCount = 0;
let eliminationCount = 0;
let cp001PartialCaseCount = 0;
const checkpointCounts = new Map<string, number>();

function displayNamesFor(caselet: AuditCaselet): Readonly<Record<string, string>> {
  const names = caselet.setupText.match(/persons—(.+?)—are sitting/i)?.[1]
    ?.split(",")
    .map((name) => name.trim())
    .filter(Boolean) ?? [];
  const ids = Array.from({ length: names.length }, (_, index) => `P${index + 1}`);
  return Object.fromEntries(ids.map((personId, index) => [personId, names[index] ?? personId]));
}

for (const caselet of corpus.caselets) {
  const explanation = compileSea001TeachingExplanationFromUnknown(caselet);
  checkpointCounts.set(caselet.checkpointId, (checkpointCounts.get(caselet.checkpointId) ?? 0) + 1);

  for (const child of caselet.children) {
    const key = `${caselet.checkpointId}:Q${child.questionOrder}`;
    const contracts = contractsByCheckpointPosition.get(key) ?? new Set<string>();
    contracts.add(child.queryContractId);
    contractsByCheckpointPosition.set(key, contracts);
  }

  const visibleText = [
    caselet.setupText,
    ...caselet.clueTexts,
    caselet.diagramText ?? caselet.diagram?.text ?? "",
    explanation,
    ...caselet.children.flatMap((child) => [
      child.text,
      child.explanation,
      ...child.options.flatMap((option) => [option.display, option.explanation]),
    ]),
  ].join("\n");
  if (/position 1 from the left end/i.test(visibleText)) throw new Error(`Awkward left-end wording leaked into ${caselet.caseletId}`);
  if (/not necessarily seated in alphabetical order/i.test(visibleText)) throw new Error(`Alphabetical-order filler leaked into ${caselet.caseletId}`);
  if (internalPersonId.test(visibleText)) throw new Error(`Internal person ID leaked into student-facing content: ${caselet.caseletId}`);

  const setupNames = caselet.setupText.match(/persons—(.+?)—are sitting/i)?.[1]
    ?.split(",")
    .map((name) => name.trim())
    .filter(Boolean) ?? [];
  for (const name of setupNames) participantNames.add(name);
  if (caselet.checkpointId !== "SEA-CP-001" && setupNames.some((name) => /^[A-J]$/.test(name))) {
    throw new Error(`Single-letter participant pool leaked into ${caselet.caseletId}`);
  }

  if (!explanation.trim()) throw new Error(`Empty teaching explanation: ${caselet.caseletId}`);
  if (bannedInternalTerms.test(explanation)) throw new Error(`Internal terminology leaked into ${caselet.caseletId}: ${explanation}`);
  if (arbitraryCaseLanguage.test(explanation)) throw new Error(`Arbitrary representative-case language leaked into ${caselet.caseletId}`);
  if (explanationShortcut.test(explanation)) throw new Error(`Unhelpful explanation shortcut leaked into ${caselet.caseletId}: ${explanation}`);
  if (caselet.clueTexts.length > 0 && !/What this tells us:/i.test(explanation)) {
    throw new Error(`Teaching explanation does not translate clues into student actions: ${caselet.caseletId}`);
  }
  if (!/final (?:row|clockwise arrangement|clockwise arrangement and facings)|therefore/i.test(explanation)) {
    throw new Error(`Final arrangement conclusion is missing: ${caselet.caseletId}`);
  }

  if (caselet.checkpointId === "SEA-CP-002" && caselet.diagramText && !explanation.includes(caselet.diagramText)) {
    throw new Error(`CP002 teaching final row does not match the displayed solved row: ${caselet.caseletId}`);
  }

  if ((caselet.checkpointId === "SEA-CP-003" || caselet.checkpointId === "SEA-CP-004")
    && /this adjacency gives two orientations/i.test(explanation)) {
    const adjacency = caselet.constraints?.find((constraint) => constraint.kind === "ADJACENT");
    if (!adjacency || typeof adjacency.firstId !== "string" || typeof adjacency.secondId !== "string") {
      throw new Error(`Missing typed adjacency behind case explanation: ${caselet.caseletId}`);
    }
    const displayNames = displayNamesFor(caselet);
    const first = displayNames[adjacency.firstId];
    const second = displayNames[adjacency.secondId];
    if (!first || !second || !explanation.includes(`Case 1: ${first} → ${second} clockwise.`)
      || !explanation.includes(`Case 2: ${second} → ${first} clockwise.`)) {
      throw new Error(`Circular adjacency cases use names inconsistent with the displayed clue: ${caselet.caseletId}`);
    }
  }

  const caseNumbers = [...explanation.matchAll(/Case (\d+)/g)].map((match) => Number(match[1]));
  if (caseNumbers.length > 0) {
    caseAnalysisCount += 1;
    pbaCaseCounts.set(caselet.blueprintAuthorityId, (pbaCaseCounts.get(caselet.blueprintAuthorityId) ?? 0) + 1);
    const highestCase = Math.max(...caseNumbers);
    if (highestCase > 3) throw new Error(`More than three student-facing cases exposed: ${caselet.caseletId}`);
    if (!explanation.includes("❌")) throw new Error(`Case analysis lacks a cancelled case: ${caselet.caseletId}`);
    if (!explanation.includes("✅")) throw new Error(`Case analysis lacks a surviving case: ${caselet.caseletId}`);
    if (!/cancel it because/i.test(explanation)) {
      throw new Error(`Elimination is not explicitly justified: ${caselet.caseletId}`);
    }
    eliminationCount += 1;
  }

  if (caselet.checkpointId === "SEA-CP-001" && /possible partial cases/.test(explanation)) {
    cp001PartialCaseCount += 1;
    if (!/\b\d+:_\b/.test(explanation)) throw new Error(`CP001 partial case does not leave unresolved seats blank: ${caselet.caseletId}`);
    if (!/leave the rest blank/i.test(explanation)) throw new Error(`CP001 partial-case pedagogy guard is missing: ${caselet.caseletId}`);
  }

  if ((caselet.checkpointId === "SEA-CP-003" || caselet.checkpointId === "SEA-CP-004" || caselet.checkpointId === "SEA-CP-005")
    && /rotating the complete arrangement does not create a different case/i.test(explanation) === false
    && caselet.topologySnapshot?.landmark === undefined) {
    throw new Error(`Circular rotation-equivalence teaching guard is missing: ${caselet.caseletId}`);
  }

  if (caselet.checkpointId === "SEA-CP-005"
    && (caselet.blueprintAuthorityId === "SEA-PBA-017" || caselet.blueprintAuthorityId === "SEA-PBA-019")) {
    const facingClues = caselet.clueTexts.filter((clue) => /face(?:s)? (?:the centre|outward)/i.test(clue));
    if (facingClues.length !== 1) throw new Error(`Known CP005 facings are not grouped for ${caselet.caseletId}`);
  }

  if (caselet.lifecycle.permanentQlCount !== 0
    || caselet.lifecycle.questionStudioRegistered
    || caselet.lifecycle.questionBankWritable
    || caselet.lifecycle.testEligible
    || caselet.lifecycle.publiclyPublishable) {
    throw new Error(`Teaching work changed a lifecycle lock: ${caselet.caseletId}`);
  }
}

if (participantNames.size < 28) {
  throw new Error(`SEA-001 participant pool is still too narrow in the proof corpus: ${participantNames.size}`);
}
if (caseAnalysisCount < 16 || eliminationCount !== caseAnalysisCount) {
  throw new Error(`Teaching-case coverage is too weak: cases=${caseAnalysisCount}, eliminations=${eliminationCount}`);
}
if (cp001PartialCaseCount < 2) {
  throw new Error(`CP001 partial-case teaching coverage is too weak: ${cp001PartialCaseCount}`);
}
for (const blueprintId of ["SEA-PBA-003", "SEA-PBA-011", "SEA-PBA-015"]) {
  if ((pbaCaseCounts.get(blueprintId) ?? 0) < 1) {
    throw new Error(`Expected at least one explicit case-analysis proof for ${blueprintId}`);
  }
}
for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"]) {
  if ((checkpointCounts.get(checkpointId) ?? 0) !== 8) {
    throw new Error(`Teaching proof did not cover all four PBAs in ${checkpointId}`);
  }
}

// Q1 is intentionally fixed for the all-centre/all-outward direction detector.
// All other visible slots must show more than one query family across this corpus.
for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"]) {
  for (const questionOrder of [1, 2, 3, 4]) {
    if ((checkpointId === "SEA-CP-003" || checkpointId === "SEA-CP-004") && questionOrder === 1) continue;
    const contracts = contractsByCheckpointPosition.get(`${checkpointId}:Q${questionOrder}`) ?? new Set<string>();
    if (contracts.size < 2) {
      throw new Error(`Visible query order is still deterministic at ${checkpointId} Q${questionOrder}: ${[...contracts].join(",")}`);
    }
  }
}

console.log("PASS_SEA_001_TEACHING_EXPLANATIONS");
console.log("caselets", corpus.caselets.length);
console.log("distinct participant names", participantNames.size);
console.log("case-analysis explanations", caseAnalysisCount);
console.log("CP001 partial-case explanations", cp001PartialCaseCount);
console.log("PBA003 cases", pbaCaseCounts.get("SEA-PBA-003") ?? 0);
console.log("PBA011 cases", pbaCaseCounts.get("SEA-PBA-011") ?? 0);
console.log("PBA015 cases", pbaCaseCounts.get("SEA-PBA-015") ?? 0);
console.log("elimination explanations", eliminationCount);
console.log("permanent QLs", 0);
