import { createHash } from "node:crypto";

import type { StaticGkAiShotPlan, CompiledStaticGkAiShotPrompt } from "./types";

const FORBIDDEN_FACT_TERMS = [
  "23½", "23.5", "23°", "82°", "82.5", "82°30", "+5:30", "gmt", "ist",
  "gujarat", "rajasthan", "madhya pradesh", "chhattisgarh", "jharkhand", "west bengal", "tripura", "mizoram",
  "mirzapur", "uttar pradesh",
] as const;

const PROMPT_GUARDRAILS = [
  "Generate only the cinematic visual plate; factual overlays will be added later by Examtree.",
  "Do not generate any readable text, letters, numbers, captions, labels, place names, flags, logos, watermarks, borders, route lines, latitude lines, longitude lines, pins, icons, UI cards or quiz elements.",
  "Do not invent political boundaries, geographic annotations, landmarks or exact routes.",
  "Preserve physically believable geography and natural-scale terrain without turning the scene into a fantasy map.",
  "Movement must remain smooth and premium with no rapid cuts, morphing coastlines, rubbery terrain, warped horizons or unstable camera motion.",
].join(" ");

export function assertAiPlatePromptDoesNotContainLockedFacts(promptText: string): void {
  const normalized = promptText.toLocaleLowerCase("en-IN");
  const matched = FORBIDDEN_FACT_TERMS.find((term) => normalized.includes(term.toLocaleLowerCase("en-IN")));
  if (matched) throw new Error(`AI visual-plate prompt leaked deterministic fact term '${matched}'`);
}

export function compileStaticGkAiShotPrompt(plan: StaticGkAiShotPlan): CompiledStaticGkAiShotPrompt {
  const promptText = [
    "Create one continuous portrait 9:16 cinematic shot for an Indian competitive-exam geography short.",
    `Purpose: ${plan.purpose}.`,
    `Subject: ${plan.subject}.`,
    `Environment: ${plan.environment}.`,
    `Camera: ${plan.camera}.`,
    `Lighting: ${plan.lighting}.`,
    `Composition: ${plan.composition}.`,
    `Continuity: ${plan.continuity}.`,
    PROMPT_GUARDRAILS,
  ].join(" ");
  assertAiPlatePromptDoesNotContainLockedFacts(promptText);
  return {
    visualId: plan.visualId,
    shotId: plan.shotId,
    order: plan.order,
    durationSeconds: plan.durationSeconds,
    promptText,
    promptSha256: createHash("sha256").update(promptText, "utf8").digest("hex"),
  };
}

export function compileStaticGkAiShotPrompts(plans: readonly StaticGkAiShotPlan[]): CompiledStaticGkAiShotPrompt[] {
  return plans.map(compileStaticGkAiShotPrompt);
}
