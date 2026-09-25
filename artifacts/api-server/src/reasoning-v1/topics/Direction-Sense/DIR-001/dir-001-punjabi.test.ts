import assert from "node:assert/strict";
import { DIR_001_QLS, generateDirectionQuestion } from "./chapter-registry";
import { generateDirectionQuestionPunjabi } from "./localization/pa-IN";
import { personGenderPa } from "./localization/punjabi-foundation";

const positions = [0, 0, 0, 0];
const stems = new Map<string, Set<string>>();
const explanations = new Map<string, Set<string>>();
const multiLetterLatin = /\b[A-Za-z]{2,}\b/;
const devanagariLettersOrDigits = /[\u0900-\u0963\u0966-\u097F]/;
const internalLeak = /DIR-(?:QL|CP)-\d+|\bundefined\b|\bnull\b/;
const unnatural = /ਕਰਦਾ\/ਕਰਦੀ|ਸੀ\/ਸਨ|ਹੈ ਹੈ|ਹੈ। ਹੈ|ਪਦ|ਸਾਦ੍ਰਿਸ਼ਤਾ|ਤੁਰਨਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ|ਤੁਰਨਾ ਸ਼ੁਰੂ ਕਰਦੀ ਹੈ|ਇੱਕ ਵਿਅਕਤੀ[^।]*(?:ਤੁਰਦਾ|ਜਾਂਦਾ) ਹੈ|ਦਿਸ਼ਾ-ਫਰੇਮ|ਸ਼ੁੱਧ ਚਾਲ|ਅੰਤਿਮ ਖਿਸਕਾਅ|ਮਾਤਰਾਂ|ਸ਼ੁੱਧ ਲੰਬਕਾਰੀ|ਇੱਕ ਸਿੱਧੀ ਲਾਈਨ|ਠੀਕ ਬੰਦ ਬਣਤਰ|ਪੂਰੀ ਬਣਤਰ|ਦੇ ਕਿਹੜੀ ਦਿਸ਼ਾ|ਹੁਕਮ|ਰਸਤਾ\s*:|ਮੁੜਨਾ|ਘੁੰਮਣਾ|ਸਿੱਧਾ ਤੁਰਨਾ|ਅੰਤਿਮ ਥਾਂ|ਕਲਾਕਵਾਈਜ਼|ਐਂਟੀ-ਕਲਾਕਵਾਈਜ਼|ਚਾਲ ਬਿੰਦੂ O ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ\s*:/;
const diagramEnglish = /\b(?:North|South|East|West|metres?|Morning|Evening|Shadow|Sun|Start|Finish|Final|Person|Reference|Endpoint|Movement)\b/;
const masculineFinite = /ਚੱਲਦਾ ਹੈ|ਮੁੜਦਾ ਹੈ|ਘੁੰਮ ਜਾਂਦਾ ਹੈ|ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ/;
const feminineFinite = /ਚੱਲਦੀ ਹੈ|ਮੁੜਦੀ ਹੈ|ਘੁੰਮ ਜਾਂਦੀ ਹੈ|ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੀ ਹੈ/;

function visibleSvgText(svg: string): string {
  const text = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map((match) => match[1]);
  const aria = [...svg.matchAll(/\baria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...text, ...aria].join(" ").replace(/&(?:amp|quot|apos|lt|gt);/g, " ");
}

function directActor(qlId: string, prompt: any): unknown | undefined {
  if (["DIR-QL-001", "DIR-QL-002", "DIR-QL-004", "DIR-QL-005", "DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"].includes(qlId)) return prompt.person;
  if (qlId === "DIR-QL-034") return prompt.name;
  if (["DIR-QL-038", "DIR-QL-039", "DIR-QL-040", "DIR-QL-042", "DIR-QL-043"].includes(qlId)) return prompt.subject;
  return undefined;
}

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
    const punjabi = generateDirectionQuestionPunjabi(ql.qlId, seed);
    assert.deepEqual(punjabi, generateDirectionQuestionPunjabi(ql.qlId, seed));
    assert.equal(punjabi.locale, "pa-IN");
    assert.equal(punjabi.questionDiagram, undefined, `${ql.qlId} Punjabi question must not show a diagram`);
    assert.equal(punjabi.qlId, english.qlId);
    assert.equal(punjabi.checkpointId, english.checkpointId);
    assert.equal(punjabi.ruleId, english.ruleId);
    assert.equal(punjabi.seed, english.seed);
    assert.equal(punjabi.difficulty, english.difficulty);
    assert.equal(punjabi.correctIndex, english.correctIndex);
    assert.deepEqual(punjabi.correctAnswer, english.correctAnswer);
    assert.deepEqual(punjabi.structuredPrompt, english.structuredPrompt);
    assert.deepEqual(punjabi.options.map((option) => option.value), english.options.map((option: any) => option.value));
    assert.deepEqual(punjabi.options.map((option) => option.errorLabel), english.options.map((option: any) => option.errorLabel));
    assert.equal(punjabi.options.length, 4);
    assert.equal(new Set(punjabi.options.map((option) => option.label)).size, 4);
    assert.equal(punjabi.metadata.locale, "pa-IN");
    assert.equal(punjabi.metadata.sourceLocale, "en-IN");
    assert.equal(punjabi.metadata.localizationMode, "LANGUAGE_ADAPTED");
    assert.equal(punjabi.metadata.answerParityVerified, true);
    assert.ok(punjabi.stem.length >= 45, `${ql.qlId} short Punjabi stem: ${punjabi.stem}`);
    assert.ok(/[\u0A00-\u0A7F]/.test(punjabi.stem), `${ql.qlId} has no Gurmukhi: ${punjabi.stem}`);
    assert.ok(!multiLetterLatin.test(punjabi.stem), `${ql.qlId} Latin leak: ${punjabi.stem}`);
    assert.ok(!devanagariLettersOrDigits.test(punjabi.stem), `${ql.qlId} Devanagari leak: ${punjabi.stem}`);
    assert.ok(!internalLeak.test(punjabi.stem), `${ql.qlId} internal leak: ${punjabi.stem}`);
    assert.ok(!unnatural.test(punjabi.stem), `${ql.qlId} unnatural wording: ${punjabi.stem}`);
    assert.doesNotMatch(punjabi.stem, /ਨਿਸ਼ਾਨ ਲੱਗੇ ਬਿੰਦੂ/, `${ql.qlId} padded Punjabi stem: ${punjabi.stem}`);
    if (ql.qlId === "DIR-QL-025") assert.doesNotMatch(punjabi.stem, /ਦਾ ਨਤੀਜਾ .* ਹੈ/, `DIR-QL-025 result-style Punjabi wording: ${punjabi.stem}`);
    if (ql.qlId === "DIR-QL-036" || ql.qlId === "DIR-QL-037") {
      assert.ok(!/ਪੂਰਾ ਬੰਦ ਨਕਸ਼ਾ|ਪੂਰੇ ਨਕਸ਼ੇ/.test(punjabi.stem), `${ql.qlId} construction jargon: ${punjabi.stem}`);
    }

    const actor = directActor(ql.qlId, english.structuredPrompt);
    if (actor !== undefined) {
      const gender = personGenderPa(actor);
      if (gender === "F") {
        assert.match(punjabi.stem, feminineFinite, `${ql.qlId} missing feminine active verb: ${punjabi.stem}`);
        assert.ok(!masculineFinite.test(punjabi.stem), `${ql.qlId} masculine verb leaked into feminine narrative: ${punjabi.stem}`);
      } else {
        assert.match(punjabi.stem, masculineFinite, `${ql.qlId} missing masculine active verb: ${punjabi.stem}`);
        assert.ok(!feminineFinite.test(punjabi.stem), `${ql.qlId} feminine verb leaked into masculine narrative: ${punjabi.stem}`);
      }
    }

    for (const option of punjabi.options) {
      assert.ok(!multiLetterLatin.test(option.label), `${ql.qlId} option Latin leak: ${option.label}`);
      assert.ok(!devanagariLettersOrDigits.test(option.label), `${ql.qlId} option Devanagari leak: ${option.label}`);
      assert.ok(!internalLeak.test(option.label), `${ql.qlId} option internal leak: ${option.label}`);
      assert.ok(!unnatural.test(option.label), `${ql.qlId} unnatural option: ${option.label}`);
    }
    if (ql.qlId === "DIR-QL-010" && english.structuredPrompt.displayMode !== "RADICAL") {
      for (const option of punjabi.options) assert.match(option.label, /^\d+\.\d ਮੀਟਰ$/);
    }
    const explanationText = [punjabi.explanation.given, ...punjabi.explanation.steps, punjabi.explanation.resultLine, punjabi.explanation.conclusion].join(" ");
    assert.ok(/[\u0A00-\u0A7F]/.test(explanationText));
    assert.ok(!multiLetterLatin.test(explanationText), `${ql.qlId} Latin explanation leak: ${explanationText}`);
    assert.ok(!devanagariLettersOrDigits.test(explanationText), `${ql.qlId} Devanagari explanation leak: ${explanationText}`);
    assert.ok(!internalLeak.test(explanationText), `${ql.qlId} explanation internal leak: ${explanationText}`);
    assert.ok(!unnatural.test(explanationText), `${ql.qlId} unnatural explanation: ${explanationText}`);
    assert.ok(punjabi.explanation.steps.length >= 2);
    const qlNumber = Number(ql.qlId.slice(-3));
    if (qlNumber >= 11 && qlNumber <= 15) {
      assert.doesNotMatch(explanationText, /ਇੱਕ ਬਿੰਦੂ ਨੂੰ ਪੱਕਾ ਮੰਨ ਕੇ|ਵੱਖ-ਵੱਖ ਕਥਨਾਂ ਤੋਂ ਮਿਲੇ ਬਿੰਦੂ/);
      const firstRelation = english.structuredPrompt.relations?.[0];
      if (firstRelation?.distance != null) {
        assert.match(explanationText, new RegExp(`${firstRelation.distance} ਮੀਟਰ`));
      }
      if (ql.qlId === "DIR-QL-012" && /√/.test(String(english.explanation?.calculationLine ?? ""))) {
        assert.match(explanationText, /√/);
      }
    }
    if (qlNumber >= 16 && qlNumber <= 22) {
      assert.doesNotMatch(explanationText, /ਹਰ ਵਿਅਕਤੀ ਦੀ ਚਾਲ ਕ੍ਰਮਵਾਰ ਲਗਾ ਕੇ|ਸਭ ਤੋਂ ਨੇੜੇ ਜਾਂ ਸਭ ਤੋਂ ਦੂਰ ਬਿੰਦੂ/);
      const firstStep = english.structuredPrompt.paths?.[0]?.steps?.[0];
      if (firstStep?.distance != null) {
        assert.match(explanationText, new RegExp(`${firstStep.distance} ਮੀਟਰ`));
      }
      if (["DIR-QL-017", "DIR-QL-018"].includes(ql.qlId) && /√/.test(String(english.explanation?.calculationLine ?? ""))) {
        assert.match(explanationText, /√/);
      }
    }
    if (qlNumber >= 4 && qlNumber <= 10) {
      assert.doesNotMatch(
        explanationText,
        /ਹਰ ਮੋੜ ਤੋਂ ਬਾਅਦ ਮੂੰਹ ਦੀ ਨਵੀਂ ਦਿਸ਼ਾ ਲਿਖੋ|ਪੂਰਬ-ਪੱਛਮ ਵਾਲੀਆਂ ਦੂਰੀਆਂ ਅਤੇ ਉੱਤਰ-ਦੱਖਣ ਵਾਲੀਆਂ ਦੂਰੀਆਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜੋੜੋ/,
      );
      const firstSourceLine = String(english.explanation?.movementLines?.[0] ?? "");
      const movementMatch = firstSourceLine.match(/(\d+(?:\.\d+)?) metres?/);
      if (movementMatch) {
        assert.match(explanationText, new RegExp(`${movementMatch[1]} ਮੀਟਰ`));
      }
      if (["DIR-QL-006", "DIR-QL-007", "DIR-QL-010"].includes(ql.qlId) && /√/.test(String(english.explanation?.calculationLine ?? ""))) {
        assert.match(explanationText, /√/);
      }
    }
    if (qlNumber >= 23 && qlNumber <= 29) {
      const stepsText = punjabi.explanation.steps.join(" ");
      assert.doesNotMatch(
        stepsText,
        /ਪਹਿਲਾਂ ਹਰ ਚਿੰਨ੍ਹ ਦਾ ਦਿੱਤਾ ਮਤਲਬ ਲਿਖੋ|ਫਿਰ ਹਰ ਕਥਨ ਨੂੰ ਪਹਿਲਾ ਨਾਮ–ਚਿੰਨ੍ਹ–ਦੂਜਾ ਨਾਮ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹ ਕੇ|ਸੰਭਵ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜਾਂਚੋ/,
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
          assert.match(stepsText, new RegExp(`${firstMovement.distance} ਮੀਟਰ`));
        }
      }
    }
    if (qlNumber >= 30 && qlNumber <= 35) {
      const stepsText = punjabi.explanation.steps.join(" ");
      assert.doesNotMatch(
        stepsText,
        /ਵਿਅਕਤੀ ਦੇ ਮੂੰਹ ਦੇ ਹਿਸਾਬ ਨਾਲ ਖੱਬੇ, ਸੱਜੇ, ਸਾਹਮਣੇ ਜਾਂ ਪਿੱਛੇ ਵਾਲੀ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ|ਦੋ ਵਿਅਕਤੀਆਂ ਬਾਰੇ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਹੋਵੇ ਤਾਂ ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਉਸੇ ਅਨੁਸਾਰ ਤੈਅ ਕਰੋ/,
      );
      assert.ok(
        stepsText.includes(punjabi.options[punjabi.correctIndex].label),
        `${ql.qlId} explanation must show the solved localized answer`,
      );
    }
    if (qlNumber >= 36 && qlNumber <= 44) {
      const stepsText = punjabi.explanation.steps.join(" ");
      assert.doesNotMatch(
        stepsText,
        /ਦਿੱਤੇ ਤਿੰਨ ਰਿਸ਼ਤਿਆਂ ਤੋਂ .* ਦੀ ਥਾਂ ਤੈਅ ਕਰੋ|ਪਹਿਲਾਂ ਦਿੱਤੇ ਦੋ ਮੁੱਖ ਰਿਸ਼ਤਿਆਂ ਤੋਂ ਪਹਿਲੇ ਤਿੰਨ ਬਿੰਦੂਆਂ ਦੀ ਥਾਂ ਤੈਅ ਕਰੋ|ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਚਾਲਾਂ ਨੂੰ ਜੋੜ ਕੇ ਉਹਨਾਂ ਦਾ ਅੰਤਿਮ ਬਿੰਦੂ ਕੱਢੋ|ਉੱਤਰ, ਪੂਰਬ, ਦੱਖਣ ਅਤੇ ਪੱਛਮ—ਚਾਰਾਂ ਨੂੰ ਸੰਭਵ ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ਮੰਨ ਕੇ ਉਹੀ ਰਸਤਾ ਚਲਾਓ/,
      );
      assert.ok(
        stepsText.includes(punjabi.options[punjabi.correctIndex].label),
        `${ql.qlId} CP008 explanation must show the solved answer`,
      );
      if (ql.qlId === "DIR-QL-036") {
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.missingDistance} ਮੀਟਰ`));
      }
      if (ql.qlId === "DIR-QL-037") {
        const d = Math.max(
          Math.abs(Number(english.structuredPrompt.anchorRelations?.[0]?.vector?.x ?? 0)),
          Math.abs(Number(english.structuredPrompt.anchorRelations?.[0]?.vector?.y ?? 0)),
        );
        assert.match(stepsText, new RegExp(`${Math.round(d)} ਮੀਟਰ`));
        assert.match(stepsText, /ਕਥਨ 1:/);
      }
      if (ql.qlId === "DIR-QL-038") {
        const firstLeg = english.structuredPrompt.legs?.[0];
        if (firstLeg?.distance != null) assert.match(stepsText, new RegExp(`${firstLeg.distance} ਮੀਟਰ`));
      }
      if (ql.qlId === "DIR-QL-039") {
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.secondDistance} ਮੀਟਰ`));
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.thirdDistance} ਮੀਟਰ`));
      }
      if (ql.qlId === "DIR-QL-040") {
        const firstMove = english.structuredPrompt.operations?.find((operation: any) => operation.kind === "MOVE");
        if (firstMove?.distance != null) assert.match(stepsText, new RegExp(`${firstMove.distance} ਮੀਟਰ`));
      }
      if (ql.qlId === "DIR-QL-041") {
        assert.match(stepsText, /√/);
        assert.match(stepsText, new RegExp(`${english.structuredPrompt.answerDistance} ਮੀਟਰ`));
      }
      if (ql.qlId === "DIR-QL-042" || ql.qlId === "DIR-QL-043") {
        const firstMove = english.structuredPrompt.operations?.find((operation: any) => operation.kind === "MOVE");
        if (firstMove?.distance != null) assert.match(stepsText, new RegExp(`${firstMove.distance} ਮੀਟਰ`));
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
        assert.match(stepsText, new RegExp(`${Math.round(relationDistance)} ਮੀਟਰ`));
        assert.match(stepsText, new RegExp(`${Math.round(textDistance)} ਮੀਟਰ`));
      }
    }
    const diagrams = [punjabi.questionDiagram, punjabi.explanation.diagram].filter(Boolean) as any[];
    for (const diagram of diagrams) {
      assert.ok(typeof diagram.svg === "string" && diagram.svg.includes("<svg"));
      assert.ok(diagram.svg.includes('role="img"'));
      assert.ok(diagram.svg.includes("aria-label="));
      assert.doesNotMatch(visibleSvgText(diagram.svg), multiLetterLatin, `${ql.qlId} visible Punjabi diagram text leaked Latin words: ${visibleSvgText(diagram.svg)}`);
      assert.ok(!devanagariLettersOrDigits.test(diagram.svg), `${ql.qlId} diagram Devanagari leak`);
    }
    stems.get(ql.qlId)!.add(punjabi.stem);
    explanations.get(ql.qlId)!.add(explanationText);
    positions[punjabi.correctIndex] += 1;
  }
}

const turnSample = generateDirectionQuestionPunjabi("DIR-QL-001", 0);
assert.ok(turnSample.stem.includes("ਬੀਨਾ ਪਹਿਲਾਂ ਸੱਜੇ ਪਾਸੇ 90° ਮੁੜਦੀ ਹੈ"), turnSample.stem);
assert.ok(turnSample.stem.includes("ਘੜੀ ਦੀ ਉਲਟ ਦਿਸ਼ਾ ਵਿੱਚ 135° ਘੁੰਮ ਜਾਂਦੀ ਹੈ"), turnSample.stem);
assert.ok(turnSample.explanation.steps.some((step) => step.includes("315° + 90° = 405° ≡ 45°")));

const journeySample = generateDirectionQuestionPunjabi("DIR-QL-004", 0);
assert.ok(journeySample.stem.includes("ਗੁਰਪ੍ਰੀਤ ਪਹਿਲਾਂ 4 ਮੀਟਰ ਸਿੱਧਾ ਚੱਲਦਾ ਹੈ"), journeySample.stem);
assert.ok(journeySample.stem.includes("ਖੱਬੇ ਪਾਸੇ 90° ਮੁੜ ਕੇ 12 ਮੀਟਰ ਹੋਰ ਚੱਲਦਾ ਹੈ"), journeySample.stem);

for (const [qlId, values] of stems) assert.ok(values.size >= 30, `${qlId} Punjabi stem diversity ${values.size}`);
for (const [qlId, values] of explanations) assert.ok(values.size >= 30, `${qlId} Punjabi explanation diversity ${values.size}`);
assert.ok(Math.max(...positions) / Math.min(...positions) < 1.35, `Punjabi answer positions ${positions}`);

for (let seed = 0; seed < 40; seed += 1) {
  const direction = generateDirectionQuestionPunjabi("DIR-QL-042", seed);
  const distance = generateDirectionQuestionPunjabi("DIR-QL-043", seed);
  assert.deepEqual(direction.structuredPrompt, distance.structuredPrompt);
  assert.equal(direction.metadata.caseletId, distance.metadata.caseletId);
}

assert.throws(() => generateDirectionQuestionPunjabi("DIR-QL-999", 0));
console.log("DIR-001 Punjabi localization proof passed", {
  qls: DIR_001_QLS.length,
  generatedCases: DIR_001_QLS.length * 40,
  positions,
  stemDiversity: Object.fromEntries([...stems].map(([id, values]) => [id, values.size])),
  explanationDiversity: Object.fromEntries([...explanations].map(([id, values]) => [id, values.size])),
});
