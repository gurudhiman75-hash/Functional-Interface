import type { LanguageRenderer } from "../contracts/language-contracts";
import type { EditorialIntent } from "../intents/editorial-intents";

export const englishRenderer: LanguageRenderer = {
  language: "en",
  renderIntent(intent: EditorialIntent) {
    return intent.fallbackText;
  },
};

