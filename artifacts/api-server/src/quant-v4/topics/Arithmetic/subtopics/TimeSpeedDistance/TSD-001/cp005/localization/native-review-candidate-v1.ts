import type { Rational } from "../../foundation/rational";
import { subtract } from "../../foundation/rational";
import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q } from "../english-approved-freeze-v13";
import {
  assertTsdCp005NativeText,
  cp005Duration,
  cp005Km,
  cp005NativeActor,
  cp005NativeContextIntro,
  cp005Ratio,
  cp005Speed,
  localizeCp005Choice,
  type TsdCp005NativeLanguage,
} from "./native-primitives-v1";

export const TSD_CP005_NATIVE_REVIEW_STATUS = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V1" as const;

type EnglishRow = (typeof TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q)[number];

export type TsdCp005NativeReviewPresentationV1 = Readonly<{
  language: TsdCp005NativeLanguage;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  answerText: string;
  explanation: Readonly<{
    method: string;
    steps: readonly string[];
    shortcut: string;
    finalAnswer: string;
  }>;
  lifecycle: Readonly<{
    nativeReviewStatus: typeof TSD_CP005_NATIVE_REVIEW_STATUS;
    multilingualFreezeStatus: "UNFROZEN";
    productOwnerApprovalRecorded: false;
    questionStudioEnabled: false;
    questionBankStatus: "NOT_STORED";
    testEligibility: "INELIGIBLE";
    publiclyPublishable: false;
  }>;
}>;

export type TsdCp005NativeReviewRowV1 = Readonly<{
  source: EnglishRow;
  presentation: TsdCp005NativeReviewPresentationV1;
}>;

function req(value: Rational | undefined, label: string): Rational {
  if (!value) throw new Error(`CP005 native candidate missing ${label}`);
  return value;
}

function intro(source: EnglishRow, language: TsdCp005NativeLanguage): string {
  return cp005NativeContextIntro(source.objectFamily, source.endpointFamily, source.objectTopology, language);
}

function actors(source: EnglishRow, language: TsdCp005NativeLanguage): readonly [string, string] {
  return [
    cp005NativeActor(source.objectFamily, "A", language),
    cp005NativeActor(source.objectFamily, "B", language),
  ] as const;
}

function nativeStem(source: EnglishRow, language: TsdCp005NativeLanguage, ordinal: number): string {
  const hi = language === "hi";
  const input = source.input;
  const [a, b] = actors(source, language);
  const lead = intro(source, language);
  const v = ordinal % 6;
  const L = input.routeDistance ? cp005Km(input.routeDistance) : "";
  const u = input.speedA ? cp005Speed(input.speedA) : "";
  const w = input.speedB ? cp005Speed(input.speedB) : "";
  const tA = input.postMeetingTimeA ? cp005Duration(input.postMeetingTimeA, language) : "";
  const tB = input.postMeetingTimeB ? cp005Duration(input.postMeetingTimeB, language) : "";

  switch (source.permanentQlId) {
    case "TSD-QL-058": {
      const hiBodies = [
        `${a} P से और ${b} Q से एक साथ चलते हैं। मिलने के बाद ${a} को Q पहुँचने में ${tA} और ${b} को P पहुँचने में ${tB} लगते हैं। गति अनुपात A:B ज्ञात कीजिए।`,
        `P और Q से क्रमशः ${a} और ${b} एक ही समय चलना शुरू करते हैं। मिलने के बाद शेष यात्रा के समय ${tA} और ${tB} हैं। उनकी गतियों का अनुपात A:B निकालिए।`,
        `दोनों विपरीत सिरों से साथ चलकर एक बार मिलते हैं। इसके बाद ${a} Q तक ${tA} में और ${b} P तक ${tB} में पहुँचता है। A:B गति अनुपात क्या है?`,
        `${a} और ${b} विपरीत दिशाओं से चलकर रास्ते में मिलते हैं। मुलाकात के बाद उनके शेष समय क्रमशः ${tA} और ${tB} हैं। A:B ज्ञात कीजिए।`,
        `मिलने के बाद ${a} की शेष यात्रा ${tA} की है, जबकि ${b} की शेष यात्रा ${tB} की है। दोनों ने P और Q से एक साथ शुरुआत की थी। गति अनुपात A:B निकालिए।`,
        `P और Q से एक साथ शुरू होकर ${a} और ${b} मिलते हैं। फिर ${a} Q पर ${tA} बाद और ${b} P पर ${tB} बाद पहुँचता है। उनकी गति का अनुपात A:B क्या होगा?`,
      ];
      const paBodies = [
        `${a} P ਤੋਂ ਅਤੇ ${b} Q ਤੋਂ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${a} ਨੂੰ Q ਪਹੁੰਚਣ ਵਿੱਚ ${tA} ਅਤੇ ${b} ਨੂੰ P ਪਹੁੰਚਣ ਵਿੱਚ ${tB} ਲੱਗਦੇ ਹਨ। ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ A:B ਕੱਢੋ।`,
        `P ਅਤੇ Q ਤੋਂ ਕ੍ਰਮਵਾਰ ${a} ਅਤੇ ${b} ਇੱਕੋ ਸਮੇਂ ਚੱਲਦੇ ਹਨ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਸਫ਼ਰ ਦੇ ਸਮੇਂ ${tA} ਅਤੇ ${tB} ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ A:B ਕੱਢੋ।`,
        `ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚੱਲ ਕੇ ਇੱਕ ਵਾਰ ਮਿਲਦੇ ਹਨ। ਫਿਰ ${a} Q ਤੱਕ ${tA} ਵਿੱਚ ਅਤੇ ${b} P ਤੱਕ ${tB} ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ। A:B ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `${a} ਅਤੇ ${b} ਵਿਰੋਧੀ ਪਾਸਿਆਂ ਤੋਂ ਚੱਲ ਕੇ ਰਸਤੇ ਵਿੱਚ ਮਿਲਦੇ ਹਨ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਉਨ੍ਹਾਂ ਦੇ ਬਾਕੀ ਸਮੇਂ ਕ੍ਰਮਵਾਰ ${tA} ਅਤੇ ${tB} ਹਨ। A:B ਕੱਢੋ।`,
        `ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${a} ਦਾ ਬਾਕੀ ਸਫ਼ਰ ${tA} ਦਾ ਹੈ, ਜਦਕਿ ${b} ਦਾ ਬਾਕੀ ਸਫ਼ਰ ${tB} ਦਾ ਹੈ। ਦੋਵਾਂ ਨੇ P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕੀਤਾ ਸੀ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ A:B ਕੱਢੋ।`,
        `P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਹੋ ਕੇ ${a} ਅਤੇ ${b} ਮਿਲਦੇ ਹਨ। ਫਿਰ ${a} Q ਉੱਤੇ ${tA} ਬਾਅਦ ਅਤੇ ${b} P ਉੱਤੇ ${tB} ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ A:B ਕੀ ਹੋਵੇਗਾ?`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-059": {
      const ratio = cp005Ratio(req(input.speedRatio, "speedRatio"));
      const target = input.targetPostBody === "B" ? b : a;
      const endpoint = input.targetPostBody === "B" ? "P" : "Q";
      const hiBodies = [
        `P–Q की दूरी ${L} है। ${a} की गति ${u} है और गति अनुपात A:B = ${ratio} है। पहली मुलाकात के बाद ${target} को ${endpoint} तक पहुँचने में कितना समय लगेगा?`,
        `${a} P से और ${b} Q से एक साथ चलते हैं। मार्ग ${L} है, ${a} की गति ${u} तथा A:B = ${ratio} है। मिलने के बाद ${target} की शेष यात्रा का समय ज्ञात कीजिए।`,
        `दोनों विपरीत सिरों से चलकर मिलते हैं। कुल दूरी ${L}, ${a} की गति ${u} और गति अनुपात ${ratio} है। ${target} को मिलने के बाद दूसरे सिरे तक पहुँचने में कितना समय चाहिए?`,
        `यदि P–Q = ${L}, ${a} की गति ${u} और A:B = ${ratio} हो, तो मुलाकात के बाद ${target} का ${endpoint} तक का समय निकालिए।`,
        `${a} और ${b} एक साथ विपरीत सिरों से निकलते हैं। ${a} ${u} से चलता है और उनका गति अनुपात ${ratio} है। ${L} के मार्ग पर मिलने के बाद ${target} का शेष समय कितना है?`,
        `${L} लंबे मार्ग पर गति अनुपात A:B = ${ratio} है और ${a} की गति ${u} है। पहली मुलाकात हो जाने के बाद ${target} ${endpoint} पर कितने समय में पहुँचेगा?`,
      ];
      const paBodies = [
        `P–Q ਦੀ ਦੂਰੀ ${L} ਹੈ। ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਹੈ ਅਤੇ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ A:B = ${ratio} ਹੈ। ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ${target} ਨੂੰ ${endpoint} ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
        `${a} P ਤੋਂ ਅਤੇ ${b} Q ਤੋਂ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। ਰਸਤਾ ${L} ਹੈ, ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ A:B = ${ratio} ਹੈ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${target} ਦੇ ਬਾਕੀ ਸਫ਼ਰ ਦਾ ਸਮਾਂ ਕੱਢੋ।`,
        `ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਚੱਲ ਕੇ ਮਿਲਦੇ ਹਨ। ਕੁੱਲ ਦੂਰੀ ${L}, ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${target} ਨੂੰ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਦੂਜੇ ਸਿਰੇ ਤੱਕ ਪਹੁੰਚਣ ਲਈ ਕਿੰਨਾ ਸਮਾਂ ਚਾਹੀਦਾ ਹੈ?`,
        `ਜੇ P–Q = ${L}, ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ A:B = ${ratio} ਹੋਵੇ, ਤਾਂ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ${target} ਦਾ ${endpoint} ਤੱਕ ਦਾ ਸਮਾਂ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਨਿਕਲਦੇ ਹਨ। ${a} ${u} ਨਾਲ ਚਲਦਾ ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦਾ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${ratio} ਹੈ। ${L} ਦੇ ਰਸਤੇ ਉੱਤੇ ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${target} ਦਾ ਬਾਕੀ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`,
        `${L} ਲੰਮੇ ਰਸਤੇ ਉੱਤੇ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ A:B = ${ratio} ਹੈ ਅਤੇ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਹੈ। ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ${target} ${endpoint} ਉੱਤੇ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪਹੁੰਚੇਗਾ?`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-060": {
      const hiBodies = [
        `${a} की गति ${u} है। मिलने के बाद ${a} को Q तक ${tA} और ${b} को P तक ${tB} लगते हैं। P–Q की दूरी ज्ञात कीजिए।`,
        `${a} और ${b} विपरीत सिरों से एक साथ चलकर मिलते हैं। ${a} ${u} से चलता है; मुलाकात के बाद शेष समय ${tA} और ${tB} हैं। मार्ग की कुल लंबाई निकालिए।`,
        `मुलाकात के बाद ${a} Q पर ${tA} में तथा ${b} P पर ${tB} में पहुँचता है। यदि ${a} की गति ${u} है, तो P और Q कितनी दूर हैं?`,
        `दोनों की पहली मुलाकात के बाद यात्रा पूरी करने के समय क्रमशः ${tA} और ${tB} हैं। ${a} की गति ${u} दी गई है। P–Q ज्ञात कीजिए।`,
        `${a} P से ${u} की गति से चलता है और ${b} Q से उसी समय शुरू करता है। मिलने के बाद उनके शेष समय ${tA} और ${tB} हैं। कुल दूरी कितनी है?`,
        `P और Q से साथ शुरू करने के बाद दोनों मिलते हैं। ${a} की गति ${u} है और मुलाकात के बाद पहुँचने के समय ${tA}, ${tB} हैं। P–Q की लंबाई निकालिए।`,
      ];
      const paBodies = [
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਹੈ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${a} ਨੂੰ Q ਤੱਕ ${tA} ਅਤੇ ${b} ਨੂੰ P ਤੱਕ ${tB} ਲੱਗਦੇ ਹਨ। P–Q ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚੱਲ ਕੇ ਮਿਲਦੇ ਹਨ। ${a} ${u} ਨਾਲ ਚਲਦਾ ਹੈ; ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਸਮੇਂ ${tA} ਅਤੇ ${tB} ਹਨ। ਰਸਤੇ ਦੀ ਕੁੱਲ ਲੰਬਾਈ ਕੱਢੋ।`,
        `ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ${a} Q ਉੱਤੇ ${tA} ਵਿੱਚ ਅਤੇ ${b} P ਉੱਤੇ ${tB} ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ। ਜੇ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਹੈ, ਤਾਂ P ਅਤੇ Q ਕਿੰਨੀ ਦੂਰ ਹਨ?`,
        `ਦੋਵਾਂ ਦੀ ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਸਫ਼ਰ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਕ੍ਰਮਵਾਰ ${tA} ਅਤੇ ${tB} ਹਨ। ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਦਿੱਤੀ ਹੈ। P–Q ਕੱਢੋ।`,
        `${a} P ਤੋਂ ${u} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚਲਦਾ ਹੈ ਅਤੇ ${b} Q ਤੋਂ ਉਸੇ ਵੇਲੇ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਉਨ੍ਹਾਂ ਦੇ ਬਾਕੀ ਸਮੇਂ ${tA} ਅਤੇ ${tB} ਹਨ। ਕੁੱਲ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`,
        `P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਬਾਅਦ ਦੋਵੇਂ ਮਿਲਦੇ ਹਨ। ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਹੈ ਅਤੇ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ${tA}, ${tB} ਹਨ। P–Q ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-061": {
      const hiBodies = [
        `P–Q की दूरी ${L} है। मिलने के बाद ${a} को Q पहुँचने में ${tA} और ${b} को P पहुँचने में ${tB} लगते हैं। दोनों की गतियाँ ज्ञात कीजिए।`,
        `${L} लंबे मार्ग के विपरीत सिरों से दोनों एक साथ चलते हैं। मुलाकात के बाद शेष समय ${a} के लिए ${tA} और ${b} के लिए ${tB} है। उनकी गतियाँ निकालिए।`,
        `दोनों ${L} की दूरी पर स्थित P और Q से चलकर मिलते हैं। इसके बाद ${a} ${tA} में और ${b} ${tB} में अपनी यात्रा पूरी करता है। दोनों की गति क्या है?`,
        `मार्ग की लंबाई ${L} है। पहली मुलाकात के बाद पहुँचने के समय क्रमशः ${tA} और ${tB} हैं। ${a} और ${b} की गतियाँ ज्ञात कीजिए।`,
        `${a} P से और ${b} Q से एक साथ शुरू करते हैं। P–Q = ${L}; मुलाकात के बाद उनके शेष समय ${tA} और ${tB} हैं। गति निकालिए।`,
        `विपरीत सिरों से चलने वाले ${a} और ${b} ${L} के मार्ग पर मिलते हैं। शेष यात्राएँ ${tA} और ${tB} में पूरी होती हैं। दोनों की गति ज्ञात कीजिए।`,
      ];
      const paBodies = [
        `P–Q ਦੀ ਦੂਰੀ ${L} ਹੈ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${a} ਨੂੰ Q ਪਹੁੰਚਣ ਵਿੱਚ ${tA} ਅਤੇ ${b} ਨੂੰ P ਪਹੁੰਚਣ ਵਿੱਚ ${tB} ਲੱਗਦੇ ਹਨ। ਦੋਵਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕੱਢੋ।`,
        `${L} ਲੰਮੇ ਰਸਤੇ ਦੇ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਦੋਵੇਂ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਸਮਾਂ ${a} ਲਈ ${tA} ਅਤੇ ${b} ਲਈ ${tB} ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕੱਢੋ।`,
        `ਦੋਵੇਂ ${L} ਦੀ ਦੂਰੀ ਉੱਤੇ P ਅਤੇ Q ਤੋਂ ਚੱਲ ਕੇ ਮਿਲਦੇ ਹਨ। ਫਿਰ ${a} ${tA} ਵਿੱਚ ਅਤੇ ${b} ${tB} ਵਿੱਚ ਆਪਣਾ ਸਫ਼ਰ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`,
        `ਰਸਤੇ ਦੀ ਲੰਬਾਈ ${L} ਹੈ। ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਕ੍ਰਮਵਾਰ ${tA} ਅਤੇ ${tB} ਹਨ। ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕੱਢੋ।`,
        `${a} P ਤੋਂ ਅਤੇ ${b} Q ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। P–Q = ${L}; ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਉਨ੍ਹਾਂ ਦੇ ਬਾਕੀ ਸਮੇਂ ${tA} ਅਤੇ ${tB} ਹਨ। ਰਫ਼ਤਾਰਾਂ ਕੱਢੋ।`,
        `ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਚੱਲਣ ਵਾਲੇ ${a} ਅਤੇ ${b} ${L} ਦੇ ਰਸਤੇ ਉੱਤੇ ਮਿਲਦੇ ਹਨ। ਬਾਕੀ ਸਫ਼ਰ ${tA} ਅਤੇ ${tB} ਵਿੱਚ ਪੂਰੇ ਹੁੰਦੇ ਹਨ। ਦੋਵਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕੱਢੋ।`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-062": {
      const hiBodies = [
        `P–Q = ${L} है। मिलने के बाद ${a} को Q तक ${tA} और ${b} को P तक ${tB} लगते हैं। पहली मुलाकात P से कितनी दूर हुई?`,
        `${L} लंबे मार्ग पर दोनों विपरीत सिरों से एक साथ चलते हैं। मुलाकात के बाद शेष समय ${tA} और ${tB} हैं। मिलने का बिंदु P से ज्ञात कीजिए।`,
        `दोनों एक बार मिलते हैं; फिर ${a} Q पर ${tA} में और ${b} P पर ${tB} में पहुँचता है। P–Q की दूरी ${L} है। मिलने का स्थान P से कितनी दूरी पर है?`,
        `P और Q ${L} दूर हैं। मुलाकात के बाद ${a} की शेष यात्रा ${tA} और ${b} की ${tB} है। पहली मुलाकात का बिंदु P से निकालिए।`,
        `${a} P से और ${b} Q से साथ चलते हैं। मार्ग ${L} है। मिलने के बाद उनके समय ${tA} और ${tB} हैं। P से मिलने की दूरी ज्ञात कीजिए।`,
        `यदि कुल दूरी ${L} और मुलाकात के बाद पहुँचने के समय ${tA}, ${tB} हों, तो P से पहली मुलाकात की दूरी कितनी है?`,
      ];
      const paBodies = [
        `P–Q = ${L} ਹੈ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ${a} ਨੂੰ Q ਤੱਕ ${tA} ਅਤੇ ${b} ਨੂੰ P ਤੱਕ ${tB} ਲੱਗਦੇ ਹਨ। ਪਹਿਲੀ ਮੁਲਾਕਾਤ P ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਹੋਈ?`,
        `${L} ਲੰਮੇ ਰਸਤੇ ਉੱਤੇ ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਸਮੇਂ ${tA} ਅਤੇ ${tB} ਹਨ। ਮਿਲਣ ਦਾ ਬਿੰਦੂ P ਤੋਂ ਕੱਢੋ।`,
        `ਦੋਵੇਂ ਇੱਕ ਵਾਰ ਮਿਲਦੇ ਹਨ; ਫਿਰ ${a} Q ਉੱਤੇ ${tA} ਵਿੱਚ ਅਤੇ ${b} P ਉੱਤੇ ${tB} ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ। P–Q ਦੀ ਦੂਰੀ ${L} ਹੈ। ਮਿਲਣ ਦੀ ਥਾਂ P ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਹੈ?`,
        `P ਅਤੇ Q ${L} ਦੂਰ ਹਨ। ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ${a} ਦਾ ਬਾਕੀ ਸਫ਼ਰ ${tA} ਅਤੇ ${b} ਦਾ ${tB} ਹੈ। ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਦਾ ਬਿੰਦੂ P ਤੋਂ ਕੱਢੋ।`,
        `${a} P ਤੋਂ ਅਤੇ ${b} Q ਤੋਂ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। ਰਸਤਾ ${L} ਹੈ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਉਨ੍ਹਾਂ ਦੇ ਸਮੇਂ ${tA} ਅਤੇ ${tB} ਹਨ। P ਤੋਂ ਮਿਲਣ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        `ਜੇ ਕੁੱਲ ਦੂਰੀ ${L} ਅਤੇ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ${tA}, ${tB} ਹੋਣ, ਤਾਂ P ਤੋਂ ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-063": {
      const n = input.nthMeeting ?? 2;
      const commonHi = `${a} P से ${u} और ${b} Q से ${w} की गति से एक साथ चलते हैं। P–Q = ${L} है और दोनों सिरों पर बिना रुके तुरंत दिशा बदलते हैं।`;
      const commonPa = `${a} P ਤੋਂ ${u} ਅਤੇ ${b} Q ਤੋਂ ${w} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। P–Q = ${L} ਹੈ ਅਤੇ ਦੋਵੇਂ ਸਿਰਿਆਂ ਉੱਤੇ ਬਿਨਾਂ ਰੁਕੇ ਤੁਰੰਤ ਦਿਸ਼ਾ ਬਦਲਦੇ ਹਨ।`;
      if (source.solveMode === "findTimeBetweenFirstAndSecondMeetings") return `${lead} ${hi ? commonHi + " पहली और दूसरी मुलाकात के बीच का समय ज्ञात कीजिए।" : commonPa + " ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਮੁਲਾਕਾਤ ਵਿਚਕਾਰ ਦਾ ਸਮਾਂ ਕੱਢੋ।"}`;
      if (source.solveMode === "findNthMeetingTimeOnLine") return `${lead} ${hi ? commonHi + ` उनकी ${n}वीं मुलाकात शुरू होने के कितने समय बाद होगी?` : commonPa + ` ਉਨ੍ਹਾਂ ਦੀ ${n}ਵੀਂ ਮੁਲਾਕਾਤ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਹੋਵੇਗੀ?`}`;
      return `${lead} ${hi ? commonHi + " उनकी दूसरी मुलाकात शुरू होने के कितने समय बाद होगी?" : commonPa + " ਉਨ੍ਹਾਂ ਦੀ ਦੂਜੀ ਮੁਲਾਕਾਤ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਹੋਵੇਗੀ?"}`;
    }

    case "TSD-QL-064": {
      const n = input.nthMeeting ?? 2;
      const commonHi = `${a} P से ${u} और ${b} Q से ${w} पर एक साथ चलते हैं। P–Q = ${L} है और हर सिरे पर तुरंत लौटते हैं।`;
      const commonPa = `${a} P ਤੋਂ ${u} ਅਤੇ ${b} Q ਤੋਂ ${w} ਨਾਲ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। P–Q = ${L} ਹੈ ਅਤੇ ਹਰ ਸਿਰੇ ਉੱਤੇ ਤੁਰੰਤ ਮੁੜਦੇ ਹਨ।`;
      return `${lead} ${hi ? commonHi + ` उनकी ${n}वीं मुलाकात P से कितनी दूर होगी?` : commonPa + ` ਉਨ੍ਹਾਂ ਦੀ ${n}ਵੀਂ ਮੁਲਾਕਾਤ P ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਹੋਵੇਗੀ?`}`;
    }

    case "TSD-QL-065": {
      const window = cp005Duration(req(input.timeWindow, "timeWindow"), language);
      const hiBodies = [
        `${a} P से ${u} और ${b} Q से ${w} पर चलते हैं; P–Q = ${L} है। दोनों सिरों पर तुरंत लौटते हैं। पहले ${window} में वे कितनी बार मिलेंगे?`,
        `P और Q से साथ शुरू करते हुए उनकी गतियाँ ${u} और ${w} हैं तथा दूरी ${L} है। वे लगातार लौटते रहते हैं। ${window} के भीतर मुलाकातों की संख्या ज्ञात कीजिए।`,
        `${L} लंबे मार्ग पर दोनों विपरीत सिरों से ${u} और ${w} पर चलते हैं और हर सिरे से तुरंत वापस मुड़ते हैं। ${window} तक कुल कितनी मुलाकातें होंगी?`,
        `दोनों का P–Q के बीच आना-जाना बिना ठहराव जारी रहता है। दूरी ${L}, गतियाँ ${u} और ${w} हैं। ${window} में मिलने की संख्या निकालिए।`,
        `${a} और ${b} विपरीत सिरों से एक साथ चलकर सिरों पर तुरंत दिशा बदलते हैं। P–Q ${L} है। पहले ${window} में कितनी मुलाकातें होंगी?`,
        `गतियाँ ${u} और ${w}, दूरी ${L} तथा समय सीमा ${window} है। दोनों P और Q पर तुरंत लौटते हैं। समय सीमा के भीतर मुलाकातों की संख्या क्या है?`,
      ];
      const paBodies = [
        `${a} P ਤੋਂ ${u} ਅਤੇ ${b} Q ਤੋਂ ${w} ਨਾਲ ਚਲਦੇ ਹਨ; P–Q = ${L} ਹੈ। ਦੋਵੇਂ ਸਿਰਿਆਂ ਉੱਤੇ ਤੁਰੰਤ ਮੁੜਦੇ ਹਨ। ਪਹਿਲੇ ${window} ਵਿੱਚ ਉਹ ਕਿੰਨੀ ਵਾਰ ਮਿਲਣਗੇ?`,
        `P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹੋਏ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ ਅਤੇ ਦੂਰੀ ${L} ਹੈ। ਉਹ ਲਗਾਤਾਰ ਮੁੜਦੇ ਰਹਿੰਦੇ ਹਨ। ${window} ਦੇ ਅੰਦਰ ਮੁਲਾਕਾਤਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`,
        `${L} ਲੰਮੇ ਰਸਤੇ ਉੱਤੇ ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ${u} ਅਤੇ ${w} ਨਾਲ ਚਲਦੇ ਹਨ ਅਤੇ ਹਰ ਸਿਰੇ ਤੋਂ ਤੁਰੰਤ ਵਾਪਸ ਮੁੜਦੇ ਹਨ। ${window} ਤੱਕ ਕੁੱਲ ਕਿੰਨੀਆਂ ਮੁਲਾਕਾਤਾਂ ਹੋਣਗੀਆਂ?`,
        `ਦੋਵਾਂ ਦਾ P–Q ਵਿਚਕਾਰ ਆਉਣਾ-ਜਾਣਾ ਬਿਨਾਂ ਠਹਿਰਾਅ ਜਾਰੀ ਰਹਿੰਦਾ ਹੈ। ਦੂਰੀ ${L}, ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ। ${window} ਵਿੱਚ ਮਿਲਣ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਇਕੱਠੇ ਚੱਲ ਕੇ ਸਿਰਿਆਂ ਉੱਤੇ ਤੁਰੰਤ ਦਿਸ਼ਾ ਬਦਲਦੇ ਹਨ। P–Q ${L} ਹੈ। ਪਹਿਲੇ ${window} ਵਿੱਚ ਕਿੰਨੀਆਂ ਮੁਲਾਕਾਤਾਂ ਹੋਣਗੀਆਂ?`,
        `ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w}, ਦੂਰੀ ${L} ਅਤੇ ਸਮਾਂ ਸੀਮਾ ${window} ਹੈ। ਦੋਵੇਂ P ਅਤੇ Q ਉੱਤੇ ਤੁਰੰਤ ਮੁੜਦੇ ਹਨ। ਸਮਾਂ ਸੀਮਾ ਅੰਦਰ ਮੁਲਾਕਾਤਾਂ ਦੀ ਗਿਣਤੀ ਕੀ ਹੈ?`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-066": {
      const hiBodies = [
        `दोनों P से Q की ओर एक साथ चलते हैं। P–Q = ${L}, गतियाँ ${u} और ${w} हैं। ${a} पहले Q पहुँचकर तुरंत लौटता है। ${a} और ${b} कब मिलेंगे?`,
        `${a} और ${b} P से साथ निकलते हैं। ${a} ${u} और ${b} ${w} पर चलता है; Q ${L} दूर है। ${a} Q से तुरंत लौटता है। मुलाकात तक कुल समय ज्ञात कीजिए।`,
        `P से Q तक दूरी ${L} है। दोनों की गतियाँ ${u} और ${w} हैं। तेज ${a} Q पर पहुँचते ही वापस मुड़ता है। वापसी की मुलाकात कब होगी?`,
        `दोनों एक ही समय P से शुरू करते हैं। मार्ग ${L} है और गति क्रमशः ${u}, ${w} है। ${a} Q छूते ही लौटता है। बीता हुआ समय निकालिए।`,
        `${a} पहले Q पहुँचकर बिना रुके P की ओर लौटता है, जबकि ${b} Q की ओर चलता रहता है। P–Q = ${L}; गतियाँ ${u}, ${w} हैं। वे कब मिलेंगे?`,
        `${L} के P–Q मार्ग पर दोनों P से साथ चलते हैं। ${a} की गति ${u}, ${b} की ${w} है। ${a} Q से तुरंत वापसी करता है। पहली वापसी-मुलाकात का समय ज्ञात कीजिए।`,
      ];
      const paBodies = [
        `ਦੋਵੇਂ P ਤੋਂ Q ਵੱਲ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। P–Q = ${L}, ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ। ${a} ਪਹਿਲਾਂ Q ਪਹੁੰਚ ਕੇ ਤੁਰੰਤ ਮੁੜਦਾ ਹੈ। ${a} ਅਤੇ ${b} ਕਦੋਂ ਮਿਲਣਗੇ?`,
        `${a} ਅਤੇ ${b} P ਤੋਂ ਇਕੱਠੇ ਨਿਕਲਦੇ ਹਨ। ${a} ${u} ਅਤੇ ${b} ${w} ਨਾਲ ਚਲਦਾ ਹੈ; Q ${L} ਦੂਰ ਹੈ। ${a} Q ਤੋਂ ਤੁਰੰਤ ਮੁੜਦਾ ਹੈ। ਮੁਲਾਕਾਤ ਤੱਕ ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
        `P ਤੋਂ Q ਤੱਕ ਦੂਰੀ ${L} ਹੈ। ਦੋਵਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ। ਤੇਜ਼ ${a} Q ਉੱਤੇ ਪਹੁੰਚਦੇ ਹੀ ਵਾਪਸ ਮੁੜਦਾ ਹੈ। ਵਾਪਸੀ ਦੀ ਮੁਲਾਕਾਤ ਕਦੋਂ ਹੋਵੇਗੀ?`,
        `ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ P ਤੋਂ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਰਸਤਾ ${L} ਹੈ ਅਤੇ ਰਫ਼ਤਾਰਾਂ ਕ੍ਰਮਵਾਰ ${u}, ${w} ਹਨ। ${a} Q ਉੱਤੇ ਪਹੁੰਚਦੇ ਹੀ ਮੁੜਦਾ ਹੈ। ਬੀਤਿਆ ਸਮਾਂ ਕੱਢੋ।`,
        `${a} ਪਹਿਲਾਂ Q ਪਹੁੰਚ ਕੇ ਬਿਨਾਂ ਰੁਕੇ P ਵੱਲ ਮੁੜਦਾ ਹੈ, ਜਦਕਿ ${b} Q ਵੱਲ ਚਲਦਾ ਰਹਿੰਦਾ ਹੈ। P–Q = ${L}; ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹਨ। ਉਹ ਕਦੋਂ ਮਿਲਣਗੇ?`,
        `${L} ਦੇ P–Q ਰਸਤੇ ਉੱਤੇ ਦੋਵੇਂ P ਤੋਂ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। ${a} ਦੀ ਰਫ਼ਤਾਰ ${u}, ${b} ਦੀ ${w} ਹੈ। ${a} Q ਤੋਂ ਤੁਰੰਤ ਵਾਪਸ ਆਉਂਦਾ ਹੈ। ਪਹਿਲੀ ਵਾਪਸੀ-ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਕੱਢੋ।`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-067": {
      const hiBodies = [
        `P–Q = ${L}; ${a} और ${b} P से साथ ${u} और ${w} पर चलते हैं। ${a} Q से तुरंत लौटता है। मिलने तक ${a} कुल कितनी दूरी तय करेगा?`,
        `${a} P से ${u} और ${b} ${w} की गति से Q की ओर चलता है। Q ${L} दूर है। ${a} पहले पहुँचकर लौटता है। वापसी की मुलाकात तक ${a} की चली दूरी ज्ञात कीजिए।`,
        `दोनों P से साथ शुरू करते हैं। मार्ग ${L}, गतियाँ ${u} और ${w} हैं। ${a} Q पर दिशा बदलता है। ${b} से मिलने तक ${a} ने कितना रास्ता तय किया होगा?`,
        `${a} Q पहुँचते ही वापस मुड़ता है; ${b} आगे चलता रहता है। P–Q ${L} है और उनकी गतियाँ ${u}, ${w} हैं। मिलने के समय ${a} की कुल यात्रा कितनी है?`,
        `${L} लंबे मार्ग पर P से चलने वाले दोनों की गतियाँ ${u} और ${w} हैं। तेज ${a} Q से तुरंत लौटता है। मुलाकात से पहले ${a} की कुल दूरी निकालिए।`,
        `${a} और ${b} P से एक साथ Q की ओर निकलते हैं। ${a} ${u}, ${b} ${w} पर है। Q ${L} दूर है और ${a} वहीं से लौटता है। मिलने तक ${a} कितने km चलेगा?`,
      ];
      const paBodies = [
        `P–Q = ${L}; ${a} ਅਤੇ ${b} P ਤੋਂ ਇਕੱਠੇ ${u} ਅਤੇ ${w} ਨਾਲ ਚਲਦੇ ਹਨ। ${a} Q ਤੋਂ ਤੁਰੰਤ ਮੁੜਦਾ ਹੈ। ਮਿਲਣ ਤੱਕ ${a} ਕੁੱਲ ਕਿੰਨੀ ਦੂਰੀ ਤੈਅ ਕਰੇਗਾ?`,
        `${a} P ਤੋਂ ${u} ਅਤੇ ${b} ${w} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ Q ਵੱਲ ਚਲਦਾ ਹੈ। Q ${L} ਦੂਰ ਹੈ। ${a} ਪਹਿਲਾਂ ਪਹੁੰਚ ਕੇ ਮੁੜਦਾ ਹੈ। ਵਾਪਸੀ ਦੀ ਮੁਲਾਕਾਤ ਤੱਕ ${a} ਦੀ ਤੈਅ ਦੂਰੀ ਕੱਢੋ।`,
        `ਦੋਵੇਂ P ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਰਸਤਾ ${L}, ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ। ${a} Q ਉੱਤੇ ਦਿਸ਼ਾ ਬਦਲਦਾ ਹੈ। ${b} ਨਾਲ ਮਿਲਣ ਤੱਕ ${a} ਨੇ ਕਿੰਨਾ ਰਸਤਾ ਤੈਅ ਕੀਤਾ ਹੋਵੇਗਾ?`,
        `${a} Q ਪਹੁੰਚਦੇ ਹੀ ਵਾਪਸ ਮੁੜਦਾ ਹੈ; ${b} ਅੱਗੇ ਚਲਦਾ ਰਹਿੰਦਾ ਹੈ। P–Q ${L} ਹੈ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹਨ। ਮਿਲਣ ਵੇਲੇ ${a} ਦਾ ਕੁੱਲ ਸਫ਼ਰ ਕਿੰਨਾ ਹੈ?`,
        `${L} ਲੰਮੇ ਰਸਤੇ ਉੱਤੇ P ਤੋਂ ਚੱਲਣ ਵਾਲੇ ਦੋਵਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ। ਤੇਜ਼ ${a} Q ਤੋਂ ਤੁਰੰਤ ਮੁੜਦਾ ਹੈ। ਮੁਲਾਕਾਤ ਤੋਂ ਪਹਿਲਾਂ ${a} ਦੀ ਕੁੱਲ ਦੂਰੀ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} P ਤੋਂ ਇਕੱਠੇ Q ਵੱਲ ਨਿਕਲਦੇ ਹਨ। ${a} ${u}, ${b} ${w} ਨਾਲ ਚਲਦਾ ਹੈ। Q ${L} ਦੂਰ ਹੈ ਅਤੇ ${a} ਉੱਥੋਂ ਮੁੜਦਾ ਹੈ। ਮਿਲਣ ਤੱਕ ${a} ਕਿੰਨੇ km ਚੱਲੇਗਾ?`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-068": {
      const hiBodies = [
        `दोनों P से Q की ओर ${u} और ${w} पर साथ चलते हैं; P–Q = ${L}। ${a} Q से तुरंत लौटता है। वापसी में मिलने का बिंदु P से कितनी दूर है?`,
        `${a} P से ${u} और ${b} ${w} पर चलता है। Q ${L} दूर है। ${a} पहले Q पहुँचकर लौटता है। दोनों कहाँ मिलेंगे, P से दूरी बताइए।`,
        `P से साथ शुरू करने पर तेज ${a} Q से तुरंत वापस आता है। मार्ग ${L}, गतियाँ ${u} और ${w} हैं। वापसी की मुलाकात P से कितनी दूरी पर होगी?`,
        `${a} और ${b} P से Q की ओर चलते हैं। ${a} Q पहुँचकर दिशा बदलता है। यदि P–Q ${L} और गतियाँ ${u}, ${w} हों, तो मिलने का स्थान P से निकालिए।`,
        `दोनों P से एक ही समय निकलते हैं। ${a} की गति ${u}, ${b} की ${w} तथा Q की दूरी ${L} है। ${a} लौटने पर ${b} से P से कितनी दूर मिलेगा?`,
        `${L} लंबे P–Q मार्ग पर दोनों P से साथ चलते हैं। तेज ${a} Q से बिना रुके लौटता है। ${u} और ${w} की गतियों पर मिलने का बिंदु P से ज्ञात कीजिए।`,
      ];
      const paBodies = [
        `ਦੋਵੇਂ P ਤੋਂ Q ਵੱਲ ${u} ਅਤੇ ${w} ਨਾਲ ਇਕੱਠੇ ਚਲਦੇ ਹਨ; P–Q = ${L}। ${a} Q ਤੋਂ ਤੁਰੰਤ ਮੁੜਦਾ ਹੈ। ਵਾਪਸੀ ਵਿੱਚ ਮਿਲਣ ਦਾ ਬਿੰਦੂ P ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਹੈ?`,
        `${a} P ਤੋਂ ${u} ਅਤੇ ${b} ${w} ਨਾਲ ਚਲਦਾ ਹੈ। Q ${L} ਦੂਰ ਹੈ। ${a} ਪਹਿਲਾਂ Q ਪਹੁੰਚ ਕੇ ਮੁੜਦਾ ਹੈ। ਦੋਵੇਂ ਕਿੱਥੇ ਮਿਲਣਗੇ, P ਤੋਂ ਦੂਰੀ ਦੱਸੋ।`,
        `P ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਨ ਉੱਤੇ ਤੇਜ਼ ${a} Q ਤੋਂ ਤੁਰੰਤ ਵਾਪਸ ਆਉਂਦਾ ਹੈ। ਰਸਤਾ ${L}, ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ। ਵਾਪਸੀ ਦੀ ਮੁਲਾਕਾਤ P ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਹੋਵੇਗੀ?`,
        `${a} ਅਤੇ ${b} P ਤੋਂ Q ਵੱਲ ਚਲਦੇ ਹਨ। ${a} Q ਪਹੁੰਚ ਕੇ ਦਿਸ਼ਾ ਬਦਲਦਾ ਹੈ। ਜੇ P–Q ${L} ਅਤੇ ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹੋਣ, ਤਾਂ ਮਿਲਣ ਦੀ ਥਾਂ P ਤੋਂ ਕੱਢੋ।`,
        `ਦੋਵੇਂ P ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਨਿਕਲਦੇ ਹਨ। ${a} ਦੀ ਰਫ਼ਤਾਰ ${u}, ${b} ਦੀ ${w} ਅਤੇ Q ਦੀ ਦੂਰੀ ${L} ਹੈ। ${a} ਮੁੜ ਕੇ ${b} ਨੂੰ P ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਮਿਲੇਗਾ?`,
        `${L} ਲੰਮੇ P–Q ਰਸਤੇ ਉੱਤੇ ਦੋਵੇਂ P ਤੋਂ ਇਕੱਠੇ ਚਲਦੇ ਹਨ। ਤੇਜ਼ ${a} Q ਤੋਂ ਬਿਨਾਂ ਰੁਕੇ ਮੁੜਦਾ ਹੈ। ${u} ਅਤੇ ${w} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਉੱਤੇ ਮਿਲਣ ਦਾ ਬਿੰਦੂ P ਤੋਂ ਕੱਢੋ।`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-069": {
      const observed = cp005Duration(req(input.observedSecondMeetingTime, "observedSecondMeetingTime"), language);
      const hiBodies = [
        `${a} P से ${u} और ${b} Q से ${w} पर चलते हैं; P–Q = ${L}। ${a} Q पर कुछ समय रुकता है, ${b} P से तुरंत लौटता है। दूसरी मुलाकात ${observed} बाद होती है। ${a} का ठहराव ज्ञात कीजिए।`,
        `विपरीत सिरों से चलने वाले ${a} और ${b} की गतियाँ ${u} और ${w} हैं, दूरी ${L} है। ${a} Q पर रुककर लौटता है, ${b} बिना रुके लौटता है। दूसरी मुलाकात का समय ${observed} है। रुकने का समय निकालिए।`,
        `${a} Q पहुँचकर कुछ देर प्रतीक्षा करता है, जबकि ${b} P पर तुरंत दिशा बदलता है। P–Q ${L}, गतियाँ ${u}, ${w} हैं। यदि दूसरी मुलाकात ${observed} में हो, तो ${a} कितनी देर रुका?`,
        `P और Q से साथ चलने के बाद ${a} Q पर ठहरता है और ${b} P से तुरंत वापस आता है। ${L} के मार्ग पर गतियाँ ${u}, ${w} हैं। दूसरी मुलाकात ${observed} पर है। ठहराव ज्ञात कीजिए।`,
        `${a} और ${b} विपरीत सिरों से ${u} तथा ${w} पर चलते हैं। दूरी ${L} है। Q पर केवल ${a} रुकता है। दूसरी मुलाकात शुरू होने के ${observed} बाद होती है। ठहराव कितना है?`,
        `P–Q = ${L} और गतियाँ ${u}, ${w} हैं। ${a} Q पर रुकता है, ${b} P पर नहीं रुकता। उनकी दूसरी मुलाकात ${observed} में होती है। ${a} के रुकने का समय निकालिए।`,
      ];
      const paBodies = [
        `${a} P ਤੋਂ ${u} ਅਤੇ ${b} Q ਤੋਂ ${w} ਨਾਲ ਚਲਦੇ ਹਨ; P–Q = ${L}। ${a} Q ਉੱਤੇ ਕੁਝ ਸਮਾਂ ਰੁਕਦਾ ਹੈ, ${b} P ਤੋਂ ਤੁਰੰਤ ਮੁੜਦਾ ਹੈ। ਦੂਜੀ ਮੁਲਾਕਾਤ ${observed} ਬਾਅਦ ਹੁੰਦੀ ਹੈ। ${a} ਦਾ ਠਹਿਰਾਅ ਕੱਢੋ।`,
        `ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਚੱਲਣ ਵਾਲੇ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ, ਦੂਰੀ ${L} ਹੈ। ${a} Q ਉੱਤੇ ਰੁਕ ਕੇ ਮੁੜਦਾ ਹੈ, ${b} ਬਿਨਾਂ ਰੁਕੇ ਮੁੜਦਾ ਹੈ। ਦੂਜੀ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ${observed} ਹੈ। ਰੁਕਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।`,
        `${a} Q ਪਹੁੰਚ ਕੇ ਕੁਝ ਦੇਰ ਉਡੀਕ ਕਰਦਾ ਹੈ, ਜਦਕਿ ${b} P ਉੱਤੇ ਤੁਰੰਤ ਦਿਸ਼ਾ ਬਦਲਦਾ ਹੈ। P–Q ${L}, ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹਨ। ਜੇ ਦੂਜੀ ਮੁਲਾਕਾਤ ${observed} ਵਿੱਚ ਹੋਵੇ, ਤਾਂ ${a} ਕਿੰਨੀ ਦੇਰ ਰੁਕਿਆ?`,
        `P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਚੱਲਣ ਤੋਂ ਬਾਅਦ ${a} Q ਉੱਤੇ ਰੁਕਦਾ ਹੈ ਅਤੇ ${b} P ਤੋਂ ਤੁਰੰਤ ਵਾਪਸ ਆਉਂਦਾ ਹੈ। ${L} ਦੇ ਰਸਤੇ ਉੱਤੇ ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹਨ। ਦੂਜੀ ਮੁਲਾਕਾਤ ${observed} ਉੱਤੇ ਹੈ। ਠਹਿਰਾਅ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ${u} ਅਤੇ ${w} ਨਾਲ ਚਲਦੇ ਹਨ। ਦੂਰੀ ${L} ਹੈ। Q ਉੱਤੇ ਸਿਰਫ਼ ${a} ਰੁਕਦਾ ਹੈ। ਦੂਜੀ ਮੁਲਾਕਾਤ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ${observed} ਬਾਅਦ ਹੁੰਦੀ ਹੈ। ਠਹਿਰਾਅ ਕਿੰਨਾ ਹੈ?`,
        `P–Q = ${L} ਅਤੇ ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹਨ। ${a} Q ਉੱਤੇ ਰੁਕਦਾ ਹੈ, ${b} P ਉੱਤੇ ਨਹੀਂ ਰੁਕਦਾ। ਉਨ੍ਹਾਂ ਦੀ ਦੂਜੀ ਮੁਲਾਕਾਤ ${observed} ਵਿੱਚ ਹੁੰਦੀ ਹੈ। ${a} ਦੇ ਰੁਕਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }

    case "TSD-QL-070": {
      const first = req(input.observedFirstMeetingTime, "observedFirstMeetingTime");
      const second = req(input.observedSecondMeetingTime, "observedSecondMeetingTime");
      const gap = cp005Duration(subtract(second, first), language);
      const hiBodies = [
        `${a} P से ${u} और ${b} Q से ${w} पर एक साथ चलते हैं और सिरों पर तुरंत लौटते हैं। पहली और दूसरी मुलाकात के बीच ${gap} का अंतर है। P–Q की दूरी ज्ञात कीजिए।`,
        `दोनों विपरीत सिरों से ${u} और ${w} की गति से चलकर लगातार लौटते रहते हैं। पहली दो मुलाकातों का समय-अंतर ${gap} है। मार्ग की लंबाई निकालिए।`,
        `P और Q के बीच दोनों का आना-जाना बिना ठहराव चलता है। गतियाँ ${u}, ${w} हैं। मुलाकात 1 से मुलाकात 2 तक ${gap} लगते हैं। P–Q कितना है?`,
        `${a} और ${b} P तथा Q से साथ शुरू करते हैं और हर सिरे पर तुरंत दिशा बदलते हैं। उनकी पहली दो मुलाकातों के बीच ${gap} है। सिरों की दूरी ज्ञात कीजिए।`,
        `गतियाँ ${u} और ${w} हैं। दोनों विपरीत सिरों से चलकर P और Q पर बिना रुके लौटते हैं। यदि पहली से दूसरी मुलाकात का अंतर ${gap} हो, तो P–Q निकालिए।`,
        `लगातार P–Q के बीच चलने वाले ${a} और ${b} की गतियाँ ${u}, ${w} हैं। पहली और दूसरी मुलाकात ${gap} के अंतर पर हैं। मार्ग की लंबाई कितनी है?`,
      ];
      const paBodies = [
        `${a} P ਤੋਂ ${u} ਅਤੇ ${b} Q ਤੋਂ ${w} ਨਾਲ ਇਕੱਠੇ ਚਲਦੇ ਹਨ ਅਤੇ ਸਿਰਿਆਂ ਉੱਤੇ ਤੁਰੰਤ ਮੁੜਦੇ ਹਨ। ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਮੁਲਾਕਾਤ ਵਿਚਕਾਰ ${gap} ਦਾ ਅੰਤਰ ਹੈ। P–Q ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        `ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ${u} ਅਤੇ ${w} ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਚੱਲ ਕੇ ਲਗਾਤਾਰ ਮੁੜਦੇ ਰਹਿੰਦੇ ਹਨ। ਪਹਿਲੀਆਂ ਦੋ ਮੁਲਾਕਾਤਾਂ ਦਾ ਸਮਾਂ-ਅੰਤਰ ${gap} ਹੈ। ਰਸਤੇ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
        `P ਅਤੇ Q ਵਿਚਕਾਰ ਦੋਵਾਂ ਦਾ ਆਉਣਾ-ਜਾਣਾ ਬਿਨਾਂ ਠਹਿਰਾਅ ਚਲਦਾ ਹੈ। ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹਨ। ਮੁਲਾਕਾਤ 1 ਤੋਂ ਮੁਲਾਕਾਤ 2 ਤੱਕ ${gap} ਲੱਗਦੇ ਹਨ। P–Q ਕਿੰਨਾ ਹੈ?`,
        `${a} ਅਤੇ ${b} P ਅਤੇ Q ਤੋਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ ਅਤੇ ਹਰ ਸਿਰੇ ਉੱਤੇ ਤੁਰੰਤ ਦਿਸ਼ਾ ਬਦਲਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਪਹਿਲੀਆਂ ਦੋ ਮੁਲਾਕਾਤਾਂ ਵਿਚਕਾਰ ${gap} ਹੈ। ਸਿਰਿਆਂ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        `ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${w} ਹਨ। ਦੋਵੇਂ ਵਿਰੋਧੀ ਸਿਰਿਆਂ ਤੋਂ ਚੱਲ ਕੇ P ਅਤੇ Q ਉੱਤੇ ਬਿਨਾਂ ਰੁਕੇ ਮੁੜਦੇ ਹਨ। ਜੇ ਪਹਿਲੀ ਤੋਂ ਦੂਜੀ ਮੁਲਾਕਾਤ ਦਾ ਅੰਤਰ ${gap} ਹੋਵੇ, ਤਾਂ P–Q ਕੱਢੋ।`,
        `ਲਗਾਤਾਰ P–Q ਵਿਚਕਾਰ ਚੱਲਣ ਵਾਲੇ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u}, ${w} ਹਨ। ਪਹਿਲੀ ਅਤੇ ਦੂਜੀ ਮੁਲਾਕਾਤ ${gap} ਦੇ ਅੰਤਰ ਉੱਤੇ ਹਨ। ਰਸਤੇ ਦੀ ਲੰਬਾਈ ਕਿੰਨੀ ਹੈ?`,
      ];
      return `${lead} ${(hi ? hiBodies : paBodies)[v]}`;
    }
  }
  throw new Error(`${source.permanentQlId}: CP005 native stem renderer missing`);
}

const METHODS = Object.freeze({
  "Post-meeting times give the square of the speed ratio.": { hi: "मुलाकात के बाद के समय गति अनुपात का वर्ग देते हैं।", pa: "ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੇ ਸਮੇਂ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਦਾ ਵਰਗ ਦਿੰਦੇ ਹਨ।" },
  "Find the meeting point, then use only the distance left afterwards.": { hi: "पहले मिलने का बिंदु निकालें, फिर केवल शेष दूरी का उपयोग करें।", pa: "ਪਹਿਲਾਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ ਕੱਢੋ, ਫਿਰ ਸਿਰਫ਼ ਬਾਕੀ ਦੂਰੀ ਵਰਤੋ।" },
  "Recover B's speed, then add the two post-meeting legs.": { hi: "पहले B की गति निकालें, फिर मुलाकात के बाद की दोनों दूरियाँ जोड़ें।", pa: "ਪਹਿਲਾਂ B ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ, ਫਿਰ ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੀਆਂ ਦੋਵੇਂ ਦੂਰੀਆਂ ਜੋੜੋ।" },
  "First get the speed ratio; then use the known route length.": { hi: "पहले गति अनुपात निकालें, फिर दी गई कुल दूरी का उपयोग करें।", pa: "ਪਹਿਲਾਂ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ, ਫਿਰ ਦਿੱਤੀ ਕੁੱਲ ਦੂਰੀ ਵਰਤੋ।" },
  "The first meeting divides PQ in the speed ratio.": { hi: "पहली मुलाकात P–Q को गति अनुपात में बाँटती है।", pa: "ਪਹਿਲੀ ਮੁਲਾਕਾਤ P–Q ਨੂੰ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡਦੀ ਹੈ।" },
  "By the second meeting, combined travel equals 3PQ.": { hi: "दूसरी मुलाकात तक दोनों की कुल चली दूरी 3P–Q के बराबर होती है।", pa: "ਦੂਜੀ ਮੁਲਾਕਾਤ ਤੱਕ ਦੋਵਾਂ ਦੀ ਕੁੱਲ ਤੈਅ ਦੂਰੀ 3P–Q ਦੇ ਬਰਾਬਰ ਹੁੰਦੀ ਹੈ।" },
  "Repeated meetings occur at odd multiples of PQ in combined travel.": { hi: "बार-बार मुलाकातें संयुक्त दूरी के P–Q के विषम गुणकों पर होती हैं।", pa: "ਵਾਰ-ਵਾਰ ਮੁਲਾਕਾਤਾਂ ਕੁੱਲ ਦੂਰੀ ਦੇ P–Q ਦੇ ਵਿਸ਼ਮ ਗੁਣਕਾਂ ਉੱਤੇ ਹੁੰਦੀਆਂ ਹਨ।" },
  "From meeting 1 to meeting 2, combined travel increases by 2PQ.": { hi: "पहली से दूसरी मुलाकात तक संयुक्त दूरी 2P–Q बढ़ती है।", pa: "ਪਹਿਲੀ ਤੋਂ ਦੂਜੀ ਮੁਲਾਕਾਤ ਤੱਕ ਕੁੱਲ ਦੂਰੀ 2P–Q ਵੱਧਦੀ ਹੈ।" },
  "Find the meeting time, then reflect A's travelled path back onto PQ.": { hi: "पहले मुलाकात का समय निकालें, फिर A की चली दूरी को P–Q पर वापसी के अनुसार दर्शाएँ।", pa: "ਪਹਿਲਾਂ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ A ਦੀ ਤੈਅ ਦੂਰੀ ਨੂੰ P–Q ਉੱਤੇ ਵਾਪਸੀ ਅਨੁਸਾਰ ਦਰਸਾਓ।" },
  "Check the odd-multiple meeting times against the time limit.": { hi: "विषम-गुणक वाली मुलाकातों के समय को दी गई समय सीमा से मिलाएँ।", pa: "ਵਿਸ਼ਮ-ਗੁਣਕ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ ਦੇ ਸਮੇਂ ਨੂੰ ਦਿੱਤੀ ਸਮਾਂ ਸੀਮਾ ਨਾਲ ਮਿਲਾਓ।" },
  "At the return meeting, A's path plus B's path equals 2PQ.": { hi: "वापसी की मुलाकात पर A और B की चली दूरियों का योग 2P–Q होता है।", pa: "ਵਾਪਸੀ ਦੀ ਮੁਲਾਕਾਤ ਉੱਤੇ A ਅਤੇ B ਦੀ ਤੈਅ ਦੂਰੀ ਦਾ ਜੋੜ 2P–Q ਹੁੰਦਾ ਹੈ।" },
  "Find the return-meeting time, then multiply by A's speed.": { hi: "पहले वापसी की मुलाकात का समय निकालें, फिर A की गति से गुणा करें।", pa: "ਪਹਿਲਾਂ ਵਾਪਸੀ ਦੀ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਕੱਢੋ, ਫਿਰ A ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਗੁਣਾ ਕਰੋ।" },
  "At the meeting, B has only moved outward from P.": { hi: "मुलाकात तक B केवल P से Q की ओर ही चला है।", pa: "ਮੁਲਾਕਾਤ ਤੱਕ B ਸਿਰਫ਼ P ਤੋਂ Q ਵੱਲ ਹੀ ਚੱਲਿਆ ਹੈ।" },
  "A's halt removes distance from the normal 3PQ second-meeting path.": { hi: "A का ठहराव सामान्य 3P–Q वाली दूसरी-मुलाकात दूरी को कम करता है।", pa: "A ਦਾ ਠਹਿਰਾਅ ਆਮ 3P–Q ਵਾਲੀ ਦੂਜੀ-ਮੁਲਾਕਾਤ ਦੂਰੀ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ।" },
  "Between the first two meetings, combined travel equals 2PQ.": { hi: "पहली दो मुलाकातों के बीच संयुक्त चली दूरी 2P–Q होती है।", pa: "ਪਹਿਲੀਆਂ ਦੋ ਮੁਲਾਕਾਤਾਂ ਵਿਚਕਾਰ ਕੁੱਲ ਤੈਅ ਦੂਰੀ 2P–Q ਹੁੰਦੀ ਹੈ।" },
} as const);

const SHORTCUTS = Object.freeze({
  "Same units first; then square-root tB:tA.": { hi: "पहले समय की इकाइयाँ समान करें, फिर tB:tA का वर्गमूल लें।", pa: "ਪਹਿਲਾਂ ਸਮੇਂ ਦੀਆਂ ਇਕਾਈਆਂ ਇੱਕੋ ਕਰੋ, ਫਿਰ tB:tA ਦਾ ਵਰਗਮੂਲ ਲਵੋ।" },
  "Do not use the full-route time after the meeting.": { hi: "मुलाकात के बाद केवल शेष दूरी का समय लें, पूरे मार्ग का नहीं।", pa: "ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਸਿਰਫ਼ ਬਾਕੀ ਦੂਰੀ ਦਾ ਸਮਾਂ ਲਵੋ, ਪੂਰੇ ਰਸਤੇ ਦਾ ਨਹੀਂ।" },
  "The two remaining legs together make the whole route.": { hi: "मुलाकात के बाद की दोनों दूरियों का योग पूरा मार्ग है।", pa: "ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੀਆਂ ਦੋਵੇਂ ਦੂਰੀਆਂ ਦਾ ਜੋੜ ਪੂਰਾ ਰਸਤਾ ਹੈ।" },
  "Ratio first, route equation second.": { hi: "पहले अनुपात, फिर कुल दूरी का समीकरण।", pa: "ਪਹਿਲਾਂ ਅਨੁਪਾਤ, ਫਿਰ ਕੁੱਲ ਦੂਰੀ ਦਾ ਸਮੀਕਰਨ।" },
  "Find A:B, then divide PQ in that ratio.": { hi: "पहले A:B निकालें, फिर P–Q को उसी अनुपात में बाँटें।", pa: "ਪਹਿਲਾਂ A:B ਕੱਢੋ, ਫਿਰ P–Q ਨੂੰ ਉਸੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।" },
  "Second meeting time = 3L/(u+v).": { hi: "दूसरी मुलाकात का समय = 3L/(u+v)।", pa: "ਦੂਜੀ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ = 3L/(u+v)।" },
  "nth meeting: (2n−1)L/(u+v).": { hi: "nवीं मुलाकात: (2n−1)L/(u+v)।", pa: "nਵੀਂ ਮੁਲਾਕਾਤ: (2n−1)L/(u+v)।" },
  "First-to-second gap = 2L/(u+v).": { hi: "पहली से दूसरी मुलाकात का अंतर = 2L/(u+v)।", pa: "ਪਹਿਲੀ ਤੋਂ ਦੂਜੀ ਮੁਲਾਕਾਤ ਦਾ ਅੰਤਰ = 2L/(u+v)।" },
  "Travelled distance and physical position are different after a turn.": { hi: "दिशा बदलने के बाद चली दूरी और वास्तविक स्थान अलग होते हैं।", pa: "ਦਿਸ਼ਾ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਤੈਅ ਦੂਰੀ ਅਤੇ ਅਸਲ ਥਾਂ ਵੱਖ ਹੁੰਦੇ ਹਨ।" },
  "Count odd-multiple meeting times not exceeding the window.": { hi: "समय सीमा से अधिक न होने वाली विषम-गुणक मुलाकातें गिनें।", pa: "ਸਮਾਂ ਸੀਮਾ ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲੀਆਂ ਵਿਸ਼ਮ-ਗੁਣਕ ਮੁਲਾਕਾਤਾਂ ਗਿਣੋ।" },
  "One-turn same-start meeting: 2L/(u+v).": { hi: "एक बार लौटने वाली समान-शुरुआत मुलाकात: 2L/(u+v)।", pa: "ਇੱਕ ਵਾਰ ਮੁੜਨ ਵਾਲੀ ਇੱਕੋ-ਸ਼ੁਰੂਆਤ ਮੁਲਾਕਾਤ: 2L/(u+v)।" },
  "Distance travelled by A = u × return-meeting time.": { hi: "A की चली दूरी = u × वापसी-मुलाकात का समय।", pa: "A ਦੀ ਤੈਅ ਦੂਰੀ = u × ਵਾਪਸੀ-ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ।" },
  "Use B's outward distance after finding the meeting time.": { hi: "मुलाकात का समय मिलने के बाद B की P से चली दूरी लें।", pa: "ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਮਿਲਣ ਤੋਂ ਬਾਅਦ B ਦੀ P ਤੋਂ ਤੈਅ ਦੂਰੀ ਲਵੋ।" },
  "Rest = [(u+v)t − 3L]/u.": { hi: "ठहराव = [(u+v)t − 3L]/u।", pa: "ਠਹਿਰਾਅ = [(u+v)t − 3L]/u।" },
  "PQ = (u+v) × meeting gap / 2.": { hi: "P–Q = (u+v) × मुलाकात का अंतर / 2।", pa: "P–Q = (u+v) × ਮੁਲਾਕਾਤ ਦਾ ਅੰਤਰ / 2।" },
} as const);

function nativeMethod(text: string, language: TsdCp005NativeLanguage): string {
  const entry = METHODS[text as keyof typeof METHODS];
  if (!entry) throw new Error(`CP005 native method mapping missing: ${text}`);
  return entry[language];
}

function nativeShortcut(text: string, language: TsdCp005NativeLanguage): string {
  const entry = SHORTCUTS[text as keyof typeof SHORTCUTS];
  if (!entry) throw new Error(`CP005 native shortcut mapping missing: ${text}`);
  return entry[language];
}

function nativeStep(text: string, language: TsdCp005NativeLanguage): string {
  let out = text;
  if (language === "hi") {
    out = out
      .replace(/(\d+)(st|nd|rd|th) meeting/g, "$1वीं मुलाकात")
      .replace("Use minutes:", "मिनटों में:")
      .replace("Taking the square root gives", "वर्गमूल लेने पर")
      .replace(/B's speed/g, "B की गति").replace(/A's speed/g, "A की गति")
      .replace("meeting point from P", "P से मिलने का बिंदु")
      .replace("Meeting point from P", "P से मिलने का बिंदु")
      .replace("From the post-meeting times", "मुलाकात के बाद के समयों से")
      .replace("Post-meeting times give", "मुलाकात के बाद के समय देते हैं")
      .replace("Using PQ", "P–Q का उपयोग करने पर")
      .replace("we get", "मिलता है")
      .replace("So PM", "इसलिए PM")
      .replace("A travels", "A चलता है")
      .replace("after reflection the point is", "वापसी के अनुसार स्थान")
      .replace("Combined speed", "संयुक्त गति")
      .replace("combined path", "कुल चली दूरी")
      .replace("A's distance", "A की चली दूरी")
      .replace("Missed distance", "ठहराव से कम चली दूरी")
      .replace("Rest time", "ठहराव का समय")
      .replace("Return-meeting time", "वापसी-मुलाकात का समय")
      .replace("Meeting time", "मुलाकात का समय")
      .replace(/^Time =/, "समय =")
      .replace("time gap", "समय-अंतर")
      .replace("Combined distance", "संयुक्त दूरी")
      .replace("combined distance", "संयुक्त दूरी")
      .replace("For the", "")
      .replace("is at", "का समय")
      .replace("within", "जो सीमा के भीतर है:")
      .replace("beyond the limit", "जो समय सीमा से बाहर है")
      .replace("has", "के पास")
      .replace("left, so time", "दूरी शेष है, इसलिए समय")
      .replace("left, so", "दूरी शेष है, इसलिए")
      .replace(/\bhours\b/g, "घंटे").replace(/\bhour\b/g, "घंटा")
      .replace(/\bminutes\b/g, "मिनट").replace(/\bminute\b/g, "मिनट")
      .replace(/\bseconds\b/g, "सेकंड").replace(/\bsecond\b/g, "सेकंड")
      .replace(/\bfrom P\b/g, "P से")
      .replace(/\band B\b/g, "और B")
      .replace(/\bso\b/g, "अतः");
  } else {
    out = out
      .replace(/(\d+)(st|nd|rd|th) meeting/g, "$1ਵੀਂ ਮੁਲਾਕਾਤ")
      .replace("Use minutes:", "ਮਿੰਟਾਂ ਵਿੱਚ:")
      .replace("Taking the square root gives", "ਵਰਗਮੂਲ ਲੈਣ ਤੇ")
      .replace(/B's speed/g, "B ਦੀ ਰਫ਼ਤਾਰ").replace(/A's speed/g, "A ਦੀ ਰਫ਼ਤਾਰ")
      .replace("meeting point from P", "P ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ")
      .replace("Meeting point from P", "P ਤੋਂ ਮਿਲਣ ਦਾ ਬਿੰਦੂ")
      .replace("From the post-meeting times", "ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੇ ਸਮਿਆਂ ਤੋਂ")
      .replace("Post-meeting times give", "ਮੁਲਾਕਾਤ ਤੋਂ ਬਾਅਦ ਦੇ ਸਮੇਂ ਦਿੰਦੇ ਹਨ")
      .replace("Using PQ", "P–Q ਵਰਤਣ ਤੇ")
      .replace("we get", "ਮਿਲਦਾ ਹੈ")
      .replace("So PM", "ਇਸ ਲਈ PM")
      .replace("A travels", "A ਚਲਦਾ ਹੈ")
      .replace("after reflection the point is", "ਵਾਪਸੀ ਅਨੁਸਾਰ ਥਾਂ")
      .replace("Combined speed", "ਕੁੱਲ ਰਫ਼ਤਾਰ")
      .replace("combined path", "ਕੁੱਲ ਤੈਅ ਦੂਰੀ")
      .replace("A's distance", "A ਦੀ ਤੈਅ ਦੂਰੀ")
      .replace("Missed distance", "ਠਹਿਰਾਅ ਕਾਰਨ ਘੱਟ ਤੈਅ ਦੂਰੀ")
      .replace("Rest time", "ਠਹਿਰਾਅ ਦਾ ਸਮਾਂ")
      .replace("Return-meeting time", "ਵਾਪਸੀ-ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ")
      .replace("Meeting time", "ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ")
      .replace(/^Time =/, "ਸਮਾਂ =")
      .replace("time gap", "ਸਮਾਂ-ਅੰਤਰ")
      .replace("Combined distance", "ਕੁੱਲ ਦੂਰੀ")
      .replace("combined distance", "ਕੁੱਲ ਦੂਰੀ")
      .replace("For the", "")
      .replace("is at", "ਦਾ ਸਮਾਂ")
      .replace("within", "ਜੋ ਸਮਾਂ ਸੀਮਾ ਅੰਦਰ ਹੈ:")
      .replace("beyond the limit", "ਜੋ ਸਮਾਂ ਸੀਮਾ ਤੋਂ ਬਾਹਰ ਹੈ")
      .replace("has", "ਕੋਲ")
      .replace("left, so time", "ਦੂਰੀ ਬਾਕੀ ਹੈ, ਇਸ ਲਈ ਸਮਾਂ")
      .replace("left, so", "ਦੂਰੀ ਬਾਕੀ ਹੈ, ਇਸ ਲਈ")
      .replace(/\bhours\b/g, "ਘੰਟੇ").replace(/\bhour\b/g, "ਘੰਟਾ")
      .replace(/\bminutes\b/g, "ਮਿੰਟ").replace(/\bminute\b/g, "ਮਿੰਟ")
      .replace(/\bseconds\b/g, "ਸਕਿੰਟ").replace(/\bsecond\b/g, "ਸਕਿੰਟ")
      .replace(/\bfrom P\b/g, "P ਤੋਂ")
      .replace(/\band B\b/g, "ਅਤੇ B")
      .replace(/\bso\b/g, "ਇਸ ਲਈ");
  }
  return out;
}

function nativeExplanation(source: EnglishRow, language: TsdCp005NativeLanguage) {
  return Object.freeze({
    method: nativeMethod(source.explanation.method, language),
    steps: Object.freeze(source.explanation.steps.map((step) => nativeStep(step, language))),
    shortcut: nativeShortcut(source.explanation.shortcut, language),
    finalAnswer: `${language === "hi" ? "उत्तर" : "ਉੱਤਰ"}: ${localizeCp005Choice(source.answerText, language)}।`,
  });
}

function makeRow(source: EnglishRow, language: TsdCp005NativeLanguage, ordinal: number): TsdCp005NativeReviewRowV1 {
  const stem = nativeStem(source, language, ordinal);
  const options = Object.freeze(source.options.map((option) => localizeCp005Choice(option, language)));
  const answerText = localizeCp005Choice(source.answerText, language);
  const explanation = nativeExplanation(source, language);

  assertTsdCp005NativeText(stem, language, `${source.permanentQlId}/${language}/stem`);
  options.forEach((option, index) => assertTsdCp005NativeText(option, language, `${source.permanentQlId}/${language}/option-${index + 1}`));
  assertTsdCp005NativeText(answerText, language, `${source.permanentQlId}/${language}/answer`);
  assertTsdCp005NativeText(explanation.method, language, `${source.permanentQlId}/${language}/method`);
  explanation.steps.forEach((step, index) => assertTsdCp005NativeText(step, language, `${source.permanentQlId}/${language}/step-${index + 1}`));
  assertTsdCp005NativeText(explanation.shortcut, language, `${source.permanentQlId}/${language}/shortcut`);
  assertTsdCp005NativeText(explanation.finalAnswer, language, `${source.permanentQlId}/${language}/final-answer`);

  return Object.freeze({
    source,
    presentation: Object.freeze({
      language,
      stem,
      options,
      correctIndex: source.correctIndex,
      answerText,
      explanation,
      lifecycle: Object.freeze({
        nativeReviewStatus: TSD_CP005_NATIVE_REVIEW_STATUS,
        multilingualFreezeStatus: "UNFROZEN" as const,
        productOwnerApprovalRecorded: false as const,
        questionStudioEnabled: false as const,
        questionBankStatus: "NOT_STORED" as const,
        testEligibility: "INELIGIBLE" as const,
        publiclyPublishable: false as const,
      }),
    }),
  });
}

export function generateCp005NativeReviewCandidateV1(): readonly TsdCp005NativeReviewRowV1[] {
  const counters = new Map<string, number>();
  const rows: TsdCp005NativeReviewRowV1[] = [];
  for (const source of TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q) {
    const ordinal = counters.get(source.permanentQlId) ?? 0;
    counters.set(source.permanentQlId, ordinal + 1);
    rows.push(makeRow(source, "hi", ordinal));
    rows.push(makeRow(source, "pa", ordinal));
  }
  return Object.freeze(rows);
}

export const TSD_CP005_NATIVE_REVIEW_CANDIDATE_V1 = generateCp005NativeReviewCandidateV1();
