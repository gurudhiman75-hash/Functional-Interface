export type Com003SourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  authorityClass:
    | "OFFICIAL_EXAM"
    | "OFFICIAL_CURRICULUM"
    | "VENDOR_TECHNICAL"
    | "PYQ_EVIDENCE";
  supports: string[];
  verifiedOn: string;
  notes: string[];
};

/**
 * Reviewed source/evidence manifest for COM-003 / Office & Productivity Software.
 *
 * First-party curriculum/vendor sources establish scope and technical truth.
 * PYQ sources establish exam-real learner tasks/surfaces only; a third-party PYQ
 * explanation is never promoted as canonical truth when Microsoft/NIELIT has a
 * first-party authority for the same fact.
 */
export const COM003_SOURCE_AUTHORITIES: Com003SourceAuthority[] = [
  {
    sourceId: "SSC-CGL-2026-NOTICE",
    title: "SSC Combined Graduate Level Examination 2026 notice",
    url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
    authorityClass: "OFFICIAL_EXAM",
    supports: ["scope:microsoft-office", "scope:ms-word", "scope:ms-excel", "scope:powerpoint", "scope:keyboard-shortcuts"],
    verifiedOn: "2026-08-31",
    notes: [
      "SSC Computer Knowledge/Proficiency explicitly owns basics of MS Word, MS Excel and PowerPoint.",
      "Use as scope authority, not as technical authority for application behavior.",
    ],
  },
  {
    sourceId: "NIELIT-CCC-REV3-2019",
    title: "NIELIT Course on Computer Concepts Revision 3 syllabus",
    url: "https://www.nielit.gov.in/sites/default/files/headquarter/pdf/20190531_CCC_Revision.pdf",
    authorityClass: "OFFICIAL_CURRICULUM",
    supports: [
      "word-processing",
      "text-editing-formatting",
      "find-replace",
      "spelling-grammar",
      "header-footer",
      "mail-merge",
      "spreadsheet-basics",
      "cell-addressing",
      "sorting-filtering",
      "formulas-functions",
      "relative-absolute-reference",
      "charts",
      "presentation-basics",
      "slide-show",
      "transitions",
    ],
    verifiedOn: "2026-08-31",
    notes: ["Government curriculum breadth anchor for awareness-level office-productivity tasks."],
  },
  {
    sourceId: "NIELIT-CCC-PLUS-OFFICE",
    title: "NIELIT Course on Computer Concepts Plus — Word Processing, Spreadsheet and Presentation modules",
    url: "https://www.nielit.gov.in/aizawl/aizawl/content/course-computer-concepts-plus-ccc-plus",
    authorityClass: "OFFICIAL_CURRICULUM",
    supports: [
      "word-processing",
      "spreadsheet-basics",
      "cell-manipulation",
      "formulas-functions",
      "relative-absolute-reference",
      "charts",
      "presentation-creation",
      "slide-objects",
      "slide-show",
      "slide-transition-timing",
    ],
    verifiedOn: "2026-08-31",
    notes: [
      "Use to identify practical learner tasks; not every UI click sequence deserves a permanent QL.",
    ],
  },
  {
    sourceId: "MICROSOFT-WORD-FILE-FORMATS-2026",
    title: "Microsoft Support — File formats for saving documents",
    url: "https://support.microsoft.com/en-us/word/file-formats-for-saving-documents",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word-file-format", "docx", "doc", "word-template-format"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for durable Word file-format mappings."],
  },
  {
    sourceId: "MICROSOFT-WORD-MAIL-MERGE-2026",
    title: "Microsoft Support — Use mail merge for bulk email, letters, labels, and envelopes",
    url: "https://support.microsoft.com/en-us/word/use-mail-merge-for-bulk-email-letters-labels-and-envelopes",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["mail-merge", "main-document", "data-source", "merge-fields"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for mail-merge purpose and component relationships."],
  },
  {
    sourceId: "MICROSOFT-WORD-SHORTCUTS-2026",
    title: "Microsoft Support — Keyboard shortcuts in Word",
    url: "https://support.microsoft.com/en-gb/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word-shortcuts", "edit-shortcuts", "formatting-shortcuts", "document-shortcuts"],
    verifiedOn: "2026-08-31",
    notes: ["Use only durable Windows Word shortcuts with target-exam evidence or strong curriculum relevance."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-FILE-FORMATS-2026",
    title: "Microsoft Support — File formats that are supported in Excel",
    url: "https://support.microsoft.com/en-us/excel/file-formats-that-are-supported-in-excel",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-file-format", "xlsx", "xls", "xlsm", "workbook"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for durable Excel workbook file-format mappings."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-FORMULAS-2026",
    title: "Microsoft Support — Overview of formulas in Excel",
    url: "https://support.microsoft.com/en-us/excel/get-started/overview-of-formulas-in-excel",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-formula", "equals-prefix", "cell-reference", "function-awareness"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority that Excel formulas begin with an equal sign and can refer to cell values."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-SHORTCUTS-2026",
    title: "Microsoft Support — Keyboard shortcuts in Excel",
    url: "https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-excel-1798d9d5-842a-42b8-9c99-9b7213f0040f",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-shortcuts", "cell-editing", "navigation", "formatting"],
    verifiedOn: "2026-08-31",
    notes: ["Version/platform-sensitive shortcuts must be represented with explicit Windows Excel context."],
  },
  {
    sourceId: "MICROSOFT-POWERPOINT-FILE-FORMATS-2026",
    title: "Microsoft Support — File formats that are supported in PowerPoint",
    url: "https://support.microsoft.com/en-us/powerpoint/file-formats-that-are-supported-in-powerpoint",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["powerpoint-file-format", "pptx", "ppt", "ppsx", "presentation"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for durable PowerPoint presentation/show file formats."],
  },
  {
    sourceId: "MICROSOFT-POWERPOINT-TRANSITION-ANIMATION-2026",
    title: "Microsoft Support — The difference between animations and transitions",
    url: "https://support.microsoft.com/en-us/powerpoint/the-difference-between-animations-and-transitions",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["powerpoint-transition", "powerpoint-animation", "transition-vs-animation"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for the frequently confused transition-versus-animation relation."],
  },
  {
    sourceId: "MICROSOFT-POWERPOINT-SLIDESHOW-SHORTCUTS-2026",
    title: "Microsoft Support — Use keyboard shortcuts to deliver PowerPoint presentations",
    url: "https://support.microsoft.com/en-us/office/use-keyboard-shortcuts-to-deliver-powerpoint-presentations-1524ffce-bd2a-45f4-9a7f-f18b992b93a0",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["powerpoint-slideshow", "f5", "shift-f5", "presentation-shortcuts"],
    verifiedOn: "2026-08-31",
    notes: ["Use Windows desktop context for F5/Shift+F5 learner tasks."],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2019-EXCEL-PURPOSE",
    title: "SSC CHSL 2019 official-paper question — tabular storage/organisation/calculation application",
    url: "https://testbook.com/question-answer/which-one-of-the-following-allows-the-user-to-stor--5d6a2083fdb8bb52cebf8a53",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:excel-purpose", "task:application-from-function"],
    verifiedOn: "2026-08-31",
    notes: ["Held 4 July 2019 Shift 3; correct application Microsoft Excel."],
  },
  {
    sourceId: "PYQ-SSC-CHSL-2024-MAIL-MERGE",
    title: "SSC CHSL 2024 Tier-I official-paper question — merge data source into main document",
    url: "https://testbook.com/question-answer/the-process-of-merging-data-from-a-data-source-int--66a3569a28168ef33dfa0ac9",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:mail-merge", "task:word-feature-from-function"],
    verifiedOn: "2026-08-31",
    notes: ["Held 5 July 2024 Shift 2; correct answer mail merge."],
  },
  {
    sourceId: "PYQ-SSC-CGL-2024-T2-OFFICE-SHORTCUTS",
    title: "SSC CGL 2024 Tier-II official paper — Excel column-width and Word bullets shortcuts",
    url: "https://cdn.testbook.com/1773811963605-SSC%20CGL%202024%20Tier-II%20Official%20Paper-I%20%28Held%20On_%2018%20Jan%2C%202025%29.pdf/1773811964.pdf",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:excel-shortcut", "pyq:word-shortcut", "task:shortcut-to-action", "task:action-to-shortcut"],
    verifiedOn: "2026-08-31",
    notes: [
      "Official-paper mirror contains Excel column-width shortcut and Word bullet-list shortcut questions.",
      "Shortcut truth must still be checked against Microsoft documentation/version context.",
    ],
  },
  {
    sourceId: "PYQ-KVS-2018-OFFICE-EXTENSIONS",
    title: "KVS TGT 2018 official-paper question — MS Office file extensions",
    url: "https://testbook.com/question-answer/which-of-the-following-options-contains-extensions--5f5226310fe933564fdfbdfd",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:office-file-extensions", "task:multi-app-extension-classification"],
    verifiedOn: "2026-08-31",
    notes: ["Cross-exam evidence for DOCX/XLSX/PPTX recognition; canonical format truth remains Microsoft-sourced."],
  },
  {
    sourceId: "PYQ-KVS-2018-POWERPOINT-TRANSITION",
    title: "KVS PRT 2018 official-paper question — slide-to-slide motion effect",
    url: "https://testbook.com/question-answer/which-of-the-following-features-is-used-to-apply-m--5e022d36f9bc7a1c35750179",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:powerpoint-transition", "task:feature-from-effect"],
    verifiedOn: "2026-08-31",
    notes: ["Cross-exam evidence for transition/animation discrimination."],
  },
  {
    sourceId: "PYQ-PUNJAB-POLICE-SI-POWERPOINT-TABS",
    title: "Punjab Police SI official-paper question set — PowerPoint Insert-tab functions",
    url: "https://testbook.com/questions/punjab-police-si-computer-questions--6492d334d0ef31d49c956506",
    authorityClass: "PYQ_EVIDENCE",
    supports: ["pyq:powerpoint-ribbon", "task:feature-to-tab"],
    verifiedOn: "2026-08-31",
    notes: [
      "Punjab-specific evidence that application UI/tab recognition can occur.",
      "Treat Ribbon-tab mappings as version-sensitive and keep provisional until relation-level source review.",
    ],
  },
];

export function auditCom003SourceManifest() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();

  for (const source of COM003_SOURCE_AUTHORITIES) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (!source.url.startsWith("https://")) issues.push(`NON_HTTPS_SOURCE:${source.sourceId}`);
    if (!source.supports.length) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.verifiedOn)) issues.push(`INVALID_VERIFIED_DATE:${source.sourceId}`);
  }

  const pyqCount = COM003_SOURCE_AUTHORITIES.filter((source) => source.authorityClass === "PYQ_EVIDENCE").length;
  const firstPartyCount = COM003_SOURCE_AUTHORITIES.filter((source) => source.authorityClass !== "PYQ_EVIDENCE").length;
  const officialScopeCount = COM003_SOURCE_AUTHORITIES.filter((source) =>
    source.authorityClass === "OFFICIAL_EXAM" || source.authorityClass === "OFFICIAL_CURRICULUM",
  ).length;

  if (pyqCount < 6) issues.push(`THIN_PYQ_EVIDENCE:${pyqCount}`);
  if (firstPartyCount < 12) issues.push(`THIN_FIRST_PARTY_AUTHORITY:${firstPartyCount}`);
  if (officialScopeCount < 3) issues.push(`THIN_OFFICIAL_SCOPE:${officialScopeCount}`);

  return {
    valid: issues.length === 0,
    sourceCount: COM003_SOURCE_AUTHORITIES.length,
    pyqCount,
    firstPartyCount,
    officialScopeCount,
    supportScopes: [...new Set(COM003_SOURCE_AUTHORITIES.flatMap((source) => source.supports))].sort(),
    issues,
  };
}
