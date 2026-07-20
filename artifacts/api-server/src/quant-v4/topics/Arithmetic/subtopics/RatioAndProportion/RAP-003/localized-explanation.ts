import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

type Language = "hi" | "pa";
type Domain = "partnership" | "age" | "income" | "mixture" | "replacement" | "denomination" | "rate" | "population" | "election" | "geometry";

function domain(cpId: string): Domain {
  const map: Record<string, Domain> = {
    "RAP-CP-013": "partnership", "RAP-CP-014": "age", "RAP-CP-015": "income",
    "RAP-CP-016": "mixture", "RAP-CP-017": "replacement", "RAP-CP-018": "denomination",
    "RAP-CP-019": "rate", "RAP-CP-020": "population", "RAP-CP-021": "election", "RAP-CP-022": "geometry",
  };
  return map[cpId] ?? "partnership";
}

const HI: Record<Domain, readonly [string, string]> = {
  partnership: ["निवेश और समय का गुणनफल निकालें।", "इसी प्रभावी अनुपात में लाभ या हानि बांटें।"],
  age: ["वर्तमान आयु को अनुपात के अनुसार मानें।", "सभी आयुओं में समान वर्ष जोड़कर या घटाकर समीकरण हल करें।"],
  income: ["आय, खर्च और बचत का संबंध लिखें।", "बचत = आय − खर्च का उपयोग करके मांगा गया मान निकालें।"],
  mixture: ["हर मिश्रण में मुख्य घटक की मात्रा निकालें।", "कुल घटक और कुल मिश्रण से नया अनुपात बनाएं।"],
  replacement: ["हर बार बची मूल मात्रा का भाग निकालें।", "सभी चरणों के बचे भागों को गुणा करके अंतिम मात्रा निकालें।"],
  denomination: ["हर प्रकार की संख्या को अनुपात के अनुसार मानें।", "संख्या × मूल्य करके कुल मूल्य का समीकरण हल करें।"],
  rate: ["दूरी = गति × समय या काम = दर × समय का संबंध लिखें।", "दिए गए अनुपात रखकर मांगा गया समय, दूरी या दर निकालें।"],
  population: ["कुल जनसंख्या को पहले मुख्य समूहों में बांटें।", "फिर चुने समूह को दिए दूसरे अनुपात में बांटें।"],
  election: ["कुल मतों से डाले गए और फिर वैध मत निकालें।", "वैध मतों को उम्मीदवारों के अनुपात में बांटें।"],
  geometry: ["संबंधित लंबाई का अनुपात लिखें।", "क्षेत्रफल के लिए अनुपात का वर्ग और आयतन के लिए घन लें।"],
};

const PA: Record<Domain, readonly [string, string]> = {
  partnership: ["ਨਿਵੇਸ਼ ਅਤੇ ਸਮੇਂ ਦਾ ਗੁਣਨਫਲ ਕੱਢੋ।", "ਇਸੇ ਪ੍ਰਭਾਵੀ ਅਨੁਪਾਤ ਵਿੱਚ ਲਾਭ ਜਾਂ ਘਾਟਾ ਵੰਡੋ।"],
  age: ["ਮੌਜੂਦਾ ਉਮਰਾਂ ਨੂੰ ਅਨੁਪਾਤ ਅਨੁਸਾਰ ਮੰਨੋ।", "ਸਭ ਉਮਰਾਂ ਵਿੱਚ ਇੱਕੋ ਸਾਲ ਜੋੜ ਕੇ ਜਾਂ ਘਟਾ ਕੇ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।"],
  income: ["ਆਮਦਨ, ਖਰਚ ਅਤੇ ਬਚਤ ਦਾ ਸੰਬੰਧ ਲਿਖੋ।", "ਬਚਤ = ਆਮਦਨ − ਖਰਚ ਨਾਲ ਮੰਗਿਆ ਮੁੱਲ ਕੱਢੋ।"],
  mixture: ["ਹਰ ਮਿਸ਼ਰਣ ਵਿੱਚ ਮੁੱਖ ਘਟਕ ਦੀ ਮਾਤਰਾ ਕੱਢੋ।", "ਕੁੱਲ ਘਟਕ ਅਤੇ ਕੁੱਲ ਮਿਸ਼ਰਣ ਤੋਂ ਨਵਾਂ ਅਨੁਪਾਤ ਬਣਾਓ।"],
  replacement: ["ਹਰ ਵਾਰ ਬਚੀ ਮੂਲ ਮਾਤਰਾ ਦਾ ਭਾਗ ਕੱਢੋ।", "ਸਾਰੇ ਪੜਾਅ ਦੇ ਬਚੇ ਭਾਗ ਗੁਣਾ ਕਰਕੇ ਅੰਤਿਮ ਮਾਤਰਾ ਕੱਢੋ।"],
  denomination: ["ਹਰ ਕਿਸਮ ਦੀ ਗਿਣਤੀ ਨੂੰ ਅਨੁਪਾਤ ਅਨੁਸਾਰ ਮੰਨੋ।", "ਗਿਣਤੀ × ਮੁੱਲ ਨਾਲ ਕੁੱਲ ਮੁੱਲ ਦਾ ਸਮੀਕਰਨ ਹੱਲ ਕਰੋ।"],
  rate: ["ਦੂਰੀ = ਗਤੀ × ਸਮਾਂ ਜਾਂ ਕੰਮ = ਦਰ × ਸਮਾਂ ਦਾ ਸੰਬੰਧ ਲਿਖੋ।", "ਦਿੱਤੇ ਅਨੁਪਾਤ ਰੱਖ ਕੇ ਮੰਗਿਆ ਸਮਾਂ, ਦੂਰੀ ਜਾਂ ਦਰ ਕੱਢੋ।"],
  population: ["ਕੁੱਲ ਆਬਾਦੀ ਨੂੰ ਪਹਿਲਾਂ ਮੁੱਖ ਸਮੂਹਾਂ ਵਿੱਚ ਵੰਡੋ।", "ਫਿਰ ਚੁਣੇ ਸਮੂਹ ਨੂੰ ਦਿੱਤੇ ਦੂਜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।"],
  election: ["ਕੁੱਲ ਵੋਟਾਂ ਤੋਂ ਪਈਆਂ ਅਤੇ ਫਿਰ ਵੈਧ ਵੋਟਾਂ ਕੱਢੋ।", "ਵੈਧ ਵੋਟਾਂ ਨੂੰ ਉਮੀਦਵਾਰਾਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।"],
  geometry: ["ਸੰਬੰਧਿਤ ਲੰਬਾਈ ਦਾ ਅਨੁਪਾਤ ਲਿਖੋ।", "ਖੇਤਰਫਲ ਲਈ ਅਨੁਪਾਤ ਦਾ ਵਰਗ ਅਤੇ ਆਇਤਨ ਲਈ ਘਣ ਲਵੋ।"],
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function neutralizeEntities(math: string, parameters: Rap003Parameters) {
  let result = math;
  const entityKeys = ["personA", "personB", "personC", "personD", "targetPerson", "targetPartner"] as const;
  const assigned = new Map<string, string>();
  for (const [index, key] of entityKeys.slice(0, 4).entries()) {
    const raw = String(parameters.variables[key] ?? "").trim();
    if (raw) assigned.set(raw, String.fromCharCode(65 + index));
  }
  for (const [raw, replacement] of assigned) {
    result = result.replace(new RegExp(escapeRegExp(raw), "g"), replacement);
  }
  return result
    .replace(/\b(?:Partner|Group|Team|Car|Candidate|Company|Unit)\s+([A-D])\b/g, "$1")
    .replace(/\b([A-D])'s\b/g, "$1")
    .replace(/\\text\{[^}]*\}\s*=/g, "")
    .replace(/\\text\{[^}]*\}/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMath(line: string, parameters: Rap003Parameters) {
  const blocks = [...line.matchAll(/\$\$([\s\S]*?)\$\$/g)]
    .map((match) => neutralizeEntities(match[1] ?? "", parameters))
    .filter((content) => content.length > 0)
    .map((content) => `$$${content}$$`);
  return blocks;
}

function answer(solver: Rap003SolverResult) {
  return String(solver.answer)
    .replaceAll("$$", "")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\s*:\s*/g, ":")
    .trim();
}

function conclusion(parameters: Rap003Parameters, solver: Rap003SolverResult, language: Language) {
  const value = answer(solver);
  const d = domain(parameters.canonicalProblemId);
  const hi: Record<Domain, string> = {
    partnership: `इसलिए मांगा गया हिस्सा ${value} है।`, age: `इसलिए मांगी गई आयु ${value} है।`,
    income: `इसलिए मांगी गई राशि ${value} है।`, mixture: `इसलिए मांगा गया मिश्रण मान ${value} है।`,
    replacement: `इसलिए अंतिम मान ${value} है।`, denomination: `इसलिए मांगी गई संख्या या राशि ${value} है।`,
    rate: `इसलिए मांगा गया दर-समय मान ${value} है।`, population: `इसलिए मांगी गई जनसंख्या ${value} है।`,
    election: `इसलिए मांगे गए मत ${value} हैं।`, geometry: `इसलिए मांगा गया ज्यामितीय अनुपात ${value} है।`,
  };
  const pa: Record<Domain, string> = {
    partnership: `ਇਸ ਲਈ ਮੰਗਿਆ ਹਿੱਸਾ ${value} ਹੈ।`, age: `ਇਸ ਲਈ ਮੰਗੀ ਉਮਰ ${value} ਹੈ।`,
    income: `ਇਸ ਲਈ ਮੰਗੀ ਰਕਮ ${value} ਹੈ।`, mixture: `ਇਸ ਲਈ ਮੰਗਿਆ ਮਿਸ਼ਰਣ ਮੁੱਲ ${value} ਹੈ।`,
    replacement: `ਇਸ ਲਈ ਅੰਤਿਮ ਮੁੱਲ ${value} ਹੈ।`, denomination: `ਇਸ ਲਈ ਮੰਗੀ ਗਿਣਤੀ ਜਾਂ ਰਕਮ ${value} ਹੈ।`,
    rate: `ਇਸ ਲਈ ਮੰਗਿਆ ਦਰ-ਸਮਾਂ ਮੁੱਲ ${value} ਹੈ।`, population: `ਇਸ ਲਈ ਮੰਗੀ ਆਬਾਦੀ ${value} ਹੈ।`,
    election: `ਇਸ ਲਈ ਮੰਗੀਆਂ ਵੋਟਾਂ ${value} ਹਨ।`, geometry: `ਇਸ ਲਈ ਮੰਗਿਆ ਜਿਆਮਿਤੀ ਅਨੁਪਾਤ ${value} ਹੈ।`,
  };
  return (language === "hi" ? hi : pa)[d];
}

export function renderLocalizedRap003Explanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language === "en") return explanation;
  const language = parameters.language as Language;
  const narratives = (language === "hi" ? HI : PA)[domain(parameters.canonicalProblemId)];
  const math = [...new Set(explanation.lines.flatMap((line) => extractMath(line, parameters)))].slice(0, 5);
  const lines = [narratives[0], ...math.slice(0, 2), narratives[1], ...math.slice(2), conclusion(parameters, solver, language)];
  return { ...explanation, lines };
}
