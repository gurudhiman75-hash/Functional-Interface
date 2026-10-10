import { PublicPage, SeoRouteGrid, usePageMeta } from "@/components/PublicPage";

const exams = [
  { label: "SSC CGL", href: "/ssc-cgl", description: "Open the SSC CGL ExamTree page for available tests and verified exam information." },
  { label: "SSC CHSL", href: "/ssc-chsl", description: "Open the SSC CHSL ExamTree page for available tests and verified exam information." },
  { label: "SSC MTS", href: "/ssc-mts", description: "Open the SSC MTS ExamTree page for available tests and verified exam information." },
  { label: "SSC CPO", href: "/ssc-cpo", description: "Open the SSC CPO ExamTree page for available tests and verified exam information." },
  { label: "SSC GD Constable", href: "/ssc-gd", description: "Open the SSC GD Constable ExamTree page for available tests and verified exam information." },
  { label: "SSC Stenographer Grade C & D", href: "/ssc-stenographer", description: "Open the SSC Stenographer Grade C & D ExamTree page for available tests and verified exam information." },
  { label: "SSC Selection Post", href: "/ssc-selection-post", description: "Open the SSC Selection Post ExamTree page for available tests and verified exam information." },
  { label: "SSC JE", href: "/ssc-je", description: "Open the SSC JE ExamTree page for available tests and verified exam information." },
  { label: "IBPS PO", href: "/ibps-po", description: "Open the IBPS PO ExamTree page for available tests and verified exam information." },
  { label: "IBPS Clerk / CSA", href: "/ibps-clerk", description: "Open the IBPS Clerk / CSA ExamTree page for available tests and verified exam information." },
  { label: "IBPS RRB Officer Scale I", href: "/ibps-rrb-po", description: "Open the IBPS RRB Officer Scale I ExamTree page for available tests and verified exam information." },
  { label: "IBPS RRB Office Assistant", href: "/ibps-rrb-office-assistant", description: "Open the IBPS RRB Office Assistant ExamTree page for available tests and verified exam information." },
  { label: "SBI PO", href: "/sbi-po", description: "Open the SBI PO ExamTree page for available tests and verified exam information." },
  { label: "SBI Clerk / Junior Associate", href: "/sbi-clerk", description: "Open the SBI Clerk / Junior Associate ExamTree page for available tests and verified exam information." },
  { label: "RBI Assistant", href: "/rbi-assistant", description: "Open the RBI Assistant ExamTree page for available tests and verified exam information." },
  { label: "RBI Grade B", href: "/rbi-grade-b", description: "Open the RBI Grade B ExamTree page for available tests and verified exam information." },
  { label: "NABARD Grade A", href: "/nabard-grade-a", description: "Open the NABARD Grade A ExamTree page for available tests and verified exam information." },
  { label: "SEBI Grade A", href: "/sebi-grade-a", description: "Open the SEBI Grade A ExamTree page for available tests and verified exam information." },
  { label: "Punjab Police Constable", href: "/punjab-police-constable", description: "Open the Punjab Police Constable ExamTree page for available tests and verified exam information." },
  { label: "Punjab Police Sub-Inspector", href: "/punjab-police-si", description: "Open the Punjab Police Sub-Inspector ExamTree page for available tests and verified exam information." },
  { label: "PSSSB Clerk / Junior Assistant", href: "/psssb-clerk", description: "Open the PSSSB Clerk / Junior Assistant ExamTree page for available tests and verified exam information." },
  { label: "Punjab Patwari", href: "/punjab-patwari", description: "Open the Punjab Patwari ExamTree page for available tests and verified exam information." },
  { label: "PSSSB Excise & Taxation Inspector", href: "/psssb-excise-taxation-inspector", description: "Open the PSSSB Excise & Taxation Inspector ExamTree page for available tests and verified exam information." },
  { label: "Punjab Naib Tehsildar", href: "/punjab-naib-tehsildar", description: "Open the Punjab Naib Tehsildar ExamTree page for available tests and verified exam information." },
  { label: "PPSC Punjab State Civil Services", href: "/punjab-pcs", description: "Open the PPSC Punjab State Civil Services ExamTree page for available tests and verified exam information." },
  { label: "PSSSB Senior Assistant", href: "/psssb-senior-assistant", description: "Open the PSSSB Senior Assistant ExamTree page for available tests and verified exam information." },
  { label: "PSSSB VDO / Gram Sevak", href: "/psssb-vdo", description: "Open the PSSSB VDO / Gram Sevak ExamTree page for available tests and verified exam information." },
  { label: "Punjab Jail Warder / Matron", href: "/punjab-jail-warder", description: "Open the Punjab Jail Warder / Matron ExamTree page for available tests and verified exam information." },
  { label: "Punjab Police Intelligence Assistant", href: "/punjab-police-intelligence-assistant", description: "Open the Punjab Police Intelligence Assistant ExamTree page for available tests and verified exam information." },
  { label: "PSPCL Assistant Lineman", href: "/pspcl-alm", description: "Open the PSPCL Assistant Lineman ExamTree page for available tests and verified exam information." },
  { label: "PSPCL Revenue Accountant", href: "/pspcl-revenue-accountant", description: "Open the PSPCL Revenue Accountant ExamTree page for available tests and verified exam information." },
];

export default function ExamsCovered() {
  usePageMeta("Exams Covered", "Explore the approved ExamTree catalogue across SSC, Banking, and Punjab state exams.");

  return (
    <PublicPage
      eyebrow="Exams covered"
      title="Choose an exam family and browse available preparation."
      description="Browse the approved SSC, Banking, and Punjab state exam pages. Test inventory and verified details are added as each exam is populated."
    >
      <SeoRouteGrid routes={exams} />
    </PublicPage>
  );
}
