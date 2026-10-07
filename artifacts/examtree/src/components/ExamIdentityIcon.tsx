import { useEffect, useState } from "react";
import { Landmark, TrainFront, ShieldCheck, GraduationCap, BriefcaseBusiness } from "lucide-react";
import { isImageIcon } from "@/components/CategoryIcon";
import "@/styles/exam-identity.css";

type IdentityProps = { icon?: string; name: string; examCode?: string; familyCode?: string; className?: string };

export function examIdentityAsset({ name, examCode, familyCode }: Omit<IdentityProps, "className" | "icon">) {
  const text = [examCode, name].filter(Boolean).join(" ").toUpperCase().replace(/_/g, " ");
  const family = String(familyCode ?? "").toUpperCase();
  let file: string | undefined;
  if (/\bSBI\b/.test(text)) file = "sbi-official.svg";
  else if (/\bIBPS\b/.test(text)) file = "ibps-official.svg";
  else if (/\bRBI\b|RESERVE BANK/.test(text)) file = "rbi-official.svg";
  else if (/\bSSC\b|STAFF SELECTION COMMISSION/.test(text) || family === "SSC") file = "ssc-official.svg";
  else if (/RAILWAY|\bRRB\b/.test(text) || family === "RAILWAY") file = "railways-official.svg";
  else if (/PUNJAB|PSSSB|PPSC|PSPCL/.test(text) || family === "PUNJAB") file = "punjab-official.svg";
  return file ? `${import.meta.env.BASE_URL}category-icons/${file}` : undefined;
}

/** Uploaded image, local exam logo, then a visible family symbol. */
export function ExamIdentityIcon(props: IdentityProps) {
  const { icon, name, familyCode, className = "" } = props;
  const official = examIdentityAsset(props);
  const uploaded = icon && isImageIcon(icon) ? icon : undefined;
  const sources = Array.from(new Set([...(official?.includes("-library-official.") ? [official, uploaded] : [uploaded, official])].filter((src): src is string => Boolean(src))));
  const sourceKey = sources.join("|");
  const [failedSources, setFailedSources] = useState<string[]>([]);
  useEffect(() => setFailedSources([]), [sourceKey]);
  const source = sources.find((src) => !failedSources.includes(src));
  const family = `${familyCode ?? ""} ${name}`.toUpperCase();
  const Symbol = /RAIL|RRB/.test(family) ? TrainFront : /POLICE|DEFENCE/.test(family) ? ShieldCheck : /TEACH|EDUCATION/.test(family) ? GraduationCap : /BANK|RBI|IBPS|SBI|PUNJAB|STATE/.test(family) ? Landmark : BriefcaseBusiness;
  return <span className={`exam-identity-icon ${className}`} aria-hidden="true">{source ? <img src={source} alt="" loading="lazy" decoding="async" draggable={false} onError={() => setFailedSources((failed) => [...failed, source])} /> : <Symbol strokeWidth={1.6} />}</span>;
}
