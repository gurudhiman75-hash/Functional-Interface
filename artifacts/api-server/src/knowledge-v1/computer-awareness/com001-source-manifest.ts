export type Com001SourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  authorityClass: "OFFICIAL_EXAM" | "STANDARD" | "VENDOR_TECHNICAL" | "REFERENCE";
  supports: string[];
  verifiedOn: string;
  notes: string[];
};

/**
 * Source authorities approved for COM-001 discovery/corpus verification.
 *
 * This is not a scraper list and does not make any source text automatically
 * generation-eligible. Editors still create/review canonical facts one fact at
 * a time. The manifest only records which sources may support which relation
 * families and the caveats discovered during source review.
 */
export const COM001_SOURCE_AUTHORITIES: Com001SourceAuthority[] = [
  {
    sourceId: "SSC-CGL-2026-NOTICE",
    title: "SSC Combined Graduate Level Examination 2026 notice",
    url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
    authorityClass: "OFFICIAL_EXAM",
    supports: [
      "scope:computer-memory",
      "scope:memory-organization",
      "scope:backup-devices",
      "scope:computer-basics",
    ],
    verifiedOn: "2026-08-23",
    notes: [
      "Primary ownership anchor for SSC CGL Computer Knowledge Test scope.",
      "Use syllabus wording to justify topic ownership, not as the factual source for every memory property.",
    ],
  },
  {
    sourceId: "NIST-CSRC-BYTE",
    title: "NIST CSRC Glossary — Byte",
    url: "https://csrc.nist.gov/glossary/term/byte",
    authorityClass: "STANDARD",
    supports: ["capacity-unit-relationship", "byte-definition"],
    verifiedOn: "2026-08-23",
    notes: ["Use for the durable relation 1 byte = 8 bits."],
  },
  {
    sourceId: "NIST-BINARY-PREFIXES",
    title: "NIST — Definitions of SI units: binary prefixes",
    url: "https://www.physics.nist.gov/cuu/Units/binary.html",
    authorityClass: "STANDARD",
    supports: ["capacity-unit-relationship", "binary-prefix-convention"],
    verifiedOn: "2026-08-23",
    notes: [
      "Use KiB/MiB/GiB/TiB for unambiguous powers-of-two relations.",
      "Do not silently equate MB with MiB or GB with GiB.",
    ],
  },
  {
    sourceId: "IEC-80000-13-2025",
    title: "IEC 80000-13:2025 — Quantities and units, information science and technology",
    url: "https://webstore.iec.ch/en/publication/87379",
    authorityClass: "STANDARD",
    supports: ["capacity-unit-relationship", "binary-prefix-convention"],
    verifiedOn: "2026-08-23",
    notes: [
      "Current standards authority for information-science quantities and units.",
      "The public landing page establishes the standard; detailed fact encoding should use accessible authoritative definitions where required.",
    ],
  },
  {
    sourceId: "INTEL-EMBEDDED-MEMORY-ARCH",
    title: "Intel — Embedded Systems, Memory Architectures",
    url: "https://www.intel.com/content/dam/www/public/us/en/documents/training/leeseshia-embedded-systems-intro.pdf",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["volatility", "sram-dram-characteristics", "memory-architecture"],
    verifiedOn: "2026-08-23",
    notes: [
      "Supports SRAM and DRAM as volatile memory and DRAM refresh behavior.",
      "Older publication, but the targeted foundational semiconductor-memory properties are durable.",
    ],
  },
  {
    sourceId: "INTEL-PERSISTENT-MEMORY-VOLATILE-TIERS",
    title: "Intel — Volatile Use of Persistent Memory",
    url: "https://www.intel.com/content/www/us/en/developer/articles/technical/volatile-use-of-persistent-memory.html",
    authorityClass: "VENDOR_TECHNICAL",
    supports: [
      "volatility",
      "cache-register-volatility",
      "memory-storage-hierarchy",
      "dram-low-latency-tier",
    ],
    verifiedOn: "2026-08-23",
    notes: [
      "Explicitly distinguishes volatile DRAM/cache/register state from persistent memory/storage concepts.",
      "Use only broad durable hierarchy/volatility facts; do not promote workload-specific performance claims into timeless exam facts.",
    ],
  },
  {
    sourceId: "MICROCHIP-MEMORY-VOLATILITY-GLOSSARY",
    title: "Microchip Technology — Security Glossary: Volatile",
    url: "https://onlinedocs.microchip.com/oxy/GUID-DF33D7C4-5604-4C6B-92AF-8C864323C016-en-US-14/GUID-522AFF78-464A-44A4-8A56-DCB901070E40.html",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["volatility", "sram-dram-characteristics", "flash-nonvolatile", "eeprom-nonvolatile"],
    verifiedOn: "2026-08-23",
    notes: [
      "Explicitly classifies SRAM and DRAM as volatile and flash/EEPROM as nonvolatile.",
      "Strong cross-check for the volatility learner task.",
    ],
  },
  {
    sourceId: "KINGSTON-COMPUTER-MEMORY",
    title: "Kingston Technology — What is Computer Memory?",
    url: "https://www.kingston.com/en/blog/pc-performance/what-is-computer-memory",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["volatility", "ram-expansion", "dram-main-memory", "memory-function"],
    verifiedOn: "2026-08-23",
    notes: [
      "Useful secondary technical reference for RAM/DRAM and volatility.",
      "Do not use product-generation marketing claims as timeless exam facts.",
    ],
  },
  {
    sourceId: "TECHTARGET-ROM-2025",
    title: "TechTarget — What is Read-Only Memory (ROM)?",
    url: "https://www.techtarget.com/whatis/definition/read-only-memory-ROM",
    authorityClass: "REFERENCE",
    supports: ["rom-nonvolatile", "rom-function", "rom-subtypes", "prom-eprom-eeprom-expansion"],
    verifiedOn: "2026-08-23",
    notes: [
      "Use for durable ROM-family definitions and subtype expansions.",
      "Avoid hardware-size or product-specific capacity examples that can age.",
    ],
  },
  {
    sourceId: "IBM-EEPROM-2026",
    title: "IBM — What is EEPROM?",
    url: "https://www.ibm.com/think/topics/eeprom",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["eeprom-nonvolatile", "eeprom-expansion", "rom-subtypes"],
    verifiedOn: "2026-08-23",
    notes: [
      "Updated July 2026; explicitly defines EEPROM as nonvolatile and part of the ROM family.",
    ],
  },
  {
    sourceId: "IBM-DATA-STORAGE-2026",
    title: "IBM — What is data storage?",
    url: "https://www.ibm.com/think/topics/data-storage",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["secondary-storage", "storage-medium", "hdd-ssd-usb-optical-tape", "backup-storage-role"],
    verifiedOn: "2026-08-23",
    notes: [
      "Updated July 2026 and useful for durable storage-medium/device classification.",
      "Prefer explicit device/medium facts; avoid converting broad enterprise architecture prose into exam facts.",
    ],
  },
  {
    sourceId: "IBM-FLASH-VS-SSD-2025",
    title: "IBM — Flash versus SSD storage",
    url: "https://www.ibm.com/think/topics/flash-vs-ssd-storage",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["storage-medium", "flash-nonvolatile", "ssd-flash-relation", "ssd-no-moving-parts"],
    verifiedOn: "2026-08-23",
    notes: ["Use to distinguish flash technology from the SSD device category."],
  },
  {
    sourceId: "MICROSOFT-PAGEFILE-2026",
    title: "Microsoft Learn — Introduction to the page file",
    url: "https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["virtual-memory-concept", "pagefile", "physical-extension-of-ram"],
    verifiedOn: "2026-08-23",
    notes: [
      "Use for Windows page-file/virtual-memory statements only.",
      "Do not generalize Windows implementation details into universal OS definitions without another source.",
    ],
  },
  {
    sourceId: "MICROSOFT-VIRTUAL-ADDRESS-PHYSICAL-STORAGE",
    title: "Microsoft Learn — Virtual Address Space and Physical Storage",
    url: "https://learn.microsoft.com/en-us/windows/win32/memory/virtual-address-space-and-physical-storage",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["virtual-memory-concept", "paging-to-disk"],
    verifiedOn: "2026-08-23",
    notes: [
      "Supports the limited awareness-level statement that Windows can move memory pages between physical memory and a paging file on disk.",
    ],
  },
];

/**
 * Sources reviewed but deliberately excluded from canonical fact authority.
 */
export const COM001_SOURCE_REJECTIONS = [
  {
    sourceId: "IBM-PRIMARY-VS-SECONDARY-STORAGE",
    url: "https://www.ibm.com/think/topics/primary-vs-secondary-storage",
    reason:
      "A reviewed indexed version exposed an internally incorrect DRAM-volatility statement. Do not use this page as COM-001 authority unless it is explicitly re-reviewed and the source-version discrepancy is resolved.",
    reviewedOn: "2026-08-23",
  },
] as const;

export function auditCom001SourceManifest() {
  const issues: string[] = [];
  const sourceIds = new Set<string>();
  const urls = new Set<string>();

  for (const source of COM001_SOURCE_AUTHORITIES) {
    if (sourceIds.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    sourceIds.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (!/^https:\/\//.test(source.url)) issues.push(`NON_HTTPS_SOURCE:${source.sourceId}`);
    if (source.supports.length === 0) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.verifiedOn)) {
      issues.push(`INVALID_VERIFIED_DATE:${source.sourceId}`);
    }
  }

  for (const rejection of COM001_SOURCE_REJECTIONS) {
    if (sourceIds.has(rejection.sourceId)) {
      issues.push(`REJECTED_SOURCE_IS_AUTHORITY:${rejection.sourceId}`);
    }
  }

  return {
    valid: issues.length === 0,
    authorityCount: COM001_SOURCE_AUTHORITIES.length,
    rejectionCount: COM001_SOURCE_REJECTIONS.length,
    supportScopes: [
      ...new Set(COM001_SOURCE_AUTHORITIES.flatMap((source) => source.supports)),
    ].sort(),
    issues,
  };
}
