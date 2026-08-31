import { TRG_001_POST_FINAL5_FREEZE_READINESS } from "./post-final5-freeze-readiness";

export const TRG_001_POST_FINAL5_HUMAN_REVIEW_PACKET_V1 = Object.freeze({
  packetVersion: "TRG001_POST_FINAL5_HUMAN_REVIEW_PACKET_V1" as const,
  packageId: "TRG-001" as const,
  candidate: TRG_001_POST_FINAL5_FREEZE_READINESS.candidate,
  evidence: TRG_001_POST_FINAL5_FREEZE_READINESS.evidence,
  scope: {
    englishChangedQlIds: ["TRG-001-QL-093"] as const,
    localizedChangedQlIds: [
      "TRG-001-QL-069",
      "TRG-001-QL-093",
      "TRG-001-QL-098",
      "TRG-001-QL-100",
      "TRG-001-QL-113",
      "TRG-001-QL-114",
      "TRG-001-QL-115",
      "TRG-001-QL-142",
    ] as const,
    localizedChangedSurfaces: 15 as const,
  },
  englishChange: {
    qlId: "TRG-001-QL-093" as const,
    reviewSeed: "trg001-final5-review-TRG-001-QL-093" as const,
    field: "explanation.traps[0]" as const,
    issue: "Learner-facing unresolved template placeholder in the previously frozen English explanation trap." as const,
    before: "Convert 1 to a fraction with denominator ${t.h} before combining." as const,
    after: "Write 1 as a fraction with the same denominator before combining." as const,
  },
  localizedChanges: [
    {
      qlId: "TRG-001-QL-069" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-069" as const,
      issue: "Punjabi shortcut/first step retained broken machine-order wording." as const,
      locales: {
        "pa-IN": [
          {
            field: "explanation.shortcut" as const,
            before: "ਕੋਣ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ, ਕੋਸਾਈਨ ਦਾ ਚਿੰਨ੍ਹ, ਫਿਰ ਪਰਸਪਰ ਲਓ ਲਾਗੂ ਕਰੋ।" as const,
            after: "ਕੋਣ ਨੂੰ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ, cos ਦਾ ਸਹੀ ਚਿੰਨ੍ਹ ਲਗਾਓ ਅਤੇ ਫਿਰ ਪਰਸਪਰ ਲਓ।" as const,
          },
          {
            field: "explanation.steps[0].body" as const,
            before: "ਕੋਣ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ, ਕੋਸਾਈਨ ਦਾ ਚਿੰਨ੍ਹ, ਫਿਰ ਪਰਸਪਰ ਲਓ ਲਾਗੂ ਕਰੋ।" as const,
            after: "ਕੋਣ ਨੂੰ ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ, cos ਦਾ ਸਹੀ ਚਿੰਨ੍ਹ ਲਗਾਓ ਅਤੇ ਫਿਰ ਪਰਸਪਰ ਲਓ।" as const,
          },
        ],
      },
    },
    {
      qlId: "TRG-001-QL-093" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-093" as const,
      issue: "Shortcut reversed the dependency: sine is given and cosine must be reconstructed." as const,
      locales: {
        "hi-IN": [{ field: "explanation.shortcut" as const, before: "cos θ से समकोण त्रिभुज पुनर्निर्मित करें, फिर sin θ का मान रखें।" as const, after: "sin θ के अनुपात से cos θ ज्ञात करें, फिर माँगे गए व्यंजक में मान रखें।" as const }],
        "pa-IN": [{ field: "explanation.shortcut" as const, before: "cos θ ਤੋਂ ਸਮਕੋਣ ਤਿਕੋਣ ਮੁੜ ਬਣਾਓ, ਫਿਰ sin θ ਦਾ ਮਾਨ ਲਗਾਓ।" as const, after: "sin θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ cos θ ਕੱਢੋ, ਫਿਰ ਮੰਗੇ ਗਏ ਵਿਅੰਜਕ ਵਿੱਚ ਮਾਨ ਰੱਖੋ।" as const }],
      },
    },
    {
      qlId: "TRG-001-QL-098" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-098" as const,
      issue: "Shortcut reversed the dependency: tangent is given and secant/cosine must be reconstructed." as const,
      locales: {
        "hi-IN": [{ field: "explanation.shortcut" as const, before: "sec θ और cos θ की सहायता से tan θ पुनर्निर्मित करें।" as const, after: "tan θ के अनुपात से sec θ और cos θ ज्ञात करें।" as const }],
        "pa-IN": [{ field: "explanation.shortcut" as const, before: "sec θ ਅਤੇ cos θ ਦੀ ਮਦਦ ਨਾਲ tan θ ਮੁੜ ਬਣਾਓ।" as const, after: "tan θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ sec θ ਅਤੇ cos θ ਕੱਢੋ।" as const }],
      },
    },
    {
      qlId: "TRG-001-QL-100" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-100" as const,
      issue: "Shortcut placed subtraction before reconstruction from tangent." as const,
      locales: {
        "hi-IN": [{ field: "explanation.shortcut" as const, before: "पहले sin²θ और cos²θ का अंतर निकालें, फिर tan θ का अनुपात बनाएँ।" as const, after: "tan θ के अनुपात से sin θ और cos θ ज्ञात करें, फिर उनके वर्गों को दिए गए क्रम में घटाएँ।" as const }],
        "pa-IN": [{ field: "explanation.shortcut" as const, before: "ਪਹਿਲਾਂ sin²θ ਅਤੇ cos²θ ਦਾ ਅੰਤਰ ਕੱਢੋ, ਫਿਰ tan θ ਦਾ ਅਨੁਪਾਤ ਬਣਾਓ।" as const, after: "tan θ ਦੇ ਅਨੁਪਾਤ ਤੋਂ sin θ ਅਤੇ cos θ ਕੱਢੋ, ਫਿਰ ਉਨ੍ਹਾਂ ਦੇ ਵਰਗ ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ਘਟਾਓ।" as const }],
      },
    },
    {
      qlId: "TRG-001-QL-113" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-113" as const,
      issue: "Generic linear-relation key rule did not match the actual divide-by-cosine solve route." as const,
      locales: {
        "hi-IN": [{ field: "explanation.keyRule" as const, before: "दिए रैखिक sin–cos संबंधों को जोड़कर या घटाकर आवश्यक संयोजन निकालें।" as const, after: "cos θ से भाग देकर tan θ को अलग करें।" as const }],
        "pa-IN": [{ field: "explanation.keyRule" as const, before: "ਦਿੱਤੇ ਰੇਖੀ sin–cos ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜ ਜਾਂ ਘਟਾ ਕੇ ਲੋੜੀਂਦਾ ਸੰਯੋਜਨ ਕੱਢੋ।" as const, after: "cos θ ਨਾਲ ਭਾਗ ਦੇ ਕੇ tan θ ਨੂੰ ਵੱਖ ਕਰੋ।" as const }],
      },
    },
    {
      qlId: "TRG-001-QL-114" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-114" as const,
      issue: "Generic linear-relation key rule did not state the actual sine:cosine ratio route." as const,
      locales: {
        "hi-IN": [{ field: "explanation.keyRule" as const, before: "दिए रैखिक sin–cos संबंधों को जोड़कर या घटाकर आवश्यक संयोजन निकालें।" as const, after: "रैखिक संबंध से sin θ:cos θ का अनुपात निकालें, फिर माँगा गया योग-अंतर अनुपात बनाएँ।" as const }],
        "pa-IN": [{ field: "explanation.keyRule" as const, before: "ਦਿੱਤੇ ਰੇਖੀ sin–cos ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜ ਜਾਂ ਘਟਾ ਕੇ ਲੋੜੀਂਦਾ ਸੰਯੋਜਨ ਕੱਢੋ।" as const, after: "ਰੇਖੀ ਸੰਬੰਧ ਤੋਂ sin θ:cos θ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ, ਫਿਰ ਮੰਗਿਆ ਗਿਆ ਜੋੜ-ਅੰਤਰ ਅਨੁਪਾਤ ਬਣਾਓ।" as const }],
      },
    },
    {
      qlId: "TRG-001-QL-115" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-115" as const,
      issue: "Generic linear-relation key rule did not state the tangent-then-reciprocal route for cotangent." as const,
      locales: {
        "hi-IN": [{ field: "explanation.keyRule" as const, before: "दिए रैखिक sin–cos संबंधों को जोड़कर या घटाकर आवश्यक संयोजन निकालें।" as const, after: "रैखिक संबंध को tan अनुपात में बदलें, फिर cot के लिए व्युत्क्रम लें।" as const }],
        "pa-IN": [{ field: "explanation.keyRule" as const, before: "ਦਿੱਤੇ ਰੇਖੀ sin–cos ਸੰਬੰਧਾਂ ਨੂੰ ਜੋੜ ਜਾਂ ਘਟਾ ਕੇ ਲੋੜੀਂਦਾ ਸੰਯੋਜਨ ਕੱਢੋ।" as const, after: "ਰੇਖੀ ਸੰਬੰਧ ਨੂੰ tan ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ cot ਲਈ ਪਰਸਪਰ ਲਓ।" as const }],
      },
    },
    {
      qlId: "TRG-001-QL-142" as const,
      reviewSeed: "trg001-final5-review-TRG-001-QL-142" as const,
      issue: "Static shortcut used the cosine conjugate even when the generated sec+tan variant requires the sine conjugate." as const,
      locales: {
        "hi-IN": [{ field: "explanation.shortcut" as const, before: "संयुग्मी गुणनफल (1+cosα)(1−cosα)=1−cos²α=sin²α का प्रयोग करें।" as const, after: "संयुग्मी गुणनफल (1+sinα)(1−sinα)=1−sin²α=cos²α का प्रयोग करें।" as const }],
        "pa-IN": [{ field: "explanation.shortcut" as const, before: "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+cosα)(1−cosα)=1−cos²α=sin²α ਵਰਤੋ।" as const, after: "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+sinα)(1−sinα)=1−sin²α=cos²α ਵਰਤੋ।" as const }],
      },
    },
  ] as const,
  ql142VariantReview: {
    secTanSeed: "trg001-final5-review-TRG-001-QL-142" as const,
    cosecCotSeed: "trg001-post-final5-review-TRG-001-QL-142" as const,
    expected: {
      "hi-IN": {
        secTan: "संयुग्मी गुणनफल (1+sinα)(1−sinα)=1−sin²α=cos²α का प्रयोग करें।" as const,
        cosecCot: "संयुग्मी गुणनफल (1+cosα)(1−cosα)=1−cos²α=sin²α का प्रयोग करें।" as const,
      },
      "pa-IN": {
        secTan: "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+sinα)(1−sinα)=1−sin²α=cos²α ਵਰਤੋ।" as const,
        cosecCot: "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ (1+cosα)(1−cosα)=1−cos²α=sin²α ਵਰਤੋ।" as const,
      },
    },
  },
  governance: {
    humanReview: "PENDING" as const,
    packetGrantsApproval: false as const,
    packetGrantsFreeze: false as const,
    packetGrantsActivation: false as const,
    questionStudioEnabled: false as const,
    questionBankWritable: false as const,
    testBuilderEligible: false as const,
    publiclyPublishable: false as const,
    explicitApprovalRecordRequired: true as const,
  },
});

export type Trg001PostFinal5HumanReviewPacketV1 = typeof TRG_001_POST_FINAL5_HUMAN_REVIEW_PACKET_V1;
