import type { IneQlId } from "./ine-001-authority";

export type IneLanguage = "en" | "hi" | "pa";
export type IneDifficulty = "Easy" | "Medium" | "Hard";
type Relation = ">" | "<" | "=" | ">=" | "<=";
type AtomicRelation = ">" | "<" | "=";

type Statement = Readonly<{ left: string; relation: Relation; right: string }>;
type Conclusion = Readonly<{ left: string; relation: Relation; right: string }>;

type World = Readonly<Record<string, number>>;

export interface GeneratedIne001Question {
  readonly qlId: IneQlId;
  readonly checkpointId: "INE-CP-001" | "INE-CP-002" | "INE-CP-003" | "INE-CP-004";
  readonly language: IneLanguage;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly difficulty: IneDifficulty;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly explanation: string;
  readonly proof: Readonly<{
    worldCount: number;
    conclusionI?: boolean;
    conclusionII?: boolean;
    exhaustiveEitherOr?: boolean;
    exactRelation?: string;
  }>;
  readonly metadata: Readonly<{
    sourceBackedCore: true;
    deterministic: true;
    solverVerified: true;
    reviewOnly: true;
  }>;
}

const SYMBOL_SETS = [
  ["P", "Q", "R", "S", "T"],
  ["A", "B", "C", "D", "E"],
  ["M", "N", "O", "P", "Q"],
  ["H", "J", "K", "L", "M"],
] as const;

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(values: readonly T[], seed: string): T {
  return values[hash(seed) % values.length]!;
}

function localeFor(language: IneLanguage): GeneratedIne001Question["locale"] {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function t(language: IneLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function relationHolds(left: number, relation: Relation, right: number): boolean {
  if (relation === ">") return left > right;
  if (relation === "<") return left < right;
  if (relation === "=") return left === right;
  if (relation === ">=") return left >= right;
  return left <= right;
}

function enumerateWorlds(symbols: readonly string[], statements: readonly Statement[]): World[] {
  const worlds: World[] = [];
  const maxRank = Math.max(2, symbols.length);
  const current: Record<string, number> = {};

  const visit = (index: number) => {
    if (index === symbols.length) {
      if (statements.every((s) => relationHolds(current[s.left]!, s.relation, current[s.right]!))) {
        worlds.push(Object.freeze({ ...current }));
      }
      return;
    }
    const symbol = symbols[index]!;
    for (let rank = 0; rank < maxRank; rank += 1) {
      current[symbol] = rank;
      visit(index + 1);
    }
  };

  visit(0);
  if (worlds.length === 0) throw new Error("INE-001 generated an inconsistent inequality graph.");
  return worlds;
}

function atomicRelation(world: World, left: string, right: string): AtomicRelation {
  return world[left]! > world[right]! ? ">" : world[left]! < world[right]! ? "<" : "=";
}

function exactRelation(worlds: readonly World[], left: string, right: string): AtomicRelation | "unknown" {
  const relations = new Set(worlds.map((world) => atomicRelation(world, left, right)));
  return relations.size === 1 ? [...relations][0]! : "unknown";
}

function conclusionFollows(worlds: readonly World[], conclusion: Conclusion): boolean {
  return worlds.every((world) => relationHolds(world[conclusion.left]!, conclusion.relation, world[conclusion.right]!));
}

function eitherOrIsExhaustive(worlds: readonly World[], first: Conclusion, second: Conclusion): boolean {
  const firstDefinite = conclusionFollows(worlds, first);
  const secondDefinite = conclusionFollows(worlds, second);
  if (firstDefinite || secondDefinite) return false;
  return worlds.every((world) =>
    relationHolds(world[first.left]!, first.relation, world[first.right]!) ||
    relationHolds(world[second.left]!, second.relation, world[second.right]!),
  );
}

function renderStatement(statement: Statement): string {
  return `${statement.left} ${statement.relation.replace(">=", "≥").replace("<=", "≤")} ${statement.right}`;
}

function renderConclusion(conclusion: Conclusion): string {
  return renderStatement(conclusion);
}

function conclusionOptions(language: IneLanguage): readonly string[] {
  return [
    t(language, "Only conclusion I follows", "केवल निष्कर्ष I अनुसरण करता है", "ਕੇਵਲ ਨਤੀਜਾ I ਨਿਕਲਦਾ ਹੈ"),
    t(language, "Only conclusion II follows", "केवल निष्कर्ष II अनुसरण करता है", "ਕੇਵਲ ਨਤੀਜਾ II ਨਿਕਲਦਾ ਹੈ"),
    t(language, "Both conclusions I and II follow", "निष्कर्ष I और II दोनों अनुसरण करते हैं", "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਨਿਕਲਦੇ ਹਨ"),
    t(language, "Either conclusion I or II follows", "निष्कर्ष I या II में से कोई एक अनुसरण करता है", "ਨਤੀਜਾ I ਜਾਂ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਨਿਕਲਦਾ ਹੈ"),
    t(language, "Neither conclusion I nor II follows", "न तो निष्कर्ष I और न ही II अनुसरण करता है", "ਨਾ ਨਤੀਜਾ I ਅਤੇ ਨਾ ਹੀ II ਨਿਕਲਦਾ ਹੈ"),
  ] as const;
}

function explanationForConclusionSet(
  language: IneLanguage,
  statements: readonly Statement[],
  first: Conclusion,
  second: Conclusion,
  firstFollows: boolean,
  secondFollows: boolean,
  answer: string,
): string {
  const chain = statements.map(renderStatement).join(", ");
  return t(
    language,
    `Use the inequality chain ${chain}. Conclusion I (${renderConclusion(first)}) is ${firstFollows ? "definite" : "not definite"}. Conclusion II (${renderConclusion(second)}) is ${secondFollows ? "definite" : "not definite"}. Hence, ${answer}.`,
    `असमानता श्रृंखला ${chain} का उपयोग करें। निष्कर्ष I (${renderConclusion(first)}) ${firstFollows ? "निश्चित है" : "निश्चित नहीं है"}। निष्कर्ष II (${renderConclusion(second)}) ${secondFollows ? "निश्चित है" : "निश्चित नहीं है"}। इसलिए, ${answer}।`,
    `ਅਸਮਾਨਤਾ ਲੜੀ ${chain} ਵਰਤੋ। ਨਤੀਜਾ I (${renderConclusion(first)}) ${firstFollows ? "ਨਿਸ਼ਚਿਤ ਹੈ" : "ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ"}। ਨਤੀਜਾ II (${renderConclusion(second)}) ${secondFollows ? "ਨਿਸ਼ਚਿਤ ਹੈ" : "ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ"}। ਇਸ ਲਈ, ${answer}।`,
  );
}

function buildQl001(seed: string, language: IneLanguage): GeneratedIne001Question {
  const symbols = [...pick(SYMBOL_SETS, seed + ":symbols")];
  const [a, b, c, d, e] = symbols;
  const variant = hash(seed + ":variant") % 4;
  let statements: Statement[];
  let left: string;
  let right: string;
  let difficulty: IneDifficulty;

  if (variant === 0) {
    statements = [
      { left: a!, relation: ">=", right: b! },
      { left: b!, relation: ">", right: c! },
      { left: c!, relation: "=", right: d! },
    ];
    left = a!; right = d!; difficulty = "Easy";
  } else if (variant === 1) {
    statements = [
      { left: a!, relation: "<=", right: b! },
      { left: b!, relation: "<", right: c! },
      { left: c!, relation: "=", right: d! },
    ];
    left = a!; right = d!; difficulty = "Easy";
  } else if (variant === 2) {
    statements = [
      { left: a!, relation: ">", right: b! },
      { left: b!, relation: ">=", right: c! },
      { left: c!, relation: ">", right: d! },
      { left: d!, relation: "=", right: e! },
    ];
    left = a!; right = e!; difficulty = "Medium";
  } else {
    statements = [
      { left: a!, relation: ">", right: c! },
      { left: b!, relation: ">", right: c! },
      { left: c!, relation: ">=", right: d! },
    ];
    left = a!; right = b!; difficulty = "Medium";
  }

  const worlds = enumerateWorlds(symbols, statements);
  const relation = exactRelation(worlds, left, right);
  const relationText = relation === "unknown"
    ? t(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ")
    : `${left} ${relation} ${right}`;
  const options = [
    `${left} > ${right}`,
    `${left} < ${right}`,
    `${left} = ${right}`,
    t(language, "Cannot be determined", "निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"),
  ];
  const correctIndex = options.indexOf(relationText);
  if (correctIndex < 0) throw new Error("INE-QL-001 option contract failed.");

  const chain = statements.map(renderStatement).join(", ");
  const stem = t(
    language,
    `${chain}. What is the relation between ${left} and ${right}?`,
    `${chain}। ${left} और ${right} के बीच क्या संबंध है?`,
    `${chain}। ${left} ਅਤੇ ${right} ਵਿਚਕਾਰ ਕੀ ਸੰਬੰਧ ਹੈ?`,
  );
  const explanation = relation === "unknown"
    ? t(
        language,
        `The statements do not fix a unique relation between ${left} and ${right}. Therefore, the relation cannot be determined.`,
        `दिए गए कथन ${left} और ${right} के बीच एक निश्चित संबंध तय नहीं करते। इसलिए संबंध निर्धारित नहीं किया जा सकता।`,
        `ਦਿੱਤੇ ਬਿਆਨ ${left} ਅਤੇ ${right} ਵਿਚਕਾਰ ਇੱਕ ਨਿਸ਼ਚਿਤ ਸੰਬੰਧ ਤੈਅ ਨਹੀਂ ਕਰਦੇ। ਇਸ ਲਈ ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।`,
      )
    : t(
        language,
        `Combine the chain ${chain}. It gives ${left} ${relation} ${right}. Hence, ${relationText}.`,
        `${chain} को जोड़ने पर ${left} ${relation} ${right} मिलता है। इसलिए, ${relationText}।`,
        `${chain} ਨੂੰ ਜੋੜਨ ਨਾਲ ${left} ${relation} ${right} ਮਿਲਦਾ ਹੈ। ਇਸ ਲਈ, ${relationText}।`,
      );

  return Object.freeze({
    qlId: "INE-QL-001",
    checkpointId: "INE-CP-001",
    language,
    locale: localeFor(language),
    difficulty,
    stem,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: relation,
    explanation,
    proof: Object.freeze({ worldCount: worlds.length, exactRelation: relation }),
    metadata: Object.freeze({ sourceBackedCore: true, deterministic: true, solverVerified: true, reviewOnly: true }),
  });
}

function classifyConclusionSet(first: boolean, second: boolean): 0 | 1 | 2 | 4 {
  return first && second ? 2 : first ? 0 : second ? 1 : 4;
}

function buildQl002(seed: string, language: IneLanguage): GeneratedIne001Question {
  const symbols = [...pick(SYMBOL_SETS, seed + ":symbols")];
  const [a, b, c, d] = symbols;
  const variant = hash(seed + ":variant") % 4;
  const statements: Statement[] = [
    { left: a!, relation: ">=", right: b! },
    { left: b!, relation: ">", right: c! },
    { left: c!, relation: "=", right: d! },
  ];
  let first: Conclusion;
  let second: Conclusion;
  if (variant === 0) {
    first = { left: a!, relation: ">", right: d! };
    second = { left: b!, relation: "<=", right: d! };
  } else if (variant === 1) {
    first = { left: d!, relation: ">=", right: a! };
    second = { left: b!, relation: ">", right: d! };
  } else if (variant === 2) {
    first = { left: a!, relation: ">", right: c! };
    second = { left: b!, relation: ">=", right: d! };
  } else {
    first = { left: d!, relation: ">", right: a! };
    second = { left: c!, relation: ">", right: b! };
  }
  const worlds = enumerateWorlds(symbols, statements);
  const firstFollows = conclusionFollows(worlds, first);
  const secondFollows = conclusionFollows(worlds, second);
  const options = [...conclusionOptions(language)];
  const correctIndex = classifyConclusionSet(firstFollows, secondFollows);
  const chain = statements.map(renderStatement).join(", ");
  const answer = options[correctIndex]!;
  const stem = t(
    language,
    `Statements: ${chain}. Conclusions: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}. Which conclusion(s) follow(s)?`,
    `कथन: ${chain}। निष्कर्ष: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}। कौन-सा/से निष्कर्ष अनुसरण करता/करते हैं?`,
    `ਬਿਆਨ: ${chain}। ਨਤੀਜੇ: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}। ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਨਿਕਲਦੇ ਹਨ?`,
  );
  return Object.freeze({
    qlId: "INE-QL-002",
    checkpointId: "INE-CP-002",
    language,
    locale: localeFor(language),
    difficulty: variant === 3 ? "Hard" : "Medium",
    stem,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: answer,
    explanation: explanationForConclusionSet(language, statements, first, second, firstFollows, secondFollows, answer),
    proof: Object.freeze({ worldCount: worlds.length, conclusionI: firstFollows, conclusionII: secondFollows }),
    metadata: Object.freeze({ sourceBackedCore: true, deterministic: true, solverVerified: true, reviewOnly: true }),
  });
}

function buildQl003(seed: string, language: IneLanguage): GeneratedIne001Question {
  const symbols = [...pick(SYMBOL_SETS, seed + ":symbols")];
  const [a, b, c, d] = symbols;
  const reverse = (hash(seed + ":reverse") & 1) === 1;
  const statements: Statement[] = reverse
    ? [
        { left: c!, relation: ">", right: a! },
        { left: c!, relation: ">", right: b! },
        { left: a!, relation: ">=", right: d! },
        { left: b!, relation: ">=", right: d! },
      ]
    : [
        { left: a!, relation: ">", right: c! },
        { left: b!, relation: ">", right: c! },
        { left: c!, relation: ">=", right: d! },
      ];
  const first: Conclusion = reverse
    ? { left: a!, relation: "<", right: b! }
    : { left: a!, relation: ">", right: b! };
  const second: Conclusion = reverse
    ? { left: a!, relation: ">=", right: b! }
    : { left: a!, relation: "<=", right: b! };
  const worlds = enumerateWorlds(symbols, statements);
  const firstFollows = conclusionFollows(worlds, first);
  const secondFollows = conclusionFollows(worlds, second);
  const exhaustive = eitherOrIsExhaustive(worlds, first, second);
  if (!exhaustive) throw new Error("INE-QL-003 either-or proof failed.");
  const options = [...conclusionOptions(language)];
  const correctIndex = 3;
  const answer = options[correctIndex]!;
  const chain = statements.map(renderStatement).join(", ");
  const stem = t(
    language,
    `Statements: ${chain}. Conclusions: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}. Which conclusion(s) follow(s)?`,
    `कथन: ${chain}। निष्कर्ष: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}। कौन-सा/से निष्कर्ष अनुसरण करता/करते हैं?`,
    `ਬਿਆਨ: ${chain}। ਨਤੀਜੇ: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}। ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਨਿਕਲਦੇ ਹਨ?`,
  );
  const explanation = t(
    language,
    `The statements do not fix the relation between ${a} and ${b}. Conclusion I and conclusion II are complementary: one of them must be true, but neither is individually definite. Hence, ${answer}.`,
    `कथन ${a} और ${b} के बीच संबंध को निश्चित नहीं करते। निष्कर्ष I और II एक-दूसरे के पूरक हैं; दोनों में से एक अवश्य सही होगा, पर कोई भी अकेले निश्चित नहीं है। इसलिए, ${answer}।`,
    `ਬਿਆਨ ${a} ਅਤੇ ${b} ਵਿਚਕਾਰ ਸੰਬੰਧ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕਰਦੇ। ਨਤੀਜੇ I ਅਤੇ II ਇਕ-ਦੂਜੇ ਦੇ ਪੂਰਕ ਹਨ; ਦੋਵਾਂ ਵਿੱਚੋਂ ਇੱਕ ਜ਼ਰੂਰ ਸਹੀ ਹੋਵੇਗਾ, ਪਰ ਕੋਈ ਵੀ ਇਕੱਲਾ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ। ਇਸ ਲਈ, ${answer}।`,
  );
  return Object.freeze({
    qlId: "INE-QL-003",
    checkpointId: "INE-CP-003",
    language,
    locale: localeFor(language),
    difficulty: reverse ? "Hard" : "Medium",
    stem,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: answer,
    explanation,
    proof: Object.freeze({ worldCount: worlds.length, conclusionI: firstFollows, conclusionII: secondFollows, exhaustiveEitherOr: exhaustive }),
    metadata: Object.freeze({ sourceBackedCore: true, deterministic: true, solverVerified: true, reviewOnly: true }),
  });
}

const CODE_TOKENS = ["@", "#", "$", "%", "&"] as const;
const CODE_RELATIONS: readonly Relation[] = [">=", ">", "=", "<", "<="];

function codedDefinition(language: IneLanguage, token: string, relation: Relation): string {
  const display = relation.replace(">=", "≥").replace("<=", "≤");
  return t(
    language,
    `A ${token} B means A ${display} B`,
    `A ${token} B का अर्थ A ${display} B है`,
    `A ${token} B ਦਾ ਅਰਥ A ${display} B ਹੈ`,
  );
}

function buildQl004(seed: string, language: IneLanguage): GeneratedIne001Question {
  const symbols = [...pick(SYMBOL_SETS, seed + ":symbols")];
  const [a, b, c, d] = symbols;
  const shift = hash(seed + ":code-shift") % CODE_TOKENS.length;
  const tokenFor = new Map<Relation, string>();
  CODE_RELATIONS.forEach((relation, index) => tokenFor.set(relation, CODE_TOKENS[(index + shift) % CODE_TOKENS.length]!));

  const reverse = (hash(seed + ":shape") & 1) === 1;
  const statements: Statement[] = reverse
    ? [
        { left: a!, relation: "<=", right: b! },
        { left: b!, relation: "<", right: c! },
        { left: c!, relation: "=", right: d! },
      ]
    : [
        { left: a!, relation: ">=", right: b! },
        { left: b!, relation: ">", right: c! },
        { left: c!, relation: "=", right: d! },
      ];
  const first: Conclusion = reverse
    ? { left: a!, relation: "<", right: d! }
    : { left: a!, relation: ">", right: d! };
  const second: Conclusion = reverse
    ? { left: b!, relation: ">=", right: d! }
    : { left: b!, relation: "<=", right: d! };

  const worlds = enumerateWorlds(symbols, statements);
  const firstFollows = conclusionFollows(worlds, first);
  const secondFollows = conclusionFollows(worlds, second);
  const options = [...conclusionOptions(language)];
  const correctIndex = classifyConclusionSet(firstFollows, secondFollows);
  const answer = options[correctIndex]!;
  const definitions = CODE_RELATIONS.map((relation) => codedDefinition(language, tokenFor.get(relation)!, relation)).join("; ");
  const codedChain = statements.map((statement) => `${statement.left} ${tokenFor.get(statement.relation)} ${statement.right}`).join(", ");
  const stem = t(
    language,
    `In the following coded inequality, ${definitions}. Statement: ${codedChain}. Conclusions: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}. Which conclusion(s) follow(s)?`,
    `निम्न कूटबद्ध असमानता में, ${definitions}। कथन: ${codedChain}। निष्कर्ष: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}। कौन-सा/से निष्कर्ष अनुसरण करता/करते हैं?`,
    `ਹੇਠਾਂ ਦਿੱਤੀ ਕੂਟਬੱਧ ਅਸਮਾਨਤਾ ਵਿੱਚ, ${definitions}। ਬਿਆਨ: ${codedChain}। ਨਤੀਜੇ: I. ${renderConclusion(first)}  II. ${renderConclusion(second)}। ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਨਿਕਲਦੇ ਹਨ?`,
  );
  const explanation = t(
    language,
    `Decode the symbols first. The coded statement becomes ${statements.map(renderStatement).join(", ")}. Conclusion I is ${firstFollows ? "definite" : "not definite"} and conclusion II is ${secondFollows ? "definite" : "not definite"}. Hence, ${answer}.`,
    `पहले कूट संकेतों को सामान्य चिन्हों में बदलें। कथन ${statements.map(renderStatement).join(", ")} बनता है। निष्कर्ष I ${firstFollows ? "निश्चित है" : "निश्चित नहीं है"} और निष्कर्ष II ${secondFollows ? "निश्चित है" : "निश्चित नहीं है"}। इसलिए, ${answer}।`,
    `ਪਹਿਲਾਂ ਕੂਟ ਚਿੰਨ੍ਹਾਂ ਨੂੰ ਆਮ ਚਿੰਨ੍ਹਾਂ ਵਿੱਚ ਬਦਲੋ। ਬਿਆਨ ${statements.map(renderStatement).join(", ")} ਬਣਦਾ ਹੈ। ਨਤੀਜਾ I ${firstFollows ? "ਨਿਸ਼ਚਿਤ ਹੈ" : "ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ"} ਅਤੇ ਨਤੀਜਾ II ${secondFollows ? "ਨਿਸ਼ਚਿਤ ਹੈ" : "ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਹੈ"}। ਇਸ ਲਈ, ${answer}।`,
  );

  return Object.freeze({
    qlId: "INE-QL-004",
    checkpointId: "INE-CP-004",
    language,
    locale: localeFor(language),
    difficulty: reverse ? "Hard" : "Medium",
    stem,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: answer,
    explanation,
    proof: Object.freeze({ worldCount: worlds.length, conclusionI: firstFollows, conclusionII: secondFollows }),
    metadata: Object.freeze({ sourceBackedCore: true, deterministic: true, solverVerified: true, reviewOnly: true }),
  });
}

export function generateIne001Question(
  qlId: IneQlId,
  seed: string,
  language: IneLanguage = "en",
): GeneratedIne001Question {
  if (!seed.trim()) throw new Error("INE-001 seed must be non-empty.");
  if (qlId === "INE-QL-001") return buildQl001(seed, language);
  if (qlId === "INE-QL-002") return buildQl002(seed, language);
  if (qlId === "INE-QL-003") return buildQl003(seed, language);
  return buildQl004(seed, language);
}
