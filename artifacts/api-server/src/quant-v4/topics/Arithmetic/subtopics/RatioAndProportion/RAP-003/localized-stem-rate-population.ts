import type { Rap003Parameters } from "./types";

type Language = "hi" | "pa";
function v(p: Rap003Parameters, key: string) { return p.variables[key]; }

function rate(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  if (task === "sdtTimeRatioFromSpeedDistance") return hi
    ? `A और B की गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} तथा दूरी का अनुपात ${v(p, "distanceRatioA")}:${v(p, "distanceRatioB")} है। समय का अनुपात ज्ञात करें।`
    : `A ਅਤੇ B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਅਤੇ ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "distanceRatioA")}:${v(p, "distanceRatioB")} ਹੈ। ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "sdtDistanceRatioFromSpeedTime") return hi
    ? `A और B की गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} तथा समय का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। दूरी का अनुपात ज्ञात करें।`
    : `A ਅਤੇ B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਅਤੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "sdtSpeedRatioFromDistanceTime") return hi
    ? `A और B की दूरी का अनुपात ${v(p, "distanceRatioA")}:${v(p, "distanceRatioB")} तथा समय का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। गति का अनुपात ज्ञात करें।`
    : `A ਅਤੇ B ਦੀ ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "distanceRatioA")}:${v(p, "distanceRatioB")} ਅਤੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਗਤੀ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "sdtRaceLead") return hi
    ? `${v(p, "trackDistance")} मीटर की दौड़ में A और B की गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। A तेज है। A कितने मीटर से जीतेगा?`
    : `${v(p, "trackDistance")} ਮੀਟਰ ਦੀ ਦੌੜ ਵਿੱਚ A ਅਤੇ B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। A ਤੇਜ਼ ਹੈ। A ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`;
  if (task === "sdtOvertakeTime") return hi
    ? `A और B की गति ${v(p, "speedA")} तथा ${v(p, "speedB")} किमी/घंटा है। B, A से ${v(p, "leadDistance")} मीटर आगे है। A को B तक पहुंचने में कितना समय लगेगा?`
    : `A ਅਤੇ B ਦੀ ਗਤੀ ${v(p, "speedA")} ਅਤੇ ${v(p, "speedB")} ਕਿਮੀ/ਘੰਟਾ ਹੈ। B, A ਤੋਂ ${v(p, "leadDistance")} ਮੀਟਰ ਅੱਗੇ ਹੈ। A ਨੂੰ B ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`;
  if (task === "fixedDistanceSpeedTimeInverse") return hi
    ? `A और B समान दूरी तय करते हैं। उनकी गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। समय का अनुपात ज्ञात करें।`
    : `A ਅਤੇ B ਇੱਕੋ ਦੂਰੀ ਤੈਅ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "fixedTimeSpeedDistanceDirect") return hi
    ? `A और B समान समय तक चलते हैं। उनकी गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। दूरी का अनुपात ज्ञात करें।`
    : `A ਅਤੇ B ਇੱਕੋ ਸਮੇਂ ਤੱਕ ਚਲਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "sdtRaceLeadSpeedRatio") return hi
    ? `${v(p, "raceLength")} मीटर की दौड़ में A, B को ${v(p, "leadDistance")} मीटर से हराता है। A:B की गति का अनुपात ज्ञात करें।`
    : `${v(p, "raceLength")} ਮੀਟਰ ਦੀ ਦੌੜ ਵਿੱਚ A, B ਨੂੰ ${v(p, "leadDistance")} ਮੀਟਰ ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। A:B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "sdtRaceLeadTime") return hi
    ? `समान दूरी तय करने में A ${v(p, "timeA")} सेकंड और B ${v(p, "timeB")} सेकंड लेता है। उनकी गति का अनुपात ज्ञात करें।`
    : `ਇੱਕੋ ਦੂਰੀ ਤੈਅ ਕਰਨ ਵਿੱਚ A ${v(p, "timeA")} ਸਕਿੰਟ ਅਤੇ B ${v(p, "timeB")} ਸਕਿੰਟ ਲੈਂਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "sdtOppositeDirectionMeeting") return hi
    ? `A और B एक-दूसरे की ओर ${v(p, "speedA")} तथा ${v(p, "speedB")} किमी/घंटा से चलते हैं। दूरी ${v(p, "distance")} किमी है। मिलने का समय ज्ञात करें।`
    : `A ਅਤੇ B ਇੱਕ-ਦੂਜੇ ਵੱਲ ${v(p, "speedA")} ਅਤੇ ${v(p, "speedB")} ਕਿਮੀ/ਘੰਟਾ ਨਾਲ ਚਲਦੇ ਹਨ। ਦੂਰੀ ${v(p, "distance")} ਕਿਮੀ ਹੈ। ਮਿਲਣ ਦਾ ਸਮਾਂ ਲੱਭੋ।`;
  if (task === "trainPlatformRatio") return hi
    ? `दो रेलगाड़ियों की लंबाई का अनुपात ${v(p, "lengthRatioA")}:${v(p, "lengthRatioB")} और गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। एक ही बिंदु पार करने के समय का अनुपात ज्ञात करें।`
    : `ਦੋ ਰੇਲਗੱਡੀਆਂ ਦੀ ਲੰਬਾਈ ਦਾ ਅਨੁਪਾਤ ${v(p, "lengthRatioA")}:${v(p, "lengthRatioB")} ਅਤੇ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। ਇੱਕੋ ਬਿੰਦੂ ਪਾਰ ਕਰਨ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "workEfficiencyTimeRatio") return hi
    ? `दो टीमों की कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} और काम का अनुपात ${v(p, "workRatioA")}:${v(p, "workRatioB")} है। समय का अनुपात ज्ञात करें।`
    : `ਦੋ ਟੀਮਾਂ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਅਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ${v(p, "workRatioA")}:${v(p, "workRatioB")} ਹੈ। ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "machinesOutputTime") return hi
    ? `दो इकाइयों में मशीनों का अनुपात ${v(p, "machineRatioA")}:${v(p, "machineRatioB")} और काम के घंटों का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। समान कार्यक्षमता पर उत्पादन का अनुपात ज्ञात करें।`
    : `ਦੋ ਇਕਾਈਆਂ ਵਿੱਚ ਮਸ਼ੀਨਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "machineRatioA")}:${v(p, "machineRatioB")} ਅਤੇ ਕੰਮ ਦੇ ਘੰਟਿਆਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਇੱਕੋ ਕਾਰਗੁਜ਼ਾਰੀ ਉੱਤੇ ਉਤਪਾਦਨ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "pipesTimeRatio") return hi
    ? `दो पाइपों की भरने की दर का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। समान टंकी भरने के समय का अनुपात ज्ञात करें।`
    : `ਦੋ ਪਾਈਪਾਂ ਦੀ ਭਰਨ ਦਰ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। ਇੱਕੋ ਟੈਂਕੀ ਭਰਨ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "workersEfficiencyDays") return hi
    ? `दो समूहों में कामगारों का अनुपात ${v(p, "machineRatioA")}:${v(p, "machineRatioB")}, कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} और दिनों का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। किए गए काम का अनुपात ज्ञात करें।`
    : `ਦੋ ਸਮੂਹਾਂ ਵਿੱਚ ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "machineRatioA")}:${v(p, "machineRatioB")}, ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਅਤੇ ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਕੀਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "findMissingRateFromOutput") return hi
    ? `दो मशीनों के उत्पादन का अनुपात ${v(p, "outputRatioA")}:${v(p, "outputRatioB")} और समय का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। उत्पादन दर का अनुपात ज्ञात करें।`
    : `ਦੋ ਮਸ਼ੀਨਾਂ ਦੇ ਉਤਪਾਦਨ ਦਾ ਅਨੁਪਾਤ ${v(p, "outputRatioA")}:${v(p, "outputRatioB")} ਅਤੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਉਤਪਾਦਨ ਦਰ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "timeSavedByHigherSpeed") return hi
    ? `समान दूरी के लिए गति ${v(p, "speedRatioA")} भाग से बढ़कर ${v(p, "speedRatioB")} भाग हो जाती है। पुराना समय ${v(p, "oldTime")} घंटे है। बचा समय ज्ञात करें।`
    : `ਇੱਕੋ ਦੂਰੀ ਲਈ ਗਤੀ ${v(p, "speedRatioA")} ਭਾਗ ਤੋਂ ਵੱਧ ਕੇ ${v(p, "speedRatioB")} ਭਾਗ ਹੋ ਜਾਂਦੀ ਹੈ। ਪੁਰਾਣਾ ਸਮਾਂ ${v(p, "oldTime")} ਘੰਟੇ ਹੈ। ਬਚਿਆ ਸਮਾਂ ਲੱਭੋ।`;
  if (task === "distanceSlowerCoversWhenFasterFinishes") return hi
    ? `${v(p, "trackDistance")} मीटर की दौड़ में A और B की गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। A के समाप्त करने पर B कितनी दूरी तय करेगा?`
    : `${v(p, "trackDistance")} ਮੀਟਰ ਦੀ ਦੌੜ ਵਿੱਚ A ਅਤੇ B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। A ਦੇ ਸਮਾਪਤ ਕਰਨ ਉੱਤੇ B ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕਰੇਗਾ?`;
  if (task === "sameWorkTwoTeams") return hi
    ? `दो टीमों में कामगारों का अनुपात ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} और कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} है। समान काम के समय का अनुपात ज्ञात करें।`
    : `ਦੋ ਟੀਮਾਂ ਵਿੱਚ ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} ਅਤੇ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਹੈ। ਇੱਕੋ ਕੰਮ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
  if (task === "rateProductAbsoluteOutput") return hi
    ? `इकाई A का उत्पादन ${v(p, "outputA")} है। A:B के लिए दर, समय और इकाइयों की संख्या के अनुपात ${v(p, "rateRatioA")}:${v(p, "rateRatioB")}, ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} और ${v(p, "unitRatioA")}:${v(p, "unitRatioB")} हैं। B का उत्पादन ज्ञात करें।`
    : `ਇਕਾਈ A ਦਾ ਉਤਪਾਦਨ ${v(p, "outputA")} ਹੈ। A:B ਲਈ ਦਰ, ਸਮਾਂ ਅਤੇ ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ ਦੇ ਅਨੁਪਾਤ ${v(p, "rateRatioA")}:${v(p, "rateRatioB")}, ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਅਤੇ ${v(p, "unitRatioA")}:${v(p, "unitRatioB")} ਹਨ। B ਦਾ ਉਤਪਾਦਨ ਲੱਭੋ।`;
  if (task === "relativeSpeedRatioFromOvertake") return hi
    ? `एक तेज वाहन ${v(p, "leadDistance")} मीटर की बढ़त ${v(p, "overtakeTime")} सेकंड में समाप्त करता है। सापेक्ष गति किमी/घंटा में ज्ञात करें।`
    : `ਇੱਕ ਤੇਜ਼ ਵਾਹਨ ${v(p, "leadDistance")} ਮੀਟਰ ਦੀ ਬੜ੍ਹਤ ${v(p, "overtakeTime")} ਸਕਿੰਟ ਵਿੱਚ ਖਤਮ ਕਰਦਾ ਹੈ। ਸਾਪੇਖ ਗਤੀ ਕਿਮੀ/ਘੰਟਾ ਵਿੱਚ ਲੱਭੋ।`;
  return undefined;
}

function cellLabel(raw: unknown, language: Language) {
  const value = String(raw ?? "").toLowerCase();
  const hi = language === "hi";
  if (value.includes("illiterate males")) return hi ? "निरक्षर पुरुष" : "ਅਨਪੜ੍ਹ ਪੁਰਸ਼";
  if (value.includes("literate males")) return hi ? "साक्षर पुरुष" : "ਪੜ੍ਹੇ-ਲਿਖੇ ਪੁਰਸ਼";
  if (value.includes("illiterate females")) return hi ? "निरक्षर महिलाएं" : "ਅਨਪੜ੍ਹ ਔਰਤਾਂ";
  if (value.includes("literate females")) return hi ? "साक्षर महिलाएं" : "ਪੜ੍ਹੀਆਂ-ਲਿਖੀਆਂ ਔਰਤਾਂ";
  return hi ? "चुना हुआ समूह" : "ਚੁਣਿਆ ਸਮੂਹ";
}

function populationBase(p: Rap003Parameters, language: Language) {
  return language === "hi"
    ? `कुल जनसंख्या ${v(p, "totalPopulation")} है। पुरुष:महिला = ${v(p, "maleRatio")}:${v(p, "femaleRatio")}। पुरुषों में साक्षर:निरक्षर = ${v(p, "maleLiterateRatio")}:${v(p, "maleIlliterateRatio")} और महिलाओं में साक्षर:निरक्षर = ${v(p, "femaleLiterateRatio")}:${v(p, "femaleIlliterateRatio")}।`
    : `ਕੁੱਲ ਆਬਾਦੀ ${v(p, "totalPopulation")} ਹੈ। ਪੁਰਸ਼:ਔਰਤ = ${v(p, "maleRatio")}:${v(p, "femaleRatio")}। ਪੁਰਸ਼ਾਂ ਵਿੱਚ ਪੜ੍ਹੇ-ਲਿਖੇ:ਅਨਪੜ੍ਹ = ${v(p, "maleLiterateRatio")}:${v(p, "maleIlliterateRatio")} ਅਤੇ ਔਰਤਾਂ ਵਿੱਚ ਪੜ੍ਹੀਆਂ-ਲਿਖੀਆਂ:ਅਨਪੜ੍ਹ = ${v(p, "femaleLiterateRatio")}:${v(p, "femaleIlliterateRatio")}।`;
}

function population(p: Rap003Parameters, language: Language) {
  const hi = language === "hi";
  const task = p.taskKind;
  if (task === "populationThreeRows") return hi
    ? `कुल ${v(p, "totalPopulation")} विद्यार्थी तीन समूहों में ${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")} के अनुपात में हैं। पहले समूह में उत्तीर्ण:अनुत्तीर्ण = ${v(p, "passRatioA")}:${v(p, "failRatioA")} है। पहले समूह के उत्तीर्ण विद्यार्थियों की संख्या ज्ञात करें।`
    : `ਕੁੱਲ ${v(p, "totalPopulation")} ਵਿਦਿਆਰਥੀ ਤਿੰਨ ਸਮੂਹਾਂ ਵਿੱਚ ${v(p, "ratioA")}:${v(p, "ratioB")}:${v(p, "ratioC")} ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਹਨ। ਪਹਿਲੇ ਸਮੂਹ ਵਿੱਚ ਪਾਸ:ਫੇਲ = ${v(p, "passRatioA")}:${v(p, "failRatioA")} ਹੈ। ਪਹਿਲੇ ਸਮੂਹ ਦੇ ਪਾਸ ਵਿਦਿਆਰਥੀਆਂ ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`;
  const base = populationBase(p, language);
  if (task === "populationCrossTabCellCount" || task === "populationMissingRowTotal") {
    const target = cellLabel(v(p, "targetCellLabel") ?? `${v(p, "targetLiteracy")} ${v(p, "targetGroup")}s`, language);
    return `${base} ${hi ? `${target} की संख्या ज्ञात करें।` : `${target} ਦੀ ਗਿਣਤੀ ਲੱਭੋ।`}`;
  }
  if (task === "populationTotalLiterate") return `${base} ${hi ? "कुल साक्षर जनसंख्या ज्ञात करें।" : "ਕੁੱਲ ਪੜ੍ਹੀ-ਲਿਖੀ ਆਬਾਦੀ ਲੱਭੋ।"}`;
  if (task === "populationTotalIlliterate") return `${base} ${hi ? "कुल निरक्षर जनसंख्या ज्ञात करें।" : "ਕੁੱਲ ਅਨਪੜ੍ਹ ਆਬਾਦੀ ਲੱਭੋ।"}`;
  if (task === "populationLiteracyPercent") return `${base} ${hi ? "कुल साक्षरता प्रतिशत ज्ञात करें।" : "ਕੁੱਲ ਸਾਖਰਤਾ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।"}`;
  if (["populationCellRatio", "populationMiniCaseletQuestion2", "populationColumnRatioGiven", "populationTableValidationTrap"].includes(task)) {
    const a = cellLabel(v(p, "ratioCellA"), language); const b = cellLabel(v(p, "ratioCellB"), language);
    return `${base} ${hi ? `${a}:${b} का अनुपात ज्ञात करें।` : `${a}:${b} ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`}`;
  }
  if (task === "populationCellPercentOfTotal") {
    const target = cellLabel(v(p, "targetCellLabel"), language);
    return `${base} ${hi ? `कुल जनसंख्या में ${target} का प्रतिशत ज्ञात करें।` : `ਕੁੱਲ ਆਬਾਦੀ ਵਿੱਚ ${target} ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਲੱਭੋ।`}`;
  }
  if (task === "populationRecoverTotalFromCell") {
    const known = cellLabel(v(p, "knownCellLabel"), language);
    return hi
      ? `${known} की संख्या ${v(p, "knownCellValue")} है। पुरुष:महिला = ${v(p, "maleRatio")}:${v(p, "femaleRatio")} तथा संबंधित साक्षर:निरक्षर अनुपात दिए हैं। कुल जनसंख्या ज्ञात करें।`
      : `${known} ਦੀ ਗਿਣਤੀ ${v(p, "knownCellValue")} ਹੈ। ਪੁਰਸ਼:ਔਰਤ = ${v(p, "maleRatio")}:${v(p, "femaleRatio")} ਅਤੇ ਸੰਬੰਧਿਤ ਪੜ੍ਹੇ-ਲਿਖੇ:ਅਨਪੜ੍ਹ ਅਨੁਪਾਤ ਦਿੱਤੇ ਹਨ। ਕੁੱਲ ਆਬਾਦੀ ਲੱਭੋ।`;
  }
  if (["populationDifferenceBetweenCells", "populationMiniCaseletQuestion1", "populationSumOfSelectedCells"].includes(task)) {
    const a = cellLabel(v(p, "ratioCellA"), language); const b = cellLabel(v(p, "ratioCellB"), language);
    const ask = task === "populationSumOfSelectedCells"
      ? (hi ? `${a} और ${b} का योग ज्ञात करें।` : `${a} ਅਤੇ ${b} ਦਾ ਜੋੜ ਲੱਭੋ।`)
      : (hi ? `${a} और ${b} का अंतर ज्ञात करें।` : `${a} ਅਤੇ ${b} ਦਾ ਅੰਤਰ ਲੱਭੋ।`);
    return `${base} ${ask}`;
  }
  return undefined;
}

export function renderLocalizedRap003RatePopulationStem(p: Rap003Parameters) {
  if (p.language === "en") return undefined;
  const language = p.language as Language;
  if (p.canonicalProblemId === "RAP-CP-019") return rate(p, language);
  if (p.canonicalProblemId === "RAP-CP-020") return population(p, language);
  return undefined;
}
