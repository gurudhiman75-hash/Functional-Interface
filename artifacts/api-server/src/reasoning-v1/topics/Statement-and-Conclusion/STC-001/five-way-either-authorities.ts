import type { StcScenarioAuthority } from "./types.ts";
import { and, atom, not, or } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_FIVE_WAY_EITHER_AUTHORITIES: readonly StcScenarioAuthority[] = [
  {
    id: "STC-SC-E01",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The committee will either approve the proposal today or reject it today, but it will not do both.",
      "समिति आज प्रस्ताव को या तो स्वीकृत करेगी या अस्वीकार करेगी, लेकिन दोनों नहीं करेगी।",
      "ਕਮੇਟੀ ਅੱਜ ਪ੍ਰਸਤਾਵ ਨੂੰ ਜਾਂ ਮਨਜ਼ੂਰ ਕਰੇਗੀ ਜਾਂ ਰੱਦ ਕਰੇਗੀ, ਪਰ ਦੋਵੇਂ ਨਹੀਂ ਕਰੇਗੀ।",
    ),
    premises: [or(atom("proposal_approved"), atom("proposal_rejected")), not(and(atom("proposal_approved"), atom("proposal_rejected")))],
    candidates: [
      { id: "C1", expression: atom("proposal_approved"), text: t("The proposal will be approved today.", "प्रस्ताव आज स्वीकृत होगा।", "ਪ੍ਰਸਤਾਵ ਅੱਜ ਮਨਜ਼ੂਰ ਹੋਵੇਗਾ।") },
      { id: "C2", expression: atom("proposal_rejected"), text: t("The proposal will be rejected today.", "प्रस्ताव आज अस्वीकार होगा।", "ਪ੍ਰਸਤਾਵ ਅੱਜ ਰੱਦ ਹੋਵੇਗਾ।") },
      { id: "C3", expression: and(atom("proposal_approved"), atom("proposal_rejected")), text: t("The proposal will be both approved and rejected today.", "प्रस्ताव आज स्वीकृत भी होगा और अस्वीकार भी।", "ਪ੍ਰਸਤਾਵ ਅੱਜ ਮਨਜ਼ੂਰ ਵੀ ਹੋਵੇਗਾ ਅਤੇ ਰੱਦ ਵੀ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("meeting_cancelled"), text: t("The committee meeting will be cancelled.", "समिति की बैठक रद्द होगी।", "ਕਮੇਟੀ ਦੀ ਮੀਟਿੰਗ ਰੱਦ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-E02",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The service will either be restored tonight or remain unavailable through the night; both outcomes cannot occur together.",
      "सेवा आज रात या तो बहाल होगी या पूरी रात अनुपलब्ध रहेगी; दोनों स्थितियाँ एक साथ नहीं हो सकतीं।",
      "ਸੇਵਾ ਅੱਜ ਰਾਤ ਜਾਂ ਤਾਂ ਮੁੜ ਚਾਲੂ ਹੋਵੇਗੀ ਜਾਂ ਸਾਰੀ ਰਾਤ ਉਪਲਬਧ ਨਹੀਂ ਰਹੇਗੀ; ਦੋਵੇਂ ਸਥਿਤੀਆਂ ਇਕੱਠੀਆਂ ਨਹੀਂ ਹੋ ਸਕਦੀਆਂ।",
    ),
    premises: [or(atom("service_restored"), atom("service_unavailable")), not(and(atom("service_restored"), atom("service_unavailable")))],
    candidates: [
      { id: "C1", expression: atom("service_restored"), text: t("The service will be restored tonight.", "सेवा आज रात बहाल होगी।", "ਸੇਵਾ ਅੱਜ ਰਾਤ ਮੁੜ ਚਾਲੂ ਹੋਵੇਗੀ।") },
      { id: "C2", expression: atom("service_unavailable"), text: t("The service will remain unavailable through the night.", "सेवा पूरी रात अनुपलब्ध रहेगी।", "ਸੇਵਾ ਸਾਰੀ ਰਾਤ ਉਪਲਬਧ ਨਹੀਂ ਰਹੇਗੀ।") },
      { id: "C3", expression: and(atom("service_restored"), atom("service_unavailable")), text: t("The service will be restored and unavailable at the same time.", "सेवा एक ही समय पर बहाल भी होगी और अनुपलब्ध भी।", "ਸੇਵਾ ਇੱਕੋ ਸਮੇਂ ਮੁੜ ਚਾਲੂ ਵੀ ਹੋਵੇਗੀ ਅਤੇ ਉਪਲਬਧ ਵੀ ਨਹੀਂ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("service_free"), text: t("The service will become free of charge.", "सेवा निःशुल्क हो जाएगी।", "ਸੇਵਾ ਮੁਫ਼ਤ ਹੋ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-E03",
    qlId: "STC-QL-002",
    difficulty: "HARD",
    statement: t(
      "After scrutiny, the claim will either move to payment processing or be returned for correction, and exactly one of these outcomes will occur.",
      "जाँच के बाद दावा या तो भुगतान प्रक्रिया में जाएगा या सुधार के लिए लौटाया जाएगा, और इन दोनों में से केवल एक स्थिति होगी।",
      "ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਦਾਅਵਾ ਜਾਂ ਤਾਂ ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਵੱਲ ਜਾਵੇਗਾ ਜਾਂ ਸੋਧ ਲਈ ਵਾਪਸ ਕੀਤਾ ਜਾਵੇਗਾ, ਅਤੇ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੇਵਲ ਇੱਕ ਨਤੀਜਾ ਹੋਵੇਗਾ।",
    ),
    premises: [or(atom("claim_payment"), atom("claim_correction")), not(and(atom("claim_payment"), atom("claim_correction")))],
    candidates: [
      { id: "C1", expression: atom("claim_payment"), text: t("The claim will move to payment processing.", "दावा भुगतान प्रक्रिया में जाएगा।", "ਦਾਅਵਾ ਭੁਗਤਾਨ ਪ੍ਰਕਿਰਿਆ ਵੱਲ ਜਾਵੇਗਾ।") },
      { id: "C2", expression: atom("claim_correction"), text: t("The claim will be returned for correction.", "दावा सुधार के लिए लौटाया जाएगा।", "ਦਾਅਵਾ ਸੋਧ ਲਈ ਵਾਪਸ ਕੀਤਾ ਜਾਵੇਗਾ।") },
      { id: "C3", expression: and(atom("claim_payment"), atom("claim_correction")), text: t("Both stated outcomes will occur for the claim.", "दावे के लिए बताई गई दोनों स्थितियाँ होंगी।", "ਦਾਅਵੇ ਲਈ ਦੱਸੇ ਦੋਵੇਂ ਨਤੀਜੇ ਹੋਣਗੇ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("claim_withdrawn"), text: t("The claim will be withdrawn.", "दावा वापस ले लिया जाएगा।", "ਦਾਅਵਾ ਵਾਪਸ ਲਿਆ ਜਾਵੇਗਾ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
