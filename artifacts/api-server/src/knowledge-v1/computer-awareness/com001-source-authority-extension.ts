import {
  COM001_SOURCE_AUTHORITIES,
  type Com001SourceAuthority,
} from "./com001-source-manifest";

export const COM001_ADDITIONAL_SOURCE_AUTHORITIES: Com001SourceAuthority[] = [
  {
    sourceId: "NIST-CSRC-BIT",
    title: "NIST CSRC Glossary — bit",
    url: "https://csrc.nist.gov/glossary/term/bit",
    authorityClass: "STANDARD",
    supports: ["capacity-unit-relationship", "bit-definition"],
    verifiedOn: "2026-08-23",
    notes: ["Use for the durable definition of a bit as a binary digit with value 0 or 1."],
  },
  {
    sourceId: "TECHTARGET-COMPUTER-MEMORY-2025",
    title: "TechTarget — What is computer memory and what are the different types?",
    url: "https://www.techtarget.com/whatis/definition/memory",
    authorityClass: "REFERENCE",
    supports: [
      "memory-layer-classification",
      "cache-function",
      "ram-function",
      "ram-random-access",
      "ram-subtypes",
      "virtual-memory-awareness",
    ],
    verifiedOn: "2026-08-23",
    notes: [
      "Use for awareness-level primary/secondary memory distinctions, cache/RAM roles, RAM subtypes and random-access meaning.",
      "Do not encode inconsistent legacy terminology such as 'primary storage' without an explicit QL convention.",
    ],
  },
  {
    sourceId: "IBM-PRIMARY-STORAGE-2024",
    title: "IBM — What is Primary Storage?",
    url: "https://www.ibm.com/think/topics/primary-storage",
    authorityClass: "VENDOR_TECHNICAL",
    supports: [
      "memory-layer-classification",
      "register-function",
      "cache-function",
      "ram-function",
      "rom-function",
    ],
    verifiedOn: "2026-08-23",
    notes: [
      "Scoped to the reviewed primary-storage page, which identifies RAM, ROM and cache roles and distinguishes secondary/external memory.",
      "This authority is separate from the rejected IBM primary-vs-secondary page and must not inherit claims from that rejected URL.",
    ],
  },
  {
    sourceId: "INTEL-MEMORY-HIERARCHY-2007",
    title: "Intel Technology Journal — memory hierarchy pyramid",
    url: "https://www.intel.com/content/dam/www/public/us/en/documents/research/2007-vol11-iss-4-intel-technology-journal.pdf",
    authorityClass: "VENDOR_TECHNICAL",
    supports: [
      "memory-hierarchy-order",
      "register-hierarchy",
      "cache-hierarchy",
      "main-memory-hierarchy",
    ],
    verifiedOn: "2026-08-23",
    notes: [
      "Use only the durable broad hierarchy order: registers, cache levels, then main memory.",
      "Do not convert old benchmark values or processor-specific latency numbers into timeless facts.",
    ],
  },
  {
    sourceId: "IBM-FLOPPY-HISTORY",
    title: "IBM — Floppy disk storage",
    url: "https://www.ibm.com/history/floppy-disk",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["storage-medium", "floppy-magnetic", "removable-storage"],
    verifiedOn: "2026-08-23",
    notes: [
      "Use for the durable magnetic-medium classification and removable-storage role of floppy disks.",
      "Historical capacities are not generation authority for modern comparison questions.",
    ],
  },
  {
    sourceId: "KINGSTON-SD-MICROSD-CARDS",
    title: "Kingston Technology — SD and microSD flash memory cards",
    url: "https://www.kingston.com/en/memory-cards",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["storage-medium", "flash-memory-card", "removable-storage"],
    verifiedOn: "2026-08-23",
    notes: [
      "Use only for the durable classification of SD/microSD products as flash memory cards.",
      "Do not turn current product capacities or speed classes into timeless exam facts.",
    ],
  },
  {
    sourceId: "IBM-AIX-RMT-TAPE",
    title: "IBM AIX — rmt special file",
    url: "https://www.ibm.com/docs/en/aix/7.3.0?topic=files-rmt-special-file",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["tape-sequential-access", "backup-storage-role", "archive-storage-role"],
    verifiedOn: "2026-08-23",
    notes: [
      "Use for magnetic tape as sequential-access media primarily used for backup, archive and offline storage.",
    ],
  },
  {
    sourceId: "IBM-TAPE-STORAGE",
    title: "IBM — Tape storage",
    url: "https://www.ibm.com/products/tape",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["backup-storage-role", "archive-storage-role", "long-term-retention"],
    verifiedOn: "2026-08-23",
    notes: ["Use only durable tape backup/archive role statements, not current product performance claims."],
  },
  {
    sourceId: "IBM-HMC-USB-FLASH",
    title: "IBM HMC — USB flash memory drive",
    url: "https://www.ibm.com/docs/en/help-ibm-hmc-z17?topic=introduction-usb-flash-memory-drive",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["usb-removable-storage", "backup-storage-role"],
    verifiedOn: "2026-08-23",
    notes: ["Use for USB flash as removable writable media and HMC backup media."],
  },
  {
    sourceId: "IBM-I-RMS",
    title: "IBM i — Removable Mass Storage",
    url: "https://www.ibm.com/docs/en/i/7.5.0?topic=solutions-removable-mass-storage-rms",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["random-access-removable-storage", "rdx-backup-recovery", "flash-removable-storage"],
    verifiedOn: "2026-08-23",
    notes: [
      "Use for removable random-access storage, RDX backup/recovery and flash-drive media roles.",
    ],
  },
  {
    sourceId: "IBM-I-OPTICAL-MEDIA",
    title: "IBM i — Optical media types",
    url: "https://www.ibm.com/docs/en/i/7.6.0?topic=devices-optical-media-types",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["worm-optical", "archive-storage-role", "write-once-retention"],
    verifiedOn: "2026-08-23",
    notes: ["Use for WORM optical media as archival write-once storage."],
  },
];

export const COM001_ALL_SOURCE_AUTHORITIES: Com001SourceAuthority[] = [
  ...COM001_SOURCE_AUTHORITIES,
  ...COM001_ADDITIONAL_SOURCE_AUTHORITIES,
];

export function auditCom001AdditionalSources() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();

  for (const source of COM001_ALL_SOURCE_AUTHORITIES) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (!source.supports.length) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
  }

  return {
    valid: issues.length === 0,
    sourceCount: COM001_ALL_SOURCE_AUTHORITIES.length,
    issues,
  };
}
