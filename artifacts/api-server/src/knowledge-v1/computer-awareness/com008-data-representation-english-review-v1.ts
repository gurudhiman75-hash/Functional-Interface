export const COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_AUTHORITY = {
  "authorityId": "COM-008-DATA-REPRESENTATION-ENGLISH-REVIEW-CANDIDATE-V1",
  "chapterCode": "COM-008",
  "title": "Data Representation, Number Systems and Computer Codes",
  "status": "REVIEW_ONLY",
  "questionCount": 32,
  "questionsPerQl": 4,
  "qlIds": [
    "COM-008-QL-001",
    "COM-008-QL-002",
    "COM-008-QL-003",
    "COM-008-QL-004",
    "COM-008-QL-005",
    "COM-008-QL-006",
    "COM-008-QL-007",
    "COM-008-QL-008"
  ],
  "lifecycle": {
    "questionStudio": true,
    "questionBank": false,
    "tests": false,
    "mocks": false,
    "publicRelease": false,
    "production": false
  },
  "editorialRules": [
    "Use direct exam-level stems.",
    "Use short, simple explanations.",
    "Write the full form of every abbreviation used in an explanation.",
    "Reject unnecessary openings.",
    "Do not use associated or association as filler wording.",
    "Keep Easy and Medium only."
  ],
  "sources": [
    {
      "id": "LIB-ARIHANT-DATA-REPRESENTATION-NUMBER-SYSTEMS",
      "description": "Uploaded Computer Awareness source, Data Representation chapter, number systems."
    },
    {
      "id": "LIB-ARIHANT-DATA-REPRESENTATION-UNITS",
      "description": "Uploaded Computer Awareness source, bits, bytes and storage units."
    },
    {
      "id": "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION",
      "description": "Uploaded Computer Awareness source, number-system conversion examples."
    },
    {
      "id": "LIB-ARIHANT-DATA-REPRESENTATION-CODES",
      "description": "Uploaded Computer Awareness source, BCD, ASCII, EBCDIC and Unicode."
    }
  ]
} as const;

export type Com008Difficulty = "EASY" | "MEDIUM";
export type Com008ReviewQuestion = { id:string; ql:string; difficulty:Com008Difficulty; stem:string; options:readonly string[]; answer:string; explanation:string; source:readonly string[]; };
export const COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_CANDIDATE:readonly Com008ReviewQuestion[] = Object.freeze([
  {
    "answer": "Binary",
    "difficulty": "EASY",
    "explanation": "The binary number system uses only 0 and 1.",
    "id": "COM008-EN-001",
    "options": [
      "Binary",
      "Decimal",
      "Octal",
      "Hexadecimal"
    ],
    "ql": "COM-008-QL-001",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-NUMBER-SYSTEMS"
    ],
    "stem": "Which number system uses only 0 and 1?"
  },
  {
    "answer": "8",
    "difficulty": "EASY",
    "explanation": "The octal number system has base 8.",
    "id": "COM008-EN-002",
    "options": [
      "2",
      "8",
      "10",
      "16"
    ],
    "ql": "COM-008-QL-001",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-NUMBER-SYSTEMS"
    ],
    "stem": "What is the base of the octal number system?"
  },
  {
    "answer": "0 to 9 and A to F",
    "difficulty": "MEDIUM",
    "explanation": "The hexadecimal system uses 0 to 9 and A to F.",
    "id": "COM008-EN-003",
    "options": [
      "0 to 9 and A to F",
      "0 and 1 only",
      "0 to 7 only",
      "1 to 16 only"
    ],
    "ql": "COM-008-QL-001",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-NUMBER-SYSTEMS"
    ],
    "stem": "Which symbols can appear in a hexadecimal number?"
  },
  {
    "answer": "Base 10",
    "difficulty": "EASY",
    "explanation": "The decimal number system uses base 10.",
    "id": "COM008-EN-004",
    "options": [
      "Base 2",
      "Base 8",
      "Base 10",
      "Base 16"
    ],
    "ql": "COM-008-QL-001",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-NUMBER-SYSTEMS"
    ],
    "stem": "Which base is used by the decimal number system?"
  },
  {
    "answer": "Bit",
    "difficulty": "EASY",
    "explanation": "A bit is the smallest unit of digital data. Bit means binary digit.",
    "id": "COM008-EN-005",
    "options": [
      "Bit",
      "Byte",
      "Nibble",
      "Kilobyte"
    ],
    "ql": "COM-008-QL-002",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "What is the smallest unit of digital data?"
  },
  {
    "answer": "4 bits",
    "difficulty": "EASY",
    "explanation": "One nibble contains 4 bits. Bit means binary digit.",
    "id": "COM008-EN-006",
    "options": [
      "2 bits",
      "4 bits",
      "8 bits",
      "16 bits"
    ],
    "ql": "COM-008-QL-002",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "How many bits make one nibble?"
  },
  {
    "answer": "8 bits",
    "difficulty": "EASY",
    "explanation": "One byte contains 8 bits. Bit means binary digit.",
    "id": "COM008-EN-007",
    "options": [
      "4 bits",
      "8 bits",
      "16 bits",
      "32 bits"
    ],
    "ql": "COM-008-QL-002",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "How many bits make one byte?"
  },
  {
    "answer": "1024 bytes",
    "difficulty": "MEDIUM",
    "explanation": "1 KB means 1024 bytes. KB means kilobyte.",
    "id": "COM008-EN-008",
    "options": [
      "1024 bytes",
      "1024 bits",
      "100 bytes",
      "8 bytes"
    ],
    "ql": "COM-008-QL-002",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "1 KB equals:"
  },
  {
    "answer": "Terabyte",
    "difficulty": "EASY",
    "explanation": "A terabyte is larger than a gigabyte, megabyte and kilobyte.",
    "id": "COM008-EN-009",
    "options": [
      "Kilobyte",
      "Megabyte",
      "Gigabyte",
      "Terabyte"
    ],
    "ql": "COM-008-QL-003",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "Which is the largest storage unit?"
  },
  {
    "answer": "Bit, nibble, byte, kilobyte",
    "difficulty": "EASY",
    "explanation": "The order is bit, nibble, byte and kilobyte.",
    "id": "COM008-EN-010",
    "options": [
      "Bit, nibble, byte, kilobyte",
      "Byte, bit, nibble, kilobyte",
      "Kilobyte, byte, nibble, bit",
      "Nibble, bit, kilobyte, byte"
    ],
    "ql": "COM-008-QL-003",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "Which order is correct from smallest to largest?"
  },
  {
    "answer": "1024 KB",
    "difficulty": "EASY",
    "explanation": "1 MB equals 1024 KB. KB means kilobyte and MB means megabyte.",
    "id": "COM008-EN-011",
    "options": [
      "1024 KB",
      "1024 MB",
      "1000 GB",
      "8 KB"
    ],
    "ql": "COM-008-QL-003",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "How many KB make 1 MB?"
  },
  {
    "answer": "1024 MB",
    "difficulty": "EASY",
    "explanation": "1 GB equals 1024 MB. MB means megabyte and GB means gigabyte.",
    "id": "COM008-EN-012",
    "options": [
      "1024 KB",
      "1024 MB",
      "1024 GB",
      "1024 TB"
    ],
    "ql": "COM-008-QL-003",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-UNITS"
    ],
    "stem": "How many MB make 1 GB?"
  },
  {
    "answer": "10",
    "difficulty": "MEDIUM",
    "explanation": "The binary number 1010 equals 10 in the decimal system.",
    "id": "COM008-EN-013",
    "options": [
      "8",
      "10",
      "12",
      "14"
    ],
    "ql": "COM-008-QL-004",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the decimal value of (1010)₂?"
  },
  {
    "answer": "101",
    "difficulty": "EASY",
    "explanation": "Decimal 5 is written as 101 in the binary system.",
    "id": "COM008-EN-014",
    "options": [
      "100",
      "101",
      "110",
      "111"
    ],
    "ql": "COM-008-QL-004",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the binary form of decimal 5?"
  },
  {
    "answer": "15",
    "difficulty": "MEDIUM",
    "explanation": "The binary number 1111 equals 15 in the decimal system.",
    "id": "COM008-EN-015",
    "options": [
      "10",
      "12",
      "15",
      "16"
    ],
    "ql": "COM-008-QL-004",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the decimal value of (1111)₂?"
  },
  {
    "answer": "1000",
    "difficulty": "EASY",
    "explanation": "Decimal 8 is written as 1000 in the binary system.",
    "id": "COM008-EN-016",
    "options": [
      "100",
      "1000",
      "1010",
      "1100"
    ],
    "ql": "COM-008-QL-004",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the binary form of decimal 8?"
  },
  {
    "answer": "8",
    "difficulty": "EASY",
    "explanation": "The octal number 10 equals 8 in the decimal system.",
    "id": "COM008-EN-017",
    "options": [
      "6",
      "8",
      "10",
      "12"
    ],
    "ql": "COM-008-QL-005",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the decimal value of (10)₈?"
  },
  {
    "answer": "10",
    "difficulty": "EASY",
    "explanation": "In hexadecimal, A represents decimal 10.",
    "id": "COM008-EN-018",
    "options": [
      "8",
      "10",
      "12",
      "16"
    ],
    "ql": "COM-008-QL-005",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the decimal value of (A)₁₆?"
  },
  {
    "answer": "A",
    "difficulty": "EASY",
    "explanation": "Four binary bits 1010 represent hexadecimal A.",
    "id": "COM008-EN-019",
    "options": [
      "A",
      "B",
      "C",
      "F"
    ],
    "ql": "COM-008-QL-005",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the hexadecimal form of binary 1010?"
  },
  {
    "answer": "7",
    "difficulty": "EASY",
    "explanation": "Three binary bits 111 represent octal 7.",
    "id": "COM008-EN-020",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "ql": "COM-008-QL-005",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the octal form of binary 111?"
  },
  {
    "answer": "13",
    "difficulty": "MEDIUM",
    "explanation": "The binary number 1101 equals 13 in the decimal system.",
    "id": "COM008-EN-021",
    "options": [
      "11",
      "12",
      "13",
      "14"
    ],
    "ql": "COM-008-QL-006",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the decimal value of binary 1101?"
  },
  {
    "answer": "1111",
    "difficulty": "EASY",
    "explanation": "Hexadecimal F represents binary 1111.",
    "id": "COM008-EN-022",
    "options": [
      "1110",
      "1111",
      "1010",
      "1001"
    ],
    "ql": "COM-008-QL-006",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the binary form of hexadecimal F?"
  },
  {
    "answer": "101",
    "difficulty": "EASY",
    "explanation": "Octal 5 represents binary 101.",
    "id": "COM008-EN-023",
    "options": [
      "001",
      "010",
      "101",
      "111"
    ],
    "ql": "COM-008-QL-006",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the binary form of octal 5?"
  },
  {
    "answer": "40",
    "difficulty": "MEDIUM",
    "explanation": "Group the binary digits in threes: 100 000. This gives octal 40.",
    "id": "COM008-EN-024",
    "options": [
      "20",
      "40",
      "80",
      "100"
    ],
    "ql": "COM-008-QL-006",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CONVERSION"
    ],
    "stem": "What is the octal form of binary 100000?"
  },
  {
    "answer": "Binary Coded Decimal",
    "difficulty": "EASY",
    "explanation": "BCD means Binary Coded Decimal. It represents decimal digits with binary digits.",
    "id": "COM008-EN-025",
    "options": [
      "Binary Coded Decimal",
      "Basic Code Data",
      "Binary Character Data",
      "Byte Coded Decimal"
    ],
    "ql": "COM-008-QL-007",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "What is the full form of BCD?"
  },
  {
    "answer": "American Standard Code for Information Interchange",
    "difficulty": "EASY",
    "explanation": "ASCII means American Standard Code for Information Interchange. It is a character code.",
    "id": "COM008-EN-026",
    "options": [
      "American Standard Code for Information Interchange",
      "Advanced Standard Code for Internet Information",
      "American System Code for Internal Information",
      "Automatic Standard Code for Information Input"
    ],
    "ql": "COM-008-QL-007",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "What is the full form of ASCII?"
  },
  {
    "answer": "Extended Binary Coded Decimal Interchange Code",
    "difficulty": "EASY",
    "explanation": "EBCDIC means Extended Binary Coded Decimal Interchange Code. It is a character code.",
    "id": "COM008-EN-027",
    "options": [
      "Extended Binary Coded Decimal Interchange Code",
      "Extended Byte Code for Digital Information Control",
      "Electronic Binary Character Data Information Code",
      "External Binary Coded Data Internet Code"
    ],
    "ql": "COM-008-QL-007",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "What is the full form of EBCDIC?"
  },
  {
    "answer": "Representing characters from many writing systems",
    "difficulty": "EASY",
    "explanation": "Unicode represents characters from many writing systems and languages.",
    "id": "COM008-EN-028",
    "options": [
      "Storing only numbers",
      "Representing characters from many writing systems",
      "Connecting printers",
      "Measuring processor speed"
    ],
    "ql": "COM-008-QL-007",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "What is the main use of Unicode?"
  },
  {
    "answer": "It uses four bits for each decimal digit",
    "difficulty": "MEDIUM",
    "explanation": "BCD means Binary Coded Decimal. It uses four bits for each decimal digit.",
    "id": "COM008-EN-029",
    "options": [
      "It uses four bits for each decimal digit",
      "It uses only letters",
      "It uses one byte for every word",
      "It uses eight bits for every decimal digit"
    ],
    "ql": "COM-008-QL-008",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "How does BCD represent a decimal number?"
  },
  {
    "answer": "7",
    "difficulty": "EASY",
    "explanation": "ASCII means American Standard Code for Information Interchange. ASCII-7 uses 7 bits.",
    "id": "COM008-EN-030",
    "options": [
      "7",
      "8",
      "16",
      "32"
    ],
    "ql": "COM-008-QL-008",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "How many bits are used in ASCII-7?"
  },
  {
    "answer": "Unicode",
    "difficulty": "EASY",
    "explanation": "Unicode is designed to represent characters from many languages and writing systems.",
    "id": "COM008-EN-031",
    "options": [
      "BCD",
      "ASCII",
      "Unicode",
      "Machine language"
    ],
    "ql": "COM-008-QL-008",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "Which code is useful for characters from many languages?"
  },
  {
    "answer": "EBCDIC",
    "difficulty": "MEDIUM",
    "explanation": "EBCDIC means Extended Binary Coded Decimal Interchange Code. It represents characters using eight bits.",
    "id": "COM008-EN-032",
    "options": [
      "EBCDIC",
      "ASCII-7",
      "BCD",
      "Binary number system"
    ],
    "ql": "COM-008-QL-008",
    "source": [
      "LIB-ARIHANT-DATA-REPRESENTATION-CODES"
    ],
    "stem": "Which code uses eight bits for each character in the source description?"
  }
]);

export function auditCom008EnglishReviewV1() {
  const issues:string[]=[];
  const qlIds=[...new Set(COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_CANDIDATE.map((q)=>q.ql))];
  if(COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_CANDIDATE.length!==32) issues.push("QUESTION_COUNT");
  if(qlIds.length!==8) issues.push("QL_COUNT");
  for(const q of COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_CANDIDATE) {
    if(q.options.length!==4 || new Set(q.options).size!==4) issues.push(`OPTIONS:${q.id}`);
    if(!q.options.includes(q.answer)) issues.push(`ANSWER:${q.id}`);
    if(/^(In the following|Consider the following|Read the question carefully|Please select|Which of the following)/i.test(q.stem)) issues.push(`STEM_OPENING:${q.id}`);
    if(/associated|association/i.test(`${q.stem} ${q.explanation}`)) issues.push(`ASSOCIATED:${q.id}`);
    if(q.explanation.split(/\s+/).filter(Boolean).length>28) issues.push(`EXPLANATION_LENGTH:${q.id}`);
  }
  return {valid:issues.length===0,issues,questionCount:COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_CANDIDATE.length,qlCount:qlIds.length};
}