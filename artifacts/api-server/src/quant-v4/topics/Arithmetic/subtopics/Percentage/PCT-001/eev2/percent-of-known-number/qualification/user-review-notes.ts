export const USER_CORPUS_SOURCE_INVENTORY = [
  {
    fileName: "Maths SSC Previous Year Asked Questions in English.PDF",
    sha256: "0E340C71E71E8099D1FA5D4E93A1278C3ABCB37AA39E3B7964746A757F0A6F09",
    sourceKind: "SSC_PYQ_COMPILATION",
    percentageChapter: "Pinnacle Day 62nd-65th: Percentage",
    extractionStatus: "TEXT_VERIFIED",
  },
  {
    fileName: "SSC Maths Chapter Wise Solved Questions and Answers PDF in English.pdf",
    sha256: "C397099C5264687220A4A71DCB6C421F5304EAA98B839CA3DAFBBBDF70DA0290",
    sourceKind: "SSC_CHAPTERWISE_SOLVED_BOOK",
    percentageChapter: "Percentage, physical pages 315-376",
    extractionStatus: "TEXT_VERIFIED",
  },
  {
    fileName: "Disha SSC Mathematics Guidein English (sscstudy.com).pdf",
    sha256: "80D65977420D49B1AAF6C87437904D212E4A120BFCC8957481B37CB605C50E63",
    sourceKind: "SSC_GUIDE",
    percentageChapter: "Percentages, physical pages 83-99",
    extractionStatus: "TEXT_VERIFIED",
  },
  {
    fileName: "SSC Maths Chapterwise E-book in Hindi and English Free Download.pdf",
    sha256: "73E79C9D7EFEF2D87FDDF4F5D41CE11059224DC6687EC267D29329AB82DCD66C",
    sourceKind: "SSC_BILINGUAL_PYQ_COMPILATION",
    percentageChapter: "Percentage, physical pages 3-44",
    extractionStatus: "TEXT_SCANNED_NO_ADDITIONAL_UNIQUE_STRICT_MATCH",
  },
  {
    fileName: "dokumen.pub_pinnacle-railway-maths-3rd-edition-english-medium.pdf",
    sha256: "AF72434BB299C507EA68DE642B1465BCA8A8EC49FD626F58795EB29CBE448218",
    sourceKind: "PINNACLE_BOOK",
    percentageChapter: "Percentage, printed pages around 389",
    extractionStatus: "CHAPTER_CONFIRMED_NO_ADDITIONAL_VERIFIED_MATCH_FROZEN",
  },
  {
    fileName: "Rakesh Yadav Maths 7300 Book PDF.pdf",
    sha256: "569F1F44D30237FD8559BF31BF4EB58BA88E04EB895D153ECBD832982D6A3A4C",
    sourceKind: "RAKESH_YADAV_BOOK",
    percentageChapter: "Percentage chapter present",
    extractionStatus: "IMAGE_ONLY_OCR_REQUIRED",
  },
  {
    fileName: "Maths Quantitative Aptitude Notes in English PDF.pdf",
    sha256: "8BF491F01C10D823660B5C423C0811D3FE7D9E5DA3B01EF2AB49E4FFD93790D1",
    sourceKind: "QUANTITATIVE_APTITUDE_NOTES",
    percentageChapter: "Percentage, chapter 5",
    extractionStatus: "CHAPTER_CONFIRMED_NO_ADDITIONAL_VERIFIED_MATCH_FROZEN",
  },
] as const;

export const USER_CORPUS_REVIEW_NOTES = {
  selectionRule:
    "Only questions that directly map a known percentage to a known quantity and ask for another percentage, including 100%, are included.",
  exclusions:
    "Complement, comparison, successive-change, profit-and-loss, data-interpretation, equation-first, and multi-stage percentage questions are excluded.",
  deduplication:
    "Near-identical repeats with the same values and relationship are represented once even when they occur in multiple books.",
  pdfCoverage:
    "The local source set includes 56 SSC shift PDFs plus the seven percentage-bearing books listed in the source inventory.",
  corpusShortfall:
    "The verified unique strict-family corpus is smaller than the requested 100-200 range. No synthetic, web, rewritten, or adjacent-task questions are used to pad it.",
  comparisonPolicy:
    "Book-solution comparison is recorded only when the matching worked solution was visible in the local PDF; answer-key-only items are marked not assessable.",
  mutationPolicy:
    "This qualification creates audit artifacts only. It does not change production code, language assets, realism policies, routing, or activation.",
} as const;

