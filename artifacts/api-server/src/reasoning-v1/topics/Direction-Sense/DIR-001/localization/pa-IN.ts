import { generateDirectionQuestion } from "../chapter-registry";
import { asR, coordinateTextPa, directionAnglePa, directionPa, metresPa, namePa, relationSentencePa, reverseTurnCalculationStepsPa, turnCalculationStepsPa, type R } from "./punjabi-foundation";
import { localizeDiagramPunjabi, optionLabelPunjabi } from "./punjabi-editorial-overrides";
import { renderPunjabiStem } from "./punjabi-stems";
import type { LocalizedDirectionExplanationPunjabi, LocalizedDirectionOptionPunjabi, LocalizedDirectionQuestionPunjabi } from "./punjabi-types";

function renderExplanationPunjabi(english: R): LocalizedDirectionExplanationPunjabi {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  const answer = optionLabelPunjabi(asR(english.options?.[english.correctIndex] ?? {}));
  const answerSentence = /ਹੈ[।.]?$/.test(answer) ? answer : `${answer} ਹੈ।`;
  const diagram = localizeDiagramPunjabi(asR(english.explanation)?.diagram);
  const stem = renderPunjabiStem(english);
  const context = stem.replace(/[^।?]*\?$/, "").trim() || stem;
  const base: LocalizedDirectionExplanationPunjabi = {
    given: `ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਜਾਣਕਾਰੀ: ${context}`,
    steps: ["ਸਾਰੀ ਜਾਣਕਾਰੀ ਨੂੰ ਇੱਕੋ ਨਕਸ਼ੇ ਉੱਤੇ ਕ੍ਰਮਵਾਰ ਦਰਜ ਕਰੋ।", "ਫਿਰ ਪੁੱਛੇ ਗਏ ਦੋ ਬਿੰਦੂਆਂ ਜਾਂ ਦਿਸ਼ਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।"],
    resultLine: `ਗਿਣਤੀ ਤੋਂ ਮਿਲਿਆ ਨਤੀਜਾ: ${answerSentence}`,
    conclusion: /ਹੈ[।.]?$/.test(answer) ? `ਇਸ ਲਈ ਸਹੀ ਨਤੀਜਾ: ${answer}` : `ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ${answer} ਹੈ।`,
    ...(diagram ? { diagram } : {}),
  };

  if (qlId === "DIR-QL-001") {
    return {
      ...base,
      steps: turnCalculationStepsPa(s.initialFacing, s.turns ?? []),
      resultLine: `ਸਾਰੇ ਮੋੜ ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਮੂੰਹ ${answer} ਦਿਸ਼ਾ ਵੱਲ ਹੈ।`,
    };
  }

  if (qlId === "DIR-QL-002") {
    return {
      ...base,
      steps: reverseTurnCalculationStepsPa(s.finalFacing, s.turns ?? []),
      resultLine: `ਮੋੜਾਂ ਨੂੰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਵਾਪਸ ਲੈਣ ਉੱਤੇ ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ${answer} ਮਿਲਦੀ ਹੈ।`,
    };
  }

  if (qlId === "DIR-QL-003") {
    const initialAngle = directionAnglePa(s.initialFacing);
    const finalAngle = directionAnglePa(s.finalFacing);
    return {
      ...base,
      steps: [
        `ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ${directionPa(s.initialFacing)} ਹੈ, ਅਰਥਾਤ ${initialAngle}°।`,
        `ਅੰਤਿਮ ਦਿਸ਼ਾ ${directionPa(s.finalFacing)} ਹੈ, ਅਰਥਾਤ ${finalAngle}°।`,
        `ਇਨ੍ਹਾਂ ਦੋਨਾਂ ਦਿਸ਼ਾਵਾਂ ਵਿਚਕਾਰ ਲੋੜੀਂਦਾ ਮੋੜ ${answer} ਬਣਦਾ ਹੈ।`,
      ],
      resultLine: `ਇਸ ਲਈ ਲਿਆ ਗਿਆ ਮੋੜ ${answer} ਹੈ।`,
    };
  }

  if (["DIR-QL-004", "DIR-QL-005", "DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਹਰ ਮੋੜ ਤੋਂ ਬਾਅਦ ਮੂੰਹ ਦੀ ਨਵੀਂ ਦਿਸ਼ਾ ਲਿਖੋ ਅਤੇ ਅਗਲੀ ਚਾਲ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਦਰਜ ਕਰੋ।",
        "ਪੂਰਬ-ਪੱਛਮ ਵਾਲੀਆਂ ਦੂਰੀਆਂ ਅਤੇ ਉੱਤਰ-ਦੱਖਣ ਵਾਲੀਆਂ ਦੂਰੀਆਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਜੋੜੋ।",
        qlId === "DIR-QL-008"
          ? "ਕੁੱਲ ਤੈਅ ਕੀਤੀ ਦੂਰੀ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ਅੰਤਿਮ ਬਿੰਦੂ ਦੀ ਸਿੱਧੀ ਦੂਰੀ ਵੱਖ-ਵੱਖ ਹਨ।"
          : "ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਦੇ ਫ਼ਰਕ ਤੋਂ ਲੋੜੀਂਦੀ ਦਿਸ਼ਾ ਜਾਂ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ਮਿਲਦੀ ਹੈ।",
      ],
      resultLine: `ਪੂਰੇ ਰਸਤੇ ਦੀ ਗਿਣਤੀ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-036", "DIR-QL-037", "DIR-QL-038", "DIR-QL-039", "DIR-QL-040", "DIR-QL-041", "DIR-QL-042", "DIR-QL-043", "DIR-QL-044"].includes(qlId)) {
    if (qlId === "DIR-QL-036") {
      return {
        ...base,
        steps: [
          `ਦਿੱਤੇ ਤਿੰਨ ਰਿਸ਼ਤਿਆਂ ਤੋਂ ${namePa(s.missingFrom)} ਅਤੇ ${namePa(s.missingTo)} ਦੀ ਥਾਂ ਤੈਅ ਕਰੋ।`,
          `ਦੋਨਾਂ ਥਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਉੱਤੇ ${namePa(s.missingTo)}, ${namePa(s.missingFrom)} ਤੋਂ ${answer} ਵੱਲ ਹੈ।`,
        ],
        resultLine: `ਇਸ ਲਈ ਛੱਡੀ ਹੋਈ ਦਿਸ਼ਾ ${answer} ਹੈ।`,
      };
    }
    if (qlId === "DIR-QL-037") {
      return {
        ...base,
        steps: [
          "ਪਹਿਲਾਂ ਦਿੱਤੇ ਦੋ ਮੁੱਖ ਰਿਸ਼ਤਿਆਂ ਤੋਂ ਪਹਿਲੇ ਤਿੰਨ ਬਿੰਦੂਆਂ ਦੀ ਥਾਂ ਤੈਅ ਕਰੋ।",
          "ਹੁਣ ਚਾਰਾਂ ਕਥਨਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਉਨ੍ਹਾਂ ਥਾਵਾਂ ਨਾਲ ਮਿਲਾਓ।",
          `ਜਿਹੜਾ ਕਥਨ ਕਿਸੇ ਬਿੰਦੂ ਨੂੰ ਬਾਕੀ ਜਾਣਕਾਰੀ ਨਾਲ ਨਾ ਮਿਲਦੀ ਥਾਂ ਉੱਤੇ ਰੱਖਦਾ ਹੈ, ਉਹੀ ਗਲਤ ਹੈ; ਇੱਥੇ ਉਹ ${answer} ਹੈ।`,
        ],
        resultLine: `ਗਲਤ ਕਥਨ ${answer} ਹੈ।`,
      };
    }
    if (qlId === "DIR-QL-038") {
      const unknown = asR((s.legs ?? [])[Number(s.unknownIndex ?? 0)] ?? {});
      return {
        ...base,
        steps: [
          "ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਚਾਲਾਂ ਨੂੰ ਜੋੜ ਕੇ ਉਹਨਾਂ ਦਾ ਅੰਤਿਮ ਬਿੰਦੂ ਕੱਢੋ।",
          `ਦਿੱਤਾ ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(asR(s.target))} ਹੈ।`,
          `ਬਾਕੀ ${metresPa(unknown.distance)} ਦੀ ਚਾਲ ਨੂੰ ਇਸ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ${answer} ਵੱਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`,
        ],
        resultLine: `ਅਣਜਾਣ ਚਾਲ ਦੀ ਦਿਸ਼ਾ ${answer} ਹੈ।`,
      };
    }
    if (qlId === "DIR-QL-039") {
      return {
        ...base,
        steps: [
          `ਪਹਿਲੀ ${metresPa(s.firstDistance)} ਦੀ ਚਾਲ ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਅਨੁਸਾਰ ਲਗਾਓ।`,
          "ਫਿਰ ਖੱਬਾ ਮੋੜ, ਸੱਜਾ ਮੋੜ, ਪਿੱਛੇ ਮੋੜ ਅਤੇ ਬਿਨਾਂ ਮੋੜ ਦੇ ਸਿੱਧੀ ਚਾਲ—ਚਾਰਾਂ ਸੰਭਾਵਨਾਵਾਂ ਨੂੰ ਬਾਕੀ ਚਾਲਾਂ ਨਾਲ ਜਾਂਚੋ।",
          `ਕੇਵਲ ${answer} ਲੈਣ ਉੱਤੇ ਦਿੱਤਾ ਅੰਤਿਮ ਬਿੰਦੂ ਮਿਲਦਾ ਹੈ।`,
        ],
        resultLine: `ਅਣਜਾਣ ਮੋੜ ${answer} ਹੈ।`,
      };
    }
    if (qlId === "DIR-QL-040") {
      return {
        ...base,
        steps: [
          "ਉੱਤਰ, ਪੂਰਬ, ਦੱਖਣ ਅਤੇ ਪੱਛਮ—ਚਾਰਾਂ ਨੂੰ ਸੰਭਵ ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ਮੰਨ ਕੇ ਉਹੀ ਰਸਤਾ ਚਲਾਓ।",
          `ਦਿੱਤਾ ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(asR(s.target))} ਹੈ।`,
          `ਕੇਵਲ ${answer} ਤੋਂ ਸ਼ੁਰੂ ਕਰਨ ਉੱਤੇ ਰਸਤਾ ਉਸੇ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ।`,
        ],
        resultLine: `ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ${answer} ਹੈ।`,
      };
    }
    if (qlId === "DIR-QL-041") {
      return {
        ...base,
        steps: [
          `ਪਹਿਲਾਂ ਦਿੱਤੇ ਥਾਂ-ਰਿਸ਼ਤਿਆਂ ਤੋਂ ${namePa(s.startEntity)} ਅਤੇ ${namePa(s.referenceEntity)} ਦੀ ਥਾਂ ਤੈਅ ਕਰੋ।`,
          `ਫਿਰ ${namePa(s.startEntity)} ਤੋਂ ਦਿੱਤੀਆਂ ਚਾਲਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਲਗਾ ਕੇ ਅੰਤਿਮ ਬਿੰਦੂ ਕੱਢੋ।`,
          `ਅੰਤਿਮ ਬਿੰਦੂ ਦੀ ${namePa(s.referenceEntity)} ਨਾਲ ਸਿੱਧੀ ਤੁਲਨਾ ਕਰਨ ਉੱਤੇ ਉੱਤਰ ${answer} ਮਿਲਦਾ ਹੈ।`,
        ],
        resultLine: `ਅੰਤਿਮ ਰਿਸ਼ਤਾ ${answer} ਹੈ।`,
      };
    }
    if (qlId === "DIR-QL-042") {
      return {
        ...base,
        steps: [
          `ਚੌਕੀ ${String(s.checkpoint)} ਤੋਂ ਸ਼ੁਰੂ ਕਰਕੇ ਸਾਰੀਆਂ ਚਾਲਾਂ ਅਤੇ ਮੋੜ ਕ੍ਰਮਵਾਰ ਲਗਾਓ।`,
          "ਅੰਤਿਮ ਬਿੰਦੂ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਚੌਕੀ ਤੋਂ ਸਿੱਧੀ ਦਿਸ਼ਾ ਵੇਖੋ; ਅੰਤ ਵਿੱਚ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਨੂੰ ਉੱਤਰ ਨਾ ਮੰਨੋ।",
          `ਅੰਤਿਮ ਬਿੰਦੂ ਚੌਕੀ ਤੋਂ ${answer} ਵੱਲ ਹੈ।`,
        ],
        resultLine: `ਚੌਕੀ ਤੋਂ ਲੋੜੀਂਦੀ ਦਿਸ਼ਾ ${answer} ਹੈ।`,
      };
    }
    if (qlId === "DIR-QL-043") {
      return {
        ...base,
        steps: [
          `ਚੌਕੀ ${String(s.checkpoint)} ਤੋਂ ਪੂਰਾ ਰਸਤਾ ਚਲਾ ਕੇ ਅੰਤਿਮ ਬਿੰਦੂ ਕੱਢੋ।`,
          "ਚੌਕੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਵਿਚਕਾਰ ਪੂਰਬ-ਪੱਛਮ ਅਤੇ ਉੱਤਰ-ਦੱਖਣ ਦਾ ਫ਼ਰਕ ਵੱਖ-ਵੱਖ ਕੱਢੋ।",
          `ਇਨ੍ਹਾਂ ਦੋ ਫ਼ਰਕਾਂ ਤੋਂ ਸਿੱਧੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ${answer} ਮਿਲਦੀ ਹੈ।`,
        ],
        resultLine: `ਚੌਕੀ ਤੋਂ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ${answer} ਹੈ।`,
      };
    }
    return {
      ...base,
      steps: [
        "ਚਿੱਤਰ ਵਿੱਚ ਦਿੱਤੇ ਦੋਨਾਂ ਥਾਂ-ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਪਹਿਲਾਂ ਪੜ੍ਹੋ।",
        "ਇਸ ਤੋਂ ਬਾਅਦ ਲਿਖੇ ਹੋਏ ਰਿਸ਼ਤੇ ਨੂੰ ਉਸੇ ਜਾਣਕਾਰੀ ਨਾਲ ਜੋੜੋ।",
        `ਤਿੰਨਾਂ ਰਿਸ਼ਤਿਆਂ ਨੂੰ ਇਕੱਠੇ ਰੱਖਣ ਉੱਤੇ ਪੁੱਛੇ ਦੋ ਬਿੰਦੂਆਂ ਦੀ ਦਿਸ਼ਾ ${answer} ਮਿਲਦੀ ਹੈ।`,
      ],
      resultLine: `ਚਿੱਤਰ ਅਤੇ ਲਿਖੇ ਕਥਨ ਦੋਨਾਂ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-011", "DIR-QL-012", "DIR-QL-013", "DIR-QL-014", "DIR-QL-015"].includes(qlId)) {
    const relations = (s.relations ?? []).map((relation: R) => relationSentencePa(relation, true));
    const steps: string[] = ["ਦਿੱਤੇ ਸੰਬੰਧਾਂ ਨੂੰ ਇੱਕੋ ਨਕਸ਼ੇ ਉੱਤੇ ਰੱਖੋ:", ...relations];
    if (qlId === "DIR-QL-012") {
      const query = asR(s.query);
      const coordinates = asR(s.coordinates);
      const subject = asR(coordinates[query.subject]);
      const reference = asR(coordinates[query.reference]);
      const dx = Number(subject.x ?? 0) - Number(reference.x ?? 0);
      const dy = Number(subject.y ?? 0) - Number(reference.y ?? 0);
      const horizontal = Math.abs(dx), vertical = Math.abs(dy);
      steps.push(`${namePa(query.reference)} ਤੋਂ ${namePa(query.subject)} ਤੱਕ ਫ਼ਰਕ: ${coordinateTextPa({ x: dx, y: dy })}।`);
      const distance = Number(asR(english.correctAnswer).distance ?? 0);
      steps.push(
        horizontal === 0 || vertical === 0
          ? `ਕੇਵਲ ਇੱਕ ਦਿਸ਼ਾ ਦਾ ਫ਼ਰਕ ਬਚਦਾ ਹੈ, ਇਸ ਲਈ ਸਿੱਧੀ ਦੂਰੀ ${metresPa(distance)} ਹੈ।`
          : `ਸਿੱਧੀ ਦੂਰੀ = √(${horizontal}² + ${vertical}²) = ${metresPa(distance)}।`,
      );
    } else {
      steps.push(`ਪੂਰੇ ਨਕਸ਼ੇ ਤੋਂ ਪੁੱਛਿਆ ਗਿਆ ਸੰਬੰਧ/ਸਥਿਤੀ ${answerSentence}`);
    }
    return { ...base, steps, resultLine: `ਨਕਸ਼ੇ ਤੋਂ ਸਹੀ ਉੱਤਰ ${answerSentence}` };
  }

  if (["DIR-QL-016", "DIR-QL-017", "DIR-QL-018", "DIR-QL-019", "DIR-QL-020", "DIR-QL-021", "DIR-QL-022"].includes(qlId)) {
    const paths = (s.paths ?? []) as R[];
    const referenceLabel = english.metadata?.sameOrigin ? "O" : "P";
    const steps: string[] = [];
    for (const path of paths) {
      const movements = (path.steps ?? []).map(
        (step: R) => `${metresPa(step.distance)} ${directionPa(step.direction)} ਵੱਲ`,
      ).join(" → ");
      steps.push(`${namePa(path.name)}: ${movements}।`);
      steps.push(`${namePa(path.name)} ਦਾ ਅੰਤਿਮ ਬਿੰਦੂ ${referenceLabel} ਤੋਂ ${coordinateTextPa(asR(path.endpoint))} ਹੈ।`);
    }
    const query = asR(s.query);
    if (["DIR-QL-016", "DIR-QL-017", "DIR-QL-018"].includes(qlId)) {
      const subjectName = String(query.subject ?? query.left);
      const referenceName = String(query.reference ?? query.right);
      const subjectPath = paths.find((path) => String(path.name) === subjectName);
      const referencePath = paths.find((path) => String(path.name) === referenceName);
      if (subjectPath && referencePath) {
        const dx = Number(subjectPath.endpoint.x) - Number(referencePath.endpoint.x);
        const dy = Number(subjectPath.endpoint.y) - Number(referencePath.endpoint.y);
        steps.push(`${namePa(referenceName)} ਦੇ ਅੰਤਿਮ ਬਿੰਦੂ ਤੋਂ ${namePa(subjectName)} ਦੇ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਫ਼ਰਕ: ${coordinateTextPa({ x: dx, y: dy })}।`);
        if (qlId !== "DIR-QL-016") {
          const distance = Number(asR(english.correctAnswer).distance ?? 0);
          const horizontal = Math.abs(dx), vertical = Math.abs(dy);
          steps.push(
            horizontal === 0 || vertical === 0
              ? `ਅੰਤਿਮ ਬਿੰਦੂਆਂ ਦੀ ਸਿੱਧੀ ਦੂਰੀ ${metresPa(distance)} ਹੈ।`
              : `ਸਿੱਧੀ ਦੂਰੀ = √(${horizontal}² + ${vertical}²) = ${metresPa(distance)}।`,
          );
        }
      }
    } else if (qlId === "DIR-QL-021") {
      for (const path of paths) {
        const distance = Math.round(Math.hypot(Number(path.endpoint.x), Number(path.endpoint.y)));
        steps.push(`${namePa(path.name)} ਦੀ ਬਿੰਦੂ O ਤੋਂ ਦੂਰੀ = ${metresPa(distance)}।`);
      }
    } else {
      steps.push(`ਇਨ੍ਹਾਂ ਅੰਤਿਮ ਬਿੰਦੂਆਂ ਦੀ ਤੁਲਨਾ ਕਰਨ ਉੱਤੇ ਸਹੀ ਵਿਕਲਪ ${answerSentence}`);
    }
    return { ...base, steps, resultLine: `ਅੰਤਿਮ ਬਿੰਦੂਆਂ ਦੀ ਤੁਲਨਾ ਤੋਂ ਉੱਤਰ ${answerSentence}` };
  }

  if (["DIR-QL-023", "DIR-QL-024", "DIR-QL-025", "DIR-QL-026", "DIR-QL-027", "DIR-QL-028", "DIR-QL-029"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਪਹਿਲਾਂ ਹਰ ਚਿੰਨ੍ਹ ਦਾ ਦਿੱਤਾ ਮਤਲਬ ਲਿਖੋ।",
        "ਫਿਰ ਹਰ ਕਥਨ ਨੂੰ ਪਹਿਲਾ ਨਾਮ–ਚਿੰਨ੍ਹ–ਦੂਜਾ ਨਾਮ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਪੜ੍ਹ ਕੇ ਸਧਾਰਨ ਦਿਸ਼ਾ-ਸੰਬੰਧ ਜਾਂ ਚਾਲ ਵਿੱਚ ਬਦਲੋ।",
        qlId === "DIR-QL-025" || qlId === "DIR-QL-028"
          ? "ਸੰਭਵ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਜਾਂਚੋ ਅਤੇ ਸਿਰਫ਼ ਉਹੀ ਚਿੰਨ੍ਹ ਰੱਖੋ ਜੋ ਸਾਰੀ ਜਾਣਕਾਰੀ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।"
          : "ਬਦਲੇ ਹੋਏ ਸੰਬੰਧਾਂ ਜਾਂ ਚਾਲਾਂ ਨੂੰ ਕ੍ਰਮਵਾਰ ਜੋੜ ਕੇ ਨਤੀਜਾ ਕੱਢੋ।",
      ],
      resultLine: `ਚਿੰਨ੍ਹਾਂ ਦਾ ਮਤਲਬ ਲਗਾਉਣ ਉੱਤੇ ਸਹੀ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-030", "DIR-QL-031", "DIR-QL-032", "DIR-QL-033", "DIR-QL-034", "DIR-QL-035"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਸਵੇਰੇ ਸੂਰਜ ਪੂਰਬ ਵੱਲ ਅਤੇ ਸ਼ਾਮ ਨੂੰ ਪੱਛਮ ਵੱਲ ਹੁੰਦਾ ਹੈ; ਪਰਛਾਂਵਾਂ ਇਸ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵੱਲ ਪੈਂਦੀ ਹੈ।",
        "ਵਿਅਕਤੀ ਦੇ ਮੂੰਹ ਦੇ ਹਿਸਾਬ ਨਾਲ ਖੱਬੇ, ਸੱਜੇ, ਸਾਹਮਣੇ ਜਾਂ ਪਿੱਛੇ ਵਾਲੀ ਦਿਸ਼ਾ ਤੈਅ ਕਰੋ।",
        qlId === "DIR-QL-034"
          ? "ਅੰਤ ਵਿੱਚ ਦਿੱਤੇ ਮੋੜ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਮੌਜੂਦਾ ਦਿਸ਼ਾ ਤੋਂ ਲਗਾਓ।"
          : "ਦੋ ਵਿਅਕਤੀਆਂ ਬਾਰੇ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਹੋਵੇ ਤਾਂ ਦੂਜੇ ਵਿਅਕਤੀ ਦੀ ਦਿਸ਼ਾ ਉਸੇ ਅਨੁਸਾਰ ਤੈਅ ਕਰੋ।",
      ],
      resultLine: `ਸੂਰਜ ਅਤੇ ਪਰਛਾਂਵਾਂ ਦੇ ਸੰਬੰਧ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-038", "DIR-QL-039", "DIR-QL-040"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਚਾਲਾਂ ਨੂੰ ਨਕਸ਼ੇ ਉੱਤੇ ਲਗਾਓ।",
        "ਜਿਸ ਦਿਸ਼ਾ, ਮੋੜ ਜਾਂ ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ਦੀ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿੱਤੀ ਗਈ, ਉਸ ਲਈ ਹਰ ਸੰਭਵ ਵਿਕਲਪ ਵਾਰੀ-ਵਾਰੀ ਅਜ਼ਮਾਓ।",
        "ਜੋ ਇਕੱਲਾ ਵਿਕਲਪ ਦਿੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਪਹੁੰਚਦਾ ਹੈ, ਉਹੀ ਸਹੀ ਹੈ।",
      ],
      resultLine: `ਦਿੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-041", "DIR-QL-042", "DIR-QL-043"].includes(qlId)) {
    return {
      ...base,
      steps: [
        "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਜਾਂ ਚੌਕੀ ਤੋਂ ਉੱਤਰ-ਦੱਖਣ ਵਾਲਾ ਫ਼ਰਕ ਅਤੇ ਪੂਰਬ-ਪੱਛਮ ਵਾਲਾ ਫ਼ਰਕ ਕੱਢੋ।",
        qlId === "DIR-QL-043"
          ? "ਇਨ੍ਹਾਂ ਦੋ ਫ਼ਰਕਾਂ ਉੱਤੇ ਪਾਇਥਾਗੋਰਸ ਨਿਯਮ ਲਗਾ ਕੇ ਸਿੱਧੀ ਦੂਰੀ ਕੱਢੋ।"
          : "ਦੋਨਾਂ ਫ਼ਰਕਾਂ ਦੇ ਪਾਸੇ ਤੋਂ ਦਿਸ਼ਾ ਅਤੇ ਉਨ੍ਹਾਂ ਦੇ ਮਾਪ ਤੋਂ ਦੂਰੀ ਤੈਅ ਕਰੋ।",
      ],
      resultLine: `ਸਾਂਝੀ ਗਿਣਤੀ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  return base;
}

export function localizeDirectionQuestionPunjabi(englishQuestion: unknown): LocalizedDirectionQuestionPunjabi {
  const english = asR(englishQuestion);
  const options: LocalizedDirectionOptionPunjabi[] = (english.options ?? []).map((option: R) => ({
    value: option.value,
    label: optionLabelPunjabi(option),
    errorLabel: option.errorLabel ?? null,
  }));
  if (options.length !== 4 || new Set(options.map((option) => option.label)).size !== 4) {
    throw new Error(`DIR Punjabi options must remain four and unique for ${english.qlId} seed ${english.seed}`);
  }
  const questionDiagram = localizeDiagramPunjabi(english.questionDiagram);
  return {
    locale: "pa-IN",
    qlId: String(english.qlId),
    checkpointId: String(english.checkpointId),
    ruleId: String(english.ruleId),
    seed: Number(english.seed),
    difficulty: english.difficulty,
    stem: renderPunjabiStem(english),
    structuredPrompt: english.structuredPrompt,
    ...(questionDiagram ? { questionDiagram } : {}),
    options,
    correctIndex: Number(english.correctIndex),
    correctAnswer: english.correctAnswer,
    explanation: renderExplanationPunjabi(english),
    metadata: {
      ...(english.metadata ?? {}),
      locale: "pa-IN",
      sourceLocale: "en-IN",
      localizationMode: "LANGUAGE_ADAPTED",
      answerParityVerified: true,
    },
  };
}

export function generateDirectionQuestionPunjabi(qlId: string, seed = 0): LocalizedDirectionQuestionPunjabi {
  return localizeDirectionQuestionPunjabi(generateDirectionQuestion(qlId, seed));
}
