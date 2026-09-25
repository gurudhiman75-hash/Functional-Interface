import assert from "node:assert/strict";
import { generateGeneralScienceLocalizedCpV1, type GeneralScienceLocalizedCpV1 } from "./sci-general-localization-generator-v1";

const locales=["en","hi","pa"] as const;
const devanagari=/\p{Script=Devanagari}/u;
const gurmukhi=/\p{Script=Gurmukhi}/u;
const allowedLatin=/\b(DNA|RNA|ATP|ER|pH|PCR|GMO|Bt|MCB|LED|AC|DC|SI|ABO|CERN|Penicillium)\b/g;
const strayLatin=/[A-Za-z]{3,}/;
const internalLeakage=/\b(review[- ]only|runtimeRegistered|sourceFactIds|candidate v\d+|question line|ql id)\b/i;
const optionAnalysis=/\b(option|choice)\s*[ABCD]\b/i;

export function runGeneralScienceMultilingualAuditV1(cpId:GeneralScienceLocalizedCpV1){
  const surfaces={
    en:generateGeneralScienceLocalizedCpV1(cpId,"en"),
    hi:generateGeneralScienceLocalizedCpV1(cpId,"hi"),
    pa:generateGeneralScienceLocalizedCpV1(cpId,"pa"),
  } as const;
  for(const locale of locales){
    const qs=surfaces[locale];
    assert.equal(qs.length,60,`${cpId}/${locale}: expected 60 questions`);
    const qls=new Map<string,number>();
    const diff:Record<string,number>={Easy:0,Medium:0,Hard:0};
    const pos=[0,0,0,0];
    const ids=new Set<string>(), stems=new Set<string>();
    qs.forEach((q,index)=>{
      assert.equal(q.cpId,cpId,`${q.questionId}: CP drift`);
      assert.equal(q.locale,locale,`${q.questionId}: locale drift`);
      assert.equal(q.reviewOnly,true,`${q.questionId}: review-only lost`);
      assert.equal(q.runtimeRegistered,false,`${q.questionId}: runtime opened`);
      assert.equal(q.options.length,4,`${q.questionId}: four options required`);
      assert.equal(new Set(q.options).size,4,`${q.questionId}: duplicate option`);
      assert.equal(q.options[q.correctIndex],q.canonicalAnswer,`${q.questionId}: answer mismatch`);
      assert.ok(q.sourceIds.length&&q.sourceFactIds.length,`${q.questionId}: provenance missing`);
      assert.ok(q.stem.trim().length>=10,`${q.questionId}: thin stem`);
      assert.ok(q.explanation.trim().length>=18,`${q.questionId}: thin explanation`);
      assert.ok(!internalLeakage.test(q.stem+" "+q.explanation),`${q.questionId}: internal leakage`);
      assert.ok(!optionAnalysis.test(q.explanation),`${q.questionId}: option analysis leakage`);
      if(locale==="en"){
        assert.equal(q.localizationV1.englishQuestionId,q.questionId,`${q.questionId}: English self-link drift`);
      }else{
        const en=surfaces.en[index];
        assert.equal(q.localizationV1.englishQuestionId,en.questionId,`${q.questionId}: English linkage drift`);
        assert.equal(q.qlId,en.qlId,`${q.questionId}: QL drift`);
        assert.equal(q.difficulty,en.difficulty,`${q.questionId}: difficulty drift`);
        assert.equal(q.correctIndex,en.correctIndex,`${q.questionId}: correct-index drift`);
        assert.deepEqual(q.sourceIds,en.sourceIds,`${q.questionId}: source drift`);
        assert.deepEqual(q.sourceFactIds,en.sourceFactIds,`${q.questionId}: fact drift`);
        const native=locale==="hi"?devanagari:gurmukhi;
        const foreign=locale==="hi"?gurmukhi:devanagari;
        assert.ok(native.test(q.stem),`${q.questionId}: native script missing`);
        assert.ok(native.test(q.explanation),`${q.questionId}: native explanation script missing`);
        assert.ok(native.test(q.qlName),`${q.questionId}: QL not localized`);
        const learner=[q.stem,...q.options,q.explanation].join(" ");
        assert.ok(!foreign.test(learner),`${q.questionId}: foreign-script leakage`);
        assert.ok(!strayLatin.test(learner.replace(allowedLatin,"")),`${q.questionId}: stray Latin prose leakage`);
      }
      assert.ok(!ids.has(q.questionId),`${cpId}/${locale}: duplicate id`);
      ids.add(q.questionId);
      const norm=q.stem.trim().replace(/\s+/g," ").toLowerCase();
      assert.ok(!stems.has(norm),`${cpId}/${locale}: duplicate stem`);
      stems.add(norm);
      qls.set(q.qlId,(qls.get(q.qlId)??0)+1);
      diff[q.difficulty]=(diff[q.difficulty]??0)+1;
      pos[q.correctIndex]+=1;
    });
    assert.equal(qls.size,10,`${cpId}/${locale}: expected 10 QLs`);
    assert.ok([...qls.values()].every(n=>n===6),`${cpId}/${locale}: every QL must have six questions`);
    assert.deepEqual(diff,{Easy:18,Medium:30,Hard:12},`${cpId}/${locale}: difficulty drift`);
    assert.deepEqual(pos,[15,15,15,15],`${cpId}/${locale}: answer-position drift`);
  }
  return {status:"PASS",scope:`${cpId} General Science multilingual V1`,locales:[...locales],questionsPerLocale:60,nativeQuestions:120,qlsPerLocale:10,difficultyPerLocale:{Easy:18,Medium:30,Hard:12},answerPositionsPerLocale:{A:15,B:15,C:15,D:15},lifecycle:"review-only / runtime closed"};
}
