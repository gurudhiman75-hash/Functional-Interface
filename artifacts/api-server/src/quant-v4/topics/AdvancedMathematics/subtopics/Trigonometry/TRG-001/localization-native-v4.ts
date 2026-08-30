import { createHash } from "node:crypto";

import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";
import {
  TRG_001_LOCALIZATION_QL_IDS,
  trg001CanonicalSemanticFingerprint,
  type Trg001LocalizedLocale,
} from "./localization-v1";
import {
  localizeFrozenTrg001QuestionEditorialV3,
  trg001V3ResidualEnglishTokens,
} from "./localization-editorial-v3";

export const TRG_001_LOCALIZATION_NATIVE_V4_VERSION = "TRG001_HI_PA_LOCALIZATION_NATIVE_V4" as const;

type AnyQuestion = Record<string, any>;

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function finish(text: string) {
  return text
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim();
}

function polishHindi(input: unknown) {
  let text = String(input ?? "").trim();

  text = text
    .replace(/^का सटीक मान ज्ञात कीजिए (.+)\.$/u, "$1 का सटीक मान ज्ञात कीजिए।")
    .replace(/^मान ज्ञात कीजिए (.+) सटीक रूप से\.$/u, "$1 का सटीक मान ज्ञात कीजिए।")
    .replace(/^ज्ञात कीजिए (.+) सटीक रूप से\.$/u, "$1 का सटीक मान ज्ञात कीजिए।")
    .replace(/^ज्ञात कीजिए अधिकतम मान का (.+)\.$/u, "$1 का अधिकतम मान ज्ञात कीजिए।")
    .replace(/^वास्तविक θ के लिए, ज्ञात कीजिए न्यूनतम मान का (.+)\.$/u, "वास्तविक θ के लिए $1 का न्यूनतम मान ज्ञात कीजिए।")
    .replace(/^कौन-सा का निम्नलिखित त्रिकोणमितीय मान है परिभाषित\?$/u, "निम्नलिखित में से कौन-सा त्रिकोणमितीय मान परिभाषित है?")
    .replace(/^जहाँ व्यंजक है परिभाषित, (.+) है बराबर को:$/u, "जहाँ व्यंजक परिभाषित है, वहाँ $1 किसके बराबर है?")
    .replace(/^मान का (.+) का मान क्या है\?$/u, "$1 के बारे में सही कथन कौन-सा है?")
    .replace(/^के लिए ([^,]+), सरल कीजिए (.+)\.$/u, "यदि $1, तो $2 को सरल कीजिए।")
    .replace(/^के लिए (0°<θ<90°), ज्ञात कीजिए θ यदि (.+)\.$/u, "यदि $1 और $2, तो θ ज्ञात कीजिए।")
    .replace(/^न्यूनकोण θ के साथ (.+) के लिए, मान ज्ञात कीजिए (.+) सटीक रूप से\.$/u, "यदि θ न्यूनकोण है और $1, तो $2 का सटीक मान ज्ञात कीजिए।")
    .replace(/^ज्ञात कीजिए मान का (.+), जहाँ परिभाषित\.$/u, "जहाँ व्यंजक परिभाषित है, वहाँ $1 का मान ज्ञात कीजिए।");

  text = text
    .replace(/^यदि (.+), ज्ञात कीजिए (.+)\.$/u, "यदि $1, तो $2 ज्ञात कीजिए।")
    .replace(/^यदि (.+), मान ज्ञात कीजिए (.+)\.$/u, "यदि $1, तो $2 का मान ज्ञात कीजिए।")
    .replace(/^न्यूनकोण θ के लिए, ([^.]+)\. ज्ञात कीजिए (.+)\.$/u, "न्यूनकोण θ के लिए, यदि $1, तो $2 ज्ञात कीजिए।")
    .replace(/^न्यूनकोण θ के लिए, ([^.]+)\. मान ज्ञात कीजिए (.+)\.$/u, "न्यूनकोण θ के लिए, यदि $1, तो $2 का मान ज्ञात कीजिए।")
    .replace(/^वास्तविक θ के लिए, ज्ञात कीजिए (.+)\.$/u, "वास्तविक θ के लिए $1 ज्ञात कीजिए।");

  text = text
    .replace(/^एक समकोण त्रिभुज में, कर्ण है ([^,]+) और θ के सामने वाली भुजा है ([^.]+)\. ज्ञात कीजिए (.+)\.$/u,
      "एक समकोण त्रिभुज में कर्ण $1 है और θ के सामने वाली भुजा $2 है। $3 ज्ञात कीजिए।")
    .replace(/^एक समकोण त्रिभुज में, कर्ण है ([^,]+) और θ से सटी भुजा है ([^.]+)\. ज्ञात कीजिए (.+)\.$/u,
      "एक समकोण त्रिभुज में कर्ण $1 है और θ से सटी भुजा $2 है। $3 ज्ञात कीजिए।")
    .replace(/^यदि (.+) और कर्ण है ([^,]+), तो (.+) ज्ञात कीजिए।$/u,
      "यदि $1 और कर्ण $2 है, तो $3 ज्ञात कीजिए।")
    .replace(/^यदि (.+) और सटी हुई भुजा है ([^,]+), तो (.+) ज्ञात कीजिए।$/u,
      "यदि $1 और सटी हुई भुजा $2 है, तो $3 ज्ञात कीजिए।")
    .replace(/^एक समकोण त्रिभुज की भुजाएँ ([^;]+); ([^-]+)-इकाई भुजा है सामने θ\. ज्ञात कीजिए (.+)\.$/u,
      "एक समकोण त्रिभुज की भुजाएँ $1 हैं और $2-इकाई भुजा θ के सामने है। $3 ज्ञात कीजिए।")
    .replace(/^एक समकोण त्रिभुज की भुजाएँ ([^,]+), जहाँ ([0-9]+) इकाई वाली भुजा θ से सटी हुई है\. ज्ञात कीजिए (.+)\.$/u,
      "एक समकोण त्रिभुज की भुजाएँ $1 हैं, जहाँ $2 इकाई वाली भुजा θ से सटी हुई है। $3 ज्ञात कीजिए।")
    .replace(/^एक समकोण त्रिभुज में,θ के संदर्भ में (.+)\. ज्ञात कीजिए (.+)\.$/u,
      "एक समकोण त्रिभुज में θ के संदर्भ में $1। $2 ज्ञात कीजिए।");

  text = text
    .replace(/^प्रतिस्थापित करें (.+) से (.+)\.$/u, "$1 के स्थान पर $2 रखें।")
    .replace(/^न करें प्रतिस्थापित करें (.+) से (.+)\.$/u, "$1 के स्थान पर $2 न रखें।")
    .replace(/^भाग दें से (.+), तब (.+)\.$/u, "$1 से भाग दें, फिर $2।")
    .replace(/^भाग देने पर से (.+) (.+)\.$/u, "$1 से भाग देने पर $2।")
    .replace(/^माप गुणक है (.+)\.$/u, "माप गुणक $1 है।")
    .replace(/^स्केल है (.+)\.$/u, "माप गुणक $1 है।")
    .replace(/^सटी हुई अनुपात (.+) बन जाता है (.+), इसलिए स्केल है (.+)\.$/u,
      "सटी हुई भुजा के अनुपात में $1 भाग, $2 के बराबर हैं; इसलिए माप गुणक $3 है।")
    .replace(/^([0-9]+) अनुपात-भाग के बराबर हैं को ([^,]+), इसलिए स्केल है (.+)\.$/u,
      "अनुपात के $1 भाग $2 के बराबर हैं; इसलिए माप गुणक $3 है।")
    .replace(/^तुलना उलट जाता है जब टैन्जेंट पार करता है 1\.$/u,
      "tan θ का मान 1 से बड़ा होने पर तुलना की दिशा बदल जाती है।")
    .replace(/^व्युत्क्रम का (.+) है (.+)\.$/u, "$1 का व्युत्क्रम $2 है।")
    .replace(/^परास का (.+) है (.+)\.$/u, "$1 का परास $2 है।")
    .replace(/^के लिए (.+), अधिकतम है (.+)\.$/u, "$1 का अधिकतम मान $2 है।")
    .replace(/^के लिए (.+), न्यूनतम है (.+)\.$/u, "$1 का न्यूनतम मान $2 है।")
    .replace(/^मान ज्ञात कीजिए प्रत्येक घटक सटीक रूप से\.$/u, "प्रत्येक घटक का सटीक मान अलग-अलग ज्ञात कीजिए।")
    .replace(/^मान ज्ञात कीजिए दोनों व्युत्क्रम फलन सटीक रूप से\.$/u, "दोनों व्युत्क्रम फलनों के सटीक मान ज्ञात कीजिए।")
    .replace(/^भाग दें से ([^ ]+) को प्राप्त करें (.+)\.$/u, "$1 से भाग देने पर $2 प्राप्त होता है।")
    .replace(/^के लिए एक टैन्जेंट अंतर, हर प्रयोग करता है एक जोड़ चिह्न\.$/u, "tan के अंतर सूत्र में हर में जोड़ का चिह्न आता है।")
    .replace(/^हर का परिमेयकरण करें व्युत्क्रम सटीक रूप से; न करें बदलिए को एक दशमलव\.$/u, "व्युत्क्रम को सटीक रखने के लिए हर का परिमेयकरण करें; दशमलव में न बदलें।");

  text = text
    .replace(/हर है ([^,.;]+)\./gu, "हर $1 है।")
    .replace(/अंश है ([^,.;]+)\./gu, "अंश $1 है।")
    .replace(/उत्तर है ([^,.;]+)\./gu, "उत्तर $1 है।")
    .replace(/परिणाम है ([^,.;]+)\./gu, "परिणाम $1 है।")
    .replace(/सटीक उत्तर है ([^,.;]+)\./gu, "सटीक उत्तर $1 है।")
    .replace(/सटीक परिणाम है ([^,.;]+)\./gu, "सटीक परिणाम $1 है।")
    .replace(/सटीक मान है ([^,.;]+)\./gu, "सटीक मान $1 है।")
    .replace(/मान है ([^,.;]+)\./gu, "मान $1 है।")
    .replace(/कर्ण measures ([^,.;]+) इकाई/gu, "कर्ण $1 इकाई का है")
    .replace(/कर्ण है ([0-9√][^,.;]*)/gu, "कर्ण $1 है")
    .replace(/भुजा है ([0-9√][^,.;]*)/gu, "भुजा $1 है")
    .replace(/स्केल है ([0-9√/]+)/gu, "माप गुणक $1 है")
    .replace(/बराबर हैं को/gu, "के बराबर हैं")
    .replace(/बराबर है को/gu, "के बराबर है")
    .replace(/है बराबर को/gu, "के बराबर है")
    .replace(/हैं बराबर को/gu, "के बराबर हैं")
    .replace(/न करें ([^\s]+) करें/gu, "$1 न करें")
    .replace(/न कहें ([^,.]+) केवल क्योंकि/gu, "$1 केवल इस कारण न मानें कि")
    .replace(/ का ([A-Za-z][A-Za-z0-9²√()+\-/*θ αβγπ]*)/gu, " के $1")
    .replace(/ ज्ञात कीजिए ([A-Za-z][A-Za-z0-9²√()+\-/*θ αβγπ\s]*)\.$/u, " $1 ज्ञात कीजिए।");

  return finish(text);
}

function polishPunjabi(input: unknown) {
  let text = String(input ?? "").trim();

  text = text
    .replace(/^ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ (.+)\.$/u, "$1 ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਮਾਨ ਕੱਢੋ (.+) ਸਹੀ ਤੌਰ ਤੇ\.$/u, "$1 ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਕੱਢੋ (.+) ਸਹੀ ਤੌਰ ਤੇ\.$/u, "$1 ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਕੱਢੋ ਵੱਧ ਤੋਂ ਵੱਧ ਮਾਨ ਦਾ (.+)\.$/u, "$1 ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਵਾਸਤਵਿਕ θ ਲਈ, ਕੱਢੋ ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ ਦਾ (.+)\.$/u, "ਵਾਸਤਵਿਕ θ ਲਈ $1 ਦਾ ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਕਿਹੜਾ ਦਾ ਹੇਠਾਂ ਦਿੱਤੇ ਤਿਕੋਣਮਿਤੀ ਮਾਨ ਹੈ ਪਰਿਭਾਸ਼ਿਤ\?$/u, "ਹੇਠਾਂ ਦਿੱਤਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਤਿਕੋਣਮਿਤੀ ਮਾਨ ਪਰਿਭਾਸ਼ਿਤ ਹੈ?")
    .replace(/^ਜਿੱਥੇ ਵਿਅੰਜਕ ਹੈ ਪਰਿਭਾਸ਼ਿਤ, (.+) ਹੈ ਬਰਾਬਰ ਨੂੰ:$/u, "ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ਉੱਥੇ $1 ਕਿਸਦੇ ਬਰਾਬਰ ਹੈ?")
    .replace(/^ਮਾਨ ਦਾ (.+) ਦਾ ਮਾਨ ਕੀ ਹੈ\?$/u, "$1 ਬਾਰੇ ਸਹੀ ਕਥਨ ਕਿਹੜਾ ਹੈ?")
    .replace(/^ਲਈ ([^,]+), ਸਰਲ ਕਰੋ (.+)\.$/u, "ਜੇ $1, ਤਾਂ $2 ਨੂੰ ਸਰਲ ਕਰੋ।")
    .replace(/^ਲਈ (0°<θ<90°), ਕੱਢੋ θ ਜੇ (.+)\.$/u, "ਜੇ $1 ਅਤੇ $2, ਤਾਂ θ ਕੱਢੋ।")
    .replace(/^ਨਿਊਨ ਕੋਣ θ ਨਾਲ (.+) ਲਈ, ਮਾਨ ਕੱਢੋ (.+) ਸਹੀ ਤੌਰ ਤੇ\.$/u, "ਜੇ θ ਨਿਊਨ ਕੋਣ ਹੈ ਅਤੇ $1, ਤਾਂ $2 ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਕੱਢੋ ਮਾਨ ਦਾ (.+), ਜਿੱਥੇ ਪਰਿਭਾਸ਼ਿਤ\.$/u, "ਜਿੱਥੇ ਵਿਅੰਜਕ ਪਰਿਭਾਸ਼ਿਤ ਹੈ, ਉੱਥੇ $1 ਦਾ ਮਾਨ ਕੱਢੋ।");

  text = text
    .replace(/^ਜੇ (.+), ਕੱਢੋ (.+)\.$/u, "ਜੇ $1, ਤਾਂ $2 ਕੱਢੋ।")
    .replace(/^ਜੇ (.+), ਮਾਨ ਕੱਢੋ (.+)\.$/u, "ਜੇ $1, ਤਾਂ $2 ਦਾ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਨਿਊਨ ਕੋਣ θ ਲਈ, ([^.]+)\. ਕੱਢੋ (.+)\.$/u, "ਨਿਊਨ ਕੋਣ θ ਲਈ, ਜੇ $1, ਤਾਂ $2 ਕੱਢੋ।")
    .replace(/^ਨਿਊਨ ਕੋਣ θ ਲਈ, ([^.]+)\. ਮਾਨ ਕੱਢੋ (.+)\.$/u, "ਨਿਊਨ ਕੋਣ θ ਲਈ, ਜੇ $1, ਤਾਂ $2 ਦਾ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਵਾਸਤਵਿਕ θ ਲਈ, ਕੱਢੋ (.+)\.$/u, "ਵਾਸਤਵਿਕ θ ਲਈ $1 ਕੱਢੋ।");

  text = text
    .replace(/^ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ, ਕਰਣ ਹੈ ([^,]+) ਅਤੇ θ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਹੈ ([^.]+)\. ਕੱਢੋ (.+)\.$/u,
      "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ $1 ਹੈ ਅਤੇ θ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ $2 ਹੈ। $3 ਕੱਢੋ।")
    .replace(/^ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ, ਕਰਣ ਹੈ ([^,]+) ਅਤੇ θ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ ਹੈ ([^.]+)\. ਕੱਢੋ (.+)\.$/u,
      "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਕਰਣ $1 ਹੈ ਅਤੇ θ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ $2 ਹੈ। $3 ਕੱਢੋ।")
    .replace(/^ਜੇ (.+) ਅਤੇ ਕਰਣ ਹੈ ([^,]+), ਤਾਂ (.+) ਕੱਢੋ।$/u,
      "ਜੇ $1 ਅਤੇ ਕਰਣ $2 ਹੈ, ਤਾਂ $3 ਕੱਢੋ।")
    .replace(/^ਜੇ (.+) ਅਤੇ ਲੱਗਦੀ ਭੁਜਾ ਹੈ ([^,]+), ਤਾਂ (.+) ਕੱਢੋ।$/u,
      "ਜੇ $1 ਅਤੇ ਲੱਗਦੀ ਭੁਜਾ $2 ਹੈ, ਤਾਂ $3 ਕੱਢੋ।")
    .replace(/^ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ ([^;]+); ([^-]+)-ਇਕਾਈ ਭੁਜਾ ਹੈ ਸਾਹਮਣੇ θ\. ਕੱਢੋ (.+)\.$/u,
      "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ $1 ਹਨ ਅਤੇ $2-ਇਕਾਈ ਭੁਜਾ θ ਦੇ ਸਾਹਮਣੇ ਹੈ। $3 ਕੱਢੋ।")
    .replace(/^ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ ([^,]+), ਜਿੱਥੇ ([0-9]+) ਇਕਾਈ ਵਾਲੀ ਭੁਜਾ θ ਨਾਲ ਲੱਗਦੀ ਹੈ\. ਕੱਢੋ (.+)\.$/u,
      "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ $1 ਹਨ, ਜਿੱਥੇ $2 ਇਕਾਈ ਵਾਲੀ ਭੁਜਾ θ ਨਾਲ ਲੱਗਦੀ ਹੈ। $3 ਕੱਢੋ।")
    .replace(/^ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ,θ ਦੇ ਸਬੰਧ ਵਿੱਚ (.+)\. ਕੱਢੋ (.+)\.$/u,
      "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ θ ਦੇ ਸਬੰਧ ਵਿੱਚ $1। $2 ਕੱਢੋ।");

  text = text
    .replace(/^ਬਦਲੋ (.+) ਨਾਲ (.+)\.$/u, "$1 ਦੀ ਥਾਂ $2 ਰੱਖੋ।")
    .replace(/^ਨਾ ਕਰੋ ਬਦਲੋ (.+) ਨਾਲ (.+)\.$/u, "$1 ਦੀ ਥਾਂ $2 ਨਾ ਰੱਖੋ।")
    .replace(/^ਭਾਗ ਦਿਓ ਨਾਲ (.+), ਤਦ (.+)\.$/u, "$1 ਨਾਲ ਭਾਗ ਦਿਓ, ਫਿਰ $2।")
    .replace(/^ਭਾਗ ਦੇਣ ਤੇ ਨਾਲ (.+) (.+)\.$/u, "$1 ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ $2।")
    .replace(/^ਸਕੇਲ ਗੁਣਕ ਹੈ (.+)\.$/u, "ਸਕੇਲ ਗੁਣਕ $1 ਹੈ।")
    .replace(/^ਲੱਗਦੀ ਅਨੁਪਾਤ (.+) ਬਣ ਜਾਂਦਾ ਹੈ (.+), ਇਸ ਲਈ ਸਕੇਲ ਗੁਣਕ ਹੈ (.+)\.$/u,
      "ਲੱਗਦੀ ਭੁਜਾ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ $1 ਭਾਗ, $2 ਦੇ ਬਰਾਬਰ ਹਨ; ਇਸ ਲਈ ਸਕੇਲ ਗੁਣਕ $3 ਹੈ।")
    .replace(/^([0-9]+) ਅਨੁਪਾਤ-ਭਾਗ ਦੇ ਬਰਾਬਰ ਹਨ ਨੂੰ ([^,]+), ਇਸ ਲਈ ਸਕੇਲ ਗੁਣਕ ਹੈ (.+)\.$/u,
      "ਅਨੁਪਾਤ ਦੇ $1 ਭਾਗ $2 ਦੇ ਬਰਾਬਰ ਹਨ; ਇਸ ਲਈ ਸਕੇਲ ਗੁਣਕ $3 ਹੈ।")
    .replace(/^ਤੁਲਨਾ ਉਲਟ ਜਾਂਦੀ ਹੈ ਜਦੋਂ ਟੈਂਜੈਂਟ ਪਾਰ ਕਰਦਾ ਹੈ 1\.$/u,
      "tan θ ਦਾ ਮਾਨ 1 ਤੋਂ ਵੱਡਾ ਹੋਣ ਤੇ ਤੁਲਨਾ ਦੀ ਦਿਸ਼ਾ ਬਦਲ ਜਾਂਦੀ ਹੈ।")
    .replace(/^ਪਰਸਪਰ ਦਾ (.+) ਹੈ (.+)\.$/u, "$1 ਦਾ ਪਰਸਪਰ $2 ਹੈ।")
    .replace(/^ਪਰਾਸ ਦਾ (.+) ਹੈ (.+)\.$/u, "$1 ਦਾ ਪਰਾਸ $2 ਹੈ।")
    .replace(/^ਲਈ (.+), ਵੱਧ ਤੋਂ ਵੱਧ ਹੈ (.+)\.$/u, "$1 ਦਾ ਵੱਧ ਤੋਂ ਵੱਧ ਮਾਨ $2 ਹੈ।")
    .replace(/^ਲਈ (.+), ਘੱਟ ਤੋਂ ਘੱਟ ਹੈ (.+)\.$/u, "$1 ਦਾ ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ $2 ਹੈ।")
    .replace(/^ਮਾਨ ਕੱਢੋ ਹਰੇਕ ਘਟਕ ਸਹੀ ਤੌਰ ਤੇ\.$/u, "ਹਰੇਕ ਘਟਕ ਦਾ ਸਹੀ ਮਾਨ ਵੱਖ-ਵੱਖ ਕੱਢੋ।")
    .replace(/^ਮਾਨ ਕੱਢੋ ਦੋਵੇਂ ਪਰਸਪਰ ਫੰਕਸ਼ਨ ਸਹੀ ਤੌਰ ਤੇ\.$/u, "ਦੋਵੇਂ ਪਰਸਪਰ ਫੰਕਸ਼ਨਾਂ ਦੇ ਸਹੀ ਮਾਨ ਕੱਢੋ।")
    .replace(/^ਭਾਗ ਦਿਓ ਨਾਲ ([^ ]+) ਨੂੰ ਪ੍ਰਾਪਤ ਕਰੋ (.+)\.$/u, "$1 ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ $2 ਮਿਲਦਾ ਹੈ।")
    .replace(/^ਲਈ ਇੱਕ ਟੈਂਜੈਂਟ ਅੰਤਰ, ਹਰ ਵਰਤਦਾ ਹੈ ਇੱਕ ਜੋੜ ਚਿੰਨ੍ਹ\.$/u, "tan ਦੇ ਅੰਤਰ ਵਾਲੇ ਸੂਤਰ ਵਿੱਚ ਹਰ ਵਿੱਚ ਜੋੜ ਦਾ ਚਿੰਨ੍ਹ ਆਉਂਦਾ ਹੈ।")
    .replace(/^ਹਰ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ ਪਰਸਪਰ ਸਹੀ ਤੌਰ ਤੇ; ਨਾ ਕਰੋ ਬਦਲੋ ਨੂੰ ਇੱਕ ਦਸ਼ਮਲਵ\.$/u, "ਪਰਸਪਰ ਮਾਨ ਨੂੰ ਸਹੀ ਰੱਖਣ ਲਈ ਹਰ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ; ਦਸ਼ਮਲਵ ਵਿੱਚ ਨਾ ਬਦਲੋ।");

  text = text
    .replace(/ਹਰ ਹੈ ([^,.;]+)\./gu, "ਹਰ $1 ਹੈ।")
    .replace(/ਅੰਸ਼ ਹੈ ([^,.;]+)\./gu, "ਅੰਸ਼ $1 ਹੈ।")
    .replace(/ਉੱਤਰ ਹੈ ([^,.;]+)\./gu, "ਉੱਤਰ $1 ਹੈ।")
    .replace(/ਨਤੀਜਾ ਹੈ ([^,.;]+)\./gu, "ਨਤੀਜਾ $1 ਹੈ।")
    .replace(/ਸਹੀ ਉੱਤਰ ਹੈ ([^,.;]+)\./gu, "ਸਹੀ ਉੱਤਰ $1 ਹੈ।")
    .replace(/ਸਹੀ ਨਤੀਜਾ ਹੈ ([^,.;]+)\./gu, "ਸਹੀ ਨਤੀਜਾ $1 ਹੈ।")
    .replace(/ਸਹੀ ਮਾਨ ਹੈ ([^,.;]+)\./gu, "ਸਹੀ ਮਾਨ $1 ਹੈ।")
    .replace(/ਮਾਨ ਹੈ ([^,.;]+)\./gu, "ਮਾਨ $1 ਹੈ।")
    .replace(/ਕਰਣ measures ([^,.;]+) ਇਕਾਈ/gu, "ਕਰਣ $1 ਇਕਾਈ ਦਾ ਹੈ")
    .replace(/ਕਰਣ ਹੈ ([0-9√][^,.;]*)/gu, "ਕਰਣ $1 ਹੈ")
    .replace(/ਭੁਜਾ ਹੈ ([0-9√][^,.;]*)/gu, "ਭੁਜਾ $1 ਹੈ")
    .replace(/ਸਕੇਲ ਗੁਣਕ ਹੈ ([0-9√/]+)/gu, "ਸਕੇਲ ਗੁਣਕ $1 ਹੈ")
    .replace(/ਬਰਾਬਰ ਹਨ ਨੂੰ/gu, "ਦੇ ਬਰਾਬਰ ਹਨ")
    .replace(/ਬਰਾਬਰ ਹੈ ਨੂੰ/gu, "ਦੇ ਬਰਾਬਰ ਹੈ")
    .replace(/ਹੈ ਬਰਾਬਰ ਨੂੰ/gu, "ਦੇ ਬਰਾਬਰ ਹੈ")
    .replace(/ਹਨ ਬਰਾਬਰ ਨੂੰ/gu, "ਦੇ ਬਰਾਬਰ ਹਨ")
    .replace(/ਨਾ ਕਰੋ ([^\s]+) ਕਰੋ/gu, "$1 ਨਾ ਕਰੋ")
    .replace(/ ਨਾ ਕਹੋ ([^,.]+) ਕੇਵਲ ਕਿਉਂਕਿ/gu, "$1 ਨੂੰ ਕੇਵਲ ਇਸ ਕਰਕੇ ਨਾ ਮੰਨੋ ਕਿ")
    .replace(/ ਦਾ ([A-Za-z][A-Za-z0-9²√()+\-/*θ αβγπ]*)/gu, " ਦੇ $1")
    .replace(/ ਕੱਢੋ ([A-Za-z][A-Za-z0-9²√()+\-/*θ αβγπ\s]*)\.$/u, " $1 ਕੱਢੋ।");

  return finish(text);
}

export function polishTrg001LocalizedV4(value: unknown, locale: Trg001LocalizedLocale) {
  return locale === "hi-IN" ? polishHindi(value) : polishPunjabi(value);
}

function mapExplanation(explanation: AnyQuestion, locale: Trg001LocalizedLocale) {
  return {
    ...explanation,
    keyRule: polishTrg001LocalizedV4(explanation?.keyRule, locale),
    steps: explanation.steps.map((step: AnyQuestion) => ({
      ...step,
      title: polishTrg001LocalizedV4(step.title, locale),
      body: polishTrg001LocalizedV4(step.body, locale),
    })),
    shortcut: polishTrg001LocalizedV4(explanation?.shortcut, locale),
    traps: explanation.traps.map((trap: unknown) => polishTrg001LocalizedV4(trap, locale)),
  };
}

export function localizeFrozenTrg001QuestionNativeV4(canonicalQuestion: AnyQuestion, locale: Trg001LocalizedLocale) {
  const v3 = localizeFrozenTrg001QuestionEditorialV3(canonicalQuestion, locale) as AnyQuestion;
  const stem = polishTrg001LocalizedV4(v3.stem, locale);
  const explanation = mapExplanation(v3.explanation, locale);
  const options = v3.options.map((option: AnyQuestion) => ({
    ...option,
    display: polishTrg001LocalizedV4(option.display, locale),
  }));
  const localizedAnswerDisplay = polishTrg001LocalizedV4(v3.localizedAnswerDisplay, locale);
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(v3);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_NATIVE_V4_VERSION,
    locale,
    qlId: v3.qlId,
    seed: v3.seed,
    canonicalSemanticFingerprint,
    stem,
    explanation,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
  });

  return {
    ...v3,
    stem,
    explanation,
    options,
    localizedAnswerDisplay,
    reviewStatus: "LOCALIZATION_NATIVE_REVIEW_CANDIDATE_V4" as const,
    localizationLifecycle: {
      ...v3.localizationLifecycle,
      version: TRG_001_LOCALIZATION_NATIVE_V4_VERSION,
      hindiPunjabi: "NATIVE_REVIEW_CANDIDATE_V4" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...v3.localizationProof,
      localizationFingerprint,
      learnerSurfaceSource: "FROZEN_ENGLISH_144_WITH_NATIVE_SENTENCE_TEMPLATE_V4" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionNativeV4(
  qlId: string,
  seed: string,
  locale: Trg001LocalizedLocale,
) {
  if (!TRG_001_LOCALIZATION_QL_IDS.includes(qlId)) {
    throw new Error(`${qlId}: outside TRG-001 localization scope.`);
  }
  return localizeFrozenTrg001QuestionNativeV4(
    generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion,
    locale,
  );
}

export function trg001V4ResidualEnglishTokens(value: unknown) {
  return trg001V3ResidualEnglishTokens(value);
}
