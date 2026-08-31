export type Com002SourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  authorityClass:
    | "OFFICIAL_EXAM"
    | "OFFICIAL_CURRICULUM"
    | "GOVERNMENT_REFERENCE"
    | "VENDOR_TECHNICAL"
    | "PYQ_EVIDENCE";
  supports: string[];
  verifiedOn: string;
  notes: string[];
};

/**
 * Reviewed source/evidence manifest for COM-002 / Operating Systems, Files & Windows.
 *
 * Source registration does not make facts generation-eligible. Canonical facts
 * still require relation-level editorial review. PYQ_EVIDENCE sources prove
 * exam task/surface relevance; they are not the canonical truth authority when
 * a first-party technical or government source exists.
 */
export const COM002_SOURCE_AUTHORITIES: Com002SourceAuthority[] = [
  {
    sourceId: "SSC-CGL-2026-NOTICE",
    title: "SSC Combined Graduate Level Examination 2026 notice",
    url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
    authorityClass: "OFFICIAL_EXAM",
    supports: ["scope:computer-basics", "scope:software-operating-system"],
    verifiedOn: "2026-08-25",
    notes: [
      "Use as an SSC ownership/scope anchor, not as the factual authority for individual OS or Windows claims.",
    ],
  },
  {
    sourceId: "NIELIT-CCC-REV4-2023",
    title: "NIELIT Course on Computer Concepts Revision 4 — Introduction to Operating System",
    url: "https://www.nielit.gov.in/sites/default/files/headquarter/pdf/Syllabus_CCC.pdf",
    authorityClass: "OFFICIAL_CURRICULUM",
    supports: [
      "operating-system-basics",
      "desktop-mobile-operating-systems",
      "taskbar-icons-shortcuts",
      "system-settings",
      "file-folder-management",
      "file-extensions",
    ],
    verifiedOn: "2026-08-25",
    notes: [
      "Revision 4 is implemented from 1 October 2023 and explicitly owns OS basics, desktop/mobile OS, UI, settings, files/folders and file extensions.",
    ],
  },
  {
    sourceId: "NIELIT-CCC-PLUS-OS",
    title: "NIELIT CCC Plus — Module 2 Operating System",
    url: "https://www.nielit.gov.in/daman/content/course-computer-concepts-plus-ccc-plus",
    authorityClass: "OFFICIAL_CURRICULUM",
    supports: [
      "operating-system-basics",
      "gui-cli-awareness",
      "file-directory-concepts",
      "file-naming-path",
      "file-properties",
      "create-copy-move-delete-rename-search",
      "recycle-recovery",
      "desktop-shortcuts",
      "windows-updates",
    ],
    verifiedOn: "2026-08-25",
    notes: [
      "Useful breadth authority for practical file/directory learner tasks and Windows desktop actions.",
      "Do not automatically promote every practical instruction into a permanent MCQ learner task.",
    ],
  },
  {
    sourceId: "MICROSOFT-WINDOWS-FILE-EXTENSIONS-2026",
    title: "Microsoft Support — Common file name extensions in Windows",
    url: "https://support.microsoft.com/en-US/Windows/Experience/Storage-FileManagement/common-file-name-extensions-in-windows",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["file-extension-concept", "file-type-extension-mapping"],
    verifiedOn: "2026-08-25",
    notes: [
      "Use for Windows file-name/extension semantics and common extension mappings.",
      "Changing an extension alone does not convert the underlying file format.",
    ],
  },
  {
    sourceId: "MICROSOFT-FILE-EXPLORER-2026",
    title: "Microsoft Support — File Explorer in Windows",
    url: "https://support.microsoft.com/en-US/Windows/Experience/FileExplorer/file-explorer-in-windows",
    authorityClass: "VENDOR_TECHNICAL",
    supports: [
      "file-explorer-purpose",
      "file-extension-visibility",
      "hidden-files",
      "file-folder-navigation",
    ],
    verifiedOn: "2026-08-25",
    notes: [
      "Use for current Windows File Explorer behavior; avoid version-specific menu trivia unless exam evidence requires it.",
    ],
  },
  {
    sourceId: "MICROSOFT-WINDOWS-SHORTCUTS-2026",
    title: "Microsoft Support — Keyboard shortcuts in Windows",
    url: "https://support.microsoft.com/en-us/windows/keyboard-shortcuts-in-windows-dcc61a57-8ff0-cffe-9796-cb9706c75eec",
    authorityClass: "VENDOR_TECHNICAL",
    supports: [
      "windows-shortcuts",
      "file-explorer-shortcuts",
      "rename-search-refresh",
      "permanent-delete",
    ],
    verifiedOn: "2026-08-25",
    notes: [
      "Strong first-party authority for Win+E, Alt+F4, F2, F3, F5, Shift+Delete and other durable Windows/File Explorer shortcuts.",
      "Do not create a shortcut-trivia QL for shortcuts without exam relevance or durable cross-version behavior.",
    ],
  },
  {
    sourceId: "UBUNTU-DESKTOP-2026",
    title: "Ubuntu Desktop documentation — About Ubuntu Desktop",
    url: "https://documentation.ubuntu.com/desktop/en/26.04/explanation/about-ubuntu-desktop/",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["open-source-os", "desktop-operating-system", "ubuntu-classification"],
    verifiedOn: "2026-08-25",
    notes: [
      "First-party authority that Ubuntu Desktop is an open-source operating system for PCs/laptops.",
    ],
  },
  {
    sourceId: "PSSCIVE-OS-STRUCTURE-2021",
    title: "PSS Central Institute of Vocational Education — Operating System session",
    url: "https://psscive.ac.in/storage/uploads/textbooks/pdf/english/domestic-biometric-data-operator-english-class-11.pdf",
    authorityClass: "GOVERNMENT_REFERENCE",
    supports: ["kernel-core", "kernel-function", "shell-kernel-interface"],
    verifiedOn: "2026-08-25",
    notes: [
      "Government educational reference supporting the awareness-level kernel/shell model.",
      "Keep process scheduling and deeper OS internals outside COM-002 unless target-exam evidence justifies them.",
    ],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2020-KERNEL",
    title: "SSC CHSL 2020 official-paper question — core of an operating system",
    url: "https://testbook.com/question-answer/which-of-the-following-is-the-core-of-an-operating--6155dd48fcc0fe4a6b3e23f7",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:kernel-core", "task:component-identification"],
    verifiedOn: "2026-08-25",
    notes: ["Held 15 April 2021 Shift 3; correct answer Kernel."],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2020-RTOS",
    title: "SSC CHSL 2020 official-paper question — response within specified time constraints",
    url: "https://testbook.com/question-answer/which-of-the-following-operating-systems-guarantee--618a9006c8efcf21412623b2",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:real-time-os", "task:os-type-property"],
    verifiedOn: "2026-08-25",
    notes: ["Held 16 April 2021 Shift 2; correct answer Real-time operating system."],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2020-TMP",
    title: "SSC CHSL 2020 official-paper question — temporary-file extension",
    url: "https://testbook.com/question-answer/which-of-the-following-is-an-extension-of-a-tempor--612cd55541c8e77bbaebc9e8",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:file-type-extension", "task:extension-to-file-type"],
    verifiedOn: "2026-08-25",
    notes: ["Held 12 April 2021 Shift 1; correct answer .tmp."],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2020-EXTENSION-CONCEPT",
    title: "SSC CHSL 2020 official-paper question — file extension identifies file type",
    url: "https://testbook.com/question-answer/the-_______-is-a-three-or-four-letter-abbreviation--61e95806395ec71d28306d51",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:file-extension-concept", "task:file-concept-identification"],
    verifiedOn: "2026-08-25",
    notes: ["Held 10 August 2021 Shift 3; correct answer Extension."],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2022-RECYCLE-BIN",
    title: "SSC CHSL Tier-II official-paper question — deleted item moves to Recycle Bin",
    url: "https://testbook.com/question-answer/in-windows-os-when-you-delete-an-item-from-any-of--64a6abf27a67a9834e3e959e",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:recycle-bin", "task:delete-recovery-behavior"],
    verifiedOn: "2026-08-25",
    notes: ["Held 26 June 2023 Shift 1; correct answer Recycle Bin."],
  },
];

export function auditCom002SourceManifest() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();

  for (const source of COM002_SOURCE_AUTHORITIES) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (!source.url.startsWith("https://")) issues.push(`NON_HTTPS_SOURCE:${source.sourceId}`);
    if (source.supports.length === 0) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.verifiedOn)) {
      issues.push(`INVALID_VERIFIED_DATE:${source.sourceId}`);
    }
  }

  const pyqCount = COM002_SOURCE_AUTHORITIES.filter(
    (source) => source.authorityClass === "PYQ_EVIDENCE",
  ).length;
  const firstPartyCount = COM002_SOURCE_AUTHORITIES.filter((source) =>
    ["OFFICIAL_EXAM", "OFFICIAL_CURRICULUM", "GOVERNMENT_REFERENCE", "VENDOR_TECHNICAL"].includes(source.authorityClass),
  ).length;

  if (pyqCount < 5) issues.push(`THIN_PYQ_EVIDENCE:${pyqCount}`);
  if (firstPartyCount < 7) issues.push(`THIN_FIRST_PARTY_AUTHORITY:${firstPartyCount}`);

  return {
    valid: issues.length === 0,
    sourceCount: COM002_SOURCE_AUTHORITIES.length,
    pyqCount,
    firstPartyCount,
    supportScopes: [...new Set(COM002_SOURCE_AUTHORITIES.flatMap((source) => source.supports))].sort(),
    issues,
  };
}
