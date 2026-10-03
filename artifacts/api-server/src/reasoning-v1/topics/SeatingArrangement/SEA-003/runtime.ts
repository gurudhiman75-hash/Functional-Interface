import { sea003Authority, type Sea003QlId } from "./authority.ts";

export type Sea003Language = "en" | "hi" | "pa";
export type Sea003Difficulty = "Easy" | "Medium" | "Hard";

type Localized = Readonly<{ en: string; hi: string; pa: string }>;
type Person = Readonly<{ id: string; name: Localized }>;
type Attribute = Readonly<{ id: string; label: Localized }>;

export interface Sea003GeneratedQuestion {
  readonly packageId: "SEA-003";
  readonly checkpointId: string;
  readonly qlId: Sea003QlId;
  readonly language: Sea003Language;
  readonly locale: "en-IN" | "hi-IN" | "pa-IN";
  readonly difficulty: Sea003Difficulty;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: string;
  readonly proof: Readonly<{
    worldCountBefore: number;
    worldCountAfter: 1;
    uniqueSolution: true;
    conditionEssential?: true;
    baseWorldCountWithoutConditional?: number;
  }>;
  readonly metadata: Readonly<{
    deterministic: true;
    exactFiniteEnumeration: true;
    solverVerified: true;
    reviewOnly: true;
    sourcePosture: string;
  }>;
}

const PEOPLE: readonly Person[] = Object.freeze([
  { id: "AMAN", name: { en: "Aman", hi: "अमन", pa: "ਅਮਨ" } },
  { id: "BHARAT", name: { en: "Bharat", hi: "भरत", pa: "ਭਰਤ" } },
  { id: "CHARU", name: { en: "Charu", hi: "चारु", pa: "ਚਾਰੂ" } },
  { id: "DEEPA", name: { en: "Deepa", hi: "दीपा", pa: "ਦੀਪਾ" } },
  { id: "FARHAN", name: { en: "Farhan", hi: "फरहान", pa: "ਫਰਹਾਨ" } },
  { id: "GAURI", name: { en: "Gauri", hi: "गौरी", pa: "ਗੌਰੀ" } },
  { id: "HARISH", name: { en: "Harish", hi: "हरीश", pa: "ਹਰੀਸ਼" } },
  { id: "ISHA", name: { en: "Isha", hi: "ईशा", pa: "ਈਸ਼ਾ" } },
  { id: "KARAN", name: { en: "Karan", hi: "करण", pa: "ਕਰਨ" } },
]);

const COLOURS: readonly Attribute[] = Object.freeze([
  { id: "BLUE", label: { en: "blue", hi: "नीला", pa: "ਨੀਲਾ" } },
  { id: "GREEN", label: { en: "green", hi: "हरा", pa: "ਹਰਾ" } },
  { id: "PINK", label: { en: "pink", hi: "गुलाबी", pa: "ਗੁਲਾਬੀ" } },
  { id: "WHITE", label: { en: "white", hi: "सफेद", pa: "ਚਿੱਟਾ" } },
  { id: "YELLOW", label: { en: "yellow", hi: "पीला", pa: "ਪੀਲਾ" } },
]);

function hash(value: string): number {
  let result = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    result ^= value.charCodeAt(i);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
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

function t(language: Sea003Language, en: string, hi: string, pa: string): string {
  return language === "en" ? en : language === "hi" ? hi : pa;
}

function locale(language: Sea003Language): Sea003GeneratedQuestion["locale"] {
  return language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
}

function person(id: string, language: Sea003Language): string {
  const found = PEOPLE.find((entry) => entry.id === id);
  if (!found) throw new Error("Unknown SEA-003 person " + id);
  return found.name[language];
}

function attr(id: string, language: Sea003Language): string {
  const found = COLOURS.find((entry) => entry.id === id);
  if (!found) throw new Error("Unknown SEA-003 attribute " + id);
  return found.label[language];
}

function pickPeople(seed: string, count: number): string[] {
  return shuffle(PEOPLE.map((entry) => entry.id), seed + ":people").slice(0, count);
}

function listPeople(ids: readonly string[], language: Sea003Language): string {
  const values = ids.map((id) => person(id, language));
  const joiner = t(language, "and", "और", "ਅਤੇ");
  return values.slice(0, -1).join(", ") + " " + joiner + " " + values.at(-1);
}

function optionSet(correct: string, distractors: readonly string[], seed: string): readonly string[] {
  return Object.freeze(shuffle([correct, ...distractors.filter((x) => x !== correct)].slice(0, 4), seed + ":options"));
}

function finalTable(order: readonly string[], language: Sea003Language, attrs?: Readonly<Record<string, string>>): string {
  const head = attrs
    ? t(language, "| Position | Person | Colour |", "| स्थान | व्यक्ति | रंग |", "| ਸਥਾਨ | ਵਿਅਕਤੀ | ਰੰਗ |")
    : t(language, "| Position | Person |", "| स्थान | व्यक्ति |", "| ਸਥਾਨ | ਵਿਅਕਤੀ |");
  const sep = attrs ? "|---:|---|---|" : "|---:|---|";
  const rows = order.map((id, index) => attrs
    ? `| ${index + 1} | ${person(id, language)} | ${attr(attrs[id]!, language)} |`
    : `| ${index + 1} | ${id === "__VACANT__" ? t(language, "Vacant", "खाली", "ਖਾਲੀ") : person(id, language)} |`);
  return [head, sep, ...rows].join("\n");
}

function assertUnique<T>(worlds: readonly T[], label: string): T {
  if (worlds.length !== 1) throw new Error(label + " expected one world, received " + worlds.length);
  return worlds[0]!;
}

function buildAttributeLinear(seed: string, language: Sea003Language): Sea003GeneratedQuestion {
  const ids = pickPeople(seed, 5);
  const colours = shuffle(COLOURS.map((entry) => entry.id), seed + ":colours");
  const [a,b,c,d,e] = ids;
  const attrByPerson: Record<string,string> = { [a!]: colours[0]!, [b!]: colours[1]!, [c!]: colours[2]!, [d!]: colours[3]!, [e!]: colours[4]! };
  const worlds: { order:string[]; attrs:Record<string,string> }[] = [];
  for (const order of permutations(ids)) for (const assignment of permutations(colours)) {
    const attrs = Object.fromEntries(ids.map((id,index)=>[id,assignment[index]!]));
    worlds.push({ order, attrs });
  }
  const solved = worlds.filter((w) =>
    w.order[0]===a && w.order[1]===b && w.order[2]===c &&
    w.order[3]===d && w.order[4]===e &&
    w.attrs[a!]===colours[0] && w.attrs[c!]===colours[2] &&
    w.attrs[e!]===colours[4] && w.attrs[b!]===colours[1]
  );
  const world = assertUnique(solved, "SEA-QL-043");
  const answer = attr(attrByPerson[d!]!, language);
  const options = optionSet(answer, colours.filter(x=>x!==attrByPerson[d!]).map(x=>attr(x,language)), seed);
  const stem = t(language,
    `Five people—${listPeople(ids,language)}—sit in a row facing north. Each likes a different colour among ${colours.map(x=>attr(x,language)).join(", ")}. ${person(a!,language)} sits at the left end and ${person(b!,language)} sits immediately to the right of ${person(a!,language)}. ${person(c!,language)} sits in the middle. ${person(d!,language)} sits immediately to the left of ${person(e!,language)}. ${person(a!,language)} likes ${attr(colours[0]!,language)}, ${person(c!,language)} likes ${attr(colours[2]!,language)}, and ${person(e!,language)} likes ${attr(colours[4]!,language)}. The person immediately to the left of ${person(c!,language)} likes ${attr(colours[1]!,language)}. Which colour does ${person(d!,language)} like?`,
    `पाँच व्यक्ति—${listPeople(ids,language)}—उत्तर की ओर मुख करके एक पंक्ति में बैठे हैं। प्रत्येक को ${colours.map(x=>attr(x,language)).join(", ")} में से अलग रंग पसंद है। ${person(a!,language)} बाएँ छोर पर है और ${person(b!,language)}, ${person(a!,language)} के ठीक दाएँ है। ${person(c!,language)} बीच में है। ${person(d!,language)}, ${person(e!,language)} के ठीक बाएँ है। ${person(a!,language)} को ${attr(colours[0]!,language)}, ${person(c!,language)} को ${attr(colours[2]!,language)} और ${person(e!,language)} को ${attr(colours[4]!,language)} रंग पसंद है। ${person(c!,language)} के ठीक बाएँ बैठे व्यक्ति को ${attr(colours[1]!,language)} रंग पसंद है। ${person(d!,language)} को कौन-सा रंग पसंद है?`,
    `ਪੰਜ ਵਿਅਕਤੀ—${listPeople(ids,language)}—ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ। ਹਰ ਇੱਕ ਨੂੰ ${colours.map(x=>attr(x,language)).join(", ")} ਵਿੱਚੋਂ ਵੱਖਰਾ ਰੰਗ ਪਸੰਦ ਹੈ। ${person(a!,language)} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਹੈ ਅਤੇ ${person(b!,language)}, ${person(a!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਹੈ। ${person(c!,language)} ਵਿਚਕਾਰ ਹੈ। ${person(d!,language)}, ${person(e!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਹੈ। ${person(a!,language)} ਨੂੰ ${attr(colours[0]!,language)}, ${person(c!,language)} ਨੂੰ ${attr(colours[2]!,language)} ਅਤੇ ${person(e!,language)} ਨੂੰ ${attr(colours[4]!,language)} ਰੰਗ ਪਸੰਦ ਹੈ। ${person(c!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਬੈਠੇ ਵਿਅਕਤੀ ਨੂੰ ${attr(colours[1]!,language)} ਰੰਗ ਪਸੰਦ ਹੈ। ${person(d!,language)} ਨੂੰ ਕਿਹੜਾ ਰੰਗ ਪਸੰਦ ਹੈ?`
  );
  return make("SEA-QL-043", language, "Medium", stem, options, answer,
    t(language, "First fix the seat order, then fill the colour layer.", "पहले बैठने का क्रम तय करें, फिर रंगों की परत भरें।", "ਪਹਿਲਾਂ ਬੈਠਣ ਦਾ ਕ੍ਰਮ ਤੈਅ ਕਰੋ, ਫਿਰ ਰੰਗਾਂ ਦੀ ਪਰਤ ਭਰੋ।") + "\n\n" + finalTable(world.order,language,world.attrs),
    worlds.length);
}

function buildAttributeCircular(seed:string, language:Sea003Language):Sea003GeneratedQuestion {
  const ids=pickPeople(seed,5), colours=shuffle(COLOURS.map(x=>x.id),seed+":colours");
  const [a,b,c,d,e]=ids;
  const worlds:{order:string[];attrs:Record<string,string>}[]=[];
  for(const rest of permutations(ids.slice(1))) {
    const order=[a!,...rest];
    for(const assignment of permutations(colours)) {
      worlds.push({order,attrs:Object.fromEntries(ids.map((id,i)=>[id,assignment[i]!]))});
    }
  }
  const solved=worlds.filter(w=>
    w.order[1]===b && w.order[2]===c && w.order[3]===d && w.order[4]===e &&
    w.attrs[a!]===colours[0] && w.attrs[b!]===colours[1] && w.attrs[d!]===colours[3] && w.attrs[e!]===colours[4]
  );
  const world=assertUnique(solved,"SEA-QL-044");
  const answer=attr(world.attrs[c!]!,language);
  const options=optionSet(answer,colours.filter(x=>x!==world.attrs[c!]).map(x=>attr(x,language)),seed);
  const stem=t(language,
    `Five people—${listPeople(ids,language)}—sit around a circular table facing the centre. ${person(b!,language)} sits immediately to the left of ${person(a!,language)}; ${person(c!,language)} sits second to the left of ${person(a!,language)}; and ${person(d!,language)} sits immediately to the left of ${person(c!,language)}. Each likes a different colour among ${colours.map(x=>attr(x,language)).join(", ")}. ${person(a!,language)}, ${person(b!,language)}, ${person(d!,language)} and ${person(e!,language)} like ${attr(colours[0]!,language)}, ${attr(colours[1]!,language)}, ${attr(colours[3]!,language)} and ${attr(colours[4]!,language)} respectively. Which colour does ${person(c!,language)} like?`,
    `पाँच व्यक्ति—${listPeople(ids,language)}—एक गोल मेज के चारों ओर केंद्र की ओर मुख करके बैठे हैं। ${person(b!,language)}, ${person(a!,language)} के ठीक बाएँ है; ${person(c!,language)}, ${person(a!,language)} के दूसरे बाएँ है; और ${person(d!,language)}, ${person(c!,language)} के ठीक बाएँ है। प्रत्येक को ${colours.map(x=>attr(x,language)).join(", ")} में से अलग रंग पसंद है। ${person(a!,language)}, ${person(b!,language)}, ${person(d!,language)} और ${person(e!,language)} को क्रमशः ${attr(colours[0]!,language)}, ${attr(colours[1]!,language)}, ${attr(colours[3]!,language)} और ${attr(colours[4]!,language)} रंग पसंद है। ${person(c!,language)} को कौन-सा रंग पसंद है?`,
    `ਪੰਜ ਵਿਅਕਤੀ—${listPeople(ids,language)}—ਇੱਕ ਗੋਲ ਮੇਜ਼ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਕੇਂਦਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠੇ ਹਨ। ${person(b!,language)}, ${person(a!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਹੈ; ${person(c!,language)}, ${person(a!,language)} ਦੇ ਦੂਜੇ ਖੱਬੇ ਹੈ; ਅਤੇ ${person(d!,language)}, ${person(c!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਹੈ। ਹਰ ਇੱਕ ਨੂੰ ${colours.map(x=>attr(x,language)).join(", ")} ਵਿੱਚੋਂ ਵੱਖਰਾ ਰੰਗ ਪਸੰਦ ਹੈ। ${person(a!,language)}, ${person(b!,language)}, ${person(d!,language)} ਅਤੇ ${person(e!,language)} ਨੂੰ ਕ੍ਰਮਵਾਰ ${attr(colours[0]!,language)}, ${attr(colours[1]!,language)}, ${attr(colours[3]!,language)} ਅਤੇ ${attr(colours[4]!,language)} ਰੰਗ ਪਸੰਦ ਹੈ। ${person(c!,language)} ਨੂੰ ਕਿਹੜਾ ਰੰਗ ਪਸੰਦ ਹੈ?`
  );
  return make("SEA-QL-044",language,"Hard",stem,options,answer,
    t(language,"Fix one person only to remove circular rotation, then solve seats and colours together.","गोल घुमाव की समानता हटाने के लिए केवल एक व्यक्ति को संदर्भ मानें, फिर सीट और रंग साथ हल करें।","ਗੋਲ ਘੁੰਮਾਅ ਦੀ ਸਮਮਿਤੀ ਹਟਾਉਣ ਲਈ ਕੇਵਲ ਇੱਕ ਵਿਅਕਤੀ ਨੂੰ ਹਵਾਲਾ ਮੰਨੋ, ਫਿਰ ਸੀਟਾਂ ਅਤੇ ਰੰਗ ਇਕੱਠੇ ਹੱਲ ਕਰੋ।")+"\n\n"+finalTable(world.order,language,world.attrs),worlds.length);
}

function buildSingleVacancy(seed:string,language:Sea003Language):Sea003GeneratedQuestion {
  const ids=pickPeople(seed,7), [a,b,c,d,e,f,g]=ids;
  const tokens=[...ids,"__VACANT__"];
  const worlds=permutations(tokens);
  const solved=worlds.filter(w=>
    w[0]===a && w[3]===d && w[4]===e && w[5]===f && w[6]==="__VACANT__" && w[7]===g && w[2]===c
  );
  const world=assertUnique(solved,"SEA-QL-045");
  const answer=person(c!,language);
  const options=optionSet(answer,ids.filter(x=>x!==c).slice(0,3).map(x=>person(x,language)),seed);
  const stem=t(language,
    `Seven people—${listPeople(ids,language)}—sit in two parallel rows of four seats each. Row 1 faces south and Row 2 faces north. Exactly one seat is vacant. ${person(a!,language)} sits at the left end of Row 1 and ${person(d!,language)} at its right end. ${person(e!,language)} sits opposite ${person(a!,language)}. ${person(f!,language)} sits immediately to the right of ${person(e!,language)}. The vacant seat is immediately to the right of ${person(f!,language)}. ${person(g!,language)} sits at the right end of Row 2. Who sits opposite the vacant seat?`,
    `सात व्यक्ति—${listPeople(ids,language)}—चार-चार सीटों वाली दो समानांतर पंक्तियों में बैठे हैं। पंक्ति 1 दक्षिण और पंक्ति 2 उत्तर की ओर मुख करती है। ठीक एक सीट खाली है। ${person(a!,language)} पंक्ति 1 के बाएँ छोर पर और ${person(d!,language)} उसके दाएँ छोर पर है। ${person(e!,language)}, ${person(a!,language)} के सामने है। ${person(f!,language)}, ${person(e!,language)} के ठीक दाएँ है। खाली सीट ${person(f!,language)} के ठीक दाएँ है। ${person(g!,language)} पंक्ति 2 के दाएँ छोर पर है। खाली सीट के सामने कौन बैठता/बैठती है?`,
    `ਸੱਤ ਵਿਅਕਤੀ—${listPeople(ids,language)}—ਚਾਰ-ਚਾਰ ਸੀਟਾਂ ਵਾਲੀਆਂ ਦੋ ਸਮਾਂਤਰ ਕਤਾਰਾਂ ਵਿੱਚ ਬੈਠੇ ਹਨ। ਕਤਾਰ 1 ਦੱਖਣ ਅਤੇ ਕਤਾਰ 2 ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਦੀ ਹੈ। ਠੀਕ ਇੱਕ ਸੀਟ ਖਾਲੀ ਹੈ। ${person(a!,language)} ਕਤਾਰ 1 ਦੇ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਅਤੇ ${person(d!,language)} ਉਸਦੇ ਸੱਜੇ ਸਿਰੇ 'ਤੇ ਹੈ। ${person(e!,language)}, ${person(a!,language)} ਦੇ ਸਾਹਮਣੇ ਹੈ। ${person(f!,language)}, ${person(e!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਹੈ। ਖਾਲੀ ਸੀਟ ${person(f!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਹੈ। ${person(g!,language)} ਕਤਾਰ 2 ਦੇ ਸੱਜੇ ਸਿਰੇ 'ਤੇ ਹੈ। ਖਾਲੀ ਸੀਟ ਦੇ ਸਾਹਮਣੇ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`
  );
  const arrangement=[...world.slice(0,4),...world.slice(4)];
  return make("SEA-QL-045",language,"Hard",stem,options,answer,
    t(language,"Treat the empty place as a real seat while placing the two rows.","खाली स्थान को भी वास्तविक सीट मानकर दोनों पंक्तियाँ बनाइए।","ਖਾਲੀ ਥਾਂ ਨੂੰ ਵੀ ਅਸਲ ਸੀਟ ਮੰਨ ਕੇ ਦੋਵੇਂ ਕਤਾਰਾਂ ਬਣਾਓ।")+"\n\n"+finalTable(arrangement,language),worlds.length);
}

function linearVacancyWorlds(ids:readonly string[], seats:number):string[][] {
  const out:string[][]=[];
  function place(index:number, remaining:string[], row:string[]) {
    if(index===seats) {
      if(remaining.length===0) out.push([...row]);
      return;
    }
    const seatsLeft=seats-index;
    if(remaining.length<seatsLeft) {
      row.push("__VACANT__"); place(index+1,remaining,row); row.pop();
    }
    for(let i=0;i<remaining.length;i++) {
      const id=remaining[i]!;
      row.push(id);
      place(index+1,[...remaining.slice(0,i),...remaining.slice(i+1)],row);
      row.pop();
    }
  }
  place(0,[...ids],[]);
  return out;
}

function buildMultiVacancy(seed:string,language:Sea003Language):Sea003GeneratedQuestion {
  const ids=pickPeople(seed,5), [a,b,c,d,e]=ids;
  const worlds=linearVacancyWorlds(ids,7);
  const solved=worlds.filter(w=>w[0]===a&&w[1]===b&&w[2]==="__VACANT__"&&w[3]===c&&w[4]==="__VACANT__"&&w[5]===d&&w[6]===e);
  const world=assertUnique(solved,"SEA-QL-046");
  const answer=t(language,"2","2","2");
  const options=optionSet(answer,["0","1","3"],seed);
  const stem=t(language,
    `Five people—${listPeople(ids,language)}—occupy five of seven seats in a row facing north; two seats are vacant. ${person(a!,language)} sits at the left end and ${person(b!,language)} immediately to the right of ${person(a!,language)}. A vacant seat is immediately to the right of ${person(b!,language)}. ${person(c!,language)} occupies the middle seat, and another vacant seat is immediately to the right of ${person(c!,language)}. ${person(d!,language)} sits immediately to the left of ${person(e!,language)}, who is at the right end. How many vacant seats lie between ${person(b!,language)} and ${person(e!,language)}?`,
    `पाँच व्यक्ति—${listPeople(ids,language)}—उत्तर की ओर मुख करके सात सीटों की एक पंक्ति में पाँच सीटों पर बैठे हैं; दो सीटें खाली हैं। ${person(a!,language)} बाएँ छोर पर और ${person(b!,language)}, ${person(a!,language)} के ठीक दाएँ है। ${person(b!,language)} के ठीक दाएँ एक सीट खाली है। ${person(c!,language)} बीच की सीट पर है और ${person(c!,language)} के ठीक दाएँ दूसरी सीट खाली है। ${person(d!,language)}, ${person(e!,language)} के ठीक बाएँ है और ${person(e!,language)} दाएँ छोर पर है। ${person(b!,language)} और ${person(e!,language)} के बीच कितनी खाली सीटें हैं?`,
    `ਪੰਜ ਵਿਅਕਤੀ—${listPeople(ids,language)}—ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਸੱਤ ਸੀਟਾਂ ਦੀ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਪੰਜ ਸੀਟਾਂ 'ਤੇ ਬੈਠੇ ਹਨ; ਦੋ ਸੀਟਾਂ ਖਾਲੀ ਹਨ। ${person(a!,language)} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਅਤੇ ${person(b!,language)}, ${person(a!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਹੈ। ${person(b!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਇੱਕ ਸੀਟ ਖਾਲੀ ਹੈ। ${person(c!,language)} ਵਿਚਕਾਰਲੀ ਸੀਟ 'ਤੇ ਹੈ ਅਤੇ ${person(c!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਦੂਜੀ ਸੀਟ ਖਾਲੀ ਹੈ। ${person(d!,language)}, ${person(e!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਹੈ ਅਤੇ ${person(e!,language)} ਸੱਜੇ ਸਿਰੇ 'ਤੇ ਹੈ। ${person(b!,language)} ਅਤੇ ${person(e!,language)} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੀਆਂ ਖਾਲੀ ਸੀਟਾਂ ਹਨ?`
  );
  return make("SEA-QL-046",language,"Medium",stem,options,answer,
    t(language,"Mark all seven physical seats first; vacancies are positions, not people.","पहले सभी सात वास्तविक सीटें अंकित करें; खाली स्थान भी स्थिति हैं।","ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਸੱਤ ਅਸਲ ਸੀਟਾਂ ਨਿਸ਼ਾਨ ਲਗਾਓ; ਖਾਲੀ ਥਾਂਵਾਂ ਵੀ ਸਥਿਤੀਆਂ ਹਨ।")+"\n\n"+finalTable(world,language),worlds.length);
}

function conditionalWorlds(ids:readonly string[]):string[][] { return permutations(ids); }

function buildConditional(seed:string,language:Sea003Language, implication:boolean):Sea003GeneratedQuestion {
  const ids=pickPeople(seed,5), [a,b,c,d,e]=ids;
  const worlds=conditionalWorlds(ids);
  const base=worlds.filter(w=>w[2]===c && w.indexOf(b!)===w.indexOf(a!)+1 && w.indexOf(d!)+1===w.indexOf(e!));
  const conditional=implication
    ? (w:string[]) => !(w[0]===d) || w[4]!==b
    : (w:string[]) => (w[0]===a) !== (w[0]===b);
  const solved=base.filter(conditional);
  const world=assertUnique(solved,implication?"SEA-QL-048":"SEA-QL-047");
  const answer=person(world[0]!,language);
  const options=optionSet(answer,ids.filter(x=>x!==world[0]).slice(0,3).map(x=>person(x,language)),seed);
  const conditionText=implication
    ? t(language,
        `If ${person(d!,language)} sits at the left end, then ${person(b!,language)} does not sit at the right end.`,
        `यदि ${person(d!,language)} बाएँ छोर पर बैठता/बैठती है, तो ${person(b!,language)} दाएँ छोर पर नहीं बैठता/बैठती है।`,
        `ਜੇ ${person(d!,language)} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ, ਤਾਂ ${person(b!,language)} ਸੱਜੇ ਸਿਰੇ 'ਤੇ ਨਹੀਂ ਬੈਠਦਾ/ਬੈਠਦੀ।`)
    : t(language,
        `Either ${person(a!,language)} or ${person(b!,language)} sits at the left end, but not both.`,
        `या तो ${person(a!,language)} या ${person(b!,language)} बाएँ छोर पर बैठता/बैठती है, लेकिन दोनों नहीं।`,
        `ਜਾਂ ${person(a!,language)} ਜਾਂ ${person(b!,language)} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ, ਪਰ ਦੋਵੇਂ ਨਹੀਂ।`);
  const stem=t(language,
    `Five people—${listPeople(ids,language)}—sit in a row facing north. ${person(c!,language)} sits in the middle. ${person(b!,language)} sits immediately to the right of ${person(a!,language)}. ${person(d!,language)} sits immediately to the left of ${person(e!,language)}. ${conditionText} Who sits at the left end?`,
    `पाँच व्यक्ति—${listPeople(ids,language)}—उत्तर की ओर मुख करके एक पंक्ति में बैठे हैं। ${person(c!,language)} बीच में बैठता/बैठती है। ${person(b!,language)}, ${person(a!,language)} के ठीक दाएँ बैठता/बैठती है। ${person(d!,language)}, ${person(e!,language)} के ठीक बाएँ बैठता/बैठती है। ${conditionText} बाएँ छोर पर कौन बैठता/बैठती है?`,
    `ਪੰਜ ਵਿਅਕਤੀ—${listPeople(ids,language)}—ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ। ${person(c!,language)} ਵਿਚਕਾਰ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ। ${person(b!,language)}, ${person(a!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ। ${person(d!,language)}, ${person(e!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ। ${conditionText} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਕੌਣ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ?`);
  return make(implication?"SEA-QL-048":"SEA-QL-047",language,"Hard",stem,options,answer,
    t(language,"The first three clues leave two valid arrangements. Apply the conditional clue to remove the remaining alternative.","पहली तीन शर्तें दो व्यवस्थाएँ छोड़ती हैं। अंतिम शर्त लगाकर गलत विकल्प हटाएँ।","ਪਹਿਲੀਆਂ ਤਿੰਨ ਸ਼ਰਤਾਂ ਦੋ ਵਿਵਸਥਾਵਾਂ ਛੱਡਦੀਆਂ ਹਨ। ਆਖਰੀ ਸ਼ਰਤ ਲਗਾ ਕੇ ਗਲਤ ਵਿਕਲਪ ਹਟਾਓ।")+"\n\n"+finalTable(world,language),
    worlds.length,{conditionEssential:true,baseWorldCountWithoutConditional:base.length});
}

type UncertainWorld={n:number;pos:Readonly<Record<string,number>>};
function uncertainWorlds(ids:readonly string[],minN:number,maxN:number):UncertainWorld[] {
  const out:UncertainWorld[]=[];
  for(let n=minN;n<=maxN;n++) {
    const choose=(index:number,used:Set<number>,pos:Record<string,number>)=>{
      if(index===ids.length){out.push({n,pos:{...pos}});return;}
      for(let seat=0;seat<n;seat++) if(!used.has(seat)){
        used.add(seat);pos[ids[index]!]=seat;choose(index+1,used,pos);delete pos[ids[index]!];used.delete(seat);
      }
    };
    choose(0,new Set(),{});
  }
  return out;
}

function buildUncertain(seed:string,language:Sea003Language,middle:boolean):Sea003GeneratedQuestion {
  const ids=pickPeople(seed,4), [a,b,c,d]=ids;
  const worlds=uncertainWorlds(ids,8,12);
  const solved=middle
    ? worlds.filter(w=>w.pos[a!]===2 && w.pos[c!]===w.pos[a!]+3 && w.pos[c!]===Math.floor(w.n/2) && w.n%2===1 && w.pos[b!]===w.pos[c!]+4 && w.pos[d!]===w.pos[b!]+1)
    : worlds.filter(w=>w.pos[a!]===4 && w.pos[b!]===w.pos[a!]+3 && w.pos[b!]===w.n-3 && w.pos[c!]===w.pos[b!]-1 && w.pos[d!]===0);
  const world=assertUnique(solved,middle?"SEA-QL-050":"SEA-QL-049");
  const answer=String(world.n);
  const options=optionSet(answer,["9","10","11","12"].filter(x=>x!==answer),seed);
  const stem=middle
    ? t(language,
      `An uncertain number of people sit in a row facing north. ${person(a!,language)} is third from the left. ${person(c!,language)} sits third to the right of ${person(a!,language)} and has the same number of people on both sides. ${person(b!,language)} sits fourth to the right of ${person(c!,language)}, and ${person(d!,language)} sits immediately to the right of ${person(b!,language)}. How many people are in the row?`,
      `एक अनिश्चित संख्या में व्यक्ति उत्तर की ओर मुख करके एक पंक्ति में बैठे हैं। ${person(a!,language)} बाएँ से तीसरे स्थान पर है। ${person(c!,language)}, ${person(a!,language)} के तीसरे दाएँ बैठता/बैठती है और उसके दोनों ओर समान संख्या में व्यक्ति हैं। ${person(b!,language)}, ${person(c!,language)} के चौथे दाएँ है और ${person(d!,language)}, ${person(b!,language)} के ठीक दाएँ है। पंक्ति में कुल कितने व्यक्ति हैं?`,
      `ਅਨਿਸ਼ਚਿਤ ਗਿਣਤੀ ਵਿੱਚ ਵਿਅਕਤੀ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ। ${person(a!,language)} ਖੱਬੇ ਤੋਂ ਤੀਜੇ ਸਥਾਨ 'ਤੇ ਹੈ। ${person(c!,language)}, ${person(a!,language)} ਦੇ ਤੀਜੇ ਸੱਜੇ ਬੈਠਦਾ/ਬੈਠਦੀ ਹੈ ਅਤੇ ਉਸਦੇ ਦੋਵੇਂ ਪਾਸਿਆਂ ਬਰਾਬਰ ਗਿਣਤੀ ਵਿੱਚ ਵਿਅਕਤੀ ਹਨ। ${person(b!,language)}, ${person(c!,language)} ਦੇ ਚੌਥੇ ਸੱਜੇ ਹੈ ਅਤੇ ${person(d!,language)}, ${person(b!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਹੈ। ਕਤਾਰ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਵਿਅਕਤੀ ਹਨ?`)
    : t(language,
      `An uncertain number of people sit in a row facing north. ${person(a!,language)} is fifth from the left. ${person(b!,language)} sits third to the right of ${person(a!,language)} and is third from the right end. ${person(c!,language)} sits immediately to the left of ${person(b!,language)}, while ${person(d!,language)} sits at the left end. How many people are in the row?`,
      `एक अनिश्चित संख्या में व्यक्ति उत्तर की ओर मुख करके एक पंक्ति में बैठे हैं। ${person(a!,language)} बाएँ से पाँचवें स्थान पर है। ${person(b!,language)}, ${person(a!,language)} के तीसरे दाएँ और दाएँ छोर से तीसरे स्थान पर है। ${person(c!,language)}, ${person(b!,language)} के ठीक बाएँ है, जबकि ${person(d!,language)} बाएँ छोर पर है। पंक्ति में कुल कितने व्यक्ति हैं?`,
      `ਅਨਿਸ਼ਚਿਤ ਗਿਣਤੀ ਵਿੱਚ ਵਿਅਕਤੀ ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ। ${person(a!,language)} ਖੱਬੇ ਤੋਂ ਪੰਜਵੇਂ ਸਥਾਨ 'ਤੇ ਹੈ। ${person(b!,language)}, ${person(a!,language)} ਦੇ ਤੀਜੇ ਸੱਜੇ ਅਤੇ ਸੱਜੇ ਸਿਰੇ ਤੋਂ ਤੀਜੇ ਸਥਾਨ 'ਤੇ ਹੈ। ${person(c!,language)}, ${person(b!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਹੈ, ਜਦਕਿ ${person(d!,language)} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਹੈ। ਕਤਾਰ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਵਿਅਕਤੀ ਹਨ?`);
  const explanation=t(language,
    `The positional conditions fix the row length at ${world.n}. No other length from 8 to 12 satisfies all named-person positions.`,
    `स्थान संबंधी शर्तें पंक्ति की कुल संख्या ${world.n} तय करती हैं। 8 से 12 के बीच कोई अन्य संख्या सभी शर्तें पूरी नहीं करती।`,
    `ਸਥਾਨ ਵਾਲੀਆਂ ਸ਼ਰਤਾਂ ਕਤਾਰ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ${world.n} ਤੈਅ ਕਰਦੀਆਂ ਹਨ। 8 ਤੋਂ 12 ਵਿਚਕਾਰ ਹੋਰ ਕੋਈ ਗਿਣਤੀ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀ ਨਹੀਂ ਕਰਦੀ।`);
  return make(middle?"SEA-QL-050":"SEA-QL-049",language,middle?"Hard":"Medium",stem,options,answer,explanation,worlds.length);
}

function buildExchange(seed:string,language:Sea003Language):Sea003GeneratedQuestion {
  const ids=pickPeople(seed,5), [a,b,c,d,e]=ids;
  const worlds=permutations(ids);
  const solved=worlds.filter(w=>w[0]===a&&w[1]===b&&w[2]===c&&w[3]===d&&w[4]===e);
  const base=assertUnique(solved,"SEA-QL-051");
  const transformed=[...base];
  const ib=transformed.indexOf(b!), id=transformed.indexOf(d!);
  [transformed[ib],transformed[id]]=[transformed[id]!,transformed[ib]!];
  const answer=String(transformed.indexOf(b!)+1);
  const options=optionSet(answer,["1","2","3","4","5"].filter(x=>x!==answer),seed);
  const stem=t(language,
    `Five people—${listPeople(ids,language)}—sit in a row facing north. ${person(a!,language)} sits at the left end. ${person(b!,language)} sits immediately to the right of ${person(a!,language)}. ${person(c!,language)} sits in the middle. ${person(d!,language)} sits immediately to the left of ${person(e!,language)}, who is at the right end. After the arrangement is completed, ${person(b!,language)} and ${person(d!,language)} exchange their seats. What is ${person(b!,language)}'s position from the left after the exchange?`,
    `पाँच व्यक्ति—${listPeople(ids,language)}—उत्तर की ओर मुख करके एक पंक्ति में बैठे हैं। ${person(a!,language)} बाएँ छोर पर है। ${person(b!,language)}, ${person(a!,language)} के ठीक दाएँ है। ${person(c!,language)} बीच में है। ${person(d!,language)}, ${person(e!,language)} के ठीक बाएँ है और ${person(e!,language)} दाएँ छोर पर है। व्यवस्था पूरी होने के बाद ${person(b!,language)} और ${person(d!,language)} अपनी सीटें बदलते हैं। अदला-बदली के बाद ${person(b!,language)} बाएँ से किस स्थान पर होगा/होगी?`,
    `ਪੰਜ ਵਿਅਕਤੀ—${listPeople(ids,language)}—ਉੱਤਰ ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਬੈਠੇ ਹਨ। ${person(a!,language)} ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਹੈ। ${person(b!,language)}, ${person(a!,language)} ਦੇ ਬਿਲਕੁਲ ਸੱਜੇ ਹੈ। ${person(c!,language)} ਵਿਚਕਾਰ ਹੈ। ${person(d!,language)}, ${person(e!,language)} ਦੇ ਬਿਲਕੁਲ ਖੱਬੇ ਹੈ ਅਤੇ ${person(e!,language)} ਸੱਜੇ ਸਿਰੇ 'ਤੇ ਹੈ। ਵਿਵਸਥਾ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ${person(b!,language)} ਅਤੇ ${person(d!,language)} ਆਪਣੀਆਂ ਸੀਟਾਂ ਬਦਲਦੇ ਹਨ। ਅਦਲਾ-ਬਦਲੀ ਤੋਂ ਬਾਅਦ ${person(b!,language)} ਖੱਬੇ ਤੋਂ ਕਿਹੜੇ ਸਥਾਨ 'ਤੇ ਹੋਵੇਗਾ/ਹੋਵੇਗੀ?`);
  const explanation=[
    t(language,"Solve the original arrangement first.","पहले मूल व्यवस्था हल करें।","ਪਹਿਲਾਂ ਮੂਲ ਵਿਵਸਥਾ ਹੱਲ ਕਰੋ।"),
    finalTable(base,language),
    t(language,"Now exchange only the two stated occupants.","अब केवल बताए गए दो व्यक्तियों की सीटें बदलें।","ਹੁਣ ਕੇਵਲ ਦੱਸੇ ਗਏ ਦੋ ਵਿਅਕਤੀਆਂ ਦੀਆਂ ਸੀਟਾਂ ਬਦਲੋ।"),
    finalTable(transformed,language),
    t(language,`So the required position is ${answer} from the left.`,`अतः आवश्यक स्थान बाएँ से ${answer} है।`,`ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਸਥਾਨ ਖੱਬੇ ਤੋਂ ${answer} ਹੈ।`)
  ].join("\n\n");
  return make("SEA-QL-051",language,"Medium",stem,options,answer,explanation,worlds.length);
}

function make(
  qlId:Sea003QlId, language:Sea003Language, difficulty:Sea003Difficulty,
  stem:string, options:readonly string[], answer:string, explanation:string,
  worldCountBefore:number,
  extra?:{conditionEssential:true;baseWorldCountWithoutConditional:number},
):Sea003GeneratedQuestion {
  const authority=sea003Authority(qlId);
  const correctIndex=options.indexOf(answer);
  if(correctIndex<0) throw new Error(qlId+" answer missing from options.");
  return Object.freeze({
    packageId:"SEA-003" as const,
    checkpointId:authority.checkpointId,
    qlId,
    language,
    locale:locale(language),
    difficulty,
    stem,
    options:Object.freeze([...options]),
    correctIndex,
    answer,
    explanation,
    proof:Object.freeze({
      worldCountBefore,
      worldCountAfter:1 as const,
      uniqueSolution:true as const,
      ...(extra??{}),
    }),
    metadata:Object.freeze({
      deterministic:true as const,
      exactFiniteEnumeration:true as const,
      solverVerified:true as const,
      reviewOnly:true as const,
      sourcePosture:authority.sourcePosture,
    }),
  });
}

export function generateSea003Question(
  qlId:Sea003QlId,
  seed:string,
  language:Sea003Language="en",
):Sea003GeneratedQuestion {
  if(!seed.trim()) throw new Error("SEA-003 seed must be non-empty.");
  if(qlId==="SEA-QL-043") return buildAttributeLinear(seed,language);
  if(qlId==="SEA-QL-044") return buildAttributeCircular(seed,language);
  if(qlId==="SEA-QL-045") return buildSingleVacancy(seed,language);
  if(qlId==="SEA-QL-046") return buildMultiVacancy(seed,language);
  if(qlId==="SEA-QL-047") return buildConditional(seed,language,false);
  if(qlId==="SEA-QL-048") return buildConditional(seed,language,true);
  if(qlId==="SEA-QL-049") return buildUncertain(seed,language,false);
  if(qlId==="SEA-QL-050") return buildUncertain(seed,language,true);
  return buildExchange(seed,language);
}
