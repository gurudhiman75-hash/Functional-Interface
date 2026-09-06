import type { Com002SourceAuthority } from "./com002-source-manifest";

/**
 * Government curriculum/reference authorities used to close the exact OS-type
 * object families discovered for SSC/Banking awareness questions.
 */
export const COM002_SOURCE_AUTHORITY_EXTENSION2: Com002SourceAuthority[] = [
  {
    sourceId: "CBSE-ACADEMICS-OS-TYPES",
    title: "CBSE Academics FAQ — Operating System coverage",
    url: "https://cbseacademic.nic.in/FAQ.html",
    authorityClass: "OFFICIAL_CURRICULUM",
    supports: [
      "os-type-classification",
      "single-user-os",
      "multi-user-os",
      "real-time-os",
      "time-sharing-os",
      "multitasking-os",
      "multiprocessing-os",
      "os-basic-functions",
    ],
    verifiedOn: "2026-08-26",
    notes: [
      "CBSE explicitly lists Single User, Multi User, Real Time, Time Sharing, Multitasking and Multiprocessing as the intended OS-type awareness coverage.",
      "Use as a scope/type authority; use more detailed government/technical references for precise property wording where needed.",
    ],
  },
  {
    sourceId: "ODISHA-SCTEVT-OS-TYPES-2025",
    title: "Directorate of Technical Education & Training, Odisha — Types of Operating System",
    url: "https://sctevt.odisha.gov.in/public/uploads/elearning/files_1509193872_1655.pdf",
    authorityClass: "GOVERNMENT_REFERENCE",
    supports: [
      "os-type-classification",
      "real-time-os-property",
      "multi-user-os-property",
      "multitasking-os-property",
      "single-tasking-os-property",
      "distributed-os-property",
    ],
    verifiedOn: "2026-08-26",
    notes: [
      "Provides awareness-level definitions for real-time, multi-user, multitasking/single-tasking and distributed operating systems.",
      "Use the durable conceptual distinctions only; do not copy dated product examples as canonical truth.",
    ],
  },
];

export function auditCom002SourceAuthorityExtension2() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const source of COM002_SOURCE_AUTHORITY_EXTENSION2) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (!["OFFICIAL_CURRICULUM", "GOVERNMENT_REFERENCE"].includes(source.authorityClass)) {
      issues.push(`UNEXPECTED_AUTHORITY_CLASS:${source.sourceId}:${source.authorityClass}`);
    }
    if (!source.url.startsWith("https://")) issues.push(`NON_HTTPS_SOURCE:${source.sourceId}`);
    if (source.supports.length === 0) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
  }
  return {
    valid: issues.length === 0,
    sourceCount: COM002_SOURCE_AUTHORITY_EXTENSION2.length,
    supportScopes: [...new Set(COM002_SOURCE_AUTHORITY_EXTENSION2.flatMap((source) => source.supports))].sort(),
    issues,
  };
}
