export const NUM_CP001_EDITORIAL_V2 = true as const;

export type NumCp001EditorialLanguage = "en" | "hi" | "pa";
type State = Readonly<Record<string, unknown>>;

function num(state: State, key: string): number {
  const value = state[key];
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`Missing numeric state ${key}`);
  return value;
}

function bool(state: State, key: string): boolean {
  const value = state[key];
  if (typeof value !== "boolean") throw new Error(`Missing boolean state ${key}`);
  return value;
}

function text(state: State, key: string): string {
  const value = state[key];
  if (value === undefined || value === null) throw new Error(`Missing state ${key}`);
  return String(value);
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) [x, y] = [y, x % y];
  return x || 1;
}

function frac(numerator: number, denominator: number): string {
  const g = gcd(numerator, denominator);
  const n = numerator / g;
  const d = denominator / g;
  return d === 1 ? String(n) : `\\frac{${n}}{${d}}`;
}

function math(value: string): string {
  return `\\(${value}\\)`;
}

function factorial(value: number): number {
  let answer = 1;
  for (let n = 2; n <= value; n += 1) answer *= n;
  return answer;
}

function placeCorrect(correct: string, distractors: readonly string[], index: number) {
  if (distractors.length !== 3 || new Set([correct, ...distractors]).size !== 4) throw new Error("Invalid editorial options");
  const options = [...distractors];
  const correctIndex = Math.max(0, Math.min(3, index));
  options.splice(correctIndex, 0, correct);
  return { options: Object.freeze(options), correctIndex };
}

function explanation(concept: string, steps: readonly string[], answer: string) {
  return Object.freeze({
    coreConcept: Object.freeze([concept]),
    givenDataAndStrategy: Object.freeze([]),
    stepByStep: Object.freeze([...steps]),
    examSpeedMethod: Object.freeze([]),
    commonTraps: Object.freeze([]),
    finalAnswer: answer,
  });
}

function formattedValue(state: State): string {
  const representation = String(state.representation ?? "");
  if (representation === "INTEGER") return math(String(num(state, "value")));
  if (representation === "FRACTION") return math(frac(num(state, "numerator"), num(state, "denominator")));
  if (representation === "SQUARE_ROOT") return math(`\\sqrt{${num(state, "radicand")}}`);
  return "the given value";
}

function simplifyOption(value: string): string {
  const raw = value.trim();
  const root = raw.match(/^√(-?\d+)$/u);
  if (root) return math(`\\sqrt{${root[1]}}`);
  const fraction = raw.match(/^(-?\d+)\/(-?\d+)$/u);
  if (fraction) return math(frac(Number(fraction[1]), Number(fraction[2])));
  if (/^-?\d+(?:\.\d+)?$/u.test(raw)) return math(raw);
  if (/^[\dA-Da-z\s,+\-<>=().×²³]+$/u.test(raw) && /[\d<>=+\-×²³]/u.test(raw)) {
    const latex = raw.replace(/×/gu, "\\times").replace(/([A-Za-z0-9)]+)²/gu, "$1^{2}").replace(/([A-Za-z0-9)]+)³/gu, "$1^{3}");
    return math(latex);
  }
  return raw;
}

function translatedSurface(frozen: any) {
  const options = Object.freeze((frozen.options ?? []).map((option: any) => simplifyOption(String(option.value ?? option))));
  const correctIndex = Number(frozen.correctIndex);
  const answer = options[correctIndex] ?? String(frozen.canonicalAnswer);
  const core = Array.isArray(frozen.explanation?.coreConcept) ? frozen.explanation.coreConcept.map(String) : [];
  const steps = Array.isArray(frozen.explanation?.stepByStep) ? frozen.explanation.stepByStep.map(String).slice(0, 4) : [];
  return Object.freeze({
    stem: String(frozen.stem).replace(/√\s*(\d+)/gu, (_m, n) => math(`\\sqrt{${n}}`)),
    options,
    correctIndex,
    answer,
    canonicalAnswer: answer,
    verifierAnswer: answer,
    difficulty: String(frozen.difficulty),
    explanation: explanation(core[0] ?? "", steps, answer),
    editorialVersion: "NUM_CP001_EDITORIAL_V2" as const,
  });
}
