import type { StaticGkFactLockPack } from "./fact-packs/types";

export interface StaticGkFactPackValidationResult {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateStaticGkFactLockPack(pack: StaticGkFactLockPack): StaticGkFactPackValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sourceIds = new Set(pack.sourceRefs.map((source) => source.id));
  const factIds = new Set(pack.facts.map((fact) => fact.id));
  const targetIds = new Set(pack.geoTargets.map((target) => target.id));

  if (sourceIds.size !== pack.sourceRefs.length) errors.push(`${pack.visualId}: duplicate source IDs`);
  if (factIds.size !== pack.facts.length) errors.push(`${pack.visualId}: duplicate fact IDs`);
  if (targetIds.size !== pack.geoTargets.length) errors.push(`${pack.visualId}: duplicate geo target IDs`);

  for (const fact of pack.facts) {
    if (!fact.statement.trim()) errors.push(`${pack.visualId}/${fact.id}: fact statement is empty`);
    if (fact.sourceIds.length === 0) errors.push(`${pack.visualId}/${fact.id}: fact has no source`);
    for (const sourceId of fact.sourceIds) {
      if (!sourceIds.has(sourceId)) errors.push(`${pack.visualId}/${fact.id}: unknown source ${sourceId}`);
    }
    if (fact.stability === "time-sensitive") {
      warnings.push(`${pack.visualId}/${fact.id}: time-sensitive fact requires date-stamped publishing policy`);
    }
  }

  for (const beat of pack.narration) {
    if (!beat.text.trim()) errors.push(`${pack.visualId}/${beat.id}: narration text is empty`);
    if (beat.factIds.length === 0) errors.push(`${pack.visualId}/${beat.id}: narration has no supporting fact IDs`);
    for (const factId of beat.factIds) {
      if (!factIds.has(factId)) errors.push(`${pack.visualId}/${beat.id}: unknown fact ${factId}`);
    }
    for (const targetId of beat.targetIds) {
      if (!targetIds.has(targetId)) errors.push(`${pack.visualId}/${beat.id}: unknown target ${targetId}`);
    }
  }

  if (pack.quiz.options.length < 2) errors.push(`${pack.visualId}/${pack.quiz.id}: quiz needs at least two options`);
  if (pack.quiz.correctOptionIndex < 0 || pack.quiz.correctOptionIndex >= pack.quiz.options.length) {
    errors.push(`${pack.visualId}/${pack.quiz.id}: correctOptionIndex is out of range`);
  }
  if (pack.quiz.factIds.length === 0) errors.push(`${pack.visualId}/${pack.quiz.id}: quiz has no supporting fact IDs`);
  for (const factId of pack.quiz.factIds) {
    if (!factIds.has(factId)) errors.push(`${pack.visualId}/${pack.quiz.id}: unknown quiz fact ${factId}`);
  }

  if (pack.status !== "draft" && pack.sourceRefs.length === 0) {
    errors.push(`${pack.visualId}: non-draft pack cannot be source-locked without sources`);
  }

  for (const target of pack.geoTargets) {
    if (!target.geometryRef && target.latitude == null && target.longitude == null) {
      warnings.push(`${pack.visualId}/${target.id}: target has no geometry reference or coordinates`);
    }
    if ((target.latitude == null) !== (target.longitude == null)) {
      errors.push(`${pack.visualId}/${target.id}: latitude and longitude must be supplied together`);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}
