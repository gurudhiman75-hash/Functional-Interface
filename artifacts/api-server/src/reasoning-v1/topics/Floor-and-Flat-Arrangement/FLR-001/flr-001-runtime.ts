import {
  FLR_001_QL_AUTHORITIES,
  type FlrQlId,
} from "./flr-001-authority";

export type FlrLanguage = "en" | "hi" | "pa";
export type FlrDifficulty = "Easy" | "Medium" | "Hard";

type Localized = Readonly<{ en: string; hi: string; pa: string }>;
type Person = Readonly<{ id: string; label: Localized }>;
type Subject = Readonly<{ id: string; label: Localized }>;
type Slot = Readonly<{ floor: number; flat: 1 | 2 }>;

type FloorWorld = Readonly<{ order: readonly string[] }>;
type AttributeWorld = Readonly<{
  order: readonly string[];
  subjectByPerson: Readonly<Record<string, string>>;
}>;
type GridWorld = Readonly<{ slotByPerson: Readonly<Record<string, string>> }>;

type FloorClue =
  | Readonly<{ kind: "FIXED"; person: string; floor: number }>
  | Readonly<{ kind: "ABOVE"; upper: string; lower: string }>
  | Readonly<{ kind: "IMMEDIATE_ABOVE"; upper: string; lower: string }>
  | Readonly<{ kind: "GAP"; upper: string; lower: string; gap: number }>
  | Readonly<{ kind: "PARITY"; person: string; parity: "EVEN" | "ODD" }>
  | Readonly<{ kind: "NOT_FLOOR"; person: string; floor: number }>;

type AttributeClue =
  | FloorClue
  | Readonly<{ kind: "PERSON_SUBJECT"; person: string; subject: string }>
  | Readonly<{ kind: "FLOOR_SUBJECT"; floor: number; subject: string }>
  | Readonly<{ kind: "SUBJECT_ABOVE_PERSON"; subject: string; person: string }>
  | Readonly<{ kind: "PERSON_ABOVE_SUBJECT"; person: string; subject: string }>;

type GridClue =
  | Readonly<{ kind: "EXACT_SLOT"; person: string; floor: number; flat: 1 | 2 }>
  | Readonly<{ kind: "SAME_FLOOR"; left: string; right: string }>
  | Readonly<{ kind: "WEST_OF"; west: string; east: string }>
  | Readonly<{ kind: "SAME_FLAT_ABOVE"; upper: string; lower: string }>
  | Readonly<{ kind: "IMMEDIATE_ABOVE_SAME_FLAT"; upper: string; lower: string }>
  | Readonly<{ kind: "FLOOR_GAP"; upper: string; lower: string; gap: number }>
  | Readonly<{ kind: "FLOOR_PARITY"; person: string; parity: "EVEN" | "ODD" }>
  | Readonly<{ kind: "NOT_FLOOR"; person: string; floor: number }>
  | Readonly<{ kind: "DIFFERENT_FLAT"; left: string; right: string }>;

export interface GeneratedFlr001Question {
  readonly packageId: "FLR-001";
  readonly qlId: FlrQlId;
  readonly checkpointId: string;
  readonly language: FlrLanguage;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly difficulty: FlrDifficulty;
  readonly seed: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly canonicalAnswer: string;
  readonly explanation: string;
  readonly proof: Readonly<{
    worldCountBefore: number;
    worldCountAfter: number;
    uniqueSolution: true;
    clueCount: number;
    targetFingerprint: string;
    solvedFingerprint: string;
  }>;
  readonly metadata: Readonly<{
    deterministic: true;
    exactFiniteEnumeration: true;
    solverVerified: true;
    sourceBackedCore: true;
    reviewOnly: true;
  }>;
}

const PERSON_POOL: readonly Person[] = Object.freeze([
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
  { id: "RAVI", label: { en: "Ravi", hi: "रवि", pa: "ਰਵੀ" } },
  { id: "SIMRAN", label: { en: "Simran", hi: "सिमरन", pa: "ਸਿਮਰਨ" } },
  { id: "TARUN", label: { en: "Tarun", hi: "तरुण", pa: "ਤਰੁਣ" } },
  { id: "VARSHA", label: { en: "Varsha", hi: "वर्षा", pa: "ਵਰਸ਼ਾ" } },
]);

const SUBJECT_POOL: readonly Subject[] = Object.freeze([
  { id: "HISTORY", label: { en: "History", hi: "इतिहास", pa: "ਇਤਿਹਾਸ" } },
  { id: "SCIENCE", label: { en: "Science", hi: "विज्ञान", pa: "ਵਿਗਿਆਨ" } },
  { id: "MATHS", label: { en: "Mathematics", hi: "गणित", pa: "ਗਣਿਤ" } },
  { id: "COMPUTER", label: { en: "Computer", hi: "कंप्यूटर", pa: "ਕੰਪਿਊਟਰ" } },
  { id: "ECONOMICS", label: { en: "Economics", hi: "अर्थशास्त्र", pa: "ਅਰਥਸ਼ਾਸਤਰ" } },
]);

function hash(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function t(language: FlrLanguage, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function localeFor(language: FlrLanguage): GeneratedFlr001Question["locale"] {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function label(value: Localized, language: FlrLanguage): string {
  return value[language];
}

function personById(id: string): Person {
  const found = PERSON_POOL.find((person) => person.id === id);
  if (!found) throw new Error("Unknown FLR person: " + id);
  return found;
}

function subjectById(id: string): Subject {
  const found = SUBJECT_POOL.find((subject) => subject.id === id);
  if (!found) throw new Error("Unknown FLR subject: " + id);
  return found;
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

function floorOf(world: FloorWorld, person: string): number {
  const index = world.order.indexOf(person);
  if (index < 0) throw new Error("Person missing from floor world: " + person);
  return index + 1;
}

function floorWorldFingerprint(world: FloorWorld): string {
  return world.order.join(">");
}

function subjectHolder(world: AttributeWorld, subject: string): string {
  const entry = Object.entries(world.subjectByPerson).find(([, value]) => value === subject);
  if (!entry) throw new Error("Subject missing from attribute world: " + subject);
  return entry[0];
}

function attributeWorldFingerprint(world: AttributeWorld): string {
  return world.order.join(">") + "|" +
    Object.keys(world.subjectByPerson).sort().map((p) => p + "=" + world.subjectByPerson[p]).join(",");
}

function slotKey(slot: Slot): string {
  return slot.floor + ":" + slot.flat;
}

function parseSlot(key: string): Slot {
  const [floorText, flatText] = key.split(":");
  return { floor: Number(floorText), flat: Number(flatText) as 1 | 2 };
}

function slotOf(world: GridWorld, person: string): Slot {
  const key = world.slotByPerson[person];
  if (!key) throw new Error("Person missing from grid world: " + person);
  return parseSlot(key);
}

function occupantsOf(world: GridWorld, slot: Slot): string[] {
  const key = slotKey(slot);
  return Object.keys(world.slotByPerson).filter((person) => world.slotByPerson[person] === key);
}

function gridFingerprint(world: GridWorld): string {
  return Object.keys(world.slotByPerson).sort().map((p) => p + "=" + world.slotByPerson[p]).join(",");
}

function truthFloorClue(world: FloorWorld, clue: FloorClue): boolean {
  const fp = (person: string) => floorOf(world, person);
  switch (clue.kind) {
    case "FIXED": return fp(clue.person) === clue.floor;
    case "ABOVE": return fp(clue.upper) > fp(clue.lower);
    case "IMMEDIATE_ABOVE": return fp(clue.upper) === fp(clue.lower) + 1;
    case "GAP": return fp(clue.upper) === fp(clue.lower) + clue.gap + 1;
    case "PARITY": return fp(clue.person) % 2 === (clue.parity === "EVEN" ? 0 : 1);
    case "NOT_FLOOR": return fp(clue.person) !== clue.floor;
  }
}

function truthAttributeClue(world: AttributeWorld, clue: AttributeClue): boolean {
  if (
    clue.kind === "FIXED" ||
    clue.kind === "ABOVE" ||
    clue.kind === "IMMEDIATE_ABOVE" ||
    clue.kind === "GAP" ||
    clue.kind === "PARITY" ||
    clue.kind === "NOT_FLOOR"
  ) {
    return truthFloorClue({ order: world.order }, clue);
  }
  if (clue.kind === "PERSON_SUBJECT") return world.subjectByPerson[clue.person] === clue.subject;
  if (clue.kind === "FLOOR_SUBJECT") {
    const holder = subjectHolder(world, clue.subject);
    return floorOf({ order: world.order }, holder) === clue.floor;
  }
  if (clue.kind === "SUBJECT_ABOVE_PERSON") {
    return floorOf({ order: world.order }, subjectHolder(world, clue.subject)) >
      floorOf({ order: world.order }, clue.person);
  }
  return floorOf({ order: world.order }, clue.person) >
    floorOf({ order: world.order }, subjectHolder(world, clue.subject));
}

function truthGridClue(world: GridWorld, clue: GridClue): boolean {
  const a = (person: string) => slotOf(world, person);
  switch (clue.kind) {
    case "EXACT_SLOT": {
      const s = a(clue.person);
      return s.floor === clue.floor && s.flat === clue.flat;
    }
    case "SAME_FLOOR": return a(clue.left).floor === a(clue.right).floor;
    case "WEST_OF": {
      const west = a(clue.west), east = a(clue.east);
      return west.floor === east.floor && west.flat === 1 && east.flat === 2;
    }
    case "SAME_FLAT_ABOVE": {
      const upper = a(clue.upper), lower = a(clue.lower);
      return upper.flat === lower.flat && upper.floor > lower.floor;
    }
    case "IMMEDIATE_ABOVE_SAME_FLAT": {
      const upper = a(clue.upper), lower = a(clue.lower);
      return upper.flat === lower.flat && upper.floor === lower.floor + 1;
    }
    case "FLOOR_GAP": return a(clue.upper).floor === a(clue.lower).floor + clue.gap + 1;
    case "FLOOR_PARITY": return a(clue.person).floor % 2 === (clue.parity === "EVEN" ? 0 : 1);
    case "NOT_FLOOR": return a(clue.person).floor !== clue.floor;
    case "DIFFERENT_FLAT": return a(clue.left).flat !== a(clue.right).flat;
  }
}

function selectUniqueClues<W, C>(
  worlds: readonly W[],
  target: W,
  candidates: readonly C[],
  predicate: (world: W, clue: C) => boolean,
  fingerprint: (world: W) => string,
  seed: string,
  minimumClues: number,
): { clues: C[]; remaining: W[] } {
  const targetFp = fingerprint(target);
  let remaining = [...worlds];
  const ordered = shuffle(candidates, seed + ":candidate-order");
  const chosen: C[] = [];
  for (const clue of ordered) {
    if (!predicate(target, clue)) continue;
    const next = remaining.filter((world) => predicate(world, clue));
    if (next.length >= remaining.length || next.length === 0) continue;
    chosen.push(clue);
    remaining = next;
    if (remaining.length === 1 && chosen.length >= minimumClues) break;
  }
  if (remaining.length !== 1 || fingerprint(remaining[0]!) !== targetFp) {
    throw new Error(
      "FLR clue synthesis failed to isolate target: " +
      targetFp + " remaining=" + remaining.length,
    );
  }
  return { clues: chosen, remaining };
}

function choosePeople(seed: string, count: number): string[] {
  return shuffle(PERSON_POOL.map((p) => p.id), seed + ":people").slice(0, count);
}

function personList(ids: readonly string[], language: FlrLanguage): string {
  const names = ids.map((id) => label(personById(id).label, language));
  if (names.length <= 1) return names.join("");
  const conjunction = t(language, "and", "और", "ਅਤੇ");
  return names.slice(0, -1).join(", ") + " " + conjunction + " " + names[names.length - 1];
}

function floorName(floor: number, language: FlrLanguage): string {
  return t(language, `floor ${floor}`, `${floor}वीं मंजिल`, `ਮੰਜ਼ਿਲ ${floor}`);
}

function flatName(flat: 1 | 2, language: FlrLanguage): string {
  return t(language, `Flat ${flat}`, `फ्लैट ${flat}`, `ਫਲੈਟ ${flat}`);
}

function renderFloorClue(clue: FloorClue, language: FlrLanguage): string {
  const p = (id: string) => label(personById(id).label, language);
  switch (clue.kind) {
    case "FIXED":
      return t(language, `${p(clue.person)} lives on floor ${clue.floor}.`, `${p(clue.person)} ${clue.floor}वीं मंजिल पर रहता/रहती है।`, `${p(clue.person)} ਮੰਜ਼ਿਲ ${clue.floor} 'ਤੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "ABOVE":
      return t(language, `${p(clue.upper)} lives above ${p(clue.lower)}.`, `${p(clue.upper)}, ${p(clue.lower)} से ऊपर रहता/रहती है।`, `${p(clue.upper)}, ${p(clue.lower)} ਤੋਂ ਉੱਪਰ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "IMMEDIATE_ABOVE":
      return t(language, `${p(clue.upper)} lives immediately above ${p(clue.lower)}.`, `${p(clue.upper)}, ${p(clue.lower)} से ठीक एक मंजिल ऊपर रहता/रहती है।`, `${p(clue.upper)}, ${p(clue.lower)} ਤੋਂ ਬਿਲਕੁਲ ਇੱਕ ਮੰਜ਼ਿਲ ਉੱਪਰ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "GAP":
      return t(language, `Exactly ${clue.gap} ${clue.gap === 1 ? "person lives" : "persons live"} between ${p(clue.upper)} and ${p(clue.lower)}, with ${p(clue.upper)} above ${p(clue.lower)}.`, `${p(clue.upper)} और ${p(clue.lower)} के बीच ठीक ${clue.gap} व्यक्ति रहता/रहते हैं और ${p(clue.upper)} ऊपर है।`, `${p(clue.upper)} ਅਤੇ ${p(clue.lower)} ਵਿਚਕਾਰ ਠੀਕ ${clue.gap} ਵਿਅਕਤੀ ਰਹਿੰਦਾ/ਰਹਿੰਦੇ ਹਨ ਅਤੇ ${p(clue.upper)} ਉੱਪਰ ਹੈ।`);
    case "PARITY":
      return t(language, `${p(clue.person)} lives on an ${clue.parity === "EVEN" ? "even" : "odd"}-numbered floor.`, `${p(clue.person)} ${clue.parity === "EVEN" ? "सम" : "विषम"} संख्या वाली मंजिल पर रहता/रहती है।`, `${p(clue.person)} ${clue.parity === "EVEN" ? "ਜੋੜੀ" : "ਟਾਂਕ"} ਨੰਬਰ ਵਾਲੀ ਮੰਜ਼ਿਲ 'ਤੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "NOT_FLOOR":
      return t(language, `${p(clue.person)} does not live on floor ${clue.floor}.`, `${p(clue.person)} ${clue.floor}वीं मंजिल पर नहीं रहता/रहती।`, `${p(clue.person)} ਮੰਜ਼ਿਲ ${clue.floor} 'ਤੇ ਨਹੀਂ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ।`);
  }
}

function floorCandidateClues(target: FloorWorld, excludedPerson?: string): FloorClue[] {
  const persons = [...target.order];
  const out: FloorClue[] = [];
  for (const person of persons) {
    const floor = floorOf(target, person);
    if (person !== excludedPerson) out.push({ kind: "FIXED", person, floor });
    out.push({ kind: "PARITY", person, parity: floor % 2 === 0 ? "EVEN" : "ODD" });
    for (let f = 1; f <= persons.length; f += 1) {
      if (f !== floor) out.push({ kind: "NOT_FLOOR", person, floor: f });
    }
  }
  for (const upper of persons) for (const lower of persons) {
    if (upper === lower) continue;
    const delta = floorOf(target, upper) - floorOf(target, lower);
    if (delta > 0) out.push({ kind: "ABOVE", upper, lower });
    if (delta === 1) out.push({ kind: "IMMEDIATE_ABOVE", upper, lower });
    if (delta >= 2 && delta <= 3) out.push({ kind: "GAP", upper, lower, gap: delta - 1 });
  }
  const priority = (clue: FloorClue) =>
    clue.kind === "IMMEDIATE_ABOVE" ? 0 :
    clue.kind === "GAP" ? 1 :
    clue.kind === "ABOVE" ? 2 :
    clue.kind === "PARITY" ? 3 :
    clue.kind === "NOT_FLOOR" ? 4 : 5;
  return out.sort((a, b) => priority(a) - priority(b));
}

function floorTable(world: FloorWorld, language: FlrLanguage): string {
  const rows = [...world.order].map((person, index) => ({
    floor: index + 1,
    person: label(personById(person).label, language),
  })).reverse();
  const header = t(language, "Floor | Person", "मंजिल | व्यक्ति", "ਮੰਜ਼ਿਲ | ਵਿਅਕਤੀ");
  return [
    `| ${header.replace(" | ", " | ")} |`,
    "|---:|---|",
    ...rows.map((row) => `| ${row.floor} | ${row.person} |`),
  ].join("\n");
}

function buildFloorQuestion(
  seed: string,
  language: FlrLanguage,
  difficulty: FlrDifficulty,
): GeneratedFlr001Question {
  const count = difficulty === "Easy" ? 5 : 6;
  const people = choosePeople(seed, count);
  const target: FloorWorld = { order: shuffle(people, seed + ":target-order") };
  const allWorlds = permutations(people).map((order) => ({ order }));
  const queryPerson = people[hash(seed + ":query-person") % people.length]!;
  const queryType = hash(seed + ":query-type") % 2 === 0 ? "PERSON_FLOOR" : "FLOOR_OCCUPANT";
  const queryFloor = floorOf(target, queryPerson);
  const excluded = queryType === "PERSON_FLOOR" ? queryPerson : target.order[queryFloor - 1]!;
  const candidates = floorCandidateClues(target, excluded);
  const selected = selectUniqueClues(
    allWorlds, target, candidates, truthFloorClue, floorWorldFingerprint,
    seed + ":select", difficulty === "Easy" ? 4 : 5,
  );
  const clues = selected.clues.slice(0, difficulty === "Easy" ? 6 : 8);
  const filtered = allWorlds.filter((world) => clues.every((clue) => truthFloorClue(world, clue)));
  if (filtered.length !== 1) {
    throw new Error("FLR-QL-001 post-trim clues lost uniqueness.");
  }

  let correct: string;
  let question: string;
  let optionPool: string[];
  if (queryType === "PERSON_FLOOR") {
    correct = String(queryFloor);
    question = t(
      language,
      `On which floor does ${label(personById(queryPerson).label, language)} live?`,
      `${label(personById(queryPerson).label, language)} किस मंजिल पर रहता/रहती है?`,
      `${label(personById(queryPerson).label, language)} ਕਿਹੜੀ ਮੰਜ਼ਿਲ 'ਤੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ?`,
    );
    optionPool = Array.from({ length: count }, (_, i) => String(i + 1));
  } else {
    correct = label(personById(target.order[queryFloor - 1]!).label, language);
    question = t(
      language,
      `Who lives on floor ${queryFloor}?`,
      `${queryFloor}वीं मंजिल पर कौन रहता/रहती है?`,
      `ਮੰਜ਼ਿਲ ${queryFloor} 'ਤੇ ਕੌਣ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ?`,
    );
    optionPool = people.map((id) => label(personById(id).label, language));
  }
  const distractors = shuffle(optionPool.filter((x) => x !== correct), seed + ":opts").slice(0, 3);
  const options = shuffle([correct, ...distractors], seed + ":option-order");
  const correctIndex = options.indexOf(correct);
  const intro = t(
    language,
    `${count} persons—${personList(people, language)}—live on different floors of a building numbered 1 to ${count} from bottom to top.`,
    `${count} व्यक्ति—${personList(people, language)}—एक इमारत की अलग-अलग मंजिलों पर रहते हैं। मंजिलें नीचे से ऊपर 1 से ${count} तक क्रमांकित हैं।`,
    `${count} ਵਿਅਕਤੀ—${personList(people, language)}—ਇੱਕ ਇਮਾਰਤ ਦੀਆਂ ਵੱਖ-ਵੱਖ ਮੰਜ਼ਿਲਾਂ 'ਤੇ ਰਹਿੰਦੇ ਹਨ। ਮੰਜ਼ਿਲਾਂ ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ 1 ਤੋਂ ${count} ਤੱਕ ਨੰਬਰਬੱਧ ਹਨ।`,
  );
  const clueText = clues.map((clue) => renderFloorClue(clue, language)).join(" ");
  const stem = `${intro}\n\n${clueText}\n\n${question}`;
  const explanation = [
    t(language, "Number the floors from bottom to top and apply the relative clues before the exclusions.", "मंजिलों को नीचे से ऊपर क्रमांकित करके पहले सापेक्ष शर्तें लगाएँ, फिर निषेध वाली शर्तों का उपयोग करें।", "ਮੰਜ਼ਿਲਾਂ ਨੂੰ ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ ਨੰਬਰ ਦੇ ਕੇ ਪਹਿਲਾਂ ਸਬੰਧਿਤ ਸ਼ਰਤਾਂ ਲਗਾਓ, ਫਿਰ ਮਨਾਹੀ ਵਾਲੀਆਂ ਸ਼ਰਤਾਂ ਵਰਤੋ।"),
    floorTable(target, language),
    t(language, `The clues leave only this arrangement, so the answer is ${correct}.`, `इन शर्तों से केवल यही व्यवस्था बनती है, इसलिए उत्तर ${correct} है।`, `ਇਨ੍ਹਾਂ ਸ਼ਰਤਾਂ ਨਾਲ ਕੇਵਲ ਇਹੀ ਵਿਵਸਥਾ ਬਣਦੀ ਹੈ, ਇਸ ਲਈ ਉੱਤਰ ${correct} ਹੈ।`),
  ].join("\n\n");

  return Object.freeze({
    packageId: "FLR-001",
    qlId: "FLR-QL-001",
    checkpointId: "FLR-CP-001",
    language,
    locale: localeFor(language),
    difficulty,
    seed,
    stem,
    options: Object.freeze(options),
    correctIndex,
    canonicalAnswer: correct,
    explanation,
    proof: Object.freeze({
      worldCountBefore: allWorlds.length,
      worldCountAfter: filtered.length,
      uniqueSolution: true as const,
      clueCount: clues.length,
      targetFingerprint: floorWorldFingerprint(target),
      solvedFingerprint: floorWorldFingerprint(filtered[0]!),
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

function buildAttributeWorlds(people: readonly string[], subjects: readonly string[]): AttributeWorld[] {
  const floorOrders = permutations(people);
  const subjectOrders = permutations(subjects);
  const worlds: AttributeWorld[] = [];
  for (const order of floorOrders) {
    for (const assignment of subjectOrders) {
      const subjectByPerson: Record<string, string> = {};
      people.forEach((person, index) => { subjectByPerson[person] = assignment[index]!; });
      worlds.push({ order, subjectByPerson });
    }
  }
  return worlds;
}

function attributeCandidateClues(
  target: AttributeWorld,
  people: readonly string[],
  subjects: readonly string[],
  excludedPerson: string,
): AttributeClue[] {
  const floorClues = floorCandidateClues({ order: target.order }, excludedPerson);
  const out: AttributeClue[] = [...floorClues];
  for (const person of people) {
    const subject = target.subjectByPerson[person]!;
    if (person !== excludedPerson) out.push({ kind: "PERSON_SUBJECT", person, subject });
  }
  for (const subject of subjects) {
    const holder = subjectHolder(target, subject);
    const floor = floorOf({ order: target.order }, holder);
    out.push({ kind: "FLOOR_SUBJECT", floor, subject });
    for (const person of people) {
      const pf = floorOf({ order: target.order }, person);
      if (floor > pf) out.push({ kind: "SUBJECT_ABOVE_PERSON", subject, person });
      if (pf > floor) out.push({ kind: "PERSON_ABOVE_SUBJECT", person, subject });
    }
  }
  const priority = (clue: AttributeClue) =>
    clue.kind === "SUBJECT_ABOVE_PERSON" || clue.kind === "PERSON_ABOVE_SUBJECT" ? 0 :
    clue.kind === "FLOOR_SUBJECT" ? 1 :
    clue.kind === "PERSON_SUBJECT" ? 2 :
    clue.kind === "IMMEDIATE_ABOVE" || clue.kind === "GAP" ? 3 :
    clue.kind === "ABOVE" ? 4 :
    clue.kind === "PARITY" ? 5 :
    clue.kind === "NOT_FLOOR" ? 6 : 7;
  return out.sort((a, b) => priority(a) - priority(b));
}

function renderAttributeClue(clue: AttributeClue, language: FlrLanguage): string {
  if (
    clue.kind === "FIXED" || clue.kind === "ABOVE" || clue.kind === "IMMEDIATE_ABOVE" ||
    clue.kind === "GAP" || clue.kind === "PARITY" || clue.kind === "NOT_FLOOR"
  ) return renderFloorClue(clue, language);
  const p = (id: string) => label(personById(id).label, language);
  const s = (id: string) => label(subjectById(id).label, language);
  switch (clue.kind) {
    case "PERSON_SUBJECT":
      return t(language, `${p(clue.person)} studies ${s(clue.subject)}.`, `${p(clue.person)} ${s(clue.subject)} पढ़ता/पढ़ती है।`, `${p(clue.person)} ${s(clue.subject)} ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ।`);
    case "FLOOR_SUBJECT":
      return t(language, `The person who studies ${s(clue.subject)} lives on floor ${clue.floor}.`, `${s(clue.subject)} पढ़ने वाला व्यक्ति ${clue.floor}वीं मंजिल पर रहता है।`, `${s(clue.subject)} ਪੜ੍ਹਨ ਵਾਲਾ ਵਿਅਕਤੀ ਮੰਜ਼ਿਲ ${clue.floor} 'ਤੇ ਰਹਿੰਦਾ ਹੈ।`);
    case "SUBJECT_ABOVE_PERSON":
      return t(language, `The person who studies ${s(clue.subject)} lives above ${p(clue.person)}.`, `${s(clue.subject)} पढ़ने वाला व्यक्ति ${p(clue.person)} से ऊपर रहता है।`, `${s(clue.subject)} ਪੜ੍ਹਨ ਵਾਲਾ ਵਿਅਕਤੀ ${p(clue.person)} ਤੋਂ ਉੱਪਰ ਰਹਿੰਦਾ ਹੈ।`);
    case "PERSON_ABOVE_SUBJECT":
      return t(language, `${p(clue.person)} lives above the person who studies ${s(clue.subject)}.`, `${p(clue.person)}, ${s(clue.subject)} पढ़ने वाले व्यक्ति से ऊपर रहता/रहती है।`, `${p(clue.person)}, ${s(clue.subject)} ਪੜ੍ਹਨ ਵਾਲੇ ਵਿਅਕਤੀ ਤੋਂ ਉੱਪਰ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
  }
}

function attributeTable(world: AttributeWorld, language: FlrLanguage): string {
  const rows = [...world.order].map((person, index) => ({
    floor: index + 1,
    person: label(personById(person).label, language),
    subject: label(subjectById(world.subjectByPerson[person]!).label, language),
  })).reverse();
  return [
    t(language, "| Floor | Person | Study area |", "| मंजिल | व्यक्ति | विषय |", "| ਮੰਜ਼ਿਲ | ਵਿਅਕਤੀ | ਵਿਸ਼ਾ |"),
    "|---:|---|---|",
    ...rows.map((row) => `| ${row.floor} | ${row.person} | ${row.subject} |`),
  ].join("\n");
}

function buildAttributeQuestion(
  seed: string,
  language: FlrLanguage,
  difficulty: FlrDifficulty,
): GeneratedFlr001Question {
  const people = choosePeople(seed + ":attr", 5);
  const subjects = shuffle(SUBJECT_POOL.map((x) => x.id), seed + ":subjects").slice(0, 5);
  const order = shuffle(people, seed + ":floor-order");
  const subjectOrder = shuffle(subjects, seed + ":subject-order");
  const subjectByPerson: Record<string, string> = {};
  people.forEach((person, index) => { subjectByPerson[person] = subjectOrder[index]!; });
  const target: AttributeWorld = { order, subjectByPerson };
  const worlds = buildAttributeWorlds(people, subjects);
  const queryPerson = people[hash(seed + ":query-person") % people.length]!;
  const candidates = attributeCandidateClues(target, people, subjects, queryPerson);
  const selected = selectUniqueClues(
    worlds, target, candidates, truthAttributeClue, attributeWorldFingerprint,
    seed + ":select", difficulty === "Hard" ? 7 : 6,
  );
  const max = difficulty === "Hard" ? 10 : 9;
  const clues = selected.clues.slice(0, max);
  const filtered = worlds.filter((world) => clues.every((clue) => truthAttributeClue(world, clue)));
  if (filtered.length !== 1) throw new Error("FLR-QL-002 post-trim clues lost uniqueness.");

  const correctId = target.subjectByPerson[queryPerson]!;
  const correct = label(subjectById(correctId).label, language);
  const distractors = shuffle(
    subjects.filter((id) => id !== correctId).map((id) => label(subjectById(id).label, language)),
    seed + ":opts",
  ).slice(0, 3);
  const options = shuffle([correct, ...distractors], seed + ":option-order");
  const correctIndex = options.indexOf(correct);
  const intro = t(
    language,
    `Five persons—${personList(people, language)}—live on five different floors numbered 1 to 5 from bottom to top. Each studies a different subject: ${subjects.map((id) => label(subjectById(id).label, language)).join(", ")}.`,
    `पाँच व्यक्ति—${personList(people, language)}—नीचे से ऊपर 1 से 5 तक क्रमांकित अलग-अलग मंजिलों पर रहते हैं। प्रत्येक एक अलग विषय पढ़ता/पढ़ती है: ${subjects.map((id) => label(subjectById(id).label, language)).join(", ")}।`,
    `ਪੰਜ ਵਿਅਕਤੀ—${personList(people, language)}—ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ 1 ਤੋਂ 5 ਤੱਕ ਨੰਬਰਬੱਧ ਵੱਖ-ਵੱਖ ਮੰਜ਼ਿਲਾਂ 'ਤੇ ਰਹਿੰਦੇ ਹਨ। ਹਰ ਇੱਕ ਵੱਖਰਾ ਵਿਸ਼ਾ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ: ${subjects.map((id) => label(subjectById(id).label, language)).join(", ")}।`,
  );
  const clueText = clues.map((clue) => renderAttributeClue(clue, language)).join(" ");
  const question = t(
    language,
    `Which subject does ${label(personById(queryPerson).label, language)} study?`,
    `${label(personById(queryPerson).label, language)} कौन-सा विषय पढ़ता/पढ़ती है?`,
    `${label(personById(queryPerson).label, language)} ਕਿਹੜਾ ਵਿਸ਼ਾ ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ?`,
  );
  const stem = `${intro}\n\n${clueText}\n\n${question}`;
  const explanation = [
    t(language, "Place the floor relations first, then attach each study area using the cross-links.", "पहले मंजिल संबंध तय करें, फिर दिए गए संबंधों से प्रत्येक विषय को सही व्यक्ति से जोड़ें।", "ਪਹਿਲਾਂ ਮੰਜ਼ਿਲਾਂ ਦੇ ਸਬੰਧ ਤੈਅ ਕਰੋ, ਫਿਰ ਦਿੱਤੇ ਸਬੰਧਾਂ ਨਾਲ ਹਰ ਵਿਸ਼ੇ ਨੂੰ ਸਹੀ ਵਿਅਕਤੀ ਨਾਲ ਜੋੜੋ।"),
    attributeTable(target, language),
    t(language, `Only this combined arrangement satisfies every clue. Therefore, ${label(personById(queryPerson).label, language)} studies ${correct}.`, `सभी शर्तों को केवल यही संयुक्त व्यवस्था पूरा करती है। इसलिए ${label(personById(queryPerson).label, language)} ${correct} पढ़ता/पढ़ती है।`, `ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਕੇਵਲ ਇਹੀ ਜੋੜੀ ਹੋਈ ਵਿਵਸਥਾ ਪੂਰਾ ਕਰਦੀ ਹੈ। ਇਸ ਲਈ ${label(personById(queryPerson).label, language)} ${correct} ਪੜ੍ਹਦਾ/ਪੜ੍ਹਦੀ ਹੈ।`),
  ].join("\n\n");

  return Object.freeze({
    packageId: "FLR-001", qlId: "FLR-QL-002", checkpointId: "FLR-CP-002",
    language, locale: localeFor(language), difficulty, seed, stem,
    options: Object.freeze(options), correctIndex, canonicalAnswer: correct, explanation,
    proof: Object.freeze({
      worldCountBefore: worlds.length, worldCountAfter: filtered.length,
      uniqueSolution: true as const, clueCount: clues.length,
      targetFingerprint: attributeWorldFingerprint(target),
      solvedFingerprint: attributeWorldFingerprint(filtered[0]!),
    }),
    metadata: Object.freeze({
      deterministic: true as const, exactFiniteEnumeration: true as const,
      solverVerified: true as const, sourceBackedCore: true as const, reviewOnly: true as const,
    }),
  });
}

function gridSlots(floors: number): Slot[] {
  const slots: Slot[] = [];
  for (let floor = 1; floor <= floors; floor += 1) {
    slots.push({ floor, flat: 1 }, { floor, flat: 2 });
  }
  return slots;
}

function bijectiveGridWorlds(people: readonly string[], floors: number): GridWorld[] {
  const slots = gridSlots(floors).map(slotKey);
  return permutations(slots).map((assignment) => {
    const slotByPerson: Record<string, string> = {};
    people.forEach((person, index) => { slotByPerson[person] = assignment[index]!; });
    return { slotByPerson };
  });
}

function sharedGridWorlds(people: readonly string[], floors: number): GridWorld[] {
  const slots = gridSlots(floors).map(slotKey);
  const worlds: GridWorld[] = [];
  for (let a = 0; a < people.length; a += 1) {
    for (let b = a + 1; b < people.length; b += 1) {
      const pair = [people[a]!, people[b]!];
      const restPeople = people.filter((person) => !pair.includes(person));
      for (const sharedSlot of slots) {
        const restSlots = slots.filter((slot) => slot !== sharedSlot);
        for (const assignment of permutations(restSlots)) {
          const slotByPerson: Record<string, string> = {
            [pair[0]]: sharedSlot,
            [pair[1]]: sharedSlot,
          };
          restPeople.forEach((person, index) => { slotByPerson[person] = assignment[index]!; });
          worlds.push({ slotByPerson });
        }
      }
    }
  }
  return worlds;
}

function gridCandidateClues(
  target: GridWorld,
  people: readonly string[],
  excludedPerson?: string,
): GridClue[] {
  const out: GridClue[] = [];
  for (const person of people) {
    const slot = slotOf(target, person);
    if (person !== excludedPerson) out.push({ kind: "EXACT_SLOT", person, floor: slot.floor, flat: slot.flat });
    out.push({ kind: "FLOOR_PARITY", person, parity: slot.floor % 2 === 0 ? "EVEN" : "ODD" });
    for (let floor = 1; floor <= Math.max(...people.map((p) => slotOf(target, p).floor)); floor += 1) {
      if (floor !== slot.floor) out.push({ kind: "NOT_FLOOR", person, floor });
    }
  }
  for (const left of people) for (const right of people) {
    if (left === right) continue;
    const a = slotOf(target, left), b = slotOf(target, right);
    if (a.floor === b.floor) out.push({ kind: "SAME_FLOOR", left, right });
    if (a.floor === b.floor && a.flat === 1 && b.flat === 2) out.push({ kind: "WEST_OF", west: left, east: right });
    if (a.flat !== b.flat) out.push({ kind: "DIFFERENT_FLAT", left, right });
    const delta = a.floor - b.floor;
    if (a.flat === b.flat && delta > 0) out.push({ kind: "SAME_FLAT_ABOVE", upper: left, lower: right });
    if (a.flat === b.flat && delta === 1) out.push({ kind: "IMMEDIATE_ABOVE_SAME_FLAT", upper: left, lower: right });
    if (delta >= 2 && delta <= 3) out.push({ kind: "FLOOR_GAP", upper: left, lower: right, gap: delta - 1 });
  }
  const priority = (clue: GridClue) =>
    clue.kind === "WEST_OF" || clue.kind === "IMMEDIATE_ABOVE_SAME_FLAT" ? 0 :
    clue.kind === "SAME_FLAT_ABOVE" || clue.kind === "FLOOR_GAP" ? 1 :
    clue.kind === "SAME_FLOOR" || clue.kind === "DIFFERENT_FLAT" ? 2 :
    clue.kind === "FLOOR_PARITY" ? 3 :
    clue.kind === "NOT_FLOOR" ? 4 : 5;
  return out.sort((a, b) => priority(a) - priority(b));
}

function renderGridClue(clue: GridClue, language: FlrLanguage): string {
  const p = (id: string) => label(personById(id).label, language);
  switch (clue.kind) {
    case "EXACT_SLOT":
      return t(language, `${p(clue.person)} lives on floor ${clue.floor} in Flat ${clue.flat}.`, `${p(clue.person)} ${clue.floor}वीं मंजिल के फ्लैट ${clue.flat} में रहता/रहती है।`, `${p(clue.person)} ਮੰਜ਼ਿਲ ${clue.floor} ਦੇ ਫਲੈਟ ${clue.flat} ਵਿੱਚ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "SAME_FLOOR":
      return t(language, `${p(clue.left)} and ${p(clue.right)} live on the same floor.`, `${p(clue.left)} और ${p(clue.right)} एक ही मंजिल पर रहते हैं।`, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਇੱਕੋ ਮੰਜ਼ਿਲ 'ਤੇ ਰਹਿੰਦੇ ਹਨ।`);
    case "WEST_OF":
      return t(language, `${p(clue.west)} lives immediately west of ${p(clue.east)} on the same floor.`, `${p(clue.west)} उसी मंजिल पर ${p(clue.east)} के ठीक पश्चिम में रहता/रहती है।`, `${p(clue.west)} ਉਸੇ ਮੰਜ਼ਿਲ 'ਤੇ ${p(clue.east)} ਦੇ ਬਿਲਕੁਲ ਪੱਛਮ ਵੱਲ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "SAME_FLAT_ABOVE":
      return t(language, `${p(clue.upper)} lives above ${p(clue.lower)} in the same numbered flat.`, `${p(clue.upper)}, ${p(clue.lower)} से ऊपर उसी नंबर वाले फ्लैट में रहता/रहती है।`, `${p(clue.upper)}, ${p(clue.lower)} ਤੋਂ ਉੱਪਰ ਉਸੇ ਨੰਬਰ ਵਾਲੇ ਫਲੈਟ ਵਿੱਚ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "IMMEDIATE_ABOVE_SAME_FLAT":
      return t(language, `${p(clue.upper)} lives immediately above ${p(clue.lower)} in the same numbered flat.`, `${p(clue.upper)}, ${p(clue.lower)} से ठीक एक मंजिल ऊपर उसी नंबर वाले फ्लैट में रहता/रहती है।`, `${p(clue.upper)}, ${p(clue.lower)} ਤੋਂ ਬਿਲਕੁਲ ਇੱਕ ਮੰਜ਼ਿਲ ਉੱਪਰ ਉਸੇ ਨੰਬਰ ਵਾਲੇ ਫਲੈਟ ਵਿੱਚ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "FLOOR_GAP":
      return t(language, `Exactly ${clue.gap} floor lies between ${p(clue.upper)} and ${p(clue.lower)}, with ${p(clue.upper)} above.`, `${p(clue.upper)} और ${p(clue.lower)} की मंजिलों के बीच ठीक ${clue.gap} मंजिल है और ${p(clue.upper)} ऊपर रहता/रहती है।`, `${p(clue.upper)} ਅਤੇ ${p(clue.lower)} ਦੀਆਂ ਮੰਜ਼ਿਲਾਂ ਵਿਚਕਾਰ ਠੀਕ ${clue.gap} ਮੰਜ਼ਿਲ ਹੈ ਅਤੇ ${p(clue.upper)} ਉੱਪਰ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "FLOOR_PARITY":
      return t(language, `${p(clue.person)} lives on an ${clue.parity === "EVEN" ? "even" : "odd"}-numbered floor.`, `${p(clue.person)} ${clue.parity === "EVEN" ? "सम" : "विषम"} संख्या वाली मंजिल पर रहता/रहती है।`, `${p(clue.person)} ${clue.parity === "EVEN" ? "ਜੋੜੀ" : "ਟਾਂਕ"} ਨੰਬਰ ਵਾਲੀ ਮੰਜ਼ਿਲ 'ਤੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`);
    case "NOT_FLOOR":
      return t(language, `${p(clue.person)} does not live on floor ${clue.floor}.`, `${p(clue.person)} ${clue.floor}वीं मंजिल पर नहीं रहता/रहती।`, `${p(clue.person)} ਮੰਜ਼ਿਲ ${clue.floor} 'ਤੇ ਨਹੀਂ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ।`);
    case "DIFFERENT_FLAT":
      return t(language, `${p(clue.left)} and ${p(clue.right)} live in different numbered flats.`, `${p(clue.left)} और ${p(clue.right)} अलग-अलग नंबर वाले फ्लैट में रहते हैं।`, `${p(clue.left)} ਅਤੇ ${p(clue.right)} ਵੱਖਰੇ ਨੰਬਰ ਵਾਲੇ ਫਲੈਟਾਂ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ।`);
  }
}

function gridTable(world: GridWorld, floors: number, language: FlrLanguage): string {
  const rows: string[] = [
    t(language, "| Floor | Flat 1 (West) | Flat 2 (East) |", "| मंजिल | फ्लैट 1 (पश्चिम) | फ्लैट 2 (पूर्व) |", "| ਮੰਜ਼ਿਲ | ਫਲੈਟ 1 (ਪੱਛਮ) | ਫਲੈਟ 2 (ਪੂਰਬ) |"),
    "|---:|---|---|",
  ];
  for (let floor = floors; floor >= 1; floor -= 1) {
    const left = occupantsOf(world, { floor, flat: 1 }).map((id) => label(personById(id).label, language)).join(" + ");
    const right = occupantsOf(world, { floor, flat: 2 }).map((id) => label(personById(id).label, language)).join(" + ");
    rows.push(`| ${floor} | ${left} | ${right} |`);
  }
  return rows.join("\n");
}

function gridIntro(people: readonly string[], floors: number, language: FlrLanguage, shared: boolean): string {
  const occupancy = shared
    ? t(language, "Exactly one flat contains two persons; every other flat contains one.", "ठीक एक फ्लैट में दो व्यक्ति रहते हैं; बाकी हर फ्लैट में एक व्यक्ति रहता है।", "ਠੀਕ ਇੱਕ ਫਲੈਟ ਵਿੱਚ ਦੋ ਵਿਅਕਤੀ ਰਹਿੰਦੇ ਹਨ; ਬਾਕੀ ਹਰ ਫਲੈਟ ਵਿੱਚ ਇੱਕ ਵਿਅਕਤੀ ਰਹਿੰਦਾ ਹੈ।")
    : t(language, "Each person lives in a different flat.", "हर व्यक्ति अलग फ्लैट में रहता है।", "ਹਰ ਵਿਅਕਤੀ ਵੱਖਰੇ ਫਲੈਟ ਵਿੱਚ ਰਹਿੰਦਾ ਹੈ।");
  return t(
    language,
    `${personList(people, language)} live in a ${floors}-floor building numbered 1 to ${floors} from bottom to top. Each floor has two flats: Flat 1 to the west of Flat 2, and flats with the same number are vertically aligned. ${occupancy}`,
    `${personList(people, language)} एक ${floors}-मंजिला इमारत में रहते हैं, जिसकी मंजिलें नीचे से ऊपर 1 से ${floors} तक क्रमांकित हैं। हर मंजिल पर दो फ्लैट हैं: फ्लैट 1, फ्लैट 2 के पश्चिम में है और समान नंबर वाले फ्लैट एक-दूसरे के ठीक ऊपर/नीचे हैं। ${occupancy}`,
    `${personList(people, language)} ਇੱਕ ${floors}-ਮੰਜ਼ਿਲਾ ਇਮਾਰਤ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ, ਜਿਸ ਦੀਆਂ ਮੰਜ਼ਿਲਾਂ ਹੇਠਾਂ ਤੋਂ ਉੱਪਰ 1 ਤੋਂ ${floors} ਤੱਕ ਨੰਬਰਬੱਧ ਹਨ। ਹਰ ਮੰਜ਼ਿਲ 'ਤੇ ਦੋ ਫਲੈਟ ਹਨ: ਫਲੈਟ 1, ਫਲੈਟ 2 ਦੇ ਪੱਛਮ ਵੱਲ ਹੈ ਅਤੇ ਇੱਕੋ ਨੰਬਰ ਵਾਲੇ ਫਲੈਟ ਸਿੱਧੇ ਉੱਪਰ/ਹੇਠਾਂ ਹਨ। ${occupancy}`,
  );
}

function buildGridQuestion(
  seed: string,
  language: FlrLanguage,
  difficulty: FlrDifficulty,
): GeneratedFlr001Question {
  const floors = 4;
  const people = choosePeople(seed + ":grid", 8);
  const slotKeys = shuffle(gridSlots(floors).map(slotKey), seed + ":target-slots");
  const slotByPerson: Record<string, string> = {};
  people.forEach((person, index) => { slotByPerson[person] = slotKeys[index]!; });
  const target: GridWorld = { slotByPerson };
  const worlds = bijectiveGridWorlds(people, floors);
  const queryPerson = people[hash(seed + ":query-person") % people.length]!;
  const candidates = gridCandidateClues(target, people, queryPerson);
  const selected = selectUniqueClues(
    worlds, target, candidates, truthGridClue, gridFingerprint,
    seed + ":select", difficulty === "Hard" ? 7 : 6,
  );
  const max = difficulty === "Hard" ? 10 : 9;
  const clues = selected.clues.slice(0, max);
  const filtered = worlds.filter((world) => clues.every((clue) => truthGridClue(world, clue)));
  if (filtered.length !== 1) throw new Error("FLR-QL-003 post-trim clues lost uniqueness.");

  const correctSlot = slotOf(target, queryPerson);
  const correct = floorName(correctSlot.floor, language) + ", " + flatName(correctSlot.flat, language);
  const allSlots = gridSlots(floors).map((slot) => floorName(slot.floor, language) + ", " + flatName(slot.flat, language));
  const distractors = shuffle(allSlots.filter((x) => x !== correct), seed + ":opts").slice(0, 3);
  const options = shuffle([correct, ...distractors], seed + ":option-order");
  const correctIndex = options.indexOf(correct);
  const stem = `${gridIntro(people, floors, language, false)}\n\n${clues.map((clue) => renderGridClue(clue, language)).join(" ")}\n\n${t(language, `Where does ${label(personById(queryPerson).label, language)} live?`, `${label(personById(queryPerson).label, language)} कहाँ रहता/रहती है?`, `${label(personById(queryPerson).label, language)} ਕਿੱਥੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ?`)}`;
  const explanation = [
    t(language, "Draw the building as a floor-by-flat grid. Keep west/east clues horizontal and same-flat clues vertical.", "इमारत को मंजिल-और-फ्लैट ग्रिड के रूप में बनाएँ। पश्चिम/पूर्व की शर्तें क्षैतिज और समान-फ्लैट की शर्तें ऊर्ध्वाधर रखें।", "ਇਮਾਰਤ ਨੂੰ ਮੰਜ਼ਿਲ-ਅਤੇ-ਫਲੈਟ ਗ੍ਰਿਡ ਵਜੋਂ ਬਣਾਓ। ਪੱਛਮ/ਪੂਰਬ ਵਾਲੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਲੰਬਕਾਰੀ ਦੀ ਬਜਾਏ ਆੜੀ ਅਤੇ ਇੱਕੋ-ਫਲੈਟ ਵਾਲੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਖੜ੍ਹੀ ਦਿਸ਼ਾ ਵਿੱਚ ਰੱਖੋ।"),
    gridTable(target, floors, language),
    t(language, `The unique grid places ${label(personById(queryPerson).label, language)} at ${correct}.`, `एकमात्र सही ग्रिड में ${label(personById(queryPerson).label, language)} ${correct} पर रहता/रहती है।`, `ਇਕੋ ਸਹੀ ਗ੍ਰਿਡ ਵਿੱਚ ${label(personById(queryPerson).label, language)} ${correct} 'ਤੇ ਰਹਿੰਦਾ/ਰਹਿੰਦੀ ਹੈ।`),
  ].join("\n\n");

  return Object.freeze({
    packageId: "FLR-001", qlId: "FLR-QL-003", checkpointId: "FLR-CP-003",
    language, locale: localeFor(language), difficulty, seed, stem,
    options: Object.freeze(options), correctIndex, canonicalAnswer: correct, explanation,
    proof: Object.freeze({
      worldCountBefore: worlds.length, worldCountAfter: filtered.length,
      uniqueSolution: true as const, clueCount: clues.length,
      targetFingerprint: gridFingerprint(target), solvedFingerprint: gridFingerprint(filtered[0]!),
    }),
    metadata: Object.freeze({
      deterministic: true as const, exactFiniteEnumeration: true as const,
      solverVerified: true as const, sourceBackedCore: true as const, reviewOnly: true as const,
    }),
  });
}

function sharedPair(world: GridWorld): [string, string] {
  const bySlot = new Map<string, string[]>();
  for (const [person, slot] of Object.entries(world.slotByPerson)) {
    const list = bySlot.get(slot) ?? [];
    list.push(person);
    bySlot.set(slot, list);
  }
  const pair = [...bySlot.values()].find((values) => values.length === 2);
  if (!pair) throw new Error("Shared-grid world lacks a two-person flat.");
  return [pair[0]!, pair[1]!];
}

function buildSharedQuestion(
  seed: string,
  language: FlrLanguage,
): GeneratedFlr001Question {
  const floors = 3;
  const people = choosePeople(seed + ":shared", 7);
  const shared = shuffle(people, seed + ":shared-pair").slice(0, 2);
  const sharedSlot = shuffle(gridSlots(floors), seed + ":shared-slot")[0]!;
  const restPeople = people.filter((person) => !shared.includes(person));
  const restSlots = shuffle(gridSlots(floors).filter((slot) => slotKey(slot) !== slotKey(sharedSlot)), seed + ":rest-slots");
  const slotByPerson: Record<string, string> = {
    [shared[0]!]: slotKey(sharedSlot),
    [shared[1]!]: slotKey(sharedSlot),
  };
  restPeople.forEach((person, index) => { slotByPerson[person] = slotKey(restSlots[index]!); });
  const target: GridWorld = { slotByPerson };
  const worlds = sharedGridWorlds(people, floors);
  const candidates = gridCandidateClues(target, people);
  const selected = selectUniqueClues(
    worlds, target, candidates, truthGridClue, gridFingerprint,
    seed + ":select", 8,
  );
  const clues = selected.clues.slice(0, 11);
  const filtered = worlds.filter((world) => clues.every((clue) => truthGridClue(world, clue)));
  if (filtered.length !== 1) throw new Error("FLR-QL-004 post-trim clues lost uniqueness.");

  const pair = sharedPair(target).sort();
  const pairLabel = (ids: readonly string[]) => ids.map((id) => label(personById(id).label, language)).join(" & ");
  const correct = pairLabel(pair);
  const wrongPairs: string[] = [];
  for (let i = 0; i < people.length; i += 1) for (let j = i + 1; j < people.length; j += 1) {
    const candidate = [people[i]!, people[j]!].sort();
    if (candidate[0] === pair[0] && candidate[1] === pair[1]) continue;
    wrongPairs.push(pairLabel(candidate));
  }
  const distractors = shuffle(wrongPairs, seed + ":opts").slice(0, 3);
  const options = shuffle([correct, ...distractors], seed + ":option-order");
  const correctIndex = options.indexOf(correct);
  const stem = `${gridIntro(people, floors, language, true)}\n\n${clues.map((clue) => renderGridClue(clue, language)).join(" ")}\n\n${t(language, "Which two persons live in the same flat?", "कौन-से दो व्यक्ति एक ही फ्लैट में रहते हैं?", "ਕਿਹੜੇ ਦੋ ਵਿਅਕਤੀ ਇੱਕੋ ਫਲੈਟ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ?")}`;
  const explanation = [
    t(language, "Do not assume one-to-one occupancy: keep one two-person slot available while applying the floor and flat relations.", "एक-से-एक आवास न मानें; मंजिल और फ्लैट संबंध लगाते समय एक दो-व्यक्ति वाला फ्लैट संभव रखें।", "ਇੱਕ-ਤੋਂ-ਇੱਕ ਰਹਾਇਸ਼ ਨਾ ਮੰਨੋ; ਮੰਜ਼ਿਲ ਅਤੇ ਫਲੈਟ ਸਬੰਧ ਲਗਾਉਂਦੇ ਸਮੇਂ ਇੱਕ ਦੋ-ਵਿਅਕਤੀ ਵਾਲਾ ਫਲੈਟ ਸੰਭਵ ਰੱਖੋ।"),
    gridTable(target, floors, language),
    t(language, `The only shared flat contains ${correct}.`, `एकमात्र साझा फ्लैट में ${correct} रहते हैं।`, `ਇਕੋ ਸਾਂਝੇ ਫਲੈਟ ਵਿੱਚ ${correct} ਰਹਿੰਦੇ ਹਨ।`),
  ].join("\n\n");

  return Object.freeze({
    packageId: "FLR-001", qlId: "FLR-QL-004", checkpointId: "FLR-CP-004",
    language, locale: localeFor(language), difficulty: "Hard", seed, stem,
    options: Object.freeze(options), correctIndex, canonicalAnswer: correct, explanation,
    proof: Object.freeze({
      worldCountBefore: worlds.length, worldCountAfter: filtered.length,
      uniqueSolution: true as const, clueCount: clues.length,
      targetFingerprint: gridFingerprint(target), solvedFingerprint: gridFingerprint(filtered[0]!),
    }),
    metadata: Object.freeze({
      deterministic: true as const, exactFiniteEnumeration: true as const,
      solverVerified: true as const, sourceBackedCore: true as const, reviewOnly: true as const,
    }),
  });
}

function difficultyFor(qlId: FlrQlId, seed: string, requested?: FlrDifficulty): FlrDifficulty {
  const authority = FLR_001_QL_AUTHORITIES.find((entry) => entry.qlId === qlId)!;
  const supported = authority.supportedDifficulties as readonly FlrDifficulty[];
  if (requested) {
    if (!supported.includes(requested)) {
      throw new Error(qlId + " does not support " + requested + " difficulty.");
    }
    return requested;
  }
  return supported[hash(seed + ":difficulty") % supported.length]!;
}

export function generateFlr001Question(
  qlId: FlrQlId,
  seed: string,
  language: FlrLanguage = "en",
  requestedDifficulty?: FlrDifficulty,
): GeneratedFlr001Question {
  if (!seed.trim()) throw new Error("FLR-001 seed must be non-empty.");
  const difficulty = difficultyFor(qlId, seed, requestedDifficulty);
  if (qlId === "FLR-QL-001") return buildFloorQuestion(seed, language, difficulty);
  if (qlId === "FLR-QL-002") return buildAttributeQuestion(seed, language, difficulty);
  if (qlId === "FLR-QL-003") return buildGridQuestion(seed, language, difficulty);
  return buildSharedQuestion(seed, language);
}
