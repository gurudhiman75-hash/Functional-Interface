import { compileSea001TeachingExplanationFromUnknown } from "./explanation/checkpoint-teaching.ts";
import { buildSea001SaturationCorpus } from "./saturation/corpus.ts";

const corpus = buildSea001SaturationCorpus(2);
if (corpus.caselets.length !== 40) throw new Error(`Expected 40 teaching-proof caselets, got ${corpus.caselets.length}`);

const bannedInternalTerms = /\b(?:solver|oracle|canonical|model class|search branch|seat zero)\b/i;
const arbitraryCaseLanguage = /several arrangements are still possible|three useful cases/i;
let caseAnalysisCount = 0;
let eliminationCount = 0;
let cp001PartialCaseCount = 0;
const checkpointCounts = new Map<string, number>();

for (const caselet of corpus.caselets) {
  const explanation = compileSea001TeachingExplanationFromUnknown(caselet);
  checkpointCounts.set(caselet.checkpointId, (checkpointCounts.get(caselet.checkpointId) ?? 0) + 1);

  if (!explanation.trim()) throw new Error(`Empty teaching explanation: ${caselet.caseletId}`);
  if (bannedInternalTerms.test(explanation)) throw new Error(`Internal terminology leaked into ${caselet.caseletId}: ${explanation}`);
  if (arbitraryCaseLanguage.test(explanation)) throw new Error(`Arbitrary representative-case language leaked into ${caselet.caseletId}`);
  if (!/final (?:row|clockwise arrangement|clockwise arrangement and facings)|therefore/i.test(explanation)) {
    throw new Error(`Final arrangement conclusion is missing: ${caselet.caseletId}`);
  }

  const caseNumbers = [...explanation.matchAll(/Case (\d+)/g)].map((match) => Number(match[1]));
  if (caseNumbers.length > 0) {
    caseAnalysisCount += 1;
    const highestCase = Math.max(...caseNumbers);
    if (highestCase > 3) throw new Error(`More than three student-facing cases exposed: ${caselet.caseletId}`);
    if (!explanation.includes("❌")) throw new Error(`Case analysis lacks a cancelled case: ${caselet.caseletId}`);
    if (!explanation.includes("✅")) throw new Error(`Case analysis lacks a surviving case: ${caselet.caseletId}`);
    if (!/(?:does not satisfy this clue|contradicts the clue)/.test(explanation)) {
      throw new Error(`Elimination is not tied to a displayed clue: ${caselet.caseletId}`);
    }
    eliminationCount += 1;
  }

  if (caselet.checkpointId === "SEA-CP-001" && /possible partial cases/.test(explanation)) {
    cp001PartialCaseCount += 1;
    if (!/\b\d+:_\b/.test(explanation)) throw new Error(`CP001 partial case does not leave unresolved seats blank: ${caselet.caseletId}`);
    if (!/Do not guess the remaining people/.test(explanation)) throw new Error(`CP001 partial-case pedagogy guard is missing: ${caselet.caseletId}`);
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

if (caseAnalysisCount < 16 || eliminationCount !== caseAnalysisCount) {
  throw new Error(`Teaching-case coverage is too weak: cases=${caseAnalysisCount}, eliminations=${eliminationCount}`);
}
if (cp001PartialCaseCount < 2) {
  throw new Error(`CP001 partial-case teaching coverage is too weak: ${cp001PartialCaseCount}`);
}
for (const checkpointId of ["SEA-CP-001", "SEA-CP-002", "SEA-CP-003", "SEA-CP-004", "SEA-CP-005"]) {
  if ((checkpointCounts.get(checkpointId) ?? 0) !== 8) {
    throw new Error(`Teaching proof did not cover all four PBAs in ${checkpointId}`);
  }
}

console.log("PASS_SEA_001_TEACHING_EXPLANATIONS");
console.log("caselets", corpus.caselets.length);
console.log("case-analysis explanations", caseAnalysisCount);
console.log("CP001 partial-case explanations", cp001PartialCaseCount);
console.log("elimination explanations", eliminationCount);
console.log("permanent QLs", 0);
