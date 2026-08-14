import { decimalCycle, denominatorPrimeProfile, fractionLatex, rational, terminates } from "../wave01/exact";
import { NUM_CP002_WAVE02_SOURCE_ANCESTRY } from "./source-registry";
import { generateNumCp002Wave02, independentlyVerifyNumCp002Wave02 } from "./runtime";
import type { NumCp002Wave02Option, NumCp002Wave02Package, NumCp002Wave02PrototypeId } from "./types";

const math = (body: string) => `\\(${body}\\)`;
const lifecycle = Object.freeze({
  permanentQlId: null,
  maturity: "EXECUTABLE_DISCOVERY_PROOF" as const,
  reviewStatus: "UNREVIEWED_DISCOVERY_CANDIDATE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  questionBankStatus: "NOT_STORED" as const,
  testEligible: false as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
});
function idx(seed: number, size: number, salt = 0) { return (Math.imul((seed + 17) ^ Math.imul(salt + 3, 0x45d9f3b), 2654435761) >>> 0) % size; }
function choose<T>(seed: number, values: readonly T[], salt: number): T { return values[idx(seed, values.length, salt)]!; }
function place(correct: string, wrongValues: readonly string[], seed: number, salt: number): { options: readonly NumCp002Wave02Option[]; correctIndex: number } {
  const wrong = wrongValues.filter((value, i, all) => value !== correct && all.indexOf(value) === i).slice(0, 3);
  if (wrong.length !== 3) throw new Error(`Wave02 authority lacks distractors for ${correct}`);
  const correctIndex = idx(seed, 4, salt);
  const options: NumCp002Wave02Option[] = wrong.map((value, i) => ({ value, isCorrect: false, misconceptionId: `CONTROLLED_DISTRACTOR_${i + 1}` }));
  options.splice(correctIndex, 0, { value: correct, isCorrect: true });
  return { options: Object.freeze(options), correctIndex };
}
function setLatex(values: readonly number[]) { return math(`\\{${values.join(",")}\\}`); }
function boundedDenominators(numerator: number, maxD: number): number[] {
  const out: number[] = [];
  for (let d = 2; d <= maxD; d += 1) if (terminates(rational(numerator, d))) out.push(d);
  return out;
}
function pack(id: NumCp002Wave02PrototypeId, seed: number, difficulty: "EASY"|"MEDIUM"|"HARD", answerSemantic: "INTEGER"|"DENOMINATOR_SET"|"DIGIT", stem: string, correct: string, wrongValues: readonly string[], hiddenState: Record<string, unknown>, concept: string, solution: readonly string[]): NumCp002Wave02Package {
  const { options, correctIndex } = place(correct, wrongValues, seed, 80 + Number(id.slice(-3)));
  const verifierAnswer = independentlyVerifyNumCp002Wave02(id, hiddenState);
  if (verifierAnswer !== correct) throw new Error(`${id}: authority/verifier disagreement ${verifierAnswer} != ${correct}`);
  return Object.freeze({
    packageId: "NUM-001", checkpointId: "NUM-CP-002", temporaryPrototypeId: id, permanentQlId: null, seed, locale: "en-IN", difficulty, answerSemantic,
    stem, options, correctIndex, canonicalAnswer: correct, verifierAnswer, hiddenState: Object.freeze({ ...hiddenState }),
    sourceAncestry: NUM_CP002_WAVE02_SOURCE_ANCESTRY[id], mathematicalFingerprint: `${id}:${JSON.stringify(hiddenState)}`,
    explanation: Object.freeze({ concept, solution: Object.freeze([...solution]), finalAnswer: correct }), lifecycle,
  });
}

const inverseFractions = [rational(5,12), rational(7,18), rational(11,21), rational(13,28), rational(17,45), rational(19,42), rational(23,63), rational(29,84)] as const;
function p013(seed: number) {
  const f = choose(seed, inverseFractions, 13); const profile = denominatorPrimeProfile(f); const rest = profile.rest; const correct = math(String(rest));
  const candidates = [f.d, Math.max(2, f.d / rest), Math.max(2, rest - 1), rest + 1, Math.max(2, profile.twos + profile.fives), rest * 2].map(String).map(math);
  return pack("NUM-CP002-PROT-013", seed, "MEDIUM", "INTEGER", `What is the least positive integer by which ${fractionLatex(f)} must be multiplied so that the product has a terminating decimal expansion?`, correct, candidates, {n:f.n,d:f.d}, "Cancel the entire part of the reduced denominator containing primes other than 2 and 5.", [`The non-${math("2,5")} part of the denominator is ${math(String(rest))}.`, `Multiplying by ${math(String(rest))} cancels it completely.`]);
}
function p014(seed: number) {
  const f = choose(seed, inverseFractions, 14); const rest = denominatorPrimeProfile(f).rest; const correct = math(String(rest));
  const divisors = Array.from({length:f.d-1},(_,i)=>i+2).filter((k)=>f.d%k===0 && k!==rest).map(String).map(math);
  const candidates = [...divisors, math(String(rest+1)), math(String(f.d+1)), math(String(Math.max(2,rest-1)))];
  return pack("NUM-CP002-PROT-014", seed, "MEDIUM", "INTEGER", `The denominator of ${fractionLatex(f)} is to be divided by an integer greater than ${math("1")}. What is the least such integer that makes the new fraction terminating?`, correct, candidates, {n:f.n,d:f.d}, "Remove every denominator prime factor other than 2 and 5.", [`The complete non-${math("2,5")} factor is ${math(String(rest))}.`, `Dividing by ${math(String(rest))} is the least valid removal.`]);
}
const boundedCases = [{numerator:3,maxD:20},{numerator:6,maxD:24},{numerator:7,maxD:25},{numerator:12,maxD:30},{numerator:15,maxD:35},{numerator:21,maxD:36}] as const;
function p018(seed: number) {
  const c=choose(seed,boundedCases,18); const valid=boundedDenominators(c.numerator,c.maxD); const correct=setLatex(valid);
  const all=Array.from({length:c.maxD-1},(_,i)=>i+2); const bad=all.filter((d)=>!valid.includes(d));
  const noCancellation=all.filter((d)=>terminates(rational(1,d)));
  const wrong1=setLatex(valid.slice(0,-1));
  const wrong2=setLatex([...valid.slice(0,-1),bad[0]!].sort((a,b)=>a-b));
  const wrong3=setLatex(noCancellation);
  return pack("NUM-CP002-PROT-018",seed,"HARD","DENOMINATOR_SET",`Which option gives the complete set of integers ${math("d")} with ${math(`2\\le d\\le${c.maxD}`)} for which ${math(`\\frac{${c.numerator}}{d}`)} terminates after reduction?`,correct,[wrong1,wrong2,wrong3],{numerator:c.numerator,maxD:c.maxD},"Test denominator structure only after cancelling common factors with the numerator.",[`Reduce ${math(`\\frac{${c.numerator}}{d}`)} for each allowed ${math("d")}.`,`The complete valid set is ${correct}.`]);
}
const cycleFractions=[rational(1,7),rational(2,7),rational(1,13),rational(5,27),rational(7,33),rational(4,37)] as const;
function p020(seed:number){
  const f=choose(seed,cycleFractions,20); const cycle=decimalCycle(f,50); if(cycle.repeating.length<2)throw new Error("P020 nontrivial cycle required");
  const position=idx(seed,cycle.repeating.length,21); const digit=Number(cycle.repeating[position]); const shown=cycle.repeating.split(""); shown[position]="?";
  const wrongDigits=[0,1,2,3,4,5,6,7,8,9].filter((x)=>x!==digit); const start=idx(seed,wrongDigits.length,22); const wrong=[0,1,2].map((i)=>math(String(wrongDigits[(start+i)%wrongDigits.length]!)));
  return pack("NUM-CP002-PROT-020",seed,"MEDIUM","DIGIT",`The exact decimal expansion of ${fractionLatex(f)} is ${math(`0.${cycle.nonRepeating}\\overline{${shown.join("")}}`)}. Find the missing digit.`,math(String(digit)),wrong,{n:f.n,d:f.d,position},"The marked block is fixed by the exact remainder cycle in long division.",[`Long division gives the repeating block ${math(`\\overline{${cycle.repeating}}`)}.`,`The missing digit is ${math(String(digit))}.`]);
}

export function generateNumCp002Wave02Authority(id: NumCp002Wave02PrototypeId, seed: number): NumCp002Wave02Package {
  if (id === "NUM-CP002-PROT-013") return p013(seed);
  if (id === "NUM-CP002-PROT-014") return p014(seed);
  if (id === "NUM-CP002-PROT-018") return p018(seed);
  if (id === "NUM-CP002-PROT-020") return p020(seed);
  return generateNumCp002Wave02(id, seed);
}
