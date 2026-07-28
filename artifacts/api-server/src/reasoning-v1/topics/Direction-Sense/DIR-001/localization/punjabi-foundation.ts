import { getEntityGender } from "../../../../../lib/realizers/gender-utils";

export type R = Record<string, any>;
export type PunjabiGender = "M" | "F";

const NAME_PA: Readonly<Record<string, string>> = {
  Aman: "ਅਮਨ", Beena: "ਬੀਨਾ", Charan: "ਚਰਨ", Deepa: "ਦੀਪਾ", Farhan: "ਫਰਹਾਨ",
  Gurpreet: "ਗੁਰਪ੍ਰੀਤ", Harpreet: "ਹਰਪ੍ਰੀਤ", Isha: "ਈਸ਼ਾ", Jasleen: "ਜਸਲੀਨ",
  Jatin: "ਜਤਿਨ", Karan: "ਕਰਨ", Kiran: "ਕਿਰਨ", Manpreet: "ਮਨਪ੍ਰੀਤ", Meena: "ਮੀਨਾ",
  Naman: "ਨਮਨ", Neha: "ਨੇਹਾ", Pawan: "ਪਵਨ", Pooja: "ਪੂਜਾ", Ravi: "ਰਵੀ",
  Riya: "ਰੀਆ", Simran: "ਸਿਮਰਨ", Tanvi: "ਤਨਵੀ", Taran: "ਤਰਨ",
};

const CHAPTER_GENDER: Readonly<Record<string, PunjabiGender>> = {
  Aman: "M", Beena: "F", Charan: "M", Deepa: "F", Farhan: "M",
  Gurpreet: "M", Harpreet: "M", Isha: "F", Jasleen: "F", Jatin: "M",
  Karan: "M", Kiran: "F", Manpreet: "M", Meena: "F", Naman: "M",
  Neha: "F", Pawan: "M", Pooja: "F", Ravi: "M", Riya: "F",
  Simran: "F", Tanvi: "F", Taran: "M",
};

const DIRECTION_PA: Readonly<Record<string, string>> = {
  NORTH: "ਉੱਤਰ", NORTH_EAST: "ਉੱਤਰ-ਪੂਰਬ", EAST: "ਪੂਰਬ", SOUTH_EAST: "ਦੱਖਣ-ਪੂਰਬ",
  SOUTH: "ਦੱਖਣ", SOUTH_WEST: "ਦੱਖਣ-ਪੱਛਮ", WEST: "ਪੱਛਮ", NORTH_WEST: "ਉੱਤਰ-ਪੱਛਮ",
  SAME_POSITION: "ਉਸੇ ਬਿੰਦੂ ਉੱਤੇ",
};

const DIRECTION_ANGLE: Readonly<Record<string, number>> = {
  NORTH: 0, NORTH_EAST: 45, EAST: 90, SOUTH_EAST: 135,
  SOUTH: 180, SOUTH_WEST: 225, WEST: 270, NORTH_WEST: 315,
};

const TURN_PA: Readonly<Record<string, string>> = {
  LEFT: "ਖੱਬੇ ਪਾਸੇ 90° ਦਾ ਮੋੜ",
  RIGHT: "ਸੱਜੇ ਪਾਸੇ 90° ਦਾ ਮੋੜ",
  ABOUT: "ਪਿੱਛੇ ਵੱਲ 180° ਦਾ ਮੋੜ",
  NO_TURN: "ਬਿਨਾਂ ਮੋੜ ਦੇ ਸਿੱਧੀ ਚਾਲ",
  LEFT_TURN: "ਖੱਬੇ ਪਾਸੇ 90° ਦਾ ਮੋੜ",
  RIGHT_TURN: "ਸੱਜੇ ਪਾਸੇ 90° ਦਾ ਮੋੜ",
  ABOUT_TURN: "ਪਿੱਛੇ ਵੱਲ 180° ਦਾ ਮੋੜ",
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

function rawPersonName(value: unknown): string {
  if (value && typeof value === "object" && "name" in (value as R)) return String((value as R).name);
  return String(value);
}

export function personNamePa(value: unknown): string {
  return namePa(rawPersonName(value));
}

export function personGenderPa(value: unknown): PunjabiGender {
  if (value && typeof value === "object") {
    const person = asR(value);
    const explicitGender = String(person.gender ?? "").toUpperCase();
    if (explicitGender === "F" || explicitGender === "FEMALE") return "F";
    if (explicitGender === "M" || explicitGender === "MALE") return "M";
    const pronoun = String(person.pronoun ?? "").toLowerCase();
    if (pronoun === "she" || pronoun === "her") return "F";
    if (pronoun === "he" || pronoun === "him") return "M";
  }
  const name = rawPersonName(value);
  const registered = getEntityGender(name);
  if (registered === "F") return "F";
  if (registered === "M") return "M";
  return CHAPTER_GENDER[name] ?? "M";
}

function gendered(person: unknown, masculine: string, feminine: string): string {
  return personGenderPa(person) === "F" ? feminine : masculine;
}

export function walkVerbPa(person: unknown): string {
  return gendered(person, "ਚੱਲਦਾ ਹੈ", "ਚੱਲਦੀ ਹੈ");
}

export function turnVerbPa(person: unknown): string {
  return gendered(person, "ਮੁੜਦਾ ਹੈ", "ਮੁੜਦੀ ਹੈ");
}

export function rotateVerbPa(person: unknown): string {
  return gendered(person, "ਘੁੰਮ ਜਾਂਦਾ ਹੈ", "ਘੁੰਮ ਜਾਂਦੀ ਹੈ");
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
    : `${namePa(relation.toEntity ?? relation.subjectEntity)}, ${namePa(relation.fromEntity ?? relation.referenceEntity)} ਤੋਂ ${direction} ਵੱਲ ਹੈ।`;
}

function canonicalTurnOperation(turn: unknown): R {
  switch (String(turn)) {
    case "LEFT":
    case "LEFT_TURN":
      return { kind: "TURN", sense: "ANTICLOCKWISE", degrees: 90 };
    case "RIGHT":
    case "RIGHT_TURN":
      return { kind: "TURN", sense: "CLOCKWISE", degrees: 90 };
    case "ABOUT":
    case "ABOUT_TURN":
      return { kind: "TURN", sense: "CLOCKWISE", degrees: 180 };
    default:
      return { kind: "TURN", sense: "CLOCKWISE", degrees: 0 };
  }
}

function turnSidePa(turn: R): string {
  return turn.sense === "CLOCKWISE" ? "ਸੱਜੇ" : "ਖੱਬੇ";
}

function turnDirectionPhrasePa(turn: R): string {
  return turn.sense === "CLOCKWISE" ? "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਘੜੀ ਦੀ ਉਲਟ ਦਿਸ਼ਾ ਵਿੱਚ";
}

export function turnInstructionPa(turn: R): string {
  const degrees = Number(turn.degrees ?? 0);
  if (degrees === 0) return "ਬਿਨਾਂ ਮੋੜ ਦੇ ਸਿੱਧੀ ਚਾਲ";
  if (degrees === 180) return "ਪਿੱਛੇ ਵੱਲ 180° ਦਾ ਮੋੜ";
  if (degrees === 90) return `${turnSidePa(turn)} ਪਾਸੇ 90° ਦਾ ਮੋੜ`;
  return `${turnDirectionPhrasePa(turn)} ${degrees}° ਦਾ ਘੁੰਮਾਅ`;
}

export function turnFinitePa(turn: R, person: unknown): string {
  const degrees = Number(turn.degrees ?? 0);
  if (degrees === 0) return `ਬਿਨਾਂ ਮੁੜੇ ਸਿੱਧਾ ${walkVerbPa(person)}`;
  if (degrees === 180) return `ਪਿੱਛੇ ਵੱਲ 180° ${turnVerbPa(person)}`;
  if (degrees === 90) return `${turnSidePa(turn)} ਪਾਸੇ 90° ${turnVerbPa(person)}`;
  return `${turnDirectionPhrasePa(turn)} ${degrees}° ${rotateVerbPa(person)}`;
}

export function turnLinkPa(turn: R): string {
  const degrees = Number(turn.degrees ?? 0);
  if (degrees === 0) return "ਬਿਨਾਂ ਮੁੜੇ";
  if (degrees === 180) return "ਪਿੱਛੇ ਵੱਲ 180° ਮੁੜ ਕੇ";
  if (degrees === 90) return `${turnSidePa(turn)} ਪਾਸੇ 90° ਮੁੜ ਕੇ`;
  return `${turnDirectionPhrasePa(turn)} ${degrees}° ਘੁੰਮ ਕੇ`;
}

export function canonicalTurnLinkPa(turn: unknown): string {
  return turnLinkPa(canonicalTurnOperation(turn));
}

function narrativeSentencesPa(clauses: readonly string[], person: unknown, useName = true): string {
  if (!clauses.length) return "";
  const name = personNamePa(person);
  return clauses.map((clause, index) => {
    if (index === 0) return `${useName ? name : "ਉਹ"} ਪਹਿਲਾਂ ${clause}।`;
    if (index === clauses.length - 1) return `ਅੰਤ ਵਿੱਚ ਉਹ ${clause}।`;
    return `ਫਿਰ ਉਹ ${clause}।`;
  }).join(" ");
}

export function turnNarrativePa(turns: readonly R[], person: unknown): string {
  return narrativeSentencesPa(turns.map((turn) => turnFinitePa(turn, person)), person);
}

export function turnSequencePa(turns: readonly R[]): string {
  return turns.map(turnInstructionPa).join(", ਫਿਰ ");
}

function moveDistancePa(operation: R, moveNumber: number, unknownMoveNumber?: number): string {
  return operation.distance == null || moveNumber === unknownMoveNumber
    ? "ਕੁਝ ਦੂਰੀ"
    : metresPa(operation.distance);
}

export function relativeJourneyPa(
  operations: readonly R[],
  person: unknown,
  unknownMoveNumber?: number,
  useName = true,
): string {
  const clauses: string[] = [];
  let moveNumber = 0;
  for (let index = 0; index < operations.length; index += 1) {
    const operation = operations[index];
    if (operation.kind === "TURN") {
      const next = operations[index + 1];
      if (next?.kind === "MOVE") {
        moveNumber += 1;
        const more = clauses.length ? " ਹੋਰ" : "";
        clauses.push(`${turnLinkPa(operation)} ${moveDistancePa(next, moveNumber, unknownMoveNumber)}${more} ${walkVerbPa(person)}`);
        index += 1;
      } else {
        clauses.push(turnFinitePa(operation, person));
      }
      continue;
    }
    moveNumber += 1;
    clauses.push(`${moveDistancePa(operation, moveNumber, unknownMoveNumber)} ਸਿੱਧਾ ${walkVerbPa(person)}`);
  }
  return narrativeSentencesPa(clauses, person, useName);
}

export function relativeOperationsPa(operations: readonly R[], unknownMoveNumber?: number): string {
  let moveNumber = 0;
  return operations.map((operation) => {
    if (operation.kind === "TURN") return turnInstructionPa(operation);
    moveNumber += 1;
    return `${moveDistancePa(operation, moveNumber, unknownMoveNumber)} ਦੀ ਸਿੱਧੀ ਚਾਲ`;
  }).join(", ਫਿਰ ");
}

export function advancedJourneyPa(operations: readonly R[], person: unknown, useName = true): string {
  const normalized = operations.map((operation) => operation.kind === "TURN"
    ? canonicalTurnOperation(operation.turn)
    : operation);
  return relativeJourneyPa(normalized, person, undefined, useName);
}

export function advancedOperationsPa(operations: readonly R[]): string {
  return operations.map((operation) => operation.kind === "TURN"
    ? turnPa(operation.turn)
    : `${metresPa(operation.distance)} ਦੀ ਸਿੱਧੀ ਚਾਲ`).join(", ਫਿਰ ");
}

export function absoluteJourneyPa(steps: readonly R[], person: unknown, useName = true): string {
  const clauses = steps.map((step) => `${directionPa(step.direction)} ਵੱਲ ${metresPa(step.distance)} ${walkVerbPa(person)}`);
  return narrativeSentencesPa(clauses, person, useName);
}

export function absoluteLegJourneyPa(legs: readonly R[], person: unknown, useName = true): string {
  const clauses = legs.map((leg) => {
    const direction = leg.direction === "UNKNOWN" ? "ਦਿੱਤੀ ਨਾ ਗਈ ਦਿਸ਼ਾ ਵੱਲ" : `${directionPa(leg.direction)} ਵੱਲ`;
    return `${direction} ${metresPa(leg.distance)} ${walkVerbPa(person)}`;
  });
  return narrativeSentencesPa(clauses, person, useName);
}

export function absoluteStepsPa(steps: readonly R[]): string {
  return steps.map((step) => `${directionPa(step.direction)} ਵੱਲ ${metresPa(step.distance)} ਦੀ ਚਾਲ`).join(", ਫਿਰ ");
}

export function codedMovementJourneyPa(steps: readonly R[]): string {
  const person = { name: "ਵਿਅਕਤੀ", pronoun: "He" };
  const clauses = steps.map((step) => `${step.symbol} ਚਿੰਨ੍ਹ ਅਨੁਸਾਰ ${metresPa(step.distance)} ${walkVerbPa(person)}`);
  return narrativeSentencesPa(clauses, person);
}

export function pathDescriptionPa(path: R): string {
  return absoluteJourneyPa(path.steps ?? [], path.name);
}

export function startsDescriptionPa(paths: readonly R[]): string {
  const labels = [...new Set(paths.map((path) => String(path.startLabel ?? "O")))];
  if (labels.length === 1) return `${joinPunjabi(paths.map((path) => namePa(path.name)))} ਇੱਕੋ ਬਿੰਦੂ ${labels[0]} ਤੋਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ।`;
  if (paths.length === 2) {
    const first = paths[0], second = paths[1];
    const dx = Number(second.start?.x ?? 0) - Number(first.start?.x ?? 0);
    const dy = Number(second.start?.y ?? 0) - Number(first.start?.y ?? 0);
    const relation = coordinateTextPa({ x: dx, y: dy });
    return `${namePa(first.name)} ਬਿੰਦੂ ${first.startLabel} ਤੋਂ ਅਤੇ ${namePa(second.name)} ਬਿੰਦੂ ${second.startLabel} ਤੋਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਬਿੰਦੂ ${second.startLabel}, ${first.startLabel} ਤੋਂ ${relation} ਹੈ।`;
  }
  return `${joinPunjabi(paths.map((path) => namePa(path.name)))} ਆਪਣੇ ਦਿੱਤੇ ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂਆਂ ਤੋਂ ਚੱਲਣਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ।`;
}

export function pathsBlockPa(paths: readonly R[]): string {
  return paths.map(pathDescriptionPa).join(" ");
}

export function codeMapTextPa(codeMap: R, movement = false): string {
  return Object.entries(codeMap).map(([symbol, direction]) => movement
    ? `${symbol} ਦਾ ਅਰਥ ਹੈ ਕਿ ਵਿਅਕਤੀ ${directionPa(direction)} ਵੱਲ ਚੱਲਦਾ ਹੈ`
    : `${symbol} ਦਾ ਅਰਥ ਹੈ ਕਿ ਪਹਿਲਾ ਨਾਮ ਦੂਜੇ ਨਾਮ ਤੋਂ ${directionPa(direction)} ਵੱਲ ਹੈ`).join(", ");
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

export function directionAnglePa(direction: unknown): number {
  return DIRECTION_ANGLE[String(direction)] ?? 0;
}

export function directionFromAnglePa(angle: number): string {
  const normalized = ((angle % 360) + 360) % 360;
  const entry = Object.entries(DIRECTION_ANGLE).find(([, value]) => value === normalized);
  return entry?.[0] ?? "NORTH";
}

export function applyTurnAnglePa(angle: number, turn: R): number {
  const degrees = Number(turn.degrees ?? 0);
  const signed = turn.sense === "CLOCKWISE" ? degrees : -degrees;
  return ((angle + signed) % 360 + 360) % 360;
}

export function turnCalculationStepsPa(initialFacing: unknown, turns: readonly R[]): string[] {
  let angle = directionAnglePa(initialFacing);
  const steps = [`ਸ਼ੁਰੂਆਤੀ ਦਿਸ਼ਾ ${directionPa(initialFacing)} ਹੈ, ਜਿਸ ਨੂੰ ${angle}° ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।`];
  for (const turn of turns) {
    const before = angle;
    angle = applyTurnAnglePa(angle, turn);
    const sign = turn.sense === "CLOCKWISE" ? "+" : "−";
    const label = Number(turn.degrees) === 90
      ? `${turnSidePa(turn)} ਪਾਸੇ 90° ਮੋੜ`
      : Number(turn.degrees) === 180
        ? "ਪਿੱਛੇ ਵੱਲ 180° ਮੋੜ"
        : `${turnDirectionPhrasePa(turn)} ${Number(turn.degrees)}° ਘੁੰਮਾਅ`;
    steps.push(`${label}: ${before}° ${sign} ${Number(turn.degrees)}° = ${turn.sense === "CLOCKWISE" ? before + Number(turn.degrees) : before - Number(turn.degrees)}° ≡ ${angle}° (${directionPa(directionFromAnglePa(angle))})।`);
  }
  return steps;
}

export function reverseTurnCalculationStepsPa(finalFacing: unknown, turns: readonly R[]): string[] {
  let angle = directionAnglePa(finalFacing);
  const steps = [`ਅੰਤਿਮ ਦਿਸ਼ਾ ${directionPa(finalFacing)} ਹੈ, ਅਰਥਾਤ ${angle}°। ਹੁਣ ਮੋੜਾਂ ਨੂੰ ਉਲਟ ਕ੍ਰਮ ਵਿੱਚ ਵਾਪਸ ਲਿਆ ਜਾਂਦਾ ਹੈ।`];
  for (const turn of [...turns].reverse()) {
    const reverse = { ...turn, sense: turn.sense === "CLOCKWISE" ? "ANTICLOCKWISE" : "CLOCKWISE" };
    const before = angle;
    angle = applyTurnAnglePa(angle, reverse);
    const sign = reverse.sense === "CLOCKWISE" ? "+" : "−";
    steps.push(`${before}° ${sign} ${Number(turn.degrees)}° = ${reverse.sense === "CLOCKWISE" ? before + Number(turn.degrees) : before - Number(turn.degrees)}° ≡ ${angle}° (${directionPa(directionFromAnglePa(angle))})।`);
  }
  return steps;
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
  return `${namePa(match[1])}, ${namePa(match[3])} ਤੋਂ ${directionPa(canonical)} ਵੱਲ ਹੈ।`;
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
    [/Turn left/gi, "ਖੱਬੇ ਪਾਸੇ ਮੁੜੋ"], [/Turn right/gi, "ਸੱਜੇ ਪਾਸੇ ਮੁੜੋ"], [/Turn around/gi, "ਪਿੱਛੇ ਵੱਲ ਮੁੜੋ"], [/Continue straight/gi, "ਸਿੱਧੇ ਚੱਲਦੇ ਰਹੋ"],
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
    ["Start", "ਸ਼ੁਰੂਆਤੀ ਬਿੰਦੂ"], ["Finish", "ਅੰਤਿਮ ਬਿੰਦੂ"], ["Final", "ਅੰਤਿਮ"], ["movement", "ਚਾਲ"], ["Movement", "ਚਾਲ"],
    ["Sun", "ਸੂਰਜ"], ["Shadow", "ਪਰਛਾਂਵਾਂ"], ["Person", "ਵਿਅਕਤੀ"], ["Morning", "ਸਵੇਰ"], ["Evening", "ਸ਼ਾਮ"],
    ["Turn", "ਮੋੜ"], ["Reference", "ਦੂਜਾ ਬਿੰਦੂ"], ["Endpoint", "ਅੰਤਿਮ ਬਿੰਦੂ"], ["Static layout followed by movement", "ਸਥਿਰ ਨਕਸ਼ੇ ਤੋਂ ਬਾਅਦ ਚਾਲ"],
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
