import assert from "node:assert/strict";
import { generateBiologyLocalizedCpV1, type BiologyLocalizedCpV1 } from "./sci-biology-localization-generator-v1";

const locales=["en","hi","pa"] as const;
const devanagari=/\p{Script=Devanagari}/u;
const gurmukhi=/\p{Script=Gurmukhi}/u;
const allowedLatin=/\b(DNA|RNA|ATP|ER|pH|HIV|AIDS|CD4|F1|F2|TT|Tt|tt|XX|XY|YY|XO|XXX|Amoeba|Paramecium|Lactobacillus|Rhizobium|Vibrio|cholerae|Salmonella|Typhi|Mycobacterium|tuberculosis|Plasmodium|vivax|falciparum|Aedes|aegypti|Anopheles|Culex|Penicillium|Rhizopus)\b/g;
const strayLatin=/[A-Za-z]{3,}/;
const internalLeakage=/\b(review[- ]only|runtimeRegistered|sourceFactIds|candidate v\d+|question line|ql id)\b/i;
const optionAnalysis=/\b(option|choice)\s*[ABCD]\b/i;

export function runBiologyMultilingualAuditV1(cpId:BiologyLocalizedCpV1){
  const surfaces={
    en:generateBiologyLocalizedCpV1(cpId,"en"),
    hi:generateBiologyLocalizedCpV1(cpId,"hi"),
    pa:generateBiologyLocalizedCpV1(cpId,"pa"),
  } as const;

  for(const locale of locales){
    const qs=surfaces[locale];
    assert.equal(qs.length,60,`${cpId}/${locale}: expected 60 questions`);
    const qls=new Map<string,number>();
    const diff:Record<string,number>={Easy:0,Medium:0,Hard:0};
    const pos=[0,0,0,0];
    const ids=new Set<string>();
    const stems=new Set<string>();

    qs.forEach((q,index)=>{
      assert.equal(q.cpId,cpId,`${q.questionId}: CP drift`);
      assert.equal(q.locale,locale,`${q.questionId}: locale drift`);
      assert.equal(q.reviewOnly,true,`${q.questionId}: review-only lost`);
      assert.equal(q.runtimeRegistered,false,`${q.questionId}: runtime opened`);
      assert.equal(q.options.length,4,`${q.questionId}: four options required`);
      assert.equal(new Set(q.options).size,4,`${q.questionId}: duplicate visible option`);
      assert.equal(q.options[q.correctIndex],q.canonicalAnswer,`${q.questionId}: answer mismatch`);
      assert.ok(q.sourceIds.length>0&&q.sourceFactIds.length>0,`${q.questionId}: provenance missing`);
      assert.ok(q.stem.trim().length>=10,`${q.questionId}: stem too thin`);
      assert.ok(q.explanation.trim().length>=18,`${q.questionId}: explanation too thin`);
      assert.ok(!internalLeakage.test(q.stem+" "+q.explanation),`${q.questionId}: internal leakage`);
      assert.ok(!optionAnalysis.test(q.explanation),`${q.questionId}: option analysis leakage`);

      if(locale==="en"){
        assert.equal(q.localizationV1.englishQuestionId,q.questionId,`${q.questionId}: English self-linkage drift`);
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
        assert.ok(native.test(q.stem),`${q.questionId}: native script missing from stem`);
        assert.ok(native.test(q.explanation),`${q.questionId}: native script missing from explanation`);
        assert.ok(native.test(q.qlName),`${q.questionId}: QL name not localized`);
        const learner=[q.stem,...q.options,q.explanation].join(" ");
        assert.ok(!foreign.test(learner),`${q.questionId}: foreign native-script leakage`);
        assert.ok(!strayLatin.test(learner.replace(allowedLatin,"")),`${q.questionId}: stray Latin-script prose leakage`);
      }

      assert.ok(!ids.has(q.questionId),`${cpId}/${locale}: duplicate id ${q.questionId}`);
      ids.add(q.questionId);
      const norm=q.stem.trim().replace(/\s+/g," ").toLowerCase();
      assert.ok(!stems.has(norm),`${cpId}/${locale}: duplicate stem ${q.stem}`);
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

  return {
    status:"PASS",
    scope:`${cpId} multilingual V1`,
    locales:[...locales],
    questionsPerLocale:60,
    nativeQuestions:120,
    qlsPerLocale:10,
    difficultyPerLocale:{Easy:18,Medium:30,Hard:12},
    answerPositionsPerLocale:{A:15,B:15,C:15,D:15},
    lifecycle:"review-only / runtime closed",
  };
}
