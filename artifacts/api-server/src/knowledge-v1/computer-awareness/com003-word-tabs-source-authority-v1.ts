export type Com003WordTabsSourceAuthority = {
  sourceId: string;
  title: string;
  url: string;
  authorityClass: "VENDOR_TECHNICAL" | "OFFICIAL_CURRICULUM" | "PYQ_EVIDENCE";
  supports: string[];
  verifiedOn: string;
};

export const COM003_WORD_TABS_SOURCE_AUTHORITIES: readonly Com003WordTabsSourceAuthority[] = [
  {
    sourceId: "MICROSOFT-WORD-RIBBON-2026",
    title: "Microsoft Support — Customize the Ribbon in Word",
    url: "https://support.microsoft.com/en-us/word/customize-the-ribbon-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:ribbon", "word:tabs", "word:groups", "word:contextual-tabs"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-NEW-USERS-2026",
    title: "Microsoft Support — Word for new users",
    url: "https://support.microsoft.com/en-us/word/word-for-new-users",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:interface", "word:document-window", "word:status-bar"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-FORMAT-PAINTER-2026",
    title: "Microsoft Support — Use the Format Painter",
    url: "https://support.microsoft.com/en-us/word/use-the-format-painter",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:home", "word:format-painter"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-INSERT-TABLE-2026",
    title: "Microsoft Support — Insert a table",
    url: "https://support.microsoft.com/en-us/word/training/insert-a-table",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:insert", "word:table"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-INSERT-PICTURES-2026",
    title: "Microsoft Support — Insert pictures",
    url: "https://support.microsoft.com/en-us/word/training/insert-pictures",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:insert", "word:pictures", "word:shapes", "word:smartart"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-INSERT-HEADER-FOOTER-2026",
    title: "Microsoft Support — Insert a header or footer",
    url: "https://support.microsoft.com/en-us/word/training/insert-a-header-or-footer",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:insert", "word:header", "word:footer"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-INSERT-PAGE-NUMBERS-2026",
    title: "Microsoft Support — Insert page numbers",
    url: "https://support.microsoft.com/en-us/word/training/insert-page-numbers",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:insert", "word:page-numbers"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-INSERT-BREAKS-2026",
    title: "Microsoft Support — Insert page and section breaks",
    url: "https://support.microsoft.com/en-us/word/insert-a-section-break",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:insert", "word:page-break", "word:section-break"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-DESIGN-THEME-2026",
    title: "Microsoft Support — Customize, save, and apply a theme in Word",
    url: "https://support.microsoft.com/en-us/word/customize-save-and-apply-a-theme-in-word-for-mac",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:design", "word:themes", "word:theme-colors", "word:theme-fonts"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-DESIGN-BORDER-2026",
    title: "Microsoft Support — Add a border to a page",
    url: "https://support.microsoft.com/en-us/word/training/add-a-border-to-a-page",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:design", "word:page-borders", "word:watermark", "word:page-color"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-LAYOUT-2026",
    title: "Microsoft Support — Change margins, orientation, size and columns in Word",
    url: "https://support.microsoft.com/en-us/word/training/change-margins",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:layout", "word:margins", "word:orientation", "word:size", "word:columns"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-COLUMNS-2026",
    title: "Microsoft Support — Create multiple columns in Word",
    url: "https://support.microsoft.com/en-us/word/training/create-multiple-columns-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:layout", "word:columns", "word:section-layout"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-REFERENCES-FOOTNOTES-2026",
    title: "Microsoft Support — Insert footnotes and endnotes in Word",
    url: "https://support.microsoft.com/en-us/word/training/insert-footnotes-and-endnotes-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:references", "word:footnotes", "word:endnotes", "word:table-of-contents"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-REFERENCES-TOC-2026",
    title: "Microsoft Support — Insert a table of contents",
    url: "https://support.microsoft.com/en-us/word/training/insert-a-table-of-contents",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:references", "word:table-of-contents", "word:heading-styles"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-REFERENCES-CITATIONS-2026",
    title: "Microsoft Support — Create citations, references and a bibliography",
    url: "https://support.microsoft.com/en-us/word/training/create-a-bibliography-citations-and-references",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:references", "word:citations", "word:bibliography", "word:cross-reference"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-MAIL-MERGE-2026",
    title: "Microsoft Support — Use mail merge for bulk letters, labels and envelopes",
    url: "https://support.microsoft.com/en-us/word/use-mail-merge-for-bulk-email-letters-labels-and-envelopes",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:mailings", "word:mail-merge", "word:recipients", "word:merge-fields"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-MAIL-MERGE-PREVIEW-2026",
    title: "Microsoft Support — Use mail merge to personalize letters",
    url: "https://support.microsoft.com/en-us/word/use-mail-merge-to-personalize-letters",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:mailings", "word:preview-results", "word:finish-merge"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-REVIEW-TRACK-CHANGES-2026",
    title: "Microsoft Support — Track changes in Word",
    url: "https://support.microsoft.com/en-us/word/training/track-changes-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:review", "word:track-changes", "word:reviewing-pane", "word:comments"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-REVIEW-EDITOR-2026",
    title: "Microsoft Support — Check grammar, spelling and more in Word",
    url: "https://support.microsoft.com/en-us/word/training/check-grammar-spelling-and-more-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:review", "word:editor", "word:proofing-language", "word:spelling"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-VIEWS-2026",
    title: "Microsoft Support — Use Word views to read or edit your document",
    url: "https://support.microsoft.com/en-us/word/use-word-views-to-read-or-edit-your-document",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:view", "word:print-layout", "word:read-mode", "word:document-view"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-RULER-2026",
    title: "Microsoft Support — Using the ruler in Word",
    url: "https://support.microsoft.com/en-us/word/using-the-ruler-in-word",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:view", "word:ruler", "word:tab-stops", "word:indents"],
    verifiedOn: "2026-09-09",
  },
  {
    sourceId: "MICROSOFT-WORD-SHORTCUTS-2026",
    title: "Microsoft Support — Keyboard shortcuts in Word",
    url: "https://support.microsoft.com/en-gb/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2",
    authorityClass: "VENDOR_TECHNICAL",
    supports: ["word:tabs", "word:commands", "word:shortcuts"],
    verifiedOn: "2026-09-09",
  },
];

export function auditCom003WordTabsSources() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const urls = new Set<string>();
  for (const source of COM003_WORD_TABS_SOURCE_AUTHORITIES) {
    if (ids.has(source.sourceId)) issues.push(`DUPLICATE_SOURCE_ID:${source.sourceId}`);
    ids.add(source.sourceId);
    if (urls.has(source.url)) issues.push(`DUPLICATE_URL:${source.url}`);
    urls.add(source.url);
    if (!source.url.startsWith("https://")) issues.push(`NON_HTTPS_SOURCE:${source.sourceId}`);
    if (!source.supports.length) issues.push(`NO_SUPPORT_SCOPE:${source.sourceId}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.verifiedOn)) issues.push(`INVALID_DATE:${source.sourceId}`);
  }
  return {
    valid: issues.length === 0,
    sourceCount: COM003_WORD_TABS_SOURCE_AUTHORITIES.length,
    firstPartyCount: COM003_WORD_TABS_SOURCE_AUTHORITIES.filter((source) => source.authorityClass === "VENDOR_TECHNICAL").length,
    issues,
  };
}
