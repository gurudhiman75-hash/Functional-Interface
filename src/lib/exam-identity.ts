export type ExamIdentity = {
  label: string;
  asset?: string;
  layout?: "crest";
};

/** Resolve the recruiting body before broad family words such as RRB or police. */
export function resolveExamIdentity({ name, examCode, familyCode }: {
  name: string; examCode?: string; familyCode?: string;
}): ExamIdentity | undefined {
  const text = [examCode, name].filter(Boolean).join(" ").toUpperCase().replace(/[^A-Z0-9]+/g, " ");
  const family = String(familyCode ?? "").toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();
  for (const [label, asset] of [
    ["SBI", "sbi-library-official.png"],
    ["IBPS", "ibps-library-official.png"],
    ["RBI", "rbi-library-official.png"],
  ]) {
    if (new RegExp(`\\b${label}\\b`).test(text) || (label === "RBI" && /RESERVE BANK/.test(text))) {
      return { label, asset: `category-icons/${asset}` };
    }
  }
  // Named regulators and insurers get readable custom badges, never another body's logo.
  for (const label of ["NABARD", "SEBI", "SIDBI", "IRDAI", "NIACL", "UIIC", "OICL", "NICL", "LIC", "EPFO", "ESIC", "UPSC", "NTA", "CTET"]) {
    if (new RegExp(`\\b${label}\\b`).test(text)) return { label };
  }
  if (/\bSSC\b|STAFF SELECTION COMMISSION/.test(text) || family === "SSC") return { label: "SSC", asset: "category-icons/ssc-library-official.png" };
  if (/RAILWAY|\bRRB\b|\bRPF\b/.test(text) || /^(RAILWAY|RAILWAYS)$/.test(family)) return { label: "Railways", asset: "category-icons/railways-library-official.png" };
  if (/PUNJAB POLICE/.test(text)) return { label: "Punjab Police", asset: "images/exam-authorities/punjab-police-header.png", layout: "crest" };
  if (/\bPSPCL\b/.test(text)) return { label: "PSPCL", asset: "images/exam-authorities/pspcl.png" };
  if (/\bPSSSB\b|PUNJAB PATWARI/.test(text)) return { label: "PSSSB" };
  if (/\bPPSC\b|PUNJAB PCS|PUNJAB STATE CIVIL|NAIB TEHSILDAR/.test(text)) return { label: "PPSC" };
  if (/PUNJAB/.test(text) || family === "PUNJAB") return { label: "Punjab", asset: "category-icons/punjab-official.svg" };
  if (/BANK/.test(text) || /BANK/.test(family)) return { label: "BANK" };
  if (/INSURANCE/.test(text) || /INSURANCE/.test(family)) return { label: "INSURE" };
  if (/TEACH|EDUCATION/.test(text) || /TEACH|EDUCATION/.test(family)) return { label: "TEACH" };
  return undefined;
}
