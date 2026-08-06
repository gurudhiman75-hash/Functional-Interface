import { getAvg001QuestionEntry } from "./library";
import { applyAvg001NaturalLanguageV3Polish } from "./natural-language-v3-polish";
import type {
  Avg001Language,
  Avg001QuestionPackage,
  Avg001ValidationCheck,
  Rational,
} from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_FINAL =
  "AVG-001 natural teacher-language manual-review candidate v3 final";

type ReasonKey =
  | "one-fewer" | "one-more" | "two-more" | "divide-one-fewer" | "divide-one-more"
  | "too-high" | "too-low" | "nearby-guess" | "inverse-operation" | "unweighted-shortcut"
  | "double-endpoint" | "lower-middle" | "upper-middle" | "previous-term" | "next-term"
  | "endpoint-used" | "offset-off-one" | "opposite-extreme" | "average-as-extreme"
  | "old-average" | "wrong-denominator" | "average-change-not-scaled" | "ignore-correction"
  | "correction-sign" | "correction-twice" | "wrong-value-reused" | "correct-value-reused"
  | "final-average-reused" | "count-minus-one" | "count-plus-one" | "double-count"
  | "total-difference-not-divided" | "half-count" | "one-third-count" | "arithmetic"
  | "weighted-arithmetic" | "omit-group" | "swap-count-average" | "simple-mean"
  | "reuse-group-average" | "known-count-reused" | "count-off-one" | "distance-ratio-reversed"
  | "combined-average-reused" | "known-average-reused" | "harmonic-mean" | "arithmetic-mean-speed"
  | "first-rate-reused" | "second-rate-reused" | "equal-distance-formula" | "time-weights-reversed"
  | "ratio-reversed" | "ratio-not-reduced" | "ratio-arithmetic";

function numeric(value: number | Rational | undefined) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && value.denominator) {
    return value.numerator / value.denominator;
  }
  return undefined;
}

function shown(value: number | Rational | undefined) {
  const number = numeric(value);
  if (number === undefined || !Number.isFinite(number)) return undefined;
  if (Number.isInteger(number)) return String(number);
  return String(Number(number.toFixed(2)));
}

function optionNumber(value: string) {
  const match = value.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function close(a: number | undefined, b: number | undefined) {
  return a !== undefined && b !== undefined && Math.abs(a - b) < 0.06;
}

function normalizeTag(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^A-Za-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
}

function reasonKeyForTag(raw: string): ReasonKey {
  const tag = normalizeTag(raw);
  if (/USE_ONE_FEWER_OBSERVATION|COUNT_OFF_BY_ONE_LOW|COUNT_MINUS_ONE(?:_USED)?/.test(tag)) return "one-fewer";
  if (/USE_ONE_MORE_OBSERVATION|COUNT_OFF_BY_ONE_HIGH|COUNT_PLUS_ONE(?:_USED)?/.test(tag)) return "one-more";
  if (/COUNT_OFF_BY_TWO_HIGH/.test(tag)) return "two-more";
  if (/DIVIDE_BY_ONE_FEWER/.test(tag)) return "divide-one-fewer";
  if (/DIVIDE_BY_ONE_MORE/.test(tag)) return "divide-one-more";
  if (/ARITHMETIC_OFFSET_HIGH|ARITHMETIC_OVERESTIMATE/.test(tag)) return "too-high";
  if (/ARITHMETIC_OFFSET_LOW/.test(tag)) return "too-low";
  if (/NEARBY_VALUE|NEAR_ARITHMETIC_ERROR|OFF_BY_ONE_OFFSET/.test(tag)) return "nearby-guess";
  if (/INVERSE_OPERATION/.test(tag)) return "inverse-operation";
  if (/UNWEIGHTED_SHORTCUT/.test(tag)) return "unweighted-shortcut";
  if (/DOUBLE_ENDPOINT_MEAN/.test(tag)) return "double-endpoint";
  if (/USE_LOWER_MIDDLE/.test(tag)) return "lower-middle";
  if (/USE_UPPER_MIDDLE/.test(tag)) return "upper-middle";
  if (/USE_PREVIOUS_TERM/.test(tag)) return "previous-term";
  if (/USE_NEXT_TERM/.test(tag)) return "next-term";
  if (/USE_ENDPOINT/.test(tag)) return "endpoint-used";
  if (/USE_OPPOSITE_EXTREME/.test(tag)) return "opposite-extreme";
  if (/USE_AVERAGE_AS_EXTREME/.test(tag)) return "average-as-extreme";
  if (/OLD_AVERAGE_TRAP/.test(tag)) return "old-average";
  if (/COUNT_DENOMINATOR_TRAP/.test(tag)) return "wrong-denominator";
  if (/AVERAGE_CHANGE_NOT_SCALED/.test(tag)) return "average-change-not-scaled";
  if (/IGNORE_CORRECTION|ALL_CORRECTIONS_IGNORED/.test(tag)) return "ignore-correction";
  if (/SIGN_REVERSED|DIRECTION_REVERSED|DIRECTION_NOT_REVERSED/.test(tag)) return "correction-sign";
  if (/APPLIED_TWICE|REVERSED_TWICE/.test(tag)) return "correction-twice";
  if (/WRONG_VALUE_REUSED/.test(tag)) return "wrong-value-reused";
  if (/CORRECT_VALUE_REUSED/.test(tag)) return "correct-value-reused";
  if (/FINAL_AVERAGE_REPORTED/.test(tag)) return "final-average-reused";
  if (/DOUBLE_COUNT_ERROR/.test(tag)) return "double-count";
  if (/TOTAL_DIFFERENCE_NOT_DIVIDED/.test(tag)) return "total-difference-not-divided";
  if (/HALF_COUNT_USED/.test(tag)) return "half-count";
  if (/ONE_THIRD_COUNT_USED/.test(tag)) return "one-third-count";
  if (/WEIGHTED_ARITHMETIC_SLIP/.test(tag)) return "weighted-arithmetic";
  if (/OMIT_ONE_GROUP/.test(tag)) return "omit-group";
  if (/SWAP_COUNT_AND_AVERAGE/.test(tag)) return "swap-count-average";
  if (/SIMPLE_MEAN_INSTEAD_OF_WEIGHTED|UNWEIGHTED_MEAN/.test(tag)) return "simple-mean";
  if (/RATIO_REVERSED/.test(tag)) return "ratio-reversed";
  if (/EQUIVALENT_RATIO_NOT_REDUCED/.test(tag)) return "ratio-not-reduced";
  if (/RATIO_COMPONENT_ARITHMETIC_ERROR|OPPOSITE_DISTANCE_SETUP_ERROR|RATIO_SETUP_ERROR/.test(tag)) return "ratio-arithmetic";
  return "arithmetic";
}

const REASONS: Record<Avg001Language, Record<ReasonKey, string>> = {
  en: {
    "one-fewer": "uses one fewer value than the question gives",
    "one-more": "uses one extra value",
    "two-more": "uses two extra values",
    "divide-one-fewer": "divides by one fewer value",
    "divide-one-more": "divides by one extra value",
    "too-high": "contains an arithmetic error that makes the result too large",
    "too-low": "contains an arithmetic error that makes the result too small",
    "nearby-guess": "is only a nearby guess, not the value obtained from the calculation",
    "inverse-operation": "uses the opposite operation",
    "unweighted-shortcut": "uses a shortcut that ignores the required counts",
    "double-endpoint": "adds the end values but forgets to divide by two",
    "lower-middle": "uses only the lower middle value",
    "upper-middle": "uses only the upper middle value",
    "previous-term": "stops one term too early",
    "next-term": "moves one term too far",
    "endpoint-used": "uses an end value instead of the centre value",
    "offset-off-one": "uses one gap too few or too many",
    "opposite-extreme": "moves from the average towards the wrong end",
    "average-as-extreme": "uses the average itself as the extreme term",
    "old-average": "repeats the old average instead of calculating the new one",
    "wrong-denominator": "divides by the wrong group size",
    "average-change-not-scaled": "does not multiply the average change by the number of entries",
    "ignore-correction": "ignores the correction",
    "correction-sign": "applies the correction in the wrong direction",
    "correction-twice": "applies the correction twice",
    "wrong-value-reused": "reuses the wrong entry instead of finding the corrected one",
    "correct-value-reused": "reuses the corrected entry instead of recovering the earlier entry",
    "final-average-reused": "repeats the final average instead of finding the requested entry",
    "count-minus-one": "uses one fewer entry in the count",
    "count-plus-one": "uses one extra entry in the count",
    "double-count": "counts every entry twice",
    "total-difference-not-divided": "uses the total difference without dividing by the number of entries",
    "half-count": "uses only half of the required count",
    "one-third-count": "uses only one-third of the required count",
    arithmetic: "contains a small arithmetic error",
    "weighted-arithmetic": "makes an arithmetic error while combining the weighted totals",
    "omit-group": "leaves out one group",
    "swap-count-average": "interchanges a group count and its average",
    "simple-mean": "takes a simple mean even though the groups are unequal",
    "reuse-group-average": "reuses one subgroup average instead of calculating the combined average",
    "known-count-reused": "reuses the known group count",
    "count-off-one": "is one away from the count obtained by balancing the totals",
    "distance-ratio-reversed": "reverses the two distances from the combined average",
    "combined-average-reused": "reuses the combined average instead of finding the missing group average",
    "known-average-reused": "reuses the known group average",
    "harmonic-mean": "uses the equal-distance formula even though the times are equal",
    "arithmetic-mean-speed": "takes the simple mean of the speeds even though the travel times or distances are unequal",
    "first-rate-reused": "reuses the first rate",
    "second-rate-reused": "reuses the second rate",
    "equal-distance-formula": "uses the equal-distance shortcut for unequal distances",
    "time-weights-reversed": "attaches each time to the wrong speed",
    "ratio-reversed": "writes the required ratio in reverse order",
    "ratio-not-reduced": "gives an equivalent ratio without reducing it",
    "ratio-arithmetic": "forms the ratio from the wrong pair of differences",
  },
  hi: {
    "one-fewer": "प्रश्न में दी संख्या से एक मान कम लेता है", "one-more": "एक अतिरिक्त मान लेता है", "two-more": "दो अतिरिक्त मान लेता है",
    "divide-one-fewer": "एक कम संख्या से भाग देता है", "divide-one-more": "एक अधिक संख्या से भाग देता है",
    "too-high": "गणना की गलती से उत्तर आवश्यकता से बड़ा हो जाता है", "too-low": "गणना की गलती से उत्तर आवश्यकता से छोटा हो जाता है",
    "nearby-guess": "केवल पास का अनुमान है, गणना से मिला मान नहीं", "inverse-operation": "उलटी गणितीय क्रिया करता है",
    "unweighted-shortcut": "ऐसा छोटा तरीका लगाता है जिसमें समूह-संख्या का असर छूट जाता है",
    "double-endpoint": "दोनों सिरों को जोड़कर 2 से भाग देना भूल जाता है", "lower-middle": "केवल निचला मध्य मान लेता है",
    "upper-middle": "केवल ऊपरी मध्य मान लेता है", "previous-term": "एक पद पहले रुक जाता है", "next-term": "एक पद आगे चला जाता है",
    "endpoint-used": "मध्य मान की जगह एक सिरा लेता है", "offset-off-one": "एक अंतराल कम या अधिक लेता है",
    "opposite-extreme": "औसत से गलत सिरे की ओर चलता है", "average-as-extreme": "औसत को ही अंतिम पद मान लेता है",
    "old-average": "नया औसत निकालने के बजाय पुराना औसत दोहरा देता है", "wrong-denominator": "गलत समूह-संख्या से भाग देता है",
    "average-change-not-scaled": "औसत के बदलाव को प्रविष्टियों की संख्या से गुणा नहीं करता", "ignore-correction": "सुधार को नज़रअंदाज़ करता है",
    "correction-sign": "सुधार की दिशा उलटी लेता है", "correction-twice": "सुधार दो बार लगाता है",
    "wrong-value-reused": "सही मान निकालने के बजाय गलत प्रविष्टि दोहरा देता है", "correct-value-reused": "पुरानी प्रविष्टि निकालने के बजाय सही प्रविष्टि दोहरा देता है",
    "final-average-reused": "आवश्यक प्रविष्टि निकालने के बजाय अंतिम औसत दोहरा देता है", "count-minus-one": "गिनती में एक प्रविष्टि कम लेता है",
    "count-plus-one": "गिनती में एक प्रविष्टि अधिक लेता है", "double-count": "हर प्रविष्टि को दो बार गिनता है",
    "total-difference-not-divided": "कुल अंतर को प्रविष्टियों की संख्या से भाग नहीं देता", "half-count": "आवश्यक संख्या का केवल आधा लेता है",
    "one-third-count": "आवश्यक संख्या का केवल एक-तिहाई लेता है", arithmetic: "गणना में छोटी गलती करता है",
    "weighted-arithmetic": "समूह-कुल जोड़ते समय गणना की गलती करता है", "omit-group": "एक समूह छोड़ देता है",
    "swap-count-average": "समूह की संख्या और औसत को आपस में बदल देता है", "simple-mean": "असमान समूहों का साधारण औसत लेता है",
    "reuse-group-average": "संयुक्त औसत की जगह एक समूह का औसत दोहरा देता है", "known-count-reused": "ज्ञात समूह-संख्या को ही उत्तर मान लेता है",
    "count-off-one": "संतुलन से मिली संख्या से एक कम या अधिक है", "distance-ratio-reversed": "संयुक्त औसत से दोनों दूरियों का क्रम उलट देता है",
    "combined-average-reused": "लापता समूह का औसत निकालने के बजाय संयुक्त औसत दोहरा देता है", "known-average-reused": "ज्ञात समूह का औसत दोहरा देता है",
    "harmonic-mean": "समान समय वाले प्रश्न में समान दूरी का सूत्र लगाता है", "arithmetic-mean-speed": "असमान समय या दूरी के बावजूद दोनों चालों का साधारण औसत लेता है",
    "first-rate-reused": "पहली चाल या दर को ही उत्तर मान लेता है", "second-rate-reused": "दूसरी चाल या दर को ही उत्तर मान लेता है",
    "equal-distance-formula": "असमान दूरी पर समान-दूरी वाला छोटा सूत्र लगाता है", "time-weights-reversed": "हर समय को गलत चाल के साथ जोड़ता है",
    "ratio-reversed": "आवश्यक अनुपात को उलटे क्रम में लिखता है", "ratio-not-reduced": "समतुल्य अनुपात को सरल नहीं करता",
    "ratio-arithmetic": "गलत अंतर लेकर अनुपात बनाता है",
  },
  pa: {
    "one-fewer": "ਸਵਾਲ ਵਿੱਚ ਦਿੱਤੀ ਗਿਣਤੀ ਨਾਲੋਂ ਇੱਕ ਮੁੱਲ ਘੱਟ ਲੈਂਦਾ ਹੈ", "one-more": "ਇੱਕ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ", "two-more": "ਦੋ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "divide-one-fewer": "ਇੱਕ ਘੱਟ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ", "divide-one-more": "ਇੱਕ ਵੱਧ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
    "too-high": "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਲੋੜ ਨਾਲੋਂ ਵੱਡਾ ਹੋ ਜਾਂਦਾ ਹੈ", "too-low": "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਲੋੜ ਨਾਲੋਂ ਛੋਟਾ ਹੋ ਜਾਂਦਾ ਹੈ",
    "nearby-guess": "ਸਿਰਫ਼ ਨੇੜਲਾ ਅੰਦਾਜ਼ਾ ਹੈ, ਗਣਨਾ ਨਾਲ ਮਿਲਿਆ ਮੁੱਲ ਨਹੀਂ", "inverse-operation": "ਉਲਟੀ ਗਣਿਤੀ ਕਿਰਿਆ ਕਰਦਾ ਹੈ",
    "unweighted-shortcut": "ਅਜਿਹਾ ਛੋਟਾ ਤਰੀਕਾ ਲਗਾਉਂਦਾ ਹੈ ਜਿਸ ਵਿੱਚ ਸਮੂਹ-ਗਿਣਤੀ ਦਾ ਅਸਰ ਛੁੱਟ ਜਾਂਦਾ ਹੈ",
    "double-endpoint": "ਦੋਵੇਂ ਸਿਰਿਆਂ ਨੂੰ ਜੋੜ ਕੇ 2 ਨਾਲ ਭਾਗ ਦੇਣਾ ਭੁੱਲ ਜਾਂਦਾ ਹੈ", "lower-middle": "ਸਿਰਫ਼ ਹੇਠਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
    "upper-middle": "ਸਿਰਫ਼ ਉੱਪਰਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ", "previous-term": "ਇੱਕ ਪਦ ਪਹਿਲਾਂ ਰੁਕ ਜਾਂਦਾ ਹੈ", "next-term": "ਇੱਕ ਪਦ ਅੱਗੇ ਚਲਾ ਜਾਂਦਾ ਹੈ",
    "endpoint-used": "ਮੱਧਲੇ ਮੁੱਲ ਦੀ ਥਾਂ ਇੱਕ ਸਿਰਾ ਲੈਂਦਾ ਹੈ", "offset-off-one": "ਇੱਕ ਅੰਤਰਾਲ ਘੱਟ ਜਾਂ ਵੱਧ ਲੈਂਦਾ ਹੈ",
    "opposite-extreme": "ਔਸਤ ਤੋਂ ਗਲਤ ਸਿਰੇ ਵੱਲ ਜਾਂਦਾ ਹੈ", "average-as-extreme": "ਔਸਤ ਨੂੰ ਹੀ ਅੰਤਲਾ ਪਦ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "old-average": "ਨਵੀਂ ਔਸਤ ਕੱਢਣ ਦੀ ਥਾਂ ਪੁਰਾਣੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ", "wrong-denominator": "ਗਲਤ ਸਮੂਹ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
    "average-change-not-scaled": "ਔਸਤ ਦੇ ਬਦਲਾਅ ਨੂੰ ਐਂਟਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਨਹੀਂ ਕਰਦਾ", "ignore-correction": "ਸੁਧਾਰ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ",
    "correction-sign": "ਸੁਧਾਰ ਦੀ ਦਿਸ਼ਾ ਉਲਟੀ ਲੈਂਦਾ ਹੈ", "correction-twice": "ਸੁਧਾਰ ਦੋ ਵਾਰ ਲਗਾਉਂਦਾ ਹੈ",
    "wrong-value-reused": "ਸਹੀ ਮੁੱਲ ਕੱਢਣ ਦੀ ਥਾਂ ਗਲਤ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ", "correct-value-reused": "ਪੁਰਾਣੀ ਐਂਟਰੀ ਕੱਢਣ ਦੀ ਥਾਂ ਸਹੀ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "final-average-reused": "ਲੋੜੀਂਦੀ ਐਂਟਰੀ ਕੱਢਣ ਦੀ ਥਾਂ ਅੰਤਿਮ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ", "count-minus-one": "ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਐਂਟਰੀ ਘੱਟ ਲੈਂਦਾ ਹੈ",
    "count-plus-one": "ਗਿਣਤੀ ਵਿੱਚ ਇੱਕ ਐਂਟਰੀ ਵੱਧ ਲੈਂਦਾ ਹੈ", "double-count": "ਹਰ ਐਂਟਰੀ ਨੂੰ ਦੋ ਵਾਰ ਗਿਣਦਾ ਹੈ",
    "total-difference-not-divided": "ਕੁੱਲ ਫਰਕ ਨੂੰ ਐਂਟਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਨਹੀਂ ਦਿੰਦਾ", "half-count": "ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਦਾ ਸਿਰਫ਼ ਅੱਧਾ ਲੈਂਦਾ ਹੈ",
    "one-third-count": "ਲੋੜੀਂਦੀ ਗਿਣਤੀ ਦਾ ਸਿਰਫ਼ ਇੱਕ-ਤਿਹਾਈ ਲੈਂਦਾ ਹੈ", arithmetic: "ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ",
    "weighted-arithmetic": "ਸਮੂਹ-ਕੁੱਲ ਜੋੜਦੇ ਸਮੇਂ ਗਣਨਾ ਦੀ ਗਲਤੀ ਕਰਦਾ ਹੈ", "omit-group": "ਇੱਕ ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ",
    "swap-count-average": "ਸਮੂਹ ਦੀ ਗਿਣਤੀ ਅਤੇ ਔਸਤ ਨੂੰ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ", "simple-mean": "ਅਸਮਾਨ ਸਮੂਹਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ",
    "reuse-group-average": "ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਦੀ ਥਾਂ ਇੱਕ ਸਮੂਹ ਦੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ", "known-count-reused": "ਜਾਣੀ ਸਮੂਹ-ਗਿਣਤੀ ਨੂੰ ਹੀ ਜਵਾਬ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "count-off-one": "ਸੰਤੁਲਨ ਨਾਲ ਮਿਲੀ ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਘੱਟ ਜਾਂ ਵੱਧ ਹੈ", "distance-ratio-reversed": "ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਤੋਂ ਦੋਵੇਂ ਦੂਰੀਆਂ ਦਾ ਕ੍ਰਮ ਉਲਟ ਦਿੰਦਾ ਹੈ",
    "combined-average-reused": "ਗੁੰਮ ਸਮੂਹ ਦੀ ਔਸਤ ਕੱਢਣ ਦੀ ਥਾਂ ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ", "known-average-reused": "ਜਾਣੇ ਸਮੂਹ ਦੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
    "harmonic-mean": "ਬਰਾਬਰ ਸਮੇਂ ਵਾਲੇ ਸਵਾਲ ਵਿੱਚ ਬਰਾਬਰ ਦੂਰੀ ਦਾ ਸੂਤਰ ਲਗਾਉਂਦਾ ਹੈ", "arithmetic-mean-speed": "ਅਸਮਾਨ ਸਮੇਂ ਜਾਂ ਦੂਰੀ ਦੇ ਬਾਵਜੂਦ ਦੋਵੇਂ ਗਤੀਆਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ",
    "first-rate-reused": "ਪਹਿਲੀ ਗਤੀ ਜਾਂ ਦਰ ਨੂੰ ਹੀ ਜਵਾਬ ਮੰਨ ਲੈਂਦਾ ਹੈ", "second-rate-reused": "ਦੂਜੀ ਗਤੀ ਜਾਂ ਦਰ ਨੂੰ ਹੀ ਜਵਾਬ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    "equal-distance-formula": "ਅਸਮਾਨ ਦੂਰੀ ਉੱਤੇ ਬਰਾਬਰ-ਦੂਰੀ ਵਾਲਾ ਛੋਟਾ ਸੂਤਰ ਲਗਾਉਂਦਾ ਹੈ", "time-weights-reversed": "ਹਰ ਸਮੇਂ ਨੂੰ ਗਲਤ ਗਤੀ ਨਾਲ ਜੋੜਦਾ ਹੈ",
    "ratio-reversed": "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਦਾ ਹੈ", "ratio-not-reduced": "ਬਰਾਬਰ ਅਨੁਪਾਤ ਨੂੰ ਸਰਲ ਨਹੀਂ ਕਰਦਾ",
    "ratio-arithmetic": "ਗਲਤ ਫਰਕ ਲੈ ਕੇ ਅਨੁਪਾਤ ਬਣਾਉਂਦਾ ਹੈ",
  },
};

function inferCp004Reason(source: Avg001QuestionPackage, option: string): ReasonKey {
  const mode = source.solveMode;
  const value = optionNumber(option);
  const v = source.parameters.values;
  const averages = (v.groupAverages ?? []).map(numeric).filter((item): item is number => item !== undefined);
  const counts = v.groupCounts ?? [];
  const answer = optionNumber(source.answer);

  if (source.parameters.answerType === "RATIO") {
    const wrong = option.match(/(\d+)\s*:\s*(\d+)/);
    const correct = source.answer.match(/(\d+)\s*:\s*(\d+)/);
    if (wrong && correct && wrong[1] === correct[2] && wrong[2] === correct[1]) return "ratio-reversed";
    if (wrong && correct && Number(wrong[1]) * Number(correct[2]) === Number(wrong[2]) * Number(correct[1])) return "ratio-not-reduced";
    return "ratio-arithmetic";
  }

  if (mode === "findCombinedAverageOfTwoGroups" || mode === "findCombinedAverageOfThreeOrFourGroups") {
    const simple = averages.length ? averages.reduce((sum, item) => sum + item, 0) / averages.length : undefined;
    if (close(value, simple)) return "simple-mean";
    if (averages.some((average) => close(value, average))) return "reuse-group-average";
    if (averages.length === counts.length && averages.length > 2) {
      for (let omit = 0; omit < averages.length; omit += 1) {
        let total = 0;
        let count = 0;
        for (let index = 0; index < averages.length; index += 1) {
          if (index === omit) continue;
          total += averages[index]! * counts[index]!;
          count += counts[index]!;
        }
        if (close(value, count ? total / count : undefined)) return "omit-group";
      }
    }
    return "weighted-arithmetic";
  }

  if (mode === "findGroupCountFromCombinedAverage") {
    if (close(value, v.knownGroupCount)) return "known-count-reused";
    if (answer !== undefined && value !== undefined && Math.abs(value - answer) === 1) return "count-off-one";
    return "distance-ratio-reversed";
  }

  if (mode === "findMissingGroupAverage") {
    if (close(value, numeric(v.combinedAverage))) return "combined-average-reused";
    if (close(value, numeric(v.knownGroupAverage))) return "known-average-reused";
    return "simple-mean";
  }

  const speed1 = numeric(v.speed1) ?? optionNumber(String(source.parameters.renderVariables.speed1 ?? ""));
  const speed2 = numeric(v.speed2) ?? optionNumber(String(source.parameters.renderVariables.speed2 ?? ""));
  const arithmeticMean = speed1 !== undefined && speed2 !== undefined ? (speed1 + speed2) / 2 : undefined;
  const harmonicMean = speed1 !== undefined && speed2 !== undefined ? 2 * speed1 * speed2 / (speed1 + speed2) : undefined;
  if (close(value, speed1)) return "first-rate-reused";
  if (close(value, speed2)) return "second-rate-reused";
  if (close(value, arithmeticMean)) return "arithmetic-mean-speed";
  if (close(value, harmonicMean)) return mode === "findAverageSpeedEqualTime" ? "harmonic-mean" : "equal-distance-formula";
  if (mode === "findAverageSpeedForUnequalTimes") return "time-weights-reversed";
  return "weighted-arithmetic";
}

function sourceTags(source: Avg001QuestionPackage) {
  const traced = source.traceability.editorialV2OptionTags;
  if (Array.isArray(traced) && traced.length === 4) return traced.map(String);
  const strategies = [...getAvg001QuestionEntry(source.questionLanguageId).distractorStrategyIds];
  const result: string[] = [];
  let wrong = 0;
  for (let index = 0; index < 4; index += 1) {
    result.push(index === source.correctIndex ? "CORRECT" : strategies[wrong++] ?? "ARITHMETIC_SLIP");
  }
  return result;
}

function distractorLine(source: Avg001QuestionPackage, revised: Avg001QuestionPackage) {
  const tags = sourceTags(source);
  const parts = revised.options
    .map((option, index) => ({ option, index, rawTag: tags[index] ?? "ARITHMETIC_SLIP" }))
    .filter(({ index }) => index !== revised.correctIndex)
    .map(({ option, index, rawTag }) => {
      const key = normalizeTag(rawTag) === "EMBEDDED_IN_EXPLANATION"
        ? inferCp004Reason(source, option)
        : reasonKeyForTag(rawTag);
      return `${String.fromCharCode(65 + index)} (${option}) ${REASONS[revised.language][key]}`;
    });
  if (revised.language === "en") return `⚠️ Why the other options are wrong: ${parts.join("; ")}. Therefore, the correct answer is ${revised.answer}.`;
  if (revised.language === "hi") return `दूसरे विकल्प क्यों गलत हैं: ${parts.join("; ")}। इसलिए सही उत्तर ${revised.answer} है।`;
  return `ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ: ${parts.join("; ")}। ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${revised.answer} ਹੈ।`;
}

function mathValue(value: number | Rational | undefined, fallback = "?") {
  return shown(value) ?? fallback;
}

function detailedCalculation(source: Avg001QuestionPackage) {
  const v = source.parameters.values;
  const answer = mathValue(source.solver.exactAnswer, source.solver.answer.replaceAll(",", ""));
  const oldCount = v.oldCount ?? v.count;
  const newCount = v.newCount ?? oldCount;
  const oldAverage = v.currentAverage ?? v.oldAverage ?? v.average;
  const newAverage = v.newAverage;

  switch (source.solveMode) {
    case "findMiddleTermFromAverage":
      return `$$\text{Endpoint mean}=(${mathValue(v.firstTerm)}+${mathValue(v.lastTerm)})\div2=${mathValue(v.average)},\quad \text{middle term}=${answer}$$`;
    case "findNewAverageAfterAddition":
      return `$$\text{Old total}=${mathValue(oldAverage)}\times${oldCount},\quad \text{new average}=(${mathValue(oldAverage)}\times${oldCount}+${mathValue(v.addedValue)})\div${newCount}=${answer}$$`;
    case "findNewAverageAfterRemoval":
      return `$$\text{Old total}=${mathValue(oldAverage)}\times${oldCount},\quad \text{new average}=(${mathValue(oldAverage)}\times${oldCount}-${mathValue(v.removedValue)})\div${newCount}=${answer}$$`;
    case "findNewAverageAfterReplacement":
      return `$$\text{New average}=(${mathValue(oldAverage)}\times${oldCount}-${mathValue(v.oldValue)}+${mathValue(v.newValue)})\div${oldCount}=${answer}$$`;
    case "findAddedMemberValueFromShift":
      return `$$\text{Added value}=${mathValue(newAverage)}\times${newCount}-${mathValue(oldAverage)}\times${oldCount}=${answer}$$`;
    case "findRemovedMemberValueFromShift":
      return `$$\text{Removed value}=${mathValue(oldAverage)}\times${oldCount}-${mathValue(newAverage)}\times${newCount}=${answer}$$`;
    case "findReplacementValueFromShift": {
      const totalChange = numeric(newAverage) !== undefined && numeric(oldAverage) !== undefined
        ? (numeric(newAverage)! - numeric(oldAverage)!) * oldCount
        : undefined;
      if (v.replacementTarget === "old") {
        return `$$\text{Total change}=(${mathValue(newAverage)}-${mathValue(oldAverage)})\times${oldCount}=${mathValue(totalChange)},\quad \text{old value}=${mathValue(v.newValue)}-${mathValue(totalChange)}=${answer}$$`;
      }
      return `$$\text{Total change}=(${mathValue(newAverage)}-${mathValue(oldAverage)})\times${oldCount}=${mathValue(totalChange)},\quad \text{new value}=${mathValue(v.oldValue)}+${mathValue(totalChange)}=${answer}$$`;
    }
    case "findInningsValueOrNewCricketAverage":
      if (source.parameters.answerType === "AVERAGE") {
        return `$$\text{New average}=(${mathValue(oldAverage)}\times${oldCount}+${mathValue(v.nextScore)})\div${newCount}=${answer}$$`;
      }
      return `$$\text{Required runs}=${mathValue(newAverage)}\times${newCount}-${mathValue(oldAverage)}\times${oldCount}=${answer}$$`;
    case "findOriginalCountFromJoiningMemberShift": {
      const shift = source.parameters.renderVariables.averageChange ?? source.parameters.renderVariables.shift;
      const member = source.parameters.renderVariables.memberValue;
      const old = source.parameters.renderVariables.oldAverage;
      return `$$\text{Original count}=(${member}-${old})\div${shift}-1=${answer}$$`;
    }
    case "findOriginalCountFromLeavingMemberShift": {
      const shift = source.parameters.renderVariables.averageChange ?? source.parameters.renderVariables.shift;
      const member = source.parameters.renderVariables.memberValue;
      const old = source.parameters.renderVariables.oldAverage;
      return `$$\text{Original count}=|${member}-${old}|\div${shift}+1=${answer}$$`;
    }
    case "findClassAverageFromSectionAverages":
    case "findSuperGroupAverageFromSubgroups": {
      const counts = v.subgroupCounts ?? [];
      const averages = v.subgroupAverages ?? [];
      const products = counts.map((count, index) => `${count}\times${mathValue(averages[index])}`).join("+");
      const countTotal = counts.reduce((sum, count) => sum + count, 0);
      return `$$\text{Combined average}=(${products})\div${countTotal}=${answer}$$`;
    }
    case "findMissingSectionAverage":
    case "findMissingLowerLevelAverage": {
      const counts = v.subgroupCounts ?? [];
      const totals = (v.subgroupTotals ?? []).map((item) => numeric(item));
      const index = v.missingSubgroupIndex ?? 0;
      const knownTotal = totals.reduce((sum, item, itemIndex) => itemIndex === index ? sum : sum + (item ?? 0), 0);
      const overallTotal = numeric(v.overallTotal) ?? numeric(v.parentTotal) ?? numeric(v.total);
      return `$$\text{Missing average}=(${mathValue(overallTotal)}-${mathValue(knownTotal)})\div${counts[index] ?? v.missingSubgroupCount ?? "?"}=${answer}$$`;
    }
    case "findSectionCountFromOverallAverage":
    case "findMissingSubgroupCount": {
      const totals = (v.subgroupTotals ?? []).map((item) => numeric(item));
      const index = v.missingSubgroupIndex ?? 0;
      const knownTotal = totals.reduce((sum, item, itemIndex) => itemIndex === index ? sum : sum + (item ?? 0), 0);
      const overallTotal = numeric(v.overallTotal) ?? numeric(v.parentTotal) ?? numeric(v.total);
      const missingAverage = v.subgroupAverages?.[index] ?? v.missingSubgroupAverage;
      return `$$\text{Missing count}=(${mathValue(overallTotal)}-${mathValue(knownTotal)})\div${mathValue(missingAverage)}=${answer}$$`;
    }
    case "findSubgroupTotalFromAverageAndCount": {
      const index = v.missingSubgroupIndex ?? 0;
      const count = v.subgroupCounts?.[index] ?? v.missingSubgroupCount ?? v.count;
      const average = v.subgroupAverages?.[index] ?? v.missingSubgroupAverage ?? v.average;
      return `$$\text{Subgroup total}=${count}\times${mathValue(average)}=${answer}$$`;
    }
    case "findOverallTotalFromHierarchy": {
      const totals = v.subgroupTotals ?? [];
      return `$$\text{Overall total}=${totals.map((item) => mathValue(item)).join("+")}=${answer}$$`;
    }
    default:
      return undefined;
  }
}

function workedLine(source: Avg001QuestionPackage, revised: Avg001QuestionPackage) {
  const current = revised.explanation.lines[1] ?? "";
  const currentNumbers = current.match(/\d+(?:\.\d+)?/g)?.length ?? 0;
  const detailed = detailedCalculation(source);
  if (!detailed && currentNumbers >= 3) return current;

  let calculation = detailed;
  if (!calculation) {
    const decisive = source.reasoningEvidence.decisiveCalculation.replace(/^\$\$|\$\$$/g, "").trim();
    calculation = `$$${decisive}$$`;
  }
  const lead = revised.language === "en"
    ? "Write the relevant total first, substitute the given values and simplify."
    : revised.language === "hi"
      ? "पहले संबंधित कुल लिखें, दिए मान रखें और चरण-दर-चरण सरल करें।"
      : "ਪਹਿਲਾਂ ਸੰਬੰਧਿਤ ਕੁੱਲ ਲਿਖੋ, ਦਿੱਤੇ ਮੁੱਲ ਰੱਖੋ ਅਤੇ ਕਦਮਾਂ ਵਿੱਚ ਸਰਲ ਕਰੋ।";
  if (revised.language === "en") return `📝 Step-by-step solution: ${lead} ${calculation} Therefore, the required answer is ${revised.answer}.`;
  if (revised.language === "hi") return `हल: ${lead} ${calculation} इसलिए सही उत्तर ${revised.answer} है।`;
  return `ਹੱਲ: ${lead} ${calculation} ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${revised.answer} ਹੈ।`;
}

function hasMeaningfulUnitCue(stem: string) {
  return /₹|salary|sales|price|revenue|expense|order value|marks?|scores?|test|examination|ages?|years?|runs?|innings?|cricket|weights?|\bkg\b|kilomet|\bkm\b|speed|hours?|output|production|machines?|units? per hour/i.test(stem);
}

function stripAbstractUnit(value: string) {
  return value
    .replace(/\s+(?:years?|marks?|runs?|kg|km|units?)(?=\b|$)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function repairAbstractDisplay(source: Avg001QuestionPackage, revised: Avg001QuestionPackage) {
  if (revised.language !== "en") return revised;
  if (!(["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"] as string[]).includes(revised.canonicalProblemId)) return revised;
  if (hasMeaningfulUnitCue(revised.stem)) return revised;

  const options = revised.options.map(stripAbstractUnit);
  const answer = options[revised.correctIndex]!;
  const explanation = revised.explanation.lines.map(stripAbstractUnit);
  return {
    ...revised,
    options,
    answer,
    solver: { ...revised.solver, answer: stripAbstractUnit(revised.solver.answer) },
    independentVerification: {
      ...revised.independentVerification,
      displayAnswer: stripAbstractUnit(revised.independentVerification.displayAnswer),
    },
    explanation: { lines: explanation },
  };
}

function cleanConcept(line: string, language: Avg001Language) {
  if (language === "hi") {
    return line
      .replace(/मुख्य बात:\s*(?:गणना का आधार है|आरंभ में यह संबंध लें|पहली गणना का नियम है)[:：]?\s*/i, "मुख्य बात: ")
      .replace(/सममित/g, "बराबर दूरी पर");
  }
  if (language === "pa") {
    return line
      .replace(/ਮੁੱਖ ਗੱਲ:\s*(?:ਗਣਨਾ ਦਾ ਆਧਾਰ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਲਵੋ|ਪਹਿਲੀ ਗਣਨਾ ਦਾ ਨਿਯਮ ਹੈ)[:：]?\s*/i, "ਮੁੱਖ ਗੱਲ: ")
      .replace(/ਸਮਮਿਤ/g, "ਬਰਾਬਰ ਦੂਰੀ ਉੱਤੇ");
  }
  return line;
}

function validateFinal(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => check.name !== "avg001-natural-language-v3-final");
  const text = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  const workedNumbers = pkg.explanation.lines[1]?.match(/\d+(?:\.\d+)?/g)?.length ?? 0;
  checks.push({
    name: "avg001-natural-language-v3-final",
    passed:
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[1]?.includes("$$") === true &&
      workedNumbers >= 3 &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      !/\[[A-Z][A-Z0-9_]+\]/.test(text) &&
      !/(?:For the total, the total|To get the average, the average|गणना का आधार है|आरंभ में यह संबंध लें|ਗਣਨਾ ਦਾ ਆਧਾਰ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਲਵੋ)/i.test(text),
    message: "Final Average review candidate demonstrates numerical working and gives natural option-specific guidance",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV3Final(source: Avg001QuestionPackage): Avg001QuestionPackage {
  const polished = applyAvg001NaturalLanguageV3Polish(source);
  const withContent: Avg001QuestionPackage = {
    ...polished,
    explanation: {
      lines: [
        cleanConcept(polished.explanation.lines[0]!, polished.language),
        workedLine(source, polished),
        polished.explanation.lines[2]!,
        distractorLine(source, polished),
      ],
    },
    traceability: {
      ...polished.traceability,
      naturalLanguageReviewFinal: AVG_001_NATURAL_LANGUAGE_V3_FINAL,
    },
  };
  const repaired = repairAbstractDisplay(source, withContent);
  const finalPackage = {
    ...repaired,
    explanation: {
      lines: [
        repaired.explanation.lines[0]!,
        workedLine(source, repaired),
        repaired.explanation.lines[2]!,
        distractorLine(source, repaired),
      ],
    },
  };
  return { ...finalPackage, validation: validateFinal(finalPackage) };
}
