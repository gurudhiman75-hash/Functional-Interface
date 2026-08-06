import { runAvg001EditorialV2Pipeline } from "./editorial-v2-release";
import type { Avg001Language, Avg001QuestionPackage } from "./types";

type ReasonKey =
  | "one-fewer" | "one-more" | "two-more" | "divide-one-fewer" | "divide-one-more"
  | "too-high" | "too-low" | "nearby" | "inverse" | "unweighted"
  | "double-endpoint" | "lower-middle" | "upper-middle" | "previous-term" | "next-term"
  | "endpoint" | "opposite-extreme" | "average-extreme" | "old-average" | "wrong-count"
  | "unscaled-change" | "ignore-correction" | "wrong-direction" | "twice"
  | "wrong-entry" | "correct-entry" | "final-average" | "double-count" | "undivided-total"
  | "half-count" | "third-count" | "simple-mean" | "omit-group" | "swap-count-average"
  | "subgroup-average" | "weighted-arithmetic" | "known-count" | "count-arithmetic" | "count-off-one"
  | "combined-average" | "known-average" | "balance-arithmetic" | "ratio-reversed" | "ratio-arithmetic"
  | "first-rate" | "second-rate" | "arithmetic-mean-speed" | "harmonic-mean"
  | "time-conversion" | "rate-arithmetic" | "total-time" | "distance-weight" | "equal-distance"
  | "time-weight" | "arithmetic";

function normalize(tag: string) {
  return tag.replace(/([a-z0-9])([A-Z])/g, "$1_$2").replace(/[^A-Za-z0-9]+/g, "_").toUpperCase();
}

function reasonKey(raw: string): ReasonKey {
  const tag = normalize(raw);
  if (/USE_ONE_FEWER|COUNT_OFF_BY_ONE_LOW|COUNT_MINUS_ONE/.test(tag)) return "one-fewer";
  if (/USE_ONE_MORE|COUNT_OFF_BY_ONE_HIGH|COUNT_PLUS_ONE/.test(tag)) return "one-more";
  if (/COUNT_OFF_BY_TWO_HIGH/.test(tag)) return "two-more";
  if (/DIVIDE_BY_ONE_FEWER/.test(tag)) return "divide-one-fewer";
  if (/DIVIDE_BY_ONE_MORE/.test(tag)) return "divide-one-more";
  if (/ARITHMETIC_OFFSET_HIGH|ARITHMETIC_OVERESTIMATE/.test(tag)) return "too-high";
  if (/ARITHMETIC_OFFSET_LOW/.test(tag)) return "too-low";
  if (/NEARBY_VALUE|NEAR_ARITHMETIC_ERROR|OFF_BY_ONE_OFFSET/.test(tag)) return "nearby";
  if (/INVERSE_OPERATION/.test(tag)) return "inverse";
  if (/UNWEIGHTED_SHORTCUT/.test(tag)) return "unweighted";
  if (/DOUBLE_ENDPOINT_MEAN/.test(tag)) return "double-endpoint";
  if (/USE_LOWER_MIDDLE/.test(tag)) return "lower-middle";
  if (/USE_UPPER_MIDDLE/.test(tag)) return "upper-middle";
  if (/USE_PREVIOUS_TERM/.test(tag)) return "previous-term";
  if (/USE_NEXT_TERM/.test(tag)) return "next-term";
  if (/USE_ENDPOINT/.test(tag)) return "endpoint";
  if (/USE_OPPOSITE_EXTREME/.test(tag)) return "opposite-extreme";
  if (/USE_AVERAGE_AS_EXTREME/.test(tag)) return "average-extreme";
  if (/OLD_AVERAGE_TRAP/.test(tag)) return "old-average";
  if (/COUNT_DENOMINATOR_TRAP/.test(tag)) return "wrong-count";
  if (/AVERAGE_CHANGE_NOT_SCALED/.test(tag)) return "unscaled-change";
  if (/IGNORE_CORRECTION|ALL_CORRECTIONS_IGNORED/.test(tag)) return "ignore-correction";
  if (/SIGN_REVERSED|DIRECTION_REVERSED|DIRECTION_NOT_REVERSED/.test(tag)) return "wrong-direction";
  if (/APPLIED_TWICE|REVERSED_TWICE/.test(tag)) return "twice";
  if (/WRONG_VALUE_REUSED/.test(tag)) return "wrong-entry";
  if (/CORRECT_VALUE_REUSED/.test(tag)) return "correct-entry";
  if (/FINAL_AVERAGE_REPORTED/.test(tag)) return "final-average";
  if (/DOUBLE_COUNT_ERROR/.test(tag)) return "double-count";
  if (/TOTAL_DIFFERENCE_NOT_DIVIDED/.test(tag)) return "undivided-total";
  if (/HALF_COUNT_USED/.test(tag)) return "half-count";
  if (/ONE_THIRD_COUNT_USED/.test(tag)) return "third-count";
  if (/SIMPLE_MEAN_INSTEAD_OF_WEIGHTED|UNWEIGHTED_MEAN/.test(tag)) return "simple-mean";
  if (/OMIT_ONE_GROUP|SUBGROUP_\d+_OMITTED/.test(tag)) return "omit-group";
  if (/SWAP_COUNT_AND_AVERAGE/.test(tag)) return "swap-count-average";
  if (/SUBGROUP_\d+_AVERAGE_REUSED/.test(tag)) return "subgroup-average";
  if (/WEIGHTED_ARITHMETIC/.test(tag)) return "weighted-arithmetic";
  if (/KNOWN_GROUP_COUNT_REUSED/.test(tag)) return "known-count";
  if (/COUNT_EQUATION_ARITHMETIC_ERROR/.test(tag)) return "count-arithmetic";
  if (/COUNT_OFF_BY_ONE/.test(tag)) return "count-off-one";
  if (/COMBINED_AVERAGE_REUSED/.test(tag)) return "combined-average";
  if (/KNOWN_GROUP_AVERAGE_REUSED/.test(tag)) return "known-average";
  if (/SIGNED_TOTAL_BALANCE_ERROR/.test(tag)) return "balance-arithmetic";
  if (/RATIO_REVERSED/.test(tag)) return "ratio-reversed";
  if (/RATIO_COMPONENT_ARITHMETIC_ERROR/.test(tag)) return "ratio-arithmetic";
  if (/FIRST_(?:SPEED|RATE)_REUSED/.test(tag)) return "first-rate";
  if (/SECOND_(?:SPEED|RATE)_REUSED/.test(tag)) return "second-rate";
  if (/ARITHMETIC_MEAN_TRAP/.test(tag)) return "arithmetic-mean-speed";
  if (/HARMONIC_MEAN_TRAP/.test(tag)) return "harmonic-mean";
  if (/TIME_CONVERSION_ARITHMETIC_ERROR/.test(tag)) return "time-conversion";
  if (/RATE_ARITHMETIC_ERROR/.test(tag)) return "rate-arithmetic";
  if (/TOTAL_TIME_ARITHMETIC_ERROR/.test(tag)) return "total-time";
  if (/SPEED_WEIGHTED_BY_DISTANCE/.test(tag)) return "distance-weight";
  if (/EQUAL_DISTANCE_FORMULA_MISUSED/.test(tag)) return "equal-distance";
  if (/TIME_WEIGHT_ARITHMETIC_ERROR/.test(tag)) return "time-weight";
  return "arithmetic";
}

const EN: Record<ReasonKey, string> = {
  "one-fewer": "uses one fewer value", "one-more": "uses one extra value", "two-more": "uses two extra values",
  "divide-one-fewer": "divides by one fewer value", "divide-one-more": "divides by one extra value",
  "too-high": "has an arithmetic error that makes the result too large", "too-low": "has an arithmetic error that makes the result too small",
  nearby: "is only a nearby guess, not the calculated value", inverse: "uses the opposite operation",
  unweighted: "uses a shortcut that ignores the required counts", "double-endpoint": "adds the end values but forgets to divide by two",
  "lower-middle": "uses only the lower middle value", "upper-middle": "uses only the upper middle value",
  "previous-term": "stops one term too early", "next-term": "moves one term too far", endpoint: "uses an endpoint instead of the centre",
  "opposite-extreme": "moves from the average towards the wrong extreme", "average-extreme": "uses the average itself as the extreme",
  "old-average": "repeats the old average", "wrong-count": "divides by the wrong group size",
  "unscaled-change": "does not scale the average change by the number of entries", "ignore-correction": "ignores the correction",
  "wrong-direction": "applies the correction in the wrong direction", twice: "applies the correction twice",
  "wrong-entry": "reuses the wrong entry", "correct-entry": "reuses the corrected entry instead of recovering the earlier one",
  "final-average": "repeats the final average instead of finding the entry", "double-count": "counts every entry twice",
  "undivided-total": "uses the total difference without dividing by the count", "half-count": "uses only half of the count",
  "third-count": "uses only one-third of the count", "simple-mean": "takes a simple mean even though the groups are unequal",
  "omit-group": "leaves out one group", "swap-count-average": "interchanges a group count and its average",
  "subgroup-average": "reuses one subgroup average", "weighted-arithmetic": "makes an arithmetic error while combining weighted totals",
  "known-count": "reuses the known group count", "count-arithmetic": "makes an arithmetic error while balancing the group totals",
  "count-off-one": "is one away from the balanced group count", "combined-average": "reuses the combined average",
  "known-average": "reuses the known subgroup average", "balance-arithmetic": "makes an arithmetic error in the signed total balance",
  "ratio-reversed": "writes the ratio in reverse order", "ratio-arithmetic": "forms the ratio from the wrong differences",
  "first-rate": "reuses the first speed or rate", "second-rate": "reuses the second speed or rate",
  "arithmetic-mean-speed": "takes a simple mean although time or distance is unequal", "harmonic-mean": "uses the equal-distance formula in an equal-time question",
  "time-conversion": "makes an error while converting distance and time", "rate-arithmetic": "makes an arithmetic error in the rate calculation",
  "total-time": "calculates total time incorrectly", "distance-weight": "weights speed by distance instead of time",
  "equal-distance": "uses the equal-distance shortcut for unequal distances", "time-weight": "pairs a time with the wrong speed",
  arithmetic: "contains a small arithmetic error",
};

const HI: Record<ReasonKey, string> = {
  ...Object.fromEntries(Object.keys(EN).map((key) => [key, "गणना का गलत तरीका अपनाता है"])) as Record<ReasonKey, string>,
  "one-fewer": "एक मान कम लेता है", "one-more": "एक अतिरिक्त मान लेता है", "two-more": "दो अतिरिक्त मान लेता है",
  "divide-one-fewer": "एक कम संख्या से भाग देता है", "divide-one-more": "एक अधिक संख्या से भाग देता है",
  "too-high": "गणना की गलती से उत्तर बड़ा हो जाता है", "too-low": "गणना की गलती से उत्तर छोटा हो जाता है",
  nearby: "केवल पास का अनुमान है", inverse: "उलटी गणितीय क्रिया करता है", unweighted: "समूह-संख्या को नज़रअंदाज़ करता है",
  "double-endpoint": "दोनों सिरों को जोड़कर 2 से भाग देना भूलता है", "lower-middle": "केवल निचला मध्य मान लेता है",
  "upper-middle": "केवल ऊपरी मध्य मान लेता है", "previous-term": "एक पद पहले रुकता है", "next-term": "एक पद आगे जाता है",
  endpoint: "मध्य की जगह सिरा लेता है", "opposite-extreme": "गलत सिरे की ओर जाता है", "average-extreme": "औसत को ही अंतिम पद मानता है",
  "old-average": "पुराना औसत दोहराता है", "wrong-count": "गलत समूह-संख्या से भाग देता है",
  "unscaled-change": "औसत बदलाव को कुल संख्या से गुणा नहीं करता", "ignore-correction": "सुधार को नज़रअंदाज़ करता है",
  "wrong-direction": "सुधार की दिशा उलटी लेता है", twice: "सुधार दो बार लगाता है", "wrong-entry": "गलत प्रविष्टि दोहराता है",
  "correct-entry": "पुरानी प्रविष्टि की जगह सही प्रविष्टि दोहराता है", "final-average": "प्रविष्टि की जगह अंतिम औसत दोहराता है",
  "double-count": "हर प्रविष्टि दो बार गिनता है", "undivided-total": "कुल अंतर को संख्या से भाग नहीं देता",
  "half-count": "केवल आधी संख्या लेता है", "third-count": "केवल एक-तिहाई संख्या लेता है",
  "simple-mean": "असमान समूहों का साधारण औसत लेता है", "omit-group": "एक समूह छोड़ देता है",
  "swap-count-average": "समूह-संख्या और औसत बदल देता है", "subgroup-average": "एक उपसमूह का औसत दोहराता है",
  "weighted-arithmetic": "समूह-कुल जोड़ते समय गणना गलत करता है", "known-count": "ज्ञात समूह-संख्या दोहराता है",
  "count-arithmetic": "समूह-कुल संतुलित करते समय गणना गलत करता है", "count-off-one": "सही समूह-संख्या से एक दूर है",
  "combined-average": "संयुक्त औसत दोहराता है", "known-average": "ज्ञात उपसमूह औसत दोहराता है",
  "balance-arithmetic": "कुल संतुलन में चिन्ह या गणना गलत करता है", "ratio-reversed": "अनुपात उलटे क्रम में लिखता है",
  "ratio-arithmetic": "गलत अंतर से अनुपात बनाता है", "first-rate": "पहली चाल या दर दोहराता है", "second-rate": "दूसरी चाल या दर दोहराता है",
  "arithmetic-mean-speed": "असमान समय या दूरी पर साधारण औसत लेता है", "harmonic-mean": "समान समय में समान-दूरी सूत्र लगाता है",
  "time-conversion": "दूरी या समय बदलते समय गणना गलत करता है", "rate-arithmetic": "दर की गणना गलत करता है",
  "total-time": "कुल समय गलत निकालता है", "distance-weight": "चाल को समय की जगह दूरी से तौलता है",
  "equal-distance": "असमान दूरी पर समान-दूरी सूत्र लगाता है", "time-weight": "समय को गलत चाल से जोड़ता है",
  arithmetic: "गणना में छोटी गलती करता है",
};

const PA: Record<ReasonKey, string> = {
  ...Object.fromEntries(Object.keys(EN).map((key) => [key, "ਗਣਨਾ ਦਾ ਗਲਤ ਤਰੀਕਾ ਵਰਤਦਾ ਹੈ"])) as Record<ReasonKey, string>,
  "one-fewer": "ਇੱਕ ਮੁੱਲ ਘੱਟ ਲੈਂਦਾ ਹੈ", "one-more": "ਇੱਕ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ", "two-more": "ਦੋ ਵਾਧੂ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
  "divide-one-fewer": "ਇੱਕ ਘੱਟ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ", "divide-one-more": "ਇੱਕ ਵੱਧ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
  "too-high": "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਵੱਡਾ ਹੋ ਜਾਂਦਾ ਹੈ", "too-low": "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਛੋਟਾ ਹੋ ਜਾਂਦਾ ਹੈ",
  nearby: "ਸਿਰਫ਼ ਨੇੜਲਾ ਅੰਦਾਜ਼ਾ ਹੈ", inverse: "ਉਲਟੀ ਗਣਿਤੀ ਕਿਰਿਆ ਕਰਦਾ ਹੈ", unweighted: "ਸਮੂਹ-ਗਿਣਤੀ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ",
  "double-endpoint": "ਦੋਵੇਂ ਸਿਰੇ ਜੋੜ ਕੇ 2 ਨਾਲ ਭਾਗ ਦੇਣਾ ਭੁੱਲਦਾ ਹੈ", "lower-middle": "ਸਿਰਫ਼ ਹੇਠਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ",
  "upper-middle": "ਸਿਰਫ਼ ਉੱਪਰਲਾ ਮੱਧਲਾ ਮੁੱਲ ਲੈਂਦਾ ਹੈ", "previous-term": "ਇੱਕ ਪਦ ਪਹਿਲਾਂ ਰੁਕਦਾ ਹੈ", "next-term": "ਇੱਕ ਪਦ ਅੱਗੇ ਜਾਂਦਾ ਹੈ",
  endpoint: "ਮੱਧ ਦੀ ਥਾਂ ਸਿਰਾ ਲੈਂਦਾ ਹੈ", "opposite-extreme": "ਗਲਤ ਸਿਰੇ ਵੱਲ ਜਾਂਦਾ ਹੈ", "average-extreme": "ਔਸਤ ਨੂੰ ਹੀ ਅੰਤਲਾ ਪਦ ਮੰਨਦਾ ਹੈ",
  "old-average": "ਪੁਰਾਣੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ", "wrong-count": "ਗਲਤ ਸਮੂਹ-ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿੰਦਾ ਹੈ",
  "unscaled-change": "ਔਸਤ ਬਦਲਾਅ ਨੂੰ ਕੁੱਲ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਨਹੀਂ ਕਰਦਾ", "ignore-correction": "ਸੁਧਾਰ ਨੂੰ ਨਜ਼ਰਅੰਦਾਜ਼ ਕਰਦਾ ਹੈ",
  "wrong-direction": "ਸੁਧਾਰ ਦੀ ਦਿਸ਼ਾ ਉਲਟੀ ਲੈਂਦਾ ਹੈ", twice: "ਸੁਧਾਰ ਦੋ ਵਾਰ ਲਗਾਉਂਦਾ ਹੈ", "wrong-entry": "ਗਲਤ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
  "correct-entry": "ਪੁਰਾਣੀ ਐਂਟਰੀ ਦੀ ਥਾਂ ਸਹੀ ਐਂਟਰੀ ਦੁਹਰਾਉਂਦਾ ਹੈ", "final-average": "ਐਂਟਰੀ ਦੀ ਥਾਂ ਅੰਤਿਮ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
  "double-count": "ਹਰ ਐਂਟਰੀ ਦੋ ਵਾਰ ਗਿਣਦਾ ਹੈ", "undivided-total": "ਕੁੱਲ ਫਰਕ ਨੂੰ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਨਹੀਂ ਦਿੰਦਾ",
  "half-count": "ਸਿਰਫ਼ ਅੱਧੀ ਗਿਣਤੀ ਲੈਂਦਾ ਹੈ", "third-count": "ਸਿਰਫ਼ ਇੱਕ-ਤਿਹਾਈ ਗਿਣਤੀ ਲੈਂਦਾ ਹੈ",
  "simple-mean": "ਅਸਮਾਨ ਸਮੂਹਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ", "omit-group": "ਇੱਕ ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ",
  "swap-count-average": "ਸਮੂਹ-ਗਿਣਤੀ ਅਤੇ ਔਸਤ ਬਦਲ ਦਿੰਦਾ ਹੈ", "subgroup-average": "ਇੱਕ ਉਪ-ਸਮੂਹ ਦੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
  "weighted-arithmetic": "ਸਮੂਹ-ਕੁੱਲ ਜੋੜਦੇ ਸਮੇਂ ਗਣਨਾ ਗਲਤ ਕਰਦਾ ਹੈ", "known-count": "ਜਾਣੀ ਸਮੂਹ-ਗਿਣਤੀ ਦੁਹਰਾਉਂਦਾ ਹੈ",
  "count-arithmetic": "ਸਮੂਹ-ਕੁੱਲ ਸੰਤੁਲਿਤ ਕਰਦੇ ਸਮੇਂ ਗਣਨਾ ਗਲਤ ਕਰਦਾ ਹੈ", "count-off-one": "ਸਹੀ ਸਮੂਹ-ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਦੂਰ ਹੈ",
  "combined-average": "ਸੰਯੁਕਤ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ", "known-average": "ਜਾਣੀ ਉਪ-ਸਮੂਹ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
  "balance-arithmetic": "ਕੁੱਲ ਸੰਤੁਲਨ ਵਿੱਚ ਨਿਸ਼ਾਨ ਜਾਂ ਗਣਨਾ ਗਲਤ ਕਰਦਾ ਹੈ", "ratio-reversed": "ਅਨੁਪਾਤ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਦਾ ਹੈ",
  "ratio-arithmetic": "ਗਲਤ ਫਰਕ ਨਾਲ ਅਨੁਪਾਤ ਬਣਾਉਂਦਾ ਹੈ", "first-rate": "ਪਹਿਲੀ ਗਤੀ ਜਾਂ ਦਰ ਦੁਹਰਾਉਂਦਾ ਹੈ", "second-rate": "ਦੂਜੀ ਗਤੀ ਜਾਂ ਦਰ ਦੁਹਰਾਉਂਦਾ ਹੈ",
  "arithmetic-mean-speed": "ਅਸਮਾਨ ਸਮੇਂ ਜਾਂ ਦੂਰੀ ਉੱਤੇ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ", "harmonic-mean": "ਬਰਾਬਰ ਸਮੇਂ ਵਿੱਚ ਬਰਾਬਰ-ਦੂਰੀ ਸੂਤਰ ਲਗਾਉਂਦਾ ਹੈ",
  "time-conversion": "ਦੂਰੀ ਜਾਂ ਸਮਾਂ ਬਦਲਦੇ ਸਮੇਂ ਗਣਨਾ ਗਲਤ ਕਰਦਾ ਹੈ", "rate-arithmetic": "ਦਰ ਦੀ ਗਣਨਾ ਗਲਤ ਕਰਦਾ ਹੈ",
  "total-time": "ਕੁੱਲ ਸਮਾਂ ਗਲਤ ਕੱਢਦਾ ਹੈ", "distance-weight": "ਗਤੀ ਨੂੰ ਸਮੇਂ ਦੀ ਥਾਂ ਦੂਰੀ ਨਾਲ ਤੋਲਦਾ ਹੈ",
  "equal-distance": "ਅਸਮਾਨ ਦੂਰੀ ਉੱਤੇ ਬਰਾਬਰ-ਦੂਰੀ ਸੂਤਰ ਲਗਾਉਂਦਾ ਹੈ", "time-weight": "ਸਮੇਂ ਨੂੰ ਗਲਤ ਗਤੀ ਨਾਲ ਜੋੜਦਾ ਹੈ",
  arithmetic: "ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ",
};

function tagsFromEnglishAuthority(source: Avg001QuestionPackage) {
  const authority = source.language === "en"
    ? source
    : runAvg001EditorialV2Pipeline({
        questionLanguageId: source.questionLanguageId,
        seed: source.seed,
        language: "en",
      });
  const joined = authority.explanation.lines.join("\n");
  const tags = Array.from({ length: 4 }, () => "CORRECT");
  for (const match of joined.matchAll(/(?:^|[;:]\s*)([A-D])\s*\([^)]*\)\s*\[([A-Z][A-Z0-9_]+)\]/g)) {
    tags[match[1]!.charCodeAt(0) - 65] = match[2]!;
  }
  const traced = authority.traceability.editorialV2OptionTags;
  if (Array.isArray(traced) && traced.length === 4) {
    traced.forEach((tag, index) => {
      if (tags[index] === "CORRECT" && index !== authority.correctIndex) tags[index] = String(tag);
    });
  }
  return tags;
}

export function buildAvg001AuthorityDistractorLine(
  source: Avg001QuestionPackage,
  revised: Avg001QuestionPackage,
) {
  const tags = tagsFromEnglishAuthority(source);
  const dictionary = revised.language === "en" ? EN : revised.language === "hi" ? HI : PA;
  const parts = revised.options
    .map((option, index) => ({ option, index, tag: tags[index] ?? "ARITHMETIC_SLIP" }))
    .filter(({ index }) => index !== revised.correctIndex)
    .map(({ option, index, tag }) => `${String.fromCharCode(65 + index)} (${option}) ${dictionary[reasonKey(tag)]}`);
  if (revised.language === "en") return `⚠️ Why the other options are wrong: ${parts.join("; ")}. Therefore, the correct answer is ${revised.answer}.`;
  if (revised.language === "hi") return `दूसरे विकल्प क्यों गलत हैं: ${parts.join("; ")}। इसलिए सही उत्तर ${revised.answer} है।`;
  return `ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ: ${parts.join("; ")}। ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${revised.answer} ਹੈ।`;
}
