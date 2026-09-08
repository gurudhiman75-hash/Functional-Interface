const COMPUTER_ABBREVIATIONS: Record<string, string> = {
  LAN: "Local Area Network",
  WAN: "Wide Area Network",
  MAN: "Metropolitan Area Network",
  PAN: "Personal Area Network",
  DNS: "Domain Name System",
  DHCP: "Dynamic Host Configuration Protocol",
  FTP: "File Transfer Protocol",
  SMTP: "Simple Mail Transfer Protocol",
  HTTP: "Hypertext Transfer Protocol",
  HTTPS: "Hypertext Transfer Protocol Secure",
  IP: "Internet Protocol",
  TCP: "Transmission Control Protocol",
  MAC: "Media Access Control",
  NIC: "Network Interface Card",
};

const UNNECESSARY_STEM_OPENING = /^(In the following question|Read the following question carefully|Please select the correct answer|You are given the following)/i;
const OVERUSED_FORMAL_PHRASE = /\bassociated\s+with\b/i;

export function validateComputerAwarenessEditorialText(input: { stem: string; explanation: string }) {
  const issues: string[] = [];
  const stem = input.stem.trim();
  const explanation = input.explanation.trim();
  if (UNNECESSARY_STEM_OPENING.test(stem)) issues.push("UNNECESSARY_STEM_OPENING");
  if (OVERUSED_FORMAL_PHRASE.test(stem) || OVERUSED_FORMAL_PHRASE.test(explanation)) issues.push("ASSOCIATED_WITH_OVERUSED");
  if (!explanation) issues.push("EMPTY_EXPLANATION");
  if (stem.split(/\s+/).filter(Boolean).length > 55) issues.push("STEM_TOO_LONG");
  if (explanation.split(/[.!?]/).filter(Boolean).length > 2) issues.push("EXPLANATION_NOT_SIMPLE");
  for (const [abbreviation, fullForm] of Object.entries(COMPUTER_ABBREVIATIONS)) {
    if (!new RegExp(`\\b${abbreviation}\\b`).test(explanation)) continue;
    if (!new RegExp(`\\b${abbreviation}\\b\\s*(?:\\(|means\\s+)${fullForm.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}`, "i").test(explanation)) {
      issues.push(`UNEXPANDED_ABBREVIATION:${abbreviation}`);
    }
  }
  return { valid: issues.length === 0, issues };
}

export function assertComputerAwarenessEditorialText(input: { stem: string; explanation: string }) {
  const result = validateComputerAwarenessEditorialText(input);
  if (!result.valid) throw new Error(`Computer-awareness editorial validation failed: ${result.issues.join(", ")}`);
  return result;
}
