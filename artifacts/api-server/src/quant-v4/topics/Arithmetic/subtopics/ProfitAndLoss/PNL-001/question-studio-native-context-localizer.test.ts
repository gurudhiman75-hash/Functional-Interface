import { recoverAllPnl001CanonicalContextsV2 } from "./question-studio-canonical-context-v2";
import {
  isPnl001SymbolicContextText,
  localizePnl001CanonicalContextText,
} from "./question-studio-native-context-localizer";

type Owner = Readonly<{ qlId: string; path: string }>;
const values = new Map<string, Owner[]>();

function collect(value: unknown, qlId: string, path: string): void {
  if (typeof value === "string") {
    if (!/[A-Za-z]/u.test(value)) return;
    const owners = values.get(value) ?? [];
    owners.push({ qlId, path });
    values.set(value, owners);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collect(item, qlId, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      collect(item, qlId, path ? `${path}.${key}` : key);
    }
  }
}

for (const recovery of recoverAllPnl001CanonicalContextsV2()) {
  collect(recovery.context, recovery.qlId, "context");
}

const failures: Array<{
  value: string;
  owners: readonly Owner[];
  language: "hi" | "pa";
  message: string;
}> = [];
let symbolicValues = 0;
let localizedValues = 0;

for (const [value, owners] of [...values.entries()].sort(([left], [right]) =>
  left.localeCompare(right),
)) {
  if (isPnl001SymbolicContextText(value)) {
    symbolicValues += 1;
    continue;
  }
  for (const language of ["hi", "pa"] as const) {
    try {
      const localized = localizePnl001CanonicalContextText(value, language);
      const script = language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
      if (!script.test(localized)) {
        throw new Error("localized context value does not contain the requested native script");
      }
      localizedValues += 1;
    } catch (error) {
      failures.push({
        value,
        owners: [...owners].sort((left, right) =>
          `${left.qlId}:${left.path}`.localeCompare(`${right.qlId}:${right.path}`),
        ),
        language,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

const summary = {
  ok: failures.length === 0,
  distinctContextTextValues: values.size,
  symbolicValues,
  translatableValues: values.size - symbolicValues,
  expectedLocalizedValues: (values.size - symbolicValues) * 2,
  localizedValues,
  failureCount: failures.length,
  failures,
};
console.log(JSON.stringify(summary, null, 2));
if (!summary.ok) process.exitCode = 1;
