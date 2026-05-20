import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { EditorialRealization } from "../../editorial/editorial-types";
import type { ReasoningGraph } from "../../reasoning/reasoning-graph-types";
import type { RealizationProfile } from "../../editorial/realization-profiles";
import {
  COMMERCIAL_OBJECT_POOL,
  selectCommercialObject,
} from "../../editorial/commercial-object-pools";
import { currency } from "../../editorial/quantity-formatting";
import { roundClean } from "../../utils/math-utils";
import type { LanguageCode } from "../contracts/language-contracts";
import { extractStemIntent, type StemIntent } from "../intents/stem-intents";

function n(value: number | undefined) {
  if (typeof value !== "number") {
    return "";
  }
  const rounded = roundClean(value, 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function absPercent(value: number | undefined) {
  return `${n(Math.abs(value ?? 0))}%`;
}

function rateWordHi(value: number | undefined) {
  return (value ?? 0) < 0 ? "कमी" : "वृद्धि";
}

function rateWordPa(value: number | undefined) {
  return (value ?? 0) < 0 ? "ਕਮੀ" : "ਵਾਧਾ";
}

function relationWordHi(direction: number | undefined) {
  return direction === 0 ? "कम" : "अधिक";
}

function relationWordPa(direction: number | undefined) {
  return direction === 0 ? "ਘੱਟ" : "ਵੱਧ";
}

function commercialObjectForIntent(intent: StemIntent) {
  const locked = COMMERCIAL_OBJECT_POOL.find(
    (item) => item.id === intent.semanticAnchorKey,
  );
  if (locked) {
    return locked;
  }

  return selectCommercialObject({
    namespace: `${intent.key}|${intent.topologyVariant ?? ""}`,
    seed: JSON.stringify(intent.values),
  });
}

function renderHindi(intent: StemIntent, profile?: RealizationProfile) {
  const v = intent.values;
  const commercialObject = commercialObjectForIntent(intent);

  switch (intent.key) {
    case "stem.successive_change":
      return `${commercialObject.hi} का मूल्य ${currency(v.base, profile)} था। इसमें पहले ${absPercent(v.firstRate)} ${rateWordHi(v.firstRate)} और फिर ${absPercent(v.secondRate)} ${rateWordHi(v.secondRate)} हुई। अंतिम मूल्य ज्ञात कीजिए।`;
    case "stem.election_votes":
      if (intent.topologyVariant === "turnout_margin") {
        return `एक निर्वाचन में ${absPercent(v.turnoutPercent)} पंजीकृत मतदाताओं ने मतदान किया। इनमें से ${absPercent(v.invalidPercent)} वोट अवैध थे। विजयी उम्मीदवार को वैध वोटों के ${absPercent(v.winnerPercent)} वोट मिले और जीत का अंतर ${n(v.margin)} वोट था। पंजीकृत मतदाताओं की संख्या ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "invalid_vote_margin") {
        return `एक निर्वाचन में ${absPercent(v.invalidPercent)} वोट अवैध थे। विजयी उम्मीदवार को वैध वोटों के ${absPercent(v.winnerPercent)} वोट मिले और जीत का अंतर ${n(v.margin)} वोट था। कुल डाले गए वोट ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "multi_candidate_margin") {
        return `एक निर्वाचन में विजयी उम्मीदवार को ${absPercent(v.winnerPercent)} वोट और प्रत्याशी C को ${absPercent(v.thirdPercent)} वोट मिले। विजयी उम्मीदवार ने प्रत्याशी B को ${n(v.margin)} वोटों से हराया। कुल वोट ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "remaining_vote_margin") {
        return `एक निर्वाचन में विजयी उम्मीदवार को ${absPercent(v.winnerPercent)} वोट और दूसरे प्रत्याशी को ${absPercent(v.knownOtherPercent)} वोट मिले। शेष वोट तीसरे प्रत्याशी को मिले। विजयी उम्मीदवार ने तीसरे प्रत्याशी को ${n(v.margin)} वोटों से हराया। कुल वोट ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "filtered_valid_vote_margin") {
        return `एक निर्वाचन में ${absPercent(v.turnoutPercent)} पंजीकृत मतदाताओं ने मतदान किया और उनमें से ${absPercent(v.validPercent)} वोट वैध थे। विजयी उम्मीदवार को वैध वोटों के ${absPercent(v.winnerPercent)} वोट मिले। जीत का अंतर ${n(v.margin)} वोट था। विजयी उम्मीदवार के वोट ज्ञात कीजिए।`;
      }
      return `एक निर्वाचन में विजयी उम्मीदवार को कुल वोटों के ${absPercent(v.winnerPercent)} वोट मिले और उसने प्रतिद्वंद्वी को ${n(v.margin)} वोटों से हराया। कुल डाले गए वोट ज्ञात कीजिए।`;
    case "stem.pass_fail_marks":
      if (intent.topologyVariant === "pass_fail_gap") {
        return `एक परीक्षा में एक अभ्यर्थी ने ${absPercent(v.scoredPercent)} अंक प्राप्त किए और ${n(v.shortBy)} अंकों से अनुत्तीर्ण हुआ। दूसरे अभ्यर्थी ने ${absPercent(v.highScorePercent)} अंक प्राप्त किए और उत्तीर्णांक से ${n(v.excessBy)} अंक अधिक पाए। अधिकतम अंक ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "successive_mark_adjustment") {
        return `एक परीक्षा में अभ्यर्थी ने पहले ${absPercent(v.rawPercent)} अंक प्राप्त किए। ${absPercent(v.bonusPercent)} बोनस जोड़ने के बाद भी वह ${n(v.shortBy)} अंकों से कम रह गया। उत्तीर्णांक ${absPercent(v.passPercent)} हैं। अधिकतम अंक ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "remaining_marks_required") {
        return `एक परीक्षा में ${absPercent(v.completedPercent)} पेपर का मूल्यांकन हो चुका है। छात्र ने उसमें ${absPercent(v.scoredOnCompletedPercent)} अंक प्राप्त किए। कुल ${absPercent(v.requiredOverallPercent)} अंक पाने के लिए उसे अभी ${n(v.remainingMarksRequired)} अंक चाहिए। अधिकतम अंक ज्ञात कीजिए।`;
      }
      return `एक परीक्षा में एक अभ्यर्थी ने ${absPercent(v.scoredPercent)} अंक प्राप्त किए और ${n(v.shortBy)} अंकों से अनुत्तीर्ण हुआ। उत्तीर्णांक ${absPercent(v.passPercent)} हैं। अधिकतम अंक ज्ञात कीजिए।`;
    case "stem.population_growth":
      if (intent.topologyVariant === "growth_then_decay") {
        return `एक जिला जनसंख्या रिपोर्ट के अनुसार जनसंख्या ${n(v.population)} थी। इसमें ${absPercent(v.growthRate)} वृद्धि हुई और फिर ${absPercent(v.decayRate)} कमी हुई। अंतिम जनसंख्या ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "migration_adjusted_population") {
        return `एक नगर जनसंख्या रिपोर्ट में जनसंख्या ${n(v.population)} थी। इसमें ${absPercent(v.growthRate)} वृद्धि हुई। साथ ही मूल जनसंख्या के ${absPercent(v.migrationPercent)} लोग बाहर से आए। अंतिम जनसंख्या ज्ञात कीजिए।`;
      }
      if (intent.topologyVariant === "male_female_population_shift") {
        return `एक जनसंख्या रिपोर्ट में कुल जनसंख्या ${n(v.totalPopulation)} थी। पुरुष ${absPercent(v.malePercent)} थे और शेष महिलाएं थीं। पुरुष जनसंख्या ${absPercent(v.maleGrowthRate)} बढ़ी, जबकि महिला जनसंख्या ${absPercent(v.femaleDecayRate)} घटी। अंतिम जनसंख्या ज्ञात कीजिए।`;
      }
      return `एक जनसंख्या रिपोर्ट में जनसंख्या ${n(v.population)} थी। यह ${n(v.years)} वर्षों तक प्रति वर्ष ${absPercent(v.rate)} बढ़ी। इस अवधि के बाद जनसंख्या ज्ञात कीजिए।`;
    case "stem.reverse_percentage":
      return `किसी मात्रा का ${absPercent(v.percent)} भाग ${n(v.part)} है। पूरी मात्रा ज्ञात कीजिए।`;
    case "stem.restore_original":
      return `एक वस्तु के मूल्य में ${absPercent(v.cutPercent)} कमी हुई। मूल मूल्य पर वापस आने के लिए कितने प्रतिशत वृद्धि चाहिए?`;
    case "stem.salary_increment":
      return `एक कर्मचारी का वेतन ${n(v.oldSalary)} से बदलकर ${n(v.newSalary)} हो गया। पुराने वेतन के आधार पर प्रतिशत परिवर्तन ज्ञात कीजिए।`;
    case "stem.price_consumption":
      return `ईंधन की कीमत ${absPercent(v.priceIncreasePercent)} बढ़ गई। यदि कुल खर्च समान रखना हो, तो खपत कितने प्रतिशत घटानी होगी?`;
    case "stem.shopkeeper_profit":
      return `एक दुकानदार ने ${commercialObject.hi} ${currency(v.costPrice, profile)} में खरीदा और ${currency(v.sellingPrice, profile)} में बेचा। लागत मूल्य पर लाभ या हानि प्रतिशत ज्ञात कीजिए।`;
    case "stem.mixture_water_milk":
      return `एक दूध-पानी मिश्रण की मात्रा ${n(v.total)} लीटर है और उसमें ${absPercent(v.initialPercent)} दूध है। दूध को ${absPercent(v.targetPercent)} करने के लिए कितना दूध मिलाना होगा?`;
    case "stem.relational_percentage":
      if ((v.relationCount ?? 1) >= 3) {
        return `A की आय B से ${absPercent(v.relation1Percent)} ${relationWordHi(v.relation1Direction)} है। B की आय C से ${absPercent(v.relation2Percent)} ${relationWordHi(v.relation2Direction)} है। C की आय D से ${absPercent(v.relation3Percent)} ${relationWordHi(v.relation3Direction)} है। A की आय D से कितने प्रतिशत अधिक या कम है?`;
      }
      if ((v.relationCount ?? 1) >= 2) {
        return `A की आय B से ${absPercent(v.relation1Percent)} ${relationWordHi(v.relation1Direction)} है। B की आय C से ${absPercent(v.relation2Percent)} ${relationWordHi(v.relation2Direction)} है। A की आय C से कितने प्रतिशत अधिक या कम है?`;
      }
      return `A की आय B से ${absPercent(v.relation1Percent)} ${relationWordHi(v.relation1Direction)} है। A की आय B से कितने प्रतिशत अधिक या कम है?`;
    default:
      return intent.fallbackText;
  }
}

function renderPunjabi(intent: StemIntent, profile?: RealizationProfile) {
  const v = intent.values;
  const commercialObject = commercialObjectForIntent(intent);

  switch (intent.key) {
    case "stem.successive_change":
      return `${commercialObject.pa} ਦੀ ਕੀਮਤ ${currency(v.base, profile)} ਸੀ। ਪਹਿਲਾਂ ${absPercent(v.firstRate)} ${rateWordPa(v.firstRate)} ਅਤੇ ਫਿਰ ${absPercent(v.secondRate)} ${rateWordPa(v.secondRate)} ਹੋਈ। ਅੰਤਿਮ ਕੀਮਤ ਪਤਾ ਕਰੋ।`;
    case "stem.election_votes":
      if (intent.topologyVariant === "turnout_margin") {
        return `ਇੱਕ ਚੋਣ ਵਿੱਚ ${absPercent(v.turnoutPercent)} ਰਜਿਸਟਰਡ ਵੋਟਰਾਂ ਨੇ ਵੋਟ ਪਾਈ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ${absPercent(v.invalidPercent)} ਵੋਟ ਅਯੋਗ ਸਨ। ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੂੰ ਯੋਗ ਵੋਟਾਂ ਦੇ ${absPercent(v.winnerPercent)} ਵੋਟ ਮਿਲੇ ਅਤੇ ਜਿੱਤ ਦਾ ਅੰਤਰ ${n(v.margin)} ਵੋਟ ਸੀ। ਰਜਿਸਟਰਡ ਵੋਟਰਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "invalid_vote_margin") {
        return `ਇੱਕ ਚੋਣ ਵਿੱਚ ${absPercent(v.invalidPercent)} ਵੋਟ ਅਯੋਗ ਸਨ। ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੂੰ ਯੋਗ ਵੋਟਾਂ ਦੇ ${absPercent(v.winnerPercent)} ਵੋਟ ਮਿਲੇ ਅਤੇ ਜਿੱਤ ਦਾ ਅੰਤਰ ${n(v.margin)} ਵੋਟ ਸੀ। ਕੁੱਲ ਪਏ ਵੋਟ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "multi_candidate_margin") {
        return `ਇੱਕ ਚੋਣ ਵਿੱਚ ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੂੰ ${absPercent(v.winnerPercent)} ਵੋਟ ਅਤੇ ਉਮੀਦਵਾਰ C ਨੂੰ ${absPercent(v.thirdPercent)} ਵੋਟ ਮਿਲੇ। ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੇ ਉਮੀਦਵਾਰ B ਨੂੰ ${n(v.margin)} ਵੋਟਾਂ ਨਾਲ ਹਰਾਇਆ। ਕੁੱਲ ਵੋਟ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "remaining_vote_margin") {
        return `ਇੱਕ ਚੋਣ ਵਿੱਚ ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੂੰ ${absPercent(v.winnerPercent)} ਵੋਟ ਅਤੇ ਦੂਜੇ ਉਮੀਦਵਾਰ ਨੂੰ ${absPercent(v.knownOtherPercent)} ਵੋਟ ਮਿਲੇ। ਬਾਕੀ ਵੋਟ ਤੀਜੇ ਉਮੀਦਵਾਰ ਨੂੰ ਮਿਲੇ। ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੇ ਤੀਜੇ ਨੂੰ ${n(v.margin)} ਵੋਟਾਂ ਨਾਲ ਹਰਾਇਆ। ਕੁੱਲ ਵੋਟ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "filtered_valid_vote_margin") {
        return `ਇੱਕ ਚੋਣ ਵਿੱਚ ${absPercent(v.turnoutPercent)} ਰਜਿਸਟਰਡ ਵੋਟਰਾਂ ਨੇ ਵੋਟ ਪਾਈ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ ${absPercent(v.validPercent)} ਵੋਟ ਯੋਗ ਸਨ। ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੂੰ ਯੋਗ ਵੋਟਾਂ ਦੇ ${absPercent(v.winnerPercent)} ਵੋਟ ਮਿਲੇ। ਜਿੱਤ ਦਾ ਅੰਤਰ ${n(v.margin)} ਵੋਟ ਸੀ। ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਦੇ ਵੋਟ ਪਤਾ ਕਰੋ।`;
      }
      return `ਇੱਕ ਚੋਣ ਵਿੱਚ ਜਿੱਤਣ ਵਾਲੇ ਉਮੀਦਵਾਰ ਨੂੰ ਕੁੱਲ ਵੋਟਾਂ ਦੇ ${absPercent(v.winnerPercent)} ਵੋਟ ਮਿਲੇ ਅਤੇ ਉਸ ਨੇ ਮੁਕਾਬਲੇਦਾਰ ਨੂੰ ${n(v.margin)} ਵੋਟਾਂ ਨਾਲ ਹਰਾਇਆ। ਕੁੱਲ ਪਏ ਵੋਟ ਪਤਾ ਕਰੋ।`;
    case "stem.pass_fail_marks":
      if (intent.topologyVariant === "pass_fail_gap") {
        return `ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਇੱਕ ਉਮੀਦਵਾਰ ਨੇ ${absPercent(v.scoredPercent)} ਅੰਕ ਲਏ ਅਤੇ ${n(v.shortBy)} ਅੰਕਾਂ ਨਾਲ ਫੇਲ੍ਹ ਹੋਇਆ। ਦੂਜੇ ਉਮੀਦਵਾਰ ਨੇ ${absPercent(v.highScorePercent)} ਅੰਕ ਲਏ ਅਤੇ ਪਾਸ ਅੰਕਾਂ ਤੋਂ ${n(v.excessBy)} ਅੰਕ ਵੱਧ ਲਏ। ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "successive_mark_adjustment") {
        return `ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਉਮੀਦਵਾਰ ਨੇ ਪਹਿਲਾਂ ${absPercent(v.rawPercent)} ਅੰਕ ਲਏ। ${absPercent(v.bonusPercent)} ਬੋਨਸ ਜੋੜਨ ਤੋਂ ਬਾਅਦ ਵੀ ਉਹ ${n(v.shortBy)} ਅੰਕਾਂ ਨਾਲ ਘੱਟ ਰਹਿ ਗਿਆ। ਪਾਸ ਅੰਕ ${absPercent(v.passPercent)} ਹਨ। ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "remaining_marks_required") {
        return `ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ${absPercent(v.completedPercent)} ਪੇਪਰ ਦੀ ਜਾਂਚ ਹੋ ਚੁੱਕੀ ਹੈ। ਵਿਦਿਆਰਥੀ ਨੇ ਉਸ ਵਿੱਚ ${absPercent(v.scoredOnCompletedPercent)} ਅੰਕ ਲਏ। ਕੁੱਲ ${absPercent(v.requiredOverallPercent)} ਅੰਕ ਲੈਣ ਲਈ ਉਸ ਨੂੰ ਹੁਣ ${n(v.remainingMarksRequired)} ਅੰਕ ਚਾਹੀਦੇ ਹਨ। ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ ਪਤਾ ਕਰੋ।`;
      }
      return `ਇੱਕ ਪ੍ਰੀਖਿਆ ਵਿੱਚ ਇੱਕ ਉਮੀਦਵਾਰ ਨੇ ${absPercent(v.scoredPercent)} ਅੰਕ ਲਏ ਅਤੇ ${n(v.shortBy)} ਅੰਕਾਂ ਨਾਲ ਫੇਲ੍ਹ ਹੋਇਆ। ਪਾਸ ਅੰਕ ${absPercent(v.passPercent)} ਹਨ। ਵੱਧ ਤੋਂ ਵੱਧ ਅੰਕ ਪਤਾ ਕਰੋ।`;
    case "stem.population_growth":
      if (intent.topologyVariant === "growth_then_decay") {
        return `ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਆਬਾਦੀ ਰਿਪੋਰਟ ਅਨੁਸਾਰ ਆਬਾਦੀ ${n(v.population)} ਸੀ। ਇਸ ਵਿੱਚ ${absPercent(v.growthRate)} ਵਾਧਾ ਅਤੇ ਫਿਰ ${absPercent(v.decayRate)} ਕਮੀ ਹੋਈ। ਅੰਤਿਮ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "migration_adjusted_population") {
        return `ਇੱਕ ਸ਼ਹਿਰੀ ਆਬਾਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਆਬਾਦੀ ${n(v.population)} ਸੀ। ਇਸ ਵਿੱਚ ${absPercent(v.growthRate)} ਵਾਧਾ ਹੋਇਆ। ਨਾਲ ਹੀ ਮੂਲ ਆਬਾਦੀ ਦੇ ${absPercent(v.migrationPercent)} ਲੋਕ ਬਾਹਰੋਂ ਆਏ। ਅੰਤਿਮ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`;
      }
      if (intent.topologyVariant === "male_female_population_shift") {
        return `ਇੱਕ ਆਬਾਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਕੁੱਲ ਆਬਾਦੀ ${n(v.totalPopulation)} ਸੀ। ਮਰਦ ${absPercent(v.malePercent)} ਸਨ ਅਤੇ ਬਾਕੀ ਔਰਤਾਂ ਸਨ। ਮਰਦ ਆਬਾਦੀ ${absPercent(v.maleGrowthRate)} ਵਧੀ, ਜਦਕਿ ਔਰਤ ਆਬਾਦੀ ${absPercent(v.femaleDecayRate)} ਘਟੀ। ਅੰਤਿਮ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`;
      }
      return `ਇੱਕ ਆਬਾਦੀ ਰਿਪੋਰਟ ਵਿੱਚ ਆਬਾਦੀ ${n(v.population)} ਸੀ। ਇਹ ${n(v.years)} ਸਾਲਾਂ ਲਈ ਹਰ ਸਾਲ ${absPercent(v.rate)} ਵਧੀ। ਇਸ ਅਵਧੀ ਤੋਂ ਬਾਅਦ ਆਬਾਦੀ ਪਤਾ ਕਰੋ।`;
    case "stem.reverse_percentage":
      return `ਕਿਸੇ ਮਾਤਰਾ ਦਾ ${absPercent(v.percent)} ਭਾਗ ${n(v.part)} ਹੈ। ਪੂਰੀ ਮਾਤਰਾ ਪਤਾ ਕਰੋ।`;
    case "stem.restore_original":
      return `ਇੱਕ ਵਸਤੂ ਦੀ ਕੀਮਤ ਵਿੱਚ ${absPercent(v.cutPercent)} ਕਮੀ ਹੋਈ। ਮੂਲ ਕੀਮਤ ਤੇ ਵਾਪਸ ਆਉਣ ਲਈ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵਾਧੇ ਦੀ ਲੋੜ ਹੈ?`;
    case "stem.salary_increment":
      return `ਇੱਕ ਕਰਮਚਾਰੀ ਦੀ ਤਨਖਾਹ ${n(v.oldSalary)} ਤੋਂ ਬਦਲ ਕੇ ${n(v.newSalary)} ਹੋ ਗਈ। ਪੁਰਾਣੀ ਤਨਖਾਹ ਦੇ ਆਧਾਰ ਤੇ ਪ੍ਰਤੀਸ਼ਤ ਬਦਲਾਅ ਪਤਾ ਕਰੋ।`;
    case "stem.price_consumption":
      return `ਈਂਧਨ ਦੀ ਕੀਮਤ ${absPercent(v.priceIncreasePercent)} ਵਧ ਗਈ। ਜੇ ਕੁੱਲ ਖਰਚ ਇੱਕੋ ਰੱਖਣਾ ਹੋਵੇ, ਤਾਂ ਖਪਤ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਘਟਾਉਣੀ ਪਵੇਗੀ?`;
    case "stem.shopkeeper_profit":
      return `ਇੱਕ ਦੁਕਾਨਦਾਰ ਨੇ ${commercialObject.pa} ${currency(v.costPrice, profile)} ਵਿੱਚ ਖਰੀਦਿਆ ਅਤੇ ${currency(v.sellingPrice, profile)} ਵਿੱਚ ਵੇਚਿਆ। ਲਾਗਤ ਮੁੱਲ ਤੇ ਲਾਭ ਜਾਂ ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`;
    case "stem.mixture_water_milk":
      return `ਇੱਕ ਦੁੱਧ-ਪਾਣੀ ਮਿਸ਼ਰਣ ਦੀ ਮਾਤਰਾ ${n(v.total)} ਲੀਟਰ ਹੈ ਅਤੇ ਇਸ ਵਿੱਚ ${absPercent(v.initialPercent)} ਦੁੱਧ ਹੈ। ਦੁੱਧ ਨੂੰ ${absPercent(v.targetPercent)} ਕਰਨ ਲਈ ਕਿੰਨਾ ਦੁੱਧ ਮਿਲਾਉਣਾ ਪਵੇਗਾ?`;
    case "stem.relational_percentage":
      if ((v.relationCount ?? 1) >= 3) {
        return `A ਦੀ ਆਮਦਨ B ਨਾਲੋਂ ${absPercent(v.relation1Percent)} ${relationWordPa(v.relation1Direction)} ਹੈ। B ਦੀ ਆਮਦਨ C ਨਾਲੋਂ ${absPercent(v.relation2Percent)} ${relationWordPa(v.relation2Direction)} ਹੈ। C ਦੀ ਆਮਦਨ D ਨਾਲੋਂ ${absPercent(v.relation3Percent)} ${relationWordPa(v.relation3Direction)} ਹੈ। A ਦੀ ਆਮਦਨ D ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਜਾਂ ਘੱਟ ਹੈ?`;
      }
      if ((v.relationCount ?? 1) >= 2) {
        return `A ਦੀ ਆਮਦਨ B ਨਾਲੋਂ ${absPercent(v.relation1Percent)} ${relationWordPa(v.relation1Direction)} ਹੈ। B ਦੀ ਆਮਦਨ C ਨਾਲੋਂ ${absPercent(v.relation2Percent)} ${relationWordPa(v.relation2Direction)} ਹੈ। A ਦੀ ਆਮਦਨ C ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਜਾਂ ਘੱਟ ਹੈ?`;
      }
      return `A ਦੀ ਆਮਦਨ B ਨਾਲੋਂ ${absPercent(v.relation1Percent)} ${relationWordPa(v.relation1Direction)} ਹੈ। A ਦੀ ਆਮਦਨ B ਨਾਲੋਂ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਵੱਧ ਜਾਂ ਘੱਟ ਹੈ?`;
    default:
      return intent.fallbackText;
  }
}

export function renderLocalizedStem(input: {
  language: LanguageCode;
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
  realizationProfile?: RealizationProfile;
}) {
  const intent = extractStemIntent(input);
  if (input.realizationProfile) {
    return renderLocalizedStemWithProfile({
      ...input,
      intent,
      profile: input.realizationProfile,
    });
  }
  return renderLocalizedStemWithProfile({
    ...input,
    intent,
  });
}

function renderLocalizedStemWithProfile(input: {
  language: LanguageCode;
  intent: StemIntent;
  profile?: RealizationProfile;
}) {
  if (input.language === "hi") {
    return renderHindi(input.intent, input.profile);
  }
  if (input.language === "pa") {
    return renderPunjabi(input.intent, input.profile);
  }
  return input.intent.fallbackText;
}
