import {mkdirSync, writeFileSync} from "node:fs";
import {resolve} from "node:path";
import { getPnc001QuestionEntries } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/library";
import { runPnc001Pipeline } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-001/foundation/pipeline";
import { getPnc002QuestionEntries } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/library";
import { runPnc002Pipeline } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/pipeline";
import { getCp011GroupingEntries, runPnc002Cp011GroupingPipeline } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-grouping-runtime";
import { getCp011DistributionWave1Entries, runPnc002Cp011DistributionWave1Pipeline } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-distribution-wave1-reviewed-runtime";
import { getCp011DistributionWave2Entries, runPnc002Cp011DistributionWave2Pipeline } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-distribution-wave2-runtime";
import { getCp011InverseEntries, runPnc002Cp011InversePipeline } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp011-inverse-wave-runtime";
import { getCp012Entries, runPnc002Cp012Pipeline } from "../../src/quant-v4/topics/Arithmetic/subtopics/PermutationAndCombination/PNC-002/foundation/cp012-mixed-runtime-reviewed";

// Chapter-wide audit of the active runtime authorities, including CP011/012 split dispatch.
const groups = [
 [getPnc001QuestionEntries(), runPnc001Pipeline],
 [getPnc002QuestionEntries(), runPnc002Pipeline],
 [getCp011GroupingEntries(), runPnc002Cp011GroupingPipeline],
 [getCp011DistributionWave1Entries(), runPnc002Cp011DistributionWave1Pipeline],
 [getCp011DistributionWave2Entries(), runPnc002Cp011DistributionWave2Pipeline],
 [getCp011InverseEntries(), runPnc002Cp011InversePipeline],
 [getCp012Entries(), runPnc002Cp012Pipeline],
] as const;
const findings: {ql: string; seed: number; check: string; detail?: string}[] = [];
const rows: unknown[] = [];
let packages = 0;
for (const [entries, run] of groups) for (const entry of entries) {
 const positions = [0,0,0,0];
 const stems = new Set<string>();
 for (let seed = 0; seed < 12; seed++) {
  try {
   const request = {questionLanguageId: entry.qlId, seed: `pnc-chapter-audit:${seed}`};
   const generated = run(request);
   const repeat = run(request);
   packages++;
   const flag = (check: string, ok: boolean, detail?: string) => {
    if (!ok) findings.push({ql:entry.qlId,seed,check,...(detail ? {detail}: {})});
   };
   flag("determinism", JSON.stringify(generated) === JSON.stringify(repeat));
   flag("runtime-validation", generated.validation.valid);
   flag("publication-gate", generated.publiclyPublishable === false);
   flag("four-unique-options", generated.options.length === 4 && new Set(generated.options).size === 4);
   flag("correct-option", generated.options[generated.correctIndex] === generated.answer);
   flag("independent-answer", Number(generated.independentVerification.answer) === generated.solver.numericAnswer);
   flag("unresolved-stem", !/\{[a-zA-Z_]\w*\}|undefined|NaN|\[object Object\]/.test(generated.stem));
   flag("worked-explanation", generated.explanation.lines.length >= 2);
   const prose = [generated.stem, ...generated.explanation.lines].join(" ");
   flag("unresolved-content", !/undefined|NaN|\[object Object\]/.test(prose));
   positions[generated.correctIndex]++;
   stems.add(generated.stem);
   if (seed === 0) rows.push({ql:entry.qlId,cp:generated.canonicalProblemId,mode:entry.solveMode,stem:generated.stem,options:generated.options,correctIndex:generated.correctIndex,explanation:generated.explanation.lines});
  } catch (error) { findings.push({ql:entry.qlId,seed,check:"exception",detail:String(error)}); }
 }
 rows.push({ql:entry.qlId,distinctStems:stems.size,answerPositions:positions});
}
const report = {status:findings.length ? "FINDINGS" : "PASS", qls:groups.reduce((n,[entries])=>n+entries.length,0),seedsPerQl:12,packages,findings,rows,limitations:["Automated evidence does not certify exam prose quality or source equivalence.","English runtime audit only; native approval is separate."]};
const output = resolve(process.argv[2] ?? "dist/pnc-chapter-audit");
mkdirSync(output,{recursive:true});
writeFileSync(resolve(output,"pnc-chapter-runtime-audit.json"),JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({status:report.status,qls:report.qls,packages,findings},null,2));
if(findings.length) process.exitCode=1;
