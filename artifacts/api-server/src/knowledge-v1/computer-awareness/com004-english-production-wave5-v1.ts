import { deterministicIndex } from "../deterministic";
import {
  COM004_PERMANENT_QL_ALLOCATIONS_V1,
  auditCom004PermanentQlAllocationV1,
  type Com004PermanentQlId,
} from "./com004-permanent-ql-allocation-v1";

export type Com004EnglishWave5SurfaceFamily =
  | "DIRECT_RECALL"
  | "CONCEPT_DISCRIMINATION"
  | "SCENARIO_APPLICATION"
  | "STATEMENT_EVALUATION"
  | "DECISION_REASONING";

export type Com004EnglishWave5QuestionV1 = {
  questionId: string;
  qlId: Com004PermanentQlId;
  authorityProposalId: string;
  sourceCandidateIds: string[];
  surfaceFamily: Com004EnglishWave5SurfaceFamily;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  reviewOnly: true;
  runtimeRegistered: false;
};

type AuthoringInput = {
  ordinal: number;
  surfaceFamily: Com004EnglishWave5SurfaceFamily;
  stem: string;
  canonicalAnswer: string;
  distractors: [string, string, string];
  explanation: string;
};

const allocationAudit = auditCom004PermanentQlAllocationV1();
if (!allocationAudit.valid) throw new Error(`COM-004 English Wave 5 cannot bind invalid permanent QLs: ${allocationAudit.issues.join(", ")}`);
const allocation = COM004_PERMANENT_QL_ALLOCATIONS_V1.find((item) => item.permanentQlId === "COM-004-QL-017");
if (!allocation) throw new Error("Missing COM-004-QL-017 allocation");

function author(input: AuthoringInput): Com004EnglishWave5QuestionV1 {
  const canonicalAnswer = input.canonicalAnswer.trim();
  const distractors = input.distractors.map((value) => value.trim());
  if (new Set([canonicalAnswer, ...distractors].map((value) => value.toLowerCase())).size !== 4) throw new Error(`COM-004-QL-017/${input.ordinal}: duplicate options`);
  const correctIndex = deterministicIndex(`COM004:EN:W5:COM-004-QL-017:${input.ordinal}:answer-position`, 4);
  const options = [...distractors];
  options.splice(correctIndex, 0, canonicalAnswer);
  return {
    questionId: `COM004-EN-W5-017-${String(input.ordinal).padStart(2, "0")}`,
    qlId: "COM-004-QL-017",
    authorityProposalId: allocation.authorityProposalId,
    sourceCandidateIds: [...allocation.sourceCandidateIds],
    surfaceFamily: input.surfaceFamily,
    stem: input.stem.trim(),
    options,
    correctIndex,
    canonicalAnswer,
    explanation: input.explanation.trim(),
    reviewOnly: true,
    runtimeRegistered: false,
  };
}

export const COM004_ENGLISH_PRODUCTION_WAVE5_V1: Com004EnglishWave5QuestionV1[] = Object.freeze([
  author({ ordinal:1, surfaceFamily:"DECISION_REASONING", stem:"Before entering Internet-banking credentials, which user action provides the strongest basic check that the intended bank site has been reached?", canonicalAnswer:"Verify the bank's domain/URL through a trusted source and confirm the expected secure connection", distractors:["Trust any link merely because it contains the bank's name in visible text","Assume the first search result must always be the genuine bank","Enter the password first and check the address only after completing the transaction"], explanation:"Safe e-banking starts with reaching the intended bank endpoint. Users should verify the domain/URL through a trusted route and also check the secure-connection context; HTTPS alone is not a legitimacy guarantee." }),
  author({ ordinal:2, surfaceFamily:"STATEMENT_EVALUATION", stem:"Consider the statements: (1) An HTTPS indicator can show a protected connection. (2) HTTPS alone proves that an online-banking site is genuine. Which option is correct?", canonicalAnswer:"Only statement 1 is correct", distractors:["Only statement 2 is correct","Both statements are correct","Neither statement is correct"], explanation:"HTTPS protects the connection to the contacted endpoint, but a deceptive site can also use HTTPS. Safe banking therefore requires verifying the intended domain and not relying on the protocol indicator alone." }),
  author({ ordinal:3, surfaceFamily:"DIRECT_RECALL", stem:"Which item should an Internet-banking user keep secret and never disclose merely because another person asks for it?", canonicalAnswer:"Password, PIN or OTP", distractors:["The bank's publicly listed website address","The name of the banking service","The browser's Back-button label"], explanation:"Passwords, PINs and one-time passwords are authentication secrets and should not be disclosed to other people on request. Public bank information such as the official website address is not an authentication secret." }),
  author({ ordinal:4, surfaceFamily:"SCENARIO_APPLICATION", stem:"A caller claims to be bank staff and asks a customer to read out an OTP received for an online-banking action. What should the customer do?", canonicalAnswer:"Do not disclose the OTP and end the request through the untrusted interaction", distractors:["Share the OTP because bank staff can always ask for authentication secrets","Post the OTP in a public message so the bank can verify it","Reuse the OTP as the account password for future convenience"], explanation:"An OTP is an authentication secret intended for the authorized user's transaction/session. It should not be disclosed in response to an unsolicited request, regardless of the caller's claimed identity." }),
  author({ ordinal:5, surfaceFamily:"DECISION_REASONING", stem:"Which network environment is preferable for a sensitive Internet-banking session when the user can choose between the two?", canonicalAnswer:"A trusted private network rather than open public Wi-Fi", distractors:["Any open public Wi-Fi because banking traffic never needs user caution","The network with the most unfamiliar devices connected to it","A public hotspot selected only because it has the bank's name in its Wi-Fi label"], explanation:"For sensitive banking activity, a trusted private network is the safer user-facing choice than open public Wi-Fi. This is a practical access-environment decision without requiring attack taxonomy or network-protocol depth." }),
  author({ ordinal:6, surfaceFamily:"SCENARIO_APPLICATION", stem:"A customer must perform online banking while using a shared public computer. Which choice best reflects safe-use awareness?", canonicalAnswer:"Prefer a trusted personal device; if use cannot be avoided, minimize exposure and ensure the banking session is fully ended", distractors:["Save the banking password in the shared browser for convenience","Leave the authenticated session open for the next user","Disable all address checks because the computer is public"], explanation:"A trusted personal device reduces exposure of banking credentials and session state. Shared devices create avoidable risk, so sensitive banking should preferably be done on a device the user controls." }),
  author({ ordinal:7, surfaceFamily:"CONCEPT_DISCRIMINATION", stem:"Which statement correctly separates a secure connection from a trustworthy banking destination?", canonicalAnswer:"HTTPS can protect the connection, while the user must separately verify that the domain belongs to the intended bank", distractors:["HTTPS automatically proves every site owner's honesty","A correct bank domain makes connection protection irrelevant","Domain verification and HTTPS are two names for exactly the same check"], explanation:"Safe banking uses multiple checks for different purposes. HTTPS concerns connection protection, while verifying the intended domain helps confirm that the user is connecting to the expected banking destination." }),
  author({ ordinal:8, surfaceFamily:"STATEMENT_EVALUATION", stem:"Which Internet-banking safety statement is incorrect?", canonicalAnswer:"It is safe to share a password or OTP whenever a message displays the bank's logo", distractors:["Authentication secrets should remain private","The banking URL/domain should be checked before entering credentials","Open public Wi-Fi is not the preferred environment for sensitive banking"], explanation:"Logos and visible branding do not justify disclosing authentication secrets. Passwords, PINs and OTPs should remain private, and users should independently verify the banking destination and access environment." }),
  author({ ordinal:9, surfaceFamily:"DECISION_REASONING", stem:"A user receives two possible links for online banking: one matches the bank's verified official domain and the other uses a look-alike spelling. Which should the user choose?", canonicalAnswer:"Use the verified official domain and reject the look-alike address", distractors:["Use whichever address appears first in the message","Choose the look-alike if it also shows HTTPS","Enter credentials on both sites and compare the results"], explanation:"The intended banking domain is a key legitimacy check. HTTPS on a look-alike domain only protects the connection to that wrong endpoint; it does not convert the look-alike into the genuine bank site." }),
  author({ ordinal:10, surfaceFamily:"SCENARIO_APPLICATION", stem:"After completing a banking task on a device, which action best reduces the chance that another user can continue the authenticated session?", canonicalAnswer:"Use the banking service's logout/sign-out function and close the session", distractors:["Leave the account page open because HTTPS will log out every session immediately","Write the password beside the device in case the session expires","Forward the OTP to another person before closing the page"], explanation:"Signing out through the service ends the authenticated session under the user's control. Session timeout behavior varies, so intentionally logging out is a durable safe-use practice after completing banking activity." }),
  author({ ordinal:11, surfaceFamily:"CONCEPT_DISCRIMINATION", stem:"Which topic belongs outside this COM-004 e-banking safety QL and should be handled by the dedicated security chapter?", canonicalAnswer:"Detailed phishing, malware and attack-control taxonomy", distractors:["Keeping passwords, PINs and OTPs secret","Checking the intended bank URL/domain","Avoiding open public Wi-Fi for sensitive banking when possible"], explanation:"COM-004 owns regulator-style user-facing safe-use decisions. Detailed phishing/malware attack mechanisms and security-control taxonomy belong to COM-006, preventing overlap between chapter authorities." }),
  author({ ordinal:12, surfaceFamily:"STATEMENT_EVALUATION", stem:"Which set contains only durable user-facing practices for safer Internet banking?", canonicalAnswer:"Verify the bank domain, protect authentication secrets, prefer a trusted device/network and sign out after use", distractors:["Trust any HTTPS site, share OTPs with callers and save passwords on public computers","Ignore the URL, use open public Wi-Fi by preference and leave sessions active","Memorize attack packet formats, malware code signatures and protocol-port tables"], explanation:"The correct set contains stable user decisions appropriate to computer awareness. It combines destination verification, credential secrecy, safer access context and session closure without drifting into detailed security or networking taxonomy." }),
]) as unknown as Com004EnglishWave5QuestionV1[];

export const COM004_ENGLISH_PRODUCTION_WAVE5_AUTHORITY_V1 = Object.freeze({
  authorityId: "COM-004-ENGLISH-PRODUCTION-WAVE5-V1" as const,
  chapterCode: "COM-004" as const,
  status: "REVIEW_CANDIDATE_NOT_FROZEN" as const,
  permanentQlIds: Object.freeze(["COM-004-QL-017"] as const),
  questionCount: COM004_ENGLISH_PRODUCTION_WAVE5_V1.length,
  questionsPerQl: 12,
  governance: Object.freeze({ englishFreezeAuthorized:false, localizationAuthorized:false, difficultyAuthorityAuthorized:false, questionStudioRuntimeAuthorized:false, questionBankWritesAuthorized:false, testEligibilityAuthorized:false, mockTestEligibilityAuthorized:false, automaticPublicationAuthorized:false, publicPublicationAuthorized:false, productionReleased:false }),
  nextGate: "COM004_ENGLISH_PRODUCTION_WAVE5_EDITORIAL_AUDIT" as const,
});
