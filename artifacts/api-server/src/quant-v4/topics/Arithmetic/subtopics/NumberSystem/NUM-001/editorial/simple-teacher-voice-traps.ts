// @ts-nocheck
import { cleanText, correctIndex, optionValues, simpleDiagnostic, studentOptionDisplay } from "./simple-teacher-voice-core";
import { cp003TrapMessage } from "./simple-teacher-voice-traps-cp003";
import { cp004TrapMessage } from "./simple-teacher-voice-traps-cp004";

export function buildTraps(row) {
  const values = optionValues(row);
  const correct = correctIndex(row);
  return values.flatMap((value, index) => {
    if (index === correct) return [];
    let tag = "WRONG_OPTION";
    let diagnostic = "";
    if (row.checkpoint === "NUM-CP-003") {
      const audit = row.question.optionAudit?.find((item) => String(item.text) === String(value));
      tag = audit?.misconceptionId ?? tag;
      diagnostic = audit?.diagnostic ?? "";
    } else {
      tag = row.question.options[index]?.misconceptionId ?? tag;
      const rawTrap = row.question.explanation?.commonTraps?.find((item) =>
        cleanText(item).startsWith(`${cleanText(value)}:`));
      diagnostic = rawTrap ? cleanText(rawTrap).replace(/^.*?:\s*/u, "").replace(/\s*\[[A-Z0-9_]+\]\s*$/u, "") : "";
    }
    const computed = row.checkpoint === "NUM-CP-003"
      ? cp003TrapMessage(row, value, tag)
      : cp004TrapMessage(row, value, tag);
    const message = computed || simpleDiagnostic(diagnostic) || "Recheck this option using the calculation shown above.";
    return [{
      optionLabel: String.fromCharCode(65 + index),
      optionValue: studentOptionDisplay(value),
      message: cleanText(message),
      misconceptionTag: tag,
    }];
  });
}
