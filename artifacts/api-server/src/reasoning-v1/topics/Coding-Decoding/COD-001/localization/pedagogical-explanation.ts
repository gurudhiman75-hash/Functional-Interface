export type CodPedagogyLocale = "en-IN" | "hi-IN" | "pa-IN";

export interface CodPedagogicalPresentation {
  schemaVersion: "cod-001-pedagogy-v1";
  coreRule: string;
  stepByStep: readonly string[];
  visualAlignment: readonly string[];
  examShortcut: string;
  commonTrap: string;
}

interface QuestionLike {
  qlId?: string;
  permanentQlId?: string | null;
  checkpointId: string;
  ruleId?: string;
  ruleContext?: Readonly<Record<string, unknown>>;
  locale: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  metadata?: Readonly<Record<string, unknown>>;
  [key: string]: unknown;
}

interface EvidencePair {
  source: string;
  code: string;
}

const PERMUTATION_RULES = new Set([
  "REVERSE_SEQUENCE",
  "CYCLIC_POSITION_ROTATION",
  "HALF_SWAP",
  "ODD_THEN_EVEN_EXTRACTION",
  "EVEN_THEN_ODD_EXTRACTION",
  "OUTER_INNER_INTERLEAVING",
]);

const MULTI_STAGE_RULES = new Set([
  "REVERSE_THEN_INDEXED_SHIFT",
  "PAIR_SWAP_THEN_ALTERNATING_SHIFT",
  "HALF_SWAP_THEN_ODD_EVEN_SHIFT",
  "ROTATE_THEN_CLASS_SHIFT",
  "OPPOSITE_MAP_WITH_POSITION_PERMUTATION",
  "TRANSFORM_THEN_RANK_SEQUENCE",
]);

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? value as Record<string, unknown> : {};
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(strings);
  return [];
}

function optionValue(option: unknown): string {
  if (typeof option === "string" || typeof option === "number") return String(option);
  const record = asRecord(option);
  const direct = record.value ?? record.answer ?? record.text ?? record.label;
  if (typeof direct === "string" || typeof direct === "number") return String(direct);
  const members = record.members ?? record.tokens ?? record.words;
  if (Array.isArray(members)) return members.map(String).join(", ");
  return String(direct ?? "");
}

function splitDisplay(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  if (/\s/u.test(trimmed)) return trimmed.split(/\s+/u).filter(Boolean);
  if (trimmed.includes("-")) return trimmed.split("-").filter(Boolean);
  if (trimmed.includes(",")) return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  return [...trimmed];
}

function joinDisplay(tokens: readonly string[]): string {
  return tokens.join("   ");
}

function labels(locale: CodPedagogyLocale) {
  if (locale === "hi-IN") {
    return {
      original: "मूल",
      coded: "कोड",
      positions: "स्थान",
      readOrder: "पढ़ने का क्रम",
      baseline: "मूल तालिका-कोड",
      final: "अंतिम कोड",
      sentence: "वाक्य",
      rowCode: "दिया गया कोड",
      relevant: "संबंधित नाम-बदलाव",
      target: "लक्ष्य",
      answer: "उत्तर",
    } as const;
  }
  if (locale === "pa-IN") {
    return {
      original: "ਮੂਲ",
      coded: "ਕੋਡ",
      positions: "ਥਾਂਵਾਂ",
      readOrder: "ਪੜ੍ਹਨ ਦਾ ਕ੍ਰਮ",
      baseline: "ਮੁੱਢਲਾ ਸਾਰਣੀ-ਕੋਡ",
      final: "ਅੰਤਿਮ ਕੋਡ",
      sentence: "ਵਾਕ",
      rowCode: "ਦਿੱਤਾ ਕੋਡ",
      relevant: "ਸੰਬੰਧਤ ਨਾਮ-ਬਦਲਾਅ",
      target: "ਨਿਸ਼ਾਨਾ",
      answer: "ਉੱਤਰ",
    } as const;
  }
  return {
    original: "Original",
    coded: "Coded",
    positions: "Positions",
    readOrder: "Read order",
    baseline: "Baseline table code",
    final: "Final code",
    sentence: "Sentence",
    rowCode: "Displayed code",
    relevant: "Relevant renaming",
    target: "Target",
    answer: "Answer",
  } as const;
}

function evidencePairs(prompt: Record<string, unknown>): EvidencePair[] {
  const evidence = Array.isArray(prompt.evidence) ? prompt.evidence : [];
  return evidence.flatMap((item) => {
    const record = asRecord(item);
    const source = record.source ?? record.word ?? record.sourceDisplay ?? record.sentence;
    const code = record.code ?? record.target ?? record.displayedCode;
    return typeof source === "string" && typeof code === "string" ? [{ source, code }] : [];
  });
}

function alignedBlock(source: string, code: string, locale: CodPedagogyLocale): string {
  const l = labels(locale);
  const sourceTokens = splitDisplay(source);
  const codeTokens = splitDisplay(code);
  if (sourceTokens.length === 0 || codeTokens.length === 0) return `${source} → ${code}`;
  if (sourceTokens.length !== codeTokens.length) return `${l.original}: ${source}\n${l.coded}: ${code}`;
  return [
    `${l.original}: ${joinDisplay(sourceTokens)}`,
    `${" ".repeat(Math.max(l.original.length, l.coded.length))}  ${joinDisplay(sourceTokens.map(() => "↓"))}`,
    `${l.coded}: ${joinDisplay(codeTokens)}`,
  ].join("\n");
}

function mappingList(source: string, code: string): string {
  const sourceTokens = splitDisplay(source);
  const codeTokens = splitDisplay(code);
  if (sourceTokens.length !== codeTokens.length || sourceTokens.length === 0) return `${source} → ${code}`;
  return sourceTokens.map((token, index) => `${token}→${codeTokens[index]}`).join(", ");
}

function targetInput(prompt: Record<string, unknown>): string {
  return String(
    prompt.target
      ?? prompt.targetWord
      ?? prompt.targetSource
      ?? prompt.sourceDisplay
      ?? prompt.directTarget
      ?? prompt.ordinaryAnswer
      ?? "",
  );
}

function encodedInput(prompt: Record<string, unknown>): string {
  return String(prompt.encodedTarget ?? prompt.targetCode ?? prompt.displayedTargetCode ?? "");
}

function taskKind(prompt: Record<string, unknown>): string {
  return String(prompt.taskKind ?? prompt.kind ?? prompt.queryDirection ?? "");
}

function isDecodeTask(kind: string): boolean {
  return /DECODE|TOKEN_TO_WORD|TOKENS_TO_WORDS|TOKEN_TO_ALL_WORDS/u.test(kind);
}

function isMissingTask(kind: string): boolean {
  return /MISSING|RECOVER/u.test(kind);
}

function coreRule(question: QuestionLike, explanation: Record<string, unknown>): string {
  const direct = explanation.ruleStatement ?? explanation.quickMethod;
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const aid = strings(explanation.referenceAid);
  if (aid.length > 0) return aid[0]!;
  return question.locale === "hi-IN"
    ? "दिए गए उदाहरणों से एक ही कोड नियम पहचानकर उसे लक्ष्य पर ठीक उसी प्रकार लागू करें।"
    : question.locale === "pa-IN"
      ? "ਦਿੱਤੀਆਂ ਮਿਸਾਲਾਂ ਤੋਂ ਇੱਕੋ ਕੋਡ ਨਿਯਮ ਪਛਾਣ ਕੇ ਉਸ ਨੂੰ ਨਿਸ਼ਾਨੇ ਉੱਤੇ ਬਿਲਕੁਲ ਉਸੇ ਤਰ੍ਹਾਂ ਲਗਾਓ।"
      : "Identify the one coding rule supported by all examples and apply it unchanged to the target.";
}

function localizedEvidenceLine(pair: EvidencePair, locale: CodPedagogyLocale): string {
  const mapping = mappingList(pair.source, pair.code);
  if (locale === "hi-IN") return `${pair.source} → ${pair.code} से स्थानवार परिवर्तन मिलता है: ${mapping}।`;
  if (locale === "pa-IN") return `${pair.source} → ${pair.code} ਤੋਂ ਥਾਂ-ਵਾਰ ਬਦਲਾਅ ਮਿਲਦਾ ਹੈ: ${mapping}।`;
  return `${pair.source} → ${pair.code} gives the position-wise changes ${mapping}.`;
}

function localizedTargetLine(input: string, answer: string, locale: CodPedagogyLocale): string {
  const mapping = mappingList(input, answer);
  if (locale === "hi-IN") return `${input} पर वही नियम लगाने पर ${mapping}; इसलिए परिणाम ${answer} है।`;
  if (locale === "pa-IN") return `${input} ਉੱਤੇ ਉਹੀ ਨਿਯਮ ਲਗਾਉਣ ਨਾਲ ${mapping}; ਇਸ ਲਈ ਨਤੀਜਾ ${answer} ਹੈ।`;
  return `Applying the same rule to ${input} gives ${mapping}; therefore the result is ${answer}.`;
}

function inferPermutationOrder(source: string, code: string): number[] {
  const sourceTokens = splitDisplay(source);
  const codeTokens = splitDisplay(code);
  if (sourceTokens.length !== codeTokens.length) return [];
  const used = new Set<number>();
  const order: number[] = [];
  for (const token of codeTokens) {
    const index = sourceTokens.findIndex((candidate, candidateIndex) => candidate === token && !used.has(candidateIndex));
    if (index < 0) return [];
    used.add(index);
    order.push(index + 1);
  }
  return order;
}

function permutationBlock(input: string, answer: string, locale: CodPedagogyLocale): string {
  const l = labels(locale);
  const sourceTokens = splitDisplay(input);
  const answerTokens = splitDisplay(answer);
  const order = inferPermutationOrder(input, answer);
  if (order.length === 0) return alignedBlock(input, answer, locale);
  return [
    `${l.positions}: ${joinDisplay(sourceTokens.map((_, index) => String(index + 1)))}`,
    `${l.original}: ${joinDisplay(sourceTokens)}`,
    `${l.readOrder}: ${joinDisplay(order.map(String))}`,
    `${l.coded}: ${joinDisplay(answerTokens)}`,
  ].join("\n");
}

function cp008Visual(prompt: Record<string, unknown>, answer: string, locale: CodPedagogyLocale): string[] {
  const l = labels(locale);
  const mapping = Array.isArray(prompt.mapping) ? prompt.mapping.map(asRecord) : [];
  const ordinary = String(prompt.ordinaryAnswer ?? prompt.directTarget ?? "");
  const relevant = mapping.find((pair) => String(pair.actual ?? "") === ordinary);
  if (!relevant) return [`${l.target}: ${ordinary}\n${l.answer}: ${answer}`];
  return [`${l.relevant}: ${String(relevant.actual)} → ${String(relevant.called)}`];
}

function cp009Visual(prompt: Record<string, unknown>, locale: CodPedagogyLocale): string[] {
  const l = labels(locale);
  const rows = Array.isArray(prompt.rows) ? prompt.rows.map(asRecord) : [];
  if (rows.length === 0) return [];
  const table = [
    `| ${l.sentence} | ${l.rowCode} |`,
    "|---|---|",
    ...rows.map((row) => `| ${String(row.sentence ?? "")} | ${String(row.displayedCode ?? "")} |`),
  ].join("\n");
  return [table];
}

function cp010Visual(question: QuestionLike, prompt: Record<string, unknown>, answer: string, locale: CodPedagogyLocale): string[] {
  const l = labels(locale);
  const rows = Array.isArray(prompt.mappingRows) ? prompt.mappingRows.map(asRecord) : [];
  const sourceTokens = Array.isArray(prompt.sourceTokens) ? prompt.sourceTokens.map(String) : splitDisplay(String(prompt.sourceDisplay ?? ""));
  const map = new Map(rows.map((row) => [String(row.sourceToken ?? ""), String(row.codeToken ?? "")]));
  const baseline = sourceTokens.map((token) => map.get(token) ?? "?").join("");
  const metadata = asRecord(question.metadata);
  const finalBaseline = String(metadata.baseCode ?? baseline);
  const mappingPreview = rows.map((row) => `${String(row.sourceToken)}→${String(row.codeToken)}`).join("   ");
  return [
    mappingPreview,
    `${l.baseline}: ${finalBaseline}\n${l.final}: ${answer}`,
  ];
}

function visualAlignment(question: QuestionLike, answer: string): string[] {
  const locale = question.locale as CodPedagogyLocale;
  const prompt = asRecord(question.structuredPrompt);
  const kind = taskKind(prompt);
  const pairs = evidencePairs(prompt);
  if (question.checkpointId === "COD-CP-008") return cp008Visual(prompt, answer, locale);
  if (question.checkpointId === "COD-CP-009") return cp009Visual(prompt, locale);
  if (question.checkpointId === "COD-CP-010") return cp010Visual(question, prompt, answer, locale);

  const input = isDecodeTask(kind) ? encodedInput(prompt) : targetInput(prompt);
  const displayed = String(prompt.displayedTargetCode ?? "");
  const ruleId = question.ruleId ?? "";
  const output: string[] = [];
  if (pairs.length > 0) output.push(alignedBlock(pairs[0]!.source, pairs[0]!.code, locale));
  if (isMissingTask(kind) && displayed) {
    const l = labels(locale);
    output.push(`${l.target}: ${displayed}\n${l.answer}: ${answer}`);
  } else if (input) {
    output.push(PERMUTATION_RULES.has(ruleId) ? permutationBlock(input, answer, locale) : alignedBlock(input, answer, locale));
  }
  if (output.length === 0) {
    const existing = strings(asRecord(question.explanation).targetApplication ?? asRecord(question.explanation).targetResult);
    if (existing.length > 0) output.push(existing.join("\n"));
  }
  return output;
}

function specificSteps(question: QuestionLike, answer: string): string[] {
  const locale = question.locale as CodPedagogyLocale;
  const prompt = asRecord(question.structuredPrompt);
  const explanation = asRecord(question.explanation);
  const kind = taskKind(prompt);
  const pairs = evidencePairs(prompt);
  const steps: string[] = [];

  if (question.checkpointId === "COD-CP-008") {
    const ordinary = String(prompt.ordinaryAnswer ?? prompt.directTarget ?? "");
    if (locale === "hi-IN") steps.push(`पहले सामान्य अर्थ से वास्तविक उत्तर ${ordinary} पहचानें।`);
    else if (locale === "pa-IN") steps.push(`ਪਹਿਲਾਂ ਆਮ ਅਰਥ ਤੋਂ ਅਸਲ ਉੱਤਰ ${ordinary} ਪਛਾਣੋ।`);
    else steps.push(`First identify the ordinary referent: ${ordinary}.`);
    const visual = cp008Visual(prompt, answer, locale)[0];
    if (visual) steps.push(visual.replace(/^.*?:\s*/u, ""));
    return steps;
  }

  if (question.checkpointId === "COD-CP-009") {
    const evidence = strings(explanation.evidenceComparison);
    if (evidence.length > 0) steps.push(...evidence);
    const result = strings(explanation.targetResult);
    if (result.length > 0) steps.push(...result);
    return steps;
  }

  if (question.checkpointId === "COD-CP-010") {
    const source = strings(explanation.sourceDemonstration);
    const target = strings(explanation.targetApplication);
    if (source.length > 0) steps.push(...source);
    if (target.length > 0) steps.push(...target);
    return steps;
  }

  if (pairs.length > 0) steps.push(...pairs.slice(0, 2).map((pair) => localizedEvidenceLine(pair, locale)));
  const existingTarget = strings(explanation.targetApplication ?? explanation.targetResult);
  if (existingTarget.length > 0 && (MULTI_STAGE_RULES.has(question.ruleId ?? "") || !targetInput(prompt))) {
    steps.push(...existingTarget);
  } else {
    const input = isDecodeTask(kind) ? encodedInput(prompt) : targetInput(prompt);
    if (isMissingTask(kind)) {
      const displayed = String(prompt.displayedTargetCode ?? prompt.displayedCodeWithBlank ?? "");
      if (locale === "hi-IN") steps.push(`${displayed || input} में रिक्त स्थान का सही मान ${answer} है।`);
      else if (locale === "pa-IN") steps.push(`${displayed || input} ਵਿੱਚ ਖਾਲੀ ਥਾਂ ਦਾ ਸਹੀ ਮੁੱਲ ${answer} ਹੈ।`);
      else steps.push(`The missing value in ${displayed || input} is ${answer}.`);
    } else if (input) {
      steps.push(localizedTargetLine(input, answer, locale));
    } else if (existingTarget.length > 0) {
      steps.push(...existingTarget);
    }
  }
  return steps;
}

function targetMappings(question: QuestionLike, answer: string): string {
  const prompt = asRecord(question.structuredPrompt);
  const kind = taskKind(prompt);
  const input = isDecodeTask(kind) ? encodedInput(prompt) : targetInput(prompt);
  return input ? mappingList(input, answer) : answer;
}

function specificShortcut(question: QuestionLike, answer: string): string {
  const locale = question.locale as CodPedagogyLocale;
  const prompt = asRecord(question.structuredPrompt);
  const pairs = evidencePairs(prompt);
  const kind = taskKind(prompt);
  const input = isDecodeTask(kind) ? encodedInput(prompt) : targetInput(prompt);
  const mapping = targetMappings(question, answer);
  const ruleId = question.ruleId ?? "";

  if (question.checkpointId === "COD-CP-008") {
    const ordinary = String(prompt.ordinaryAnswer ?? prompt.directTarget ?? "");
    if (locale === "hi-IN") return `श्रृंखला में आगे न बढ़ें—केवल एक तीर पढ़ें: ${ordinary}→${answer}।`;
    if (locale === "pa-IN") return `ਲੜੀ ਵਿੱਚ ਅੱਗੇ ਨਾ ਵਧੋ—ਕੇਵਲ ਇੱਕ ਤੀਰ ਪੜ੍ਹੋ: ${ordinary}→${answer}।`;
    return `Do not continue through the chain—read exactly one arrow: ${ordinary}→${answer}.`;
  }

  if (question.checkpointId === "COD-CP-009") {
    const rows = Array.isArray(prompt.rows) ? prompt.rows.map(asRecord) : [];
    const targetWord = String(prompt.targetWord ?? "");
    const targetToken = String(prompt.targetToken ?? "");
    if (locale === "hi-IN") return `दोहराए गए शब्द और दोहराए गए कोड का प्रतिच्छेद लें${targetWord ? `: ${targetWord}↔${targetToken || answer}` : ""}।`;
    if (locale === "pa-IN") return `ਦੁਹਰਾਏ ਸ਼ਬਦ ਅਤੇ ਦੁਹਰਾਏ ਕੋਡ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਲਵੋ${targetWord ? `: ${targetWord}↔${targetToken || answer}` : ""}।`;
    return `Intersect repeated words with repeated code tokens${targetWord ? `: ${targetWord}↔${targetToken || answer}` : ""}; row order is irrelevant (${rows.length} rows).`;
  }

  if (question.checkpointId === "COD-CP-010") {
    const metadata = asRecord(question.metadata);
    const baseline = String(metadata.baseCode ?? "");
    const signature = String(metadata.endpointSignature ?? "");
    if (locale === "hi-IN") return `पहले ${baseline} लिखें, फिर केवल सिरों की ${signature} स्थिति जाँचकर अंतिम कोड ${answer} बनाएँ।`;
    if (locale === "pa-IN") return `ਪਹਿਲਾਂ ${baseline} ਲਿਖੋ, ਫਿਰ ਸਿਰਿਆਂ ਦੀ ${signature} ਹਾਲਤ ਹੀ ਜਾਂਚ ਕੇ ਅੰਤਿਮ ਕੋਡ ${answer} ਬਣਾਓ।`;
    return `Write the baseline ${baseline} first; then check only the endpoint case ${signature} to obtain ${answer}.`;
  }

  if (question.checkpointId === "COD-CP-001" && !isDecodeTask(kind) && pairs.length > 0 && input) {
    const sourceTokens = splitDisplay(pairs[0]!.source);
    const codeTokens = splitDisplay(pairs[0]!.code);
    const targetTokens = splitDisplay(input);
    if (sourceTokens.length === codeTokens.length && targetTokens.length > 0) {
      const indices = targetTokens.map((token) => sourceTokens.indexOf(token));
      if (indices.every((index) => index >= 0)) {
        const positions = indices.map((index) => index + 1).join(", ");
        if (locale === "hi-IN") return `${input} के लिए उदाहरण के केवल स्थान ${positions} पढ़ें; संबंधित कोड सीधे ${answer} देता है।`;
        if (locale === "pa-IN") return `${input} ਲਈ ਮਿਸਾਲ ਦੀਆਂ ਕੇਵਲ ਥਾਂਵਾਂ ${positions} ਪੜ੍ਹੋ; ਸੰਬੰਧਤ ਕੋਡ ਸਿੱਧਾ ${answer} ਦਿੰਦਾ ਹੈ।`;
        return `For ${input}, read only positions ${positions} from the example code; they give ${answer} directly.`;
      }
    }
  }

  if (PERMUTATION_RULES.has(ruleId)) {
    const order = inferPermutationOrder(input, answer).join("-");
    if (locale === "hi-IN") return `अक्षरों को मानसिक रूप से न घुमाएँ; स्थान लिखकर ${order || "दिए क्रम"} में पढ़ें और ${answer} पाएँ।`;
    if (locale === "pa-IN") return `ਅੱਖਰ ਮਨ ਵਿੱਚ ਨਾ ਘੁਮਾਓ; ਥਾਂਵਾਂ ਲਿਖ ਕੇ ${order || "ਦਿੱਤੇ ਕ੍ਰਮ"} ਵਿੱਚ ਪੜ੍ਹੋ ਅਤੇ ${answer} ਲਵੋ।`;
    return `Number the positions instead of moving letters mentally; read ${order || "the shown order"} to obtain ${answer}.`;
  }

  if (MULTI_STAGE_RULES.has(ruleId)) {
    if (locale === "hi-IN") return `${input} के लिए मूल → मध्यवर्ती → अंतिम तीन अलग पंक्तियाँ रखें; अंतिम परिणाम ${answer} है।`;
    if (locale === "pa-IN") return `${input} ਲਈ ਮੂਲ → ਵਿਚਕਾਰਲਾ → ਅੰਤਿਮ ਤਿੰਨ ਵੱਖ ਲਾਈਨਾਂ ਰੱਖੋ; ਅੰਤਿਮ ਨਤੀਜਾ ${answer} ਹੈ।`;
    return `Keep three lines—original → intermediate → final—for ${input}; the final result is ${answer}.`;
  }

  if (question.checkpointId === "COD-CP-002") {
    if (locale === "hi-IN") return `${input} के अक्षरों के मान सीधे नीचे लिखें: ${mapping}; इसी से ${answer} मिलता है।`;
    if (locale === "pa-IN") return `${input} ਦੇ ਅੱਖਰਾਂ ਦੇ ਮੁੱਲ ਸਿੱਧੇ ਹੇਠਾਂ ਲਿਖੋ: ${mapping}; ਇਥੋਂ ${answer} ਮਿਲਦਾ ਹੈ।`;
    return `Write the values directly below ${input}: ${mapping}; this gives ${answer}.`;
  }

  if (question.checkpointId === "COD-CP-007") {
    if (locale === "hi-IN") return `पूरी संख्या पर गणना न करें; हर अंक अलग बदलें: ${mapping}।`;
    if (locale === "pa-IN") return `ਪੂਰੀ ਗਿਣਤੀ ਉੱਤੇ ਹਿਸਾਬ ਨਾ ਕਰੋ; ਹਰ ਅੰਕ ਵੱਖ ਬਦਲੋ: ${mapping}।`;
    return `Do not operate on the whole number; transform each digit separately: ${mapping}.`;
  }

  if (locale === "hi-IN") return `${input} के नीचे वास्तविक परिवर्तन लिखें—${mapping}—और क्रम बनाए रखने पर ${answer} मिलता है।`;
  if (locale === "pa-IN") return `${input} ਹੇਠਾਂ ਅਸਲ ਬਦਲਾਅ ਲਿਖੋ—${mapping}—ਅਤੇ ਕ੍ਰਮ ਕਾਇਮ ਰੱਖਣ ਨਾਲ ${answer} ਮਿਲਦਾ ਹੈ।`;
  return `Write the actual changes under ${input}—${mapping}—and preserve the order to get ${answer}.`;
}

function commonTrap(question: QuestionLike, explanation: Record<string, unknown>): string {
  const direct = explanation.commonTrapAlert ?? explanation.closestTrapRejection;
  if (typeof direct === "string" && direct.trim()) return direct.trim();
  const wrong = question.options.find((_, index) => index !== question.correctIndex);
  const value = optionValue(wrong);
  if (question.locale === "hi-IN") return `${value} जैसा विकल्प नियम का कोई चरण छोड़ता है या क्रम बदल देता है।`;
  if (question.locale === "pa-IN") return `${value} ਵਰਗਾ ਵਿਕਲਪ ਨਿਯਮ ਦਾ ਕੋਈ ਕਦਮ ਛੱਡਦਾ ਜਾਂ ਕ੍ਰਮ ਬਦਲਦਾ ਹੈ।`;
  return `${value} skips a required step or changes the established order.`;
}

export function buildCodPedagogicalPresentation(question: QuestionLike): CodPedagogicalPresentation {
  const explanation = asRecord(question.explanation);
  const answer = optionValue(question.options[question.correctIndex]);
  const steps = specificSteps(question, answer);
  const visual = visualAlignment(question, answer);
  return {
    schemaVersion: "cod-001-pedagogy-v1",
    coreRule: coreRule(question, explanation),
    stepByStep: steps.length > 0 ? steps : [String(explanation.conclusion ?? answer)],
    visualAlignment: visual.length > 0 ? visual : [`${labels(question.locale as CodPedagogyLocale).answer}: ${answer}`],
    examShortcut: specificShortcut(question, answer),
    commonTrap: commonTrap(question, explanation),
  };
}

export function withCodPedagogicalExplanation<T extends QuestionLike>(question: T): T {
  const legacy = asRecord(question.explanation);
  const presentation = buildCodPedagogicalPresentation(question);
  return {
    ...question,
    explanation: {
      ...legacy,
      quickMethod: presentation.examShortcut,
      visualAlignment: presentation.visualAlignment,
      pedagogicalPresentation: presentation,
    },
  } as T;
}
