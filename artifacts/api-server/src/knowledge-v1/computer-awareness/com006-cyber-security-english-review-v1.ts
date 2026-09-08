export type Com006Difficulty = "EASY" | "MEDIUM";

export type Com006CyberSecurityReviewQuestion = {
  id: string;
  ql: string;
  topic: string;
  difficulty: Com006Difficulty;
  stem: string;
  options: readonly string[];
  answer: string;
  explanation: string;
  source: readonly string[];
};

export const COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY = {
  "authorityId": "COM-006-CYBER-SECURITY-ENGLISH-REVIEW-CANDIDATE-V1",
  "chapterCode": "COM-006",
  "title": "Cyber Security",
  "status": "REVIEW_ONLY",
  "questionCount": 32,
  "questionsPerQl": 4,
  "qlIds": [
    "COM-006-QL-001",
    "COM-006-QL-002",
    "COM-006-QL-003",
    "COM-006-QL-004",
    "COM-006-QL-005",
    "COM-006-QL-006",
    "COM-006-QL-007",
    "COM-006-QL-008"
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
    "Explain the full form of an abbreviation in the explanation when an abbreviation is used.",
    "Reject unnecessary openings such as Consider the following.",
    "Reject associated and association wording.",
    "Keep each explanation to two short sentences or fewer."
  ],
  "sources": [
    {
      "id": "NIST-CIA",
      "url": "https://csrc.nist.gov/glossary/term/confidentiality_integrity_and_availability"
    },
    {
      "id": "NIST-CONFIDENTIALITY",
      "url": "https://csrc.nist.gov/glossary/term/confidentiality"
    },
    {
      "id": "NIST-INTEGRITY",
      "url": "https://csrc.nist.gov/glossary/term/integrity"
    },
    {
      "id": "NIST-AVAILABILITY",
      "url": "https://csrc.nist.gov/glossary/term/availability"
    },
    {
      "id": "CISA-RANSOMWARE",
      "url": "https://www.cisa.gov/stopransomware/ransomware-guide"
    },
    {
      "id": "CISA-PHISHING",
      "url": "https://www.cisa.gov/topics/cyber-threats-and-advisories/phishing"
    },
    {
      "id": "CISA-PASSWORDS",
      "url": "https://www.cisa.gov/secure-our-world/use-strong-passwords"
    },
    {
      "id": "NIST-MFA",
      "url": "https://csrc.nist.gov/glossary/term/multi_factor_authentication"
    },
    {
      "id": "NIST-FIREWALL",
      "url": "https://csrc.nist.gov/glossary/term/firewall"
    },
    {
      "id": "CISA-ANTIMALWARE",
      "url": "https://www.cisa.gov/topics/cyber-threats-and-advisories/malware"
    },
    {
      "id": "CISA-UPDATES",
      "url": "https://www.cisa.gov/secure-our-world/update-software"
    },
    {
      "id": "CISA-RANSOMWARE-BACKUP",
      "url": "https://www.cisa.gov/stopransomware/ransomware-guide"
    },
    {
      "id": "NIST-ENCRYPTION",
      "url": "https://csrc.nist.gov/glossary/term/encryption"
    },
    {
      "id": "NIST-DIGITAL-SIGNATURE",
      "url": "https://csrc.nist.gov/glossary/term/digital_signature"
    },
    {
      "id": "NIST-SPYWARE",
      "url": "https://csrc.nist.gov/glossary/term/spyware"
    },
    {
      "id": "NIST-WORM",
      "url": "https://csrc.nist.gov/glossary/term/worm"
    },
    {
      "id": "NIST-TROJAN",
      "url": "https://csrc.nist.gov/glossary/term/trojan_horse"
    },
    {
      "id": "NIST-SOCIAL-ENGINEERING",
      "url": "https://csrc.nist.gov/glossary/term/social_engineering"
    },
    {
      "id": "NIST-OTP",
      "url": "https://csrc.nist.gov/glossary/term/one_time_password"
    },
    {
      "id": "NIST-LEAST-PRIVILEGE",
      "url": "https://csrc.nist.gov/glossary/term/least_privilege"
    },
    {
      "id": "CISA-PUBLIC-WIFI",
      "url": "https://www.cisa.gov/news-events/news/secure-your-wi-fi-network"
    },
    {
      "id": "CISA-USB",
      "url": "https://www.cisa.gov/news-events/news/using-caution-usb-drives"
    },
    {
      "id": "CISA-CYBER-HYGIENE",
      "url": "https://www.cisa.gov/topics/cyber-threats-and-advisories/cyber-hygiene-services"
    },
    {
      "id": "NIST-SHOULDER-SURFING",
      "url": "https://csrc.nist.gov/glossary/term/shoulder_surfing"
    },
    {
      "id": "CISA-ACCOUNT-SECURITY",
      "url": "https://www.cisa.gov/secure-our-world/use-strong-passwords"
    },
    {
      "id": "CISA-REPORTING",
      "url": "https://www.cisa.gov/ report"
    },
    {
      "id": "CISA-MALWARE-REPORTING",
      "url": "https://www.cisa.gov/topics/cyber-threats-and-advisories/malware"
    }
  ]
} as const;

export const COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE: readonly Com006CyberSecurityReviewQuestion[] = Object.freeze([
  {
    "id": "COM006-EN-001",
    "ql": "COM-006-QL-001",
    "topic": "Security basics",
    "difficulty": "EASY",
    "stem": "What does the CIA triad protect?",
    "options": [
      "Confidentiality, integrity and availability",
      "Speed, size and cost",
      "Input, output and storage",
      "Files, folders and printers"
    ],
    "answer": "Confidentiality, integrity and availability",
    "explanation": "CIA means confidentiality, integrity and availability. These are three basic goals of computer security.",
    "source": [
      "NIST-CIA"
    ]
  },
  {
    "id": "COM006-EN-002",
    "ql": "COM-006-QL-001",
    "topic": "Security basics",
    "difficulty": "EASY",
    "stem": "What does confidentiality mean?",
    "options": [
      "Only allowed people can see the data",
      "Data is always available",
      "Data is processed quickly",
      "Data is printed correctly"
    ],
    "answer": "Only allowed people can see the data",
    "explanation": "Confidentiality keeps data away from people who are not allowed to see it.",
    "source": [
      "NIST-CONFIDENTIALITY"
    ]
  },
  {
    "id": "COM006-EN-003",
    "ql": "COM-006-QL-001",
    "topic": "Security basics",
    "difficulty": "EASY",
    "stem": "What does integrity mean?",
    "options": [
      "Data stays correct and unchanged",
      "Anyone can read the data",
      "A device works without power",
      "A file is always deleted"
    ],
    "answer": "Data stays correct and unchanged",
    "explanation": "Integrity means data stays correct and is not changed without permission.",
    "source": [
      "NIST-INTEGRITY"
    ]
  },
  {
    "id": "COM006-EN-004",
    "ql": "COM-006-QL-001",
    "topic": "Security basics",
    "difficulty": "EASY",
    "stem": "What does availability mean?",
    "options": [
      "Data and services are ready when needed",
      "Data is hidden from everyone",
      "A password is shared",
      "A file is copied without checking"
    ],
    "answer": "Data and services are ready when needed",
    "explanation": "Availability means an authorized user can use the data or service when needed.",
    "source": [
      "NIST-AVAILABILITY"
    ]
  },
  {
    "id": "COM006-EN-005",
    "ql": "COM-006-QL-002",
    "topic": "Malware",
    "difficulty": "EASY",
    "stem": "Which malware locks files and asks for money?",
    "options": [
      "Ransomware",
      "Spyware",
      "Worm",
      "Antivirus"
    ],
    "answer": "Ransomware",
    "explanation": "Ransomware is malicious software that locks or encrypts files and asks for payment.",
    "source": [
      "CISA-RANSOMWARE"
    ]
  },
  {
    "id": "COM006-EN-006",
    "ql": "COM-006-QL-002",
    "topic": "Malware",
    "difficulty": "EASY",
    "stem": "Which malware secretly watches user activity?",
    "options": [
      "Spyware",
      "Firewall",
      "Ransomware",
      "Compiler"
    ],
    "answer": "Spyware",
    "explanation": "Spyware is malicious software that secretly collects information about a user or device.",
    "source": [
      "NIST-SPYWARE"
    ]
  },
  {
    "id": "COM006-EN-007",
    "ql": "COM-006-QL-002",
    "topic": "Malware",
    "difficulty": "MEDIUM",
    "stem": "Which malware can copy itself and spread through a network?",
    "options": [
      "Worm",
      "Trojan horse",
      "Spyware",
      "Screen lock"
    ],
    "answer": "Worm",
    "explanation": "A worm can copy itself and spread from one device to another through a network.",
    "source": [
      "NIST-WORM"
    ]
  },
  {
    "id": "COM006-EN-008",
    "ql": "COM-006-QL-002",
    "topic": "Malware",
    "difficulty": "EASY",
    "stem": "What is a Trojan horse in computer security?",
    "options": [
      "A harmful program that looks useful",
      "A device that blocks traffic",
      "A safe backup copy",
      "A type of printer"
    ],
    "answer": "A harmful program that looks useful",
    "explanation": "A Trojan horse looks like a useful program but performs a harmful action after it is opened.",
    "source": [
      "NIST-TROJAN"
    ]
  },
  {
    "id": "COM006-EN-009",
    "ql": "COM-006-QL-003",
    "topic": "Phishing and social engineering",
    "difficulty": "EASY",
    "stem": "What is phishing?",
    "options": [
      "A fake message used to steal information",
      "A method of saving files",
      "A way to cool a computer",
      "A type of data cable"
    ],
    "answer": "A fake message used to steal information",
    "explanation": "Phishing uses a fake message or website to trick a person into giving information.",
    "source": [
      "CISA-PHISHING"
    ]
  },
  {
    "id": "COM006-EN-010",
    "ql": "COM-006-QL-003",
    "topic": "Phishing and social engineering",
    "difficulty": "MEDIUM",
    "stem": "What is spear phishing?",
    "options": [
      "A targeted fake message sent to a specific person",
      "A virus that attacks only printers",
      "A method of encrypting a hard disk",
      "A tool for cleaning a keyboard"
    ],
    "answer": "A targeted fake message sent to a specific person",
    "explanation": "Spear phishing is a targeted phishing attempt aimed at a particular person or organization.",
    "source": [
      "CISA-PHISHING"
    ]
  },
  {
    "id": "COM006-EN-011",
    "ql": "COM-006-QL-003",
    "topic": "Phishing and social engineering",
    "difficulty": "EASY",
    "stem": "What is social engineering?",
    "options": [
      "Tricking people into giving information or access",
      "Repairing damaged computer parts",
      "Writing a computer program",
      "Connecting two printers"
    ],
    "answer": "Tricking people into giving information or access",
    "explanation": "Social engineering uses human trust or fear to get information or access.",
    "source": [
      "NIST-SOCIAL-ENGINEERING"
    ]
  },
  {
    "id": "COM006-EN-012",
    "ql": "COM-006-QL-003",
    "topic": "Phishing and social engineering",
    "difficulty": "EASY",
    "stem": "What should you do with a suspicious login link?",
    "options": [
      "Do not open it and verify the sender another way",
      "Open it quickly",
      "Forward it to all contacts",
      "Enter the password to test it"
    ],
    "answer": "Do not open it and verify the sender another way",
    "explanation": "Do not open a suspicious link. Check the sender by using a trusted phone number or website.",
    "source": [
      "CISA-PHISHING"
    ]
  },
  {
    "id": "COM006-EN-013",
    "ql": "COM-006-QL-004",
    "topic": "Passwords and authentication",
    "difficulty": "EASY",
    "stem": "Which password is safer?",
    "options": [
      "A long, unique passphrase",
      "A name and birth year",
      "The same password used everywhere",
      "A short word such as password"
    ],
    "answer": "A long, unique passphrase",
    "explanation": "A long, unique passphrase is harder to guess and should not be reused on another account.",
    "source": [
      "CISA-PASSWORDS"
    ]
  },
  {
    "id": "COM006-EN-014",
    "ql": "COM-006-QL-004",
    "topic": "Passwords and authentication",
    "difficulty": "EASY",
    "stem": "Why should passwords not be reused?",
    "options": [
      "One stolen password can open many accounts",
      "Reuse makes the computer faster",
      "Reuse increases screen brightness",
      "One password can store more files"
    ],
    "answer": "One stolen password can open many accounts",
    "explanation": "If a reused password is stolen, an attacker may try it on other accounts.",
    "source": [
      "CISA-PASSWORDS"
    ]
  },
  {
    "id": "COM006-EN-015",
    "ql": "COM-006-QL-004",
    "topic": "Passwords and authentication",
    "difficulty": "EASY",
    "stem": "What does multi-factor authentication require?",
    "options": [
      "Two or more different proof factors",
      "Only a username",
      "Only a short password",
      "A new computer"
    ],
    "answer": "Two or more different proof factors",
    "explanation": "Multi-factor authentication (MFA) uses two or more different proof factors, such as a password and a phone code.",
    "source": [
      "NIST-MFA"
    ]
  },
  {
    "id": "COM006-EN-016",
    "ql": "COM-006-QL-004",
    "topic": "Passwords and authentication",
    "difficulty": "EASY",
    "stem": "What is a one-time password?",
    "options": [
      "A code meant for one use or a short time",
      "A password used by every employee",
      "A password that never changes",
      "A name saved in a file"
    ],
    "answer": "A code meant for one use or a short time",
    "explanation": "A one-time password (OTP) is a code that works once or for a short period.",
    "source": [
      "NIST-OTP"
    ]
  },
  {
    "id": "COM006-EN-017",
    "ql": "COM-006-QL-005",
    "topic": "Security controls",
    "difficulty": "EASY",
    "stem": "What does a firewall control?",
    "options": [
      "Network traffic entering or leaving a device",
      "The colour of a screen",
      "The size of a hard disk",
      "The speed of a keyboard"
    ],
    "answer": "Network traffic entering or leaving a device",
    "explanation": "A firewall checks network traffic and allows or blocks it according to security rules.",
    "source": [
      "NIST-FIREWALL"
    ]
  },
  {
    "id": "COM006-EN-018",
    "ql": "COM-006-QL-005",
    "topic": "Security controls",
    "difficulty": "EASY",
    "stem": "What does antivirus software help to do?",
    "options": [
      "Detect, block or remove malicious software",
      "Increase the monitor size",
      "Create a new keyboard",
      "Print without paper"
    ],
    "answer": "Detect, block or remove malicious software",
    "explanation": "Antivirus software helps detect, block or remove malicious software.",
    "source": [
      "CISA-ANTIMALWARE"
    ]
  },
  {
    "id": "COM006-EN-019",
    "ql": "COM-006-QL-005",
    "topic": "Security controls",
    "difficulty": "EASY",
    "stem": "Why are software updates important for security?",
    "options": [
      "They can fix known security weaknesses",
      "They always delete personal files",
      "They turn off all passwords",
      "They remove the need for backups"
    ],
    "answer": "They can fix known security weaknesses",
    "explanation": "Software updates often fix security weaknesses that attackers could use.",
    "source": [
      "CISA-UPDATES"
    ]
  },
  {
    "id": "COM006-EN-020",
    "ql": "COM-006-QL-005",
    "topic": "Security controls",
    "difficulty": "MEDIUM",
    "stem": "What does least privilege mean?",
    "options": [
      "Give only the access needed for a task",
      "Give every user full access",
      "Remove every user account",
      "Allow access without a password"
    ],
    "answer": "Give only the access needed for a task",
    "explanation": "Least privilege gives a user or program only the access needed to do its work.",
    "source": [
      "NIST-LEAST-PRIVILEGE"
    ]
  },
  {
    "id": "COM006-EN-021",
    "ql": "COM-006-QL-006",
    "topic": "Safe computer use",
    "difficulty": "EASY",
    "stem": "What is safer when using public Wi-Fi for banking?",
    "options": [
      "Avoid banking on an untrusted public network",
      "Share the banking password with a friend",
      "Turn off every security feature",
      "Open unknown links first"
    ],
    "answer": "Avoid banking on an untrusted public network",
    "explanation": "Avoid sensitive banking work on an untrusted public network when a safer connection is available.",
    "source": [
      "CISA-PUBLIC-WIFI"
    ]
  },
  {
    "id": "COM006-EN-022",
    "ql": "COM-006-QL-006",
    "topic": "Safe computer use",
    "difficulty": "EASY",
    "stem": "What should you do with an unknown USB drive?",
    "options": [
      "Do not plug it in and report or scan it safely",
      "Open every file on it",
      "Use it on every computer",
      "Give it administrator access"
    ],
    "answer": "Do not plug it in and report or scan it safely",
    "explanation": "An unknown universal serial bus (USB) drive may contain malicious software. Do not use it without a safe check.",
    "source": [
      "CISA-USB"
    ]
  },
  {
    "id": "COM006-EN-023",
    "ql": "COM-006-QL-006",
    "topic": "Safe computer use",
    "difficulty": "EASY",
    "stem": "What should you do with an unexpected email attachment?",
    "options": [
      "Do not open it until the sender is verified",
      "Open it to see what it contains",
      "Send it to more people",
      "Rename it and open it"
    ],
    "answer": "Do not open it until the sender is verified",
    "explanation": "An unexpected attachment may contain malicious software. Verify the sender before opening it.",
    "source": [
      "CISA-PHISHING"
    ]
  },
  {
    "id": "COM006-EN-024",
    "ql": "COM-006-QL-006",
    "topic": "Safe computer use",
    "difficulty": "EASY",
    "stem": "Why should you lock your screen?",
    "options": [
      "To stop other people using the device without permission",
      "To make the battery charge faster",
      "To remove all malware",
      "To increase internet speed"
    ],
    "answer": "To stop other people using the device without permission",
    "explanation": "A locked screen helps stop unauthorized use when you leave the device.",
    "source": [
      "CISA-CYBER-HYGIENE"
    ]
  },
  {
    "id": "COM006-EN-025",
    "ql": "COM-006-QL-007",
    "topic": "Data protection",
    "difficulty": "EASY",
    "stem": "What is the best protection against losing files to ransomware?",
    "options": [
      "A tested offline backup",
      "A longer screen cable",
      "A brighter monitor",
      "A second keyboard"
    ],
    "answer": "A tested offline backup",
    "explanation": "An offline backup can help restore files after ransomware. The backup should also be tested.",
    "source": [
      "CISA-RANSOMWARE-BACKUP"
    ]
  },
  {
    "id": "COM006-EN-026",
    "ql": "COM-006-QL-007",
    "topic": "Data protection",
    "difficulty": "EASY",
    "stem": "What does encryption do?",
    "options": [
      "Changes data into a form that needs a key to read",
      "Deletes every copy of the data",
      "Makes a keyboard wireless",
      "Removes all computer viruses"
    ],
    "answer": "Changes data into a form that needs a key to read",
    "explanation": "Encryption changes readable data into protected form. A correct key is needed to read it.",
    "source": [
      "NIST-ENCRYPTION"
    ]
  },
  {
    "id": "COM006-EN-027",
    "ql": "COM-006-QL-007",
    "topic": "Data protection",
    "difficulty": "EASY",
    "stem": "What is shoulder surfing?",
    "options": [
      "Watching a person to steal private information",
      "Repairing a computer screen",
      "Sharing a file with a team",
      "Cleaning a keyboard"
    ],
    "answer": "Watching a person to steal private information",
    "explanation": "Shoulder surfing means watching a person enter a password or other private information.",
    "source": [
      "NIST-SHOULDER-SURFING"
    ]
  },
  {
    "id": "COM006-EN-028",
    "ql": "COM-006-QL-007",
    "topic": "Data protection",
    "difficulty": "MEDIUM",
    "stem": "Why should important backups be tested?",
    "options": [
      "To confirm that files can be restored",
      "To make files public",
      "To remove the need for passwords",
      "To stop all software updates"
    ],
    "answer": "To confirm that files can be restored",
    "explanation": "A backup is useful only if its files can be restored when needed.",
    "source": [
      "CISA-RANSOMWARE-BACKUP"
    ]
  },
  {
    "id": "COM006-EN-029",
    "ql": "COM-006-QL-008",
    "topic": "Incident response",
    "difficulty": "EASY",
    "stem": "What should you do first after noticing a suspicious account login?",
    "options": [
      "Change the password and report the event",
      "Ignore it forever",
      "Share the password online",
      "Delete every file immediately"
    ],
    "answer": "Change the password and report the event",
    "explanation": "Change the password from a safe device and report the suspicious login to the service or security team.",
    "source": [
      "CISA-ACCOUNT-SECURITY"
    ]
  },
  {
    "id": "COM006-EN-030",
    "ql": "COM-006-QL-008",
    "topic": "Incident response",
    "difficulty": "EASY",
    "stem": "Who should receive a suspected workplace cyber incident?",
    "options": [
      "The workplace information technology or security team",
      "Every person on social media",
      "An unknown caller",
      "A public chat group"
    ],
    "answer": "The workplace information technology or security team",
    "explanation": "The information technology or security team can check the incident and take the correct action.",
    "source": [
      "CISA-REPORTING"
    ]
  },
  {
    "id": "COM006-EN-031",
    "ql": "COM-006-QL-008",
    "topic": "Incident response",
    "difficulty": "MEDIUM",
    "stem": "What does a digital signature help verify?",
    "options": [
      "Who sent data and whether it was changed",
      "The colour of a website",
      "The size of a monitor",
      "The speed of a printer"
    ],
    "answer": "Who sent data and whether it was changed",
    "explanation": "A digital signature helps verify the sender and shows whether the signed data was changed.",
    "source": [
      "NIST-DIGITAL-SIGNATURE"
    ]
  },
  {
    "id": "COM006-EN-032",
    "ql": "COM-006-QL-008",
    "topic": "Incident response",
    "difficulty": "EASY",
    "stem": "What is the safest action after finding malware on a work device?",
    "options": [
      "Disconnect it as instructed and report it",
      "Keep using it for all work",
      "Copy the malware to another device",
      "Turn off every security tool"
    ],
    "answer": "Disconnect it as instructed and report it",
    "explanation": "Disconnecting as instructed can limit spread. Report the device so the security team can investigate it.",
    "source": [
      "CISA-MALWARE-REPORTING"
    ]
  }
]);

export function auditCom006CyberSecurityEnglishReviewV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const qlIds = COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY.qlIds;
  for (const question of COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE) {
    if (ids.has(question.id)) issues.push(`DUPLICATE_ID:${question.id}`);
    ids.add(question.id);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.id}`);
    if (!question.options.includes(question.answer)) issues.push(`ANSWER:${question.id}`);
    if (!question.stem.trim() || !question.explanation.trim()) issues.push(`EMPTY_TEXT:${question.id}`);
    if (question.stem.split(/\\s+/).filter(Boolean).length > 24) issues.push(`STEM_TOO_LONG:${question.id}`);
    if (question.explanation.split(/[.!?]/).filter(Boolean).length > 2) issues.push(`EXPLANATION_TOO_LONG:${question.id}`);
    if (/^\\s*(consider|read|look at|based on the following)\\b/i.test(question.stem)) issues.push(`UNNECESSARY_OPENING:${question.id}`);
    if (/associat/i.test(`${question.stem} ${question.explanation}`)) issues.push(`FORMAL_WORDING:${question.id}`);
    if (/\\b(CIA|MFA|OTP|USB)\\b/.test(question.stem) && !/\\b(CIA|MFA|OTP|USB)\\b/.test(question.explanation)) issues.push(`ABBREVIATION_NOT_EXPLAINED:${question.id}`);
  }
  for (const qlId of qlIds) {
    if (COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE.filter((q) => q.ql === qlId).length !== 4) issues.push(`QL_COUNT:${qlId}`);
  }
  if (COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE.length !== COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY.questionCount) issues.push("QUESTION_COUNT");
  return {valid: issues.length === 0, issues, questionCount: COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE.length, qlCount: qlIds.length};
}
