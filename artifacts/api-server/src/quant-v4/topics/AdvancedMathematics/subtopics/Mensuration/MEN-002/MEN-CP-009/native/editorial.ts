import type { MenCp009ApprovedEnglishView } from "../approved/types";
import type { MenCp009NativeLanguage } from "./types";

function words(language: MenCp009NativeLanguage) {
  return language === "hi"
    ? {
        pi: (value: string) => `π = ${value} लें।`,
        times: "गुना",
        litres: "लीटर",
        answer: "उत्तर",
      }
    : {
        pi: (value: string) => `π = ${value} ਲਓ।`,
        times: "ਗੁਣਾ",
        litres: "ਲੀਟਰ",
        answer: "ਉੱਤਰ",
      };
}

function prepareEnglishStem(stem: string) {
  let text = stem.trim().replace(/\s+Calculate and mark the correct option\.$/i, "").trim();
  let piValue: string | null = null;
  const piMatch = text.match(/^(.*) Take π = (22\/7|3\.14)\.$/);
  if (piMatch) {
    text = piMatch[1]!.trim();
    piValue = piMatch[2]!;
  }
  return { text, piValue };
}

function groups(pattern: RegExp, value: string, familyId: string) {
  const match = value.match(pattern);
  if (!match) {
    throw new Error(`MEN-CP-009 native editorial stem mismatch for ${familyId}: ${value}`);
  }
  return match;
}

function finishStem(body: string, piValue: string | null, language: MenCp009NativeLanguage) {
  if (!piValue) return body;
  return `${body} ${words(language).pi(piValue)}`;
}

export function translateMenCp009Display(value: string, language: MenCp009NativeLanguage) {
  const w = words(language);
  return value
    .replace(/\blitres\b/gi, w.litres)
    .replace(/\btimes\b/gi, w.times)
    .replace(/\s+/g, " ")
    .trim();
}

export function translateMenCp009Stem(
  source: MenCp009ApprovedEnglishView,
  language: MenCp009NativeLanguage,
) {
  const { text, piValue } = prepareEnglishStem(source.stem);
  const hi = language === "hi";
  let body: string;

  switch (source.familyId) {
    case "SPHERE_SURFACE_FROM_RADIUS": {
      const m = groups(/^A sphere has radius (.+)\. Find its surface area\.$/, text, source.familyId);
      body = hi
        ? `एक गोले की त्रिज्या ${m[1]} है। उसका पृष्ठीय क्षेत्रफल ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦਾ ਅਰਧ ਵਿਆਸ ${m[1]} ਹੈ। ਇਸ ਦਾ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_SURFACE_FROM_DIAMETER": {
      const m = groups(/^A sphere has diameter (.+)\. Find its surface area\.$/, text, source.familyId);
      body = hi
        ? `एक गोले का व्यास ${m[1]} है। उसका पृष्ठीय क्षेत्रफल ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦਾ ਵਿਆਸ ${m[1]} ਹੈ। ਇਸ ਦਾ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_VOLUME_FROM_RADIUS": {
      const m = groups(/^Find the volume of a sphere of radius (.+)\.$/, text, source.familyId);
      body = hi
        ? `${m[1]} त्रिज्या वाले गोले का आयतन ज्ञात कीजिए।`
        : `${m[1]} ਅਰਧ ਵਿਆਸ ਵਾਲੇ ਗੋਲੇ ਦਾ ਆਇਤਨ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_VOLUME_FROM_DIAMETER": {
      const m = groups(/^A sphere has diameter (.+)\. Find its volume\.$/, text, source.familyId);
      body = hi
        ? `एक गोले का व्यास ${m[1]} है। उसका आयतन ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦਾ ਵਿਆਸ ${m[1]} ਹੈ। ਇਸ ਦਾ ਆਇਤਨ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_RADIUS_FROM_SURFACE": {
      const m = groups(/^A sphere has surface area (.+)\. Find its radius\.$/, text, source.familyId);
      body = hi
        ? `एक गोले का पृष्ठीय क्षेत्रफल ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦਾ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_DIAMETER_FROM_SURFACE": {
      const m = groups(/^A sphere has surface area (.+)\. Find its diameter\.$/, text, source.familyId);
      body = hi
        ? `एक गोले का पृष्ठीय क्षेत्रफल ${m[1]} है। उसका व्यास ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦਾ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ${m[1]} ਹੈ। ਇਸ ਦਾ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_RADIUS_FROM_VOLUME": {
      const m = groups(/^A sphere has volume (.+)\. Find its radius\.$/, text, source.familyId);
      body = hi
        ? `एक गोले का आयतन ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦਾ ਆਇਤਨ ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_DIAMETER_FROM_VOLUME": {
      const m = groups(/^A sphere has volume (.+)\. Find its diameter\.$/, text, source.familyId);
      body = hi
        ? `एक गोले का आयतन ${m[1]} है। उसका व्यास ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦਾ ਆਇਤਨ ${m[1]} ਹੈ। ਇਸ ਦਾ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_CSA_FROM_RADIUS": {
      const m = groups(/^A hemispherical dome has radius (.+)\. Find its curved surface area\.$/, text, source.familyId);
      body = hi
        ? `एक अर्धगोलाकार गुंबद की त्रिज्या ${m[1]} है। उसका वक्र पृष्ठीय क्षेत्रफल ज्ञात कीजिए।`
        : `ਇੱਕ ਅਰਧ-ਗੋਲਾਕਾਰ ਗੁੰਬਦ ਦਾ ਅਰਧ ਵਿਆਸ ${m[1]} ਹੈ। ਇਸ ਦਾ ਵਕਰ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_TSA_FROM_RADIUS": {
      const m = groups(/^A solid hemisphere has radius (.+)\. Find its total surface area\.$/, text, source.familyId);
      body = hi
        ? `एक ठोस अर्धगोले की त्रिज्या ${m[1]} है। उसका कुल पृष्ठीय क्षेत्रफल ज्ञात कीजिए।`
        : `ਇੱਕ ਠੋਸ ਅਰਧ-ਗੋਲੇ ਦਾ ਅਰਧ ਵਿਆਸ ${m[1]} ਹੈ। ਇਸ ਦਾ ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_VOLUME_FROM_RADIUS": {
      const m = groups(/^Find the volume of a hemisphere of radius (.+)\.$/, text, source.familyId);
      body = hi
        ? `${m[1]} त्रिज्या वाले अर्धगोले का आयतन ज्ञात कीजिए।`
        : `${m[1]} ਅਰਧ ਵਿਆਸ ਵਾਲੇ ਅਰਧ-ਗੋਲੇ ਦਾ ਆਇਤਨ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_CSA": {
      const m = groups(/^A hemisphere has curved area (.+)\. Find its radius\.$/, text, source.familyId);
      body = hi
        ? `एक अर्धगोले का वक्र पृष्ठीय क्षेत्रफल ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
        : `ਇੱਕ ਅਰਧ-ਗੋਲੇ ਦਾ ਵਕਰ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_TSA": {
      const m = groups(/^A hemisphere has total area (.+)\. Find its radius\.$/, text, source.familyId);
      body = hi
        ? `एक अर्धगोले का कुल पृष्ठीय क्षेत्रफल ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
        : `ਇੱਕ ਅਰਧ-ਗੋਲੇ ਦਾ ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_VOLUME": {
      const m = groups(/^A hemisphere has volume (.+)\. Find its radius\.$/, text, source.familyId);
      body = hi
        ? `एक अर्धगोले का आयतन ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
        : `ਇੱਕ ਅਰਧ-ਗੋਲੇ ਦਾ ਆਇਤਨ ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_CAPACITY_LITRES": {
      const m = groups(/^A hemispherical vessel has internal radius (.+)\. Find its capacity in litres\.$/, text, source.familyId);
      body = hi
        ? `एक अर्धगोलाकार पात्र की भीतरी त्रिज्या ${m[1]} है। उसकी धारिता लीटर में ज्ञात कीजिए।`
        : `ਇੱਕ ਅਰਧ-ਗੋਲਾਕਾਰ ਭਾਂਡੇ ਦਾ ਅੰਦਰਲਾ ਅਰਧ ਵਿਆਸ ${m[1]} ਹੈ। ਇਸ ਦੀ ਸਮਰੱਥਾ ਲੀਟਰਾਂ ਵਿੱਚ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_PAINTING_COST": {
      const m = groups(/^A sphere of radius (.+) is painted at (₹[\d,]+) per square metre\. Find the cost\.$/, text, source.familyId);
      body = hi
        ? `${m[1]} त्रिज्या वाले गोले को ${m[2]} प्रति वर्ग मीटर की दर से रंगा जाता है। कुल लागत ज्ञात कीजिए।`
        : `${m[1]} ਅਰਧ ਵਿਆਸ ਵਾਲੇ ਗੋਲੇ ਨੂੰ ${m[2]} ਪ੍ਰਤੀ ਵਰਗ ਮੀਟਰ ਦੀ ਦਰ ਨਾਲ ਰੰਗਿਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਲਾਗਤ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_INNER_POLISHING_COST": {
      const m = groups(/^The inside of a hemispherical bowl of radius (.+) is polished at (₹[\d,]+) per square metre\. Find the cost\.$/, text, source.familyId);
      body = hi
        ? `${m[1]} त्रिज्या वाले अर्धगोलाकार कटोरे की भीतरी सतह को ${m[2]} प्रति वर्ग मीटर की दर से पॉलिश किया जाता है। लागत ज्ञात कीजिए।`
        : `${m[1]} ਅਰਧ ਵਿਆਸ ਵਾਲੇ ਅਰਧ-ਗੋਲਾਕਾਰ ਕਟੋਰੇ ਦੀ ਅੰਦਰਲੀ ਸਤ੍ਹਾ ਨੂੰ ${m[2]} ਪ੍ਰਤੀ ਵਰਗ ਮੀਟਰ ਦੀ ਦਰ ਨਾਲ ਪਾਲਿਸ਼ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਲਾਗਤ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_SURFACE_RATIO": {
      const m = groups(/^Two spheres have radii (.+) and (.+)\. Find the ratio of their surface areas, in the order given\.$/, text, source.familyId);
      body = hi
        ? `दो गोलों की त्रिज्याएँ ${m[1]} और ${m[2]} हैं। इसी क्रम में उनके पृष्ठीय क्षेत्रफलों का अनुपात ज्ञात कीजिए।`
        : `ਦੋ ਗੋਲਿਆਂ ਦੇ ਅਰਧ ਵਿਆਸ ${m[1]} ਅਤੇ ${m[2]} ਹਨ। ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦੇ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_VOLUME_RATIO": {
      const m = groups(/^Two spheres have radii (.+) and (.+)\. Find the ratio of their volumes, in the order given\.$/, text, source.familyId);
      body = hi
        ? `दो गोलों की त्रिज्याएँ ${m[1]} और ${m[2]} हैं। इसी क्रम में उनके आयतनों का अनुपात ज्ञात कीजिए।`
        : `ਦੋ ਗੋਲਿਆਂ ਦੇ ਅਰਧ ਵਿਆਸ ${m[1]} ਅਤੇ ${m[2]} ਹਨ। ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦੇ ਆਇਤਨਾਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "RADIUS_RATIO_FROM_SURFACE_RATIO": {
      const m = groups(/^The surface areas of two spheres are in the ratio (.+)\. Find their radius ratio\.$/, text, source.familyId);
      body = hi
        ? `दो गोलों के पृष्ठीय क्षेत्रफलों का अनुपात ${m[1]} है। उनकी त्रिज्याओं का अनुपात ज्ञात कीजिए।`
        : `ਦੋ ਗੋਲਿਆਂ ਦੇ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲਾਂ ਦਾ ਅਨੁਪਾਤ ${m[1]} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਅਰਧ ਵਿਆਸਾਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "RADIUS_RATIO_FROM_VOLUME_RATIO": {
      const m = groups(/^The volumes of two spheres are in the ratio (.+)\. Find their radius ratio\.$/, text, source.familyId);
      body = hi
        ? `दो गोलों के आयतनों का अनुपात ${m[1]} है। उनकी त्रिज्याओं का अनुपात ज्ञात कीजिए।`
        : `ਦੋ ਗੋਲਿਆਂ ਦੇ ਆਇਤਨਾਂ ਦਾ ਅਨੁਪਾਤ ${m[1]} ਹੈ। ਉਨ੍ਹਾਂ ਦੇ ਅਰਧ ਵਿਆਸਾਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_SURFACE_PERCENT_CHANGE": {
      const m = groups(/^The radius of a sphere increases by (.+)\. Find the percentage increase in its surface area\.$/, text, source.familyId);
      body = hi
        ? `एक गोले की त्रिज्या में ${m[1]} की वृद्धि होती है। उसके पृष्ठीय क्षेत्रफल में प्रतिशत वृद्धि ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦੇ ਅਰਧ ਵਿਆਸ ਵਿੱਚ ${m[1]} ਵਾਧਾ ਹੁੰਦਾ ਹੈ। ਇਸ ਦੇ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_VOLUME_PERCENT_CHANGE": {
      const m = groups(/^The radius of a sphere increases by (.+)\. Find the percentage increase in its volume\.$/, text, source.familyId);
      body = hi
        ? `एक गोले की त्रिज्या में ${m[1]} की वृद्धि होती है। उसके आयतन में प्रतिशत वृद्धि ज्ञात कीजिए।`
        : `ਇੱਕ ਗੋਲੇ ਦੇ ਅਰਧ ਵਿਆਸ ਵਿੱਚ ${m[1]} ਵਾਧਾ ਹੁੰਦਾ ਹੈ। ਇਸ ਦੇ ਆਇਤਨ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧਾ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "SPHERE_HEMISPHERE_MEASURE_RATIO": {
      if (/sphere volume : hemisphere volume/i.test(text)) {
        body = hi
          ? "एक गोले और एक अर्धगोले की त्रिज्या समान है। गोले के आयतन : अर्धगोले के आयतन का अनुपात ज्ञात कीजिए।"
          : "ਇੱਕ ਗੋਲੇ ਅਤੇ ਇੱਕ ਅਰਧ-ਗੋਲੇ ਦਾ ਅਰਧ ਵਿਆਸ ਇੱਕੋ ਜਿਹਾ ਹੈ। ਗੋਲੇ ਦੇ ਆਇਤਨ : ਅਰਧ-ਗੋਲੇ ਦੇ ਆਇਤਨ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।";
      } else {
        groups(/^A sphere and a solid hemisphere have the same radius\. Find sphere surface area : hemisphere total area\.$/, text, source.familyId);
        body = hi
          ? "एक गोले और एक ठोस अर्धगोले की त्रिज्या समान है। गोले के पृष्ठीय क्षेत्रफल : अर्धगोले के कुल पृष्ठीय क्षेत्रफल का अनुपात ज्ञात कीजिए।"
          : "ਇੱਕ ਗੋਲੇ ਅਤੇ ਇੱਕ ਠੋਸ ਅਰਧ-ਗੋਲੇ ਦਾ ਅਰਧ ਵਿਆਸ ਇੱਕੋ ਜਿਹਾ ਹੈ। ਗੋਲੇ ਦੇ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਅਰਧ-ਗੋਲੇ ਦੇ ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।";
      }
      break;
    }
    case "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO": {
      let m = text.match(/^A sphere has radius (.+)\. Find surface area : volume\.$/);
      if (m) {
        body = hi
          ? `एक गोले की त्रिज्या ${m[1]} है। पृष्ठीय क्षेत्रफल : आयतन का अनुपात ज्ञात कीजिए।`
          : `ਇੱਕ ਗੋਲੇ ਦਾ ਅਰਧ ਵਿਆਸ ${m[1]} ਹੈ। ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
      } else {
        m = groups(/^A hemisphere has radius (.+)\. Find curved surface area : volume\.$/, text, source.familyId);
        body = hi
          ? `एक अर्धगोले की त्रिज्या ${m[1]} है। वक्र पृष्ठीय क्षेत्रफल : आयतन का अनुपात ज्ञात कीजिए।`
          : `ਇੱਕ ਅਰਧ-ਗੋਲੇ ਦਾ ਅਰਧ ਵਿਆਸ ${m[1]} ਹੈ। ਵਕਰ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
      }
      break;
    }
    case "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO": {
      let m = text.match(/^For a sphere, surface area : volume is (.+)\. Find its radius\.$/);
      if (m) {
        body = hi
          ? `एक गोले के लिए पृष्ठीय क्षेत्रफल : आयतन = ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
          : `ਇੱਕ ਗੋਲੇ ਲਈ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ = ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      } else {
        m = groups(/^For a hemisphere, curved surface area : volume is (.+)\. Find its radius\.$/, text, source.familyId);
        body = hi
          ? `एक अर्धगोले के लिए वक्र पृष्ठीय क्षेत्रफल : आयतन = ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
          : `ਇੱਕ ਅਰਧ-ਗੋਲੇ ਲਈ ਵਕਰ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ = ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      }
      break;
    }
    case "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO": {
      const m = groups(/^A solid hemisphere has radius (.+)\. Find total surface area : volume\.$/, text, source.familyId);
      body = hi
        ? `एक ठोस अर्धगोले की त्रिज्या ${m[1]} है। कुल पृष्ठीय क्षेत्रफल : आयतन का अनुपात ज्ञात कीजिए।`
        : `ਇੱਕ ਠੋਸ ਅਰਧ-ਗੋਲੇ ਦਾ ਅਰਧ ਵਿਆਸ ${m[1]} ਹੈ। ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO": {
      const m = groups(/^For a solid hemisphere, total surface area : volume is (.+)\. Find its radius\.$/, text, source.familyId);
      body = hi
        ? `एक ठोस अर्धगोले के लिए कुल पृष्ठीय क्षेत्रफल : आयतन = ${m[1]} है। उसकी त्रिज्या ज्ञात कीजिए।`
        : `ਇੱਕ ਠੋਸ ਅਰਧ-ਗੋਲੇ ਲਈ ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ = ${m[1]} ਹੈ। ਇਸ ਦਾ ਅਰਧ ਵਿਆਸ ਪਤਾ ਕਰੋ।`;
      break;
    }
    default:
      throw new Error(`Unknown MEN-CP-009 native family: ${source.familyId}`);
  }

  return finishStem(body, piValue, language);
}

function formulaLine(familyId: string, language: MenCp009NativeLanguage) {
  const hi = language === "hi";
  switch (familyId) {
    case "SPHERE_SURFACE_FROM_RADIUS":
    case "SPHERE_SURFACE_FROM_DIAMETER":
    case "SPHERE_RADIUS_FROM_SURFACE":
    case "SPHERE_DIAMETER_FROM_SURFACE":
      return hi ? "गोले का पृष्ठीय क्षेत्रफल = 4πr²।" : "ਗੋਲੇ ਦਾ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ = 4πr²।";
    case "SPHERE_VOLUME_FROM_RADIUS":
    case "SPHERE_VOLUME_FROM_DIAMETER":
    case "SPHERE_RADIUS_FROM_VOLUME":
    case "SPHERE_DIAMETER_FROM_VOLUME":
      return hi ? "गोले का आयतन = 4/3 × πr³।" : "ਗੋਲੇ ਦਾ ਆਇਤਨ = 4/3 × πr³।";
    case "HEMISPHERE_CSA_FROM_RADIUS":
    case "HEMISPHERE_RADIUS_FROM_CSA":
      return hi ? "अर्धगोले का वक्र पृष्ठीय क्षेत्रफल = 2πr²।" : "ਅਰਧ-ਗੋਲੇ ਦਾ ਵਕਰ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ = 2πr²।";
    case "HEMISPHERE_TSA_FROM_RADIUS":
    case "HEMISPHERE_RADIUS_FROM_TSA":
      return hi ? "अर्धगोले का कुल पृष्ठीय क्षेत्रफल = 3πr²।" : "ਅਰਧ-ਗੋਲੇ ਦਾ ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ = 3πr²।";
    case "HEMISPHERE_VOLUME_FROM_RADIUS":
    case "HEMISPHERE_RADIUS_FROM_VOLUME":
      return hi ? "अर्धगोले का आयतन = 2/3 × πr³।" : "ਅਰਧ-ਗੋਲੇ ਦਾ ਆਇਤਨ = 2/3 × πr³।";
    case "HEMISPHERE_CAPACITY_LITRES":
      return hi
        ? "धारिता = 2/3 × πr³ और 1000 cm³ = 1 लीटर।"
        : "ਸਮਰੱਥਾ = 2/3 × πr³ ਅਤੇ 1000 cm³ = 1 ਲੀਟਰ।";
    case "SPHERE_PAINTING_COST":
      return hi ? "लागत = 4πr² × दर।" : "ਲਾਗਤ = 4πr² × ਦਰ।";
    case "HEMISPHERE_INNER_POLISHING_COST":
      return hi
        ? "केवल भीतरी वक्र सतह पॉलिश होती है, इसलिए क्षेत्रफल = 2πr²।"
        : "ਕੇਵਲ ਅੰਦਰਲੀ ਵਕਰ ਸਤ੍ਹਾ ਪਾਲਿਸ਼ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਖੇਤਰਫਲ = 2πr²।";
    case "SPHERE_SURFACE_RATIO":
    case "RADIUS_RATIO_FROM_SURFACE_RATIO":
    case "SPHERE_SURFACE_PERCENT_CHANGE":
      return hi
        ? "गोले का पृष्ठीय क्षेत्रफल r² के समानुपाती होता है।"
        : "ਗੋਲੇ ਦਾ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ r² ਦੇ ਸਮਾਨੁਪਾਤੀ ਹੁੰਦਾ ਹੈ।";
    case "SPHERE_VOLUME_RATIO":
    case "RADIUS_RATIO_FROM_VOLUME_RATIO":
    case "SPHERE_VOLUME_PERCENT_CHANGE":
      return hi
        ? "गोले का आयतन r³ के समानुपाती होता है।"
        : "ਗੋਲੇ ਦਾ ਆਇਤਨ r³ ਦੇ ਸਮਾਨੁਪਾਤੀ ਹੁੰਦਾ ਹੈ।";
    case "SPHERE_HEMISPHERE_MEASURE_RATIO":
      return hi
        ? "संबंधित गोले और अर्धगोले के सूत्र लगाएँ; अनुपात में π और समान घातें कट जाती हैं।"
        : "ਸੰਬੰਧਿਤ ਗੋਲੇ ਅਤੇ ਅਰਧ-ਗੋਲੇ ਦੇ ਸੂਤਰ ਲਗਾਓ; ਅਨੁਪਾਤ ਵਿੱਚ π ਅਤੇ ਸਾਂਝੀਆਂ ਘਾਤਾਂ ਕੱਟ ਜਾਂਦੀਆਂ ਹਨ।";
    case "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO":
    case "RADIUS_FROM_CURVED_SURFACE_VOLUME_RATIO":
      return hi
        ? "गोले के लिए, और अर्धगोले के वक्र क्षेत्रफल के लिए, पृष्ठीय क्षेत्रफल : आयतन = 3 : r।"
        : "ਗੋਲੇ ਲਈ, ਅਤੇ ਅਰਧ-ਗੋਲੇ ਦੇ ਵਕਰ ਖੇਤਰਫਲ ਲਈ, ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ = 3 : r।";
    case "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO":
    case "HEMISPHERE_RADIUS_FROM_TOTAL_SURFACE_VOLUME_RATIO":
      return hi
        ? "अर्धगोले के लिए कुल पृष्ठीय क्षेत्रफल : आयतन = 9 : 2r।"
        : "ਅਰਧ-ਗੋਲੇ ਲਈ ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ : ਆਇਤਨ = 9 : 2r।";
    default:
      throw new Error(`Unknown MEN-CP-009 formula family: ${familyId}`);
  }
}

function calculationLine(value: string, language: MenCp009NativeLanguage) {
  const hi = language === "hi";
  let line = translateMenCp009Display(value, language);
  let m = line.match(/^The ratio is (.+)\.$/);
  if (m) return hi ? `अनुपात ${m[1]} है।` : `ਅਨੁਪਾਤ ${m[1]} ਹੈ।`;
  m = line.match(/^The radius ratio is (.+)\.$/);
  if (m) return hi ? `त्रिज्याओं का अनुपात ${m[1]} है।` : `ਅਰਧ ਵਿਆਸਾਂ ਦਾ ਅਨੁਪਾਤ ${m[1]} ਹੈ।`;
  m = line.match(/^The increase is (.+)\.$/);
  if (m) return hi ? `वृद्धि ${m[1]} है।` : `ਵਾਧਾ ${m[1]} ਹੈ।`;
  m = line.match(/^Cancel π and the common factor of r²; the remaining ratio is (.+), which is already simplest\.$/);
  if (m) return hi
    ? `π और r² का समान गुणक काटने पर अनुपात ${m[1]} मिलता है, जो सरलतम रूप में है।`
    : `π ਅਤੇ r² ਦਾ ਸਾਂਝਾ ਗੁਣਕ ਕੱਟਣ ਤੇ ਅਨੁਪਾਤ ${m[1]} ਮਿਲਦਾ ਹੈ, ਜੋ ਸਰਲਤਮ ਰੂਪ ਵਿੱਚ ਹੈ।`;
  m = line.match(/^The second term therefore gives (.+)\.$/);
  if (m) return hi ? `अतः दूसरे पद से ${m[1]} मिलता है।` : `ਇਸ ਲਈ ਦੂਜੇ ਪਦ ਤੋਂ ${m[1]} ਮਿਲਦਾ ਹੈ।`;
  m = line.match(/^Cancel π and r² to obtain (.+), then reduce if needed to (.+)\.$/);
  if (m) return hi
    ? `π और r² काटने पर ${m[1]} मिलता है; सरल करने पर ${m[2]}।`
    : `π ਅਤੇ r² ਕੱਟਣ ਤੇ ${m[1]} ਮਿਲਦਾ ਹੈ; ਸਰਲ ਕਰਨ ਤੇ ${m[2]}।`;
  m = line.match(/^Reconstructing the unsimplified relation gives (.+), hence (.+)\.$/);
  if (m) return hi
    ? `मूल अनुपात से ${m[1]} मिलता है, इसलिए ${m[2]}।`
    : `ਮੂਲ ਅਨੁਪਾਤ ਤੋਂ ${m[1]} ਮਿਲਦਾ ਹੈ, ਇਸ ਲਈ ${m[2]}।`;

  line = line.replace(/, so /g, hi ? ", इसलिए " : ", ਇਸ ਲਈ ");
  return line;
}

export function translateMenCp009Explanation(
  source: MenCp009ApprovedEnglishView,
  language: MenCp009NativeLanguage,
) {
  const answer = translateMenCp009Display(source.answer, language);
  const middle = source.explanationLines.slice(1, -1).map((line) => calculationLine(line, language));
  return [
    formulaLine(source.familyId, language),
    ...middle,
    `${words(language).answer}: ${answer}`,
  ];
}
