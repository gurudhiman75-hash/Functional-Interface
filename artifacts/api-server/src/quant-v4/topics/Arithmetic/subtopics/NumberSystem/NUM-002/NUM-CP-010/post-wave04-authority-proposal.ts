export const NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL = Object.freeze([
  Object.freeze({ authorityKey: "CP010-AUTH-001", label: "Decimal place value — direct and inverse", prototypes: Object.freeze(["NUM-CP010-PROT-001", "NUM-CP010-PROT-009", "NUM-CP010-PROT-010"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-002", label: "Missing digit from digit aggregate", prototypes: Object.freeze(["NUM-CP010-PROT-002"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-003", label: "Number reversal / digit interchange reconstruction", prototypes: Object.freeze(["NUM-CP010-PROT-003", "NUM-CP010-PROT-004", "NUM-CP010-PROT-023"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-004", label: "Single-unknown column addition digit reconstruction", prototypes: Object.freeze(["NUM-CP010-PROT-005", "NUM-CP010-PROT-011"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-005", label: "Two-unknown column addition reconstruction", prototypes: Object.freeze(["NUM-CP010-PROT-020"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-006", label: "Column subtraction digit reconstruction", prototypes: Object.freeze(["NUM-CP010-PROT-006", "NUM-CP010-PROT-012"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-007", label: "Palindrome reconstruction", prototypes: Object.freeze(["NUM-CP010-PROT-007", "NUM-CP010-PROT-016"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-008", label: "Relational / consecutive digit reconstruction", prototypes: Object.freeze(["NUM-CP010-PROT-008", "NUM-CP010-PROT-024"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-009", label: "Least or greatest numeral under digit constraints", prototypes: Object.freeze(["NUM-CP010-PROT-013"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-010", label: "Complete valid digit/number set under decimal constraints", prototypes: Object.freeze(["NUM-CP010-PROT-014", "NUM-CP010-PROT-019"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-011", label: "Bounded digit-occurrence count", prototypes: Object.freeze(["NUM-CP010-PROT-015", "NUM-CP010-PROT-026"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-012", label: "Exact number of decimal digits", prototypes: Object.freeze(["NUM-CP010-PROT-017"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-013", label: "Digit-constraint solution multiplicity classification", prototypes: Object.freeze(["NUM-CP010-PROT-018"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-014", label: "Missing digit in multiplication with carry", prototypes: Object.freeze(["NUM-CP010-PROT-021"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-015", label: "Repeated decimal block / concatenation reconstruction", prototypes: Object.freeze(["NUM-CP010-PROT-022"]) }),
  Object.freeze({ authorityKey: "CP010-AUTH-016", label: "Digital root / repeated digit-sum reduction", prototypes: Object.freeze(["NUM-CP010-PROT-025"]) }),
] as const);

export const NUM_CP010_PROPOSED_AUTHORITY_COUNT = NUM_CP010_ID_FREE_AUTHORITY_PROPOSAL.length;
