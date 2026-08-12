import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004ActorKind } from "./types";

const FEMININE_ACTORS = new Set<TsdCp004ActorKind>(["CAR", "BUS", "DELIVERY_VAN"]);

function polishHindiFeminine(stem: string, actorKind: TsdCp004ActorKind): string {
  if (!FEMININE_ACTORS.has(actorKind)) return stem;
  let text = stem;

  if (actorKind === "CAR") {
    text = text.replace(/दो कार की/gu, "दो कारों की").replace(/दो कार\b/gu, "दो कारें").replace(/दूसरा कार\b/gu, "दूसरी कार");
  } else if (actorKind === "BUS") {
    text = text.replace(/दो बस की/gu, "दो बसों की").replace(/दो बस\b/gu, "दो बसें").replace(/दूसरा बस\b/gu, "दूसरी बस");
  } else {
    text = text.replace(/दो डिलीवरी वैन की/gu, "दो डिलीवरी वैनों की").replace(/दूसरा डिलीवरी वैन\b/gu, "दूसरी डिलीवरी वैन");
  }

  return text
    .replace(/चलता रहता है/gu, "चलती रहती है")
    .replace(/चलते रहते हैं/gu, "चलती रहती हैं")
    .replace(/चलता है/gu, "चलती है")
    .replace(/चलते हैं/gu, "चलती हैं")
    .replace(/आता है/gu, "आती है")
    .replace(/आते हैं/gu, "आती हैं")
    .replace(/निकलता है/gu, "निकलती है")
    .replace(/निकलते हैं/gu, "निकलती हैं")
    .replace(/पकड़ता है/gu, "पकड़ती है")
    .replace(/पकड़ते हैं/gu, "पकड़ती हैं")
    .replace(/करता है/gu, "करती है")
    .replace(/करते हैं/gu, "करती हैं")
    .replace(/मिलता है/gu, "मिलती है")
    .replace(/मिलते हैं/gu, "मिलती हैं")
    .replace(/पहले की गति/gu, "पहली की गति")
    .replace(/दूसरे की गति/gu, "दूसरी की गति");
}

function polishPunjabiFeminine(stem: string, actorKind: TsdCp004ActorKind): string {
  if (!FEMININE_ACTORS.has(actorKind)) return stem;
  let text = stem;

  if (actorKind === "CAR") {
    text = text.replace(/ਦੋ ਕਾਰ ਦੀ/gu, "ਦੋ ਕਾਰਾਂ ਦੀ").replace(/ਦੋ ਕਾਰ\b/gu, "ਦੋ ਕਾਰਾਂ").replace(/ਦੂਜਾ ਕਾਰ\b/gu, "ਦੂਜੀ ਕਾਰ");
  } else if (actorKind === "BUS") {
    text = text.replace(/ਦੋ ਬੱਸ ਦੀ/gu, "ਦੋ ਬੱਸਾਂ ਦੀ").replace(/ਦੋ ਬੱਸ\b/gu, "ਦੋ ਬੱਸਾਂ").replace(/ਦੂਜਾ ਬੱਸ\b/gu, "ਦੂਜੀ ਬੱਸ");
  } else {
    text = text.replace(/ਦੋ ਡਿਲਿਵਰੀ ਵੈਨ ਦੀ/gu, "ਦੋ ਡਿਲਿਵਰੀ ਵੈਨਾਂ ਦੀ").replace(/ਦੋ ਡਿਲਿਵਰੀ ਵੈਨ\b/gu, "ਦੋ ਡਿਲਿਵਰੀ ਵੈਨਾਂ").replace(/ਦੂਜਾ ਡਿਲਿਵਰੀ ਵੈਨ\b/gu, "ਦੂਜੀ ਡਿਲਿਵਰੀ ਵੈਨ");
  }

  return text
    .replace(/ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ/gu, "ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ")
    .replace(/ਚੱਲਦੇ ਰਹਿੰਦੇ ਹਨ/gu, "ਚੱਲਦੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ")
    .replace(/ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੀ ਹੈ")
    .replace(/ਚੱਲਦੇ ਹਨ/gu, "ਚੱਲਦੀਆਂ ਹਨ")
    .replace(/ਆਉਂਦਾ ਹੈ/gu, "ਆਉਂਦੀ ਹੈ")
    .replace(/ਆਉਂਦੇ ਹਨ/gu, "ਆਉਂਦੀਆਂ ਹਨ")
    .replace(/ਨਿਕਲਦਾ ਹੈ/gu, "ਨਿਕਲਦੀ ਹੈ")
    .replace(/ਨਿਕਲਦੇ ਹਨ/gu, "ਨਿਕਲਦੀਆਂ ਹਨ")
    .replace(/ਫੜਦਾ ਹੈ/gu, "ਫੜਦੀ ਹੈ")
    .replace(/ਫੜਦੇ ਹਨ/gu, "ਫੜਦੀਆਂ ਹਨ")
    .replace(/ਕਰਦਾ ਹੈ/gu, "ਕਰਦੀ ਹੈ")
    .replace(/ਕਰਦੇ ਹਨ/gu, "ਕਰਦੀਆਂ ਹਨ")
    .replace(/ਮਿਲਦਾ ਹੈ/gu, "ਮਿਲਦੀ ਹੈ")
    .replace(/ਮਿਲਦੇ ਹਨ/gu, "ਮਿਲਦੀਆਂ ਹਨ")
    .replace(/ਪਹਿਲੇ ਦੀ ਰਫ਼ਤਾਰ/gu, "ਪਹਿਲੀ ਦੀ ਰਫ਼ਤਾਰ")
    .replace(/ਦੂਜੇ ਦੀ ਰਫ਼ਤਾਰ/gu, "ਦੂਜੀ ਦੀ ਰਫ਼ਤਾਰ");
}

export function polishCp004NativeGrammarStem(stem: string, language: TsdCp004NativeLanguage, actorKind: TsdCp004ActorKind): string {
  return language === "hi" ? polishHindiFeminine(stem, actorKind) : polishPunjabiFeminine(stem, actorKind);
}

export function cp004UsesFeminineNativeActor(actorKind: TsdCp004ActorKind): boolean {
  return FEMININE_ACTORS.has(actorKind);
}
