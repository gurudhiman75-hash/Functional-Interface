import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004ActorKind } from "./types";

const FEMININE_ACTORS = new Set<TsdCp004ActorKind>(["CAR", "BUS", "DELIVERY_VAN"]);
const END = "(?=\\s|[।,?]|$)";

function polishHindiFeminine(stem: string, actorKind: TsdCp004ActorKind): string {
  if (!FEMININE_ACTORS.has(actorKind)) return stem;
  let text = stem;

  if (actorKind === "CAR") {
    text = text
      .replace(/दो कार की/gu, "दो कारों की")
      .replace(new RegExp(`दो कार${END}`, "gu"), "दो कारें")
      .replace(new RegExp(`दूसरा कार${END}`, "gu"), "दूसरी कार");
  } else if (actorKind === "BUS") {
    text = text
      .replace(/दो बस की/gu, "दो बसों की")
      .replace(new RegExp(`दो बस${END}`, "gu"), "दो बसें")
      .replace(new RegExp(`दूसरा बस${END}`, "gu"), "दूसरी बस");
  } else {
    text = text
      .replace(/दो डिलीवरी वैन की/gu, "दो डिलीवरी वैनों की")
      .replace(new RegExp(`दूसरा डिलीवरी वैन${END}`, "gu"), "दूसरी डिलीवरी वैन");
  }

  return text
    .replace(/चल रहे एक (?=कार|बस|डिलीवरी वैन)/gu, "चल रही एक ")
    .replace(/चल रहे (?=कार|बस|डिलीवरी वैन)/gu, "चल रही ")
    .replace(/चलते हुए/gu, "चलते समय")
    .replace(/चलते दो (?=कारों|बसों|डिलीवरी वैनों)/gu, "चलती दो ")
    .replace(/चलता रहता है/gu, "चलती रहती है")
    .replace(/चलते रहते हैं/gu, "चलती रहती हैं")
    .replace(/चलता है/gu, "चलती है")
    .replace(/चलते हैं/gu, "चलती हैं")
    .replace(/चलते रहें/gu, "चलती रहें")
    .replace(/बढ़ रहे हैं/gu, "बढ़ रही हैं")
    .replace(/जाते हैं/gu, "जाती हैं")
    .replace(/आता है/gu, "आती है")
    .replace(/आते हैं/gu, "आती हैं")
    .replace(/निकलता है/gu, "निकलती है")
    .replace(/निकलते हैं/gu, "निकलती हैं")
    .replace(/पकड़ता है/gu, "पकड़ती है")
    .replace(/पकड़ते हैं/gu, "पकड़ती हैं")
    .replace(/पकड़ेगा/gu, "पकड़ेगी")
    .replace(/करता है/gu, "करती है")
    .replace(/करते हैं/gu, "करती हैं")
    .replace(/तय करेगा/gu, "तय करेगी")
    .replace(/मिलता है/gu, "मिलती है")
    .replace(/मिलते हैं/gu, "मिलती हैं")
    .replace(/मिलेंगे/gu, "मिलेंगी")
    .replace(/होंगे/gu, "होंगी")
    .replace(/पहले की गति/gu, "पहली की गति")
    .replace(/दूसरे की गति/gu, "दूसरी की गति")
    .replace(/दूसरे की (?=\d)/gu, "दूसरी की ")
    .replace(/दूसरे को/gu, "दूसरी को");
}

function polishPunjabiFeminine(stem: string, actorKind: TsdCp004ActorKind): string {
  if (!FEMININE_ACTORS.has(actorKind)) return stem;
  let text = stem;

  if (actorKind === "CAR") {
    text = text
      .replace(/ਦੋ ਕਾਰ ਦੀ/gu, "ਦੋ ਕਾਰਾਂ ਦੀ")
      .replace(new RegExp(`ਦੋ ਕਾਰ${END}`, "gu"), "ਦੋ ਕਾਰਾਂ")
      .replace(new RegExp(`ਦੂਜਾ ਕਾਰ${END}`, "gu"), "ਦੂਜੀ ਕਾਰ");
  } else if (actorKind === "BUS") {
    text = text
      .replace(/ਦੋ ਬੱਸ ਦੀ/gu, "ਦੋ ਬੱਸਾਂ ਦੀ")
      .replace(new RegExp(`ਦੋ ਬੱਸ${END}`, "gu"), "ਦੋ ਬੱਸਾਂ")
      .replace(new RegExp(`ਦੂਜਾ ਬੱਸ${END}`, "gu"), "ਦੂਜੀ ਬੱਸ");
  } else {
    text = text
      .replace(/ਦੋ ਡਿਲਿਵਰੀ ਵੈਨ ਦੀ/gu, "ਦੋ ਡਿਲਿਵਰੀ ਵੈਨਾਂ ਦੀ")
      .replace(new RegExp(`ਦੋ ਡਿਲਿਵਰੀ ਵੈਨ${END}`, "gu"), "ਦੋ ਡਿਲਿਵਰੀ ਵੈਨਾਂ")
      .replace(new RegExp(`ਦੂਜਾ ਡਿਲਿਵਰੀ ਵੈਨ${END}`, "gu"), "ਦੂਜੀ ਡਿਲਿਵਰੀ ਵੈਨ");
  }

  return text
    .replace(/ਚੱਲ ਰਹੇ ਇੱਕ (?=ਕਾਰ|ਬੱਸ|ਡਿਲਿਵਰੀ ਵੈਨ)/gu, "ਚੱਲ ਰਹੀ ਇੱਕ ")
    .replace(/ਚੱਲ ਰਹੇ (?=ਕਾਰ|ਬੱਸ|ਡਿਲਿਵਰੀ ਵੈਨ)/gu, "ਚੱਲ ਰਹੀ ")
    .replace(/ਚੱਲਦੇ ਦੋ (?=ਕਾਰਾਂ|ਬੱਸਾਂ|ਡਿਲਿਵਰੀ ਵੈਨਾਂ)/gu, "ਚੱਲਦੀਆਂ ਦੋ ")
    .replace(/ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ/gu, "ਚੱਲਦੀ ਰਹਿੰਦੀ ਹੈ")
    .replace(/ਚੱਲਦੇ ਰਹਿੰਦੇ ਹਨ/gu, "ਚੱਲਦੀਆਂ ਰਹਿੰਦੀਆਂ ਹਨ")
    .replace(/ਚੱਲਦਾ ਹੈ/gu, "ਚੱਲਦੀ ਹੈ")
    .replace(/ਚੱਲਦੇ ਹਨ/gu, "ਚੱਲਦੀਆਂ ਹਨ")
    .replace(/ਚੱਲਦੇ ਰਹਿਣ/gu, "ਚੱਲਦੀਆਂ ਰਹਿਣ")
    .replace(/ਚੱਲ ਰਹੇ ਹਨ/gu, "ਚੱਲ ਰਹੀਆਂ ਹਨ")
    .replace(/ਆ ਰਹੇ ਹਨ/gu, "ਆ ਰਹੀਆਂ ਹਨ")
    .replace(/ਜਾਂਦੇ ਹਨ/gu, "ਜਾਂਦੀਆਂ ਹਨ")
    .replace(/ਆਉਂਦਾ ਹੈ/gu, "ਆਉਂਦੀ ਹੈ")
    .replace(/ਆਉਂਦੇ ਹਨ/gu, "ਆਉਂਦੀਆਂ ਹਨ")
    .replace(/ਨਿਕਲਦਾ ਹੈ/gu, "ਨਿਕਲਦੀ ਹੈ")
    .replace(/ਨਿਕਲਦੇ ਹਨ/gu, "ਨਿਕਲਦੀਆਂ ਹਨ")
    .replace(/ਫੜਦਾ ਹੈ/gu, "ਫੜਦੀ ਹੈ")
    .replace(/ਫੜਦੇ ਹਨ/gu, "ਫੜਦੀਆਂ ਹਨ")
    .replace(/ਫੜੇਗਾ/gu, "ਫੜੇਗੀ")
    .replace(/ਕਰਦਾ ਹੈ/gu, "ਕਰਦੀ ਹੈ")
    .replace(/ਕਰਦੇ ਹਨ/gu, "ਕਰਦੀਆਂ ਹਨ")
    .replace(/ਤੈਅ ਕਰੇਗਾ/gu, "ਤੈਅ ਕਰੇਗੀ")
    .replace(/ਮਿਲਦਾ ਹੈ/gu, "ਮਿਲਦੀ ਹੈ")
    .replace(/ਮਿਲਦੇ ਹਨ/gu, "ਮਿਲਦੀਆਂ ਹਨ")
    .replace(/ਮਿਲਣਗੇ/gu, "ਮਿਲਣਗੀਆਂ")
    .replace(/ਹੋਣਗੇ/gu, "ਹੋਣਗੀਆਂ")
    .replace(/ਪਹਿਲੇ ਦੀ ਰਫ਼ਤਾਰ/gu, "ਪਹਿਲੀ ਦੀ ਰਫ਼ਤਾਰ")
    .replace(/ਦੂਜੇ ਦੀ ਰਫ਼ਤਾਰ/gu, "ਦੂਜੀ ਦੀ ਰਫ਼ਤਾਰ")
    .replace(/ਦੂਜੇ ਦੀ (?=\d)/gu, "ਦੂਜੀ ਦੀ ")
    .replace(/ਦੂਜੇ ਨੂੰ/gu, "ਦੂਜੀ ਨੂੰ");
}

export function polishCp004NativeGrammarStem(stem: string, language: TsdCp004NativeLanguage, actorKind: TsdCp004ActorKind): string {
  return language === "hi" ? polishHindiFeminine(stem, actorKind) : polishPunjabiFeminine(stem, actorKind);
}

export function cp004UsesFeminineNativeActor(actorKind: TsdCp004ActorKind): boolean {
  return FEMININE_ACTORS.has(actorKind);
}
