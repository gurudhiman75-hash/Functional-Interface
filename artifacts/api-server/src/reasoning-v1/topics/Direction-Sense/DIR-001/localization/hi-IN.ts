import { generateDirectionQuestion } from "../chapter-registry";
import {
  asR,
  codeMapText,
  codedChain,
  coordinateText,
  directionAngleHi,
  directionFromAngleHi,
  directionHi,
  evidenceChain,
  metres,
  nameHi,
  pathMovementLineHi,
  pathSummaryLineHi,
  periodHi,
  relationSentence,
  reverseTurnCalculationStepsHi,
  sideHi,
  turnCalculationStepsHi,
  turnHi,
  type R,
} from "./hindi-foundation";
import { localizeDiagramHindi, optionLabelHindi } from "./hindi-editorial-overrides";
import { renderHindiStem } from "./hindi-stems";
import type { LocalizedDirectionExplanation, LocalizedDirectionOption, LocalizedDirectionQuestion } from "./types";

function cardinalVectorHi(direction: unknown, distance: unknown): R {
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

function addCoordinateHi(left: R, right: R): R {
  return { x: Number(left.x ?? 0) + Number(right.x ?? 0), y: Number(left.y ?? 0) + Number(right.y ?? 0) };
}

function applyNamedTurnHi(facing: unknown, turn: unknown): string {
  const offset = String(turn) === "LEFT" ? -90
    : String(turn) === "RIGHT" ? 90
      : String(turn) === "ABOUT" ? 180
        : 0;
  return directionFromAngleHi(directionAngleHi(facing) + offset);
}

function replayAdvancedHi(initialFacing: unknown, operations: readonly R[]): { readonly steps: string[]; readonly endpoint: R; readonly finalFacing: string } {
  let facing = String(initialFacing);
  let endpoint: R = { x: 0, y: 0 };
  const steps: string[] = [];
  for (const operation of operations) {
    if (operation.kind === "TURN") {
      const before = facing;
      facing = applyNamedTurnHi(facing, operation.turn);
      steps.push(`${turnHi(operation.turn)}: मुख ${directionHi(before)} से ${directionHi(facing)} हो जाता है।`);
      continue;
    }
    endpoint = addCoordinateHi(endpoint, cardinalVectorHi(facing, operation.distance));
    steps.push(`${metres(operation.distance)} ${directionHi(facing)} की ओर चलें; अब स्थान आरंभ से ${coordinateText(endpoint)} है।`);
  }
  return { steps, endpoint, finalFacing: facing };
}

function renderExplanation(english: R): LocalizedDirectionExplanation {
  const qlId = String(english.qlId);
  const s = asR(english.structuredPrompt);
  const answer = optionLabelHindi(asR(english.options?.[english.correctIndex] ?? {}));
  const diagram = localizeDiagramHindi(asR(english.explanation)?.diagram);
  const stem = renderHindiStem(english);
  const context = stem.replace(/[^।?]*\?$/, "").trim() || stem;
  const base: LocalizedDirectionExplanation = {
    given: `दिया गया विवरण: ${context}`,
    steps: ["हर चाल या संबंध को एक ही स्थिर दिशा-फ्रेम में रखें।", "फिर पूछे गए दो बिंदुओं या अवस्थाओं की तुलना करें।"],
    resultLine: `गणना से परिणाम ${answer} मिलता है।`,
    conclusion: /है[।.]?$/.test(answer) ? `अतः सही निष्कर्ष: ${answer}` : `अतः सही उत्तर ${answer} है।`,
    ...(diagram ? { diagram } : {}),
  };
  if (qlId === "DIR-QL-001") {
    return {
      ...base,
      steps: turnCalculationStepsHi(s.initialFacing, s.turns ?? []),
      resultLine: `सभी मोड़ लगाने के बाद मुख ${answer} की ओर है।`,
    };
  }
  if (qlId === "DIR-QL-002") {
    return {
      ...base,
      steps: reverseTurnCalculationStepsHi(s.finalFacing, s.turns ?? []),
      resultLine: `मोड़ों को उलटे क्रम में वापस लेने पर आरंभिक दिशा ${answer} मिलती है।`,
    };
  }
  if (qlId === "DIR-QL-003") {
    const initialAngle = directionAngleHi(s.initialFacing);
    const finalAngle = directionAngleHi(s.finalFacing);
    return {
      ...base,
      steps: [
        `आरंभिक दिशा ${directionHi(s.initialFacing)} है, अर्थात ${initialAngle}°।`,
        `अंतिम दिशा ${directionHi(s.finalFacing)} है, अर्थात ${finalAngle}°।`,
        `इन दोनों दिशाओं के बीच आवश्यक परिवर्तन ${answer} है।`,
      ],
      resultLine: `इसलिए लिया गया मोड़ ${answer} है।`,
    };
  }
  if (["DIR-QL-004", "DIR-QL-005", "DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"].includes(qlId)) {
    const sourceExplanation = asR(english.explanation);
    const movementLines = (sourceExplanation.movementLines ?? []).map((line: string) => pathMovementLineHi(String(line)));
    const points = asR(sourceExplanation.diagram)?.points ?? [];
    const endPoint = asR(points.find((point: R) => point.role === "END") ?? {}).coordinate;
    const steps: string[] = [...movementLines];
    if (endPoint) {
      steps.push(`सभी चालें जोड़ने पर अंतिम बिंदु आरंभ से ${coordinateText(asR(endPoint))} है।`);
    }
    if (sourceExplanation.netLine) steps.push(pathSummaryLineHi(String(sourceExplanation.netLine)));
    if (sourceExplanation.calculationLine) steps.push(pathSummaryLineHi(String(sourceExplanation.calculationLine)));
    if (qlId === "DIR-QL-008") {
      const total = (asR(sourceExplanation.diagram)?.segments ?? []).reduce(
        (sum: number, segment: R) => sum + Number(segment.distance ?? 0),
        0,
      );
      steps.push(`कुल चली दूरी = ${total} मीटर; सीधी न्यूनतम दूरी अंतिम विस्थापन से अलग मिलती है।`);
    }
    return {
      ...base,
      steps,
      resultLine: `इस मार्ग से सही परिणाम ${answer} है।`,
    };
  }
  if (["DIR-QL-036", "DIR-QL-037", "DIR-QL-038", "DIR-QL-039", "DIR-QL-040", "DIR-QL-041", "DIR-QL-042", "DIR-QL-043", "DIR-QL-044"].includes(qlId)) {
    if (qlId === "DIR-QL-036") {
      const steps = (s.visibleRelations ?? []).map((relation: R) => relationSentence(relation, true));
      steps.push(
        `इन संबंधों से ${nameHi(s.missingTo)}, ${nameHi(s.missingFrom)} से ${metres(s.missingDistance)} ${answer} में स्थित है।`,
      );
      return { ...base, steps, resultLine: `इसलिए छूटी हुई दिशा ${answer} है।` };
    }

    if (qlId === "DIR-QL-037") {
      const steps: string[] = [
        "पहले आधार संबंधों से निश्चित विन्यास बनाएं:",
        ...(s.anchorRelations ?? []).map((relation: R) => relationSentence(relation, true)),
        "अब प्रत्येक कथन को इसी विन्यास से मिलाएं:",
      ];
      for (let index = 0; index < (s.relations ?? []).length; index += 1) {
        steps.push(`कथन ${index + 1}: ${relationSentence(s.relations[index], true)}`);
      }
      steps.push(`जो कथन बाकी संबंधों से मेल नहीं खाता, वह ${answer} है।`);
      return { ...base, steps, resultLine: `असंगत कथन ${answer} है।` };
    }

    if (qlId === "DIR-QL-038") {
      const unknownIndex = Number(s.unknownIndex ?? 0);
      const unknown = asR((s.legs ?? [])[unknownIndex] ?? {});
      let knownEndpoint: R = { x: 0, y: 0 };
      const steps: string[] = [];
      for (let index = 0; index < (s.legs ?? []).length; index += 1) {
        const leg = asR(s.legs[index]);
        if (index === unknownIndex || leg.direction === "UNKNOWN") {
          steps.push(`चाल ${index + 1}: ${metres(leg.distance)}, दिशा ज्ञात नहीं है।`);
          continue;
        }
        knownEndpoint = addCoordinateHi(knownEndpoint, cardinalVectorHi(leg.direction, leg.distance));
        steps.push(`चाल ${index + 1}: ${metres(leg.distance)} ${directionHi(leg.direction)} की ओर; ज्ञात चालों का स्थान ${coordinateText(knownEndpoint)}।`);
      }
      const required = cardinalVectorHi(s.answerDirection, unknown.distance);
      const restored = addCoordinateHi(knownEndpoint, required);
      steps.push(`दिया गया अंतिम स्थान आरंभ से ${coordinateText(asR(s.target))} है।`);
      steps.push(`बाकी ${metres(unknown.distance)} की चाल ${directionHi(s.answerDirection)} की ओर रखने पर अंतिम स्थान ${coordinateText(restored)} बनता है।`);
      return { ...base, steps, resultLine: `अज्ञात चाल की दिशा ${answer} है।` };
    }

    if (qlId === "DIR-QL-039") {
      const firstDirection = String(s.initialFacing);
      const secondDirection = applyNamedTurnHi(firstDirection, s.answerTurn);
      const thirdDirection = applyNamedTurnHi(secondDirection, s.knownTurn);
      let endpoint: R = { x: 0, y: 0 };
      endpoint = addCoordinateHi(endpoint, cardinalVectorHi(firstDirection, s.firstDistance));
      const steps: string[] = [
        `आरंभिक मुख ${directionHi(firstDirection)} है; पहली चाल ${metres(s.firstDistance)} ${directionHi(firstDirection)} की ओर जाती है।`,
        `अज्ञात मोड़ ${answer} लेने पर अगली दिशा ${directionHi(secondDirection)} बनती है; दूसरी चाल ${metres(s.secondDistance)} इसी दिशा में है।`,
      ];
      endpoint = addCoordinateHi(endpoint, cardinalVectorHi(secondDirection, s.secondDistance));
      steps.push(`पहली दो चालों के बाद स्थान आरंभ से ${coordinateText(endpoint)} है।`);
      endpoint = addCoordinateHi(endpoint, cardinalVectorHi(thirdDirection, s.thirdDistance));
      steps.push(`${turnHi(s.knownTurn)} के बाद तीसरी चाल ${metres(s.thirdDistance)} ${directionHi(thirdDirection)} की ओर जाती है।`);
      steps.push(`इससे अंतिम स्थान ${coordinateText(endpoint)} मिलता है, जो दिए गए ${coordinateText(asR(s.target))} से मेल खाता है।`);
      return { ...base, steps, resultLine: `अज्ञात मोड़ ${answer} है।` };
    }

    if (qlId === "DIR-QL-040") {
      const replay = replayAdvancedHi(s.answerFacing, (s.operations ?? []) as R[]);
      const steps = [
        `सही आरंभिक मुख ${directionHi(s.answerFacing)} मानकर मार्ग चलाते हैं:`,
        ...replay.steps,
        `अंतिम स्थान ${coordinateText(replay.endpoint)} है, जो प्रश्न में दिए ${coordinateText(asR(s.target))} से मेल खाता है।`,
      ];
      return { ...base, steps, resultLine: `आरंभिक मुख-दिशा ${answer} है।` };
    }

    if (qlId === "DIR-QL-041") {
      const steps: string[] = [
        ...(s.relations ?? []).map((relation: R) => relationSentence(relation, true)),
      ];
      for (const movement of (s.movements ?? []) as R[]) {
        steps.push(`${nameHi(s.startEntity)} से ${metres(movement.distance)} ${directionHi(movement.direction)} की ओर चलने पर अंतिम बिंदु आरंभिक आधार से ${coordinateText(asR(s.endpoint))} है।`);
      }
      const referenceRelation = ((s.relations ?? []) as R[]).find((relation: R) => relation.toEntity === s.referenceEntity);
      const reference = referenceRelation ? asR(referenceRelation.vector) : { x: 0, y: 0 };
      const endpoint = asR(s.endpoint);
      const dx = Number(endpoint.x ?? 0) - Number(reference.x ?? 0);
      const dy = Number(endpoint.y ?? 0) - Number(reference.y ?? 0);
      const horizontal = Math.abs(dx), vertical = Math.abs(dy);
      steps.push(`${nameHi(s.referenceEntity)} से अंतिम बिंदु तक अंतर ${coordinateText({ x: dx, y: dy })} है।`);
      steps.push(
        horizontal === 0 || vertical === 0
          ? `सीधी दूरी ${metres(s.answerDistance)} है।`
          : `सीधी दूरी = √(${horizontal}² + ${vertical}²) = ${metres(s.answerDistance)}।`,
      );
      steps.push(`इसलिए दिशा और दूरी का सही युग्म ${answer} है।`);
      return { ...base, steps, resultLine: `अंतिम संबंध ${answer} है।` };
    }

    if (qlId === "DIR-QL-042" || qlId === "DIR-QL-043") {
      const replay = replayAdvancedHi(s.initialFacing, (s.operations ?? []) as R[]);
      const steps: string[] = [
        `चौकी ${String(s.checkpoint)} से आरंभिक मुख ${directionHi(s.initialFacing)} है।`,
        ...replay.steps,
        `अंतिम बिंदु चौकी से ${coordinateText(asR(s.endpoint))} है।`,
      ];
      if (qlId === "DIR-QL-043") {
        const endpoint = asR(s.endpoint);
        const horizontal = Math.abs(Number(endpoint.x ?? 0));
        const vertical = Math.abs(Number(endpoint.y ?? 0));
        steps.push(
          horizontal === 0 || vertical === 0
            ? `सीधी न्यूनतम दूरी ${metres(s.answerDistance)} है।`
            : `सीधी न्यूनतम दूरी = √(${horizontal}² + ${vertical}²) = ${metres(s.answerDistance)}।`,
        );
      } else {
        steps.push(`अंतिम बिंदु की चौकी से दिशा ${answer} है; अंतिम मुख-दिशा अलग तथ्य है।`);
      }
      return {
        ...base,
        steps,
        resultLine: qlId === "DIR-QL-043"
          ? `चौकी से न्यूनतम दूरी ${answer} है।`
          : `चौकी से आवश्यक दिशा ${answer} है।`,
      };
    }

    const hybridSteps: string[] = [
      "चित्र में दिए संबंध:",
      ...(s.diagramRelations ?? []).map((relation: R) => relationSentence(relation, true)),
      "लिखित संबंध:",
      relationSentence(asR(s.textRelation), true),
    ];
    let combined: R = { x: 0, y: 0 };
    for (const relation of [...((s.diagramRelations ?? []) as R[]), asR(s.textRelation)]) {
      combined = addCoordinateHi(combined, asR(relation.vector));
    }
    hybridSteps.push(`${nameHi(s.queryFrom)} से ${nameHi(s.queryTo)} तक कुल अंतर ${coordinateText(combined)} है।`);
    hybridSteps.push(`इसलिए पूछी गई दिशा ${answer} है।`);
    return {
      ...base,
      steps: hybridSteps,
      resultLine: `चित्र और लिखित संबंध दोनों से उत्तर ${answer} है।`,
    };
  }

  if (["DIR-QL-011", "DIR-QL-012", "DIR-QL-013", "DIR-QL-014", "DIR-QL-015"].includes(qlId)) {
    const relations = (s.relations ?? []).map((relation: R) => relationSentence(relation, true));
    const steps: string[] = ["दिए गए संबंधों को एक ही मानचित्र पर रखें:", ...relations];
    if (qlId === "DIR-QL-012") {
      const query = asR(s.query);
      const coordinates = asR(s.coordinates);
      const subject = asR(coordinates[query.subject]);
      const reference = asR(coordinates[query.reference]);
      const dx = Number(subject.x ?? 0) - Number(reference.x ?? 0);
      const dy = Number(subject.y ?? 0) - Number(reference.y ?? 0);
      const horizontal = Math.abs(dx), vertical = Math.abs(dy);
      steps.push(`${nameHi(query.reference)} से ${nameHi(query.subject)} तक अंतर: ${coordinateText({ x: dx, y: dy })}।`);
      const distance = Number(asR(english.correctAnswer).distance ?? 0);
      steps.push(
        horizontal === 0 || vertical === 0
          ? `एक ही दिशा में अंतर बचता है, इसलिए सीधी दूरी ${metres(distance)} है।`
          : `सीधी दूरी = √(${horizontal}² + ${vertical}²) = ${metres(distance)}।`,
      );
    } else {
      steps.push(`पूरे विन्यास से पूछी गई स्थिति/संबंध ${answer} मिलता है।`);
    }
    return { ...base, steps, resultLine: `विन्यास से सही उत्तर ${answer} है।` };
  }
  if (["DIR-QL-016", "DIR-QL-017", "DIR-QL-018", "DIR-QL-019", "DIR-QL-020", "DIR-QL-021", "DIR-QL-022"].includes(qlId)) {
    const paths = (s.paths ?? []) as R[];
    const referenceLabel = english.metadata?.sameOrigin ? "O" : "P";
    const steps: string[] = [];
    for (const path of paths) {
      const movements = (path.steps ?? []).map(
        (step: R) => `${metres(step.distance)} ${directionHi(step.direction)} की ओर`,
      ).join(" → ");
      steps.push(`${nameHi(path.name)}: ${movements}।`);
      steps.push(`${nameHi(path.name)} का अंतिम स्थान बिंदु ${referenceLabel} से ${coordinateText(asR(path.endpoint))} है।`);
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
        steps.push(`${nameHi(referenceName)} के अंतिम स्थान से ${nameHi(subjectName)} के अंतिम स्थान तक अंतर: ${coordinateText({ x: dx, y: dy })}।`);
        if (qlId !== "DIR-QL-016") {
          const distance = Number(asR(english.correctAnswer).distance ?? 0);
          const horizontal = Math.abs(dx), vertical = Math.abs(dy);
          steps.push(
            horizontal === 0 || vertical === 0
              ? `अंतिम स्थानों की सीधी दूरी ${metres(distance)} है।`
              : `सीधी दूरी = √(${horizontal}² + ${vertical}²) = ${metres(distance)}।`,
          );
        }
      }
    } else if (qlId === "DIR-QL-021") {
      for (const path of paths) {
        const distance = Math.round(Math.hypot(Number(path.endpoint.x), Number(path.endpoint.y)));
        steps.push(`${nameHi(path.name)} की बिंदु O से दूरी = ${metres(distance)}।`);
      }
    } else {
      steps.push(`इन अंतिम स्थानों की तुलना करने पर सही विकल्प ${answer} है।`);
    }
    return { ...base, steps, resultLine: `अंतिम स्थानों की तुलना से उत्तर ${answer} है।` };
  }
  if (["DIR-QL-023", "DIR-QL-024", "DIR-QL-025", "DIR-QL-026", "DIR-QL-027", "DIR-QL-028", "DIR-QL-029"].includes(qlId)) {
    const map = asR(s.codeMap ?? s.recoveredCodeMap ?? {});
    const steps: string[] = Object.keys(map).length > 0
      ? codeMapText(map, qlId === "DIR-QL-029").split(", ").map((line) => `${line}।`)
      : [];

    if (qlId === "DIR-QL-025") {
      for (const evidence of (s.evidence ?? []) as R[]) {
        steps.push(`${evidenceChain(evidence)} से ${directionHi(evidence.resultDirection)} दिशा मिलती है।`);
      }
      steps.push(`सभी प्रमाणों से एक ही संकेत-मानचित्र बनता है; पूछी गई दिशा का चिह्न ${answer} है।`);
    } else if (qlId === "DIR-QL-026") {
      const target = asR(s.targetRelation);
      steps.push(`${nameHi(target.subject)}, ${nameHi(target.reference)} के ${directionHi(target.direction)} में होना चाहिए।`);
      steps.push(`इस दिशा के लिए सही चिह्न रखने पर कथन ${answer} बनता है।`);
    } else if (qlId === "DIR-QL-028") {
      const target = asR(s.targetRelation);
      steps.push(`अधूरी श्रृंखला: ${codedChain((s.relations ?? []) as R[], Number(s.hiddenIndex ?? -1))}।`);
      steps.push(`${nameHi(target.subject)}, ${nameHi(target.reference)} के ${directionHi(target.direction)} में होना चाहिए।`);
      steps.push(`इस शर्त को केवल ${answer} पूरा करता है।`);
    } else if (qlId === "DIR-QL-029") {
      for (const movement of (s.steps ?? []) as R[]) {
        const direction = map[movement.symbol];
        steps.push(`${movement.symbol} का अर्थ ${directionHi(direction)} की ओर चलना है; इसलिए ${metres(movement.distance)} ${directionHi(direction)} की ओर चलें।`);
      }
      steps.push(`सभी चालों के बाद अंतिम बिंदु O से ${coordinateText(asR(s.endpoint))} है; इसलिए दिशा ${answer} है।`);
    } else {
      for (const relation of (s.relations ?? []) as R[]) {
        steps.push(
          `${nameHi(relation.subject)} ${relation.symbol} ${nameHi(relation.reference)} का अर्थ है: ${nameHi(relation.subject)}, ${nameHi(relation.reference)} के ${directionHi(map[relation.symbol])} में है।`,
        );
      }
      if (qlId === "DIR-QL-024") {
        const query = asR(s.query);
        steps.push(`${nameHi(query.reference)} से ${directionHi(query.direction)} में केवल ${answer} है।`);
      } else if (qlId === "DIR-QL-027") {
        steps.push(`डिकोड किए गए संबंधों से सही निष्कर्ष ${answer} है।`);
      } else {
        steps.push(`पूरी संबंध-श्रृंखला जोड़ने पर दिशा ${answer} मिलती है।`);
      }
    }
    return { ...base, steps, resultLine: `डिकोड किए गए तथ्यों से सही उत्तर ${answer} है।` };
  }
  if (["DIR-QL-030", "DIR-QL-031", "DIR-QL-032", "DIR-QL-033", "DIR-QL-034", "DIR-QL-035"].includes(qlId)) {
    const sunDirection = s.period === "EVENING" ? "WEST" : "EAST";
    const shadowDirection = s.period === "EVENING" ? "EAST" : "WEST";
    const steps: string[] = [
      `${periodHi(s.period)} में सूर्य ${directionHi(sunDirection)} में होता है, इसलिए छाया ${directionHi(shadowDirection)} में पड़ती है।`,
    ];

    if (qlId === "DIR-QL-030") {
      steps.push(`इसी नियम से पूछी गई दिशा ${answer} है।`);
    } else if (qlId === "DIR-QL-031") {
      steps.push(`${nameHi(s.name)} की छाया ${sideHi(s.side)} है; इस स्थिति में उसका मुख ${answer} की ओर होगा।`);
    } else if (qlId === "DIR-QL-032") {
      steps.push(`${nameHi(s.name)} का मुख ${directionHi(s.facing)} की ओर है और छाया ${directionHi(shadowDirection)} में पड़ती है।`);
      steps.push(`इसलिए व्यक्ति के सापेक्ष छाया ${answer} है।`);
    } else if (qlId === "DIR-QL-033") {
      steps.push(`${nameHi(s.name)} का मुख ${directionHi(s.facing)} की ओर है और छाया ${sideHi(s.side)} है।`);
      steps.push(`यह संबंध ${answer} के समय ही बनता है।`);
    } else if (qlId === "DIR-QL-034") {
      steps.push(`छाया ${sideHi(s.side)} होने से ${nameHi(s.name)} का आरंभिक मुख ${directionHi(s.initialFacing)} की ओर है।`);
      for (const turn of (s.turns ?? []) as string[]) {
        steps.push(`${turnHi(turn)} लगाने पर अगली मुख-दिशा तय होती है।`);
      }
      steps.push(`सभी मोड़ों के बाद अंतिम मुख ${answer} की ओर है।`);
    } else {
      steps.push(`छाया ${sideHi(s.side)} होने से ${nameHi(s.firstName)} का मुख ${directionHi(s.firstFacing)} की ओर है।`);
      steps.push(
        s.relation === "SAME_DIRECTION"
          ? `${nameHi(s.secondName)} उसी दिशा में देख रहा है, इसलिए उसका मुख ${answer} की ओर है।`
          : `${nameHi(s.secondName)} विपरीत दिशा में देख रहा है, इसलिए उसका मुख ${answer} की ओर है।`,
      );
    }
    return { ...base, steps, resultLine: `दिए गए सूर्य-छाया संबंध से सही उत्तर ${answer} है।` };
  }
  if (["DIR-QL-038", "DIR-QL-039", "DIR-QL-040"].includes(qlId)) {
    return { ...base, steps: ["ज्ञात चालों को पहले लागू करें।", "हर सम्भव दिशा/मोड़/आरंभिक मुख का परीक्षण करें।", "जो एकमात्र विकल्प दिए गए अंतिम स्थान तक पहुँचता है, वही सही है।"], resultLine: `एकमात्र संगत उत्तर ${answer} है।` };
  }
  if (["DIR-QL-041", "DIR-QL-042", "DIR-QL-043"].includes(qlId)) {
    return { ...base, steps: ["पहले आरंभिक स्थान या चौकी के सापेक्ष शुद्ध क्षैतिज और ऊर्ध्वाधर घटक निकालें।", qlId === "DIR-QL-043" ? "इन घटकों पर पाइथागोरस प्रमेय लगाकर सीधी दूरी निकालें।" : "घटकों के चिन्ह से दिशा और परिमाण से दूरी तय करें।"], resultLine: `संयुक्त गणना से उत्तर ${answer} है।` };
  }
  return base;
}

export function localizeDirectionQuestionHindi(englishQuestion: unknown): LocalizedDirectionQuestion {
  const english = asR(englishQuestion);
  const options: LocalizedDirectionOption[] = (english.options ?? []).map((option: R) => ({
    value: option.value,
    label: optionLabelHindi(option),
    errorLabel: option.errorLabel ?? null,
  }));
  if (options.length !== 4 || new Set(options.map((option) => option.label)).size !== 4) {
    throw new Error(`DIR Hindi options must remain four and unique for ${english.qlId} seed ${english.seed}`);
  }
  const questionDiagram = localizeDiagramHindi(english.questionDiagram);
  return {
    locale: "hi-IN",
    qlId: String(english.qlId),
    checkpointId: String(english.checkpointId),
    ruleId: String(english.ruleId),
    seed: Number(english.seed),
    difficulty: english.difficulty,
    stem: renderHindiStem(english),
    structuredPrompt: english.structuredPrompt,
    ...(questionDiagram ? { questionDiagram } : {}),
    options,
    correctIndex: Number(english.correctIndex),
    correctAnswer: english.correctAnswer,
    explanation: renderExplanation(english),
    metadata: {
      ...(english.metadata ?? {}),
      locale: "hi-IN",
      sourceLocale: "en-IN",
      localizationMode: "LANGUAGE_ADAPTED",
      answerParityVerified: true,
    },
  };
}

export function generateDirectionQuestionHindi(qlId: string, seed = 0): LocalizedDirectionQuestion {
  return localizeDirectionQuestionHindi(generateDirectionQuestion(qlId, seed));
}
