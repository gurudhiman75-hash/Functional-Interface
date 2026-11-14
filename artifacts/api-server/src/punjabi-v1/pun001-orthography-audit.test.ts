/**
 * PUN-001 whole-chapter technical language audit.
 * This is a deterministic orthographic screen, NOT a dictionary or a claim of
 * human linguistic approval. Incorrect spellings in distractors are intentional.
 */
import assert from "node:assert/strict";
import { writeFileSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { CP001_FAMILIES } from "./packages/PUN-001/checkpoints/CP001";
import { CP002_FAMILIES } from "./packages/PUN-001/checkpoints/CP002";
import { CP003_FAMILIES } from "./packages/PUN-001/checkpoints/CP003";
import { CP004_FAMILIES } from "./packages/PUN-001/checkpoints/CP004";
import { CP005_FAMILIES } from "./packages/PUN-001/checkpoints/CP005";
import { CP006_FAMILIES } from "./packages/PUN-001/checkpoints/CP006";
import { CP007_FAMILIES } from "./packages/PUN-001/checkpoints/CP007";
import { CP008_FAMILIES } from "./packages/PUN-001/checkpoints/CP008";
import { CP009_FAMILIES } from "./packages/PUN-001/checkpoints/CP009";
import { CP010_FAMILIES } from "./packages/PUN-001/checkpoints/CP010";
import { CP011_FAMILIES } from "./packages/PUN-001/checkpoints/CP011";
import { CP012_FAMILIES } from "./packages/PUN-001/checkpoints/CP012";
import { CP013_FAMILIES } from "./packages/PUN-001/checkpoints/CP013";
import { CP014_FAMILIES } from "./packages/PUN-001/checkpoints/CP014";
import { CP001_WORD_AUTHORITIES } from "./packages/PUN-001/checkpoints/CP001/CP001-word-corpus";
import { CP002_ACTIVE_AUTHORITIES } from "./packages/PUN-001/checkpoints/CP002/CP002-authority-pool";

const cpFamilies = [
 CP001_FAMILIES,CP002_FAMILIES,CP003_FAMILIES,CP004_FAMILIES,
 CP005_FAMILIES,CP006_FAMILIES,CP007_FAMILIES,CP008_FAMILIES,
 CP009_FAMILIES,CP010_FAMILIES,CP011_FAMILIES,CP012_FAMILIES,
 CP013_FAMILIES,CP014_FAMILIES,
] as const;
const report = {
  scope:"PUN-001 CP001-CP014",
  classification:"TECHNICAL_SCREEN_NOT_HUMAN_LINGUISTIC_APPROVAL",
  checkedFamilies:0,
  checkedGeneratedQuestions:0,
  checkedCp001Words:0,
  checkedCp002CanonicalWords:0,
  scannedSourceFiles:0,
  scannedSourceBytes:0,
  warnings:[] as Array<{cp:string;family:string;seed:number;field:string;kind:string;value:string}>,
};
function warning(cp:string,family:string,seed:number,field:string,kind:string,value:string) {
  if (report.warnings.length < 300) report.warnings.push({cp,family,seed,field,kind,value:value.slice(0,240)});
}
function screen(cp:string,family:string,seed:number,field:string,value:string, allowBareMark=false) {
  assert.equal(typeof value,"string",`${cp} ${family} ${field} must be text`);
  assert(value.trim(),`${cp} ${family} ${field} empty`);
  assert.equal(value,value.normalize("NFC"),`${cp} ${family} ${field} not NFC`);
  assert(!/[\uFFFD\u200B\u200C\u200D]/u.test(value),`${cp} ${family} ${field} invalid or invisible character`);
  if (/[ੰਂ]{2,}|ੱ{2,}|ਪੜਨਾਂਵ\s+ਪੜਨਾਂਵ/u.test(value)) {
    warning(cp,family,seed,field,"SUSPICIOUS_MARK_OR_DUPLICATED_TERM",value);
  }
  // A bare mark is legitimate as the object of a spelling question.
  if (!allowBareMark && /ੱ(?=[\s।?!,;:]|$)/u.test(value))
    warning(cp,family,seed,field,"ADDAK_AT_WORD_END_REVIEW",value);
}
for (let cpIdx=0;cpIdx<cpFamilies.length;cpIdx++){
 const cp="CP"+String(cpIdx+1).padStart(3,"0");
 const families=cpFamilies[cpIdx];
 for(const family of families) {
   report.checkedFamilies++;
   for(const difficulty of family.targetDifficulties) {
     for(const seed of [1,2,3,7,17,43,101,257]){
       const q=family.generate(seed,difficulty);
       report.checkedGeneratedQuestions++;
       assert.equal(q.metadata.cpId,`PUN-001-${cp}`,`${cp} CP mismatch`);
       assert.equal(q.metadata.familyId,family.familyId,`${cp} family mismatch`);
       assert.equal(q.difficulty,difficulty,`${cp} difficulty mismatch`);
       assert.equal(q.options.length,4,`${cp} ${family.familyId} options count`);
       assert.equal(new Set(q.options).size,4,`${cp} ${family.familyId} duplicate options`);
       assert(q.correctIndex>=0 && q.correctIndex<4,`${cp} ${family.familyId} bad answer index`);
       screen(cp,family.familyId,seed,"stem",q.stem,true);
       screen(cp,family.familyId,seed,"explanation",q.explanation,true);
       // Deliberately incorrect orthography is allowed in option distractors.
       q.options.forEach((option,index)=>screen(cp,family.familyId,seed,`option-${index}`,option,true));
     }
   }
 }
}
assert.equal(report.checkedFamilies,133,"All 133 PUN-001 families must be scanned");
for(const a of CP001_WORD_AUTHORITIES) {
 report.checkedCp001Words++;
 if(a.kind!=="LAGA" || a.targetNamePa!=="ਮੁਕਤਾ")
  assert(a.word.includes(a.targetSymbol)||a.word.startsWith("ਆ")||a.word.startsWith("ਇ")||a.word.startsWith("ਈ")||a.word.startsWith("ਉ")||a.word.startsWith("ਊ")||a.word.startsWith("ਏ")||a.word.startsWith("ਐ")||a.word.startsWith("ਓ")||a.word.startsWith("ਔ"),`${a.id}: expected orthographic mark not found`);
}
for(const a of CP002_ACTIVE_AUTHORITIES) {
 report.checkedCp002CanonicalWords++;
 assert(!a.incorrect.includes(a.correct as never),`${a.id}: correct answer also marked incorrect`);
 screen("CP002",a.id,0,"canonical-spelling",a.correct,true);
}
// Scan ALL checkpoint source modules, including authority pools not reached by
// the sampled generator seeds. Reports are editorial leads, not auto-fixes.
function scanSourceDir(dir:string,cp:string){
 for(const item of readdirSync(dir,{withFileTypes:true})){
  const path=join(dir,item.name);
  if(item.isDirectory()){scanSourceDir(path,cp);continue;}
  if(!item.isFile()||!item.name.endsWith(".ts"))continue;
  const source=readFileSync(path,"utf8");
  report.scannedSourceFiles++;
  report.scannedSourceBytes+=Buffer.byteLength(source,"utf8");
  for(const [kind,re] of [
    ["REPLACEMENT_OR_INVISIBLE_CODEPOINT",/[\uFFFD\u200B\u200C\u200D]/gu],
    ["REPEATED_TIPPI_OR_BINDI",/[ੰਂ]{2,}/gu],
    ["REPEATED_ADDAK",/ੱ{2,}/gu],
    ["REPEATED_CATEGORY_LABEL",/ਪੜਨਾਂਵ\s+ਪੜਨਾਂਵ/gu],
  ] as const){
    for(const m of source.matchAll(re)){
      const start=Math.max(0,m.index-35),end=Math.min(source.length,m.index+m[0].length+40);
      warning(cp,item.name,0,"source",kind,source.slice(start,end).replace(/\n/g," "));
    }
  }
 }
}
for(let i=1;i<=14;i++){
 const cp="CP"+String(i).padStart(3,"0");
 scanSourceDir(join("src/punjabi-v1/packages/PUN-001/checkpoints",cp),cp);
}
mkdirSync("dist/punjabi-v1",{recursive:true});
writeFileSync("dist/punjabi-v1/pun001-orthography-audit.json",JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({families:report.checkedFamilies,generatedQuestions:report.checkedGeneratedQuestions,cp001Words:report.checkedCp001Words,cp002CanonicalWords:report.checkedCp002CanonicalWords,sourceFiles:report.scannedSourceFiles,sourceBytes:report.scannedSourceBytes,warningCount:report.warnings.length},null,2));
console.log("Technical screening complete. Warnings require human editorial review; this is not a linguistic accuracy certification.");
