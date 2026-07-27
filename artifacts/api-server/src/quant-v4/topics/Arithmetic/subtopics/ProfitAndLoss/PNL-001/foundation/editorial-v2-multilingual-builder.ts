import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  EditorialDifficulty,
  QuestionStemBlock,
  StructuredEditorialEntry,
  StructuredQuestionStem,
} from "./editorial-content";
import type { EditorialLibraryFile } from "./editorial-library";
import { buildNativeFriendlyExplanation } from "./editorial-v2-native-explanations";
import {
  contextualiseNativeTemplate,
  nativeRepresentationLabels,
  nativeStemContext,
  splitNativeQuestion,
  type NativeEditorialLanguage,
} from "./editorial-v2-native-stems";

type RegistryEntry = Readonly<{
  solveMode: string;
  answerSemantic: string;
  requiredVariables: readonly string[];
  difficulty: EditorialDifficulty;
  representation?: string;
  presentation?: string;
}>;

type RegistryFile = Readonly<{
  cpId: string;
  entries: Readonly<Record<string, RegistryEntry>>;
}>;

type NativeQuestionFile = Readonly<{
  entries: Readonly<Record<string, Readonly<{ template: string }>>>;
}>;

type ExplanationPatternFile = Readonly<{
  entries: Readonly<Record<string, Readonly<{ hi?: string; pa?: string }>>>;
}>;

const CP_FOLDERS = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;
type CpFolder = typeof CP_FOLDERS[number];

function locatePnlRoot(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  const candidates = [
    moduleDir,
    join(moduleDir, ".."),
    join(process.cwd(), "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001"),
    join(process.cwd(), "src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001"),
  ];
  for (const candidate of candidates) {
    if (existsSync(join(candidate, "CP-001", "task-registry.library.json"))) return candidate;
  }
  throw new Error("Unable to locate the PNL-001 source root.");
}

const pnlRoot = locatePnlRoot();

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function languageFileName(language: NativeEditorialLanguage): string {
  return `question-language.${language}.json`;
}

function loadEnglishLibrary(cp: CpFolder): EditorialLibraryFile {
  return readJson<EditorialLibraryFile>(join(pnlRoot, cp, "editorial-content.en.json"));
}

function loadRegistry(cp: CpFolder): RegistryFile {
  return readJson<RegistryFile>(join(pnlRoot, cp, "task-registry.library.json"));
}

function loadNativeQuestions(cp: CpFolder, language: NativeEditorialLanguage): NativeQuestionFile {
  return readJson<NativeQuestionFile>(join(pnlRoot, cp, languageFileName(language)));
}

function loadNativeConcepts(cp: CpFolder, language: NativeEditorialLanguage): Readonly<Record<string, string>> {
  const path = join(pnlRoot, cp, "explanation-patterns.library.json");
  if (!existsSync(path)) return {};
  const file = readJson<ExplanationPatternFile>(path);
  return Object.fromEntries(
    Object.entries(file.entries)
      .map(([qlId, value]) => [qlId, value[language]?.trim() ?? ""] as const)
      .filter(([, value]) => value.length > 0),
  );
}

function cleanRemovedSource(text: string, source: string): string {
  return text
    .replaceAll(`{${source}}`, "")
    .replace(/\s+([।?])/gu, "$1")
    .replace(/[:：]\s*[।?]?/gu, "।")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function translateStaticCell(value: string, language: NativeEditorialLanguage): string {
  if (language === "hi") {
    return value
      .replace(/Profit/gi, "लाभ")
      .replace(/Loss/gi, "हानि")
      .replace(/Discount/gi, "छूट")
      .replace(/No second reduction/gi, "दूसरी कटौती नहीं")
      .replace(/Additional/gi, "अतिरिक्त")
      .replace(/Stage/gi, "चरण")
      .replace(/Group/gi, "समूह")
      .replace(/Offer/gi, "ऑफर");
  }
  return value
    .replace(/Profit/gi, "ਲਾਭ")
    .replace(/Loss/gi, "ਹਾਨੀ")
    .replace(/Discount/gi, "ਛੂਟ")
    .replace(/No second reduction/gi, "ਦੂਜੀ ਕਟੌਤੀ ਨਹੀਂ")
    .replace(/Additional/gi, "ਵਾਧੂ")
    .replace(/Stage/gi, "ਪੜਾਅ")
    .replace(/Group/gi, "ਸਮੂਹ")
    .replace(/Offer/gi, "ਆਫਰ");
}

function localizedColumns(
  language: NativeEditorialLanguage,
  englishColumns: readonly string[],
  source?: string,
): readonly string[] {
  const labels = nativeRepresentationLabels(language);
  const preferred = source && /offer/i.test(source)
    ? labels.offerColumns
    : source && /transaction|stage/i.test(source)
      ? labels.transactionColumns
      : labels.tableColumns;
  return englishColumns.map((_, index) => preferred[index] ?? (language === "hi" ? `स्तंभ ${index + 1}` : `ਕਾਲਮ ${index + 1}`));
}

function nativeClaims(
  language: NativeEditorialLanguage,
  solveMode: string,
): readonly string[] {
  const mode = solveMode.toUpperCase();
  if (/SUCCESSIVE|CHAIN|STAGE/.test(mode)) {
    return language === "hi"
      ? ["क्रमिक प्रतिशतों को सीधे जोड़ना पर्याप्त है।", "हर प्रतिशत पिछले चरण से बने नए मूल्य पर लागू होता है।"]
      : ["ਲਗਾਤਾਰ ਪ੍ਰਤੀਸ਼ਤਾਂ ਨੂੰ ਸਿੱਧਾ ਜੋੜਨਾ ਕਾਫ਼ੀ ਹੈ।", "ਹਰ ਪ੍ਰਤੀਸ਼ਤ ਪਿਛਲੇ ਪੜਾਅ ਤੋਂ ਬਣੇ ਨਵੇਂ ਮੁੱਲ 'ਤੇ ਲੱਗਦਾ ਹੈ।"];
  }
  if (/EQUAL_SP/.test(mode)) {
    return language === "hi"
      ? ["समान लाभ और हानि प्रतिशत हमेशा एक-दूसरे को रद्द कर देते हैं।", "समान विक्रय मूल्य होने पर दोनों क्रय-मूल्य आधार अलग होते हैं।"]
      : ["ਬਰਾਬਰ ਲਾਭ ਅਤੇ ਹਾਨੀ ਪ੍ਰਤੀਸ਼ਤ ਹਮੇਸ਼ਾਂ ਇਕ-ਦੂਜੇ ਨੂੰ ਰੱਦ ਕਰ ਦਿੰਦੇ ਹਨ।", "ਬਰਾਬਰ ਵਿਕਰੀ ਮੁੱਲ ਹੋਣ 'ਤੇ ਦੋਵੇਂ ਲਾਗਤ ਆਧਾਰ ਵੱਖਰੇ ਹੁੰਦੇ ਹਨ।"];
  }
  if (/DISCOUNT|OFFER/.test(mode)) {
    return language === "hi"
      ? ["दो क्रमिक छूटों का योग ही समतुल्य छूट है।", "दूसरी छूट पहली छूट के बाद बचे मूल्य पर लगती है।"]
      : ["ਦੋ ਲਗਾਤਾਰ ਛੂਟਾਂ ਦਾ ਜੋੜ ਹੀ ਸਮਤੁੱਲ ਛੂਟ ਹੈ।", "ਦੂਜੀ ਛੂਟ ਪਹਿਲੀ ਛੂਟ ਤੋਂ ਬਾਅਦ ਬਚੇ ਮੁੱਲ 'ਤੇ ਲੱਗਦੀ ਹੈ।"];
  }
  if (/FALSE|SHORT|DISHONEST|WEIGHT|MEASURE/.test(mode)) {
    return language === "hi"
      ? ["लाभ घोषित मात्रा की लागत पर मापा जाना चाहिए।", "वास्तविक लागत दी गई वास्तविक मात्रा पर आधारित होती है।"]
      : ["ਲਾਭ ਘੋਸ਼ਿਤ ਮਾਤਰਾ ਦੀ ਲਾਗਤ 'ਤੇ ਮਾਪਣਾ ਚਾਹੀਦਾ ਹੈ।", "ਅਸਲ ਲਾਗਤ ਦਿੱਤੀ ਅਸਲ ਮਾਤਰਾ 'ਤੇ ਆਧਾਰਿਤ ਹੁੰਦੀ ਹੈ।"];
  }
  if (/BREAK_EVEN|CONTRIBUTION/.test(mode)) {
    return language === "hi"
      ? ["प्रति इकाई विक्रय मूल्य ही पूरा योगदान है।", "प्रति इकाई योगदान = विक्रय मूल्य − परिवर्ती लागत।"]
      : ["ਪ੍ਰਤੀ ਇਕਾਈ ਵਿਕਰੀ ਮੁੱਲ ਹੀ ਪੂਰਾ ਯੋਗਦਾਨ ਹੈ।", "ਪ੍ਰਤੀ ਇਕਾਈ ਯੋਗਦਾਨ = ਵਿਕਰੀ ਮੁੱਲ − ਬਦਲਣਯੋਗ ਲਾਗਤ।"];
  }
  return language === "hi"
    ? ["पहला कथन मांगी गई राशि को अकेले निर्धारित करता है।", "सभी आवश्यक स्वतंत्र संबंधों की जाँच करना जरूरी है।"]
    : ["ਪਹਿਲਾ ਕਥਨ ਮੰਗੀ ਰਕਮ ਨੂੰ ਇਕੱਲਾ ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ।", "ਸਾਰੇ ਲੋੜੀਂਦੇ ਸੁਤੰਤਰ ਸੰਬੰਧ ਜਾਂਚਣੇ ਜ਼ਰੂਰੀ ਹਨ।"];
}

function localizedSpecialBlock(
  language: NativeEditorialLanguage,
  block: QuestionStemBlock,
  registryEntry: RegistryEntry,
): QuestionStemBlock {
  const labels = nativeRepresentationLabels(language);
  switch (block.type) {
    case "table":
      return {
        ...block,
        caption: labels.tableCaption,
        columns: localizedColumns(language, block.columns, block.rowSource),
        rows: block.rows?.map((row) => row.map((cell) => translateStaticCell(cell, language))),
      };
    case "caselet":
      if (block.paragraphSource) {
        return { type: "caselet", title: labels.caseletTitle, paragraphSource: block.paragraphSource };
      }
      return {
        type: "caselet",
        title: labels.caseletTitle,
        paragraphs: language === "hi"
          ? ["व्यवसाय ने एक ही नीति के अंतर्गत खरीद, खर्च और बिक्री से जुड़े आंकड़े दर्ज किए।", "नीचे दिए गए मूल्यों और दरों का उपयोग करके मांगा गया परिणाम निकालिए।"]
          : ["ਕਾਰੋਬਾਰ ਨੇ ਇੱਕੋ ਨੀਤੀ ਅਧੀਨ ਖਰੀਦ, ਖਰਚ ਅਤੇ ਵਿਕਰੀ ਨਾਲ ਜੁੜੇ ਅੰਕੜੇ ਦਰਜ ਕੀਤੇ।", "ਹੇਠਾਂ ਦਿੱਤੇ ਮੁੱਲਾਂ ਅਤੇ ਦਰਾਂ ਨਾਲ ਮੰਗਿਆ ਨਤੀਜਾ ਕੱਢੋ।"],
      };
    case "statements":
      return { type: "statements", lead: labels.statementsLead, statements: nativeClaims(language, registryEntry.solveMode) };
    case "data_sufficiency":
      return {
        type: "data_sufficiency",
        question: labels.dsQuestion,
        statements: block.statements.map((statement, index) => {
          if (/\{[A-Za-z]/.test(statement)) return statement;
          return language === "hi" ? `कथन ${index + 1} में एक स्वतंत्र संबंध दिया गया है।` : `ਕਥਨ ${index + 1} ਵਿੱਚ ਇੱਕ ਸੁਤੰਤਰ ਸੰਬੰਧ ਦਿੱਤਾ ਹੈ।`;
        }),
        answerScheme: "STANDARD_TWO_STATEMENT",
      };
    case "equation":
      return block;
    case "paragraph":
      return block;
  }
}

function buildNativeStem(
  language: NativeEditorialLanguage,
  cpId: string,
  qlId: string,
  nativeTemplate: string,
  englishStem: StructuredQuestionStem,
  registryEntry: RegistryEntry,
): StructuredQuestionStem {
  const contextual = contextualiseNativeTemplate(language, cpId, qlId, nativeTemplate);
  const split = splitNativeQuestion(language, contextual.text);
  const specialBlocks = englishStem.blocks.filter((block) => block.type !== "paragraph");
  let body = split.body;

  for (const block of specialBlocks) {
    if (block.type === "table" && block.rowSource) body = cleanRemovedSource(body, block.rowSource);
    if (block.type === "caselet" && block.paragraphSource) body = cleanRemovedSource(body, block.paragraphSource);
  }

  const blocks: QuestionStemBlock[] = [];
  if (body.length > 10) blocks.push({ type: "paragraph", content: body });
  blocks.push(...specialBlocks.map((block) => localizedSpecialBlock(language, block, registryEntry)));

  if (blocks.length === 0) {
    const context = nativeStemContext(language, cpId, qlId);
    blocks.push({ type: "paragraph", content: `${context.lead} ${split.body}` });
  }

  return {
    contextFamily: contextual.family,
    blocks,
    prompt: split.prompt,
  };
}

function localizedDifficultyRationale(
  language: NativeEditorialLanguage,
  difficulty: EditorialDifficulty,
): string {
  if (language === "hi") {
    if (difficulty === "Easy") return "एक स्पष्ट संबंध या एक सीधी गणना पर्याप्त है।";
    if (difficulty === "Medium") return "दो या तीन जुड़े चरणों में सही आधार और दिशा बनाए रखनी होती है।";
    return "कई निर्भर संबंध, उल्टी गणना या विशिष्ट तार्किक जाँच आवश्यक है।";
  }
  if (difficulty === "Easy") return "ਇੱਕ ਸਪਸ਼ਟ ਸੰਬੰਧ ਜਾਂ ਇੱਕ ਸਿੱਧੀ ਗਣਨਾ ਕਾਫ਼ੀ ਹੈ।";
  if (difficulty === "Medium") return "ਦੋ ਜਾਂ ਤਿੰਨ ਜੁੜੇ ਪੜਾਅਵਾਂ ਵਿੱਚ ਸਹੀ ਆਧਾਰ ਅਤੇ ਦਿਸ਼ਾ ਰੱਖਣੀ ਪੈਂਦੀ ਹੈ।";
  return "ਕਈ ਨਿਰਭਰ ਸੰਬੰਧ, ਉਲਟੀ ਗਣਨਾ ਜਾਂ ਖਾਸ ਤਰਕ ਜਾਂਚ ਲੋੜੀਂਦੀ ਹੈ।";
}

export function buildMultilingualEditorialLibrary(
  cp: CpFolder,
  language: NativeEditorialLanguage,
): EditorialLibraryFile {
  const english = loadEnglishLibrary(cp);
  const registry = loadRegistry(cp);
  const nativeQuestions = loadNativeQuestions(cp, language);
  const nativeConcepts = loadNativeConcepts(cp, language);
  const entries: Record<string, StructuredEditorialEntry> = {};

  for (const [qlId, englishEntry] of Object.entries(english.entries)) {
    const registryEntry = registry.entries[qlId];
    const nativeTemplate = nativeQuestions.entries[qlId]?.template;
    if (!registryEntry) throw new Error(`${cp} ${qlId}: registry entry is missing.`);
    if (!nativeTemplate) throw new Error(`${cp} ${qlId}: ${language} question template is missing.`);

    entries[qlId] = {
      stem: buildNativeStem(language, registry.cpId, qlId, nativeTemplate, englishEntry.stem, registryEntry),
      explanation: buildNativeFriendlyExplanation({
        language,
        qlId,
        solveMode: registryEntry.solveMode,
        answerSemantic: registryEntry.answerSemantic,
        englishExplanation: englishEntry.explanation,
        nativeConcept: nativeConcepts[qlId],
      }),
      difficulty: englishEntry.difficulty,
      difficultyRationale: localizedDifficultyRationale(language, englishEntry.difficulty),
    };
  }

  return {
    schemaVersion: 2,
    archetypeId: english.archetypeId,
    cpId: english.cpId,
    language,
    status: "EDITORIAL_REVIEW_CANDIDATE",
    entries,
    entryCount: Object.keys(entries).length,
  };
}

export function buildAllMultilingualEditorialLibraries(): readonly EditorialLibraryFile[] {
  return CP_FOLDERS.flatMap((cp) => [
    buildMultilingualEditorialLibrary(cp, "hi"),
    buildMultilingualEditorialLibrary(cp, "pa"),
  ]);
}
