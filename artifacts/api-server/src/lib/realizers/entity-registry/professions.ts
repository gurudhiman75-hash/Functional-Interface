import type { RealizerLanguage } from "../types";

export type ProfessionEntity = {
  id: string;
  display: Record<RealizerLanguage, string>;
};

export const PROFESSIONS: ProfessionEntity[] = [
  {
    id: "doctor",
    display: { en: "Doctor", hi: "डॉक्टर", pa: "ਡਾਕਟਰ" },
  },
  {
    id: "teacher",
    display: { en: "Teacher", hi: "शिक्षक", pa: "ਅਧਿਆਪਕ" },
  },
  {
    id: "engineer",
    display: { en: "Engineer", hi: "इंजीनियर", pa: "ਇੰਜੀਨੀਅਰ" },
  },
  {
    id: "lawyer",
    display: { en: "Lawyer", hi: "वकील", pa: "ਵਕੀਲ" },
  },
];
