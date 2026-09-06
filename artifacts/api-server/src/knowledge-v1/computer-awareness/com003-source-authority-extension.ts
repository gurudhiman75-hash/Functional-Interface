import type { Com003SourceAuthority } from "./com003-source-manifest";

/**
 * Relation-level first-party authority added after the broad COM-003 source
 * manifest. These sources close technical-truth gaps discovered during atomic
 * corpus construction. PYQ mirrors remain relevance evidence only and are not
 * used as canonical fact sources.
 */
export const COM003_SOURCE_AUTHORITY_EXTENSION: Com003SourceAuthority[] = [
  {
    sourceId: "MICROSOFT-WORD-BASIC-TASKS-2026",
    title: "Microsoft Support — Basic tasks in Word",
    url: "https://support.microsoft.com/en-US/Word/basic-tasks-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word-document-basics", "find", "replace", "headers-footers", "page-numbers"],
    verifiedOn: "2026-08-31",
    notes: ["Stable task-level authority; avoid web-only UI details unless the question states that context."],
  },
  {
    sourceId: "MICROSOFT-WORD-FIND-REPLACE-2026",
    title: "Microsoft Support — Find and replace text in Word",
    url: "https://support.microsoft.com/en-us/word/training/find-and-replace-text-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word-find", "word-replace", "find-replace-shortcuts"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for the semantic distinction between finding text and replacing text."],
  },
  {
    sourceId: "MICROSOFT-WORD-PROOFING-2026",
    title: "Microsoft Support — Check spelling and grammar in Office",
    url: "https://support.microsoft.com/en-us/office/check-spelling-and-grammar-in-office",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["spelling", "grammar", "proofing", "f7"],
    verifiedOn: "2026-08-31",
    notes: ["Use stable spelling/grammar concepts; do not make current Editor branding the canonical answer unless context requires it."],
  },
  {
    sourceId: "MICROSOFT-WORD-ALIGNMENT-2026",
    title: "Microsoft Support — Align text left or right, center text, or justify text on a page",
    url: "https://support.microsoft.com/en-us/word/align-text-left-or-right-center-text-or-justify-text-on-a-page",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word-paragraph-alignment", "left", "center", "right", "justify"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for durable paragraph-alignment semantics."],
  },
  {
    sourceId: "MICROSOFT-WORD-HEADERS-FOOTERS-2026",
    title: "Microsoft Support — Edit your existing headers and footers in Word",
    url: "https://support.microsoft.com/en-us/word/edit-your-existing-headers-and-footers-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word-header", "word-footer", "page-number"],
    verifiedOn: "2026-08-31",
    notes: ["Use for page-margin header/footer roles, not version-specific ribbon trivia."],
  },
  {
    sourceId: "MICROSOFT-WORD-ORIENTATION-2026",
    title: "Microsoft Support — Change page orientation to landscape or portrait",
    url: "https://support.microsoft.com/en-us/word/training/change-page-orientation-to-landscape-or-portrait",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word-page-orientation", "portrait", "landscape"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for portrait/landscape page-orientation semantics."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-REFERENCES-2026",
    title: "Microsoft Support — Create or change a cell reference",
    url: "https://support.microsoft.com/en-US/Excel/create-or-change-a-cell-reference",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-relative-reference", "excel-absolute-reference", "excel-mixed-reference", "f4"],
    verifiedOn: "2026-08-31",
    notes: ["Initial COM-003 facts use relative and absolute references; mixed references remain out of permanent allocation until exam evidence justifies them."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-SUM-AUTOSUM-2026",
    title: "Microsoft Support — Learn more about SUM",
    url: "https://support.microsoft.com/en-us/excel/learn-more-about-sum",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-sum", "excel-autosum", "average", "count", "max", "min"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for SUM and AutoSum; the AutoSum menu also exposes Average, Count Numbers, Max and Min."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-SORT-2026",
    title: "Microsoft Support — Sort data in a range or table in Excel",
    url: "https://support.microsoft.com/en-us/excel/sort-data-in-a-range-or-table-in-excel",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-sort", "ascending", "descending"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority for sort-as-ordering semantics."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-FILTER-2026",
    title: "Microsoft Support — Quick start: Filter data by using an AutoFilter",
    url: "https://support.microsoft.com/en-US/Excel/quick-start-filter-data-by-using-an-autofilter",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-filter", "criteria", "hide-nonmatching-rows"],
    verifiedOn: "2026-08-31",
    notes: ["Filtering controls which rows are shown; it must not be described as reordering the data."],
  },
  {
    sourceId: "MICROSOFT-EXCEL-AUTOFILL-2026",
    title: "Microsoft Support — Fill data automatically in worksheet cells",
    url: "https://support.microsoft.com/en-US/Excel/get-started/fill-data-automatically-in-worksheet-cells",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["excel-autofill", "fill-handle", "series", "pattern"],
    verifiedOn: "2026-08-31",
    notes: ["AutoFill can extend a pattern or values based on selected source cells; do not overclaim one fixed drag outcome."],
  },
  {
    sourceId: "MICROSOFT-OFFICE-CHART-TYPES-2026",
    title: "Microsoft Support — Available chart types in Office",
    url: "https://support.microsoft.com/en-us/excel/available-chart-types-in-office",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["bar-chart", "column-chart", "line-chart", "pie-chart", "chart-purpose"],
    verifiedOn: "2026-08-31",
    notes: ["Use elementary canonical purposes such as line-for-trends and pie-for-parts-of-whole; avoid absolute best-chart claims."],
  },
  {
    sourceId: "MICROSOFT-POWERPOINT-LAYOUT-2026",
    title: "Microsoft Support — What is a slide layout?",
    url: "https://support.microsoft.com/en-us/powerpoint/what-is-a-slide-layout",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["powerpoint-slide-layout", "placeholder", "theme"],
    verifiedOn: "2026-08-31",
    notes: ["First-party authority separating layout/placeholder structure from theme styling."],
  },
  {
    sourceId: "MICROSOFT-POWERPOINT-TRANSITION-TIMING-2026",
    title: "Microsoft Support — Set the timing and speed of a transition",
    url: "https://support.microsoft.com/en-us/PowerPoint/set-the-timing-and-speed-of-a-transition",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["powerpoint-transition-duration", "powerpoint-slide-advance", "transition-timing"],
    verifiedOn: "2026-08-31",
    notes: ["Use for stable duration/advance-timing semantics rather than exact UI placement."],
  },
  {
    sourceId: "MICROSOFT-POWERPOINT-BASIC-TASKS-WEB-2026",
    title: "Microsoft Support — Basic tasks in PowerPoint for the web",
    url: "https://support.microsoft.com/en-us/powerpoint/basic-tasks-in-powerpoint-for-the-web-1",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["powerpoint-insert-picture", "insert-tab", "transition", "animation"],
    verifiedOn: "2026-08-31",
    notes: [
      "Version/platform-scoped authority only. Facts sourced here must carry explicit web/version scope and SLOW_MUTABLE freshness.",
      "Do not generalize this UI mapping to every PowerPoint version.",
    ],
  },
];

export function auditCom003SourceAuthorityExtension() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();

  for (const source of COM003_SOURCE_AUTHORITY_EXTENSION) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (source.authorityClass !== "VENDOR_TECHNICAL") issues.push(`NON_VENDOR_EXTENSION_SOURCE:${source.sourceId}`);
    if (!source.url.startsWith("https://support.microsoft.com/")) issues.push(`NON_MICROSOFT_SUPPORT_SOURCE:${source.sourceId}`);
    if (!source.supports.length) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (source.verifiedOn !== "2026-08-31") issues.push(`STALE_EXTENSION_VERIFICATION:${source.sourceId}`);
  }

  const requiredScopes = [
    "word-paragraph-alignment",
    "word-page-orientation",
    "excel-relative-reference",
    "excel-autosum",
    "excel-sort",
    "excel-filter",
    "excel-autofill",
    "line-chart",
    "powerpoint-slide-layout",
    "transition-timing",
  ];
  const supportScopes = new Set(COM003_SOURCE_AUTHORITY_EXTENSION.flatMap((entry) => entry.supports));
  for (const scope of requiredScopes) {
    if (!supportScopes.has(scope)) issues.push(`MISSING_RELATION_AUTHORITY:${scope}`);
  }

  return {
    valid: issues.length === 0,
    sourceCount: COM003_SOURCE_AUTHORITY_EXTENSION.length,
    supportScopes: [...supportScopes].sort(),
    issues,
  };
}
