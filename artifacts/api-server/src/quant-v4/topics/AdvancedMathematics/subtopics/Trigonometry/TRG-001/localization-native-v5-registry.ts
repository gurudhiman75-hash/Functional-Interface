export const TRG_001_LOCALIZATION_NATIVE_V5_VERSION = "TRG001_HI_PA_LOCALIZATION_NATIVE_V5" as const;

export type Trg001V5Locale = "hi-IN" | "pa-IN";

export type Trg001V5StemKind =
  | "opposite_side" | "adjacent_side" | "hypotenuse_identify" | "sine_ratio_identify"
  | "ratio_what" | "ratio_find" | "for_acute_if_find" | "legs_opposite_find"
  | "legs_adjacent_find" | "hyp_opposite_find" | "hyp_adjacent_find" | "if_find"
  | "for_acute_determine_exact" | "compare_sin_cos" | "given_reciprocal" | "exact_expression"
  | "tan90_domain" | "defined_finite" | "deg_to_rad" | "rad_to_deg" | "if_evaluate"
  | "for_condition_simplify" | "expression_action" | "equivalent_identity" | "given_evaluate"
  | "acute_solve" | "acute_find_theta" | "simplify_where" | "acute_with_evaluate"
  | "maximum" | "minimum" | "triangle_area" | "triangle_angle_area"
  | "simplify_where_prefix" | "find_where" | "trig_equivalent";

export type Trg001V5RuleKey =
  | "opposite_side" | "adjacent_side" | "hypotenuse" | "sine_ratio" | "cosine_ratio"
  | "tangent_ratio" | "cotangent_ratio" | "pythagorean_trig" | "pythagorean_identity"
  | "sec_tan_identity" | "pythagorean_reciprocal" | "compare_tan" | "reciprocal"
  | "standard_values" | "domain" | "degree_radian" | "radian_degree" | "cofunction"
  | "quadrant_reduction" | "cosec_cot_identity" | "tan_sin_cos" | "reconstruct_triangle"
  | "conjugate_identity" | "sum_difference_square" | "linear_sin_cos" | "acute_standard"
  | "tan_cot_identity" | "angle_sum_difference" | "double_angle" | "linear_range"
  | "triangle_area";

export type Trg001V5Binding = Readonly<{ stemKind: Trg001V5StemKind; ruleKey: Trg001V5RuleKey }>;

export const TRG_001_V5_RULES: Readonly<Record<Trg001V5RuleKey, readonly [hi: string, pa: string]>> = {
  opposite_side: ["समकोण त्रिभुज में संदर्भ कोण के सामने वाली भुजा उस कोण को स्पर्श नहीं करती।", "ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ ਹਵਾਲਾ ਕੋਣ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਉਸ ਕੋਣ ਨੂੰ ਨਹੀਂ ਛੂਹਦੀ।"],
  adjacent_side: ["संदर्भ कोण को स्पर्श करने वाली, लेकिन कर्ण न होने वाली भुजा सटी हुई भुजा होती है।", "ਹਵਾਲਾ ਕੋਣ ਨੂੰ ਛੂਹਣ ਵਾਲੀ, ਪਰ ਕਰਣ ਨਾ ਹੋਣ ਵਾਲੀ ਭੁਜਾ ਲੱਗਦੀ ਭੁਜਾ ਹੁੰਦੀ ਹੈ।"],
  hypotenuse: ["कर्ण हमेशा समकोण के सामने वाली भुजा होती है।", "ਕਰਣ ਹਮੇਸ਼ਾ ਸਮਕੋਣ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ ਹੁੰਦੀ ਹੈ।"],
  sine_ratio: ["sin θ = सामने वाली भुजा / कर्ण।", "sin θ = ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ / ਕਰਣ।"],
  cosine_ratio: ["cos θ = सटी हुई भुजा / कर्ण।", "cos θ = ਲੱਗਦੀ ਭੁਜਾ / ਕਰਣ।"],
  tangent_ratio: ["tan θ = सामने वाली भुजा / सटी हुई भुजा।", "tan θ = ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ / ਲੱਗਦੀ ਭੁਜਾ।"],
  cotangent_ratio: ["cot θ = सटी हुई भुजा / सामने वाली भुजा।", "cot θ = ਲੱਗਦੀ ਭੁਜਾ / ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ।"],
  pythagorean_trig: ["समकोण त्रिभुज में a²+b²=c² से आवश्यक भुजा निकालकर सही त्रिकोणमितीय अनुपात लगाएँ।", "ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ a²+b²=c² ਨਾਲ ਲੋੜੀਂਦੀ ਭੁਜਾ ਕੱਢ ਕੇ ਸਹੀ ਤਿਕੋਣਮਿਤੀ ਅਨੁਪਾਤ ਲਗਾਓ।"],
  pythagorean_identity: ["मूल सर्वसमिका sin²θ+cos²θ=1 का प्रयोग करें।", "ਮੂਲ ਸਰਬਸਮਿਕਾ sin²θ+cos²θ=1 ਵਰਤੋ।"],
  sec_tan_identity: ["1+tan²θ=sec²θ, अर्थात sec²θ−tan²θ=1।", "1+tan²θ=sec²θ, ਅਰਥਾਤ sec²θ−tan²θ=1।"],
  pythagorean_reciprocal: ["पहले sin²θ+cos²θ=1 से आवश्यक मान निकालें, फिर व्युत्क्रम संबंध लगाएँ।", "ਪਹਿਲਾਂ sin²θ+cos²θ=1 ਨਾਲ ਲੋੜੀਂਦਾ ਮਾਨ ਕੱਢੋ, ਫਿਰ ਪਰਸਪਰ ਸੰਬੰਧ ਲਗਾਓ।"],
  compare_tan: ["न्यूनकोण में tan θ=sin θ/cos θ; tan θ>1 होने पर sin θ>cos θ होता है।", "ਨਿਊਨ ਕੋਣ ਵਿੱਚ tan θ=sin θ/cos θ; tan θ>1 ਹੋਵੇ ਤਾਂ sin θ>cos θ ਹੁੰਦਾ ਹੈ।"],
  reciprocal: ["sin–cosec, cos–sec और tan–cot परस्पर व्युत्क्रम युग्म हैं।", "sin–cosec, cos–sec ਅਤੇ tan–cot ਪਰਸਪਰ ਜੋੜੇ ਹਨ।"],
  standard_values: ["0°, 30°, 45°, 60° और 90° के मानक त्रिकोणमितीय मानों का प्रयोग करें।", "0°, 30°, 45°, 60° ਅਤੇ 90° ਦੇ ਮਿਆਰੀ ਤਿਕੋਣਮਿਤੀ ਮਾਨ ਵਰਤੋ।"],
  domain: ["tan और sec में हर cos से तथा cot और cosec में हर sin से बनता है; हर शून्य होने पर फलन अपरिभाषित होता है।", "tan ਅਤੇ sec ਵਿੱਚ ਹਰ cos ਤੋਂ ਅਤੇ cot ਤੇ cosec ਵਿੱਚ ਹਰ sin ਤੋਂ ਬਣਦਾ ਹੈ; ਹਰ ਸਿਫ਼ਰ ਹੋਵੇ ਤਾਂ ਫੰਕਸ਼ਨ ਅਪਰਿਭਾਸ਼ਿਤ ਹੁੰਦਾ ਹੈ।"],
  degree_radian: ["डिग्री को रेडियन में बदलने के लिए π/180 से गुणा करें।", "ਡਿਗਰੀ ਨੂੰ ਰੇਡੀਅਨ ਵਿੱਚ ਬਦਲਣ ਲਈ π/180 ਨਾਲ ਗੁਣਾ ਕਰੋ।"],
  radian_degree: ["रेडियन को डिग्री में बदलने के लिए 180/π से गुणा करें।", "ਰੇਡੀਅਨ ਨੂੰ ਡਿਗਰੀ ਵਿੱਚ ਬਦਲਣ ਲਈ 180/π ਨਾਲ ਗੁਣਾ ਕਰੋ।"],
  cofunction: ["पूरक कोणों के सहफलन संबंध लागू करें: sin(90°−θ)=cosθ और tan(90°−θ)=cotθ।", "ਪੂਰਕ ਕੋਣਾਂ ਦੇ ਸਹਿ-ਫੰਕਸ਼ਨ ਸੰਬੰਧ ਲਗਾਓ: sin(90°−θ)=cosθ ਅਤੇ tan(90°−θ)=cotθ।"],
  quadrant_reduction: ["कोण को संदर्भ कोण तक घटाकर चतुर्थांश के अनुसार सही चिह्न लगाएँ।", "ਕੋਣ ਨੂੰ ਹਵਾਲਾ ਕੋਣ ਤੱਕ ਘਟਾ ਕੇ ਚਤੁਰਭਾਗ ਅਨੁਸਾਰ ਸਹੀ ਚਿੰਨ੍ਹ ਲਗਾਓ।"],
  cosec_cot_identity: ["1+cot²θ=cosec²θ, अर्थात cosec²θ−cot²θ=1।", "1+cot²θ=cosec²θ, ਅਰਥਾਤ cosec²θ−cot²θ=1।"],
  tan_sin_cos: ["tan θ=sin θ/cos θ रखकर समान गुणकों को काटें।", "tan θ=sin θ/cos θ ਰੱਖ ਕੇ ਸਾਂਝੇ ਗੁਣਕ ਕੱਟੋ।"],
  reconstruct_triangle: ["दिए अनुपात को समकोण त्रिभुज की भुजाओं का अनुपात मानकर तीसरी भुजा निकालें।", "ਦਿੱਤੇ ਅਨੁਪਾਤ ਨੂੰ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ਮੰਨ ਕੇ ਤੀਜੀ ਭੁਜਾ ਕੱਢੋ।"],
  conjugate_identity: ["(secθ+tanθ)(secθ−tanθ)=1 तथा (cosecθ+cotθ)(cosecθ−cotθ)=1 का प्रयोग करें।", "(secθ+tanθ)(secθ−tanθ)=1 ਅਤੇ (cosecθ+cotθ)(cosecθ−cotθ)=1 ਵਰਤੋ।"],
  sum_difference_square: ["(a±b)²=a²+b²±2ab का प्रयोग करके त्रिकोणमितीय योग या अंतर का वर्ग खोलें।", "(a±b)²=a²+b²±2ab ਨਾਲ ਤਿਕੋਣਮਿਤੀ ਜੋੜ ਜਾਂ ਅੰਤਰ ਦਾ ਵਰਗ ਖੋਲ੍ਹੋ।"],
  linear_sin_cos: ["दिए रैखिक sin–cos संबंधों को जोड़कर या घटाकर आवश्यक संयोजन निकालें।", "ਦਿੱਤੇ ਰੇਖੀ sin–cos ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜ ਜਾਂ ਘਟਾ ਕੇ ਲੋੜੀਂਦਾ ਸੰਯੋਜਨ ਕੱਢੋ।"],
  acute_standard: ["न्यूनकोण की शर्त के साथ मानक त्रिकोणमितीय मान से कोण चुनें।", "ਨਿਊਨ ਕੋਣ ਦੀ ਸ਼ਰਤ ਨਾਲ ਮਿਆਰੀ ਤਿਕੋਣਮਿਤੀ ਮਾਨ ਤੋਂ ਕੋਣ ਚੁਣੋ।"],
  tan_cot_identity: ["tanθ·cotθ=1 का प्रयोग करें।", "tanθ·cotθ=1 ਵਰਤੋ।"],
  angle_sum_difference: ["कोण-योग और कोण-अंतर के मानक सूत्रों का प्रयोग करें।", "ਕੋਣ-ਜੋੜ ਅਤੇ ਕੋਣ-ਅੰਤਰ ਦੇ ਮਿਆਰੀ ਸੂਤਰ ਵਰਤੋ।"],
  double_angle: ["आवश्यकतानुसार sin2θ=2sinθcosθ, cos2θ=(1−tan²θ)/(1+tan²θ) या tan2θ=2tanθ/(1−tan²θ) प्रयोग करें।", "ਲੋੜ ਅਨੁਸਾਰ sin2θ=2sinθcosθ, cos2θ=(1−tan²θ)/(1+tan²θ) ਜਾਂ tan2θ=2tanθ/(1−tan²θ) ਵਰਤੋ।"],
  linear_range: ["a sinθ+b cosθ के लिए R=√(a²+b²); अधिकतम R और न्यूनतम −R होता है।", "a sinθ+b cosθ ਲਈ R=√(a²+b²); ਵੱਧ ਤੋਂ ਵੱਧ R ਅਤੇ ਘੱਟ ਤੋਂ ਘੱਟ −R ਹੁੰਦਾ ਹੈ।"],
  triangle_area: ["दो भुजाएँ a,b और उनके बीच का कोण C हो तो क्षेत्रफल = 1/2·ab·sinC।", "ਦੋ ਭੁਜਾਵਾਂ a,b ਅਤੇ ਉਨ੍ਹਾਂ ਵਿਚਕਾਰ ਕੋਣ C ਹੋਵੇ ਤਾਂ ਖੇਤਰਫਲ = 1/2·ab·sinC।"],
};

export const TRG_001_V5_BINDINGS: Readonly<Record<string, Trg001V5Binding>> = {
  "TRG-001-QL-001": { stemKind: "opposite_side", ruleKey: "opposite_side" },
  "TRG-001-QL-002": { stemKind: "adjacent_side", ruleKey: "adjacent_side" },
  "TRG-001-QL-003": { stemKind: "hypotenuse_identify", ruleKey: "hypotenuse" },
  "TRG-001-QL-004": { stemKind: "sine_ratio_identify", ruleKey: "sine_ratio" },
  "TRG-001-QL-005": { stemKind: "ratio_what", ruleKey: "sine_ratio" },
  "TRG-001-QL-006": { stemKind: "ratio_find", ruleKey: "cosine_ratio" },
  "TRG-001-QL-007": { stemKind: "for_acute_if_find", ruleKey: "tangent_ratio" },
  "TRG-001-QL-008": { stemKind: "for_acute_if_find", ruleKey: "cotangent_ratio" },
  "TRG-001-QL-009": { stemKind: "legs_opposite_find", ruleKey: "pythagorean_trig" },
  "TRG-001-QL-010": { stemKind: "legs_adjacent_find", ruleKey: "pythagorean_trig" },
  "TRG-001-QL-011": { stemKind: "hyp_opposite_find", ruleKey: "pythagorean_trig" },
  "TRG-001-QL-012": { stemKind: "hyp_adjacent_find", ruleKey: "pythagorean_trig" },
  "TRG-001-QL-013": { stemKind: "if_find", ruleKey: "sine_ratio" },
  "TRG-001-QL-014": { stemKind: "if_find", ruleKey: "cosine_ratio" },
  "TRG-001-QL-015": { stemKind: "if_find", ruleKey: "tangent_ratio" },
  "TRG-001-QL-016": { stemKind: "if_find", ruleKey: "cotangent_ratio" },
  "TRG-001-QL-017": { stemKind: "if_find", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-018": { stemKind: "if_find", ruleKey: "pythagorean_trig" },
  "TRG-001-QL-019": { stemKind: "if_find", ruleKey: "sec_tan_identity" },
  "TRG-001-QL-020": { stemKind: "for_acute_determine_exact", ruleKey: "cotangent_ratio" },
  "TRG-001-QL-021": { stemKind: "for_acute_determine_exact", ruleKey: "tangent_ratio" },
  "TRG-001-QL-022": { stemKind: "for_acute_determine_exact", ruleKey: "pythagorean_reciprocal" },
  "TRG-001-QL-023": { stemKind: "compare_sin_cos", ruleKey: "compare_tan" },
  "TRG-001-QL-024": { stemKind: "given_reciprocal", ruleKey: "reciprocal" },
  "TRG-001-QL-025": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-026": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-027": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-028": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-029": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-030": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-031": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-032": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-033": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-034": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-035": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-036": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-037": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-038": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-039": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-040": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-041": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-042": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-043": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-044": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-045": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-046": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-047": { stemKind: "tan90_domain", ruleKey: "domain" },
  "TRG-001-QL-048": { stemKind: "defined_finite", ruleKey: "domain" },
  "TRG-001-QL-049": { stemKind: "deg_to_rad", ruleKey: "degree_radian" },
  "TRG-001-QL-050": { stemKind: "rad_to_deg", ruleKey: "radian_degree" },
  "TRG-001-QL-051": { stemKind: "deg_to_rad", ruleKey: "degree_radian" },
  "TRG-001-QL-052": { stemKind: "rad_to_deg", ruleKey: "radian_degree" },
  "TRG-001-QL-053": { stemKind: "if_evaluate", ruleKey: "cofunction" },
  "TRG-001-QL-054": { stemKind: "exact_expression", ruleKey: "cofunction" },
  "TRG-001-QL-055": { stemKind: "exact_expression", ruleKey: "cofunction" },
  "TRG-001-QL-056": { stemKind: "exact_expression", ruleKey: "cofunction" },
  "TRG-001-QL-057": { stemKind: "exact_expression", ruleKey: "cofunction" },
  "TRG-001-QL-058": { stemKind: "exact_expression", ruleKey: "cofunction" },
  "TRG-001-QL-059": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-060": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-061": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-062": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-063": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-064": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-065": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-066": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-067": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-068": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-069": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-070": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-071": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-072": { stemKind: "exact_expression", ruleKey: "quadrant_reduction" },
  "TRG-001-QL-073": { stemKind: "if_find", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-074": { stemKind: "for_condition_simplify", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-075": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-076": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-077": { stemKind: "if_find", ruleKey: "sec_tan_identity" },
  "TRG-001-QL-078": { stemKind: "expression_action", ruleKey: "sec_tan_identity" },
  "TRG-001-QL-079": { stemKind: "if_find", ruleKey: "sec_tan_identity" },
  "TRG-001-QL-080": { stemKind: "if_find", ruleKey: "cosec_cot_identity" },
  "TRG-001-QL-081": { stemKind: "if_find", ruleKey: "cosec_cot_identity" },
  "TRG-001-QL-082": { stemKind: "if_find", ruleKey: "cosec_cot_identity" },
  "TRG-001-QL-083": { stemKind: "expression_action", ruleKey: "reciprocal" },
  "TRG-001-QL-084": { stemKind: "expression_action", ruleKey: "tan_sin_cos" },
  "TRG-001-QL-085": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-086": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-087": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-088": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-089": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-090": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-091": { stemKind: "expression_action", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-092": { stemKind: "if_find", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-093": { stemKind: "if_find", ruleKey: "reconstruct_triangle" },
  "TRG-001-QL-094": { stemKind: "if_find", ruleKey: "reconstruct_triangle" },
  "TRG-001-QL-095": { stemKind: "if_find", ruleKey: "reconstruct_triangle" },
  "TRG-001-QL-096": { stemKind: "equivalent_identity", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-097": { stemKind: "if_find", ruleKey: "reconstruct_triangle" },
  "TRG-001-QL-098": { stemKind: "if_find", ruleKey: "reconstruct_triangle" },
  "TRG-001-QL-099": { stemKind: "if_find", ruleKey: "reconstruct_triangle" },
  "TRG-001-QL-100": { stemKind: "if_find", ruleKey: "reconstruct_triangle" },
  "TRG-001-QL-101": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-102": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-103": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-104": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-105": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-106": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-107": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-108": { stemKind: "if_find", ruleKey: "conjugate_identity" },
  "TRG-001-QL-109": { stemKind: "if_find", ruleKey: "sum_difference_square" },
  "TRG-001-QL-110": { stemKind: "if_find", ruleKey: "sum_difference_square" },
  "TRG-001-QL-111": { stemKind: "if_find", ruleKey: "sum_difference_square" },
  "TRG-001-QL-112": { stemKind: "given_evaluate", ruleKey: "sum_difference_square" },
  "TRG-001-QL-113": { stemKind: "if_find", ruleKey: "linear_sin_cos" },
  "TRG-001-QL-114": { stemKind: "if_find", ruleKey: "linear_sin_cos" },
  "TRG-001-QL-115": { stemKind: "if_find", ruleKey: "linear_sin_cos" },
  "TRG-001-QL-116": { stemKind: "if_find", ruleKey: "linear_sin_cos" },
  "TRG-001-QL-117": { stemKind: "acute_solve", ruleKey: "acute_standard" },
  "TRG-001-QL-118": { stemKind: "if_find", ruleKey: "tan_cot_identity" },
  "TRG-001-QL-119": { stemKind: "acute_solve", ruleKey: "acute_standard" },
  "TRG-001-QL-120": { stemKind: "acute_find_theta", ruleKey: "acute_standard" },
  "TRG-001-QL-121": { stemKind: "expression_action", ruleKey: "standard_values" },
  "TRG-001-QL-122": { stemKind: "simplify_where", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-123": { stemKind: "simplify_where", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-124": { stemKind: "simplify_where", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-125": { stemKind: "simplify_where", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-126": { stemKind: "simplify_where", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-127": { stemKind: "exact_expression", ruleKey: "angle_sum_difference" },
  "TRG-001-QL-128": { stemKind: "exact_expression", ruleKey: "angle_sum_difference" },
  "TRG-001-QL-129": { stemKind: "exact_expression", ruleKey: "angle_sum_difference" },
  "TRG-001-QL-130": { stemKind: "exact_expression", ruleKey: "angle_sum_difference" },
  "TRG-001-QL-131": { stemKind: "acute_with_evaluate", ruleKey: "double_angle" },
  "TRG-001-QL-132": { stemKind: "acute_with_evaluate", ruleKey: "double_angle" },
  "TRG-001-QL-133": { stemKind: "acute_with_evaluate", ruleKey: "double_angle" },
  "TRG-001-QL-134": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-135": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-136": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-137": { stemKind: "exact_expression", ruleKey: "standard_values" },
  "TRG-001-QL-138": { stemKind: "maximum", ruleKey: "linear_range" },
  "TRG-001-QL-139": { stemKind: "minimum", ruleKey: "linear_range" },
  "TRG-001-QL-140": { stemKind: "triangle_area", ruleKey: "triangle_area" },
  "TRG-001-QL-141": { stemKind: "triangle_angle_area", ruleKey: "triangle_area" },
  "TRG-001-QL-142": { stemKind: "simplify_where_prefix", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-143": { stemKind: "find_where", ruleKey: "pythagorean_identity" },
  "TRG-001-QL-144": { stemKind: "trig_equivalent", ruleKey: "double_angle" },
};

export function trg001V5Rule(locale: Trg001V5Locale, ruleKey: Trg001V5RuleKey) {
  const pair = TRG_001_V5_RULES[ruleKey];
  return locale === "hi-IN" ? pair[0] : pair[1];
}

export function trg001V5BindingFor(qlId: string) {
  return TRG_001_V5_BINDINGS[qlId];
}

export function trg001V5RegistrySummary() {
  return {
    version: TRG_001_LOCALIZATION_NATIVE_V5_VERSION,
    bindingCount: Object.keys(TRG_001_V5_BINDINGS).length,
    ruleCount: Object.keys(TRG_001_V5_RULES).length,
  } as const;
}
