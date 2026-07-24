import type { Rap002Parameters } from "./types";

type Language = "hi" | "pa";

function v(p: Rap002Parameters, key: string) {
  return p.variables[key];
}

export function renderLocalizedRap002WorkStem(p: Rap002Parameters) {
  if (p.language === "en") return undefined;
  const hi = p.language === "hi";
  switch (p.questionLanguageId) {
    case "RAP-QL-609":
      return hi
        ? `A और B में कामगारों की संख्या का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। यदि B काम को ${v(p, "valueB")} दिनों में पूरा करता है, तो A कितने दिनों में पूरा करेगा?`
        : `A ਅਤੇ B ਵਿੱਚ ਮਜ਼ਦੂਰਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ਜੇ B ਕੰਮ ਨੂੰ ${v(p, "valueB")} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ, ਤਾਂ A ਕਿੰਨੇ ਦਿਨ ਲਵੇਗਾ?`;
    case "RAP-QL-610":
      return hi
        ? `दो कामगार समूहों की संख्या का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। समान काम के लिए उनके समय का अनुपात ज्ञात करें।`
        : `ਦੋ ਮਜ਼ਦੂਰ ਸਮੂਹਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ਇੱਕੋ ਕੰਮ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-611":
      return hi
        ? `दो टीमों में कामगारों का अनुपात ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} और कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} है। समान काम पूरा करने के समय का अनुपात ज्ञात करें।`
        : `ਦੋ ਟੀਮਾਂ ਵਿੱਚ ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} ਅਤੇ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਹੈ। ਇੱਕੋ ਕੰਮ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-612":
      return hi
        ? `A और B की मशीनों की संख्या का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। यदि A निश्चित उत्पादन ${v(p, "valueA")} घंटों में करता है, तो B कितने घंटे लेगा?`
        : `A ਅਤੇ B ਦੀਆਂ ਮਸ਼ੀਨਾਂ ਦੀ ਗਿਣਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ਜੇ A ਨਿਰਧਾਰਤ ਉਤਪਾਦਨ ${v(p, "valueA")} ਘੰਟਿਆਂ ਵਿੱਚ ਕਰਦਾ ਹੈ, ਤਾਂ B ਕਿੰਨੇ ਘੰਟੇ ਲਵੇਗਾ?`;
    case "RAP-QL-613":
      return hi
        ? `दो पाइपों की भरने की क्षमता का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} है। समान टंकी भरने के समय का अनुपात ज्ञात करें।`
        : `ਦੋ ਪਾਈਪਾਂ ਦੀ ਭਰਨ ਸਮਰੱਥਾ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਹੈ। ਇੱਕੋ ਟੈਂਕੀ ਭਰਨ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-614":
    case "RAP-QL-620":
      return hi
        ? `${v(p, "initialWorkers")} कामगार काम को ${v(p, "originalDays")} दिनों में पूरा कर सकते हैं। ${v(p, "daysWorked")} दिन बाद ${v(p, "addedWorkers")} और कामगार जुड़ते हैं। बचा काम पूरा करने में कितने दिन लगेंगे?`
        : `${v(p, "initialWorkers")} ਮਜ਼ਦੂਰ ਕੰਮ ਨੂੰ ${v(p, "originalDays")} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ${v(p, "daysWorked")} ਦਿਨਾਂ ਬਾਅਦ ${v(p, "addedWorkers")} ਹੋਰ ਮਜ਼ਦੂਰ ਜੁੜਦੇ ਹਨ। ਬਾਕੀ ਕੰਮ ਲਈ ਕਿੰਨੇ ਦਿਨ ਲੱਗਣਗੇ?`;
    case "RAP-QL-615":
      return hi
        ? `कामगारों का अनुपात ${v(p, "workerRatioA")}:${v(p, "workerRatioB")}, घंटों का अनुपात ${v(p, "hoursRatioA")}:${v(p, "hoursRatioB")} और कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} है। उत्पादन का अनुपात ज्ञात करें।`
        : `ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "workerRatioA")}:${v(p, "workerRatioB")}, ਘੰਟਿਆਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "hoursRatioA")}:${v(p, "hoursRatioB")} ਅਤੇ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਹੈ। ਉਤਪਾਦਨ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-616":
      return hi
        ? `दो टीमें समान उत्पादन करती हैं। कामगारों का अनुपात ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} और कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} है। काम के समय का अनुपात ज्ञात करें।`
        : `ਦੋ ਟੀਮਾਂ ਇੱਕੋ ਉਤਪਾਦਨ ਕਰਦੀਆਂ ਹਨ। ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} ਅਤੇ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਹੈ। ਕੰਮ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-617":
      return hi
        ? `समान दूरी के लिए A और B की गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। उनके समय का अनुपात ज्ञात करें।`
        : `ਇੱਕੋ ਦੂਰੀ ਲਈ A ਅਤੇ B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-618":
      return hi
        ? `समान समय के लिए A और B की गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} है। तय की गई दूरियों का अनुपात ज्ञात करें।`
        : `ਇੱਕੋ ਸਮੇਂ ਲਈ A ਅਤੇ B ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")} ਹੈ। ਤੈਅ ਕੀਤੀਆਂ ਦੂਰੀਆਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-619":
      return hi
        ? `दो बसों की गति का अनुपात ${v(p, "ratioA")}:${v(p, "ratioB")} और चलने के समय का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। तय दूरियों का अनुपात ज्ञात करें।`
        : `ਦੋ ਬੱਸਾਂ ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "ratioA")}:${v(p, "ratioB")} ਅਤੇ ਚੱਲਣ ਦੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਤੈਅ ਦੂਰੀਆਂ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-621":
      return hi
        ? `${v(p, "initialWorkers")} कामगार काम को ${v(p, "originalDays")} दिनों में पूरा कर सकते हैं। ${v(p, "daysWorked")} दिन बाद केवल ${v(p, "remainingWorkers")} कामगार काम जारी रखते हैं। बचा काम कितने दिनों में पूरा होगा?`
        : `${v(p, "initialWorkers")} ਮਜ਼ਦੂਰ ਕੰਮ ਨੂੰ ${v(p, "originalDays")} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦੇ ਹਨ। ${v(p, "daysWorked")} ਦਿਨਾਂ ਬਾਅਦ ਕੇਵਲ ${v(p, "remainingWorkers")} ਮਜ਼ਦੂਰ ਕੰਮ ਜਾਰੀ ਰੱਖਦੇ ਹਨ। ਬਾਕੀ ਕੰਮ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`;
    case "RAP-QL-622":
      return hi
        ? `दो टीमें समान काम करती हैं। कामगारों का अनुपात ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} और दिनों का अनुपात ${v(p, "daysRatioA")}:${v(p, "daysRatioB")} है। प्रति कामगार कार्यक्षमता का अनुपात ज्ञात करें।`
        : `ਦੋ ਟੀਮਾਂ ਇੱਕੋ ਕੰਮ ਕਰਦੀਆਂ ਹਨ। ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} ਅਤੇ ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "daysRatioA")}:${v(p, "daysRatioB")} ਹੈ। ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-623":
      return hi
        ? `मशीनों का अनुपात ${v(p, "machineRatioA")}:${v(p, "machineRatioB")}, घंटों का अनुपात ${v(p, "hoursRatioA")}:${v(p, "hoursRatioB")} और उत्पादन का अनुपात ${v(p, "outputRatioA")}:${v(p, "outputRatioB")} है। कार्यक्षमता का अनुपात ज्ञात करें।`
        : `ਮਸ਼ੀਨਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "machineRatioA")}:${v(p, "machineRatioB")}, ਘੰਟਿਆਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "hoursRatioA")}:${v(p, "hoursRatioB")} ਅਤੇ ਉਤਪਾਦਨ ਦਾ ਅਨੁਪਾਤ ${v(p, "outputRatioA")}:${v(p, "outputRatioB")} ਹੈ। ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-624":
      return hi
        ? `${v(p, "menA")} व्यक्ति काम को ${v(p, "daysA")} दिनों में पूरा करते हैं। वही काम ${v(p, "menB")} व्यक्ति कितने दिनों में करेंगे?`
        : `${v(p, "menA")} ਵਿਅਕਤੀ ਕੰਮ ਨੂੰ ${v(p, "daysA")} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਦੇ ਹਨ। ਉਹੀ ਕੰਮ ${v(p, "menB")} ਵਿਅਕਤੀ ਕਿੰਨੇ ਦਿਨਾਂ ਵਿੱਚ ਕਰਨਗੇ?`;
    case "RAP-QL-625":
      return hi
        ? `${v(p, "baseWorkers")} कामगार पूरा काम ${v(p, "baseDays")} दिनों में करते हैं। काम का ${v(p, "workNumerator")}/${v(p, "workDenominator")} भाग ${v(p, "targetDays")} दिनों में पूरा करने के लिए कितने कामगार चाहिए?`
        : `${v(p, "baseWorkers")} ਮਜ਼ਦੂਰ ਪੂਰਾ ਕੰਮ ${v(p, "baseDays")} ਦਿਨਾਂ ਵਿੱਚ ਕਰਦੇ ਹਨ। ਕੰਮ ਦਾ ${v(p, "workNumerator")}/${v(p, "workDenominator")} ਹਿੱਸਾ ${v(p, "targetDays")} ਦਿਨਾਂ ਵਿੱਚ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਮਜ਼ਦੂਰ ਚਾਹੀਦੇ ਹਨ?`;
    case "RAP-QL-626":
      return hi
        ? `A और B की कार्यक्षमता का अनुपात ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} तथा समय का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। किए गए काम का अनुपात ज्ञात करें।`
        : `A ਅਤੇ B ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "efficiencyRatioA")}:${v(p, "efficiencyRatioB")} ਅਤੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਕੀਤੇ ਕੰਮ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-627":
      return hi
        ? `A, B और C की गति का अनुपात ${v(p, "speedRatioA")}:${v(p, "speedRatioB")}:${v(p, "speedRatioC")} है। समान दूरी के लिए उनके समय को अधिक से कम क्रम में लगाएं।`
        : `A, B ਅਤੇ C ਦੀ ਗਤੀ ਦਾ ਅਨੁਪਾਤ ${v(p, "speedRatioA")}:${v(p, "speedRatioB")}:${v(p, "speedRatioC")} ਹੈ। ਇੱਕੋ ਦੂਰੀ ਲਈ ਉਨ੍ਹਾਂ ਦੇ ਸਮੇਂ ਨੂੰ ਵੱਧ ਤੋਂ ਘੱਟ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।`;
    case "RAP-QL-628":
      return hi
        ? `A और B के उत्पादन का अनुपात ${v(p, "quantityRatioA")}:${v(p, "quantityRatioB")} और समय का अनुपात ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} है। उत्पादन दर का अनुपात ज्ञात करें।`
        : `A ਅਤੇ B ਦੇ ਉਤਪਾਦਨ ਦਾ ਅਨੁਪਾਤ ${v(p, "quantityRatioA")}:${v(p, "quantityRatioB")} ਅਤੇ ਸਮੇਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "timeRatioA")}:${v(p, "timeRatioB")} ਹੈ। ਉਤਪਾਦਨ ਦਰ ਦਾ ਅਨੁਪਾਤ ਲੱਭੋ।`;
    case "RAP-QL-629":
      return hi
        ? `दो टीमें समान काम करती हैं। कामगारों का अनुपात ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} और दिनों का अनुपात ${v(p, "daysRatioA")}:${v(p, "daysRatioB")} है। किस टीम की प्रति कामगार कार्यक्षमता अधिक है?`
        : `ਦੋ ਟੀਮਾਂ ਇੱਕੋ ਕੰਮ ਕਰਦੀਆਂ ਹਨ। ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} ਅਤੇ ਦਿਨਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "daysRatioA")}:${v(p, "daysRatioB")} ਹੈ। ਕਿਸ ਟੀਮ ਦੀ ਪ੍ਰਤੀ ਮਜ਼ਦੂਰ ਕਾਰਗੁਜ਼ਾਰੀ ਵੱਧ ਹੈ?`;
    case "RAP-QL-630":
      return hi
        ? `दो टीमों में उत्पादन का अनुपात ${v(p, "outputRatioA")}:${v(p, "outputRatioB")}, कामगारों का अनुपात ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} और घंटों का अनुपात ${v(p, "hoursRatioA")}:${v(p, "hoursRatioB")} है। यदि A की कार्यक्षमता ${v(p, "efficiencyPartA")} भाग है, तो B की कार्यक्षमता ज्ञात करें।`
        : `ਦੋ ਟੀਮਾਂ ਵਿੱਚ ਉਤਪਾਦਨ ਦਾ ਅਨੁਪਾਤ ${v(p, "outputRatioA")}:${v(p, "outputRatioB")}, ਮਜ਼ਦੂਰਾਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "workerRatioA")}:${v(p, "workerRatioB")} ਅਤੇ ਘੰਟਿਆਂ ਦਾ ਅਨੁਪਾਤ ${v(p, "hoursRatioA")}:${v(p, "hoursRatioB")} ਹੈ। ਜੇ A ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ${v(p, "efficiencyPartA")} ਭਾਗ ਹੈ, ਤਾਂ B ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਲੱਭੋ।`;
    default:
      return undefined;
  }
}
