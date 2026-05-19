import type {
  LanguageCode,
  LanguageRenderer,
} from "../contracts/language-contracts";
import { englishRenderer } from "./en";
import { hindiRenderer } from "./hi";
import { punjabiRenderer } from "./pa";

const RENDERERS: Record<LanguageCode, LanguageRenderer> = {
  en: englishRenderer,
  hi: hindiRenderer,
  pa: punjabiRenderer,
};

export function getLanguageRenderer(
  language: LanguageCode,
): LanguageRenderer {
  return RENDERERS[language];
}

