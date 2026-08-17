import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";
import { runTmwCp014CaseletGroup } from "./foundation/final-extension-presentation-polish";
import { compare, equals, rational } from "./foundation/rational";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const tableQls = ["TMW-QL-224", "TMW-QL-225", "TMW-QL-226"] as const;
const caseletQls = ["TMW-QL-227", "TMW-QL-228"] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const seeds = ["0", "1", "2", "3", "4"] as const;
let checked = 0;

for (const qlId of [...tableQls, ...caseletQls]) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp014:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      checked += 1;

      assert(question.canonicalProblemId === "TMW-CP-014", `${qlId}:${language}: wrong checkpoint`);
      assert(question.questionLanguageId === qlId, `${qlId}:${language}: wrong QL identity`);
      assert(question.language === language, `${qlId}:${language}: language mismatch`);
      assert(question.learnerExplanationVersion === "TMW_PRESENTATION_V1", `${qlId}:${language}: wrong learner version`);
      assert(question.publiclyPublishable === false, `${qlId}:${language}: publication lock lost`);
      assert(question.validation?.valid, `${qlId}:${language}:${seedSuffix}: ${question.validation?.errors?.join(" | ")}`);
      assert(question.options.length === 4, `${qlId}:${language}: expected four options`);
      assert(new Set(question.options).size === 4, `${qlId}:${language}: options are not unique`);
      assert(question.options[question.correctIndex] === question.solution.answerText, `${qlId}:${language}: answer-option mismatch`);
      assert(question.optionAudit[question.correctIndex]?.misconceptionId === "CORRECT", `${qlId}:${language}: correct audit mismatch`);
      assert(question.presentationBlocks.length === 1, `${qlId}:${language}: expected one presentation block`);
      assert(question.explanation.steps.length >= 3, `${qlId}:${language}: explanation too thin`);
      assert(question.stem.trim().split(/\s+/u).filter(Boolean).length <= 125, `${qlId}:${language}: presentation stem too long`);

      if ((tableQls as readonly string[]).includes(qlId)) {
        assert(question.representation === "TABLE", `${qlId}:${language}: expected TABLE representation`);
        const block = question.presentationBlocks[0];
        assert(block.type === "table", `${qlId}:${language}: structured table block missing`);
        assert(block.columns.length >= 3, `${qlId}:${language}: table has too few columns`);
        assert(block.rows.length >= 2, `${qlId}:${language}: table has too few rows`);
        assert(question.caseletGroupId === null, `${qlId}:${language}: table question should not have caselet group`);
      } else {
        assert(question.representation === "CASELET", `${qlId}:${language}: expected CASELET representation`);
        const block = question.presentationBlocks[0];
        assert(block.type === "caselet", `${qlId}:${language}: structured caselet block missing`);
        assert(block.paragraphs.length === 2, `${qlId}:${language}: caselet must have two paragraphs`);
        assert(question.caseletGroupId === "TMW-CASELET-001", `${qlId}:${language}: wrong caselet group`);
        assert(typeof question.caseletStimulus === "string" && question.caseletStimulus.length > 40, `${qlId}:${language}: caselet stimulus missing`);
        assert(question.groupGenerationRequired === true, `${qlId}:${language}: grouped caselet generation requirement missing`);
        assert(question.caseletItemIndex === (qlId === "TMW-QL-227" ? 0 : 1), `${qlId}:${language}: caselet item index mismatch`);
      }

      if (qlId === "TMW-QL-225") {
        const allText = JSON.stringify(question);
        assert(!/base-worker-days|आधार-कामगार-दिन|ਆਧਾਰ-ਮਜ਼ਦੂਰ-ਦਿਨ/.test(allText), `${qlId}:${language}: old contribution unit leaked`);
        assert(question.solution.answerType === "base-work-units", `${qlId}:${language}: contribution answer type was not normalized`);
      }

      if (qlId === "TMW-QL-226") {
        for (const option of question.optionAudit) {
          assert(compare(option.value, rational(0)) > 0, `${qlId}:${language}: non-positive tank-fraction option`);
          assert(compare(option.value, rational(1)) <= 0, `${qlId}:${language}: impossible >1 tank-fraction option`);
        }
      }

      if (language === "pa") {
        assert(!JSON.stringify(question).includes("ਪੜਾਅਾਂ"), `${qlId}:${language}: malformed Punjabi stage plural remains`);
      }
    }
  }
}

for (const language of languages) {
  for (const seedSuffix of seeds) {
    const seed = `tmw-cp014:${language}:${seedSuffix}`;
    const q227 = runTmw001ChapterPipeline({ questionLanguageId: "TMW-QL-227", language, seed });
    const q228 = runTmw001ChapterPipeline({ questionLanguageId: "TMW-QL-228", language, seed });
    assert(q227.caseletGroupId === q228.caseletGroupId, `${language}:${seedSuffix}: paired caselet group mismatch`);
    assert(q227.caseletStimulus === q228.caseletStimulus, `${language}:${seedSuffix}: paired caselet stimulus mismatch`);
    assert(q227.mathematicalFingerprint.split("|answer=")[0] === q228.mathematicalFingerprint.split("|answer=")[0].replace("caseletRemainingCompletionTime", "caseletStageOneOutput"), `${language}:${seedSuffix}: paired caselet state mismatch`);
    assert(!equals(q227.solution.answer, q228.solution.answer) || q227.solution.answerType !== q228.solution.answerType, `${language}:${seedSuffix}: paired caselet targets collapsed`);

    const grouped = runTmwCp014CaseletGroup({ seed, language });
    assert(grouped.caseletGroupId === "TMW-CASELET-001", `${language}:${seedSuffix}: grouped generator ID mismatch`);
    assert(grouped.questions.length === 2, `${language}:${seedSuffix}: grouped generator must return two questions`);
    assert(grouped.questions[0].caseletStimulus === grouped.questions[1].caseletStimulus, `${language}:${seedSuffix}: grouped generator stimuli differ`);
    assert(grouped.stimulus === grouped.questions[0].caseletStimulus, `${language}:${seedSuffix}: grouped stimulus mismatch`);
  }
}

console.log(JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-014",
  qls: tableQls.length + caseletQls.length,
  tableQls: tableQls.length,
  caseletQls: caseletQls.length,
  languages: languages.length,
  seedsPerQlLanguage: seeds.length,
  checked,
  pairedCaseletChecks: languages.length * seeds.length,
  groupedCaseletChecks: languages.length * seeds.length,
  physicalTankOptionChecks: languages.length * seeds.length,
  verdict: "PASS",
}, null, 2));
