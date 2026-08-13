type Lang = "hi" | "pa";

function polishText(value: string, language: Lang) {
  let text = value;
  if (language === "hi") {
    text = text
      .replace(/धनात्मक गैर-वर्ग पूर्णांक (\\\([^\n]+?\\\)) के लिए/gu, "धनात्मक पूर्णांक $1, जो पूर्ण वर्ग नहीं है, के लिए")
      .replace(/सख्ती से छोटा/gu, "छोटा")
      .replace(/सख्ती से बड़ा/gu, "बड़ा")
      .replace(/से n की प्रकृति/gu, "से \\(n\\) की प्रकृति")
      .replace(/क्या (\\\(x\\\)) का मान निर्धारित किया जा सकता है\?/gu, "क्या $1 का मान निश्चित रूप से ज्ञात किया जा सकता है?")
      .replace(/एक मान, (\\\([^\n]+?\\\)) बचते हैं/gu, "केवल एक मान, $1 बचता है")
      .replace(/(\d+) संभावित मान बचता है/gu, "$1 संभावित मान बचते हैं");
  } else {
    text = text
      .replace(/ਧਨਾਤਮਕ ਗੈਰ-ਵਰਗ ਪੂਰਨ ਅੰਕ (\\\([^\n]+?\\\)) ਲਈ/gu, "ਧਨਾਤਮਕ ਪੂਰਨ ਅੰਕ $1, ਜੋ ਪੂਰਨ ਵਰਗ ਨਹੀਂ ਹੈ, ਲਈ")
      .replace(/ਸਖ਼ਤੀ ਨਾਲ ਛੋਟਾ/gu, "ਛੋਟਾ")
      .replace(/ਸਖ਼ਤੀ ਨਾਲ ਵੱਡਾ/gu, "ਵੱਡਾ")
      .replace(/ਤੋਂ n ਦੀ ਪ੍ਰਕਿਰਤੀ/gu, "ਤੋਂ \\(n\\) ਦੀ ਪ੍ਰਕਿਰਤੀ")
      .replace(/ਜਿਸਤ/gu, "ਸਮ")
      .replace(/ਟਾਂਕ/gu, "ਵਿਸ਼ਮ")
      .replace(/ਕੀ (\\\(x\\\)) ਦਾ ਮੁੱਲ ਇਕੋ-ਇੱਕ ਤਰੀਕੇ ਨਾਲ ਨਿਰਧਾਰਤ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ\?/gu, "ਕੀ $1 ਦਾ ਮੁੱਲ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਪਤਾ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ?")
      .replace(/ਇੱਕ ਮੁੱਲ, (\\\([^\n]+?\\\)) ਬਚਦੇ ਹਨ/gu, "ਕੇਵਲ ਇੱਕ ਮੁੱਲ, $1 ਬਚਦਾ ਹੈ")
      .replace(/(\d+) ਸੰਭਾਵਿਤ ਮੁੱਲ ਬਚਦਾ ਹੈ/gu, "$1 ਸੰਭਾਵਿਤ ਮੁੱਲ ਬਚਦੇ ਹਨ");
  }
  return text.replace(/\\\)\./gu, "\\)।");
}

export function polishLocalizedEditorialSurface(surface: any, language: Lang) {
  return {
    ...surface,
    stem: polishText(String(surface.stem), language),
    options: Object.freeze((surface.options ?? []).map((value: string) => polishText(String(value), language))),
    answer: polishText(String(surface.answer), language),
    concept: polishText(String(surface.concept ?? ""), language),
    steps: Object.freeze((surface.steps ?? []).map((value: string) => polishText(String(value), language))),
  };
}
