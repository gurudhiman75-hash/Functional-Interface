import type { Com007Difficulty } from "./com007-software-languages-database-english-review-v1";

export const COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY = {
  "authorityId": "COM-007-SOFTWARE-LANGUAGES-DATABASE-ENGLISH-REVIEW-CANDIDATE-V1",
  "chapterCode": "COM-007",
  "title": "Software, Programming Languages and Database Basics",
  "status": "REVIEW_ONLY",
  "questionCount": 32,
  "questionsPerQl": 4,
  "qlIds": [
    "COM-007-QL-001",
    "COM-007-QL-002",
    "COM-007-QL-003",
    "COM-007-QL-004",
    "COM-007-QL-005",
    "COM-007-QL-006",
    "COM-007-QL-007",
    "COM-007-QL-008"
  ],
  "lifecycle": {
    "questionStudio": false,
    "questionBank": false,
    "tests": false,
    "mocks": false,
    "publicRelease": false,
    "production": false
  },
  "editorialRules": [
    "Use direct exam-level stems.",
    "Use short, simple explanations.",
    "Explain the full form of an abbreviation in the explanation.",
    "Reject unnecessary openings such as Consider the following.",
    "Reject associated and association wording.",
    "Keep each explanation to two short sentences or fewer."
  ],
  "sources": [
    {
      "id": "IBM-SYSTEM-APPLICATION",
      "url": "https://www.ibm.com/docs/en/zos/3.2.0?topic=reference-overview"
    },
    {
      "id": "IBM-COMPILED-INTERPRETED",
      "url": "https://www.ibm.com/docs/en/zos-basic-skills?topic=zos-compiled-versus-interpreted-languages"
    },
    {
      "id": "IBM-DBMS",
      "url": "https://www.ibm.com/docs/en/zos-basic-skills?topic=zos-what-is-database-management-system"
    },
    {
      "id": "IBM-UTILITY",
      "url": "https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-gpsi/ea119fae-dce9-426d-8c1e-40a51f0c3257"
    },
    {
      "id": "MICROSOFT-DRIVER",
      "url": "https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/introduction-to-plug-and-play"
    },
    {
      "id": "MICROSOFT-FIRMWARE",
      "url": "https://learn.microsoft.com/en-us/windows-hardware/drivers/bringup/windows-uefi-firmware-update-platform"
    },
    {
      "id": "PYTHON-HIGH-LEVEL",
      "url": "https://docs.python.org/3/tutorial/index.html"
    },
    {
      "id": "ORACLE-DATABASE",
      "url": "https://www.oracle.com/database/what-is-database/"
    },
    {
      "id": "ORACLE-RELATIONAL",
      "url": "https://docs.oracle.com/en/database/oracle/oracle-database/18/cncpt/introduction-to-oracle-database.html"
    },
    {
      "id": "ORACLE-PRIMARY-KEY",
      "url": "https://docs.oracle.com/en/database/other-databases/nosql-database/26.1/java-driver-table/primary-keys.html"
    },
    {
      "id": "ORACLE-SQL-OPS",
      "url": "https://docs.oracle.com/cd/B13789_01/appdev.101/b10807/06_ora.htm"
    },
    {
      "id": "ORACLE-SELECT",
      "url": "https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/SELECT.html"
    },
    {
      "id": "ORACLE-INSERT",
      "url": "https://docs.oracle.com/cd/B12037_01/appdev.101/b10807/13_elems025.htm"
    },
    {
      "id": "ORACLE-UPDATE",
      "url": "https://docs.oracle.com/en/database/oracle/oracle-database/12.2/sqlrf/UPDATE.html"
    },
    {
      "id": "ORACLE-DELETE",
      "url": "https://docs.oracle.com/en/database/oracle/oracle-database/26/sqlrf/DELETE.html"
    }
  ]
} as const;

export type Com007Difficulty = "EASY" | "MEDIUM";
export type Com007ReviewQuestion = { id:string; ql:string; topic:string; difficulty:Com007Difficulty; stem:string; options:readonly string[]; answer:string; explanation:string; source:readonly string[]; };
export const COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE: readonly Com007ReviewQuestion[] = Object.freeze([
  {
    "answer": "System software",
    "difficulty": "EASY",
    "explanation": "System software controls the computer and helps other programs run.",
    "id": "COM007-EN-001",
    "options": [
      "System software",
      "Application software",
      "Utility software",
      "Database software"
    ],
    "ql": "COM-007-QL-001",
    "source": [
      "IBM-SYSTEM-APPLICATION"
    ],
    "stem": "Which software controls the basic operation of a computer?",
    "topic": "Software types"
  },
  {
    "answer": "Word processor",
    "difficulty": "EASY",
    "explanation": "Application software helps a user do a specific task, such as writing a document.",
    "id": "COM007-EN-002",
    "options": [
      "Device driver",
      "Word processor",
      "Operating system",
      "Firmware"
    ],
    "ql": "COM-007-QL-001",
    "source": [
      "IBM-SYSTEM-APPLICATION"
    ],
    "stem": "Which is an example of application software?",
    "topic": "Software types"
  },
  {
    "answer": "System software",
    "difficulty": "EASY",
    "explanation": "An operating system is system software. It manages hardware and provides basic services.",
    "id": "COM007-EN-003",
    "options": [
      "Utility software",
      "Application software",
      "System software",
      "Firmware"
    ],
    "ql": "COM-007-QL-001",
    "source": [
      "IBM-SYSTEM-APPLICATION"
    ],
    "stem": "Which type of software is an operating system?",
    "topic": "Software types"
  },
  {
    "answer": "Application software",
    "difficulty": "EASY",
    "explanation": "Presentation software is application software. It helps a user create slides.",
    "id": "COM007-EN-004",
    "options": [
      "Device driver",
      "System software",
      "Firmware",
      "Application software"
    ],
    "ql": "COM-007-QL-001",
    "source": [
      "IBM-SYSTEM-APPLICATION"
    ],
    "stem": "Which software is used directly to prepare a presentation?",
    "topic": "Software types"
  },
  {
    "answer": "Maintaining and managing a computer",
    "difficulty": "EASY",
    "explanation": "Utility software helps maintain, manage or protect a computer.",
    "id": "COM007-EN-005",
    "options": [
      "Maintaining and managing a computer",
      "Writing only letters",
      "Connecting only to a printer",
      "Creating only websites"
    ],
    "ql": "COM-007-QL-002",
    "source": [
      "IBM-UTILITY"
    ],
    "stem": "What does utility software mainly help with?",
    "topic": "Utilities, drivers and firmware"
  },
  {
    "answer": "Communicate with hardware",
    "difficulty": "EASY",
    "explanation": "A device driver helps the operating system communicate with a hardware device.",
    "id": "COM007-EN-006",
    "options": [
      "Create a database",
      "Communicate with hardware",
      "Write a presentation",
      "Translate a website"
    ],
    "ql": "COM-007-QL-002",
    "source": [
      "MICROSOFT-DRIVER"
    ],
    "stem": "What does a device driver help the operating system do?",
    "topic": "Utilities, drivers and firmware"
  },
  {
    "answer": "Software stored in a device",
    "difficulty": "MEDIUM",
    "explanation": "Firmware is software stored in a device. It helps control that device.",
    "id": "COM007-EN-007",
    "options": [
      "A type of database table",
      "A temporary internet file",
      "Software stored in a device",
      "A document editing program"
    ],
    "ql": "COM-007-QL-002",
    "source": [
      "MICROSOFT-FIRMWARE"
    ],
    "stem": "What is firmware?",
    "topic": "Utilities, drivers and firmware"
  },
  {
    "answer": "Disk cleanup tool",
    "difficulty": "EASY",
    "explanation": "A disk cleanup tool helps manage unwanted files. It is utility software.",
    "id": "COM007-EN-008",
    "options": [
      "Word processor",
      "Web browser",
      "Operating system",
      "Disk cleanup tool"
    ],
    "ql": "COM-007-QL-002",
    "source": [
      "IBM-UTILITY"
    ],
    "stem": "Which is an example of utility software?",
    "topic": "Utilities, drivers and firmware"
  },
  {
    "answer": "Binary instructions",
    "difficulty": "EASY",
    "explanation": "Machine language uses binary instructions made of 0 and 1.",
    "id": "COM007-EN-009",
    "options": [
      "Binary instructions",
      "English sentences",
      "Database tables",
      "Pictures"
    ],
    "ql": "COM-007-QL-003",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "What does machine language use?",
    "topic": "Programming language basics"
  },
  {
    "answer": "Its commands are closer to human language",
    "difficulty": "EASY",
    "explanation": "A high-level language uses commands that are easier for people to read and write.",
    "id": "COM007-EN-010",
    "options": [
      "It uses only binary numbers",
      "Its commands are closer to human language",
      "It cannot be translated",
      "It works without a computer"
    ],
    "ql": "COM-007-QL-003",
    "source": [
      "PYTHON-HIGH-LEVEL"
    ],
    "stem": "Why is a high-level language easier for many people to use?",
    "topic": "Programming language basics"
  },
  {
    "answer": "Assembly language",
    "difficulty": "MEDIUM",
    "explanation": "Assembly language uses short instruction words close to machine instructions.",
    "id": "COM007-EN-011",
    "options": [
      "Python",
      "SQL",
      "Assembly language",
      "HTML"
    ],
    "ql": "COM-007-QL-003",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "Which language is closest to machine language?",
    "topic": "Programming language basics"
  },
  {
    "answer": "Working with data in a database",
    "difficulty": "EASY",
    "explanation": "SQL means Structured Query Language. It is used to work with data in databases.",
    "id": "COM007-EN-012",
    "options": [
      "Designing a keyboard",
      "Controlling a monitor",
      "Editing a photograph",
      "Working with data in a database"
    ],
    "ql": "COM-007-QL-003",
    "source": [
      "ORACLE-SQL-OPS"
    ],
    "stem": "What is SQL mainly used for?",
    "topic": "Programming language basics"
  },
  {
    "answer": "Translates a whole program before it runs",
    "difficulty": "MEDIUM",
    "explanation": "A compiler translates a whole program before the program runs.",
    "id": "COM007-EN-013",
    "options": [
      "Translates a whole program before it runs",
      "Runs only one letter at a time",
      "Stores files in a table",
      "Connects a printer"
    ],
    "ql": "COM-007-QL-004",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "What does a compiler usually do?",
    "topic": "Language translators"
  },
  {
    "answer": "Translates and runs one statement at a time",
    "difficulty": "MEDIUM",
    "explanation": "An interpreter translates and runs program statements one at a time.",
    "id": "COM007-EN-014",
    "options": [
      "Builds a computer",
      "Translates and runs one statement at a time",
      "Creates a primary key",
      "Stores firmware"
    ],
    "ql": "COM-007-QL-004",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "What does an interpreter usually do?",
    "topic": "Language translators"
  },
  {
    "answer": "Assembly language into machine language",
    "difficulty": "EASY",
    "explanation": "An assembler converts assembly language instructions into machine language.",
    "id": "COM007-EN-015",
    "options": [
      "Database tables into rows",
      "High-level language into English",
      "Assembly language into machine language",
      "A program into a printer"
    ],
    "ql": "COM-007-QL-004",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "What does an assembler convert?",
    "topic": "Language translators"
  },
  {
    "answer": "Compiler",
    "difficulty": "MEDIUM",
    "explanation": "A compiler normally prepares the complete program before it runs.",
    "id": "COM007-EN-016",
    "options": [
      "Interpreter",
      "Assembler",
      "Device driver",
      "Compiler"
    ],
    "ql": "COM-007-QL-004",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "Which translator normally prepares a complete program before it runs?",
    "topic": "Language translators"
  },
  {
    "answer": "Machine language",
    "difficulty": "MEDIUM",
    "explanation": "First-generation programming language means machine language. It uses binary instructions.",
    "id": "COM007-EN-017",
    "options": [
      "Machine language",
      "Assembly language",
      "Python",
      "SQL"
    ],
    "ql": "COM-007-QL-005",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "Which language belongs to the first generation of programming languages?",
    "topic": "Language generations"
  },
  {
    "answer": "Assembly language",
    "difficulty": "MEDIUM",
    "explanation": "Second-generation programming language means assembly language. It uses short instruction words.",
    "id": "COM007-EN-018",
    "options": [
      "Machine language",
      "Assembly language",
      "Python",
      "Database language"
    ],
    "ql": "COM-007-QL-005",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "Which language belongs to the second generation of programming languages?",
    "topic": "Language generations"
  },
  {
    "answer": "Their commands are more like human language",
    "difficulty": "EASY",
    "explanation": "Third-generation languages use commands that are easier for people to read than machine instructions.",
    "id": "COM007-EN-019",
    "options": [
      "They use only 0 and 1",
      "They are stored only in firmware",
      "Their commands are more like human language",
      "They cannot be translated"
    ],
    "ql": "COM-007-QL-005",
    "source": [
      "IBM-COMPILED-INTERPRETED"
    ],
    "stem": "What is a common feature of third-generation languages?",
    "topic": "Language generations"
  },
  {
    "answer": "Python",
    "difficulty": "EASY",
    "explanation": "Python is a high-level programming language. Its commands are easier for people to read.",
    "id": "COM007-EN-020",
    "options": [
      "Machine language",
      "Assembly language",
      "Binary code",
      "Python"
    ],
    "ql": "COM-007-QL-005",
    "source": [
      "PYTHON-HIGH-LEVEL"
    ],
    "stem": "Which is an example of a high-level programming language?",
    "topic": "Language generations"
  },
  {
    "answer": "An organized collection of data",
    "difficulty": "EASY",
    "explanation": "A database is an organized collection of data stored for use.",
    "id": "COM007-EN-021",
    "options": [
      "An organized collection of data",
      "A type of monitor",
      "A printer cable",
      "A computer game"
    ],
    "ql": "COM-007-QL-006",
    "source": [
      "ORACLE-DATABASE"
    ],
    "stem": "What is a database?",
    "topic": "Database and DBMS basics"
  },
  {
    "answer": "Database Management System",
    "difficulty": "EASY",
    "explanation": "DBMS means Database Management System. It is software used to manage a database.",
    "id": "COM007-EN-022",
    "options": [
      "Data Backup Machine Service",
      "Database Management System",
      "Digital Basic Memory System",
      "Database Machine Storage"
    ],
    "ql": "COM-007-QL-006",
    "source": [
      "IBM-DBMS"
    ],
    "stem": "What is the full form of DBMS?",
    "topic": "Database and DBMS basics"
  },
  {
    "answer": "Managing data in a database",
    "difficulty": "EASY",
    "explanation": "A Database Management System stores and manages data in a database.",
    "id": "COM007-EN-023",
    "options": [
      "Increasing screen size",
      "Charging a laptop",
      "Managing data in a database",
      "Printing a document"
    ],
    "ql": "COM-007-QL-006",
    "source": [
      "IBM-DBMS"
    ],
    "stem": "What is a main job of a Database Management System?",
    "topic": "Database and DBMS basics"
  },
  {
    "answer": "In tables",
    "difficulty": "EASY",
    "explanation": "A relational database stores data in tables made of rows and columns.",
    "id": "COM007-EN-024",
    "options": [
      "Only as pictures",
      "Only as sound",
      "Only as passwords",
      "In tables"
    ],
    "ql": "COM-007-QL-006",
    "source": [
      "ORACLE-RELATIONAL"
    ],
    "stem": "How is data usually arranged in a relational database?",
    "topic": "Database and DBMS basics"
  },
  {
    "answer": "One record",
    "difficulty": "EASY",
    "explanation": "A row usually contains one complete record in a table.",
    "id": "COM007-EN-025",
    "options": [
      "One record",
      "One database program",
      "One monitor",
      "One password rule"
    ],
    "ql": "COM-007-QL-007",
    "source": [
      "ORACLE-RELATIONAL"
    ],
    "stem": "In a database table, what does a row usually represent?",
    "topic": "Tables, rows, columns and keys"
  },
  {
    "answer": "A field or data item",
    "difficulty": "EASY",
    "explanation": "A column stores one type of data for the records in a table.",
    "id": "COM007-EN-026",
    "options": [
      "A whole database",
      "A field or data item",
      "A computer screen",
      "A software update"
    ],
    "ql": "COM-007-QL-007",
    "source": [
      "ORACLE-RELATIONAL"
    ],
    "stem": "In a database table, what does a column usually represent?",
    "topic": "Tables, rows, columns and keys"
  },
  {
    "answer": "To identify each row uniquely",
    "difficulty": "MEDIUM",
    "explanation": "A primary key uniquely identifies each row in a table.",
    "id": "COM007-EN-027",
    "options": [
      "To change the screen colour",
      "To start a printer",
      "To identify each row uniquely",
      "To translate a program"
    ],
    "ql": "COM-007-QL-007",
    "source": [
      "ORACLE-PRIMARY-KEY"
    ],
    "stem": "What is the purpose of a primary key?",
    "topic": "Tables, rows, columns and keys"
  },
  {
    "answer": "Links data in related tables",
    "difficulty": "MEDIUM",
    "explanation": "A foreign key helps link a row in one table to a row in another table.",
    "id": "COM007-EN-028",
    "options": [
      "Deletes every table",
      "Changes machine language",
      "Starts the operating system",
      "Links data in related tables"
    ],
    "ql": "COM-007-QL-007",
    "source": [
      "ORACLE-RELATIONAL"
    ],
    "stem": "What does a foreign key usually do?",
    "topic": "Tables, rows, columns and keys"
  },
  {
    "answer": "SELECT",
    "difficulty": "EASY",
    "explanation": "SQL means Structured Query Language. SELECT is used to read data from a database.",
    "id": "COM007-EN-029",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "ql": "COM-007-QL-008",
    "source": [
      "ORACLE-SELECT"
    ],
    "stem": "Which SQL command is used to read data?",
    "topic": "Basic SQL commands"
  },
  {
    "answer": "INSERT",
    "difficulty": "EASY",
    "explanation": "SQL means Structured Query Language. INSERT adds new rows to a table.",
    "id": "COM007-EN-030",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "ql": "COM-007-QL-008",
    "source": [
      "ORACLE-INSERT"
    ],
    "stem": "Which SQL command adds new data to a table?",
    "topic": "Basic SQL commands"
  },
  {
    "answer": "UPDATE",
    "difficulty": "EASY",
    "explanation": "SQL means Structured Query Language. UPDATE changes existing values in a table.",
    "id": "COM007-EN-031",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "ql": "COM-007-QL-008",
    "source": [
      "ORACLE-UPDATE"
    ],
    "stem": "Which SQL command changes existing data?",
    "topic": "Basic SQL commands"
  },
  {
    "answer": "DELETE",
    "difficulty": "EASY",
    "explanation": "SQL means Structured Query Language. DELETE removes rows from a table.",
    "id": "COM007-EN-032",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "ql": "COM-007-QL-008",
    "source": [
      "ORACLE-DELETE"
    ],
    "stem": "Which SQL command removes rows from a table?",
    "topic": "Basic SQL commands"
  }
]);

export function auditCom007SoftwareLanguagesDatabaseEnglishReviewV1() {
  const issues:string[] = [];
  const sourceIds = new Set(COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY.sources.map((source) => source.id));
  if (COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE.length !== 32) issues.push("QUESTION_COUNT");
  if (new Set(COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE.map((q) => q.id)).size !== 32) issues.push("DUPLICATE_ID");
  for (const q of COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE) {
    if (!COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY.qlIds.includes(q.ql)) issues.push("QL:" + q.id);
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.id);
    if (q.options.indexOf(q.answer) !== (Number(q.id.slice(-3))-1)%4) issues.push("ANSWER_POSITION:" + q.id);
    if (!q.source.every((id) => sourceIds.has(id))) issues.push("SOURCE:" + q.id);
    if (/^(consider the following|which of the following|select the correct|choose the correct)/i.test(q.stem)) issues.push("UNNECESSARY_OPENING:" + q.id);
    if (/associat\w*/i.test(q.stem + " " + q.explanation)) issues.push("FORMAL_WORDING:" + q.id);
    if (!q.stem.trim() || !q.explanation.trim()) issues.push("EMPTY:" + q.id);
    if (q.explanation.split(/[.!?]/).filter(Boolean).length > 2) issues.push("EXPLANATION_LENGTH:" + q.id);
  }
  return {valid:issues.length===0,issues,questionCount:COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE.length,qlCount:COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY.qlIds.length};
}
