import type { StcScenarioAuthority } from "./types.ts";
import { and, atom, not } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_CP001_COVERAGE_AUTHORITIES: readonly StcScenarioAuthority[] = [
  {
    id: "STC-SC-007",
    qlId: "STC-QL-001",
    difficulty: "EASY",
    statement: t(
      "The examination hall opens at 8:30 a.m.",
      "परीक्षा कक्ष सुबह 8:30 बजे खुलता है।",
      "ਪਰੀਖਿਆ ਹਾਲ ਸਵੇਰੇ 8:30 ਵਜੇ ਖੁੱਲ੍ਹਦਾ ਹੈ।",
    ),
    premises: [atom("hall_opens_830")],
    candidates: [
      { id: "C1", expression: atom("hall_opens_830"), text: t("The examination hall opens at 8:30 a.m.", "परीक्षा कक्ष सुबह 8:30 बजे खुलता है।", "ਪਰੀਖਿਆ ਹਾਲ ਸਵੇਰੇ 8:30 ਵਜੇ ਖੁੱਲ੍ਹਦਾ ਹੈ।") },
      { id: "C2", expression: atom("hall_opens_830"), text: t("8:30 a.m. is the opening time of the examination hall.", "सुबह 8:30 बजे परीक्षा कक्ष खुलने का समय है।", "ਸਵੇਰੇ 8:30 ਵਜੇ ਪਰੀਖਿਆ ਹਾਲ ਖੁੱਲ੍ਹਣ ਦਾ ਸਮਾਂ ਹੈ।") },
      { id: "C3", expression: not(atom("hall_opens_830")), text: t("The examination hall does not open at 8:30 a.m.", "परीक्षा कक्ष सुबह 8:30 बजे नहीं खुलता।", "ਪਰੀਖਿਆ ਹਾਲ ਸਵੇਰੇ 8:30 ਵਜੇ ਨਹੀਂ ਖੁੱਲ੍ਹਦਾ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("hall_closes_5"), text: t("The examination hall closes at 5 p.m.", "परीक्षा कक्ष शाम 5 बजे बंद होता है।", "ਪਰੀਖਿਆ ਹਾਲ ਸ਼ਾਮ 5 ਵਜੇ ਬੰਦ ਹੁੰਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-008",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The notice is displayed at the main gate and on the official website.",
      "सूचना मुख्य द्वार पर और आधिकारिक वेबसाइट पर प्रदर्शित की गई है।",
      "ਸੂਚਨਾ ਮੁੱਖ ਗੇਟ ਤੇ ਅਤੇ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਤੇ ਲਗਾਈ ਗਈ ਹੈ।",
    ),
    premises: [and(atom("notice_main_gate"), atom("notice_website"))],
    candidates: [
      { id: "C1", expression: atom("notice_main_gate"), text: t("The notice is displayed at the main gate.", "सूचना मुख्य द्वार पर प्रदर्शित है।", "ਸੂਚਨਾ ਮੁੱਖ ਗੇਟ ਤੇ ਲਗਾਈ ਗਈ ਹੈ।") },
      { id: "C2", expression: atom("notice_website"), text: t("The notice is displayed on the official website.", "सूचना आधिकारिक वेबसाइट पर प्रदर्शित है।", "ਸੂਚਨਾ ਅਧਿਕਾਰਕ ਵੈੱਬਸਾਈਟ ਤੇ ਲਗਾਈ ਗਈ ਹੈ।") },
      { id: "C3", expression: not(atom("notice_main_gate")), text: t("The notice is not displayed at the main gate.", "सूचना मुख्य द्वार पर प्रदर्शित नहीं है।", "ਸੂਚਨਾ ਮੁੱਖ ਗੇਟ ਤੇ ਨਹੀਂ ਲਗਾਈ ਗਈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("notice_newspaper"), text: t("The notice is published in a newspaper.", "सूचना समाचार पत्र में प्रकाशित की गई है।", "ਸੂਚਨਾ ਅਖ਼ਬਾਰ ਵਿੱਚ ਪ੍ਰਕਾਸ਼ਿਤ ਕੀਤੀ ਗਈ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
