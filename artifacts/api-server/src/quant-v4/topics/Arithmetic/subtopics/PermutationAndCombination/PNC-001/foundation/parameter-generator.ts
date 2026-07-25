import { getPnc001QuestionEntries, getPnc001QuestionEntry, getPnc001VariableRanges } from "./library";
import { combinationExact, createSeededRandom, factorialExact, hashSeed, multisetPermutationExact, permutationExact, pickSeeded, powerExact, productExact } from "./math";
import { PNC_001_ACTIVE_CP_IDS, PNC_001_PACKAGE_ID, type Pnc001ActiveCanonicalProblemId, type Pnc001Difficulty, type Pnc001ParameterInput, type Pnc001Parameters, type Pnc001QuestionEntry, type Pnc001SolveMode } from "./types";

function pickValues(pool: readonly number[], count: number, random: () => number, preferDistinct: boolean): number[] {
  if (!preferDistinct || pool.length < count) return Array.from({ length: count }, () => pickSeeded(pool, random));
  const available = [...pool]; const result: number[] = [];
  while (result.length < count) result.push(available.splice(Math.floor(random() * available.length), 1)[0]!);
  return result;
}
function selectEntry(input: Pnc001ParameterInput, seed: string, cpId: Pnc001ActiveCanonicalProblemId): Pnc001QuestionEntry {
  if (input.questionLanguageId) {
    const entry = getPnc001QuestionEntry(input.questionLanguageId);
    const difficulty = input.difficulty ?? input.difficultyBand;
    if (difficulty && difficulty !== entry.difficulty) throw new Error(`PNC-001 QL ${entry.qlId} is ${entry.difficulty}, not ${difficulty}`);
    return entry;
  }
  const difficulty = input.difficulty ?? input.difficultyBand;
  const eligible = getPnc001QuestionEntries().filter((entry) => entry.cpId === cpId && (!difficulty || entry.difficulty === difficulty));
  if (!eligible.length) throw new Error(`No active PNC-001 QLs for ${cpId} and difficulty ${difficulty ?? "any"}`);
  return pickSeeded(eligible, createSeededRandom(`${seed}:ql`));
}
function validPermutationR(pool: readonly number[], n: number): number[] { return pool.filter((r) => r >= 2 && r <= n); }
function validCombinationR(pool: readonly number[], n: number, lowerHalfOnly = false): number[] {
  const ceiling = lowerHalfOnly ? Math.floor(n / 2) : n;
  return pool.filter((r) => r >= 1 && r <= ceiling);
}
function pickMultisetState(totalPool: readonly number[], repeatPool: readonly number[], random: () => number): { totalObjects: number; repeatA: number; repeatB: number; distinctObjects: number } {
  const states = totalPool.flatMap((totalObjects) => repeatPool.flatMap((repeatA) => repeatPool
    .filter((repeatB) => repeatA + repeatB <= totalObjects - 1)
    .map((repeatB) => ({ totalObjects, repeatA, repeatB, distinctObjects: totalObjects - repeatA - repeatB }))));
  return pickSeeded(states, random);
}
function pickDigitLength(maximumDigit: number, lengths: readonly number[], zeroIncluded: boolean, random: () => number): number {
  const availableSymbols = maximumDigit + (zeroIncluded ? 1 : 0);
  return pickSeeded(lengths.filter((length) => length >= 2 && length <= availableSymbols), random);
}
function mixedCountExact(totalObjects: number, selectedObjects: number, roleCount: number, ceiling: number): number {
  return productExact([
    combinationExact(totalObjects, selectedObjects, ceiling),
    permutationExact(selectedObjects, roleCount, ceiling),
  ], ceiling);
}
function fixedMixedRoleCount(entry: Pnc001QuestionEntry): number | undefined {
  if (entry.scenarioFamily === "committeeChair") return 1;
  if (entry.scenarioFamily === "teamCaptainVice") return 2;
  if (entry.scenarioFamily === "committeeThreeOffices") return 3;
  return undefined;
}
function buildValues(entry: Pnc001QuestionEntry, seed: string): Record<string, number> {
  const ranges = getPnc001VariableRanges(); const pool = ranges.ranges[entry.difficulty];
  const random = createSeededRandom(`${seed}:${entry.qlId}:values`); const distinct = ranges.generation.preferDistinctStageCounts;
  switch (entry.solveMode) {
    case "countSequentialIndependentChoices":
    case "countMutuallyExclusiveAlternatives": {
      const count = entry.requiredVariables.includes("choiceC") ? 3 : 2;
      const selected = pickValues(count === 3 ? pool.threeStage : pool.twoStage, count, random, distinct);
      return { choiceA: selected[0]!, choiceB: selected[1]!, ...(count === 3 ? { choiceC: selected[2]! } : {}) };
    }
    case "countDisjointCasePartition": { const v = pickValues(pool.twoStage, 4, random, false); return { caseAFirst:v[0]!,caseARest:v[1]!,caseBFirst:v[2]!,caseBRest:v[3]! }; }
    case "countUsingSimpleComplement": { const [a,b] = pickValues(pool.twoStage,2,random,distinct); const total=productExact([a!,b!],ranges.answerCeiling); const invalid=pickSeeded(pool.invalid.filter(v=>v>0&&v<total),random); return {choiceA:a!,choiceB:b!,invalidChoices:invalid}; }
    case "recoverMissingStageChoiceCount": { const [known,missing]=pickValues(pool.recovered,2,random,distinct); return {knownChoices:known!,missingChoices:missing!,totalChoices:productExact([known!,missing!],ranges.answerCeiling)}; }
    case "evaluateFactorialValue": { const selected=pickSeeded(pool.factorial,random); return entry.scenarioFamily==="factorialPredecessor"?{n:Math.max(2,selected)}:{factorialArgument:selected}; }
    case "evaluateFactorialUnitExpression": return {factorialArgument:pickSeeded(pool.factorial,random)};
    case "simplifyFactorialQuotient": {
      if(entry.scenarioFamily==="numericFactorialQuotient"){const upper=pickSeeded(pool.factorial,random);const gap=pickSeeded(pool.factorialGap.filter(g=>g<=upper),random);return{upper,lower:upper-gap};}
      const offset=entry.scenarioFamily==="doubleSuccessorFactorialQuotient"?2:1; return {n:pickSeeded(pool.factorial.filter(v=>v+offset<=ranges.generation.maximumFactorialArgument),random)};
    }
    case "recoverFactorialArgument": {
      const shifted=entry.scenarioFamily==="shiftedFactorialInverse"; const n=pickSeeded(pool.factorial.filter(v=>!shifted||v+1<=ranges.generation.maximumFactorialArgument),random); const arg=n+(shifted?1:0);
      return {solutionN:n,matchedFactorialArgument:arg,target:factorialExact(arg,ranges.answerCeiling)};
    }
    case "recoverFactorialQuotientArgument": {const n=pickSeeded(pool.factorial.filter(v=>v>=2),random);return{solutionN:n,target:productExact([n,n-1],ranges.answerCeiling)};}
    case "arrangeAllDistinctObjects": return { totalObjects: pickSeeded(pool.permutationN, random), selectedObjects: 0 };
    case "arrangeRFromNDistinctObjects": {
      const n=pickSeeded(pool.permutationN,random); const fixedR=entry.scenarioFamily==="rankedMedals"?3:undefined;
      const r=fixedR ?? pickSeeded(validPermutationR(pool.permutationR,n),random); return {totalObjects:n,selectedObjects:r};
    }
    case "recoverPermutationParameter": {
      if(entry.scenarioFamily==="recoverTotalObjects"){const r=pickSeeded(validPermutationR(pool.permutationR,6),random);const n=pickSeeded(pool.permutationN.filter(v=>v>=r),random);return{solutionN:n,selectedObjects:r,target:permutationExact(n,r,ranges.answerCeiling)};}
      const n=pickSeeded(pool.permutationN,random);const r=pickSeeded(validPermutationR(pool.permutationR,n),random);return{totalObjects:n,solutionR:r,target:permutationExact(n,r,ranges.answerCeiling)};
    }
    case "selectRFromNDistinctObjects": {
      const n = pickSeeded(pool.combinationN, random);
      const fixedR = entry.scenarioFamily === "unorderedPairs" ? 2 : entry.scenarioFamily === "unorderedTriples" ? 3 : undefined;
      const r = fixedR ?? pickSeeded(validCombinationR(pool.combinationR, n), random);
      return { totalObjects: n, selectedObjects: r };
    }
    case "recoverCombinationParameter": {
      if (entry.scenarioFamily === "recoverCombinationTotal") {
        const r = pickSeeded(validCombinationR(pool.combinationR, 8), random);
        const n = pickSeeded(pool.combinationN.filter((value) => value >= r + 1), random);
        return { solutionN: n, selectedObjects: r, target: combinationExact(n, r, ranges.answerCeiling) };
      }
      const n = pickSeeded(pool.combinationN, random);
      const r = pickSeeded(validCombinationR(pool.combinationR, n, true), random);
      return { totalObjects: n, solutionR: r, halfObjects: Math.floor(n / 2), target: combinationExact(n, r, ranges.answerCeiling) };
    }
    case "recoverComplementaryCombinationIndex": {
      const n = pickSeeded(pool.combinationN.filter((value) => value >= 5), random);
      const knownR = pickSeeded(validCombinationR(pool.combinationR, n, true).filter((value) => value < n / 2), random);
      return { totalObjects: n, knownSelection: knownR, solutionR: n - knownR, halfObjects: Math.floor(n / 2) };
    }
    case "formNumbersWithoutRepetitionNoZero": {
      const maximumDigit = pickSeeded(pool.digitMaximum.filter((value) => value >= 3), random);
      return { maximumDigit, length: pickDigitLength(maximumDigit, pool.digitLength, false, random) };
    }
    case "formNumbersWithoutRepetitionWithZero": {
      const maximumDigit = pickSeeded(pool.digitMaximum.filter((value) => value >= 3), random);
      return { maximumDigit, length: pickDigitLength(maximumDigit, pool.digitLength, true, random) };
    }
    case "formCodesWithRepetition":
    case "formNumbersWithRepetitionAndZero": {
      const maximumDigit = pickSeeded(pool.digitMaximum, random);
      const length = pickSeeded(pool.digitLength.filter((value) => value <= ranges.generation.maximumCodeLength), random);
      return { maximumDigit, length };
    }
    case "formParityNumbersWithoutRepetition": {
      const zeroIncluded = entry.scenarioFamily !== "evenNoZero";
      const maximumDigit = pickSeeded(pool.digitMaximum.filter((value) => value >= 4), random);
      return { maximumDigit, length: pickDigitLength(maximumDigit, pool.digitLength, zeroIncluded, random) };
    }
    case "formDivisibleByFiveNumbersWithoutRepetition": {
      const maximumDigit = pickSeeded(pool.digitMaximum.filter((value) => value >= 5), random);
      return { maximumDigit, length: pickDigitLength(maximumDigit, pool.digitLength, true, random) };
    }
    case "formNumbersAboveLeadingThreshold": {
      const maximumDigit = pickSeeded(pool.digitMaximum.filter((value) => value >= 5), random);
      const thresholdDigit = pickSeeded(Array.from({ length: maximumDigit - 2 }, (_, index) => index + 2), random);
      return { maximumDigit, thresholdDigit };
    }
    case "formAlphanumericCodes": {
      const letterSlots = pickSeeded(pool.codeSlots.filter((value) => value >= 1), random);
      const digitSlots = pickSeeded(pool.codeSlots.filter((value) => value >= 1), random);
      return { letterSlots, digitSlots, letterChoices: pickSeeded(pool.letterChoices, random), digitChoices: pickSeeded(pool.digitChoices, random) };
    }
    case "recoverSymbolCountForCode": {
      const length = pickSeeded(pool.codeSlots.filter((value) => value >= 2), random);
      const maximumSymbols = ranges.generation.maximumCodeSymbols;
      const solutionSymbols = pickSeeded(Array.from({ length: maximumSymbols - 2 }, (_, index) => index + 2), random);
      return { length, maximumSymbols, solutionSymbols, target: powerExact(solutionSymbols, length, ranges.answerCeiling) };
    }
    case "formCodesWithExactlyOnePair": {
      const symbolCount = pickSeeded(pool.digitMaximum.map((value) => value + 1).filter((value) => value >= 4), random);
      return { symbolCount };
    }
    case "arrangeAllMultisetObjects": {
      if (entry.scenarioFamily === "wordApple") return { totalObjects: 5, repeatA: 2, distinctObjects: 3 };
      if (entry.scenarioFamily === "wordBalloon") return { totalObjects: 7, repeatA: 2, repeatB: 2, distinctObjects: 3 };
      if (entry.scenarioFamily === "wordMississippi") return { totalObjects: 11, repeatA: 4, repeatB: 4, repeatC: 2, distinctObjects: 1 };
      return pickMultisetState(pool.multisetTotal, pool.multisetRepeat, random);
    }
    case "arrangeMultisetAfterFixingPosition": {
      return entry.scenarioFamily === "balloonFixedUnique"
        ? { totalObjects: 7, repeatA: 2, repeatB: 2, fixedMultiplicity: 1 }
        : { totalObjects: 7, repeatA: 2, repeatB: 2, fixedMultiplicity: 2 };
    }
    case "findMultisetOvercountFactor": return pickMultisetState(pool.multisetTotal, pool.multisetRepeat, random);
    case "recoverMultisetMultiplicity": {
      const totalObjects = pickSeeded(pool.multisetTotal.filter((value) => value >= 6), random);
      const maximumMultiplicity = Math.min(ranges.generation.maximumMultisetMultiplicity, totalObjects - 1);
      const solutionMultiplicity = pickSeeded(Array.from({ length: maximumMultiplicity - 1 }, (_, index) => index + 2), random);
      return { totalObjects, maximumMultiplicity, solutionMultiplicity, target: multisetPermutationExact(totalObjects, [solutionMultiplicity], ranges.answerCeiling) };
    }
    case "findDictionaryRankOfWord": {
      return { dictionaryWordVariant: entry.scenarioFamily === "dictionaryRankRahul" ? 1 : 2 };
    }
    case "selectThenAssignDistinctRoles": {
      const fixedRoles = fixedMixedRoleCount(entry);
      const states = pool.mixedPool.flatMap((totalObjects) => pool.mixedSelection
        .filter((selectedObjects) => selectedObjects < totalObjects)
        .flatMap((selectedObjects) => {
          const roles = fixedRoles === undefined ? pool.mixedRoles.filter((roleCount) => roleCount >= 1 && roleCount < selectedObjects) : [fixedRoles];
          return roles.filter((roleCount) => roleCount < selectedObjects).map((roleCount) => ({ totalObjects, selectedObjects, roleCount }));
        }));
      return pickSeeded(states, random);
    }
    case "selectThenArrangeAllSelected": {
      const states = pool.mixedPool.flatMap((totalObjects) => pool.mixedSelection
        .filter((selectedObjects) => selectedObjects < totalObjects)
        .map((selectedObjects) => ({ totalObjects, selectedObjects, roleCount: selectedObjects })));
      return pickSeeded(states, random);
    }
    case "findRoleAssignmentMultiplier": {
      const selectedObjects = pickSeeded(pool.mixedSelection.filter((value) => value >= 3), random);
      const roleCount = pickSeeded(pool.mixedRoles.filter((value) => value >= 1 && value <= selectedObjects), random);
      return { selectedObjects, roleCount };
    }
    case "recoverSelectionRoleParameter": {
      if (entry.scenarioFamily === "recoverMixedTotalObjects") {
        const selectedObjects = pickSeeded(pool.mixedSelection, random);
        const roleCount = pickSeeded(pool.mixedRoles.filter((value) => value < selectedObjects), random);
        const minimumTotalObjects = selectedObjects + 1;
        const maximumTotalObjects = ranges.generation.maximumMixedPool;
        const solutionN = pickSeeded(pool.mixedPool.filter((value) => value >= minimumTotalObjects), random);
        return { selectedObjects, roleCount, minimumTotalObjects, maximumTotalObjects, solutionN, target: mixedCountExact(solutionN, selectedObjects, roleCount, ranges.answerCeiling) };
      }
      if (entry.scenarioFamily === "recoverMixedSelectedObjects") {
        const states = pool.mixedPool.flatMap((totalObjects) => pool.mixedRoles.flatMap((roleCount) => {
          const minimumSelectedObjects = roleCount + 1;
          const maximumSelectedObjects = Math.min(ranges.generation.maximumMixedSelection, totalObjects - 1);
          const selections = Array.from({ length: Math.max(0, maximumSelectedObjects - minimumSelectedObjects + 1) }, (_, index) => minimumSelectedObjects + index);
          const targets = selections.map((selectedObjects) => ({ selectedObjects, target: mixedCountExact(totalObjects, selectedObjects, roleCount, ranges.answerCeiling) }));
          return targets.filter((candidate) => targets.filter((other) => other.target === candidate.target).length === 1)
            .map((candidate) => ({ totalObjects, roleCount, minimumSelectedObjects, maximumSelectedObjects, solutionSelected: candidate.selectedObjects, target: candidate.target }));
        }));
        return pickSeeded(states, random);
      }
      const states = pool.mixedPool.flatMap((totalObjects) => pool.mixedSelection
        .filter((selectedObjects) => selectedObjects < totalObjects && selectedObjects >= 3)
        .flatMap((selectedObjects) => {
          const maximumRoleCount = Math.min(ranges.generation.maximumMixedRoles, selectedObjects - 2);
          return Array.from({ length: maximumRoleCount }, (_, index) => {
            const solutionRoles = index + 1;
            return { totalObjects, selectedObjects, maximumRoleCount, solutionRoles, target: mixedCountExact(totalObjects, selectedObjects, solutionRoles, ranges.answerCeiling) };
          });
        }));
      return pickSeeded(states, random);
    }
    default: { const exhaustive: never = entry.solveMode; throw new Error(`Unsupported PNC-001 solve mode: ${exhaustive}`); }
  }
}
export function generatePnc001Parameters(input: Pnc001ParameterInput = {}): Pnc001Parameters {
  const explicitCp = input.canonicalProblemId ?? input.cpId;
  const qlOwner = input.questionLanguageId ? getPnc001QuestionEntry(input.questionLanguageId).cpId : undefined;
  const cpId = (explicitCp ?? qlOwner ?? "PNC-CP-001") as Pnc001ActiveCanonicalProblemId;
  if (!(PNC_001_ACTIVE_CP_IDS as readonly string[]).includes(cpId)) throw new Error(`Unsupported PNC canonical problem: ${cpId}`);
  if ((input.language??"en")!=="en") throw new Error("PNC-001 runtime proof is English only");
  const seed=input.seed??`pnc-001:${cpId}:${input.questionLanguageId??input.difficulty??input.difficultyBand??"mixed"}:default`;
  const entry=selectEntry(input,seed,cpId); if(entry.cpId!==cpId) throw new Error(`PNC-001 QL ${entry.qlId} does not belong to ${cpId}`);
  const values=buildValues(entry,seed); const suffix=hashSeed(`${seed}:${entry.qlId}`).toString(16).padStart(8,"0");
  const renderVariables=Object.fromEntries(entry.requiredVariables.map((key)=>[key,values[key]!]));
  return {packageId:PNC_001_PACKAGE_ID,canonicalProblemId:cpId,questionLanguageId:entry.qlId,questionId:`${entry.qlId}-${suffix}`,seed,language:"en",difficulty:entry.difficulty as Pnc001Difficulty,taskKind:entry.taskKind,solveMode:entry.solveMode as Pnc001SolveMode,answerType:entry.answerType,explanationId:entry.explanationId,requiredVariables:[...entry.requiredVariables],scenarioFamily:entry.scenarioFamily,constraintProfile:entry.constraintProfile,distractorProfile:entry.distractorProfile,values,renderVariables};
}