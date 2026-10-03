import {
  sea002AdvancedAuthority,
  type Sea002AdvancedQlId,
} from "./advanced-authority.ts";

export type Sea002AdvancedLanguage = "en" | "hi" | "pa";
export type Sea002AdvancedDifficulty = "Medium" | "Hard";
type Facing = "IN" | "OUT";
type Ring = "INNER" | "OUTER";
type RectRole = "CORNER" | "SIDE";

type Localized = Readonly<{ en: string; hi: string; pa: string }>;
type Person = Readonly<{ id: string; label: Localized }>;

type PolygonWorld = Readonly<{
  order: readonly string[];
  facingByPerson?: Readonly<Record<string, Facing>>;
}>;

type ConcentricWorld = Readonly<{
  inner: readonly string[];
  outer: readonly string[];
  facingByPerson?: Readonly<Record<string, Facing>>;
}>;

type PolygonClue =
  | Readonly<{ kind: "ADJACENT"; a: string; b: string }>
  | Readonly<{ kind: "OPPOSITE"; a: string; b: string }>
  | Readonly<{ kind: "LEFT_OF"; a: string; b: string; steps: 1 | 2 | 3 }>
  | Readonly<{ kind: "RIGHT_OF"; a: string; b: string; steps: 1 | 2 | 3 }>
  | Readonly<{ kind: "ROLE"; person: string; role: RectRole }>
  | Readonly<{ kind: "FACING"; person: string; facing: Facing }>
  | Readonly<{ kind: "SAME_FACING"; a: string; b: string }>
  | Readonly<{ kind: "OPPOSITE_FACING"; a: string; b: string }>;

type ConcentricClue =
  | Readonly<{ kind: "FACES"; a: string; b: string }>
  | Readonly<{ kind: "ADJACENT"; a: string; b: string }>
  | Readonly<{ kind: "LEFT_OF"; a: string; b: string; steps: 1 | 2 }>
  | Readonly<{ kind: "RIGHT_OF"; a: string; b: string; steps: 1 | 2 }>
  | Readonly<{ kind: "OPPOSITE"; a: string; b: string }>
  | Readonly<{ kind: "RING"; person: string; ring: Ring }>
  | Readonly<{ kind: "FACING"; person: string; facing: Facing }>
  | Readonly<{ kind: "SAME_FACING"; a: string; b: string }>
  | Readonly<{ kind: "OPPOSITE_FACING"; a: string; b: string }>;

export interface Sea002AdvancedGeneratedQuestion {
  readonly packageId: "SEA-002";
  readonly qlId: Sea002AdvancedQlId;
  readonly checkpointId: "SEA-CP-009" | "SEA-CP-010";
  readonly language: Sea002AdvancedLanguage;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly difficulty: Sea002AdvancedDifficulty;
  readonly seed: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly explanation: string;
  readonly proof: Readonly<{
    worldCountBefore: number;
    worldCountAfter: 1;
    uniqueSolution: true;
    clueCount: number;
    targetFingerprint: string;
    solvedFingerprint: string;
    symmetryNormalization: string;
  }>;
  readonly metadata: Readonly<{
    deterministic: true;
    exactFiniteEnumeration: true;
    solverVerified: true;
    sourceBackedCore: true;
    reviewOnly: true;
  }>;
}

const PEOPLE: readonly Person[] = Object.freeze([
  { id: "AMAN", label: { en: "Aman", hi: "अमन", pa: "ਅਮਨ" } },
  { id: "BHARAT", label: { en: "Bharat", hi: "भरत", pa: "ਭਰਤ" } },
  { id: "CHARU", label: { en: "Charu", hi: "चारु", pa: "ਚਾਰੂ" } },
  { id: "DEEPA", label: { en: "Deepa", hi: "दीपा", pa: "ਦੀਪਾ" } },
  { id: "FARHAN", label: { en: "Farhan", hi: "फरहान", pa: "ਫਰਹਾਨ" } },
  { id: "GAURI", label: { en: "Gauri", hi: "गौरी", pa: "ਗੌਰੀ" } },
  { id: "HARISH", label: { en: "Harish", hi: "हरीश", pa: "ਹਰੀਸ਼" } },
  { id: "ISHA", label: { en: "Isha", hi: "ईशा", pa: "ਈਸ਼ਾ" } },
  { id: "KARAN", label: { en: "Karan", hi: "करण", pa: "ਕਰਨ" } },
  { id: "MEERA", label: { en: "Meera", hi: "मीरा", pa: "ਮੀਰਾ" } },
  { id: "NITIN", label: { en: "Nitin", hi: "नितिन", pa: "ਨਿਤਿਨ" } },
  { id: "POOJA", label: { en: "Pooja", hi: "पूजा", pa: "ਪੂਜਾ" } },
]);

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function t(language: Sea002AdvancedLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function localeFor(language: Sea002AdvancedLanguage): Sea002AdvancedGeneratedQuestion["locale"] {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function label(id: string, language: Sea002AdvancedLanguage): string {
  const person = PEOPLE.find((item) => item.id === id);
  if (!person) throw new Error("Unknown SEA-002 person: " + id);
  return person.label[language];
}

function shuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

function permutations<T>(items: readonly T[]): T[][] {
  if (items.length <= 1) return [items.slice()];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += 1) {
    const head = items[i]!;
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const tail of permutations(rest)) out.push([head, ...tail]);
  }
  return out;
}

function combinations<T>(items: readonly T[], count: number): T[][] {
  if (count === 0) return [[]];
  if (items.length < count) return [];
  const out: T[][] = [];
  for (let i = 0; i <= items.length - count; i += 1) {
    const head = items[i]!;
    for (const tail of combinations(items.slice(i + 1), count - 1)) {
      out.push([head, ...tail]);
    }
  }
  return out;
}

function choosePeople(seed: string, count: number): string[] {
  return shuffle(PEOPLE.map((person) => person.id), seed + ":people").slice(0, count);
}

function personList(ids: readonly string[], language: Sea002AdvancedLanguage): string {
  const names = ids.map((id) => label(id, language));
  const and = t(language, "and", "और", "ਅਤੇ");
  return names.slice(0, -1).join(", ") + " " + and + " " + names[names.length - 1];
}

function mod(value: number, size: number): number {
  return ((value % size) + size) % size;
}

function polygonIndex(world: PolygonWorld, person: string): number {
  const index = world.order.indexOf(person);
  if (index < 0) throw new Error("Person missing from polygon world: " + person);
  return index;
}

function rectRole(index: number): RectRole {
  return index % 2 === 0 ? "CORNER" : "SIDE";
}

function polygonFacing(
  world: PolygonWorld,
  person: string,
  mode: "UNIFORM_IN" | "UNIFORM_OUT" | "ROLE_DERIVED" | "MIXED",
): Facing {
  if (mode === "UNIFORM_IN") return "IN";
  if (mode === "UNIFORM_OUT") return "OUT";
  if (mode === "ROLE_DERIVED") return rectRole(polygonIndex(world, person)) === "CORNER" ? "IN" : "OUT";
  const facing = world.facingByPerson?.[person];
  if (!facing) throw new Error("Mixed-facing polygon world is missing facing for " + person);
  return facing;
}

function leftIndex(index: number, facing: Facing, steps: number, size: number): number {
  return mod(index + (facing === "IN" ? steps : -steps), size);
}

function rightIndex(index: number, facing: Facing, steps: number, size: number): number {
  return mod(index + (facing === "IN" ? -steps : steps), size);
}

function polygonFingerprint(world: PolygonWorld, includeFacing: boolean): string {
  const base = world.order.join(">");
  if (!includeFacing) return base;
  return base + "|" + [...world.order].sort().map((person) => person + ":" + world.facingByPerson?.[person]).join(",");
}

function polygonWorlds(
  people: readonly string[],
  mixedFacing: boolean,
): PolygonWorld[] {
  const anchor = people[0]!;
  const orders = permutations(people.slice(1)).map((rest) => [anchor, ...rest]);
  if (!mixedFacing) return orders.map((order) => ({ order }));
  const worlds: PolygonWorld[] = [];
  for (const order of orders) {
    for (let mask = 0; mask < (1 << people.length); mask += 1) {
      const facingByPerson: Record<string, Facing> = {};
      people.forEach((person, index) => {
        facingByPerson[person] = (mask & (1 << index)) !== 0 ? "IN" : "OUT";
      });
      worlds.push({ order, facingByPerson });
    }
  }
  return worlds;
}

function polygonTruth(
  world: PolygonWorld,
  clue: PolygonClue,
  mode: "UNIFORM_IN" | "UNIFORM_OUT" | "ROLE_DERIVED" | "MIXED",
): boolean {
  const size = world.order.length;
  const a = polygonIndex(world, clue.kind === "ROLE" || clue.kind === "FACING" ? clue.person : clue.a);
  if (clue.kind === "ROLE") return rectRole(a) === clue.role;
  if (clue.kind === "FACING") return polygonFacing(world, clue.person, mode) === clue.facing;
  const b = polygonIndex(world, clue.b);
  if (clue.kind === "ADJACENT") return mod(a - b, size) === 1 || mod(b - a, size) === 1;
  if (clue.kind === "OPPOSITE") return size % 2 === 0 && mod(a - b, size) === size / 2;
  if (clue.kind === "SAME_FACING") return polygonFacing(world, clue.a, mode) === polygonFacing(world, clue.b, mode);
  if (clue.kind === "OPPOSITE_FACING") return polygonFacing(world, clue.a, mode) !== polygonFacing(world, clue.b, mode);
  const facing = polygonFacing(world, clue.b, mode);
  if (clue.kind === "LEFT_OF") return a === leftIndex(b, facing, clue.steps, size);
  return a === rightIndex(b, facing, clue.steps, size);
}

function dedupeClues<C>(clues: readonly C[]): C[] {
  const map = new Map<string, C>();
  for (const clue of clues) map.set(JSON.stringify(clue), clue);
  return [...map.values()];
}

function polygonCandidates(
  target: PolygonWorld,
  mode: "UNIFORM_IN" | "UNIFORM_OUT" | "ROLE_DERIVED" | "MIXED",
  rectangle: boolean,
): PolygonClue[] {
  const people = [...target.order];
  const size = people.length;
  const out: PolygonClue[] = [];
  for (const person of people) {
    if (rectangle) out.push({ kind: "ROLE", person, role: rectRole(polygonIndex(target, person)) });
    if (mode === "MIXED") out.push({ kind: "FACING", person, facing: polygonFacing(target, person, mode) });
  }
  for (let i = 0; i < people.length; i += 1) {
    for (let j = i + 1; j < people.length; j += 1) {
      const a = people[i]!, b = people[j]!;
      if (polygonTruth(target, { kind: "ADJACENT", a, b }, mode)) out.push({ kind: "ADJACENT", a, b });
      if (polygonTruth(target, { kind: "OPPOSITE", a, b }, mode)) out.push({ kind: "OPPOSITE", a, b });
      if (mode === "MIXED") {
        const same = polygonFacing(target, a, mode) === polygonFacing(target, b, mode);
        out.push({ kind: same ? "SAME_FACING" : "OPPOSITE_FACING", a, b } as PolygonClue);
      }
    }
  }
  for (const a of people) for (const b of people) {
    if (a === b) continue;
    for (const steps of [1, 2, 3] as const) {
      const left: PolygonClue = { kind: "LEFT_OF", a, b, steps };
      const right: PolygonClue = { kind: "RIGHT_OF", a, b, steps };
      if (steps < size && polygonTruth(target, left, mode)) out.push(left);
      if (steps < size && polygonTruth(target, right, mode)) out.push(right);
    }
  }
  return dedupeClues(out);
}

function cluePriority(clue: PolygonClue | ConcentricClue): number {
  if (clue.kind === "LEFT_OF" || clue.kind === "RIGHT_OF") return 0;
  if (clue.kind === "FACES" || clue.kind === "OPPOSITE") return 1;
  if (clue.kind === "ADJACENT") return 2;
  if (clue.kind === "SAME_FACING" || clue.kind === "OPPOSITE_FACING") return 3;
  if (clue.kind === "ROLE" || clue.kind === "RING") return 4;
  return 5;
}

function selectUniqueClues<W, C extends PolygonClue | ConcentricClue>(
  worlds: readonly W[],
  target: W,
  candidates: readonly C[],
  truth: (world: W, clue: C) => boolean,
  fingerprint: (world: W) => string,
  seed: string,
  minClues: number,
): { clues: C[]; solved: W } {
  let remaining = [...worlds];
  const ordered = [...candidates].sort((a, b) => {
    const priority = cluePriority(a) - cluePriority(b);
    if (priority !== 0) return priority;
    return (hash(seed + JSON.stringify(a)) % 100000) - (hash(seed + JSON.stringify(b)) % 100000);
  });
  const chosen: C[] = [];
  for (const clue of ordered) {
    if (!truth(target, clue)) continue;
    const next = remaining.filter((world) => truth(world, clue));
    if (next.length === 0 || next.length >= remaining.length) continue;
    chosen.push(clue);
    remaining = next;
    if (remaining.length === 1 && chosen.length >= minClues) break;
  }
  if (remaining.length !== 1 || fingerprint(remaining[0]!) !== fingerprint(target)) {
    throw new Error("SEA-002 clue synthesis failed uniqueness: remaining=" + remaining.length);
  }
  if (chosen.length < minClues) {
    for (const clue of ordered) {
      if (chosen.includes(clue) || !truth(target, clue)) continue;
      chosen.push(clue);
      if (chosen.length >= minClues) break;
    }
  }
  return { clues: chosen, solved: remaining[0]! };
}

function ordinal(steps: number, language: Sea002AdvancedLanguage): string {
  if (language === "en") return steps === 1 ? "immediately" : steps === 2 ? "second" : "third";
  if (language === "hi") return steps === 1 ? "ठीक" : steps === 2 ? "दूसरे" : "तीसरे";
  return steps === 1 ? "ਬਿਲਕੁਲ" : steps === 2 ? "ਦੂਜੇ" : "ਤੀਜੇ";
}

function renderPolygonClue(clue: PolygonClue, language: Sea002AdvancedLanguage): string {
  const p = (id: string) => label(id, language);
  if (clue.kind === "ADJACENT") {
    return t(language, `${p(clue.a)} sits next to ${p(clue.b)}.`, `${p(clue.a)}, ${p(clue.b)} के पास बैठता/बैठती है।`, `${p(clue.a)}, ${p(clue.b)} ਦੇ ਨਾਲ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
  }
  if (clue.kind === "OPPOSITE") {
    return t(language, `${p(clue.a)} sits opposite ${p(clue.b)}.`, `${p(clue.a)}, ${p(clue.b)} के सामने बैठता/बैठती है।`, `${p(clue.a)}, ${p(clue.b)} ਦੇ ਸਾਹਮਣੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
  }
  if (clue.kind === "ROLE") {
    const role = clue.role === "CORNER"
      ? t(language, "a corner", "एक कोने", "ਇੱਕ ਕੋਨੇ")
      : t(language, "the middle of a side", "किसी भुजा के मध्य", "ਕਿਸੇ ਪਾਸੇ ਦੇ ਵਿਚਕਾਰ");
    return t(language, `${p(clue.person)} sits at ${role}.`, `${p(clue.person)} ${role} पर बैठता/बैठती है।`, `${p(clue.person)} ${role} ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
  }
  if (clue.kind === "FACING") {
    const direction = clue.facing === "IN"
      ? t(language, "the centre", "केंद्र", "ਕੇਂਦਰ")
      : t(language, "away from the centre", "केंद्र से बाहर", "ਕੇਂਦਰ ਤੋਂ ਬਾਹਰ");
    return t(language, `${p(clue.person)} faces ${direction}.`, `${p(clue.person)} ${direction} की ओर मुख करता/करती है।`, `${p(clue.person)} ${direction} ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ।`);
  }
  if (clue.kind === "SAME_FACING" || clue.kind === "OPPOSITE_FACING") {
    const same = clue.kind === "SAME_FACING";
    return t(
      language,
      `${p(clue.a)} and ${p(clue.b)} face ${same ? "the same direction" : "opposite directions"}.`,
      `${p(clue.a)} और ${p(clue.b)} ${same ? "एक ही दिशा" : "विपरीत दिशाओं"} की ओर मुख करते हैं।`,
      `${p(clue.a)} ਅਤੇ ${p(clue.b)} ${same ? "ਇੱਕੋ ਦਿਸ਼ਾ" : "ਉਲਟ ਦਿਸ਼ਾਵਾਂ"} ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।`,
    );
  }
  const direction = clue.kind === "LEFT_OF"
    ? t(language, "left", "बाएँ", "ਖੱਬੇ")
    : t(language, "right", "दाएँ", "ਸੱਜੇ");
  if (clue.steps === 1) {
    return t(
      language,
      `${p(clue.a)} sits immediately to the ${direction} of ${p(clue.b)}.`,
      `${p(clue.a)}, ${p(clue.b)} के ठीक ${direction} बैठता/बैठती है।`,
      `${p(clue.a)}, ${p(clue.b)} ਦੇ ਬਿਲਕੁਲ ${direction} ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`,
    );
  }
  return t(
    language,
    `${p(clue.a)} sits ${ordinal(clue.steps, language)} to the ${direction} of ${p(clue.b)}.`,
    `${p(clue.a)}, ${p(clue.b)} के ${ordinal(clue.steps, language)} ${direction} बैठता/बैठती है।`,
    `${p(clue.a)}, ${p(clue.b)} ਦੇ ${ordinal(clue.steps, language)} ${direction} ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`,
  );
}

function polygonTable(world: PolygonWorld, language: Sea002AdvancedLanguage, mode: "UNIFORM_IN" | "UNIFORM_OUT" | "ROLE_DERIVED" | "MIXED"): string {
  const rows = world.order.map((person, index) =>
    `| ${index + 1} | ${label(person, language)} | ${polygonFacing(world, person, mode) === "IN" ? t(language, "Centre", "केंद्र", "ਕੇਂਦਰ") : t(language, "Outside", "बाहर", "ਬਾਹਰ")} |`,
  );
  return [
    t(language, "| Position | Person | Facing |", "| स्थान | व्यक्ति | दिशा |", "| ਸਥਾਨ | ਵਿਅਕਤੀ | ਮੂੰਹ |"),
    "|---:|---|---|",
    ...rows,
  ].join("\n");
}

function buildPolygonQuestion(
  qlId: "SEA-QL-036" | "SEA-QL-037" | "SEA-QL-038" | "SEA-QL-039",
  seed: string,
  language: Sea002AdvancedLanguage,
  difficulty: Sea002AdvancedDifficulty,
): Sea002AdvancedGeneratedQuestion {
  const rectangle = qlId === "SEA-QL-036" || qlId === "SEA-QL-037";
  const mixed = qlId === "SEA-QL-039";
  const size = rectangle ? 8 : 6;
  const people = choosePeople(seed + ":polygon", size);
  const mode: "UNIFORM_IN" | "UNIFORM_OUT" | "ROLE_DERIVED" | "MIXED" =
    qlId === "SEA-QL-037" ? "ROLE_DERIVED"
      : mixed ? "MIXED"
      : hash(seed + ":uniform-facing") % 2 === 0 ? "UNIFORM_IN" : "UNIFORM_OUT";

  const anchor = people[0]!;
  const rest = shuffle(people.slice(1), seed + ":target-order");
  const targetOrder = [anchor, ...rest];
  const facingByPerson: Record<string, Facing> | undefined = mixed ? {} : undefined;
  if (mixed && facingByPerson) {
    for (const person of people) {
      facingByPerson[person] = hash(seed + ":face:" + person) % 2 === 0 ? "IN" : "OUT";
    }
    if (new Set(Object.values(facingByPerson)).size === 1) {
      facingByPerson[people[1]!] = facingByPerson[people[1]!] === "IN" ? "OUT" : "IN";
    }
  }
  const target: PolygonWorld = { order: targetOrder, facingByPerson };
  const worlds = polygonWorlds(people, mixed);
  const candidates = polygonCandidates(target, mode, rectangle);
  const selected = selectUniqueClues(
    worlds,
    target,
    candidates,
    (world, clue) => polygonTruth(world, clue, mode),
    (world) => polygonFingerprint(world, mixed),
    seed + ":clue-select",
    rectangle ? 6 : mixed ? 6 : 5,
  );
  const anchorRoleClue: PolygonClue | null = rectangle
    ? { kind: "ROLE", person: anchor, role: rectRole(polygonIndex(target, anchor)) }
    : null;
  const selectedClues = anchorRoleClue && !selected.clues.some((clue) =>
    clue.kind === "ROLE" && clue.person === anchor)
    ? [anchorRoleClue, ...selected.clues]
    : selected.clues;

  const reference = people[hash(seed + ":query-reference") % people.length]!;
  const querySteps = (hash(seed + ":query-steps") % 2 + 1) as 1 | 2;
  const queryLeft = hash(seed + ":query-direction") % 2 === 0;
  const referenceIndex = polygonIndex(target, reference);
  const referenceFacing = polygonFacing(target, reference, mode);
  const answerIndex = queryLeft
    ? leftIndex(referenceIndex, referenceFacing, querySteps, size)
    : rightIndex(referenceIndex, referenceFacing, querySteps, size);
  const answerId = target.order[answerIndex]!;
  const correct = label(answerId, language);
  const distractors = shuffle(
    people.filter((person) => person !== answerId).map((person) => label(person, language)),
    seed + ":options",
  ).slice(0, 3);
  const options = shuffle([correct, ...distractors], seed + ":option-order");
  const correctIndex = options.indexOf(correct);

  const setup = rectangle
    ? t(
        language,
        `Eight people—${personList(people, language)}—sit around a rectangular table. Four sit at the corners and four at the middle of the sides. ${mode === "ROLE_DERIVED" ? "People at the corners face the centre, while those at the middle of the sides face outside." : mode === "UNIFORM_IN" ? "All face the centre." : "All face outside."}`,
        `आठ व्यक्ति—${personList(people, language)}—एक आयताकार मेज के चारों ओर बैठे हैं। चार कोनों पर और चार भुजाओं के मध्य बैठे हैं। ${mode === "ROLE_DERIVED" ? "कोनों पर बैठे व्यक्ति केंद्र की ओर तथा भुजाओं के मध्य बैठे व्यक्ति बाहर की ओर मुख करते हैं।" : mode === "UNIFORM_IN" ? "सभी केंद्र की ओर मुख करते हैं।" : "सभी बाहर की ओर मुख करते हैं।"}`,
        `ਅੱਠ ਵਿਅਕਤੀ—${personList(people, language)}—ਇੱਕ ਆਇਤਾਕਾਰ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਬੈਠੇ ਹਨ। ਚਾਰ ਕੋਨਿਆਂ 'ਤੇ ਅਤੇ ਚਾਰ ਪਾਸਿਆਂ ਦੇ ਵਿਚਕਾਰ ਬੈਠੇ ਹਨ। ${mode === "ROLE_DERIVED" ? "ਕੋਨਿਆਂ 'ਤੇ ਬੈਠੇ ਵਿਅਕਤੀ ਕੇਂਦਰ ਵੱਲ ਅਤੇ ਪਾਸਿਆਂ ਦੇ ਵਿਚਕਾਰ ਬੈਠੇ ਵਿਅਕਤੀ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।" : mode === "UNIFORM_IN" ? "ਸਾਰੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।" : "ਸਾਰੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।"}`,
      )
    : t(
        language,
        `Six people—${personList(people, language)}—sit at the vertices of a regular hexagonal table. ${mixed ? "Each person may face the centre or outside." : mode === "UNIFORM_IN" ? "All face the centre." : "All face outside."}`,
        `छह व्यक्ति—${personList(people, language)}—एक नियमित षट्भुजाकार मेज के छह शीर्षों पर बैठे हैं। ${mixed ? "प्रत्येक व्यक्ति केंद्र या बाहर की ओर मुख कर सकता है।" : mode === "UNIFORM_IN" ? "सभी केंद्र की ओर मुख करते हैं।" : "सभी बाहर की ओर मुख करते हैं।"}`,
        `ਛੇ ਵਿਅਕਤੀ—${personList(people, language)}—ਇੱਕ ਨਿਯਮਿਤ ਛੇਭੁਜੀ ਮੇਜ਼ ਦੇ ਛੇ ਕੋਨਿਆਂ 'ਤੇ ਬੈਠੇ ਹਨ। ${mixed ? "ਹਰ ਵਿਅਕਤੀ ਕੇਂਦਰ ਜਾਂ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰ ਸਕਦਾ ਹੈ।" : mode === "UNIFORM_IN" ? "ਸਾਰੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।" : "ਸਾਰੇ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।"}`,
      );

  const clueText = selectedClues.map((clue) => renderPolygonClue(clue, language)).join(" ");
  const side = queryLeft ? t(language, "left", "बाएँ", "ਖੱਬੇ") : t(language, "right", "दाएँ", "ਸੱਜੇ");
  const query = querySteps === 1
    ? t(language, `Who sits immediately to the ${side} of ${label(reference, language)}?`, `${label(reference, language)} के ठीक ${side} कौन बैठता/बैठती है?`, `${label(reference, language)} ਦੇ ਬਿਲਕੁਲ ${side} ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`)
    : t(language, `Who sits second to the ${side} of ${label(reference, language)}?`, `${label(reference, language)} के दूसरे ${side} कौन बैठता/बैठती है?`, `${label(reference, language)} ਦੇ ਦੂਜੇ ${side} ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`);

  const explanation = [
    t(language, "Fix one person only to remove rotational symmetry, then apply the relative-position clues using each reference person's actual facing.", "घूर्णन की समानता हटाने के लिए केवल एक व्यक्ति की स्थिति मानकर तय करें, फिर प्रत्येक संदर्भ व्यक्ति की वास्तविक दिशा के अनुसार सापेक्ष शर्तें लगाएँ।", "ਘੁੰਮਣ ਵਾਲੀ ਸਮਮਿਤੀ ਹਟਾਉਣ ਲਈ ਕੇਵਲ ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਸਥਿਤੀ ਮੰਨ ਕੇ ਤੈਅ ਕਰੋ, ਫਿਰ ਹਰ ਹਵਾਲਾ ਵਿਅਕਤੀ ਦੇ ਅਸਲ ਮੂੰਹ ਅਨੁਸਾਰ ਸਬੰਧਤ ਸ਼ਰਤਾਂ ਲਗਾਓ।"),
    polygonTable(target, language, mode),
    t(language, `Only this arrangement satisfies every clue. Therefore, the answer is ${correct}.`, `सभी शर्तों को केवल यही व्यवस्था पूरा करती है। इसलिए उत्तर ${correct} है।`, `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਕੇਵਲ ਇਹੀ ਵਿਵਸਥਾ ਪੂਰਾ ਕਰਦੀ ਹੈ। ਇਸ ਲਈ ਉੱਤਰ ${correct} ਹੈ।`),
  ].join("\n\n");

  const authority = sea002AdvancedAuthority(qlId);
  return Object.freeze({
    packageId: "SEA-002",
    qlId,
    checkpointId: authority.checkpointId,
    language,
    locale: localeFor(language),
    difficulty,
    seed,
    stem: setup + "\n\n" + clueText + "\n\n" + query,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: correct,
    explanation,
    proof: Object.freeze({
      worldCountBefore: worlds.length,
      worldCountAfter: 1 as const,
      uniqueSolution: true as const,
      clueCount: selectedClues.length,
      targetFingerprint: polygonFingerprint(target, mixed),
      solvedFingerprint: polygonFingerprint(selected.solved, mixed),
      symmetryNormalization: "FIRST_SELECTED_PERSON_FIXED_AT_REFERENCE_POSITION_1",
    }),
    metadata: Object.freeze({
      deterministic: true as const,
      exactFiniteEnumeration: true as const,
      solverVerified: true as const,
      sourceBackedCore: true as const,
      reviewOnly: true as const,
    }),
  });
}

function concentricRingOf(world: ConcentricWorld, person: string): Ring {
  if (world.inner.includes(person)) return "INNER";
  if (world.outer.includes(person)) return "OUTER";
  throw new Error("Person missing from concentric world: " + person);
}

function concentricIndex(world: ConcentricWorld, person: string): number {
  const ring = concentricRingOf(world, person);
  return (ring === "INNER" ? world.inner : world.outer).indexOf(person);
}

function concentricFacing(world: ConcentricWorld, person: string, mixed: boolean): Facing {
  if (mixed) {
    const facing = world.facingByPerson?.[person];
    if (!facing) throw new Error("Mixed concentric world missing facing: " + person);
    return facing;
  }
  return concentricRingOf(world, person) === "INNER" ? "OUT" : "IN";
}

function concentricFingerprint(world: ConcentricWorld, mixed: boolean): string {
  const base = "I:" + world.inner.join(">") + "|O:" + world.outer.join(">");
  if (!mixed) return base;
  return base + "|" + [...world.inner, ...world.outer].sort().map((person) => person + ":" + world.facingByPerson?.[person]).join(",");
}

function concentricWorlds(
  people: readonly string[],
  fixedInner: readonly string[] | null,
  ringSize: number,
  mixed: boolean,
): ConcentricWorld[] {
  const anchor = people[0]!;
  const worlds: ConcentricWorld[] = [];
  const innerSets = fixedInner ? [fixedInner.slice()] : combinations(people, ringSize);

  for (const innerMembers of innerSets) {
    const outerMembers = people.filter((person) => !innerMembers.includes(person));
    if (innerMembers.length !== ringSize || outerMembers.length !== ringSize) continue;

    const anchorInInner = innerMembers.includes(anchor);
    const anchorInOuter = outerMembers.includes(anchor);
    if (!anchorInInner && !anchorInOuter) continue;

    const innerOrders = anchorInInner
      ? permutations(innerMembers.filter((person) => person !== anchor)).map((rest) => [anchor, ...rest])
      : permutations(innerMembers);
    const outerOrders = anchorInOuter
      ? permutations(outerMembers.filter((person) => person !== anchor)).map((rest) => [anchor, ...rest])
      : permutations(outerMembers);

    for (const inner of innerOrders) {
      for (const outer of outerOrders) {
        if (!mixed) {
          worlds.push({ inner, outer });
          continue;
        }
        for (let mask = 0; mask < (1 << people.length); mask += 1) {
          const facingByPerson: Record<string, Facing> = {};
          people.forEach((person, index) => {
            facingByPerson[person] = (mask & (1 << index)) !== 0 ? "IN" : "OUT";
          });
          worlds.push({ inner, outer, facingByPerson });
        }
      }
    }
  }
  return worlds;
}

function concentricTruth(world: ConcentricWorld, clue: ConcentricClue, mixed: boolean): boolean {
  if (clue.kind === "RING") return concentricRingOf(world, clue.person) === clue.ring;
  if (clue.kind === "FACING") return concentricFacing(world, clue.person, mixed) === clue.facing;
  if (clue.kind === "SAME_FACING") return concentricFacing(world, clue.a, mixed) === concentricFacing(world, clue.b, mixed);
  if (clue.kind === "OPPOSITE_FACING") return concentricFacing(world, clue.a, mixed) !== concentricFacing(world, clue.b, mixed);
  const ringA = concentricRingOf(world, clue.a);
  const ringB = concentricRingOf(world, clue.b);
  const a = concentricIndex(world, clue.a);
  const b = concentricIndex(world, clue.b);
  const size = world.inner.length;
  if (clue.kind === "FACES") return ringA !== ringB && a === b;
  if (clue.kind === "ADJACENT") return ringA === ringB && (mod(a - b, size) === 1 || mod(b - a, size) === 1);
  if (clue.kind === "OPPOSITE") return ringA === ringB && size % 2 === 0 && mod(a - b, size) === size / 2;
  if (ringA !== ringB) return false;
  const facing = concentricFacing(world, clue.b, mixed);
  if (clue.kind === "LEFT_OF") return a === leftIndex(b, facing, clue.steps, size);
  return a === rightIndex(b, facing, clue.steps, size);
}

function concentricCandidates(target: ConcentricWorld, mixed: boolean, includeRingClues: boolean): ConcentricClue[] {
  const people = [...target.inner, ...target.outer];
  const out: ConcentricClue[] = [];
  for (const person of people) {
    if (includeRingClues) out.push({ kind: "RING", person, ring: concentricRingOf(target, person) });
    if (mixed) out.push({ kind: "FACING", person, facing: concentricFacing(target, person, true) });
  }
  for (let i = 0; i < people.length; i += 1) for (let j = i + 1; j < people.length; j += 1) {
    const a = people[i]!, b = people[j]!;
    for (const clue of [
      { kind: "FACES", a, b },
      { kind: "ADJACENT", a, b },
      { kind: "OPPOSITE", a, b },
    ] as const) {
      if (concentricTruth(target, clue, mixed)) out.push(clue);
    }
    if (mixed) {
      const same = concentricFacing(target, a, true) === concentricFacing(target, b, true);
      out.push({ kind: same ? "SAME_FACING" : "OPPOSITE_FACING", a, b } as ConcentricClue);
    }
  }
  for (const a of people) for (const b of people) {
    if (a === b || concentricRingOf(target, a) !== concentricRingOf(target, b)) continue;
    for (const steps of [1, 2] as const) {
      const left: ConcentricClue = { kind: "LEFT_OF", a, b, steps };
      const right: ConcentricClue = { kind: "RIGHT_OF", a, b, steps };
      if (concentricTruth(target, left, mixed)) out.push(left);
      if (concentricTruth(target, right, mixed)) out.push(right);
    }
  }
  return dedupeClues(out);
}

function renderConcentricClue(clue: ConcentricClue, language: Sea002AdvancedLanguage): string {
  const p = (id: string) => label(id, language);
  if (clue.kind === "FACES") {
    return t(language, `${p(clue.a)} faces ${p(clue.b)} across the two circles.`, `${p(clue.a)} और ${p(clue.b)} दोनों वृत्तों में आमने-सामने बैठे हैं।`, `${p(clue.a)} ਅਤੇ ${p(clue.b)} ਦੋਵੇਂ ਘੇਰਿਆਂ ਵਿੱਚ ਆਮਨੇ-ਸਾਮਨੇ ਬੈਠੇ ਹਨ।`);
  }
  if (clue.kind === "ADJACENT") {
    return t(language, `${p(clue.a)} sits next to ${p(clue.b)} in the same circle.`, `${p(clue.a)}, ${p(clue.b)} के पास उसी वृत्त में बैठता/बैठती है।`, `${p(clue.a)}, ${p(clue.b)} ਦੇ ਨਾਲ ਉਸੇ ਘੇਰੇ ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
  }
  if (clue.kind === "OPPOSITE") {
    return t(language, `${p(clue.a)} sits opposite ${p(clue.b)} in the same circle.`, `${p(clue.a)}, ${p(clue.b)} के विपरीत उसी वृत्त में बैठता/बैठती है।`, `${p(clue.a)}, ${p(clue.b)} ਦੇ ਉਲਟ ਉਸੇ ਘੇਰੇ ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
  }
  if (clue.kind === "RING") {
    const ring = clue.ring === "INNER" ? t(language, "inner", "भीतरी", "ਅੰਦਰਲੇ") : t(language, "outer", "बाहरी", "ਬਾਹਰਲੇ");
    return t(language, `${p(clue.person)} sits in the ${ring} circle.`, `${p(clue.person)} ${ring} वृत्त में बैठता/बैठती है।`, `${p(clue.person)} ${ring} ਘੇਰੇ ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
  }
  if (clue.kind === "FACING") {
    const direction = clue.facing === "IN"
      ? t(language, "the centre", "केंद्र", "ਕੇਂਦਰ")
      : t(language, "outside", "बाहर", "ਬਾਹਰ");
    return t(language, `${p(clue.person)} faces ${direction}.`, `${p(clue.person)} ${direction} की ओर मुख करता/करती है।`, `${p(clue.person)} ${direction} ਵੱਲ ਮੂੰਹ ਕਰਦਾ/ਕਰਦੀ ਹੈ।`);
  }
  if (clue.kind === "SAME_FACING" || clue.kind === "OPPOSITE_FACING") {
    const same = clue.kind === "SAME_FACING";
    return t(language, `${p(clue.a)} and ${p(clue.b)} face ${same ? "the same direction" : "opposite directions"}.`, `${p(clue.a)} और ${p(clue.b)} ${same ? "एक ही दिशा" : "विपरीत दिशाओं"} की ओर मुख करते हैं।`, `${p(clue.a)} ਅਤੇ ${p(clue.b)} ${same ? "ਇੱਕੋ ਦਿਸ਼ਾ" : "ਉਲਟ ਦਿਸ਼ਾਵਾਂ"} ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।`);
  }
  const side = clue.kind === "LEFT_OF"
    ? t(language, "left", "बाएँ", "ਖੱਬੇ")
    : t(language, "right", "दाएँ", "ਸੱਜੇ");
  if (clue.steps === 1) {
    return t(language, `${p(clue.a)} sits immediately to the ${side} of ${p(clue.b)} in the same circle.`, `${p(clue.a)}, ${p(clue.b)} के ठीक ${side} उसी वृत्त में बैठता/बैठती है।`, `${p(clue.a)}, ${p(clue.b)} ਦੇ ਬਿਲਕੁਲ ${side} ਉਸੇ ਘੇਰੇ ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
  }
  return t(language, `${p(clue.a)} sits second to the ${side} of ${p(clue.b)} in the same circle.`, `${p(clue.a)}, ${p(clue.b)} के दूसरे ${side} उसी वृत्त में बैठता/बैठती है।`, `${p(clue.a)}, ${p(clue.b)} ਦੇ ਦੂਜੇ ${side} ਉਸੇ ਘੇਰੇ ਵਿੱਚ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ।`);
}

function concentricTable(world: ConcentricWorld, language: Sea002AdvancedLanguage, mixed: boolean): string {
  const rows: string[] = [
    t(language, "| Position | Inner circle | Outer circle |", "| स्थान | भीतरी वृत्त | बाहरी वृत्त |", "| ਸਥਾਨ | ਅੰਦਰਲਾ ਘੇਰਾ | ਬਾਹਰਲਾ ਘੇਰਾ |"),
    "|---:|---|---|",
  ];
  for (let i = 0; i < world.inner.length; i += 1) {
    const inner = world.inner[i]!, outer = world.outer[i]!;
    const innerFace = concentricFacing(world, inner, mixed) === "IN" ? "↘" : "↗";
    const outerFace = concentricFacing(world, outer, mixed) === "IN" ? "↙" : "↖";
    rows.push(`| ${i + 1} | ${label(inner, language)} ${innerFace} | ${label(outer, language)} ${outerFace} |`);
  }
  return rows.join("\n");
}

function buildConcentricQuestion(
  qlId: "SEA-QL-040" | "SEA-QL-041" | "SEA-QL-042",
  seed: string,
  language: Sea002AdvancedLanguage,
  difficulty: Sea002AdvancedDifficulty,
): Sea002AdvancedGeneratedQuestion {
  const mixed = qlId === "SEA-QL-042";
  const inferredRing = qlId === "SEA-QL-041";
  const ringSize = mixed ? 3 : 4;
  const people = choosePeople(seed + ":concentric", ringSize * 2);
  const outerAnchor = people[0]!;
  const targetInner = shuffle(people.slice(1), seed + ":inner-members").slice(0, ringSize);
  const targetOuterMembers = people.filter((person) => !targetInner.includes(person));
  if (!targetOuterMembers.includes(outerAnchor)) throw new Error("Concentric anchor must be outer.");
  const targetOuter = [outerAnchor, ...shuffle(targetOuterMembers.filter((person) => person !== outerAnchor), seed + ":outer-order")];
  const targetInnerOrder = shuffle(targetInner, seed + ":inner-order");
  const facingByPerson: Record<string, Facing> | undefined = mixed ? {} : undefined;
  if (mixed && facingByPerson) {
    for (const person of people) facingByPerson[person] = hash(seed + ":facing:" + person) % 2 === 0 ? "IN" : "OUT";
    if (new Set(Object.values(facingByPerson)).size === 1) {
      facingByPerson[people[1]!] = facingByPerson[people[1]!] === "IN" ? "OUT" : "IN";
    }
  }
  const target: ConcentricWorld = { inner: targetInnerOrder, outer: targetOuter, facingByPerson };
  const fixedInner = inferredRing ? null : targetInner;
  const worlds = concentricWorlds(people, fixedInner, ringSize, mixed);
  const candidates = concentricCandidates(target, mixed, inferredRing);
  const selected = selectUniqueClues(
    worlds,
    target,
    candidates,
    (world, clue) => concentricTruth(world, clue, mixed),
    (world) => concentricFingerprint(world, mixed),
    seed + ":clue-select",
    mixed ? 7 : inferredRing ? 7 : 5,
  );

  const queryFaces = hash(seed + ":query-kind") % 2 === 0;
  const reference = people[hash(seed + ":query-reference") % people.length]!;
  let answerId: string;
  let query: string;
  if (queryFaces) {
    const refRing = concentricRingOf(target, reference);
    const index = concentricIndex(target, reference);
    answerId = (refRing === "INNER" ? target.outer : target.inner)[index]!;
    query = t(language, `Who faces ${label(reference, language)} across the two circles?`, `दोनों वृत्तों में ${label(reference, language)} के सामने कौन बैठता/बैठती है?`, `ਦੋਵੇਂ ਘੇਰਿਆਂ ਵਿੱਚ ${label(reference, language)} ਦੇ ਸਾਹਮਣੇ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`);
  } else {
    const ring = concentricRingOf(target, reference);
    const members = ring === "INNER" ? target.inner : target.outer;
    const index = concentricIndex(target, reference);
    const facing = concentricFacing(target, reference, mixed);
    const targetIndex = leftIndex(index, facing, 1, ringSize);
    answerId = members[targetIndex]!;
    query = t(language, `Who sits immediately to the left of ${label(reference, language)}?`, `${label(reference, language)} के ठीक बाएँ कौन बैठता/बैठती है?`, `${label(reference, language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`);
  }
  const correct = label(answerId, language);
  const distractors = shuffle(
    people.filter((person) => person !== answerId).map((person) => label(person, language)),
    seed + ":options",
  ).slice(0, 3);
  const options = shuffle([correct, ...distractors], seed + ":option-order");
  const correctIndex = options.indexOf(correct);

  const membershipText = inferredRing
    ? ""
    : t(
        language,
        ` ${personList(targetInner, language)} sit in the inner circle; the remaining people sit in the outer circle.`,
        ` ${personList(targetInner, language)} भीतरी वृत्त में बैठे हैं; शेष व्यक्ति बाहरी वृत्त में बैठे हैं।`,
        ` ${personList(targetInner, language)} ਅੰਦਰਲੇ ਘੇਰੇ ਵਿੱਚ ਬੈਠੇ ਹਨ; ਬਾਕੀ ਵਿਅਕਤੀ ਬਾਹਰਲੇ ਘੇਰੇ ਵਿੱਚ ਬੈਠੇ ਹਨ।`,
      );
  const facingText = mixed
    ? t(language, " Each person may face the centre or outside.", " प्रत्येक व्यक्ति केंद्र या बाहर की ओर मुख कर सकता है।", " ਹਰ ਵਿਅਕਤੀ ਕੇਂਦਰ ਜਾਂ ਬਾਹਰ ਵੱਲ ਮੂੰਹ ਕਰ ਸਕਦਾ ਹੈ।")
    : t(language, " People in the inner circle face outside and people in the outer circle face the centre.", " भीतरी वृत्त के व्यक्ति बाहर की ओर और बाहरी वृत्त के व्यक्ति केंद्र की ओर मुख करते हैं।", " ਅੰਦਰਲੇ ਘੇਰੇ ਦੇ ਵਿਅਕਤੀ ਬਾਹਰ ਵੱਲ ਅਤੇ ਬਾਹਰਲੇ ਘੇਰੇ ਦੇ ਵਿਅਕਤੀ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਦੇ ਹਨ।");
  const setup = t(
    language,
    `${people.length} people—${personList(people, language)}—sit in two concentric circles with ${ringSize} people in each circle.`,
    `${people.length} व्यक्ति—${personList(people, language)}—दो समकेंद्रीय वृत्तों में बैठते हैं, प्रत्येक वृत्त में ${ringSize} व्यक्ति हैं।`,
    `${people.length} ਵਿਅਕਤੀ—${personList(people, language)}—ਦੋ ਸਮਕੇਂਦਰੀ ਘੇਰਿਆਂ ਵਿੱਚ ਬੈਠਦੇ ਹਨ, ਹਰ ਘੇਰੇ ਵਿੱਚ ${ringSize} ਵਿਅਕਤੀ ਹਨ।`,
  ) + membershipText + facingText;

  const explanation = [
    t(language, "Fix one outer-circle person only to remove rotational symmetry. Then solve ring membership, cross-ring facing pairs and same-ring left/right relations.", "घूर्णन की समानता हटाने के लिए बाहरी वृत्त के केवल एक व्यक्ति की स्थिति मानकर तय करें। फिर वृत्त-सदस्यता, दोनों वृत्तों के आमने-सामने जोड़े और उसी वृत्त के बाएँ-दाएँ संबंध हल करें।", "ਘੁੰਮਣ ਵਾਲੀ ਸਮਮਿਤੀ ਹਟਾਉਣ ਲਈ ਬਾਹਰਲੇ ਘੇਰੇ ਦੇ ਕੇਵਲ ਇੱਕ ਵਿਅਕਤੀ ਦੀ ਸਥਿਤੀ ਮੰਨ ਕੇ ਤੈਅ ਕਰੋ। ਫਿਰ ਘੇਰਾ-ਮੈਂਬਰਸ਼ਿਪ, ਦੋਵੇਂ ਘੇਰਿਆਂ ਦੇ ਆਮਨੇ-ਸਾਮਨੇ ਜੋੜੇ ਅਤੇ ਉਸੇ ਘੇਰੇ ਦੇ ਖੱਬੇ-ਸੱਜੇ ਸਬੰਧ ਹੱਲ ਕਰੋ।"),
    concentricTable(target, language, mixed),
    t(language, `Only this arrangement satisfies every clue. Therefore, the answer is ${correct}.`, `सभी शर्तों को केवल यही व्यवस्था पूरा करती है। इसलिए उत्तर ${correct} है।`, `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਕੇਵਲ ਇਹੀ ਵਿਵਸਥਾ ਪੂਰਾ ਕਰਦੀ ਹੈ। ਇਸ ਲਈ ਉੱਤਰ ${correct} ਹੈ।`),
  ].join("\n\n");

  const authority = sea002AdvancedAuthority(qlId);
  return Object.freeze({
    packageId: "SEA-002",
    qlId,
    checkpointId: authority.checkpointId,
    language,
    locale: localeFor(language),
    difficulty,
    seed,
    stem: setup + "\n\n" + selected.clues.map((clue) => renderConcentricClue(clue, language)).join(" ") + "\n\n" + query,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: correct,
    explanation,
    proof: Object.freeze({
      worldCountBefore: worlds.length,
      worldCountAfter: 1 as const,
      uniqueSolution: true as const,
      clueCount: selected.clues.length,
      targetFingerprint: concentricFingerprint(target, mixed),
      solvedFingerprint: concentricFingerprint(selected.solved, mixed),
      symmetryNormalization: "FIRST_SELECTED_OUTER_PERSON_FIXED_AT_REFERENCE_POSITION_1",
    }),
    metadata: Object.freeze({
      deterministic: true as const,
      exactFiniteEnumeration: true as const,
      solverVerified: true as const,
      sourceBackedCore: true as const,
      reviewOnly: true as const,
    }),
  });
}

export function generateSea002AdvancedQuestion(
  qlId: Sea002AdvancedQlId,
  seed: string,
  language: Sea002AdvancedLanguage = "en",
  difficulty?: Sea002AdvancedDifficulty,
): Sea002AdvancedGeneratedQuestion {
  if (!seed.trim()) throw new Error("SEA-002 seed must be non-empty.");
  const authority = sea002AdvancedAuthority(qlId);
  const supported = authority.supportedDifficulties as readonly Sea002AdvancedDifficulty[];
  const resolved = difficulty ?? supported[hash(seed + ":difficulty") % supported.length]!;
  if (!supported.includes(resolved)) throw new Error(qlId + " does not support " + resolved + " difficulty.");
  if (qlId <= "SEA-QL-039") {
    return buildPolygonQuestion(qlId as "SEA-QL-036" | "SEA-QL-037" | "SEA-QL-038" | "SEA-QL-039", seed, language, resolved);
  }
  return buildConcentricQuestion(qlId as "SEA-QL-040" | "SEA-QL-041" | "SEA-QL-042", seed, language, resolved);
}
