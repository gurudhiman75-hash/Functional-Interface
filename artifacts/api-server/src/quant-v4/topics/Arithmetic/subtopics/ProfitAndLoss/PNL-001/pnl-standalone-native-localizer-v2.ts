import type { Pnl001NativeDynamicLanguage } from "./pnl-standalone-multilingual-dynamic-types";
import {
  localizePnl001StandaloneChoice as localizeBaseChoice,
  localizePnl001StandaloneContext as localizeBaseContext,
} from "./pnl-standalone-native-localizer";

export function localizePnl001StandaloneChoice(
  value: string,
  language: Pnl001NativeDynamicLanguage,
): string {
  if (value === "None of these") {
    return language === "hi" ? "इनमें से कोई नहीं" : "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
  }
  return localizeBaseChoice(value, language);
}

export function localizePnl001StandaloneContext(
  value: unknown,
  language: Pnl001NativeDynamicLanguage,
): unknown {
  return localizeBaseContext(value, language);
}
