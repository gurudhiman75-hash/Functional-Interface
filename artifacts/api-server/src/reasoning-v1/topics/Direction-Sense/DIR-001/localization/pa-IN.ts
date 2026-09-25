import { generateDirectionQuestion } from "../chapter-registry";
import {
  asR,
  codeMapTextPa,
  codedChainPa,
  coordinateTextPa,
  directionAnglePa,
  directionFromAnglePa,
  directionPa,
  evidenceChainPa,
  metresPa,
  namePa,
  periodPa,
  relationSentencePa,
  reverseTurnCalculationStepsPa,
  sidePa,
  turnCalculationStepsPa,
  turnPa,
  type R,
} from "./punjabi-foundation";
import { localizeDiagramPunjabi, optionLabelPunjabi } from "./punjabi-editorial-overrides";
import { renderPunjabiStem } from "./punjabi-stems";
import type { LocalizedDirectionExplanationPunjabi, LocalizedDirectionOptionPunjabi, LocalizedDirectionQuestionPunjabi } from "./punjabi-types";

function cardinalVectorPa(direction: unknown, distance: unknown): R {
  const d = Number(distance ?? 0);
  switch (String(direction)) {
    case "NORTH": return { x: 0, y: d };
    case "NORTH_EAST": return { x: d, y: d };
    case "EAST": return { x: d, y: 0 };
    case "SOUTH_EAST": return { x: d, y: -d };
    case "SOUTH": return { x: 0, y: -d };
    case "SOUTH_WEST": return { x: -d, y: -d };
    case "WEST": return { x: -d, y: 0 };
    case "NORTH_WEST": return { x: -d, y: d };
    default: return { x: 0, y: 0 };
  }
}

function addCoordinatePa(left: R, right: R): R {
  return { x: Number(left.x ?? 0) + Number(right.x ?? 0), y: Number(left.y ?? 0) + Number(right.y ?? 0) };
}

function applyNamedTurnPa(facing: unknown, turn: unknown): string {
  const offset = String(turn) === "LEFT" ? -90
    : String(turn) === "RIGHT" ? 90
      : String(turn) === "ABOUT" ? 180
        : 0;
  return directionFromAnglePa(directionAnglePa(facing) + offset);
}

function replayAdvancedPa(initialFacing: unknown, operations: readonly R[]): { readonly steps: string[]; readonly endpoint: R; readonly finalFacing: string } {
  let facing = String(initialFacing);
  let endpoint: R = { x: 0, y: 0 };
  const steps: string[] = [];
  for (const operation of operations) {
    if (operation.kind === "TURN") {
      const before = facing;
      facing = applyNamedTurnPa(facing, operation.turn);
      steps.push(`${turnPa(operation.turn)}: ਮੂੰਹ ${directionPa(before)} ਤੋਂ ${directionPa(facing)} ਵੱਲ ਹੋ ਜਾਂਦਾ ਹੈ।`);
      continue;
    }
    endpoint = addCoordinatePa(endpoint, cardinalVectorPa(facing, operation.distance));
    steps.push(`${metresPa(operation.distance)} ${directionPa(facing)} ਵੱਲ ਦੀ ਚਾਲ; ਹੁਣ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(endpoint)} ਹੈ।`);
  }
  return { steps, endpoint, finalFacing: facing };
}

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
    const sourceExplanation = asR(english.explanation);
    const directionKeys: Readonly<Record<string, string>> = {
      north: "NORTH", south: "SOUTH", east: "EAST", west: "WEST",
    };
    const steps: string[] = [];
    for (const line of (sourceExplanation.movementLines ?? []) as string[]) {
      const match = String(line).match(/(\d+(?:\.\d+)?) metres? (North|South|East|West)/i);
      if (!match) continue;
      steps.push(`${metresPa(match[1])} ${directionPa(directionKeys[match[2].toLowerCase()])} ਵੱਲ ਦੀ ਚਾਲ।`);
    }

    const points = asR(sourceExplanation.diagram)?.points ?? [];
    const endPoint = asR(points.find((point: R) => point.role === "END") ?? {});
    const coordinate = asR(endPoint.coordinate ?? {});
    if (endPoint.coordinate) {
      steps.push(`ਸਾਰੀਆਂ ਚਾਲਾਂ ਜੋੜਨ ਉੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(coordinate)} ਹੈ।`);
    }

    const horizontal = Math.abs(Number(coordinate.x ?? 0));
    const vertical = Math.abs(Number(coordinate.y ?? 0));
    if (["DIR-QL-006", "DIR-QL-007", "DIR-QL-010"].includes(qlId) && endPoint.coordinate) {
      steps.push(
        horizontal === 0 || vertical === 0
          ? `ਕੇਵਲ ਇੱਕ ਪਾਸੇ ਦਾ ਫ਼ਰਕ ਬਚਦਾ ਹੈ; ਇਸ ਤੋਂ ਸਿੱਧੀ ਦੂਰੀ ਅਤੇ ਉੱਤਰ ${answerSentence}`
          : `ਸਿੱਧੀ ਦੂਰੀ ਲਈ √(${horizontal}² + ${vertical}²) ਲਗਾਉਣ ਉੱਤੇ ਉੱਤਰ ${answerSentence}`,
      );
    } else if (qlId === "DIR-QL-008") {
      const total = (asR(sourceExplanation.diagram)?.segments ?? []).reduce(
        (sum: number, segment: R) => sum + Number(segment.distance ?? 0),
        0,
      );
      steps.push(`ਤੈਅ ਕੀਤੀ ਕੁੱਲ ਦੂਰੀ ${metresPa(total)} ਹੈ; ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਦੀ ਸਿੱਧੀ ਦੂਰੀ ਵੱਖਰੀ ਕੱਢੀ ਜਾਂਦੀ ਹੈ।`);
      steps.push(`ਦੋਵੇਂ ਮੁੱਲ ਇਕੱਠੇ ਕਰਨ ਉੱਤੇ ਸਹੀ ਉੱਤਰ ${answerSentence}`);
    } else if (qlId === "DIR-QL-009") {
      steps.push(`ਦਿੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਛੱਡੀ ਹੋਈ ਦੂਰੀ ${answerSentence}`);
    } else {
      steps.push(`ਅੰਤਿਮ ਬਿੰਦੂ ਦੀ ਸਥਿਤੀ ਤੋਂ ਸਹੀ ਉੱਤਰ ${answerSentence}`);
    }

    return {
      ...base,
      steps,
      resultLine: `ਦਿੱਤੀਆਂ ਚਾਲਾਂ ਦੀ ਗਿਣਤੀ ਤੋਂ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-036", "DIR-QL-037", "DIR-QL-038", "DIR-QL-039", "DIR-QL-040", "DIR-QL-041", "DIR-QL-042", "DIR-QL-043", "DIR-QL-044"].includes(qlId)) {
    if (qlId === "DIR-QL-036") {
      const steps = (s.visibleRelations ?? []).map((relation: R) => relationSentencePa(relation, true));
      steps.push(
        `ਇਨ੍ਹਾਂ ਸੰਬੰਧਾਂ ਤੋਂ ${namePa(s.missingTo)}, ${namePa(s.missingFrom)} ਤੋਂ ${metresPa(s.missingDistance)} ${answer} ਵੱਲ ਹੈ।`,
      );
      return { ...base, steps, resultLine: `ਇਸ ਲਈ ਛੱਡੀ ਹੋਈ ਦਿਸ਼ਾ ${answer} ਹੈ।` };
    }

    if (qlId === "DIR-QL-037") {
      const steps: string[] = [
        "ਪਹਿਲਾਂ ਮੁੱਖ ਸੰਬੰਧਾਂ ਤੋਂ ਪੱਕਾ ਨਕਸ਼ਾ ਬਣਾਓ:",
        ...(s.anchorRelations ?? []).map((relation: R) => relationSentencePa(relation, true)),
        "ਹੁਣ ਹਰ ਕਥਨ ਨੂੰ ਇਸੇ ਨਕਸ਼ੇ ਨਾਲ ਮਿਲਾਓ:",
      ];
      for (let index = 0; index < (s.relations ?? []).length; index += 1) {
        steps.push(`ਕਥਨ ${index + 1}: ${relationSentencePa(s.relations[index], true)}`);
      }
      steps.push(`ਜਿਹੜਾ ਕਥਨ ਬਾਕੀ ਸੰਬੰਧਾਂ ਨਾਲ ਨਹੀਂ ਮਿਲਦਾ, ਉਹ ${answerSentence}`);
      return { ...base, steps, resultLine: `ਗਲਤ ਕਥਨ ${answerSentence}` };
    }

    if (qlId === "DIR-QL-038") {
      const unknownIndex = Number(s.unknownIndex ?? 0);
      const unknown = asR((s.legs ?? [])[unknownIndex] ?? {});
      let knownEndpoint: R = { x: 0, y: 0 };
      const steps: string[] = [];
      for (let index = 0; index < (s.legs ?? []).length; index += 1) {
        const leg = asR(s.legs[index]);
        if (index === unknownIndex || leg.direction === "UNKNOWN") {
          steps.push(`ਚਾਲ ${index + 1}: ${metresPa(leg.distance)}, ਦਿਸ਼ਾ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।`);
          continue;
        }
        knownEndpoint = addCoordinatePa(knownEndpoint, cardinalVectorPa(leg.direction, leg.distance));
        steps.push(`ਚਾਲ ${index + 1}: ${metresPa(leg.distance)} ${directionPa(leg.direction)} ਵੱਲ; ਦਿੱਤੀਆਂ ਚਾਲਾਂ ਤੋਂ ਥਾਂ ${coordinateTextPa(knownEndpoint)} ਹੈ।`);
      }
      const required = cardinalVectorPa(s.answerDirection, unknown.distance);
      const restored = addCoordinatePa(knownEndpoint, required);
      steps.push(`ਦਿੱਤਾ ਅੰਤਿਮ ਬਿੰਦੂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(asR(s.target))} ਹੈ।`);
      steps.push(`ਬਾਕੀ ${metresPa(unknown.distance)} ਦੀ ਚਾਲ ${directionPa(s.answerDirection)} ਵੱਲ ਰੱਖਣ ਉੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ${coordinateTextPa(restored)} ਬਣਦਾ ਹੈ।`);
      return { ...base, steps, resultLine: `ਅਣਜਾਣ ਚਾਲ ਦੀ ਦਿਸ਼ਾ ${answer} ਹੈ।` };
    }

    if (qlId === "DIR-QL-039") {
      const firstDirection = String(s.initialFacing);
      const secondDirection = applyNamedTurnPa(firstDirection, s.answerTurn);
      const thirdDirection = applyNamedTurnPa(secondDirection, s.knownTurn);
      let endpoint: R = { x: 0, y: 0 };
      endpoint = addCoordinatePa(endpoint, cardinalVectorPa(firstDirection, s.firstDistance));
      const steps: string[] = [
        `ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(firstDirection)} ਵੱਲ ਹੈ; ਪਹਿਲੀ ਚਾਲ ${metresPa(s.firstDistance)} ${directionPa(firstDirection)} ਵੱਲ ਹੈ।`,
        `ਅਣਜਾਣ ਮੋੜ ${answer} ਲੈਣ ਉੱਤੇ ਅਗਲੀ ਦਿਸ਼ਾ ${directionPa(secondDirection)} ਬਣਦੀ ਹੈ; ਦੂਜੀ ਚਾਲ ${metresPa(s.secondDistance)} ਇਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ।`,
      ];
      endpoint = addCoordinatePa(endpoint, cardinalVectorPa(secondDirection, s.secondDistance));
      steps.push(`ਪਹਿਲੀਆਂ ਦੋ ਚਾਲਾਂ ਤੋਂ ਬਾਅਦ ਥਾਂ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਤੋਂ ${coordinateTextPa(endpoint)} ਹੈ।`);
      endpoint = addCoordinatePa(endpoint, cardinalVectorPa(thirdDirection, s.thirdDistance));
      steps.push(`${turnPa(s.knownTurn)} ਤੋਂ ਬਾਅਦ ਤੀਜੀ ਚਾਲ ${metresPa(s.thirdDistance)} ${directionPa(thirdDirection)} ਵੱਲ ਹੈ।`);
      steps.push(`ਇਸ ਨਾਲ ਅੰਤਿਮ ਬਿੰਦੂ ${coordinateTextPa(endpoint)} ਮਿਲਦਾ ਹੈ, ਜੋ ਦਿੱਤੇ ${coordinateTextPa(asR(s.target))} ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`);
      return { ...base, steps, resultLine: `ਅਣਜਾਣ ਮੋੜ ${answer} ਹੈ।` };
    }

    if (qlId === "DIR-QL-040") {
      const replay = replayAdvancedPa(s.answerFacing, (s.operations ?? []) as R[]);
      const steps = [
        `ਸਹੀ ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ${directionPa(s.answerFacing)} ਮੰਨ ਕੇ ਰਸਤਾ ਚਲਾਓ:`,
        ...replay.steps,
        `ਅੰਤਿਮ ਬਿੰਦੂ ${coordinateTextPa(replay.endpoint)} ਹੈ, ਜੋ ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੇ ${coordinateTextPa(asR(s.target))} ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਹੈ।`,
      ];
      return { ...base, steps, resultLine: `ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ${answer} ਹੈ।` };
    }

    if (qlId === "DIR-QL-041") {
      const steps: string[] = [
        ...(s.relations ?? []).map((relation: R) => relationSentencePa(relation, true)),
      ];
      for (const movement of (s.movements ?? []) as R[]) {
        steps.push(`${namePa(s.startEntity)} ਤੋਂ ${metresPa(movement.distance)} ${directionPa(movement.direction)} ਵੱਲ ਚੱਲਣ ਉੱਤੇ ਅੰਤਿਮ ਬਿੰਦੂ ਮੁੱਖ ਆਧਾਰ ਤੋਂ ${coordinateTextPa(asR(s.endpoint))} ਹੈ।`);
      }
      const referenceRelation = ((s.relations ?? []) as R[]).find((relation: R) => relation.toEntity === s.referenceEntity);
      const reference = referenceRelation ? asR(referenceRelation.vector) : { x: 0, y: 0 };
      const endpoint = asR(s.endpoint);
      const dx = Number(endpoint.x ?? 0) - Number(reference.x ?? 0);
      const dy = Number(endpoint.y ?? 0) - Number(reference.y ?? 0);
      const horizontal = Math.abs(dx), vertical = Math.abs(dy);
      steps.push(`${namePa(s.referenceEntity)} ਤੋਂ ਅੰਤਿਮ ਬਿੰਦੂ ਤੱਕ ਫ਼ਰਕ ${coordinateTextPa({ x: dx, y: dy })} ਹੈ।`);
      steps.push(
        horizontal === 0 || vertical === 0
          ? `ਸਿੱਧੀ ਦੂਰੀ ${metresPa(s.answerDistance)} ਹੈ।`
          : `ਸਿੱਧੀ ਦੂਰੀ = √(${horizontal}² + ${vertical}²) = ${metresPa(s.answerDistance)}।`,
      );
      steps.push(`ਇਸ ਲਈ ਦਿਸ਼ਾ ਅਤੇ ਦੂਰੀ ਦਾ ਸਹੀ ਜੋੜ ${answerSentence}`);
      return { ...base, steps, resultLine: `ਅੰਤਿਮ ਸੰਬੰਧ ${answerSentence}` };
    }

    if (qlId === "DIR-QL-042" || qlId === "DIR-QL-043") {
      const replay = replayAdvancedPa(s.initialFacing, (s.operations ?? []) as R[]);
      const steps: string[] = [
        `ਚੌਕੀ ${String(s.checkpoint)} ਤੋਂ ਸ਼ੁਰੂ ਵਿੱਚ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ।`,
        ...replay.steps,
        `ਅੰਤਿਮ ਬਿੰਦੂ ਚੌਕੀ ਤੋਂ ${coordinateTextPa(asR(s.endpoint))} ਹੈ।`,
      ];
      if (qlId === "DIR-QL-043") {
        const endpoint = asR(s.endpoint);
        const horizontal = Math.abs(Number(endpoint.x ?? 0));
        const vertical = Math.abs(Number(endpoint.y ?? 0));
        steps.push(
          horizontal === 0 || vertical === 0
            ? `ਸਿੱਧੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ${metresPa(s.answerDistance)} ਹੈ।`
            : `ਸਿੱਧੀ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ = √(${horizontal}² + ${vertical}²) = ${metresPa(s.answerDistance)}।`,
        );
      } else {
        steps.push(`ਅੰਤਿਮ ਬਿੰਦੂ ਦੀ ਚੌਕੀ ਤੋਂ ਦਿਸ਼ਾ ${answer} ਹੈ; ਅੰਤ ਵਿੱਚ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਵੱਖਰੀ ਜਾਣਕਾਰੀ ਹੈ।`);
      }
      return {
        ...base,
        steps,
        resultLine: qlId === "DIR-QL-043"
          ? `ਚੌਕੀ ਤੋਂ ਸਭ ਤੋਂ ਘੱਟ ਦੂਰੀ ${answerSentence}`
          : `ਚੌਕੀ ਤੋਂ ਲੋੜੀਂਦੀ ਦਿਸ਼ਾ ${answerSentence}`,
      };
    }

    const hybridSteps: string[] = [
      "ਪਹਿਲਾਂ ਦਿੱਤੇ ਸੰਬੰਧ:",
      ...(s.diagramRelations ?? []).map((relation: R) => relationSentencePa(relation, true)),
      "ਵਾਧੂ ਸੰਬੰਧ:",
      relationSentencePa(asR(s.textRelation), true),
    ];
    let combined: R = { x: 0, y: 0 };
    for (const relation of [...((s.diagramRelations ?? []) as R[]), asR(s.textRelation)]) {
      combined = addCoordinatePa(combined, asR(relation.vector));
    }
    hybridSteps.push(`${namePa(s.queryFrom)} ਤੋਂ ${namePa(s.queryTo)} ਤੱਕ ਕੁੱਲ ਫ਼ਰਕ ${coordinateTextPa(combined)} ਹੈ।`);
    hybridSteps.push(`ਇਸ ਲਈ ਪੁੱਛੀ ਦਿਸ਼ਾ ${answerSentence}`);
    return {
      ...base,
      steps: hybridSteps,
      resultLine: `ਸਾਰੇ ਸੰਬੰਧ ਜੋੜਨ ਉੱਤੇ ਉੱਤਰ ${answerSentence}`,
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
    const map = asR(s.codeMap ?? s.recoveredCodeMap ?? {});
    const steps: string[] = Object.keys(map).length > 0
      ? codeMapTextPa(map, qlId === "DIR-QL-029").split(", ").map((line) => `${line}।`)
      : [];

    if (qlId === "DIR-QL-025") {
      for (const evidence of (s.evidence ?? []) as R[]) {
        steps.push(`${evidenceChainPa(evidence)} ਤੋਂ ${directionPa(evidence.resultDirection)} ਦਿਸ਼ਾ ਮਿਲਦੀ ਹੈ।`);
      }
      steps.push(`ਸਾਰੇ ਸਬੂਤਾਂ ਨਾਲ ਇੱਕੋ ਚਿੰਨ੍ਹ-ਨਕਸ਼ਾ ਬਣਦਾ ਹੈ; ਪੁੱਛੀ ਦਿਸ਼ਾ ਦਾ ਚਿੰਨ੍ਹ ${answerSentence}`);
    } else if (qlId === "DIR-QL-026") {
      const target = asR(s.targetRelation);
      steps.push(`${namePa(target.subject)}, ${namePa(target.reference)} ਤੋਂ ${directionPa(target.direction)} ਵੱਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`);
      steps.push(`ਇਸ ਦਿਸ਼ਾ ਲਈ ਸਹੀ ਚਿੰਨ੍ਹ ਰੱਖਣ ਉੱਤੇ ਕਥਨ ${answerSentence}`);
    } else if (qlId === "DIR-QL-028") {
      const target = asR(s.targetRelation);
      steps.push(`ਅਧੂਰੀ ਲੜੀ: ${codedChainPa((s.relations ?? []) as R[], Number(s.hiddenIndex ?? -1))}।`);
      steps.push(`${namePa(target.subject)}, ${namePa(target.reference)} ਤੋਂ ${directionPa(target.direction)} ਵੱਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।`);
      steps.push(`ਇਹ ਸ਼ਰਤ ਸਿਰਫ਼ ${answer} ਚਿੰਨ੍ਹ ਨਾਲ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।`);
    } else if (qlId === "DIR-QL-029") {
      for (const movement of (s.steps ?? []) as R[]) {
        const direction = map[movement.symbol];
        steps.push(`${movement.symbol} ਦਾ ਅਰਥ ${directionPa(direction)} ਵੱਲ ਚੱਲਣਾ ਹੈ; ਇਸ ਲਈ ${metresPa(movement.distance)} ${directionPa(direction)} ਵੱਲ ਦੀ ਚਾਲ।`);
      }
      steps.push(`ਸਾਰੀਆਂ ਚਾਲਾਂ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਬਿੰਦੂ O ਤੋਂ ${coordinateTextPa(asR(s.endpoint))} ਹੈ; ਇਸ ਲਈ ਦਿਸ਼ਾ ${answerSentence}`);
    } else {
      for (const relation of (s.relations ?? []) as R[]) {
        steps.push(
          `${namePa(relation.subject)} ${relation.symbol} ${namePa(relation.reference)} ਦਾ ਅਰਥ ਹੈ: ${namePa(relation.subject)}, ${namePa(relation.reference)} ਤੋਂ ${directionPa(map[relation.symbol])} ਵੱਲ ਹੈ।`,
        );
      }
      if (qlId === "DIR-QL-024") {
        const query = asR(s.query);
        steps.push(`${namePa(query.reference)} ਤੋਂ ${directionPa(query.direction)} ਵੱਲ ਸਿਰਫ਼ ${answerSentence}`);
      } else if (qlId === "DIR-QL-027") {
        steps.push(`ਖੋਲ੍ਹੇ ਹੋਏ ਦਿਸ਼ਾ-ਸੰਬੰਧਾਂ ਤੋਂ ਸਹੀ ਨਤੀਜਾ ${answerSentence}`);
      } else {
        steps.push(`ਪੂਰੀ ਸੰਬੰਧ-ਲੜੀ ਜੋੜਨ ਉੱਤੇ ਦਿਸ਼ਾ ${answerSentence}`);
      }
    }
    return {
      ...base,
      steps,
      resultLine: `ਚਿੰਨ੍ਹਾਂ ਨਾਲ ਦਿੱਤੇ ਤੱਥਾਂ ਤੋਂ ਸਹੀ ਉੱਤਰ ${answerSentence}`,
    };
  }

  if (["DIR-QL-030", "DIR-QL-031", "DIR-QL-032", "DIR-QL-033", "DIR-QL-034", "DIR-QL-035"].includes(qlId)) {
    const sunDirection = s.period === "EVENING" ? "WEST" : "EAST";
    const shadowDirection = s.period === "EVENING" ? "EAST" : "WEST";
    const steps: string[] = [
      `${periodPa(s.period)} ਵਿੱਚ ਸੂਰਜ ${directionPa(sunDirection)} ਵੱਲ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਪਰਛਾਂਵਾਂ ${directionPa(shadowDirection)} ਵੱਲ ਪੈਂਦੀ ਹੈ।`,
    ];

    if (qlId === "DIR-QL-030") {
      steps.push(`ਇਸੇ ਨਿਯਮ ਤੋਂ ਪੁੱਛੀ ਦਿਸ਼ਾ ${answerSentence}`);
    } else if (qlId === "DIR-QL-031") {
      steps.push(`${namePa(s.name)} ਦੀ ਪਰਛਾਂਵਾਂ ${sidePa(s.side)} ਹੈ; ਇਸ ਹਾਲਤ ਵਿੱਚ ਉਸ ਦਾ ਮੂੰਹ ${answer} ਵੱਲ ਹੈ।`);
    } else if (qlId === "DIR-QL-032") {
      steps.push(`${namePa(s.name)} ਦਾ ਮੂੰਹ ${directionPa(s.facing)} ਵੱਲ ਹੈ ਅਤੇ ਪਰਛਾਂਵਾਂ ${directionPa(shadowDirection)} ਵੱਲ ਪੈਂਦੀ ਹੈ।`);
      steps.push(`ਇਸ ਲਈ ਵਿਅਕਤੀ ਦੇ ਹਿਸਾਬ ਨਾਲ ਪਰਛਾਂਵਾਂ ${answerSentence}`);
    } else if (qlId === "DIR-QL-033") {
      steps.push(`${namePa(s.name)} ਦਾ ਮੂੰਹ ${directionPa(s.facing)} ਵੱਲ ਹੈ ਅਤੇ ਪਰਛਾਂਵਾਂ ${sidePa(s.side)} ਹੈ।`);
      steps.push(`ਇਹ ਸੰਬੰਧ ${answer} ਵੇਲੇ ਹੀ ਬਣਦਾ ਹੈ।`);
    } else if (qlId === "DIR-QL-034") {
      steps.push(`ਪਰਛਾਂਵਾਂ ${sidePa(s.side)} ਹੋਣ ਕਰਕੇ ${namePa(s.name)} ਦਾ ਸ਼ੁਰੂਆਤੀ ਮੂੰਹ ${directionPa(s.initialFacing)} ਵੱਲ ਹੈ।`);
      for (const turn of (s.turns ?? []) as string[]) {
        steps.push(`${turnPa(turn)} ਲਗਾਉਣ ਤੋਂ ਬਾਅਦ ਅਗਲੀ ਦਿਸ਼ਾ ਤੈਅ ਹੁੰਦੀ ਹੈ।`);
      }
      steps.push(`ਸਾਰੇ ਮੋੜਾਂ ਤੋਂ ਬਾਅਦ ਅੰਤਿਮ ਮੂੰਹ ${answer} ਵੱਲ ਹੈ।`);
    } else {
      steps.push(`ਪਰਛਾਂਵਾਂ ${sidePa(s.side)} ਹੋਣ ਕਰਕੇ ${namePa(s.firstName)} ਦਾ ਮੂੰਹ ${directionPa(s.firstFacing)} ਵੱਲ ਹੈ।`);
      steps.push(
        s.relation === "SAME_DIRECTION"
          ? `${namePa(s.secondName)} ਵੀ ਉਸੇ ਦਿਸ਼ਾ ਵੱਲ ਹੈ, ਇਸ ਲਈ ਉਸ ਦਾ ਮੂੰਹ ${answer} ਵੱਲ ਹੈ।`
          : `${namePa(s.secondName)} ਉਲਟੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ, ਇਸ ਲਈ ਉਸ ਦਾ ਮੂੰਹ ${answer} ਵੱਲ ਹੈ।`,
      );
    }
    return {
      ...base,
      steps,
      resultLine: `ਦਿੱਤੇ ਸੂਰਜ-ਪਰਛਾਂਵਾਂ ਸੰਬੰਧ ਤੋਂ ਸਹੀ ਉੱਤਰ ${answerSentence}`,
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
