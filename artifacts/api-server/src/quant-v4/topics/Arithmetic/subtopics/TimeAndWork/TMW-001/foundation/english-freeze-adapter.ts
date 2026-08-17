import { TMW_CP001_REGISTRY } from "./cp001-registry";
import { runTmwCp001Pipeline } from "./cp001-runtime";
import { TMW_CP002_REGISTRY } from "./cp002-registry";
import { runTmwCp002Pipeline } from "./cp002-runtime";
import { TMW_CP003_REGISTRY } from "./cp003-registry";
import { runTmwCp003Pipeline } from "./cp003-runtime";
import { TMW_CP004_REGISTRY } from "./cp004-registry";
import { runTmwCp004Pipeline } from "./cp004-runtime";
import { TMW_CP005_REGISTRY } from "./cp005-registry";
import { runTmwCp005Pipeline } from "./cp005-runtime";
import { TMW_CP006_REGISTRY } from "./cp006-registry";
import { runTmwCp006Pipeline } from "./cp006-runtime";
import { TMW_CP007_REGISTRY } from "./cp007-registry";
import { runTmwCp007Pipeline } from "./cp007-runtime";
import { TMW_CP008_REGISTRY } from "./cp008-registry";
import { runTmwCp008Pipeline } from "./cp008-runtime";
import { TMW_CP009_REGISTRY } from "./cp009-registry";
import { runTmwCp009Pipeline } from "./cp009-runtime";
import { TMW_CP010_REGISTRY } from "./cp010-registry";
import { runTmwCp010Pipeline } from "./cp010-runtime";
import { TMW_CP_011_REGISTRY } from "./cp011-registry";
import { runTmwCp011Pipeline } from "./cp011-runtime";
import { diversifyTmwEnglishStem } from "./english-stem-diversity";
import { polishTmwEnglishQuestionForManualReview } from "./english-manual-polish";

export type TmwEnglishOpeningStyle =
  | "SUBJECT_FIRST"
  | "TEMPORAL_FIRST"
  | "OBJECTIVE_FIRST"
  | "CONTEXT_FIRST"
  | "QUESTION_FIRST"
  | "OTHER";

export interface TmwEnglishRegistryEntry {
  qlId: string;
  cpId: string;
  solveMode: string;
  answerType: string;
  ruleId: string;
  difficulty: string;
  publiclyPublishable: boolean;
}

export interface TmwEnglishAdapter {
  cpId: string;
  registry: readonly TmwEnglishRegistryEntry[];
  run: (qlId: string, seed: string) => any;
}

function withOpeningDiversity(question:any,qlId:string,seed:string):any{
  const polished=polishTmwEnglishQuestionForManualReview(question);
  const stem=typeof polished?.stem==="string"?polished.stem:"";
  return {...polished,stem:diversifyTmwEnglishStem(stem,qlId,seed)};
}

function objectRunner(run: (input: { questionLanguageId: string; seed: string; language?: "en" | "hi" | "pa" }) => any) {
  return (qlId: string, seed: string) => withOpeningDiversity(run({ questionLanguageId: qlId, seed, language: "en" }),qlId,seed);
}

function directRunner(run:(qlId:string,seed:string)=>any){
  return (qlId:string,seed:string)=>withOpeningDiversity(run(qlId,seed),qlId,seed);
}

export const TMW_ENGLISH_ADAPTERS: readonly TmwEnglishAdapter[] = [
  { cpId: "TMW-CP-001", registry: TMW_CP001_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp001Pipeline) },
  { cpId: "TMW-CP-002", registry: TMW_CP002_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp002Pipeline) },
  { cpId: "TMW-CP-003", registry: TMW_CP003_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp003Pipeline) },
  { cpId: "TMW-CP-004", registry: TMW_CP004_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp004Pipeline) },
  { cpId: "TMW-CP-005", registry: TMW_CP005_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp005Pipeline) },
  { cpId: "TMW-CP-006", registry: TMW_CP006_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp006Pipeline) },
  { cpId: "TMW-CP-007", registry: TMW_CP007_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp007Pipeline) },
  { cpId: "TMW-CP-008", registry: TMW_CP008_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp008Pipeline) },
  { cpId: "TMW-CP-009", registry: TMW_CP009_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp009Pipeline) },
  { cpId: "TMW-CP-010", registry: TMW_CP010_REGISTRY as readonly TmwEnglishRegistryEntry[], run: objectRunner(runTmwCp010Pipeline) },
  { cpId: "TMW-CP-011", registry: TMW_CP_011_REGISTRY as readonly TmwEnglishRegistryEntry[], run: directRunner(runTmwCp011Pipeline) },
] as const;

export function allTmwEnglishRegistryEntries(): TmwEnglishRegistryEntry[] {
  return TMW_ENGLISH_ADAPTERS.flatMap((adapter) => [...adapter.registry]);
}

export function runTmwEnglishQuestion(cpId: string, qlId: string, seed: string): any {
  const adapter = TMW_ENGLISH_ADAPTERS.find((candidate) => candidate.cpId === cpId);
  if (!adapter) throw new Error(`Unknown TMW English checkpoint: ${cpId}`);
  return adapter.run(qlId, seed);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function tmwEnglishExplanationParts(question: any): string[] {
  const explanation = question?.explanation ?? {};
  const shortcut = explanation.shortcut ?? {};
  const commonTrap = explanation.commonTrap ?? {};
  return [
    explanation.opening,
    explanation.formula,
    ...stringArray(explanation.givens),
    ...stringArray(explanation.steps),
    shortcut.title,
    ...stringArray(shortcut.steps),
    commonTrap.optionLabel,
    commonTrap.optionText,
    commonTrap.explanation,
    explanation.conclusion,
  ].filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function tmwEnglishLearnerText(question: any): string {
  return [
    question?.stem,
    ...stringArray(question?.options),
    question?.solution?.answerText,
    ...tmwEnglishExplanationParts(question),
  ].filter((item): item is string => typeof item === "string" && item.trim().length > 0).join("\n");
}

export function hasTmwEnglishFourTierExplanation(question: any): boolean {
  const explanation = question?.explanation ?? {};
  return typeof explanation.opening === "string"
    && typeof explanation.formula === "string"
    && stringArray(explanation.steps).length >= 3
    && typeof explanation.shortcut?.title === "string"
    && stringArray(explanation.shortcut?.steps).length >= 1
    && typeof explanation.commonTrap?.optionText === "string"
    && typeof explanation.commonTrap?.explanation === "string"
    && typeof explanation.conclusion === "string";
}

export function classifyTmwEnglishOpening(stem: string): TmwEnglishOpeningStyle {
  const value = stem.trim();
  if (/^(?:At|Inside|Within)\b/i.test(value) || /^In (?:a|an|the)\b/i.test(value)) return "CONTEXT_FIRST";
  if (/^(?:On Day|On the|During|Across|Over|After|Before|When|While|For the first|From Day)\b/i.test(value)) return "TEMPORAL_FIRST";
  if (/^(?:To |A batch|A target|The target|The assignment|The project|A total of|The total work|A reservoir|A tank)\b/i.test(value)) return "OBJECTIVE_FIRST";
  if (/^(?:How|What|Which|Find|Calculate|Determine)\b/i.test(value)) return "QUESTION_FIRST";
  if (/^[A-Z][A-Za-z'’-]+\b/.test(value) || /^(?:A|An|The|One|Two|Three|Each)\b/.test(value)) return "SUBJECT_FIRST";
  return "OTHER";
}

export function normalizedTmwEnglishStem(stem: string): string {
  return stem
    .toLowerCase()
    .replace(/\\\([\s\S]*?\\\)/g, "<math>")
    .replace(/₹[\d,]+(?:\.\d+)?/g, "<money>")
    .replace(/\b\d+(?:\.\d+)?\b/g, "#")
    .replace(/[^a-z#<>]+/g, " ")
    .trim();
}

export function normalizedTmwEnglishOpening(stem: string): string {
  const firstSentence = stem.split(/[.!?]/, 1)[0] ?? stem;
  return normalizedTmwEnglishStem(firstSentence);
}

export function tmwEnglishPrefix(stem: string, words = 4): string {
  return stem
    .toLowerCase()
    .replace(/\\\([\s\S]*?\\\)/g, " ")
    .replace(/[^a-z]+/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, words)
    .join(" ");
}
