export type R = Record<string, any>;

const NAME_PA: Readonly<Record<string, string>> = {
  Aman: "ਅਮਨ", Beena: "ਬੀਨਾ", Charan: "ਚਰਨ", Deepa: "ਦੀਪਾ", Farhan: "ਫਰਹਾਨ",
  Gurpreet: "ਗੁਰਪ੍ਰੀਤ", Harpreet: "ਹਰਪ੍ਰੀਤ", Isha: "ਈਸ਼ਾ", Jasleen: "ਜਸਲੀਨ",
  Jatin: "ਜਤਿਨ", Karan: "ਕਰਨ", Kiran: "ਕਿਰਨ", Manpreet: "ਮਨਪ੍ਰੀਤ", Meena: "ਮੀਨਾ",
  Naman: "ਨਮਨ", Neha: "ਨੇਹਾ", Pawan: "ਪਵਨ", Pooja: "ਪੂਜਾ", Ravi: "ਰਵੀ",
  Riya: "ਰੀਆ", Simran: "ਸਿਮਰਨ", Tanvi: "ਤਨਵੀ", Taran: "ਤਰਨ",
};

const DIRECTION_PA: Readonly<Record<string, string>> = {
  NORTH: "ਉੱਤਰ", NORTH_EAST: "ਉੱਤਰ-ਪੂਰਬ", EAST: "ਪੂਰਬ", SOUTH_EAST: "ਦੱਖਣ-ਪੂਰਬ",
  SOUTH: "ਦੱਖਣ", SOUTH_WEST: "ਦੱਖਣ-ਪੱਛਮ", WEST: "ਪੱਛਮ", NORTH_WEST: "ਉੱਤਰ-ਪੱਛਮ",
  SAME_POSITION: "ਉਸੇ ਥਾਂ",
};

const TURN_PA: Readonly<Record<string, string>> = {
  LEFT: "ਖੱਬੇ ਮੁੜਨਾ", RIGHT: "ਸੱਜੇ ਮੁੜਨਾ", ABOUT: "ਪਿੱਛੇ ਮੁੜਨਾ", NO_TURN: "ਬਿਨਾਂ ਮੁੜੇ ਸਿੱਧਾ ਤੁਰਨਾ",
  LEFT_TURN: "ਖੱਬੇ ਮੁੜਨਾ", RIGHT_TURN: "ਸੱਜੇ ਮੁੜਨਾ", ABOUT_TURN: "ਪਿੱਛੇ ਮੁੜਨਾ",
};

const SIDE_PA: Readonly<Record<string, string>> = {
  LEFT: "ਖੱਬੇ ਪਾਸੇ", RIGHT: "ਸੱਜੇ ਪਾਸੇ", FRONT: "ਸਾਹਮਣੇ", BEHIND: "ਪਿੱਛੇ",
};

const PERIOD_PA: Readonly<Record<string, string>> = {
  MORNING: "ਸਵੇਰ", EVENING: "ਸ਼ਾਮ", NOON: "ਦੁਪਹਿਰ", CANNOT_BE_DETERMINED: "ਪਤਾ ਨਹੀਂ ਲਗਾਇਆ ਜਾ ਸਕਦਾ",
};

const PLACE_PA: Readonly<Record<string, string>> = {
  "a school playground": "ਸਕੂਲ ਦੇ ਖੇਡ ਮੈਦਾਨ",
  "an open field": "ਖੁੱਲ੍ਹੇ ਮੈਦਾਨ",
  "a village square": "ਪਿੰਡ ਦੇ ਚੌਕ",
  "a market yard": "ਬਾਜ਼ਾਰ ਦੇ ਖੁੱਲ੍ਹੇ ਅਹਾਤੇ",
  "an office compound": "ਦਫ਼ਤਰ ਦੇ ਅਹਾਤੇ",
  "a school ground near the main gate": "ਮੁੱਖ ਦਰਵਾਜ਼ੇ ਕੋਲ ਸਕੂਲ ਦੇ ਮੈਦਾਨ",
  "a public park beside the central lawn": "ਵਿਚਕਾਰਲੇ ਲਾਨ ਕੋਲ ਸਰਕਾਰੀ ਬਾਗ਼",
  "a college campus along a marked track": "ਨਿਸ਼ਾਨ ਲੱਗੇ ਰਸਤੇ ਵਾਲੇ ਕਾਲਜ ਕੈਂਪਸ",
  "an office compound close to the entrance": "ਦਾਖ਼ਲੇ ਦੇ ਨੇੜੇ ਦਫ਼ਤਰ ਦੇ ਅਹਾਤੇ",
  "a school ground": "ਸਕੂਲ ਦੇ ਮੈਦਾਨ",
  "a public park": "ਸਰਕਾਰੀ ਬਾਗ਼",
  "a college campus": "ਕਾਲਜ ਕੈਂਪਸ",
  "a sports complex": "ਖੇਡ ਕੰਪਲੈਕਸ",
  "a garden": "ਬਾਗ਼",
};

export const asR = (value: unknown): R => value as R;
export const namePa = (value: unknown): string => NAME_PA[String(value)] ?? String(value);
export const directionPa = (value: unknown): string => DIRECTION_PA[String(value)] ?? String(value);
export const turnPa = (value: unknown): string => TURN_PA[String(value)] ?? String(value);
export const sidePa = (value: unknown): string => SIDE_PA[String(value)] ?? String(value);
export const periodPa = (value: unknown): string => PERIOD_PA[String(value)] ?? String(value);
export const placePa = (value: unknown): string => PLACE_PA[String(value)] ?? String(value);
export const metresPa = (value: unknown): string => `${value} ਮੀਟਰ`;

export function personNamePa(value: unknown): string {
  if (value && typeof value === "object" && "name" in (value as R)) return namePa((value as R).name);
  return namePa(value);
}

export function joinPunjabi(parts: readonly string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} ਅਤੇ ${parts[parts.length - 1]}`;
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

export function coordinateTextPa(point: R): string {
  const parts: string[] = [];
  const x = Number(point.x ?? 0), y = Number(point.y ?? 0);
  if (x > 0) parts.push(`${metresPa(x)} ਪੂਰਬ`);
  if (x < 0) parts.push(`${metresPa(Math.abs(x))} ਪੱਛਮ`);
  if (y > 0) parts.push(`${metresPa(y)} ਉੱਤਰ`);
  if (y < 0) parts.push(`${metresPa(Math.abs(y))} ਦੱਖਣ`);
  return parts.length ? joinPunjabi(parts) : "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ ਉੱਤੇ";
}

export function relationSentencePa(relation: R, includeDistance = true): string {
  const direction = directionPa(relation.direction ?? vectorDirection(asR(relation.vector)));
  const distance = relation.distance ?? vectorDistance(asR(relation.vector));
  return includeDistance
    ? `${namePa(relation.toEntity ?? relation.subjectEntity)}, ${namePa(relation.fromEntity ?? relation.referenceEntity)} ਤੋਂ ${metresPa(distance)} ${direction} ਵੱਲ ਹੈ।`
    : `${namePa(relation.toEntity ?? relation.subjectEntity)}, ${namePa(relation.fromEntity ?? relation.referenceEntity)} ਦੇ ${direction} ਵੱਲ ਹੈ।`;
}

export function turnInstructionPa(turn: R): string {
  const degrees = Number(turn.degrees ?? 0);
  const side = turn.sense === "CLOCKWISE" ? "ਸੱਜੇ" : "ਖੱਬੇ";
  if (degrees === 180) return "ਪਿੱਛੇ ਮੁੜਨਾ";
  if (degrees === 90) return `${side} ਮੁੜਨਾ`;
  return `${side} ਪਾਸੇ ${degrees}° ਘੁੰਮਣਾ`;
}

export function turnSequencePa(turns: readonly R[]): string {
  return turns.map(turnInstructionPa).join(", ਫਿਰ ");
}

export function relativeOperationsPa(operations: readonly R[], unknownMoveNumber?: number): string {
  const parts: string[] = [];
  let moveNumber = 0;
  for (const operation of operations) {
    if (operation.kind === "TURN") {
      parts.push(turnInstructionPa(operation));
      continue;
    }
    moveNumber += 1;
    const distance = operation.distance == null || moveNumber === unknownMoveNumber ? "ਕੁਝ ਦੂਰੀ" : metresPa(operation.distance);
    parts.push(`${distance} ਸਿੱਧਾ ਤੁਰਨਾ`);
  }
  return parts.join(", ਫਿਰ ");
}

export function advancedOperationsPa(operations: readonly R[]): string {
  return operations.map((operation) => operation.kind === "TURN"
    ? turnPa(operation.turn)
    : `${metresPa(operation.distance)} ਸਿੱਧਾ ਤੁਰਨਾ`).join(", ਫਿਰ ");
}

export function absoluteStepsPa(steps: readonly R[]): string {
  return steps.map((step) => `${metresPa(step.distance)} ${directionPa(step.direction)} ਵੱਲ`).join(", ਫਿਰ ");
}

export function pathDescriptionPa(path: R): string {
  return `${namePa(path.name)} ਦਾ ਰਸਤਾ: ${absoluteStepsPa(path.steps ?? [])}।`;
}

export function startsDescriptionPa(paths: readonly R[]): string {
  const labels = [...new Set(paths.map((path) => String(path.startLabel ?? "O")))];
  if (labels.length === 1) return `${joinPunjabi(paths.map((path) => namePa(path.name)))} ਇੱਕੋ ਬਿੰਦੂ ${labels[0]} ਤੋਂ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ।`;
  if (paths.length === 2) {
    const first = paths[0], second = paths[1];
    const dx = Number(second.start?.x ?? 0) - Number(first.start?.x ?? 0);
    const dy = Number(second.start?.y ?? 0) - Number(first.start?.y ?? 0);
    const relation = coordinateTextPa({ x: dx, y: dy });
    return `${namePa(first.name)} ਬਿੰਦੂ ${first.startLabel} ਤੋਂ ਅਤੇ ${namePa(second.name)} ਬਿੰਦੂ ${second.startLabel} ਤੋਂ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਬਿੰਦੂ ${second.startLabel}, ${first.startLabel} ਤੋਂ ${relation} ਹੈ।`;
  }
  return `${joinPunjabi(paths.map((path) => namePa(path.name)))} ਆਪਣੇ ਦਿੱਤੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂਆਂ ਤੋਂ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ।`;
}

export function pathsBlockPa(paths: readonly R[]): string {
  return paths.map(pathDescriptionPa).join(" ");
}

export function codeMapTextPa(codeMap: R, movement = false): string {
  return Object.entries(codeMap).map(([symbol, direction]) => movement
    ? `${symbol} ਦਾ ਅਰਥ ${directionPa(direction)} ਵੱਲ ਤੁਰਨਾ ਹੈ`
    : `${symbol} ਦਾ ਅਰਥ “ਦੂਜੇ ਨਾਮ ਦੇ ${directionPa(direction)} ਵੱਲ” ਹੈ`).join(", ");
}

export function codedChainPa(relations: readonly R[], hiddenIndex = -1): string {
  if (!relations.length) return "";
  return relations.map((relation, index) => `${namePa(relation.subject)} ${index === hiddenIndex ? "?" : relation.symbol} ${namePa(relation.reference)}`).join(", ");
}

export function evidenceChainPa(evidence: R): string {
  const entities: string[] = evidence.displayEntities ?? [];
  const symbols: string[] = evidence.symbols ?? [];
  let result = namePa(entities[0]);
  for (let index = 0; index < symbols.length; index += 1) result += ` ${symbols[index]} ${namePa(entities[index + 1])}`;
  return result;
}

export function sunTimePa(period: string, variation: number): string {
  const minute = 20 + (Math.abs(variation) % 35);
  return period === "EVENING" ? `ਸ਼ਾਮ 5:${String(minute).padStart(2, "0")} ਵਜੇ` : `ਸਵੇਰੇ 6:${String(minute).padStart(2, "0")} ਵਜੇ`;
}

export function answerLabelPa(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    if (DIRECTION_PA[value]) return directionPa(value);
    if (TURN_PA[value]) return turnPa(value);
    return namePa(value);
  }
  if (!value || typeof value !== "object") return fallback || String(value);
  const answer = asR(value);
  switch (answer.kind) {
    case "DIRECTION": return directionPa(answer.direction);
    case "DIRECTION_DISTANCE": return `${directionPa(answer.direction)}, ${metresPa(answer.distance)}`;
    case "DISTANCE": return metresPa(answer.distance);
    case "TOTAL_AND_DISPLACEMENT": return `${metresPa(answer.totalDistance)}, ${metresPa(answer.displacement)}`;
    case "ENTITY": return namePa(answer.entity);
    case "ENTITY_GROUP": return joinPunjabi((answer.entities ?? []).map(namePa));
    case "ENTITY_PAIR": return joinPunjabi((answer.entities ?? []).map(namePa));
    case "CODE_SYMBOL": return String(answer.symbol);
    case "CODED_STATEMENT": return localizeCodedStatementPa(String(answer.statement));
    case "CONCLUSION": return localizeConclusionPa(String(answer.statement));
    case "RELATIVE_SIDE": return sidePa(answer.side);
    case "TIME_PERIOD": return periodPa(answer.period);
    case "STATEMENT": return `ਕਥਨ ${Number(answer.statementIndex) + 1}`;
    case "TURN": return turnPa(answer.turn);
    default:
      if (answer.endpointDirection && answer.finalFacing) return `${directionPa(answer.endpointDirection)}, ਅੰਤ ਵਿੱਚ ਮੂੰਹ ${directionPa(answer.finalFacing)} ਵੱਲ`;
      return fallback || JSON.stringify(value);
  }
}

export function localizeCodedStatementPa(statement: string): string {
  return statement.split(/\s+/).map((part) => NAME_PA[part] ?? part).join(" ");
}

export function localizeConclusionPa(statement: string): string {
  const match = statement.match(/^(.+?) is ([a-z-]+) of (.+?)\.?$/i);
  if (!match) return localizeCodedStatementPa(statement);
  const canonical = match[2].toUpperCase().replaceAll("-", "_");
  return `${namePa(match[1])}, ${namePa(match[3])} ਦੇ ${directionPa(canonical)} ਵੱਲ ਹੈ।`;
}

export function optionLabelPa(option: R): string {
  const value = option.value;
  if (value && typeof value === "object" && (value as R).kind === "DISTANCE" && /√|decimal/i.test(String(option.label))) {
    return String(option.label).replaceAll("metres", "ਮੀਟਰ").replaceAll("metre", "ਮੀਟਰ");
  }
  const rendered = answerLabelPa(value, String(option.label ?? ""));
  if (rendered && !rendered.startsWith("{")) return rendered;
  return localizeFreeTextPa(String(option.label ?? ""));
}

export function localizeFreeTextPa(input: string): string {
  let text = input;
  const ordered: readonly [RegExp, string][] = [
    [/North-East/gi, "ਉੱਤਰ-ਪੂਰਬ"], [/South-East/gi, "ਦੱਖਣ-ਪੂਰਬ"], [/South-West/gi, "ਦੱਖਣ-ਪੱਛਮ"], [/North-West/gi, "ਉੱਤਰ-ਪੱਛਮ"],
    [/North/gi, "ਉੱਤਰ"], [/South/gi, "ਦੱਖਣ"], [/East/gi, "ਪੂਰਬ"], [/West/gi, "ਪੱਛਮ"],
    [/metres/gi, "ਮੀਟਰ"], [/metre/gi, "ਮੀਟਰ"], [/Statement\s+(\d+)/gi, "ਕਥਨ $1"],
    [/Turn left/gi, "ਖੱਬੇ ਮੁੜੋ"], [/Turn right/gi, "ਸੱਜੇ ਮੁੜੋ"], [/Turn around/gi, "ਪਿੱਛੇ ਮੁੜੋ"], [/Continue straight/gi, "ਸਿੱਧੇ ਤੁਰਦੇ ਰਹੋ"],
    [/To the left/gi, "ਖੱਬੇ ਪਾਸੇ"], [/To the right/gi, "ਸੱਜੇ ਪਾਸੇ"], [/In front/gi, "ਸਾਹਮਣੇ"], [/Behind/gi, "ਪਿੱਛੇ"],
    [/Cannot be determined/gi, "ਪਤਾ ਨਹੀਂ ਲਗਾਇਆ ਜਾ ਸਕਦਾ"], [/Morning/gi, "ਸਵੇਰ"], [/Evening/gi, "ਸ਼ਾਮ"], [/Noon/gi, "ਦੁਪਹਿਰ"],
  ];
  for (const [pattern, replacement] of ordered) text = text.replace(pattern, replacement);
  for (const [english, punjabi] of Object.entries(NAME_PA)) text = text.replace(new RegExp(`\\b${english}\\b`, "g"), punjabi);
  return text;
}

export function localizeSvgPa(svg: string): string {
  let result = localizeFreeTextPa(svg);
  const replacements: readonly [string, string][] = [
    ["Start", "ਸ਼ੁਰੂ"], ["Finish", "ਅੰਤ"], ["Final", "ਅੰਤਿਮ"], ["movement", "ਚਾਲ"], ["Movement", "ਚਾਲ"],
    ["Sun", "ਸੂਰਜ"], ["Shadow", "ਪਰਛਾਂਵਾਂ"], ["Person", "ਵਿਅਕਤੀ"], ["Morning", "ਸਵੇਰ"], ["Evening", "ਸ਼ਾਮ"],
    ["Turn", "ਮੋੜ"], ["Reference", "ਦੂਜਾ ਬਿੰਦੂ"], ["Endpoint", "ਅੰਤਿਮ ਬਿੰਦੂ"], ["Static layout followed by movement", "ਸਥਿਰ ਬਣਤਰ ਤੋਂ ਬਾਅਦ ਚਾਲ"],
  ];
  for (const [english, punjabi] of replacements) result = result.replaceAll(english, punjabi);
  return result;
}

export function localizeDiagramPa(value: unknown): Readonly<Record<string, unknown>> | undefined {
  if (!value || typeof value !== "object") return undefined;
  const diagram = asR(value);
  return {
    ...diagram,
    title: diagram.title ? localizeFreeTextPa(String(diagram.title)) : diagram.title,
    svg: diagram.svg ? localizeSvgPa(String(diagram.svg)) : diagram.svg,
  };
}
