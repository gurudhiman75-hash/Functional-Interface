export type SharedStimulusKind =
  | "passage"
  | "data_interpretation"
  | "puzzle"
  | "caselet"
  | "other";

export interface SharedStimulusRuntime {
  id: string;
  kind: SharedStimulusKind;
  title: string | null;
  text: string | null;
  imageUrl: string | null;
}

export type DescriptiveTaskKind =
  | "essay"
  | "comprehension"
  | "letter"
  | "precis"
  | "other";

export interface DescriptiveTaskRuntime {
  id: string;
  kind: DescriptiveTaskKind;
  prompt: string;
  marks: number;
  minWords: number | null;
  maxWords: number | null;
  instructions: string | null;
  stimulus: SharedStimulusRuntime | null;
}

export interface DescriptiveTaskInspection {
  tasks: DescriptiveTaskRuntime[];
  issues: string[];
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function boundedText(value: unknown, maximum: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maximum) : null;
}

function finiteNumber(value: unknown): number | null {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function stimulusKind(value: unknown): SharedStimulusKind {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (
    normalized === "passage" ||
    normalized === "data_interpretation" ||
    normalized === "puzzle" ||
    normalized === "caselet"
  ) return normalized;
  return "other";
}

function descriptiveKind(value: unknown): DescriptiveTaskKind {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (
    normalized === "essay" ||
    normalized === "comprehension" ||
    normalized === "letter" ||
    normalized === "precis"
  ) return normalized;
  return "other";
}

function normalizeSharedStimulus(value: unknown): SharedStimulusRuntime | null {
  const input = asRecord(value);
  const id = boundedText(input.id, 180);
  const text = boundedText(input.text ?? input.content, 120_000);
  const imageUrl = boundedText(input.imageUrl, 4_000);
  if (!id || (!text && !imageUrl)) return null;
  return {
    id,
    kind: stimulusKind(input.kind),
    title: boundedText(input.title, 500),
    text,
    imageUrl,
  };
}

export function readSharedStimulus(
  answerModel: unknown,
  testQuestionSettings?: unknown,
): SharedStimulusRuntime | null {
  const questionSettings = asRecord(testQuestionSettings);
  const direct = normalizeSharedStimulus(questionSettings.sharedStimulus);
  if (direct) return direct;

  const answer = asRecord(answerModel);
  const generation = asRecord(answer.generation);
  return normalizeSharedStimulus(generation.sharedStimulus);
}

export function inspectDescriptiveTasks(sectionSettings: unknown): DescriptiveTaskInspection {
  const settings = asRecord(sectionSettings);
  const rawTasks = Array.isArray(settings.descriptiveTasks) ? settings.descriptiveTasks : [];
  const issues: string[] = [];
  const tasks: DescriptiveTaskRuntime[] = [];
  const ids = new Set<string>();

  if (rawTasks.length > 20) {
    issues.push("A descriptive section cannot contain more than 20 tasks.");
  }

  rawTasks.slice(0, 20).forEach((rawTask, index) => {
    const task = asRecord(rawTask);
    const id = boundedText(task.id, 120);
    const prompt = boundedText(task.prompt, 50_000);
    const marks = finiteNumber(task.marks);
    const minWordsRaw = task.minWords == null || task.minWords === "" ? null : finiteNumber(task.minWords);
    const maxWordsRaw = task.maxWords == null || task.maxWords === "" ? null : finiteNumber(task.maxWords);

    if (!id) {
      issues.push(`Descriptive task ${index + 1} needs an id.`);
      return;
    }
    if (ids.has(id)) {
      issues.push(`Descriptive task id ${id} is duplicated.`);
      return;
    }
    ids.add(id);
    if (!prompt) {
      issues.push(`Descriptive task ${id} needs a prompt.`);
      return;
    }
    if (marks == null || marks <= 0 || marks > 1_000) {
      issues.push(`Descriptive task ${id} marks must be between 0 and 1000.`);
      return;
    }
    if (minWordsRaw != null && (!Number.isInteger(minWordsRaw) || minWordsRaw < 0 || minWordsRaw > 20_000)) {
      issues.push(`Descriptive task ${id} has an invalid minimum word count.`);
      return;
    }
    if (maxWordsRaw != null && (!Number.isInteger(maxWordsRaw) || maxWordsRaw < 1 || maxWordsRaw > 20_000)) {
      issues.push(`Descriptive task ${id} has an invalid maximum word count.`);
      return;
    }
    if (minWordsRaw != null && maxWordsRaw != null && minWordsRaw > maxWordsRaw) {
      issues.push(`Descriptive task ${id} minimum words cannot exceed maximum words.`);
      return;
    }

    tasks.push({
      id,
      kind: descriptiveKind(task.kind),
      prompt,
      marks,
      minWords: minWordsRaw,
      maxWords: maxWordsRaw,
      instructions: boundedText(task.instructions, 10_000),
      stimulus: normalizeSharedStimulus(task.stimulus),
    });
  });

  return { tasks, issues };
}

export function descriptiveTaskMarks(sectionSettings: unknown): number {
  return inspectDescriptiveTasks(sectionSettings).tasks.reduce((sum, task) => sum + task.marks, 0);
}

export function stableRuntimeItemId(value: string): number {
  let hash = 17;
  for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash || 1;
}

export function wordCount(value: string): number {
  const normalized = value.trim();
  return normalized ? normalized.split(/\s+/u).length : 0;
}
