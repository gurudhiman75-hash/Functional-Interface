import type { Pattern } from "@workspace/db";
import type { DistractorStrategy, VariableSpec } from "./generator.types";
import { SAMPLE_PATTERNS } from "./patterns.seed";

export type RenderedTemplate = {
  questionText: string;
  variables: Record<string, number | string>;
  computedAnswer: string;
};

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

function pickVariable(spec: VariableSpec): number | string {
  switch (spec.type) {
    case "int":
      return randInt(spec.min, spec.max);
    case "float":
      return randFloat(spec.min, spec.max, spec.decimals ?? 2);
    case "choice":
      return spec.values[randInt(0, spec.values.length - 1)];
  }
}

function substitute(template: string, vars: Record<string, number | string>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const value = vars[key];
    return value === undefined ? `{{${key}}}` : String(value);
  });
}

function evalExpression(expr: string, vars: Record<string, number | string>): string {
  const keys = Object.keys(vars);
  const values = Object.values(vars);
  // Restricted evaluation: only template variables and Math are available.
  // eslint-disable-next-line no-new-func
  const fn = new Function(...keys, "Math", `"use strict"; return (${expr});`);
  return String(fn(...values, Math));
}

export function renderTemplate(pattern: Pick<Pattern, "template" | "variables" | "answerExpression">): RenderedTemplate {
  const vars: Record<string, number | string> = {};
  for (const [name, spec] of Object.entries(pattern.variables as Record<string, VariableSpec>)) {
    vars[name] = pickVariable(spec);
  }
  return {
    questionText: substitute(pattern.template, vars),
    variables: vars,
    computedAnswer: evalExpression(pattern.answerExpression, vars),
  };
}

export function buildOptions(pattern: Pick<Pattern, "distractorStrategy">, correctAnswer: string): string[] {
  const strategy = (pattern.distractorStrategy as DistractorStrategy | null) ?? {
    type: "numeric_offsets",
    offsets: [-2, -1, 1],
  };
  const options = new Set<string>([correctAnswer]);

  if (strategy.type === "numeric_offsets") {
    const numeric = Number(correctAnswer);
    if (Number.isFinite(numeric)) {
      for (const offset of strategy.offsets) {
        options.add(String(numeric + offset));
      }
    } else {
      options.add(`${correctAnswer} (alt)`);
      options.add("None of the above");
      options.add("Cannot be determined");
    }
  } else {
    for (const value of strategy.values) options.add(value);
  }

  const arr = Array.from(options).slice(0, 4);
  while (arr.length < 4) {
    arr.push(`Option ${arr.length + 1}`);
  }

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getInMemoryPatterns(): Pattern[] {
  const now = new Date();
  return SAMPLE_PATTERNS.map((pattern, index) => ({
    id: `mem-${index}`,
    name: pattern.name,
    section: pattern.section,
    topic: pattern.topic,
    subtopic: pattern.subtopic,
    difficulty: pattern.difficulty,
    template: pattern.template,
    variables: pattern.variables,
    answerExpression: pattern.answerExpression,
    distractorStrategy: pattern.distractorStrategy ?? null,
    tags: pattern.tags ?? null,
    usageCount: 0,
    lastUsedAt: null,
    createdAt: now,
  })) as Pattern[];
}
