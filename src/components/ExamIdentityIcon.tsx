import { useEffect, useState } from "react";
import { Landmark, TrainFront, ShieldCheck, GraduationCap, BriefcaseBusiness } from "lucide-react";
import { isImageIcon } from "@/components/CategoryIcon";
import { resolveExamIdentity } from "@/lib/exam-identity";
import "@/styles/exam-identity.css";

type IdentityProps = { icon?: string; name: string; examCode?: string; familyCode?: string; className?: string };

export function examIdentityAsset({ name, examCode, familyCode }: Omit<IdentityProps, "className" | "icon">) {
  const asset = resolveExamIdentity({ name, examCode, familyCode })?.asset;
  return asset ? `${import.meta.env.BASE_URL}${asset}` : undefined;
}

/** Uploaded image, local exam logo, then a visible family symbol. */
export function ExamIdentityIcon(props: IdentityProps) {
  const { icon, name, familyCode, className = "" } = props;
  const official = examIdentityAsset(props);
  const identity = resolveExamIdentity(props);
  const uploaded = icon && isImageIcon(icon) ? icon : undefined;
  const sources = Array.from(new Set([...(official?.includes("-library-official.") ? [official, uploaded] : [uploaded, official])].filter((src): src is string => Boolean(src))));
  const sourceKey = sources.join("|");
  const [failedSources, setFailedSources] = useState<string[]>([]);
  useEffect(() => setFailedSources([]), [sourceKey]);
  const source = sources.find((src) => !failedSources.includes(src));
  const family = `${familyCode ?? ""} ${name}`.toUpperCase();
  const Symbol = /RAIL|RRB/.test(family) ? TrainFront : /POLICE|DEFENCE/.test(family) ? ShieldCheck : /TEACH|EDUCATION/.test(family) ? GraduationCap : /BANK|RBI|IBPS|SBI|PUNJAB|STATE/.test(family) ? Landmark : BriefcaseBusiness;
  const isCrest = source === official && identity?.layout === "crest";
  return <span className={`exam-identity-icon ${!source && identity ? "exam-identity-monogram" : ""} ${className}`} aria-hidden="true" data-exam-authority={identity?.label}>
    {source ? <span className={`exam-identity-image${isCrest ? " exam-identity-crest" : ""}`}><img src={source} alt="" loading="lazy" decoding="async" draggable={false} onError={() => setFailedSources((failed) => [...failed, source])} /></span> : identity ? <><Symbol strokeWidth={1.6} /><span>{identity.label.toUpperCase()}</span></> : <Symbol strokeWidth={1.6} />}
  </span>;
}
