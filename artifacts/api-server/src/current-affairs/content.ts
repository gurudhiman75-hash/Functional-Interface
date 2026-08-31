import { createHash } from "node:crypto";

export type CurrentAffairsFact = {
  id?: string;
  key: string;
  value: string;
  type?: string;
  confidence?: number;
};

export type CurrentAffairsContentEvent = {
  id: string;
  publicCode: string;
  title: string;
  summary: string;
  importanceReason: string;
  eventDate: string;
  category: string;
  examFamily?: string;
  examScore?: number;
  facts: CurrentAffairsFact[];
};

export type CurrentAffairsGeneratedQuestion = {
  eventId: string;
  eventPublicCode: string;
  factId?: string;
  factKey: string;
  family: "CA-QL-001" | "CA-QL-002";
  payload: Record<string, unknown>;
};

const FAMILY_LABELS: Record<CurrentAffairsGeneratedQuestion["family"], string> = {
  "CA-QL-001": "verified fact recall",
  "CA-QL-002": "event association",
};

function normalized(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.%₹$-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    const token = key(item);
    if (!token || seen.has(token)) continue;
    seen.add(token);
    result.push(item);
  }
  return result;
}

function deterministicOrder<T>(items: T[], seed: string, value: (item: T) => string): T[] {
  return [...items].sort((a, b) => {
    const left = createHash("sha256").update(`${seed}|${value(a)}`).digest("hex");
    const right = createHash("sha256").update(`${seed}|${value(b)}`).digest("hex");
    return left.localeCompare(right);
  });
}

function sentence(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /[.!?।]$/u.test(trimmed) ? trimmed : `${trimmed}.`;
}

export function humanizeFactKey(key: string): string {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function eventOneLiner(event: CurrentAffairsContentEvent): string {
  if (event.summary.trim()) return sentence(event.summary);
  const firstFact = event.facts[0];
  if (firstFact) {
    return `${humanizeFactKey(firstFact.key)}: ${sentence(firstFact.value)}`;
  }
  return sentence(event.title);
}

export function renderEventStudyMarkdown(event: CurrentAffairsContentEvent): string {
  const lines: string[] = [
    `# ${event.title}`,
    "",
    `**Date:** ${event.eventDate}`,
    `**Category:** ${event.category.replaceAll("_", " ")}`,
    "",
    "## In one line",
    "",
    eventOneLiner(event),
  ];

  if (event.summary.trim()) {
    lines.push("", "## What happened", "", sentence(event.summary));
  }

  if (event.facts.length > 0) {
    lines.push("", "## Key facts", "");
    for (const fact of event.facts) {
      lines.push(`- **${fact.key}:** ${fact.value}`);
    }
  }

  if (event.importanceReason.trim()) {
    lines.push("", "## Why it matters for exams", "", sentence(event.importanceReason));
  }

  lines.push("", "## Exam focus", "");
  if (event.facts.length > 0) {
    const keys = event.facts.slice(0, 5).map((fact) => humanizeFactKey(fact.key));
    lines.push(`Revise the event together with its ${keys.join(", ")}.`);
  } else {
    lines.push("Revise the event name, date and category.");
  }

  return `${lines.join("\n").trim()}\n`;
}

function lifecycleContext(event: CurrentAffairsContentEvent, family: CurrentAffairsGeneratedQuestion["family"]) {
  return {
    runtimeMode: "CURRENT_AFFAIRS_CANONICAL",
    reviewStatus: "PENDING_EDITORIAL_REVIEW",
    questionBankStatus: "STORED",
    questionBankWritable: true,
    questionBankAcceptanceMode: "BANK_ONLY",
    questionBankAcceptanceAuthority: "CURRENT_AFFAIRS_EDITORIAL_REVIEW",
    testEligibility: "INELIGIBLE",
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    integrationAuthority: "CURRENT_AFFAIRS_STUDIO_CP004",
    sourceFreezeAuthority: "VERIFIED_CURRENT_AFFAIRS_FACTS",
    currentAffairsEventId: event.id,
    currentAffairsEventCode: event.publicCode,
    currentAffairsEventDate: event.eventDate,
    currentAffairsCategory: event.category,
    examFamily: event.examFamily ?? "general",
    qlId: family,
  };
}

function makePayload(args: {
  event: CurrentAffairsContentEvent;
  fact: CurrentAffairsFact;
  family: CurrentAffairsGeneratedQuestion["family"];
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "Easy" | "Medium";
}) {
  return {
    text: args.stem,
    stem: args.stem,
    options: args.options,
    correctIndex: args.correctIndex,
    explanation: args.explanation,
    difficultyLabel: args.difficulty,
    canonicalAnswer: args.options[args.correctIndex],
    packageId: "CA-001",
    patternId: args.family,
    qlId: args.family,
    sourceChapterId: "CURRENT-AFFAIRS",
    topic: "General Awareness",
    subtopic: "Current Affairs",
    examFamily: args.event.examFamily ?? "general",
    language: "en",
    generationContext: lifecycleContext(args.event, args.family),
    provenance: {
      eventId: args.event.id,
      eventPublicCode: args.event.publicCode,
      factId: args.fact.id ?? null,
      factKey: args.fact.key,
      factValue: args.fact.value,
      source: "verified_current_affairs_fact",
    },
  };
}

export function buildFactRecallQuestion(
  event: CurrentAffairsContentEvent,
  fact: CurrentAffairsFact,
  distractorValues: string[],
): CurrentAffairsGeneratedQuestion | null {
  const correct = fact.value.trim();
  if (!correct) return null;
  const alternatives = unique(
    distractorValues
      .map((value) => value.trim())
      .filter((value) => value && normalized(value) !== normalized(correct)),
    normalized,
  );
  if (alternatives.length < 3) return null;

  const seed = `${event.publicCode}|${fact.key}|CA-QL-001`;
  const distractors = deterministicOrder(alternatives, seed, (value) => value).slice(0, 3);
  const options = deterministicOrder([correct, ...distractors], `${seed}|options`, (value) => value);
  const correctIndex = options.findIndex((value) => normalized(value) === normalized(correct));
  const key = humanizeFactKey(fact.key);
  const stemVariants = [
    `In the current-affairs event “${event.title}”, which of the following correctly gives the ${key}?`,
    `What was the ${key} associated with “${event.title}”?`,
    `“${event.title}” was in the news. Identify the correct ${key}.`,
  ];
  const stem = stemVariants[parseInt(createHash("sha256").update(seed).digest("hex").slice(0, 4), 16) % stemVariants.length]!;
  const explanation = [
    `The correct answer is ${correct}.`,
    `For “${event.title}”, the verified ${key} is ${correct}.`,
    event.summary.trim() ? sentence(event.summary) : "",
  ].filter(Boolean).join(" ");

  return {
    eventId: event.id,
    eventPublicCode: event.publicCode,
    factId: fact.id,
    factKey: fact.key,
    family: "CA-QL-001",
    payload: makePayload({ event, fact, family: "CA-QL-001", stem, options, correctIndex, explanation, difficulty: "Easy" }),
  };
}

export function buildEventAssociationQuestion(
  event: CurrentAffairsContentEvent,
  fact: CurrentAffairsFact,
  distractorEventTitles: string[],
): CurrentAffairsGeneratedQuestion | null {
  const correct = event.title.trim();
  if (!correct || !fact.value.trim()) return null;
  const alternatives = unique(
    distractorEventTitles
      .map((value) => value.trim())
      .filter((value) => value && normalized(value) !== normalized(correct)),
    normalized,
  );
  if (alternatives.length < 3) return null;

  const seed = `${event.publicCode}|${fact.key}|${fact.value}|CA-QL-002`;
  const distractors = deterministicOrder(alternatives, seed, (value) => value).slice(0, 3);
  const options = deterministicOrder([correct, ...distractors], `${seed}|options`, (value) => value);
  const correctIndex = options.findIndex((value) => normalized(value) === normalized(correct));
  const key = humanizeFactKey(fact.key);
  const stem = `Which current-affairs event is correctly associated with the ${key} “${fact.value}”?`;
  const explanation = [
    `The correct answer is “${event.title}”.`,
    `Its verified ${key} is ${fact.value}.`,
    event.importanceReason.trim() ? sentence(event.importanceReason) : "",
  ].filter(Boolean).join(" ");

  return {
    eventId: event.id,
    eventPublicCode: event.publicCode,
    factId: fact.id,
    factKey: fact.key,
    family: "CA-QL-002",
    payload: makePayload({ event, fact, family: "CA-QL-002", stem, options, correctIndex, explanation, difficulty: "Medium" }),
  };
}

export function generateCurrentAffairsQuestions(
  events: CurrentAffairsContentEvent[],
  distractorPool: CurrentAffairsContentEvent[],
  limit = 20,
): CurrentAffairsGeneratedQuestion[] {
  const safeLimit = Math.max(1, Math.min(200, Math.floor(limit)));
  const results: CurrentAffairsGeneratedQuestion[] = [];
  const seen = new Set<string>();

  const factsByKey = new Map<string, Array<{ eventId: string; value: string }>>();
  for (const poolEvent of distractorPool) {
    for (const fact of poolEvent.facts) {
      const key = normalized(fact.key);
      const list = factsByKey.get(key) ?? [];
      list.push({ eventId: poolEvent.id, value: fact.value });
      factsByKey.set(key, list);
    }
  }

  const eventTitles = unique(distractorPool, (item) => item.id).map((item) => ({ id: item.id, title: item.title }));

  for (const event of events) {
    for (const fact of event.facts) {
      if (results.length >= safeLimit) return results;
      const sameKey = factsByKey.get(normalized(fact.key)) ?? [];
      const recall = buildFactRecallQuestion(
        event,
        fact,
        sameKey.filter((item) => item.eventId !== event.id).map((item) => item.value),
      );
      if (recall) {
        const token = `${recall.family}|${event.id}|${normalized(fact.key)}|${normalized(fact.value)}`;
        if (!seen.has(token)) {
          seen.add(token);
          results.push(recall);
        }
      }

      if (results.length >= safeLimit) return results;
      const sameValueOtherEvents = sameKey.filter(
        (item) => item.eventId !== event.id && normalized(item.value) === normalized(fact.value),
      );
      if (sameValueOtherEvents.length === 0) {
        const association = buildEventAssociationQuestion(
          event,
          fact,
          eventTitles.filter((item) => item.id !== event.id).map((item) => item.title),
        );
        if (association) {
          const token = `${association.family}|${event.id}|${normalized(fact.key)}|${normalized(fact.value)}`;
          if (!seen.has(token)) {
            seen.add(token);
            results.push(association);
          }
        }
      }
    }
  }

  return results;
}

export function renderCompilationMarkdown(args: {
  title: string;
  periodLabel: string;
  examFamily: string;
  events: CurrentAffairsContentEvent[];
}): string {
  const events = [...args.events].sort((a, b) =>
    Number(b.examScore ?? 0) - Number(a.examScore ?? 0)
    || b.eventDate.localeCompare(a.eventDate)
    || a.title.localeCompare(b.title),
  );
  const lines: string[] = [
    `# ${args.title}`,
    "",
    `**Period:** ${args.periodLabel}`,
    `**Exam focus:** ${args.examFamily.toUpperCase()}`,
    `**Verified events:** ${events.length}`,
    "",
    "## Rapid revision",
    "",
  ];

  for (const event of events) {
    lines.push(`- **${event.title}** — ${eventOneLiner(event)}`);
  }

  const categories = new Map<string, CurrentAffairsContentEvent[]>();
  for (const event of events) {
    const list = categories.get(event.category) ?? [];
    list.push(event);
    categories.set(event.category, list);
  }

  for (const [category, categoryEvents] of [...categories.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push("", `## ${category.replaceAll("_", " ").replace(/\b\w/g, (match) => match.toUpperCase())}`, "");
    for (const event of categoryEvents) {
      lines.push(`### ${event.title}`, "");
      if (event.summary.trim()) lines.push(sentence(event.summary), "");
      for (const fact of event.facts.slice(0, 8)) {
        lines.push(`- **${fact.key}:** ${fact.value}`);
      }
      if (event.importanceReason.trim()) {
        lines.push("", `**Exam relevance:** ${sentence(event.importanceReason)}`, "");
      } else {
        lines.push("");
      }
    }
  }

  return `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

export function questionFamilyLabel(family: CurrentAffairsGeneratedQuestion["family"]): string {
  return FAMILY_LABELS[family];
}
