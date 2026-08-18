import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";

type SurfaceResult = Readonly<{
  stem: string;
  scenarioTextApplied: boolean;
  scenarioId: string | null;
  diagramMigrationRequired: boolean;
}>;

function hi(qlId: string, stem: string): SurfaceResult {
  let m: RegExpExecArray | null;
  if (["TRG-002-QL-015","TRG-002-QL-016","TRG-002-QL-017","TRG-002-QL-018"].includes(qlId)) {
    m = /^जमीन से (.+?) m ऊँचे अवलोकन बिंदु से (.+?) m दूर स्थित खंभे के शीर्ष का अवनमन कोण (.+?)° है। खंभे की ऊँचाई ज्ञात कीजिए।$/u.exec(stem);
    if (m) return { stem: `${m[1]} m ऊँची इमारत की छत से सामने स्थित एक खंभे के शीर्ष का अवनमन कोण ${m[3]}° है। इमारत और खंभे के आधारों के बीच क्षैतिज दूरी ${m[2]} m है। खंभे की ऊँचाई ज्ञात कीजिए।`, scenarioTextApplied: true, scenarioId: "URBAN_ROOFTOP_TO_POLE", diagramMigrationRequired: true };
  }
  if (["TRG-002-QL-019","TRG-002-QL-020","TRG-002-QL-022"].includes(qlId)) {
    m = /^जमीन से (.+?) m ऊँचे अवलोकन बिंदु से (.+?) m ऊँचे खंभे का शीर्ष (.+?)° के अवनमन कोण पर दिखाई देता है। खंभे तक क्षैतिज दूरी ज्ञात कीजिए।$/u.exec(stem);
    if (m) return { stem: `${m[1]} m ऊँची इमारत की छत से सामने स्थित ${m[2]} m ऊँचे खंभे का शीर्ष ${m[3]}° के अवनमन कोण पर दिखाई देता है। इमारत और खंभे के आधारों के बीच क्षैतिज दूरी ज्ञात कीजिए।`, scenarioTextApplied: true, scenarioId: "URBAN_ROOFTOP_TO_POLE", diagramMigrationRequired: true };
  }
  if (qlId === "TRG-002-QL-021") {
    m = /^(.+?) m ऊँचे अवलोकन बिंदु से समतल जमीन पर एक बिंदु (.+?)° के अवनमन कोण पर दिखाई देता है। उस बिंदु तक क्षैतिज दूरी ज्ञात कीजिए।$/u.exec(stem);
    if (m) return { stem: `सड़क के ऊपर बने ${m[1]} m ऊँचे पैदल पुल के किनारे से सड़क पर स्थित एक बिंदु ${m[2]}° के अवनमन कोण पर दिखाई देता है। पुल के ठीक नीचे वाले बिंदु से उस बिंदु तक क्षैतिज दूरी ज्ञात कीजिए।`, scenarioTextApplied: true, scenarioId: "ROAD_BRIDGE_GROUND_POINT", diagramMigrationRequired: true };
  }
  if (["TRG-002-QL-092","TRG-002-QL-093","TRG-002-QL-094"].includes(qlId)) {
    m = /^नदी के एक किनारे पर जमीन से (.+?) m ऊँचे बिंदु से दूसरे किनारे के ठीक सामने वाले बिंदु का अवनमन कोण (.+?)° है। नदी की चौड़ाई ज्ञात कीजिए।$/u.exec(stem);
    if (m) return { stem: `नदी के एक किनारे पर बने ${m[1]} m ऊँचे अवलोकन मंच से दूसरे किनारे के ठीक सामने वाले बिंदु का अवनमन कोण ${m[2]}° है। नदी की चौड़ाई ज्ञात कीजिए।`, scenarioTextApplied: true, scenarioId: "WATER_BANK_OBSERVATION_PLATFORM", diagramMigrationRequired: true };
  }
  return { stem, scenarioTextApplied: false, scenarioId: null, diagramMigrationRequired: false };
}

function pa(qlId: string, stem: string): SurfaceResult {
  let m: RegExpExecArray | null;
  if (["TRG-002-QL-015","TRG-002-QL-016","TRG-002-QL-017","TRG-002-QL-018"].includes(qlId)) {
    m = /^ਜ਼ਮੀਨ ਤੋਂ (.+?) m ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ (.+?) m ਦੂਰ ਸਥਿਤ ਖੰਭੇ ਦੀ ਚੋਟੀ ਦਾ ਨਿਵਾਣ ਕੋਣ (.+?)° ਹੈ। ਖੰਭੇ ਦੀ ਉਚਾਈ ਕੱਢੋ।$/u.exec(stem);
    if (m) return { stem: `${m[1]} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਸਾਹਮਣੇ ਸਥਿਤ ਇੱਕ ਖੰਭੇ ਦੀ ਚੋਟੀ ਦਾ ਨਿਵਾਣ ਕੋਣ ${m[3]}° ਹੈ। ਇਮਾਰਤ ਅਤੇ ਖੰਭੇ ਦੇ ਅਧਾਰਾਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ ${m[2]} m ਹੈ। ਖੰਭੇ ਦੀ ਉਚਾਈ ਕੱਢੋ।`, scenarioTextApplied: true, scenarioId: "URBAN_ROOFTOP_TO_POLE", diagramMigrationRequired: true };
  }
  if (["TRG-002-QL-019","TRG-002-QL-020","TRG-002-QL-022"].includes(qlId)) {
    m = /^ਜ਼ਮੀਨ ਤੋਂ (.+?) m ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ (.+?) m ਉੱਚੇ ਖੰਭੇ ਦੀ ਚੋਟੀ (.+?)° ਦੇ ਨਿਵਾਣ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਖੰਭੇ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।$/u.exec(stem);
    if (m) return { stem: `${m[1]} m ਉੱਚੀ ਇਮਾਰਤ ਦੀ ਛੱਤ ਤੋਂ ਸਾਹਮਣੇ ਸਥਿਤ ${m[2]} m ਉੱਚੇ ਖੰਭੇ ਦੀ ਚੋਟੀ ${m[3]}° ਦੇ ਨਿਵਾਣ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ। ਇਮਾਰਤ ਅਤੇ ਖੰਭੇ ਦੇ ਅਧਾਰਾਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`, scenarioTextApplied: true, scenarioId: "URBAN_ROOFTOP_TO_POLE", diagramMigrationRequired: true };
  }
  if (qlId === "TRG-002-QL-021") {
    m = /^(.+?) m ਉੱਚੇ ਨਿਰੀਖਣ ਬਿੰਦੂ ਤੋਂ ਸਮਤਲ ਜ਼ਮੀਨ ਉੱਤੇ ਇੱਕ ਬਿੰਦੂ (.+?)° ਦੇ ਨਿਵਾਣ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ। ਉਸ ਬਿੰਦੂ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।$/u.exec(stem);
    if (m) return { stem: `ਸੜਕ ਦੇ ਉੱਪਰ ਬਣੇ ${m[1]} m ਉੱਚੇ ਪੈਦਲ ਪੁਲ ਦੇ ਕਿਨਾਰੇ ਤੋਂ ਸੜਕ ਉੱਤੇ ਇੱਕ ਬਿੰਦੂ ${m[2]}° ਦੇ ਨਿਵਾਣ ਕੋਣ 'ਤੇ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ। ਪੁਲ ਦੇ ਠੀਕ ਹੇਠਲੇ ਬਿੰਦੂ ਤੋਂ ਉਸ ਬਿੰਦੂ ਤੱਕ ਖਿਤਿਜੀ ਦੂਰੀ ਕੱਢੋ।`, scenarioTextApplied: true, scenarioId: "ROAD_BRIDGE_GROUND_POINT", diagramMigrationRequired: true };
  }
  if (["TRG-002-QL-092","TRG-002-QL-093","TRG-002-QL-094"].includes(qlId)) {
    m = /^ਨਦੀ ਦੇ ਇੱਕ ਕੰਢੇ 'ਤੇ ਜ਼ਮੀਨ ਤੋਂ (.+?) m ਉੱਚੇ ਬਿੰਦੂ ਤੋਂ ਦੂਜੇ ਕੰਢੇ ਦੇ ਠੀਕ ਸਾਹਮਣੇ ਵਾਲੇ ਬਿੰਦੂ ਦਾ ਨਿਵਾਣ ਕੋਣ (.+?)° ਹੈ। ਨਦੀ ਦੀ ਚੌੜਾਈ ਕੱਢੋ।$/u.exec(stem);
    if (m) return { stem: `ਨਦੀ ਦੇ ਇੱਕ ਕੰਢੇ 'ਤੇ ਬਣੇ ${m[1]} m ਉੱਚੇ ਨਿਰੀਖਣ ਮੰਚ ਤੋਂ ਦੂਜੇ ਕੰਢੇ ਦੇ ਠੀਕ ਸਾਹਮਣੇ ਵਾਲੇ ਬਿੰਦੂ ਦਾ ਨਿਵਾਣ ਕੋਣ ${m[2]}° ਹੈ। ਨਦੀ ਦੀ ਚੌੜਾਈ ਕੱਢੋ।`, scenarioTextApplied: true, scenarioId: "WATER_BANK_OBSERVATION_PLATFORM", diagramMigrationRequired: true };
  }
  return { stem, scenarioTextApplied: false, scenarioId: null, diagramMigrationRequired: false };
}

export function applyTrg002V4Wave1ScenarioText(qlId: string, locale: Trg002ExamRealnessLocale, stem: string): SurfaceResult {
  return locale === "hi-IN" ? hi(qlId, stem) : pa(qlId, stem);
}
