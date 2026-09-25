import assert from "node:assert/strict";
import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";
import { generateDirectionQuestionHindi } from "./localization";

const positions = [0, 0, 0, 0];
const stems = new Map<string, Set<string>>();
const explanations = new Map<string, Set<string>>();
const forbiddenEnglish = /\b(?:North|South|East|West|metres?|turns?|walks?|walking|final position|starting point|Which|What|Who|Therefore|Statement|Morning|Evening|Noon|shadow|sun)\b/i;
const internalLeak = /DIR-(?:QL|CP)-\d+|\bundefined\b|\bnull\b/;
const latinWordLeak = /[A-Za-z]{2,}/;

assert.equal(DIR_001_QLS.length, 44);
assert.deepEqual(
  DIR_001_QLS.map((ql) => ql.qlId),
  Array.from({ length: 44 }, (_, index) => `DIR-QL-${String(index + 1).padStart(3, "0")}`),
);

for (const ql of DIR_001_QLS) {
  stems.set(ql.qlId, new Set());
  explanations.set(ql.qlId, new Set());
  for (let seed = 0; seed < 40; seed += 1) {
    const english = generateDirectionQuestion(ql.qlId, seed) as any;
    const hindi = generateDirectionQuestionHindi(ql.qlId, seed);
    assert.deepEqual(hindi, generateDirectionQuestionHindi(ql.qlId, seed));
    assert.equal(hindi.locale, "hi-IN");
    assert.equal(hindi.qlId, english.qlId);
    assert.equal(hindi.checkpointId, english.checkpointId);
    assert.equal(hindi.ruleId, english.ruleId);
    assert.equal(hindi.seed, english.seed);
    assert.equal(hindi.difficulty, english.difficulty);
    assert.equal(hindi.correctIndex, english.correctIndex);
    assert.deepEqual(hindi.correctAnswer, english.correctAnswer);
    assert.deepEqual(hindi.structuredPrompt, english.structuredPrompt);
    assert.deepEqual(hindi.options.map((option) => option.value), english.options.map((option: any) => option.value));
    assert.deepEqual(hindi.options.map((option) => option.errorLabel), english.options.map((option: any) => option.errorLabel));
    assert.equal(hindi.options.length, 4);
    assert.equal(new Set(hindi.options.map((option) => option.label)).size, 4);
    assert.equal(hindi.metadata.locale, "hi-IN");
    assert.equal(hindi.metadata.sourceLocale, "en-IN");
    assert.equal(hindi.metadata.localizationMode, "LANGUAGE_ADAPTED");
    assert.equal(hindi.metadata.answerParityVerified, true);
    assert.ok(hindi.stem.length >= 45, `${ql.qlId} short Hindi stem: ${hindi.stem}`);
    assert.ok(/[\u0900-\u097F]/.test(hindi.stem), `${ql.qlId} has no Devanagari: ${hindi.stem}`);
    assert.ok(!forbiddenEnglish.test(hindi.stem), `${ql.qlId} English leak: ${hindi.stem}`);
    assert.ok(!internalLeak.test(hindi.stem), `${ql.qlId} internal leak: ${hindi.stem}`);
    assert.ok(!latinWordLeak.test(hindi.stem), `${ql.qlId} Latin word leak: ${hindi.stem}`);
    assert.ok(!/करता\/करती|था\/थी|है है|है। है/.test(hindi.stem), `${ql.qlId} unnatural gender or duplication: ${hindi.stem}`);
    if (ql.qlId === "DIR-QL-036" || ql.qlId === "DIR-QL-037") {
      assert.ok(!/संगत बंद विन्यास|पूरे विन्यास|बंद विन्यास/.test(hindi.stem), `${ql.qlId} construction jargon: ${hindi.stem}`);
    }
    const explanationText = [hindi.explanation.given, ...hindi.explanation.steps, hindi.explanation.resultLine, hindi.explanation.conclusion].join(" ");
    assert.ok(/[\u0900-\u097F]/.test(explanationText));
    assert.ok(!forbiddenEnglish.test(explanationText), `${ql.qlId} English explanation leak: ${explanationText}`);
    assert.ok(!internalLeak.test(explanationText), `${ql.qlId} explanation internal leak: ${explanationText}`);
    assert.ok(!latinWordLeak.test(explanationText), `${ql.qlId} explanation Latin leak: ${explanationText}`);
    assert.ok(hindi.options.every((option) => !latinWordLeak.test(option.label)), `${ql.qlId} option Latin leak`);
    if (ql.qlId === "DIR-QL-010" && english.structuredPrompt.displayMode === "DECIMAL") {
      assert.ok(hindi.options.every((option) => /^\d+\.\d मीटर$/.test(option.label)), `DIR-QL-010 decimal formatting: ${hindi.options.map((option) => option.label)}`);
    }
    assert.ok(hindi.explanation.steps.length >= 2);
    if (["DIR-QL-001", "DIR-QL-002"].includes(ql.qlId)) {
      assert.ok(hindi.explanation.steps.length >= 1 + (english.structuredPrompt.turns?.length ?? 0));
      assert.ok(hindi.explanation.steps.slice(1).every((step) => /°/.test(step)), `${ql.qlId} must show degree arithmetic`);
    }
    if (ql.qlId === "DIR-QL-003") {
      assert.ok(hindi.explanation.steps.length >= 3);
      assert.ok(hindi.explanation.steps.slice(0, 2).every((step) => /°/.test(step)), "DIR-QL-003 must show initial/final angles");
    }
    if (Number(ql.qlId.slice(-3)) >= 4 && Number(ql.qlId.slice(-3)) <= 10) {
      assert.doesNotMatch(explanationText, /हर मोड़ के बाद नई मुख-दिशा तय करें|अंतिम विस्थापन से दिशा या न्यूनतम दूरी प्राप्त करें/);
      const sourceLines = english.explanation?.movementLines ?? [];
      for (const line of sourceLines) {
        const match = String(line).match(/(\d+) metres?/);
        if (match) assert.match(explanationText, new RegExp(`${match[1]} मीटर`), `${ql.qlId} missing movement distance ${match[1]}`);
      }
      if (/√/.test(String(english.explanation?.calculationLine ?? ""))) assert.match(explanationText, /√/);
    }
    const qlNumber = Number(ql.qlId.slice(-3));
    if (qlNumber >= 11 && qlNumber <= 15) {
      assert.doesNotMatch(explanationText, /एक संदर्भ बिंदु को स्थिर मानकर|स्वतंत्र मार्गों से प्राप्त स्थान/);
      const firstRelation = english.structuredPrompt.relations?.[0];
      if (firstRelation?.distance != null) {
        assert.match(explanationText, new RegExp(`${firstRelation.distance} मीटर`));
      }
      if (ql.qlId === "DIR-QL-012" && /√/.test(String(english.explanation?.calculationLine ?? ""))) {
        assert.match(explanationText, /√/);
      }
    }
    if (qlNumber >= 16 && qlNumber <= 22) {
      assert.doesNotMatch(explanationText, /सभी अंतिम स्थानों को समान आरंभिक निर्देशांक-फ्रेम में रखें|प्रश्न के अनुसार दिशा, दूरी, चरम स्थान/);
      const firstStep = english.structuredPrompt.paths?.[0]?.steps?.[0];
      if (firstStep?.distance != null) {
        assert.match(explanationText, new RegExp(`${firstStep.distance} मीटर`));
      }
      if (["DIR-QL-017", "DIR-QL-018"].includes(ql.qlId) && /√/.test(String(english.explanation?.calculationLine ?? ""))) {
        assert.match(explanationText, /√/);
      }
    }
    if (qlNumber >= 23 && qlNumber <= 29) {
      const stepsText = hindi.explanation.steps.join(" ");
      assert.doesNotMatch(
        stepsText,
        /संकेतित कथनों को विषय–चिह्न–संदर्भ क्रम में पढ़ें|संभावित चिह्नों को एक-एक करके जाँचें|डिकोड किए गए संबंधों या चालों को क्रम से जोड़ें/,
      );
      const codeMap = english.structuredPrompt.codeMap ?? english.structuredPrompt.recoveredCodeMap;
      if (codeMap) {
        for (const symbol of Object.keys(codeMap)) {
          assert.ok(stepsText.includes(symbol), `${ql.qlId} missing decoded symbol ${symbol}`);
        }
      }
      if (ql.qlId === "DIR-QL-029") {
        const firstMovement = english.structuredPrompt.steps?.[0];
        if (firstMovement?.distance != null) {
          assert.match(stepsText, new RegExp(`${firstMovement.distance} मीटर`));
        }
      }
    }
    if (qlNumber >= 30 && qlNumber <= 35) {
      const stepsText = hindi.explanation.steps.join(" ");
      assert.doesNotMatch(
        stepsText,
        /पहले समय से सूर्य और छाया की वास्तविक दिशा तय करें|फिर व्यक्ति के मुख के सापेक्ष बाएँ, दाएँ, सामने या पीछे का संबंध लगाएँ|दिए गए व्यक्ति-संबंध के अनुसार अंतिम मुख तय करें/,
      );
      assert.ok(
        stepsText.includes(hindi.options[hindi.correctIndex].label),
        `${ql.qlId} explanation must show the solved localized answer`,
      );
    }
    if (qlNumber >= 36 && qlNumber <= 44) {
      const stepsText = hindi.explanation.steps.join(" ");
      assert.doesNotMatch(
        stepsText,
        /दिए गए तीन संबंधों से .* की स्थिति तय करें|पहले दिए गए दो आधार संबंधों से पहले तीन बिंदुओं की स्थिति तय करें|पहले सभी ज्ञात चालों को जोड़कर उनका अंतिम स्थान निकालें|उत्तर, पूर्व, दक्षिण और पश्चिम—चारों को सम्भावित आरंभिक दिशा मानकर वही मार्ग चलाएँ/,
      );
      assert.ok(
        stepsText.includes(hindi.options[hindi.correctIndex].label),
        `${ql.qlId} CP008 explanation must show the solved answer`,
      );
      if (ql.qlId === "DIR-QL-036") {
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.missingDistance} मीटर`));
      }
      if (ql.qlId === "DIR-QL-037") {
        const d = Math.max(
          Math.abs(Number(english.structuredPrompt.anchorRelations?.[0]?.vector?.x ?? 0)),
          Math.abs(Number(english.structuredPrompt.anchorRelations?.[0]?.vector?.y ?? 0)),
        );
        assert.match(stepsText, new RegExp(`${Math.round(d)} मीटर`));
        assert.match(stepsText, /कथन 1:/);
      }
      if (ql.qlId === "DIR-QL-038") {
        const firstLeg = english.structuredPrompt.legs?.[0];
        if (firstLeg?.distance != null) assert.match(stepsText, new RegExp(`${firstLeg.distance} मीटर`));
      }
      if (ql.qlId === "DIR-QL-039") {
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.secondDistance} मीटर`));
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.thirdDistance} मीटर`));
      }
      if (ql.qlId === "DIR-QL-040") {
        const firstMove = english.structuredPrompt.operations?.find((operation: any) => operation.kind === "MOVE");
        if (firstMove?.distance != null) assert.match(stepsText, new RegExp(`${firstMove.distance} मीटर`));
      }
      if (ql.qlId === "DIR-QL-041") {
        assert.match(stepsText, /√/);
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.answerDistance} मीटर`));
      }
      if (ql.qlId === "DIR-QL-042" || ql.qlId === "DIR-QL-043") {
        const firstMove = english.structuredPrompt.operations?.find((operation: any) => operation.kind === "MOVE");
        if (firstMove?.distance != null) assert.match(stepsText, new RegExp(`${firstMove.distance} मीटर`));
        if (ql.qlId === "DIR-QL-043") assert.match(stepsText, /√/);
      }
      if (ql.qlId === "DIR-QL-044") {
        const firstRelation = english.structuredPrompt.diagramRelations?.[0];
        const textRelation = english.structuredPrompt.textRelation;
        const relationDistance = firstRelation
          ? Math.max(Math.abs(Number(firstRelation.vector?.x ?? 0)), Math.abs(Number(firstRelation.vector?.y ?? 0)))
          : 0;
        const textDistance = textRelation
          ? Math.max(Math.abs(Number(textRelation.vector?.x ?? 0)), Math.abs(Number(textRelation.vector?.y ?? 0)))
          : 0;
        assert.match(stepsText, new RegExp(`${Math.round(relationDistance)} मीटर`));
        assert.match(stepsText, new RegExp(`${Math.round(textDistance)} मीटर`));
      }
    }
    const diagrams = [hindi.questionDiagram, hindi.explanation.diagram].filter(Boolean) as any[];
    for (const diagram of diagrams) {
      assert.ok(typeof diagram.svg === "string" && diagram.svg.includes("<svg"));
      assert.ok(diagram.svg.includes('role="img"'));
      assert.ok(diagram.svg.includes("aria-label="));
      assert.ok(!/\b(?:North|South|East|West|metres?|Morning|Evening|Shadow|Sun|Taran)\b/.test(diagram.svg), `${ql.qlId} diagram English leak`);
    }
    stems.get(ql.qlId)!.add(hindi.stem);
    explanations.get(ql.qlId)!.add(explanationText);
    positions[hindi.correctIndex] += 1;
  }
}

for (const [qlId, values] of stems) assert.ok(values.size >= 30, `${qlId} Hindi stem diversity ${values.size}`);
for (const [qlId, values] of explanations) assert.ok(values.size >= 30, `${qlId} Hindi explanation diversity ${values.size}`);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.35, `Hindi answer positions ${positions}`);

for (let seed = 0; seed < 40; seed += 1) {
  const direction = generateDirectionQuestionHindi("DIR-QL-042", seed);
  const distance = generateDirectionQuestionHindi("DIR-QL-043", seed);
  assert.deepEqual(direction.structuredPrompt, distance.structuredPrompt);
  assert.equal(direction.metadata.caseletId, distance.metadata.caseletId);
}

assert.throws(() => generateDirectionQuestionHindi("DIR-QL-999", 0));
console.log("DIR-001 Hindi localization proof passed", {
  qls: DIR_001_QLS.length,
  generatedCases: DIR_001_QLS.length * 40,
  positions,
  stemDiversity: Object.fromEntries([...stems].map(([id, values]) => [id, values.size])),
  explanationDiversity: Object.fromEntries([...explanations].map(([id, values]) => [id, values.size])),
});
