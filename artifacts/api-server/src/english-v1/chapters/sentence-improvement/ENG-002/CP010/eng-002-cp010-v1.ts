import { deterministicBoolean, deterministicIndex } from "../../../../core/deterministic";
import type { DifficultyDimensions, EnglishDifficulty } from "../../../../core/types";
import { MODIFIER_RULE_BY_ID, type ModifierRuleId } from "../../../../grammar/modifiers";
import { buildEng001Cp010CandidateV1 } from "../../../error-spotting/ENG-001/CP010/eng-001-cp010-v1";

export const ENG002_CP010_STEM = "Select the most appropriate option to improve the underlined part of the sentence. If no improvement is required, select 'No improvement'.";

export interface Eng002Cp010QuestionV1 {
  questionId: string;
  stem: string;
  sentence: string;
  segments: readonly string[];
  targetIndex: number;
  targetText: string;
  options: readonly string[];
  correctOptionIndex: number;
  correctedSentence: string;
  explanation: string;
  metadata: {
    track: "english";
    chapterId: "ENG-002";
    cpId: "ENG-002-CP010";
    ruleId: ModifierRuleId;
    mutationId: string;
    difficulty: EnglishDifficulty;
    dimensions: DifficultyDimensions;
    seed: string;
    candidateId: string;
    semanticDomain: string;
    sceneId: string;
    noImprovement: boolean;
    reviewOnly: true;
  };
}

export interface GenerateEng002Cp010V1Input {
  seed: string;
  difficulty: EnglishDifficulty;
  ruleId?: ModifierRuleId;
  sceneId?: string;
  noImprovement?: boolean;
}

const clean = (value: string) => value.replace(/\s+/g, " ").trim();
const sentenceFromSegments = (segments: readonly string[]) => segments.join(" ").replace(/\s+([,.!?;:])/g, "$1").replace(/\s+/g, " ").trim();
function unique(values: readonly string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const value = clean(raw);
    const key = value.toLowerCase();
    if (value && !seen.has(key)) { seen.add(key); out.push(value); }
  }
  return out;
}
interface Focus { prefix: string; correctTarget: string; wrongTarget: string; suffix: string }

function focusedDifference(correctSegment: string, wrongSegment: string): Focus {
  const correct = clean(correctSegment).split(" ");
  const wrong = clean(wrongSegment).split(" ");
  let prefixCount = 0;
  while (prefixCount < correct.length && prefixCount < wrong.length && correct[prefixCount]!.toLowerCase() === wrong[prefixCount]!.toLowerCase()) prefixCount += 1;
  let suffixCount = 0;
  while (suffixCount < correct.length - prefixCount && suffixCount < wrong.length - prefixCount && correct[correct.length - 1 - suffixCount]!.toLowerCase() === wrong[wrong.length - 1 - suffixCount]!.toLowerCase()) suffixCount += 1;
  let correctMid = correct.slice(prefixCount, correct.length - suffixCount);
  let wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount);
  if (!correctMid.length || !wrongMid.length) {
    if (suffixCount > 0) { suffixCount -= 1; correctMid = correct.slice(prefixCount, correct.length - suffixCount); wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount); }
    else if (prefixCount > 0) { prefixCount -= 1; correctMid = correct.slice(prefixCount, correct.length - suffixCount); wrongMid = wrong.slice(prefixCount, wrong.length - suffixCount); }
  }
  const prefix = correct.slice(0, prefixCount).join(" ");
  let suffix = suffixCount ? correct.slice(correct.length - suffixCount).join(" ") : "";
  let correctTarget = correctMid.join(" ");
  let wrongTarget = wrongMid.join(" ");
  const cp = correctTarget.match(/([,.;:!?]+)$/)?.[1] ?? "";
  const wp = wrongTarget.match(/([,.;:!?]+)$/)?.[1] ?? "";
  if (cp && cp === wp) {
    correctTarget = correctTarget.slice(0, -cp.length);
    wrongTarget = wrongTarget.slice(0, -wp.length);
    suffix = suffix ? `${cp} ${suffix}` : cp;
  }
  if (!correctTarget || !wrongTarget || correctTarget.toLowerCase() === wrongTarget.toLowerCase()) throw new Error(`CP010 could not isolate target: ${correctSegment} <> ${wrongSegment}`);
  return { prefix, correctTarget, wrongTarget, suffix };
}
function wholeSegmentFocus(correctSegment: string, wrongSegment: string): Focus {
  const punctuation = correctSegment.match(/([,.;:!?]+)$/)?.[1] ?? "";
  return {
    prefix: "",
    correctTarget: clean(correctSegment).replace(/[,.;:!?]+$/, ""),
    wrongTarget: clean(wrongSegment).replace(/[,.;:!?]+$/, ""),
    suffix: punctuation,
  };
}
function targetForRule(ruleId: ModifierRuleId, correctSegment: string, wrongSegment: string): Focus {
  return ["GR-MOD-001", "GR-MOD-002", "GR-MOD-003", "GR-MOD-004", "GR-MOD-006", "GR-MOD-007", "GR-MOD-008", "GR-MOD-010"].includes(ruleId)
    ? wholeSegmentFocus(correctSegment, wrongSegment)
    : focusedDifference(correctSegment, wrongSegment);
}
function focusedSegments(base: readonly string[], sourceIndex: number, focus: Focus, targetText: string) {
  const out: string[] = [];
  let targetIndex = -1;
  base.forEach((segment, index) => {
    if (index !== sourceIndex) out.push(segment);
    else {
      if (focus.prefix) out.push(focus.prefix);
      targetIndex = out.length;
      out.push(targetText);
      if (focus.suffix) out.push(focus.suffix);
    }
  });
  if (targetIndex < 0) throw new Error("CP010 lost target index");
  return { segments: out, targetIndex };
}

function preserveCase(reference: string, replacement: string) {
  return /^[A-Z]/.test(reference) ? replacement.replace(/^./, (c) => c.toUpperCase()) : replacement;
}
function replaceWord(text: string, word: string, replacement: string) {
  return text.replace(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i"), (match) => preserveCase(match, replacement));
}
function lowerSentenceLead(text: string) {
  return text
    .replace(/^The\b/, "the")
    .replace(/^Several\b/, "several")
    .replace(/^A\b/, "a")
    .replace(/^An\b/, "an")
    .replace(/^Some\b/, "some");
}
function moveToken(text: string, token: string, where: "start" | "end") {
  const pattern = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
  const match = text.match(pattern)?.[0];
  if (!match) return text;
  const bare = clean(text.replace(pattern, "")).replace(/\s+([,.!?;:])/g, "$1");
  if (where === "start") return `${match.replace(/^./, (c) => c.toUpperCase())} ${lowerSentenceLead(bare)}`;
  const punctuation = bare.match(/([,.!?;:]+)$/)?.[1] ?? "";
  const body = punctuation ? bare.slice(0, -punctuation.length).trim() : bare;
  return `${body} ${match}${punctuation}`;
}
function moveTokenBeforePerfectAuxiliary(text: string, token: string) {
  const tokenPattern = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
  const match = text.match(tokenPattern)?.[0];
  if (!match) return text;
  const bare = clean(text.replace(tokenPattern, "")).replace(/\s+([,.!?;:])/g, "$1");
  return bare.replace(/\b(had|has|have)\b/i, `${match.toLowerCase()} $1`);
}
function moveWordVariants(text: string, word: string) {
  const tokens = clean(text).split(" ");
  const index = tokens.findIndex((token) => token.replace(/[^A-Za-z]/g, "").toLowerCase() === word.toLowerCase());
  if (index < 0) return [];
  const token = tokens[index]!;
  const rest = tokens.filter((_, i) => i !== index);
  const placements = [0, 1, 2, Math.max(0, rest.length - 1), rest.length];
  return placements.map((at) => {
    const copy = [...rest];
    copy.splice(Math.min(at, copy.length), 0, token);
    return copy.join(" ");
  });
}
function modifierToken(ruleId: ModifierRuleId, correct: string, wrong: string) {
  const combined = `${correct} ${wrong}`;
  const patterns: Partial<Record<ModifierRuleId, RegExp>> = {
    "GR-MOD-005": /\bonly\b/i,
    "GR-MOD-006": /\b(almost|nearly)\b/i,
    "GR-MOD-007": /\beven\b/i,
    "GR-MOD-008": /\b(always|usually|often|frequently|sometimes|rarely|seldom|never|normally|generally)\b/i,
  };
  const match = patterns[ruleId]?.exec(combined);
  if (match) return match[1] ?? match[0];
  if (ruleId === "GR-MOD-009") {
    const adverb = correct.match(/\b([A-Za-z]+ly)\b/g)?.at(-1) ?? wrong.match(/\b([A-Za-z]+ly)\b/g)?.at(-1);
    return adverb?.replace(/[^A-Za-z]/g, "");
  }
  return undefined;
}
function adjectiveFromAdverb(word: string) {
  const special: Readonly<Record<string, string>> = {
    carefully: "careful", clearly: "clear", quietly: "quiet", slowly: "slow", quickly: "quick", neatly: "neat",
    accurately: "accurate", politely: "polite", correctly: "correct", closely: "close", thoroughly: "thorough",
  };
  return special[word.toLowerCase()] ?? (word.toLowerCase().endsWith("ly") ? word.slice(0, -2) : word);
}
function wrongAttachmentTenseVariants(text: string) {
  const variants: string[] = [];
  const comma = text.indexOf(",");
  const prefix = comma >= 0 ? text.slice(0, comma + 1) : "";
  const clause = comma >= 0 ? text.slice(comma + 1).trim() : text;
  const rebuild = (next: string) => prefix ? `${prefix} ${next}` : next;
  if (/\bbegan being ([A-Za-z]+) by\b/i.test(clause)) {
    variants.push(rebuild(clause.replace(/\bbegan being ([A-Za-z]+) by\b/i, "were being $1 by")));
    variants.push(rebuild(clause.replace(/\bbegan being ([A-Za-z]+) by\b/i, "had begun to be $1 by")));
    return variants;
  }
  if (/\b(was|were)\s+([A-Za-z]+)\b/i.test(clause)) {
    variants.push(rebuild(clause.replace(/\b(?:was|were)\s+([A-Za-z]+)\b/i, "had been $1")));
    variants.push(rebuild(clause.replace(/\b(was|were)\s+([A-Za-z]+)\b/i, "$1 being $2")));
  }
  if (/\b(is|are)\s+([A-Za-z]+)\b/i.test(clause)) {
    variants.push(rebuild(clause.replace(/\b(?:is|are)\s+([A-Za-z]+)\b/i, "has been $1")));
    variants.push(rebuild(clause.replace(/\b(is|are)\s+([A-Za-z]+)\b/i, "$1 being $2")));
  }
  if (!variants.length && /\b([A-Za-z]+ed)\b/i.test(clause)) {
    variants.push(rebuild(clause.replace(/\b([A-Za-z]+ed)\b/i, "had $1")));
    variants.push(rebuild(clause.replace(/\b([A-Za-z]+ed)\b/i, "still $1")));
  }
  if (variants.length < 2) {
    const finite = /\b(looks?|seems?|appears?|welcomes?|contains?|carries|holds?|shows?|includes?|remains?|stands?|sits?|lies|finds?|changes?|checks?|returns?|opens?|discusses?|answers?|places?|explains?|leaves?)\b/i;
    if (finite.test(clause)) {
      variants.push(rebuild(clause.replace(finite, "still $1")));
      variants.push(rebuild(clause.replace(finite, "also $1")));
    }
  }
  return variants;
}
function attachmentVariants(ruleId: ModifierRuleId, correct: string, wrong: string) {
  const variants = [wrong];
  if (["GR-MOD-001", "GR-MOD-002", "GR-MOD-003"].includes(ruleId)) {
    variants.push(...wrongAttachmentTenseVariants(wrong));
  } else if (ruleId === "GR-MOD-004") {
    const relative = wrong.match(/\b(that|which|who|whose)\b/i)?.[1]?.toLowerCase();
    if (relative) {
      const alternatives = relative === "that" ? ["which", "who"] : relative === "which" ? ["that", "who"] : relative === "who" ? ["that", "which"] : ["that", "which"];
      alternatives.forEach((value) => variants.push(replaceWord(wrong, relative, value)));
    } else variants.push(...wrongAttachmentTenseVariants(wrong));
  } else if (ruleId === "GR-MOD-010") {
    if (/\bwith\b/i.test(wrong)) {
      variants.push(wrong.replace(/\bwith\b/i, "which had"));
      variants.push(wrong.replace(/\bwith\b/i, "that had"));
    } else {
      const active = wrong.match(/\b(carrying|containing|wearing|holding|showing)\b/i)?.[1];
      if (active) {
        const finite: Readonly<Record<string, string>> = {
          carrying: "carried", containing: "contained", wearing: "wore", holding: "held", showing: "showed",
        };
        const verb = finite[active.toLowerCase()]!;
        variants.push(wrong.replace(new RegExp(`\\b${active}\\b`, "i"), `which ${verb}`));
        variants.push(wrong.replace(new RegExp(`\\b${active}\\b`, "i"), `that ${verb}`));
      } else {
        const passive = wrong.match(/\b(marked|labelled|sealed|damaged)\b/i)?.[1];
        if (passive) {
          variants.push(wrong.replace(new RegExp(`\\b${passive}\\b`, "i"), `which was ${passive}`));
          variants.push(wrong.replace(new RegExp(`\\b${passive}\\b`, "i"), `that was ${passive}`));
        } else variants.push(...wrongAttachmentTenseVariants(wrong));
      }
    }
  }
  return variants;
}
function frequencyAlternatives(token: string) {
  const map: Readonly<Record<string, readonly string[]>> = {
    always: ["usually", "often"], usually: ["often", "generally"], often: ["usually", "frequently"], frequently: ["often", "usually"],
    sometimes: ["occasionally", "often"], rarely: ["seldom", "hardly ever"], seldom: ["rarely", "hardly ever"], never: ["rarely", "seldom"],
    normally: ["usually", "generally"], generally: ["usually", "normally"],
  };
  return map[token.toLowerCase()] ?? ["usually", "often"];
}
function placementVariants(ruleId: ModifierRuleId, correct: string, wrong: string) {
  const variants = [wrong];
  const token = modifierToken(ruleId, correct, wrong);
  if (ruleId === "GR-MOD-005" && token) {
    variants.push(...moveWordVariants(correct, token));
  } else if (ruleId === "GR-MOD-006" && token) {
    const synonym = token.toLowerCase() === "almost" ? "nearly" : "almost";
    variants.push(replaceWord(wrong, token, synonym), moveToken(wrong, token, "end"), moveToken(wrong, token, "start"));
  } else if (ruleId === "GR-MOD-007" && token) {
    variants.push(moveToken(wrong, token, "end"), moveTokenBeforePerfectAuxiliary(wrong, token));
  } else if (ruleId === "GR-MOD-008" && token) {
    for (const alternative of frequencyAlternatives(token)) variants.push(replaceWord(wrong, token, alternative));
    variants.push(moveToken(wrong, token, "end"));
  } else if (ruleId === "GR-MOD-009" && token) {
    const escaped = token.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
    const match = correct.match(new RegExp(`^(.*?)\\s+${escaped}$`, "i"));
    if (match) {
      const object = clean(match[1]!);
      const adjective = adjectiveFromAdverb(token);
      variants.push(`${adjective} ${object}`, `${object} ${adjective}`);
    } else {
      variants.push(...moveWordVariants(correct, token));
      variants.push(correct.replace(new RegExp(`\\b${escaped}\\b`, "i"), adjectiveFromAdverb(token)));
    }
  }
  return variants;
}
function incorrectVariants(ruleId: ModifierRuleId, correctTarget: string, wrongTarget: string) {
  const correct = clean(correctTarget);
  const wrong = clean(wrongTarget);
  const raw = ["GR-MOD-001", "GR-MOD-002", "GR-MOD-003", "GR-MOD-004", "GR-MOD-010"].includes(ruleId)
    ? attachmentVariants(ruleId, correct, wrong)
    : placementVariants(ruleId, correct, wrong);
  const variants = unique(raw).filter((value) => value.toLowerCase() !== correct.toLowerCase());
  if (variants.length < 3) throw new Error(`${ruleId} has only ${variants.length} natural distractors for ${correct}`);
  return variants;
}
function replacementChoices(ruleId: ModifierRuleId, correctTarget: string, wrongTarget: string, targetText: string, noImprovement: boolean) {
  const wrongs = incorrectVariants(ruleId, correctTarget, wrongTarget).filter((value) => value.toLowerCase() !== targetText.toLowerCase() && value.toLowerCase() !== correctTarget.toLowerCase());
  const values = noImprovement ? wrongs.slice(0, 3) : unique([correctTarget, ...wrongs]).slice(0, 3);
  if (values.length !== 3) throw new Error(`${ruleId} could not build three natural choices for ${correctTarget}`);
  return values;
}
function shuffleThree(seed: string, values: readonly string[]) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = deterministicIndex(`${seed}:shuffle:${i}`, i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
function concept(ruleId: ModifierRuleId) {
  return MODIFIER_RULE_BY_ID[ruleId].principle.replace(/^./, (c) => c.toUpperCase());
}
function tag(candidate: ReturnType<typeof buildEng001Cp010CandidateV1>, prefix: string) {
  const value = candidate.tags.find((entry) => entry.startsWith(prefix))?.slice(prefix.length);
  if (!value) throw new Error(`${candidate.candidateId} lacks ${prefix}`);
  return value;
}
function lowerLeading(text: string) { return text.replace(/^([A-Z])/, (m) => m.toLowerCase()); }

export function generateEng002Cp010QuestionV1(input: GenerateEng002Cp010V1Input): Eng002Cp010QuestionV1 {
  const candidate = buildEng001Cp010CandidateV1({ seed: input.seed, difficulty: input.difficulty, ruleId: input.ruleId, sceneId: input.sceneId });
  const correctSegments = [...candidate.correctSegments];
  const errorSegments = [...candidate.errorSegments];
  const ruleId = candidate.ruleId;
  const sourceIndex = candidate.errorIndex;
  const focus = targetForRule(ruleId, correctSegments[sourceIndex]!, errorSegments[sourceIndex]!);
  const requestedNoImprovement = input.noImprovement ?? deterministicBoolean(`${input.seed}:eng002:cp010:no-improvement`, 0.25);
  const noImprovement = ruleId === "GR-MOD-007" ? false : requestedNoImprovement;
  const targetText = noImprovement ? focus.correctTarget : focus.wrongTarget;
  const visible = focusedSegments(noImprovement ? correctSegments : errorSegments, sourceIndex, focus, targetText);
  const shuffled = shuffleThree(`${input.seed}:eng002:cp010:options`, replacementChoices(ruleId, focus.correctTarget, focus.wrongTarget, targetText, noImprovement));
  const options = [...shuffled, "No improvement"];
  const correctOptionIndex = noImprovement ? 3 : shuffled.indexOf(focus.correctTarget);
  if (correctOptionIndex < 0) throw new Error(`${candidate.candidateId} lost correct replacement`);
  const sentence = sentenceFromSegments(visible.segments);
  const correctedSentence = sentenceFromSegments(correctSegments);
  const application = lowerLeading(candidate.explanationApplication);
  const explanation = noImprovement
    ? `No improvement is needed: “${focus.correctTarget}” is already correctly placed. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`
    : `Error: the modifier is misplaced in “${focus.wrongTarget}”. Use “${focus.correctTarget}”. Concept: ${concept(ruleId)} Here: ${application} Correct sentence: ${correctedSentence}`;
  return {
    questionId: `ENG-002-CP010-V1:${ruleId}:${candidate.candidateId}:${input.seed}:${noImprovement ? "NI" : "IMP"}`,
    stem: ENG002_CP010_STEM,
    sentence,
    segments: visible.segments,
    targetIndex: visible.targetIndex,
    targetText,
    options,
    correctOptionIndex,
    correctedSentence,
    explanation,
    metadata: {
      track: "english", chapterId: "ENG-002", cpId: "ENG-002-CP010", ruleId, mutationId: candidate.mutationId,
      difficulty: candidate.difficulty, dimensions: candidate.dimensions, seed: input.seed, candidateId: candidate.candidateId,
      semanticDomain: tag(candidate, "domain:"), sceneId: tag(candidate, "scene:"), noImprovement, reviewOnly: true,
    },
  };
}
