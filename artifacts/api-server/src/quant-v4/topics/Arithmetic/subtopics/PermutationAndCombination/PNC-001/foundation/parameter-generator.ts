import { getPnc001QuestionEntries, getPnc001QuestionEntry, getPnc001VariableRanges } from "./library";
import { createSeededRandom, factorialExact, hashSeed, permutationExact, pickSeeded, productExact } from "./math";
import { PNC_001_ACTIVE_CP_IDS, PNC_001_PACKAGE_ID, type Pnc001ActiveCanonicalProblemId, type Pnc001Difficulty, type Pnc001ParameterInput, type Pnc001Parameters, type Pnc001QuestionEntry } from "./types";

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
    default: { const exhaustive: never = entry.solveMode; throw new Error(`Unsupported PNC-001 solve mode: ${exhaustive}`); }
  }
}
export function generatePnc001Parameters(input: Pnc001ParameterInput = {}): Pnc001Parameters {
  const cpId=(input.canonicalProblemId??input.cpId??"PNC-CP-001") as Pnc001ActiveCanonicalProblemId;
  if (!(PNC_001_ACTIVE_CP_IDS as readonly string[]).includes(cpId)) throw new Error(`Unsupported PNC canonical problem: ${cpId}`);
  if ((input.language??"en")!=="en") throw new Error("PNC-001 runtime proof is English only");
  const seed=input.seed??`pnc-001:${cpId}:${input.questionLanguageId??input.difficulty??input.difficultyBand??"mixed"}:default`;
  const entry=selectEntry(input,seed,cpId); if(entry.cpId!==cpId) throw new Error(`PNC-001 QL ${entry.qlId} does not belong to ${cpId}`);
  const values=buildValues(entry,seed); const suffix=hashSeed(`${seed}:${entry.qlId}`).toString(16).padStart(8,"0");
  const renderVariables=Object.fromEntries(entry.requiredVariables.map((key)=>[key,values[key]!]));
  return {packageId:PNC_001_PACKAGE_ID,canonicalProblemId:cpId,questionLanguageId:entry.qlId,questionId:`${entry.qlId}-${suffix}`,seed,language:"en",difficulty:entry.difficulty as Pnc001Difficulty,taskKind:entry.taskKind,solveMode:entry.solveMode,answerType:entry.answerType,explanationId:entry.explanationId,requiredVariables:[...entry.requiredVariables],scenarioFamily:entry.scenarioFamily,constraintProfile:entry.constraintProfile,distractorProfile:entry.distractorProfile,values,renderVariables};
}