export type R = Record<string, any>;

const NAME_HI: Readonly<Record<string, string>> = {
  Aman: "अमन", Beena: "बीना", Charan: "चरण", Deepa: "दीपा", Farhan: "फरहान",
  Gurpreet: "गुरप्रीत", Harpreet: "हरप्रीत", Isha: "ईशा", Jasleen: "जसलीन",
  Jatin: "जतिन", Karan: "करण", Kiran: "किरण", Manpreet: "मनप्रीत", Meena: "मीना",
  Naman: "नमन", Neha: "नेहा", Pawan: "पवन", Pooja: "पूजा", Ravi: "रवि",
  Riya: "रिया", Simran: "सिमरन", Tanvi: "तन्वी",
};

const DIRECTION_HI: Readonly<Record<string, string>> = {
  NORTH: "उत्तर", NORTH_EAST: "उत्तर-पूर्व", EAST: "पूर्व", SOUTH_EAST: "दक्षिण-पूर्व",
  SOUTH: "दक्षिण", SOUTH_WEST: "दक्षिण-पश्चिम", WEST: "पश्चिम", NORTH_WEST: "उत्तर-पश्चिम",
  SAME_POSITION: "उसी स्थान पर",
};

const TURN_HI: Readonly<Record<string, string>> = {
  LEFT: "बाएँ मुड़ना", RIGHT: "दाएँ मुड़ना", ABOUT: "पीछे मुड़ना", NO_TURN: "बिना मुड़े सीधे चलना",
  LEFT_TURN: "बाएँ मुड़ना", RIGHT_TURN: "दाएँ मुड़ना", ABOUT_TURN: "पीछे मुड़ना",
};

const SIDE_HI: Readonly<Record<string, string>> = {
  LEFT: "बाईं ओर", RIGHT: "दाईं ओर", FRONT: "सामने", BEHIND: "पीछे",
};

const PERIOD_HI: Readonly<Record<string, string>> = {
  MORNING: "सुबह", EVENING: "शाम", NOON: "दोपहर", CANNOT_BE_DETERMINED: "निर्धारित नहीं किया जा सकता",
};

const PLACE_HI: Readonly<Record<string, string>> = {
  "a school playground": "स्कूल के खेल मैदान",
  "an open field": "खुले मैदान",
  "a village square": "गाँव के चौक",
  "a market yard": "बाज़ार के खुले परिसर",
  "an office compound": "कार्यालय परिसर",
  "a school ground near the main gate": "मुख्य द्वार के पास स्कूल के मैदान",
  "a public park beside the central lawn": "केंद्रीय लॉन के पास सार्वजनिक उद्यान",
  "a college campus along a marked track": "चिह्नित पथ वाले कॉलेज परिसर",
  "an office compound close to the entrance": "प्रवेश द्वार के पास कार्यालय परिसर",
  "a school ground": "स्कूल के मैदान",
  "a public park": "सार्वजनिक उद्यान",
  "a college campus": "कॉलेज परिसर",
  "a sports complex": "खेल परिसर",
  "a garden": "बगीचे",
};

export const asR = (value: unknown): R => value as R;
export const nameHi = (value: unknown): string => NAME_HI[String(value)] ?? String(value);
export const directionHi = (value: unknown): string => DIRECTION_HI[String(value)] ?? String(value);
export const turnHi = (value: unknown): string => TURN_HI[String(value)] ?? String(value);
export const sideHi = (value: unknown): string => SIDE_HI[String(value)] ?? String(value);
export const periodHi = (value: unknown): string => PERIOD_HI[String(value)] ?? String(value);
export const placeHi = (value: unknown): string => PLACE_HI[String(value)] ?? String(value);
export const metres = (value: unknown): string => `${value} मीटर`;

export function personName(value: unknown): string {
  if (value && typeof value === "object" && "name" in (value as R)) return nameHi((value as R).name);
  return nameHi(value);
}

export function joinHindi(parts: readonly string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} और ${parts[parts.length - 1]}`;
}

export function vectorDirection(vector: R): string {
  const x = Number(vector.x ?? 0), y = Number(vector.y ?? 0);
  if (x === 0 && y === 0) return "SAME_POSITION";
  if (x === 0) return y > 0 ? "NORTH" : "SOUTH";
  if (y === 0) return x > 0 ? "EAST" : "WEST";
  if (x > 0 && y > 0) return "NORTH_EAST";
  if (x > 0 && y < 0) return "SOUTH_EAST";
  if (x < 0 && y < 0) return "SOUTH_WEST";
  return "NORTH_WEST";
}

export function vectorDistance(vector: R): number {
  return Math.max(Math.abs(Number(vector.x ?? 0)), Math.abs(Number(vector.y ?? 0)));
}

export function coordinateText(point: R): string {
  const parts: string[] = [];
  const x = Number(point.x ?? 0), y = Number(point.y ?? 0);
  if (x > 0) parts.push(`${metres(x)} पूर्व`);
  if (x < 0) parts.push(`${metres(Math.abs(x))} पश्चिम`);
  if (y > 0) parts.push(`${metres(y)} उत्तर`);
  if (y < 0) parts.push(`${metres(Math.abs(y))} दक्षिण`);
  return parts.length ? joinHindi(parts) : "आरंभिक बिंदु पर";
}

export function relationSentence(relation: R, includeDistance = true): string {
  const direction = directionHi(relation.direction ?? vectorDirection(asR(relation.vector)));
  const distance = relation.distance ?? vectorDistance(asR(relation.vector));
  return includeDistance
    ? `${nameHi(relation.toEntity ?? relation.subjectEntity)} ${nameHi(relation.fromEntity ?? relation.referenceEntity)} से ${metres(distance)} ${direction} में है।`
    : `${nameHi(relation.toEntity ?? relation.subjectEntity)} ${nameHi(relation.fromEntity ?? relation.referenceEntity)} के ${direction} में है।`;
}

export function turnInstruction(turn: R): string {
  const degrees = Number(turn.degrees ?? 0);
  const side = turn.sense === "CLOCKWISE" ? "दाईं ओर" : "बाईं ओर";
  if (degrees === 180) return "पीछे मुड़ना";
  if (degrees === 90) return `${side} मुड़ना`;
  return `${side} ${degrees}° घूमना`;
}

export function turnSequence(turns: readonly R[]): string {
  return turns.map(turnInstruction).join(", फिर ");
}

export function relativeOperations(operations: readonly R[], unknownMoveNumber?: number): string {
  const parts: string[] = [];
  let moveNumber = 0;
  for (const operation of operations) {
    if (operation.kind === "TURN") {
      parts.push(turnInstruction(operation));
      continue;
    }
    moveNumber += 1;
    const distance = operation.distance == null || moveNumber === unknownMoveNumber ? "कुछ दूरी" : metres(operation.distance);
    parts.push(`${distance} सीधे चलना`);
  }
  return parts.join(", फिर ");
}

export function advancedOperations(operations: readonly R[]): string {
  return operations.map((operation) => operation.kind === "TURN"
    ? turnHi(operation.turn)
    : `${metres(operation.distance)} सीधे चलना`).join(", फिर ");
}

export function absoluteSteps(steps: readonly R[]): string {
  return steps.map((step) => `${metres(step.distance)} ${directionHi(step.direction)} की ओर`).join(", फिर ");
}

export function pathDescription(path: R): string {
  return `${nameHi(path.name)} का मार्ग: ${absoluteSteps(path.steps ?? [])}।`;
}

export function startsDescription(paths: readonly R[]): string {
  const labels = [...new Set(paths.map((path) => String(path.startLabel ?? "O")))];
  if (labels.length === 1) return `${joinHindi(paths.map((path) => nameHi(path.name)))} एक ही बिंदु ${labels[0]} से शुरू करते हैं।`;
  if (paths.length === 2) {
    const first = paths[0], second = paths[1];
    const dx = Number(second.start?.x ?? 0) - Number(first.start?.x ?? 0);
    const dy = Number(second.start?.y ?? 0) - Number(first.start?.y ?? 0);
    const relation = coordinateText({ x: dx, y: dy });
    return `${nameHi(first.name)} बिंदु ${first.startLabel} से और ${nameHi(second.name)} बिंदु ${second.startLabel} से शुरू करते हैं। बिंदु ${second.startLabel}, ${first.startLabel} से ${relation} है।`;
  }
  return `${joinHindi(paths.map((path) => nameHi(path.name)))} अपने दिए गए आरंभिक बिंदुओं से शुरू करते हैं।`;
}

export function pathsBlock(paths: readonly R[]): string {
  return paths.map(pathDescription).join(" ");
}

export function codeMapText(codeMap: R, movement = false): string {
  return Object.entries(codeMap).map(([symbol, direction]) => movement
    ? `${symbol} का अर्थ ${directionHi(direction)} की ओर चलना है`
    : `${symbol} का अर्थ “संदर्भ के ${directionHi(direction)} में” है`).join(", ");
}

export function codedChain(relations: readonly R[], hiddenIndex = -1): string {
  if (!relations.length) return "";
  return relations.map((relation, index) => `${nameHi(relation.subject)} ${index === hiddenIndex ? "?" : relation.symbol} ${nameHi(relation.reference)}`).join(", ");
}

export function evidenceChain(evidence: R): string {
  const entities: string[] = evidence.displayEntities ?? [];
  const symbols: string[] = evidence.symbols ?? [];
  let result = nameHi(entities[0]);
  for (let index = 0; index < symbols.length; index += 1) result += ` ${symbols[index]} ${nameHi(entities[index + 1])}`;
  return result;
}

export function sunTime(period: string, variation: number): string {
  const minute = 20 + (Math.abs(variation) % 35);
  return period === "EVENING" ? `शाम 5:${String(minute).padStart(2, "0")} बजे` : `सुबह 6:${String(minute).padStart(2, "0")} बजे`;
}

export function answerLabel(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    if (DIRECTION_HI[value]) return directionHi(value);
    if (TURN_HI[value]) return turnHi(value);
    return nameHi(value);
  }
  if (!value || typeof value !== "object") return fallback || String(value);
  const answer = asR(value);
  switch (answer.kind) {
    case "DIRECTION": return directionHi(answer.direction);
    case "DIRECTION_DISTANCE": return `${directionHi(answer.direction)}, ${metres(answer.distance)}`;
    case "DISTANCE": return metres(answer.distance);
    case "TOTAL_AND_DISPLACEMENT": return `${metres(answer.totalDistance)}, ${metres(answer.displacement)}`;
    case "ENTITY": return nameHi(answer.entity);
    case "ENTITY_GROUP": return joinHindi((answer.entities ?? []).map(nameHi));
    case "ENTITY_PAIR": return joinHindi((answer.entities ?? []).map(nameHi));
    case "CODE_SYMBOL": return String(answer.symbol);
    case "CODED_STATEMENT": return localizeCodedStatement(String(answer.statement));
    case "CONCLUSION": return localizeConclusion(String(answer.statement));
    case "RELATIVE_SIDE": return sideHi(answer.side);
    case "TIME_PERIOD": return periodHi(answer.period);
    case "STATEMENT": return `कथन ${Number(answer.statementIndex) + 1}`;
    case "TURN": return turnHi(answer.turn);
    default:
      if (answer.endpointDirection && answer.finalFacing) return `${directionHi(answer.endpointDirection)}, अंतिम मुख ${directionHi(answer.finalFacing)}`;
      return fallback || JSON.stringify(value);
  }
}

export function localizeCodedStatement(statement: string): string {
  return statement.split(/\s+/).map((part) => NAME_HI[part] ?? part).join(" ");
}

export function localizeConclusion(statement: string): string {
  const match = statement.match(/^(.+?) is ([a-z-]+) of (.+?)\.?$/i);
  if (!match) return localizeCodedStatement(statement);
  const canonical = match[2].toUpperCase().replaceAll("-", "_");
  return `${nameHi(match[1])} ${nameHi(match[3])} के ${directionHi(canonical)} में है।`;
}

export function optionLabel(option: R): string {
  const value = option.value;
  if (value && typeof value === "object" && (value as R).kind === "DISTANCE" && /√|decimal/i.test(String(option.label))) {
    return String(option.label).replaceAll("metres", "मीटर").replaceAll("metre", "मीटर");
  }
  const rendered = answerLabel(value, String(option.label ?? ""));
  if (rendered && !rendered.startsWith("{")) return rendered;
  return localizeFreeText(String(option.label ?? ""));
}

export function localizeFreeText(input: string): string {
  let text = input;
  const ordered: readonly [RegExp, string][] = [
    [/North-East/gi, "उत्तर-पूर्व"], [/South-East/gi, "दक्षिण-पूर्व"], [/South-West/gi, "दक्षिण-पश्चिम"], [/North-West/gi, "उत्तर-पश्चिम"],
    [/North/gi, "उत्तर"], [/South/gi, "दक्षिण"], [/East/gi, "पूर्व"], [/West/gi, "पश्चिम"],
    [/metres/gi, "मीटर"], [/metre/gi, "मीटर"], [/Statement\s+(\d+)/gi, "कथन $1"],
    [/Turn left/gi, "बाएँ मुड़ें"], [/Turn right/gi, "दाएँ मुड़ें"], [/Turn around/gi, "पीछे मुड़ें"], [/Continue straight/gi, "सीधे चलते रहें"],
    [/To the left/gi, "बाईं ओर"], [/To the right/gi, "दाईं ओर"], [/In front/gi, "सामने"], [/Behind/gi, "पीछे"],
    [/Cannot be determined/gi, "निर्धारित नहीं किया जा सकता"], [/Morning/gi, "सुबह"], [/Evening/gi, "शाम"], [/Noon/gi, "दोपहर"],
  ];
  for (const [pattern, replacement] of ordered) text = text.replace(pattern, replacement);
  for (const [english, hindi] of Object.entries(NAME_HI)) text = text.replace(new RegExp(`\\b${english}\\b`, "g"), hindi);
  return text;
}

export function localizeSvg(svg: string): string {
  let result = localizeFreeText(svg);
  const replacements: readonly [string, string][] = [
    ["Start", "आरंभ"], ["Finish", "अंत"], ["Final", "अंतिम"], ["movement", "चाल"], ["Movement", "चाल"],
    ["Sun", "सूर्य"], ["Shadow", "छाया"], ["Person", "व्यक्ति"], ["Morning", "सुबह"], ["Evening", "शाम"],
    ["Turn", "मोड़"], ["Reference", "संदर्भ"], ["Endpoint", "अंतिम बिंदु"], ["Static layout followed by movement", "स्थिर विन्यास के बाद चाल"],
  ];
  for (const [english, hindi] of replacements) result = result.replaceAll(english, hindi);
  return result;
}

export function localizeDiagram(value: unknown): Readonly<Record<string, unknown>> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const diagram = asR(value);
  return {
    ...diagram,
    title: diagram.title ? localizeFreeText(String(diagram.title)) : diagram.title,
    svg: diagram.svg ? localizeSvg(String(diagram.svg)) : diagram.svg,
  };
}
