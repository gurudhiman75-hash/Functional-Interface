import {
  defineEnglishMotif,
  type EnglishMotif,
} from "./types";

export const englishMotifs: EnglishMotif[] = [
  defineEnglishMotif({
    id: "subject_verb_ambiguity",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-ambiguity",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ssc: 1.1,
        ibps: 1.2,
        sbi: 1.1,
      },
    },
    realizationHints: {
      wordingBias: {
        concise: 0.5,
        balanced: 0.8,
      },
      explanationStyle: [
        "agreement-based elimination",
      ],
      distractorHints: [
        "number agreement trap",
        "intervening phrase confusion",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "conditional",
        "inferential",
      ],
      ruleTags: [
        "subject-verb agreement",
        "intervening phrase",
      ],
    },
    triggerPatterns: [
      "prepositional phrase between subject and verb",
      "collective noun disagreement",
    ],
    ambiguityTags: [
      "agreement",
      "modifier-distance",
    ],
    commonDistractors: [
      "nearest-noun agreement",
      "plural lure",
    ],
    generationStrategy: [
      "insert a misleading noun between the true subject and verb",
      "keep one dominant grammar fault per item",
    ],
    parameterRanges: {
      clauseCount: {
        min: 1,
        max: 2,
      },
    },
    distractorStrategies: [
      "nearest-noun lure",
      "collective-noun confusion",
    ],
    difficultyTuning: {
      easy: [
        "single interrupting phrase",
      ],
      medium: [
        "collective noun plus interrupting phrase",
      ],
      hard: [
        "compound subject with distractor noun",
      ],
    },
    validationRules: [
      "keep exactly one best correction",
      "avoid overlapping grammar faults",
    ],
    diversityTags: [
      "sva-core",
    ],
    rotationGroup:
      "english-error-spotting-core",
  }),
  defineEnglishMotif({
    id: "modifier_attachment_trap",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [3, 6],
      inferenceStyle: "hidden",
      examWeights: {
        cat: 1.25,
        ibps: 1.0,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.8,
      },
      explanationStyle: [
        "attachment resolution",
      ],
      distractorHints: [
        "misplaced modifier",
        "pronoun reference confusion",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "inferential",
        "multi-step",
      ],
      ruleTags: [
        "modifier-attachment",
        "reference-resolution",
      ],
    },
    triggerPatterns: [
      "dangling participle",
      "ambiguous relative clause",
    ],
    ambiguityTags: [
      "attachment",
      "reference",
    ],
    commonDistractors: [
      "nearest-clause attachment",
      "parallelism distraction",
    ],
    generationStrategy: [
      "use a misplaced or dangling modifier with one grammatically clean fix",
    ],
    distractorStrategies: [
      "nearest-clause attachment",
      "reference drift",
    ],
    difficultyTuning: {
      medium: [
        "single dangling modifier",
      ],
      hard: [
        "modifier plus pronoun-reference ambiguity",
      ],
    },
    validationRules: [
      "ensure only one option resolves attachment cleanly",
    ],
    diversityTags: [
      "modifier-attachment",
    ],
    rotationGroup:
      "english-sentence-improvement-core",
  }),
  defineEnglishMotif({
    id: "tense-confusion",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ssc: 1.2,
        ibps: 1.1,
        sbi: 1.1,
      },
    },
    realizationHints: {
      wordingBias: {
        concise: 0.5,
        balanced: 0.85,
      },
      explanationStyle: [
        "timeline consistency check",
      ],
      distractorHints: [
        "tense sequence mismatch",
        "perfect vs simple confusion",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "conditional",
        "inferential",
      ],
      ruleTags: [
        "tense agreement",
        "sequence of tense",
      ],
    },
    triggerPatterns: [
      "time marker conflicts with verb tense",
      "reported past event uses present perfect incorrectly",
    ],
    ambiguityTags: [
      "timeline",
      "aspect",
    ],
    commonDistractors: [
      "simple-vs-perfect",
      "present-vs-past lure",
    ],
    generationStrategy: [
      "anchor a sentence with a strong time cue and vary tense choices around it",
    ],
    distractorStrategies: [
      "swap simple and perfect forms",
      "use locally plausible but globally inconsistent tense",
    ],
    difficultyTuning: {
      easy: [
        "single time marker mismatch",
      ],
      medium: [
        "two-clause tense consistency",
      ],
      hard: [
        "narrative sequence with aspect trap",
      ],
    },
    validationRules: [
      "one dominant tense error only",
    ],
    diversityTags: [
      "tense-sequence",
    ],
    rotationGroup:
      "english-error-spotting-core",
  }),
  defineEnglishMotif({
    id: "article-misuse",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
      ],
      reasoningDepthRange: [1, 3],
      inferenceStyle: "direct",
      examWeights: {
        ssc: 1.2,
        rrb: 1.1,
      },
    },
    realizationHints: {
      wordingBias: {
        concise: 0.8,
        balanced: 0.6,
      },
      explanationStyle: [
        "article usage rule",
      ],
      distractorHints: [
        "a/an swap",
        "zero-article trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "direct",
      ],
      ruleTags: [
        "article usage",
      ],
    },
    triggerPatterns: [
      "vowel-sound mismatch",
      "generic noun with unnecessary article",
    ],
    ambiguityTags: [
      "article",
    ],
    commonDistractors: [
      "sound-spelling confusion",
      "generic-specific swap",
    ],
    generationStrategy: [
      "keep the sentence short and center the question on one article decision",
    ],
    distractorStrategies: [
      "use orthographic vowel instead of vowel sound",
      "mix generic and specific article usage",
    ],
    difficultyTuning: {
      easy: [
        "single article correction",
      ],
      medium: [
        "article plus countability context",
      ],
    },
    validationRules: [
      "avoid multiple grammar faults",
    ],
    diversityTags: [
      "article-usage",
    ],
    rotationGroup:
      "english-error-spotting-core",
  }),
  defineEnglishMotif({
    id: "contextual-antonym-trap",
    domain: "english",
    subdomain: "vocabulary",
    archetype: "grammar-ambiguity",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 4],
      inferenceStyle: "hidden",
      examWeights: {
        ibps: 1.1,
        sbi: 1.1,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.75,
      },
      explanationStyle: [
        "context fit over surface polarity",
      ],
      distractorHints: [
        "tone-match lure",
        "opposite-meaning trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "conditional",
        "inferential",
      ],
      ruleTags: [
        "fillers",
        "contextual vocabulary",
      ],
    },
    triggerPatterns: [
      "blank requires contextual opposite, not dictionary opposite",
    ],
    ambiguityTags: [
      "tone",
      "context",
    ],
    commonDistractors: [
      "near-synonym lure",
      "surface-antonym lure",
    ],
    generationStrategy: [
      "build filler sentences where local tone and global meaning disagree with obvious lexical choice",
    ],
    distractorStrategies: [
      "place one semantically close but context-wrong option",
      "place one tone-compatible but meaning-wrong option",
    ],
    difficultyTuning: {
      medium: [
        "single blank with tonal cue",
      ],
      hard: [
        "double blank with cross-blank dependency",
      ],
    },
    validationRules: [
      "one best contextual fit only",
    ],
    diversityTags: [
      "fillers-context",
    ],
    rotationGroup:
      "english-fillers-core",
  }),
  defineEnglishMotif({
    id: "logical-sequencing-anchor",
    domain: "english",
    subdomain: "grammar",
    archetype: "general",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [3, 5],
      inferenceStyle: "conditional",
      examWeights: {
        cat: 1.2,
        ibps: 1.0,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.7,
        inferenceHeavy: 0.75,
      },
      explanationStyle: [
        "identify opening line and reference chain",
      ],
      distractorHints: [
        "false opener",
        "reference-link mismatch",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "multi-step",
        "inferential",
      ],
      ruleTags: [
        "para-jumbles",
        "coherence",
      ],
    },
    triggerPatterns: [
      "one sentence introduces topic while later sentence contains pronoun or contrast marker",
    ],
    ambiguityTags: [
      "ordering",
      "coherence",
    ],
    commonDistractors: [
      "connector-first lure",
      "pronoun-before-noun",
    ],
    generationStrategy: [
      "create one clear opener and one reference chain that fixes the middle order",
    ],
    distractorStrategies: [
      "use a discourse-marker sentence as fake opener",
      "swap two locally coherent but globally wrong middle lines",
    ],
    difficultyTuning: {
      medium: [
        "4-sentence jumbled set",
      ],
      hard: [
        "5-sentence set with one deceptive pair",
      ],
    },
    validationRules: [
      "single best sequence",
    ],
    diversityTags: [
      "para-jumble-anchor",
    ],
    rotationGroup:
      "english-parajumble-core",
  }),
  defineEnglishMotif({
    id: "reported-speech-shift",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 5],
      inferenceStyle: "conditional",
      examWeights: {
        ssc: 1.0,
        ibps: 1.1,
      },
    },
    realizationHints: {
      wordingBias: {
        balanced: 0.75,
      },
      explanationStyle: [
        "tense-pronoun backshift",
      ],
      distractorHints: [
        "pronoun backshift miss",
        "tense retention trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "conditional",
        "multi-step",
      ],
      ruleTags: [
        "narration",
        "reported speech",
      ],
    },
    triggerPatterns: [
      "direct-to-indirect speech with tense and pronoun shifts",
    ],
    ambiguityTags: [
      "speech shift",
    ],
    commonDistractors: [
      "no-backshift lure",
      "wrong reporting verb construction",
    ],
    generationStrategy: [
      "change statement, question, or command into reported speech with one or two controlled shifts",
    ],
    distractorStrategies: [
      "retain original pronoun",
      "retain original tense without exception",
    ],
    difficultyTuning: {
      medium: [
        "simple statement conversion",
      ],
      hard: [
        "question or command conversion with pronoun shift",
      ],
    },
    validationRules: [
      "single correct indirect form",
    ],
    diversityTags: [
      "narration-core",
    ],
    rotationGroup:
      "english-narration-core",
  }),
  defineEnglishMotif({
    id: "object-focus-transform",
    domain: "english",
    subdomain: "grammar",
    archetype: "grammar-correction",
    difficultyProfile: {
      supportedDifficultyBands: [
        "Easy",
        "Medium",
        "Hard",
      ],
      reasoningDepthRange: [2, 4],
      inferenceStyle: "direct",
      examWeights: {
        ssc: 1.2,
        ibps: 1.0,
      },
    },
    realizationHints: {
      wordingBias: {
        concise: 0.6,
        balanced: 0.8,
      },
      explanationStyle: [
        "active-passive transformation",
      ],
      distractorHints: [
        "wrong auxiliary",
        "tense-carryover trap",
      ],
    },
    generationRules: {
      compatiblePatternTypes: [
        "logic",
      ],
      supportedReasoningTypes: [
        "direct",
        "conditional",
      ],
      ruleTags: [
        "active-passive",
      ],
    },
    triggerPatterns: [
      "object-led passive with tense preservation",
    ],
    ambiguityTags: [
      "voice",
    ],
    commonDistractors: [
      "auxiliary mismatch",
      "past-participle miss",
    ],
    generationStrategy: [
      "convert active to passive while preserving tense, aspect, and agent handling",
    ],
    distractorStrategies: [
      "use correct passive frame with wrong tense",
      "keep main verb in active form",
    ],
    difficultyTuning: {
      easy: [
        "simple present or past",
      ],
      medium: [
        "continuous or perfect tense",
      ],
      hard: [
        "modal or imperative passive",
      ],
    },
    validationRules: [
      "one correct transformed sentence",
    ],
    diversityTags: [
      "voice-transform",
    ],
    rotationGroup:
      "english-voice-core",
  }),
];
