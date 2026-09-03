import { createHash } from "node:crypto";

import {
  ARG_CP012_CHECKPOINT_ID,
} from "./cp012-editorial-real-paper-remediation.ts";
import {
  ARG_CP012_QUESTION_STUDIO_AUTHORITY,
  ARG_CP012_QUESTION_STUDIO_PACKAGE,
  generateArgCp012QuestionStudioBatch,
  isArgCp012CurrentReviewRequest,
  isArgCp012RealPaperRequest,
  type ArgCp012QuestionStudioInput,
} from "./cp012-question-studio-adapter.ts";
import { ARG_CP009_CHECKPOINT_ID } from "./cp009-english-remediated-templates.ts";
import { ARG_QL_IDS } from "./types.ts";

export const ARG_CP013_CHECKPOINT_ID = "ARG-CP-013" as const;
export const ARG_CP013_AUTHORITY = "ARG_CP013_FINAL_EDITORIAL_SURFACE_V1" as const;
export const ARG_CP013_QUESTION_STUDIO_AUTHORITY = "ARG_CP013_QUESTION_STUDIO_FINAL_EDITORIAL_V1" as const;
export const ARG_CP013_RUNTIME_MODE = "REVIEW_ONLY_CP009_CORE_CP012_REAL_PAPER_CP013_SURFACE" as const;
export const ARG_CP013_REVIEW_STATUS = "QUESTION_STUDIO_CP013_FINAL_EDITORIAL_REVIEW_CONNECTED" as const;

export type ArgCp013QuestionStudioInput = ArgCp012QuestionStudioInput;

type QuestionRecord = Readonly<Record<string, any>>;
type MutableQuestion = Record<string, any>;
type ArgStrength = "STRONG" | "WEAK";

const ROMAN = ["I", "II", "III", "IV"] as const;

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function fingerprint(parts: readonly unknown[]): string {
  return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}

function languageOf(question: QuestionRecord): "en" | "hi" | "pa" {
  return question.language === "hi" ? "hi" : question.language === "pa" ? "pa" : "en";
}

function naturalizeCombinationLabel(label: string, language: "en" | "hi" | "pa"): string {
  const conjunction = language === "hi" ? "और" : language === "pa" ? "ਅਤੇ" : "and";
  const escaped = conjunction.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return label.replace(
    new RegExp(`\\b(I|II|III|IV) ${escaped} (I|II|III|IV) ${escaped} (I|II|III|IV)\\b`, "g"),
    `$1, $2 ${conjunction} $3`,
  );
}

function replaceEverywhere(question: MutableQuestion, before: string, after: string): void {
  if (!before || before === after) return;
  for (const key of ["text", "stem", "statement", "explanation", "answer", "canonicalAnswer"] as const) {
    if (typeof question[key] === "string") question[key] = question[key].replaceAll(before, after);
  }
  if (Array.isArray(question.arguments)) {
    question.arguments = question.arguments.map((value: unknown) => typeof value === "string" ? value.replaceAll(before, after) : value);
  }
  if (Array.isArray(question.options)) {
    question.options = question.options.map((value: unknown) => typeof value === "string" ? value.replaceAll(before, after) : value);
  }
}

function coreWorkshopPatch(question: MutableQuestion): void {
  if (question.profileMode !== "core" || question.templateId !== "ARG-CP003-QL004-T04") return;
  const language = languageOf(question);
  const oldArguments = Array.isArray(question.arguments) ? question.arguments.map(String) : [];
  const revised = language === "hi"
    ? [
        "हाँ। इस विषय पर एक ही कार्यशाला भविष्य में इससे जुड़ी हर कठिनाई को पूरी तरह समाप्त कर देगी।",
        "नहीं। इस विषय पर एक कार्यशाला आयोजित होते ही इससे जुड़ी बाकी सभी मार्गदर्शन और सहायता सेवाएँ अनावश्यक हो जाएँगी।",
      ]
    : language === "pa"
      ? [
          "ਹਾਂ। ਇਸ ਵਿਸ਼ੇ ਬਾਰੇ ਇੱਕੋ ਵਰਕਸ਼ਾਪ ਭਵਿੱਖ ਵਿੱਚ ਇਸ ਨਾਲ ਜੁੜੀ ਹਰ ਮੁਸ਼ਕਲ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਖਤਮ ਕਰ ਦੇਵੇਗੀ।",
          "ਨਹੀਂ। ਇਸ ਵਿਸ਼ੇ ਬਾਰੇ ਇੱਕ ਵਰਕਸ਼ਾਪ ਹੋਣ ਤੋਂ ਬਾਅਦ ਇਸ ਨਾਲ ਜੁੜੀ ਹੋਰ ਸਾਰੀ ਰਹਿਨੁਮਾਈ ਅਤੇ ਸਹਾਇਤਾ ਬੇਲੋੜੀ ਹੋ ਜਾਵੇਗੀ।",
        ]
      : [
          "Yes. A single workshop on the subject will completely solve every related difficulty participants may face in the future.",
          "No. Once one workshop on the subject is offered, all other guidance and support on that subject will become unnecessary.",
        ];

  if (oldArguments.length >= 2) {
    replaceEverywhere(question, oldArguments[0]!, revised[0]!);
    replaceEverywhere(question, oldArguments[1]!, revised[1]!);
  }
  question.arguments = Object.freeze(revised);
}

function punjabiGrammarPatch(question: MutableQuestion): void {
  if (languageOf(question) !== "pa") return;
  const replacements = [
    ["ਭਰਤੀ ਉਮੀਦਵਾਰਾਂ ਜੋ", "ਜੋ ਭਰਤੀ ਉਮੀਦਵਾਰ"],
    ["ਹੋਰ ਉਮੀਦਵਾਰਾਂ ਦਾ ਨਿੱਜੀ ਡਾਟਾ ਦੀ ਚਿੰਤਾ", "ਹੋਰ ਉਮੀਦਵਾਰਾਂ ਦੇ ਨਿੱਜੀ ਡਾਟੇ ਦੀ ਚਿੰਤਾ"],
    ["ਜੋ ਕਰਮਚਾਰੀ ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਬਾਰੇ ਪੁੱਛੇ", "ਜੋ ਕਰਮਚਾਰੀ ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ ਬਾਰੇ ਪੁੱਛਦਾ ਹੈ"],
  ] as const;
  for (const [before, after] of replacements) replaceEverywhere(question, before, after);
}

function englishGrammarPatch(question: MutableQuestion): void {
  if (languageOf(question) !== "en") return;
  const replacements = [
    ["A mistaken one buyer complaint", "A mistaken buyer complaint"],
    ["Yes. one buyer complaint", "Yes. One buyer complaint"],
    ["No. a passport centre", "No. A passport centre"],
    ["Yes. a passport centre", "Yes. A passport centre"],
  ] as const;
  for (const [before, after] of replacements) replaceEverywhere(question, before, after);
}

function explanationPrefixes(language: "en" | "hi" | "pa", count: number): readonly string[] {
  return Array.from({ length: count }, (_, index) => {
    const label = ROMAN[index]!;
    if (language === "hi") return `तर्क ${label} `;
    if (language === "pa") return `ਦਲੀਲ ${label} `;
    return `Argument ${label} `;
  });
}

function extractReasons(explanation: string, language: "en" | "hi" | "pa", count: number): string[] {
  const prefixes = explanationPrefixes(language, count);
  return prefixes.map((prefix, index) => {
    const start = explanation.indexOf(prefix);
    if (start < 0) return "";
    const colon = explanation.indexOf(": ", start);
    if (colon < 0) return "";
    const nextPrefix = prefixes[index + 1];
    const end = nextPrefix ? explanation.indexOf(nextPrefix, colon + 2) : explanation.length;
    return explanation.slice(colon + 2, end < 0 ? explanation.length : end).trim();
  });
}

function formatExplanation(language: "en" | "hi" | "pa", strengths: readonly ArgStrength[], reasons: readonly string[]): string {
  return strengths.map((strength, index) => {
    const label = ROMAN[index]!;
    const reason = reasons[index] ?? "";
    if (language === "hi") return `तर्क ${label} ${strength === "STRONG" ? "मजबूत" : "कमजोर"} है: ${reason}`;
    if (language === "pa") return `ਦਲੀਲ ${label} ${strength === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ"} ਹੈ: ${reason}`;
    return `Argument ${label} is ${strength.toLowerCase()}: ${reason}`;
  }).join(" ");
}

function localizedStrongNo(qlId: string, language: "en" | "hi" | "pa"):
  | Readonly<{ argument: string; reason: string }>
  | undefined {
  if (qlId === "ARG-QL-003") {
    if (language === "hi") return Object.freeze({
      argument: "नहीं। निर्धारित समय-स्लॉट शुरू करने से उन लोगों को व्यावहारिक कठिनाई हो सकती है जो ऑनलाइन स्लॉट बुक नहीं कर सकते या तय समय पर पहुँचना उनके लिए कठिन है।",
      reason: "यह समय-स्लॉट व्यवस्था से जुड़ी वास्तविक पहुँच संबंधी कठिनाई बताता है।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਨਹੀਂ। ਨਿਰਧਾਰਤ ਸਮਾਂ-ਸਲਾਟ ਸ਼ੁਰੂ ਕਰਨ ਨਾਲ ਉਹਨਾਂ ਲੋਕਾਂ ਲਈ ਅਸਲ ਪਹੁੰਚ ਦੀ ਮੁਸ਼ਕਲ ਪੈ ਸਕਦੀ ਹੈ ਜੋ ਆਨਲਾਈਨ ਸਲਾਟ ਬੁੱਕ ਨਹੀਂ ਕਰ ਸਕਦੇ ਜਾਂ ਨਿਰਧਾਰਤ ਸਮੇਂ ਉੱਤੇ ਪਹੁੰਚਣਾ ਉਹਨਾਂ ਲਈ ਔਖਾ ਹੈ।",
      reason: "ਇਹ ਸਮਾਂ-ਸਲਾਟ ਪ੍ਰਣਾਲੀ ਨਾਲ ਜੁੜੀ ਅਸਲ ਪਹੁੰਚ ਦੀ ਮੁਸ਼ਕਲ ਦੱਸਦਾ ਹੈ।",
    });
    return Object.freeze({
      argument: "No. Introducing scheduled time slots can disadvantage users who cannot book online or cannot reliably arrive within a fixed slot.",
      reason: "It identifies a real access cost created by the proposed time-slot system.",
    });
  }

  if (qlId === "ARG-QL-004") {
    if (language === "hi") return Object.freeze({
      argument: "नहीं। व्यस्त समय का प्रतिबंध आपातकालीन या आवश्यक डिलीवरी में देरी कर सकता है, यदि नियम में स्पष्ट अपवाद न रखे जाएँ।",
      reason: "यह प्रस्तावित प्रतिबंध से जुड़ी एक महत्वपूर्ण संचालन संबंधी लागत बताता है।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਨਹੀਂ। ਭੀੜ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਐਮਰਜੈਂਸੀ ਜਾਂ ਜ਼ਰੂਰੀ ਡਿਲਿਵਰੀ ਵਿੱਚ ਦੇਰੀ ਕਰ ਸਕਦੀ ਹੈ, ਜੇ ਨਿਯਮ ਵਿੱਚ ਸਪੱਸ਼ਟ ਛੋਟਾਂ ਨਾ ਰੱਖੀਆਂ ਜਾਣ।",
      reason: "ਇਹ ਪ੍ਰਸਤਾਵਿਤ ਪਾਬੰਦੀ ਨਾਲ ਜੁੜੀ ਇੱਕ ਮਹੱਤਵਪੂਰਨ ਕਾਰਜਕਾਰੀ ਲਾਗਤ ਦੱਸਦਾ ਹੈ।",
    });
    return Object.freeze({
      argument: "No. A peak-hour restriction may delay emergency or essential deliveries unless clear exemptions are built into the rule.",
      reason: "It identifies a material operational cost that the proposed restriction must address.",
    });
  }

  if (qlId === "ARG-QL-005") {
    if (language === "hi") return Object.freeze({
      argument: "नहीं। संदिग्ध कदाचार की सीमित जाँच में पहले से सूचना देने पर जाँच का उद्देश्य विफल हो सकता है, इसलिए सूचना नियम में एक संकीर्ण अपवाद आवश्यक हो सकता है।",
      reason: "यह ऐसा विशिष्ट मामला बताता है जिसमें पहले से सूचना देना वैध जाँच को प्रभावित कर सकता है।",
    });
    if (language === "pa") return Object.freeze({
      argument: "ਨਹੀਂ। ਸ਼ੱਕੀ ਗਲਤ ਵਿਹਾਰ ਦੀ ਸੀਮਿਤ ਜਾਂਚ ਵਿੱਚ ਪਹਿਲਾਂ ਸੂਚਨਾ ਦੇਣ ਨਾਲ ਜਾਂਚ ਦਾ ਮਕਸਦ ਨਾਕਾਮ ਹੋ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਸੂਚਨਾ ਨਿਯਮ ਵਿੱਚ ਇੱਕ ਸੰਕੁਚਿਤ ਛੋਟ ਦੀ ਲੋੜ ਹੋ ਸਕਦੀ ਹੈ।",
      reason: "ਇਹ ਉਹ ਖਾਸ ਹਾਲਤ ਦੱਸਦਾ ਹੈ ਜਿਸ ਵਿੱਚ ਪਹਿਲਾਂ ਸੂਚਨਾ ਦੇਣਾ ਵਾਜਬ ਜਾਂਚ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰ ਸਕਦਾ ਹੈ।",
    });
    return Object.freeze({
      argument: "No. In a narrowly targeted investigation of suspected misconduct, advance notice could defeat the purpose of the monitoring, so a limited exception may be necessary.",
      reason: "It identifies a specific case in which advance notice could undermine a legitimate investigation.",
    });
  }

  return undefined;
}

function grievanceStrongNo(language: "en" | "hi" | "pa") {
  if (language === "hi") return Object.freeze({
    argument: "नहीं। यदि प्राधिकरण शिकायत संपर्क को अद्यतन नहीं रख सकता, तो उसे दिखाने से प्रक्रिया पूरी होने के बाद उपयोगकर्ता गलत संपर्क पर निर्भर कर सकते हैं।",
    reason: "यह प्रक्रिया के बाद दिखाई जाने वाली संपर्क जानकारी की सटीकता से जुड़ी महत्वपूर्ण शर्त उठाता है।",
  });
  if (language === "pa") return Object.freeze({
    argument: "ਨਹੀਂ। ਜੇ ਅਥਾਰਟੀ ਸ਼ਿਕਾਇਤ ਸੰਪਰਕ ਨੂੰ ਅੱਪਡੇਟ ਨਹੀਂ ਰੱਖ ਸਕਦੀ, ਤਾਂ ਇਸ ਨੂੰ ਦਿਖਾਉਣ ਨਾਲ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ ਵਰਤੋਂਕਾਰ ਗਲਤ ਸੰਪਰਕ ਉੱਤੇ ਨਿਰਭਰ ਕਰ ਸਕਦੇ ਹਨ।",
    reason: "ਇਹ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਦਿਖਾਈ ਜਾਣ ਵਾਲੀ ਸੰਪਰਕ ਜਾਣਕਾਰੀ ਦੀ ਸਹੀਤਾ ਨਾਲ ਜੁੜੀ ਮਹੱਤਵਪੂਰਨ ਸ਼ਰਤ ਉਠਾਉਂਦਾ ਹੈ।",
  });
  return Object.freeze({
    argument: "No. Unless the authority can keep the grievance contact current, displaying it may misdirect users after the process is complete.",
    reason: "It raises a material accuracy condition for post-process contact information.",
  });
}

function rebuildRealPaperStem(question: MutableQuestion): void {
  if (question.profileMode !== "real-paper" || !Array.isArray(question.arguments)) return;
  const language = languageOf(question);
  const heading = language === "hi" ? "कथन" : language === "pa" ? "ਕਥਨ" : "Statement";
  const argumentHeading = language === "hi" ? "तर्क" : language === "pa" ? "ਦਲੀਲਾਂ" : "Arguments";
  const stem = `${heading}: ${String(question.statement ?? "")}\n${argumentHeading}:\n${question.arguments.map((argument: unknown, index: number) => `${ROMAN[index]}. ${String(argument)}`).join("\n")}`;
  question.text = stem;
  question.stem = stem;
}

function realPaperCorrelationPatch(question: MutableQuestion): void {
  if (question.profileMode !== "real-paper" || !Array.isArray(question.arguments) || !Array.isArray(question.argumentStrengths)) return;
  const language = languageOf(question);
  const strengths = question.argumentStrengths.map(String) as ArgStrength[];
  const reasons = extractReasons(String(question.explanation ?? ""), language, strengths.length);
  const argumentsList = question.arguments.map(String);
  const qlId = String(question.qlId ?? "");

  let patch: Readonly<{ argument: string; reason: string }> | undefined;
  if (qlId === "ARG-QL-001" && String(question.scenarioId ?? "").includes("GRIEVANCE_CONTACT")) {
    patch = grievanceStrongNo(language);
  } else {
    patch = localizedStrongNo(qlId, language);
  }

  if (patch) {
    const target = strengths.findIndex((strength, index) => strength === "STRONG" && /^\s*(No\.|नहीं।|ਨਹੀਂ।)/u.test(argumentsList[index] ?? ""));
    if (target >= 0) {
      argumentsList[target] = patch.argument;
      reasons[target] = patch.reason;
    }
  }

  question.arguments = Object.freeze(argumentsList);
  question.explanation = formatExplanation(language, strengths, reasons);
  rebuildRealPaperStem(question);
}

function optionSurfacePatch(question: MutableQuestion): void {
  if (!Array.isArray(question.options)) return;
  const language = languageOf(question);
  const options = question.options.map((value: unknown) => naturalizeCombinationLabel(String(value), language));
  question.options = Object.freeze(options);
  const correctIndex = Number(question.correctIndex ?? question.correct ?? -1);
  if (Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < options.length) {
    question.answer = options[correctIndex]!;
    question.canonicalAnswer = options[correctIndex]!;
  }
}

function finalizeQuestion(rawQuestion: QuestionRecord): QuestionRecord {
  const question: MutableQuestion = { ...rawQuestion };
  coreWorkshopPatch(question);
  punjabiGrammarPatch(question);
  englishGrammarPatch(question);
  realPaperCorrelationPatch(question);
  optionSurfacePatch(question);

  const contentFingerprint = fingerprint([
    ARG_CP013_AUTHORITY,
    question.qlId,
    question.profileMode,
    question.examProfile,
    question.language,
    question.difficulty,
    question.statement,
    question.arguments,
    question.options,
    question.correctIndex,
    question.explanation,
  ]);

  question.checkpointId = ARG_CP013_CHECKPOINT_ID;
  question.currentQuestionStudioAuthority = ARG_CP013_QUESTION_STUDIO_AUTHORITY;
  question.runtimeMode = ARG_CP013_RUNTIME_MODE;
  question.reviewStatus = ARG_CP013_REVIEW_STATUS;
  question.contentFingerprint = contentFingerprint;
  question.questionId = `ARG-001:${String(question.qlId ?? "UNKNOWN")}:${String(question.profileMode ?? "core")}:${contentFingerprint.slice(0, 20)}:CP013`;
  question.supersedesQuestionStudioAuthority = ARG_CP012_QUESTION_STUDIO_AUTHORITY;
  question.sourceEditorialCheckpointId = ARG_CP012_CHECKPOINT_ID;
  question.lifecycleStatus = "REVIEW_ONLY";
  question.manualApprovalRequired = true;
  question.persistenceAllowed = false;
  question.questionBankStatus = "NOT_STORED";
  question.questionBankWritable = false;
  question.testEligibility = "INELIGIBLE";
  question.testEligible = false;
  question.mockTestEligible = false;
  question.publiclyPublishable = false;
  question.automaticStudentPublication = false;
  question.learnerRelease = "LOCKED";
  return Object.freeze(question);
}

export function isArgCp013CurrentReviewRequest(input: Readonly<Record<string, unknown>>): boolean {
  return text(input.cpId).toUpperCase() === ARG_CP013_CHECKPOINT_ID || isArgCp012CurrentReviewRequest(input);
}

export function isArgCp013RealPaperRequest(input: ArgCp013QuestionStudioInput): boolean {
  return text(input.cpId).toUpperCase() === ARG_CP013_CHECKPOINT_ID || isArgCp012RealPaperRequest(input);
}

export function generateArgCp013QuestionStudioBatch(input: ArgCp013QuestionStudioInput) {
  const cpId = text(input.cpId).toUpperCase();
  const sourceInput: ArgCp012QuestionStudioInput = cpId === ARG_CP013_CHECKPOINT_ID
    ? { ...input, cpId: ARG_CP012_CHECKPOINT_ID }
    : input;
  const source = generateArgCp012QuestionStudioBatch(sourceInput);
  const questions = Object.freeze(source.questions.map((question) => finalizeQuestion(question as unknown as QuestionRecord)));
  return Object.freeze({
    ...source,
    checkpointId: ARG_CP013_CHECKPOINT_ID,
    authority: ARG_CP013_QUESTION_STUDIO_AUTHORITY,
    questions,
    generationContext: Object.freeze({
      ...source.generationContext,
      checkpointId: ARG_CP013_CHECKPOINT_ID,
      authority: ARG_CP013_QUESTION_STUDIO_AUTHORITY,
      runtimeMode: ARG_CP013_RUNTIME_MODE,
      reviewStatus: ARG_CP013_REVIEW_STATUS,
      sourceQuestionStudioAuthority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
      sourceRealPaperCheckpointId: ARG_CP012_CHECKPOINT_ID,
      finalEditorialSurfaceAuthority: ARG_CP013_AUTHORITY,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}

export const ARG_CP013_QUESTION_STUDIO_PACKAGE = Object.freeze({
  ...ARG_CP012_QUESTION_STUDIO_PACKAGE,
  cpIds: Object.freeze([...ARG_CP012_QUESTION_STUDIO_PACKAGE.cpIds, ARG_CP013_CHECKPOINT_ID] as const),
  currentCoreCheckpointId: ARG_CP009_CHECKPOINT_ID,
  currentRealPaperCheckpointId: ARG_CP013_CHECKPOINT_ID,
  sourceRealPaperCheckpointId: ARG_CP012_CHECKPOINT_ID,
  currentQuestionStudioAuthority: ARG_CP013_QUESTION_STUDIO_AUTHORITY,
  finalEditorialSurfaceAuthority: ARG_CP013_AUTHORITY,
  sourceQuestionStudioAuthority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
  runtimeMode: ARG_CP013_RUNTIME_MODE,
  reviewStatus: ARG_CP013_REVIEW_STATUS,
  reviewOnly: true as const,
  manualApprovalRequired: true as const,
  persistenceAllowed: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  learnerRelease: "LOCKED" as const,
  permanentQlCount: ARG_QL_IDS.length,
});
