import {
  defineQuantMotif,
  type QuantMotif,
} from "../types";

export type NumberSystemDifficultyLevel =
  | 1
  | 2
  | 3
  | 4;

export type NumberSystemQuestionSubtype =
  | "divisibility"
  | "remainders"
  | "hcf_lcm"
  | "unit_digit"
  | "factorials"
  | "recurring_decimal"
  | "divisor_count"
  | "perfect_square_cube"
  | "digit_properties"
  | "classification";

export type NumberSystemMotifDraft = {
  id: string;
  subtype: NumberSystemQuestionSubtype;
  concepts: string[];
  hiddenStructures: string[];
  traps: string[];
  difficulty: NumberSystemDifficultyLevel;
  generationStrategy: string[];
  examples?: string[];
  latexForms?: string[];
};

export type ExtractionLanguagePrimitive =
  | "PM"
  | "DD"
  | "DE"
  | "HIS"
  | "GC"
  | "QA"
  | "CF"
  | "CM";

export const numberSystemScopeMap = {
  chapter: "Number System",
  coreDomains: [
    "Natural Numbers",
    "Whole Numbers",
    "Integers",
    "Rational Numbers",
    "Irrational Numbers",
    "Real Numbers",
    "Prime Numbers",
    "Composite Numbers",
    "Factors and Multiples",
    "Remainders",
    "Divisibility",
    "Digit Properties",
    "Base System",
    "Cyclicity",
    "Factorials",
    "Trailing Zeros",
    "LCM/HCF",
    "Surds",
    "Recurring Decimals",
  ],
} as const;

export const numberSystemConcepts = [
  "number classification hierarchy",
  "rational versus irrational detection",
  "divisibility rules",
  "prime factorization backbone",
  "HCF/LCM structure",
  "remainder arithmetic",
  "cyclic unit-digit systems",
  "recurring decimal reconstruction",
  "factorial structure",
  "trailing zero counting",
  "digit properties",
  "base representation",
  "prime exponent parity for perfect powers",
];

export const numberSystemStructuralFrameworks =
  [
    {
      id: "CF1",
      name: "Number Classification Engine",
      hierarchy: [
        "Natural subset Whole subset Integers subset Rational subset Real",
        "Irrational subset Real",
      ],
      formulas: [
        "rational number = p / q where q != 0",
        "irrational numbers are non-terminating and non-repeating",
      ],
    },
    {
      id: "CF2",
      name: "Divisibility Framework",
      rules: [
        "2 -> last digit even",
        "3 -> sum of digits divisible by 3",
        "4 -> last two digits divisible by 4",
        "5 -> last digit 0 or 5",
        "6 -> divisible by both 2 and 3",
        "8 -> last three digits divisible by 8",
        "9 -> digit sum divisible by 9",
        "11 -> alternating digit difference divisible by 11",
      ],
      utility: [
        "rapid elimination",
        "hidden divisibility",
        "remainder systems",
        "unit digit problems",
      ],
    },
    {
      id: "CF3",
      name: "Prime Factorization Backbone",
      formulas: [
        "N = p1^a x p2^b x p3^c",
      ],
      dependencies: [
        "divisor counting",
        "HCF",
        "LCM",
        "square and cube detection",
        "trailing zeros",
        "surd reduction",
      ],
    },
    {
      id: "CF4",
      name: "HCF and LCM Structural Model",
      formulas: [
        "a x b = HCF x LCM",
        "LCM uses highest powers of all primes",
        "HCF uses lowest common powers",
      ],
    },
    {
      id: "CF5",
      name: "Remainder Arithmetic",
      formulas: [
        "N = dq + r where 0 <= r < d",
      ],
      pattern:
        "modular arithmetic compression",
    },
    {
      id: "CF6",
      name: "Cyclic Unit Digit System",
      formulas: [
        "2^n -> [2, 4, 8, 6]",
        "3^n -> [3, 9, 7, 1]",
        "7^n -> [7, 9, 3, 1]",
        "8^n -> [8, 4, 2, 6]",
        "position = exponent mod cycleLength",
      ],
    },
    {
      id: "CF7",
      name: "Recurring Decimal Conversion",
      formulas: [
        "0.333... = 1/3",
        "0.1666... = 1/6",
      ],
      pattern:
        "subtract shifted versions",
    },
    {
      id: "CF8",
      name: "Factorial Structure",
      formulas: [
        "n! = 1 x 2 x 3 x ... x n",
      ],
      dependencies: [
        "trailing zeros",
        "divisibility",
        "highest powers",
      ],
    },
    {
      id: "CF9",
      name: "Trailing Zero Engine",
      formulas: [
        "trailing zeros = count of 5-factors",
        "2-factors are more frequent than 5-factors",
      ],
    },
  ] as const;

export const numberSystemConceptModules =
  [
    {
      id: "CM1",
      name: "Number Type Identification",
      skills: [
        "set membership",
        "decimal behavior",
        "rationality detection",
      ],
      style: "classification MCQs",
    },
    {
      id: "CM2",
      name: "Divisibility Detection",
      skills: [
        "shortcut recognition",
        "avoid long division",
      ],
    },
    {
      id: "CM3",
      name: "Factor and Multiple Systems",
      skills: [
        "common factors",
        "common multiples",
        "least multiple",
        "highest factor",
      ],
    },
    {
      id: "CM4",
      name: "Remainder Systems",
      skills: [
        "same remainder logic",
        "division remainder interpretation",
      ],
    },
    {
      id: "CM5",
      name: "Unit Digit Prediction",
      skills: [
        "cyclic repetition",
      ],
    },
    {
      id: "CM6",
      name: "Digit Count Problems",
      skills: [
        "largest and smallest number formation",
        "digit count",
        "sum of digits",
      ],
    },
    {
      id: "CM7",
      name: "Base Representation",
      skills: [
        "base-n expansion",
        "decimal conversion",
      ],
    },
    {
      id: "CM8",
      name: "Factorial Divisibility",
      skills: [
        "trailing zeros",
        "highest power divisibility",
        "last non-zero digit",
      ],
    },
    {
      id: "CM9",
      name: "Surd Rationality",
      skills: [
        "perfect square detection",
        "rationality testing",
      ],
    },
    {
      id: "CM10",
      name: "Recurring Decimal Reconstruction",
      skills: [
        "algebraic elimination",
        "place-value handling",
      ],
    },
  ] as const;

export const numberSystemProceduralMotifs =
  [
    {
      id: "PM1",
      canonicalId:
        "classification_structure",
      structuralTopology:
        "classification via membership or decimal-behavior filtering",
      stateVariable:
        "number-class membership",
    },
    {
      id: "PM2",
      canonicalId:
        "divisibility_filter_structure",
      structuralTopology:
        "digit-rule filtering without full division",
      stateVariable:
        "digit-derived divisibility state",
    },
    {
      id: "PM3",
      canonicalId:
        "hcf_lcm_reverse_structure",
      structuralTopology:
        "reverse reconstruction from prime-factor or HCF-LCM identity constraints",
      stateVariable:
        "prime-exponent balance",
    },
    {
      id: "PM4",
      canonicalId:
        "remainder_reduction_structure",
      structuralTopology:
        "modular reduction before final remainder extraction",
      stateVariable:
        "residue class",
    },
    {
      id: "PM5",
      canonicalId:
        "unit_digit_cycle_structure",
      structuralTopology:
        "cyclic modulo indexing for unit-digit prediction",
      stateVariable:
        "cycle position",
    },
    {
      id: "PM6",
      canonicalId:
        "factorial_zero_count_structure",
      structuralTopology:
        "factor-count accumulation inside factorial expansion",
      stateVariable:
        "available 5-factor count",
    },
    {
      id: "PM7",
      canonicalId:
        "recurring_decimal_reconstruction_structure",
      structuralTopology:
        "shift-subtract elimination over repeating decimal forms",
      stateVariable:
        "repeating block alignment",
    },
    {
      id: "PM8",
      canonicalId:
        "divisor_count_structure",
      structuralTopology:
        "prime exponent vector mapped to divisor-count multiplication",
      stateVariable:
        "prime exponent vector",
    },
    {
      id: "PM9",
      canonicalId:
        "perfect_power_balance_structure",
      structuralTopology:
        "exponent parity balancing for square or cube completion",
      stateVariable:
        "exponent parity profile",
    },
    {
      id: "PM10",
      canonicalId:
        "digit_property_optimization_structure",
      structuralTopology:
        "base-10 positional optimization over digit arrangements",
      stateVariable:
        "digit position weighting",
    },
  ] as const;

export const numberSystemDistractorStrategies =
  [
    "skip divisibility shortcuts and attempt long division",
    "swap highest and lowest powers in HCF-LCM construction",
    "use the wrong cycle position when exponent mod cycleLength is 0",
    "assume a remainder can equal the divisor",
    "count only floor(n/5) while ignoring higher powers of 5",
    "convert recurring decimals as if they were finite decimals",
    "treat 1 as prime or composite incorrectly",
    "ignore parity of prime exponents in perfect square or cube questions",
  ];

export const numberSystemDistractorEngineering =
  [
    {
      id: "DE1",
      canonicalId:
        "divisibility_shortcut_failure",
      errorModel:
        "perform long division instead of using a divisibility test",
    },
    {
      id: "DE2",
      canonicalId: "hcf_lcm_swap",
      errorModel:
        "swap highest and lowest power logic between HCF and LCM",
    },
    {
      id: "DE3",
      canonicalId:
        "unit_digit_cycle_misalignment",
      errorModel:
        "select the wrong cycle position, especially when exponent mod cycleLength equals 0",
    },
    {
      id: "DE4",
      canonicalId:
        "remainder_misinterpretation",
      errorModel:
        "allow the remainder to equal or exceed the divisor",
    },
    {
      id: "DE5",
      canonicalId:
        "trailing_zero_overcount",
      errorModel:
        "count only floor(n/5) and ignore 25, 125, 625, and higher powers",
    },
    {
      id: "DE6",
      canonicalId:
        "recurring_decimal_trap",
      errorModel:
        "treat a recurring decimal as a finite decimal expansion",
    },
    {
      id: "DE7",
      canonicalId:
        "prime_composite_confusion",
      errorModel:
        "misclassify 1 in prime-composite questions",
    },
    {
      id: "DE8",
      canonicalId:
        "perfect_square_trap",
      errorModel:
        "ignore exponent parity while testing square or cube completion",
    },
  ] as const;

export const numberSystemHiddenInferenceStructures =
  [
    "number -> prime exponent vector",
    "remainders, cyclicity, and unit digits compress into modular systems",
    "digit problems rely on base-10 positional weighting",
    "perfect square and cube tests depend on exponent parity",
  ];

export const numberSystemDifficultyScaling =
  [
    {
      id: "DD1",
      label: "direct computation",
      description:
        "direct divisibility, basic HCF/LCM, simple remainders",
      level: 1,
    },
    {
      id: "DD2",
      label: "hidden relation",
      description:
        "cyclic unit digits, recurring decimals, divisor counting",
      level: 2,
    },
    {
      id: "DD3",
      label: "multi-stage inference",
      description:
        "factorial systems, nested remainder logic, least-greatest transformations",
      level: 3,
    },
    {
      id: "DD4",
      label: "compressed reasoning",
      description:
        "multi-concept compression, disguised modularity, reverse construction",
      level: 4,
    },
  ] as const;

export const numberSystemDifficultyTuning = [
  "easy: direct divisibility, basic HCF/LCM, simple remainders",
  "medium: cyclic unit digits, recurring decimals, divisor counting",
  "hard: factorial systems, nested remainder logic, least-greatest perfect power transformations",
  "very hard within SSC limits: multi-concept compression and reverse construction",
];

export const numberSystemNumericDesignPatterns =
  [
    {
      id: "NP1",
      name: "SSC-Friendly Families",
      values: [
        12,
        18,
        24,
        36,
        48,
        60,
        72,
        84,
        90,
        120,
      ],
      reason:
        "rich factorization, many divisors, easy cancellation",
    },
    {
      id: "NP2",
      name: "Prime Sets",
      values: [
        2,
        3,
        5,
        7,
        11,
        13,
      ],
    },
    {
      id: "NP3",
      name: "Power-Friendly Values",
      values: [
        16,
        25,
        27,
        32,
        64,
        81,
        125,
      ],
    },
    {
      id: "NP4",
      name: "Recurring Decimal Families",
      values: [
        "1/3",
        "1/6",
        "1/7",
        "1/9",
        "1/11",
      ],
    },
  ] as const;

export const numberSystemGenerationStrategyMetadata =
  [
    "prefer shortcut-friendly arithmetic over brute-force computation",
    "reward decomposition through prime factors, cycles, or modular reduction",
    "use structurally rich but mentally solvable numbers",
    "Number System is a structural-recognition topic, not a large-calculation topic",
    "keep explanations direct, formula-led, and SSC-style",
  ];

export const numberSystemGeneratorConstraints =
  [
    "prefer mental solvability and shortcut discovery",
    "preserve factor richness and balanced prime structure",
    "avoid random large numbers unless cyclicity, factorials, remainders, or digit patterns require them",
    "good questions should punish brute force and reward decomposition",
  ];

export const numberSystemRecommendedMetadata = {
  typeName:
    "NumberSystemQuestion",
  subtypeField: "subtype",
  conceptField: "concepts",
  hiddenStructureField:
    "hiddenStructures",
  trapField: "traps",
  difficultyField: "difficulty",
} as const;

export const numberSystemExtractionLanguagePreservationProtocol =
  [
    {
      id: "ELP1",
      title:
        "Canonical Naming Stability",
      rule:
        "Preserve identical terminology across chapters for difficulty labels, motif labels, distractor labels, inference labels, structural categories, and parameter systems.",
    },
    {
      id: "ELP2",
      title:
        "Structural Namespace Separation",
      rule:
        "Do not merge structurally different systems just because they share surface wording.",
    },
    {
      id: "ELP3",
      title:
        "Duplicate Motif Prevention",
      rule:
        "If the existing topology matches the new topology, merge as a variant; otherwise create a new motif.",
    },
    {
      id: "ELP4",
      title: "Canonical Motif IDs",
      rule:
        "Preserve stable motif IDs and never reuse them for unrelated structures.",
    },
    {
      id: "ELP5",
      title:
        "Inference-Layer Separation",
      rule:
        "Store surface wording, reasoning structure, and solver graph separately.",
    },
    {
      id: "ELP6",
      title:
        "Difficulty Vocabulary Consistency",
      rule:
        "Keep Level 1 through Level 4 globally consistent across chapters.",
    },
    {
      id: "ELP7",
      title:
        "Canonical Distractor Taxonomy",
      rule:
        "Reuse global distractor families instead of creating synonymous duplicates.",
    },
    {
      id: "ELP8",
      title:
        "Numeric Pattern Registry",
      rule:
        "Preserve reusable numeric families globally instead of fragmenting them chapter by chapter.",
    },
    {
      id: "ELP9",
      title:
        "Structural Fingerprinting",
      rule:
        "Each generated problem should map to motifId, inferenceChain, distractorFamily, arithmeticProfile, and difficultyBand.",
    },
    {
      id: "ELP10",
      title:
        "Extraction Formatting Standard",
      rule:
        "Use a stable extraction order: Scope Map, Core Frameworks, Concept Modules, Procedural Motifs, Question Archetypes, Distractor Engineering, Hidden Inference Structures, Difficulty Scaling, Numeric Design Patterns, Generator Constraints, Metadata Schema, Formula Bank.",
    },
    {
      id: "ELP11",
      title:
        "Cross-Chapter Structural Reuse",
      rule:
        "Shared abstractions should reference common primitives without duplicating whole frameworks.",
    },
    {
      id: "ELP12",
      title:
        "Anti-Collision Naming Rules",
      rule:
        "Name structures by reasoning topology before wording theme or story context.",
    },
  ] as const;

export const numberSystemStructuralFingerprintSchema =
  {
    motifId: "canonical motif id",
    inferenceChain:
      "ordered reasoning chain",
    distractorFamily:
      "canonical distractor family",
    arithmeticProfile:
      "prime-factor, modular, positional, or factorial profile",
    difficultyBand:
      "Level 1 | Level 2 | Level 3 | Level 4",
  } as const;

export const numberSystemFormulaBank = [
  {
    label: "HCF-LCM product",
    text: "a x b = HCF(a,b) x LCM(a,b)",
    latex:
      "a \\times b = \\mathrm{HCF}(a,b) \\times \\mathrm{LCM}(a,b)",
  },
  {
    label: "Division algorithm",
    text: "N = dq + r",
    latex: "N = dq + r",
  },
  {
    label: "Number of divisors",
    text: "Number of divisors = (a+1)(b+1)(c+1)",
    latex:
      "\\text{Number of divisors} = (a+1)(b+1)(c+1)",
  },
] as const;

export const numberSystemQuestionArchetypes: NumberSystemMotifDraft[] =
  [
    {
      id: "classification-question",
      subtype: "classification",
      concepts: [
        "number classification hierarchy",
        "rationality detection",
      ],
      hiddenStructures: [
        "terminating versus repeating decimal behavior",
      ],
      traps: [
        "prime-composite confusion around 1",
      ],
      difficulty: 1,
      generationStrategy: [
        "ask for irrational or rational identification using decimal behavior or square-root recognition",
      ],
      examples: [
        "Which of the following is irrational?",
      ],
    },
    {
      id: "divisibility-screening",
      subtype: "divisibility",
      concepts: [
        "divisibility rules",
      ],
      hiddenStructures: [
        "digit operation shortcuts",
      ],
      traps: [
        "divisibility shortcut failure",
      ],
      difficulty: 1,
      generationStrategy: [
        "use rule-based elimination rather than full division",
      ],
      examples: [
        "Which number is divisible by 11?",
      ],
    },
    {
      id: "hcf-lcm-reverse-solve",
      subtype: "hcf_lcm",
      concepts: [
        "HCF-LCM identity",
      ],
      hiddenStructures: [
        "prime factor balance",
      ],
      traps: [
        "HCF-LCM swap",
      ],
      difficulty: 3,
      generationStrategy: [
        "give HCF, LCM, and one number, then reconstruct the second number",
      ],
      examples: [
        "HCF = x, LCM = y, one number = z, find the second number",
      ],
    },
    {
      id: "remainder-problem",
      subtype: "remainders",
      concepts: [
        "division algorithm",
        "remainder arithmetic",
      ],
      hiddenStructures: [
        "mod systems",
      ],
      traps: [
        "remainder misinterpretation",
      ],
      difficulty: 2,
      generationStrategy: [
        "reduce large expressions under a divisor through modular simplification",
      ],
      examples: [
        "When N is divided by 7, what is the remainder?",
      ],
    },
    {
      id: "unit-digit-prediction",
      subtype: "unit_digit",
      concepts: [
        "cyclic unit digit system",
      ],
      hiddenStructures: [
        "modular arithmetic compression",
      ],
      traps: [
        "unit digit cycle misalignment",
      ],
      difficulty: 2,
      generationStrategy: [
        "choose a short standard cycle and hide the final lookup behind exponent reduction",
      ],
      examples: [
        "Find the unit digit of 9^99",
      ],
      latexForms: [
        "9^{99}",
      ],
    },
    {
      id: "trailing-zero-count",
      subtype: "factorials",
      concepts: [
        "factorial structure",
        "trailing zero engine",
      ],
      hiddenStructures: [
        "count of 5-factors",
      ],
      traps: [
        "trailing zero overcount",
      ],
      difficulty: 3,
      generationStrategy: [
        "count powers of 5 progressively instead of brute-force factorial expansion",
      ],
      examples: [
        "Number of zeros in 100!",
      ],
      latexForms: [
        "100!",
      ],
    },
    {
      id: "recurring-decimal-conversion",
      subtype: "recurring_decimal",
      concepts: [
        "recurring decimal conversion",
      ],
      hiddenStructures: [
        "algebraic elimination",
      ],
      traps: [
        "recurring decimal trap",
      ],
      difficulty: 2,
      generationStrategy: [
        "subtract shifted versions to reconstruct the fractional form",
      ],
      examples: [
        "Convert 0.272727... into a fraction",
      ],
    },
    {
      id: "divisor-counting",
      subtype: "divisor_count",
      concepts: [
        "prime factorization backbone",
      ],
      hiddenStructures: [
        "prime exponent vector",
      ],
      traps: [
        "miss one exponent while counting divisors",
      ],
      difficulty: 2,
      generationStrategy: [
        "express the number in prime powers and use exponent-plus-one counting",
      ],
      examples: [
        "How many divisors does 360 have?",
      ],
    },
    {
      id: "perfect-square-cube-balance",
      subtype: "perfect_square_cube",
      concepts: [
        "prime exponent parity",
      ],
      hiddenStructures: [
        "even-odd exponent balance",
      ],
      traps: [
        "perfect square trap",
      ],
      difficulty: 3,
      generationStrategy: [
        "ask for the least multiplier or divisor needed to make a perfect square or cube",
      ],
      examples: [
        "Find the least number by which a given number must be multiplied to make it a perfect square",
      ],
    },
    {
      id: "digit-manipulation",
      subtype: "digit_properties",
      concepts: [
        "digit properties",
        "positional weighting",
      ],
      hiddenStructures: [
        "base-10 positional number logic",
      ],
      traps: [
        "misplace a digit while optimizing largest or smallest formation",
      ],
      difficulty: 2,
      generationStrategy: [
        "optimize over digit arrangement, digit sum, or digit count under a simple structural condition",
      ],
      examples: [
        "Find the greatest number formed by the given digits",
      ],
    },
  ];

export const numberSystemMotifs: QuantMotif[] =
  [
    defineQuantMotif({
      id: "divisibility-filter",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "comparison-chain",
        "one-step-arithmetic",
      ],
      preferredOperations: [
        "filter",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "digitRuleSlip",
        "longDivisionBias",
      ],
      inferenceStyle: "direct",
      reasoningDepthRange: [1, 3],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      generationStrategy: [
        "ask divisibility through digit shortcuts rather than explicit division",
      ],
      distractorStrategies: [
        "attempt full long division instead of using rules",
        "apply the wrong digit-sum or place-value rule",
      ],
      difficultyTuning: {
        easy: [
          "single divisibility rule",
        ],
        medium: [
          "combined divisibility screening",
        ],
      },
      validationRules: [
        "ensure one clean rule resolves the answer quickly",
      ],
      diversityTags: [
        "number-system-divisibility",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        concise: 0.85,
        balanced: 0.7,
      },
      examWeights: {
        ssc: 1.25,
        ibps: 1.05,
      },
    }),
    defineQuantMotif({
      id: "remainder-reduction",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "nested-operations",
      ],
      preferredOperations: [
        "reduce",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "remainderRangeSlip",
        "directDivisionTrap",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "compress expressions by modular reduction before the final division step",
      ],
      distractorStrategies: [
        "allow remainder equal to divisor",
        "divide the full large expression directly",
      ],
      difficultyTuning: {
        easy: [
          "single reduction step",
        ],
        medium: [
          "multi-term modular simplification",
        ],
        hard: [
          "nested remainder or same-remainder condition",
        ],
      },
      validationRules: [
        "preserve a meaningful shortcut path",
      ],
      diversityTags: [
        "number-system-remainder",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        concise: 0.75,
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
      },
    }),
    defineQuantMotif({
      id: "hcf-lcm-reconstruction",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "factor",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "hcfLcmSwap",
        "productIdentitySlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "use the HCF-LCM product identity to recover missing quantities",
      ],
      distractorStrategies: [
        "swap HCF and LCM roles",
        "use highest powers for HCF and lowest powers for LCM",
      ],
      difficultyTuning: {
        medium: [
          "one missing number reconstruction",
        ],
        hard: [
          "reconstruction plus one divisibility or factor condition",
        ],
      },
      validationRules: [
        "apply product identity only in the two-number setting",
      ],
      diversityTags: [
        "number-system-hcf-lcm",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.65,
      },
      examWeights: {
        ssc: 1.15,
      },
    }),
    defineQuantMotif({
      id: "unit-digit-cycle",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "hidden-base-inference",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "reduce",
        "index",
        "infer",
      ],
      commonDistractors: [
        "cycleMisalignment",
        "modZeroSlip",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "choose short standard unit-digit cycles and hide the final lookup behind exponent reduction",
      ],
      distractorStrategies: [
        "pick the wrong cycle element when exponent mod cycleLength is zero",
        "use the raw exponent as the cycle index",
      ],
      difficultyTuning: {
        medium: [
          "single cycle lookup",
        ],
        hard: [
          "cycle lookup with disguised modulus reduction",
        ],
      },
      validationRules: [
        "prefer familiar bases such as 2, 3, 7, 8, 9",
      ],
      diversityTags: [
        "number-system-unit-digit",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        concise: 0.8,
        balanced: 0.7,
      },
      examWeights: {
        ssc: 1.2,
        ibps: 1.05,
      },
    }),
    defineQuantMotif({
      id: "factorial-trailing-zero",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "factor",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "singleFiveCount",
        "bruteForceExpansion",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "count powers of 5 in factorial structure instead of expanding the factorial",
      ],
      distractorStrategies: [
        "count only floor(n/5)",
        "expand the factorial directly",
      ],
      difficultyTuning: {
        medium: [
          "single trailing-zero count",
        ],
        hard: [
          "highest-power or nested factorial divisibility variant",
        ],
      },
      validationRules: [
        "keep the floor-sum depth mentally manageable",
      ],
      diversityTags: [
        "number-system-factorial",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.1,
      },
    }),
    defineQuantMotif({
      id: "recurring-decimal-reconstruction",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "direct-substitution",
        "multi-step-arithmetic",
      ],
      preferredOperations: [
        "transform",
        "aggregate",
        "infer",
      ],
      commonDistractors: [
        "finiteDecimalTrap",
        "placeValueSlip",
      ],
      inferenceStyle: "conditional",
      reasoningDepthRange: [2, 4],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "reconstruct recurring decimals by subtracting shifted versions",
      ],
      distractorStrategies: [
        "treat recurring decimals as finite decimals",
        "shift by the wrong place value",
      ],
      difficultyTuning: {
        medium: [
          "pure recurring decimal conversion",
        ],
        hard: [
          "mixed recurring decimal conversion",
        ],
      },
      validationRules: [
        "prefer clean recurring blocks",
      ],
      diversityTags: [
        "number-system-recurring-decimal",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        balanced: 0.8,
      },
      examWeights: {
        ssc: 1.0,
      },
    }),
    defineQuantMotif({
      id: "divisor-count-prime-exponents",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "factor",
        "transform",
        "infer",
      ],
      commonDistractors: [
        "missExponentTrap",
        "rawFactorListing",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "factor the number into prime powers and count divisors via exponent-plus-one multiplication",
      ],
      distractorStrategies: [
        "miss one prime exponent",
        "try to list all divisors directly",
      ],
      difficultyTuning: {
        medium: [
          "single divisor-count formula application",
        ],
        hard: [
          "divisor count after structural transformation",
        ],
      },
      validationRules: [
        "prefer factor-rich but manageable numbers",
      ],
      diversityTags: [
        "number-system-divisor-count",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        balanced: 0.75,
      },
      examWeights: {
        ssc: 1.05,
      },
    }),
    defineQuantMotif({
      id: "perfect-power-balance",
      topicCluster: "number-system",
      archetype: "general",
      reasoningCategories: [
        "multi-step-arithmetic",
        "hidden-base-inference",
      ],
      preferredOperations: [
        "factor",
        "compare",
        "infer",
      ],
      commonDistractors: [
        "exponentParitySlip",
        "multiplyInsteadOfBalance",
      ],
      inferenceStyle: "hidden",
      reasoningDepthRange: [3, 5],
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      generationStrategy: [
        "balance prime exponents to form a perfect square or cube",
      ],
      distractorStrategies: [
        "ignore odd exponent parity",
        "change the wrong prime factor",
      ],
      difficultyTuning: {
        medium: [
          "perfect square adjustment",
        ],
        hard: [
          "perfect cube or least multiplier-divisor transformation",
        ],
      },
      validationRules: [
        "keep prime exponent structure readable",
      ],
      diversityTags: [
        "number-system-perfect-power",
      ],
      rotationGroup:
        "quant-number-system-core",
      wordingBias: {
        balanced: 0.75,
        inferenceHeavy: 0.65,
      },
      examWeights: {
        ssc: 1.0,
      },
    }),
  ];
