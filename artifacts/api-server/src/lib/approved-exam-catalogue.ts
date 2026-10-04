import { randomUUID } from "node:crypto";

import { sqlClient } from "./db";
import { logger } from "./logger";

export type ApprovedExam = {
  family: "SSC" | "BANKING" | "PUNJAB";
  code: string;
  name: string;
  description: string;
};

export const APPROVED_EXAMS: readonly ApprovedExam[] = [
  { family: "SSC", code: "SSC_CGL", name: "SSC CGL", description: "SSC Combined Graduate Level exam preparation and test series." },
  { family: "SSC", code: "SSC_CHSL", name: "SSC CHSL", description: "SSC Combined Higher Secondary Level exam preparation and test series." },
  { family: "SSC", code: "SSC_MTS", name: "SSC MTS", description: "SSC MTS and Havaldar exam preparation and test series." },
  { family: "SSC", code: "SSC_CPO", name: "SSC CPO", description: "SSC CPO Sub-Inspector exam preparation and test series." },
  { family: "SSC", code: "SSC_GD", name: "SSC GD Constable", description: "SSC GD Constable exam preparation and test series." },
  { family: "SSC", code: "SSC_STENOGRAPHER", name: "SSC Stenographer Grade C & D", description: "SSC Stenographer Grade C and D exam preparation and test series." },
  { family: "SSC", code: "SSC_SELECTION_POST", name: "SSC Selection Post", description: "Staff Selection Commission Selection Post exam preparation and test series." },
  { family: "SSC", code: "SSC_JE", name: "SSC JE", description: "SSC Junior Engineer exam preparation and test series." },

  { family: "BANKING", code: "IBPS_PO", name: "IBPS PO", description: "IBPS Probationary Officer exam preparation and test series." },
  { family: "BANKING", code: "IBPS_CLERK", name: "IBPS Clerk / CSA", description: "IBPS Clerk / Customer Service Associate exam preparation and test series." },
  { family: "BANKING", code: "IBPS_RRB_PO", name: "IBPS RRB Officer Scale I", description: "IBPS RRB Officer Scale I exam preparation and test series." },
  { family: "BANKING", code: "IBPS_RRB_CLERK", name: "IBPS RRB Office Assistant", description: "IBPS RRB Office Assistant exam preparation and test series." },
  { family: "BANKING", code: "SBI_PO", name: "SBI PO", description: "State Bank of India Probationary Officer exam preparation and test series." },
  { family: "BANKING", code: "SBI_CLERK", name: "SBI Clerk / Junior Associate", description: "SBI Junior Associate / Clerk exam preparation and test series." },
  { family: "BANKING", code: "RBI_ASSISTANT", name: "RBI Assistant", description: "Reserve Bank of India Assistant exam preparation and test series." },
  { family: "BANKING", code: "RBI_GRADE_B", name: "RBI Grade B", description: "Reserve Bank of India Grade B exam preparation and test series." },
  { family: "BANKING", code: "NABARD_GRADE_A", name: "NABARD Grade A", description: "NABARD Grade A exam preparation and test series." },
  { family: "BANKING", code: "SEBI_GRADE_A", name: "SEBI Grade A", description: "SEBI Grade A exam preparation and test series." },

  { family: "PUNJAB", code: "PUNJAB_POLICE_CONSTABLE", name: "Punjab Police Constable", description: "Punjab Police Constable exam preparation and test series." },
  { family: "PUNJAB", code: "PUNJAB_POLICE_SI", name: "Punjab Police Sub-Inspector", description: "Punjab Police Sub-Inspector exam preparation and test series." },
  { family: "PUNJAB", code: "PSSSB_CLERK", name: "PSSSB Clerk / Junior Assistant", description: "PSSSB Clerk and Junior Assistant exam preparation and test series." },
  { family: "PUNJAB", code: "PUNJAB_PATWARI", name: "Punjab Patwari", description: "Punjab Patwari exam preparation and test series." },
  { family: "PUNJAB", code: "PSSSB_EXCISE_TAXATION_INSPECTOR", name: "PSSSB Excise & Taxation Inspector", description: "Punjab Excise and Taxation Inspector exam preparation and test series." },
  { family: "PUNJAB", code: "PUNJAB_NAIB_TEHSILDAR", name: "Punjab Naib Tehsildar", description: "Punjab Naib Tehsildar exam preparation and test series." },
  { family: "PUNJAB", code: "PUNJAB_PCS", name: "PPSC Punjab State Civil Services", description: "Punjab State Civil Services exam preparation and test series." },
  { family: "PUNJAB", code: "PSSSB_SENIOR_ASSISTANT", name: "PSSSB Senior Assistant", description: "PSSSB Senior Assistant exam preparation and test series." },
  { family: "PUNJAB", code: "PSSSB_VDO", name: "PSSSB VDO / Gram Sevak", description: "PSSSB VDO / Gram Sevak exam preparation and test series." },
  { family: "PUNJAB", code: "PUNJAB_JAIL_WARDER", name: "Punjab Jail Warder / Matron", description: "Punjab Jail Warder / Matron exam preparation and test series." },
  { family: "PUNJAB", code: "PUNJAB_POLICE_INTELLIGENCE_ASSISTANT", name: "Punjab Police Intelligence Assistant", description: "Punjab Police Intelligence Assistant exam preparation and test series." },
  { family: "PUNJAB", code: "PSPCL_ALM", name: "PSPCL Assistant Lineman", description: "PSPCL Assistant Lineman exam preparation and test series." },
  { family: "PUNJAB", code: "PSPCL_REVENUE_ACCOUNTANT", name: "PSPCL Revenue Accountant", description: "PSPCL Revenue Accountant exam preparation and test series." },
];

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function classifyFamily(code: unknown, name: unknown): ApprovedExam["family"] | null {
  const haystack = normalize(code) + " " + normalize(name);
  if (/\bssc\b|staff selection/.test(haystack)) return "SSC";
  if (/bank|ibps|sbi|rbi/.test(haystack)) return "BANKING";
  if (/punjab|psssb|ppsc|pspcl/.test(haystack)) return "PUNJAB";
  return null;
}

export async function ensureApprovedExamCatalogue(): Promise<{ inserted: number; skipped: number }> {
  const families = await sqlClient`
    SELECT id::text AS id, code, name
    FROM catalog.exam_families
    WHERE is_active = true
  `;

  const familyIds = new Map<ApprovedExam["family"], string>();
  for (const family of families) {
    const key = classifyFamily(family.code, family.name);
    if (key && !familyIds.has(key)) familyIds.set(key, String(family.id));
  }

  let inserted = 0;
  let skipped = 0;

  await sqlClient.begin(async (tx) => {
    for (const exam of APPROVED_EXAMS) {
      const familyId = familyIds.get(exam.family);
      if (!familyId) {
        skipped += 1;
        logger.warn({ family: exam.family, examCode: exam.code }, "Approved exam catalogue family is unavailable");
        continue;
      }

      const existing = await tx`
        SELECT id::text AS id
        FROM catalog.exams
        WHERE upper(code) = ${exam.code}
           OR lower(name) = lower(${exam.name})
        LIMIT 1
      `;
      if (existing[0]) {
        skipped += 1;
        continue;
      }

      await tx`
        INSERT INTO catalog.exams (
          id, family_id, code, name, description, is_active
        ) VALUES (
          ${randomUUID()}::uuid,
          ${familyId}::uuid,
          ${exam.code},
          ${exam.name},
          ${exam.description},
          true
        )
      `;
      inserted += 1;
    }
  });

  logger.info({ inserted, skipped, total: APPROVED_EXAMS.length }, "Approved exam catalogue ensured");
  return { inserted, skipped };
}
