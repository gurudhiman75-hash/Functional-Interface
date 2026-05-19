import type { RealizerLanguage } from "../../canonical/percentage-types";
import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";
import type {
  EditorialIntent,
  EditorialIntentKey,
} from "../intents/editorial-intents";

export type LanguageCode = RealizerLanguage;

export interface LocalizationContext {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
  intent: EditorialIntent;
}

export interface LanguageRenderer {
  language: LanguageCode;
  renderIntent(
    intent: EditorialIntent,
    context: LocalizationContext,
  ): string;
}

export interface LocalizedLine {
  intentKey: EditorialIntentKey;
  sourceText: string;
  renderedText: string;
  kind: EditorialIntent["kind"];
  fallbackUsed: boolean;
}

export interface LocalizedRealization {
  language: LanguageCode;
  stem: string;
  explanation: string;
  lines: LocalizedLine[];
  coverage: {
    totalIntentLines: number;
    localizedIntentLines: number;
    fallbackCount: number;
    missingIntents: EditorialIntentKey[];
  };
}

