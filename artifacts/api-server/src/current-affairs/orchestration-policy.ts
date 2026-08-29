export type AutoPromotionProfile = {
  confidence: number;
  category: string;
  memberCount: number;
  distinctSourceCount: number;
  primarySourceCount: number;
  highTrustSourceCount: number;
  urlEvidenceCount: number;
  primaryUrlEvidenceCount: number;
  maxTrustScore: number;
};

export type AutoVerificationProfile = {
  verificationGateAllowed: boolean;
  verificationConfidence: number;
  verifiedFactCount: number;
  openConflictCount: number;
  evidenceCount: number;
  primaryEvidenceCount: number;
};

export function canAutoPromoteCluster(profile: AutoPromotionProfile): {
  allowed: boolean;
  reason: string;
} {
  if (profile.category === "other") {
    return { allowed: false, reason: "Unclassified clusters require editorial review" };
  }
  if (profile.urlEvidenceCount < 1) {
    return { allowed: false, reason: "Automatic promotion requires URL-backed evidence" };
  }

  const strongPrimary =
    profile.primarySourceCount >= 1
    && profile.primaryUrlEvidenceCount >= 1
    && profile.maxTrustScore >= 0.82;
  const strongCorroboration =
    profile.distinctSourceCount >= 2
    && profile.highTrustSourceCount >= 2
    && profile.memberCount >= 2;

  if (strongPrimary) {
    if (profile.confidence < 0.68) {
      return { allowed: false, reason: "Primary-source cluster confidence is below the singleton-safe threshold" };
    }
    return { allowed: true, reason: "Strong primary-source-backed cluster" };
  }

  if (profile.confidence < 0.76) {
    return { allowed: false, reason: "Secondary-source cluster confidence is below the corroboration threshold" };
  }
  if (!strongCorroboration) {
    return {
      allowed: false,
      reason: "Cluster lacks a strong primary source or two independently trusted sources",
    };
  }

  return {
    allowed: true,
    reason: "Two or more trusted independent sources corroborate the cluster",
  };
}

export function canAutoVerifyEvent(profile: AutoVerificationProfile): {
  allowed: boolean;
  reason: string;
} {
  if (profile.openConflictCount > 0) {
    return { allowed: false, reason: "Open fact conflict blocks automatic verification" };
  }
  if (profile.verifiedFactCount < 1) {
    return { allowed: false, reason: "At least one reconciled canonical fact is required" };
  }
  if (profile.evidenceCount < 1) {
    return { allowed: false, reason: "Source evidence is required" };
  }
  if (!profile.verificationGateAllowed || profile.verificationConfidence < 0.82) {
    return { allowed: false, reason: "Evidence confidence does not meet the strict automation gate" };
  }
  if (profile.primaryEvidenceCount < 1 && profile.evidenceCount < 2) {
    return { allowed: false, reason: "Non-primary events require corroboration from multiple sources" };
  }
  return { allowed: true, reason: "Strict verification and contradiction gates passed" };
}

export function indiaDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function previousIndiaDate(now = new Date()): string {
  const current = indiaDate(now);
  const date = new Date(`${current}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function shouldBuildDailyDrafts(now = new Date()): boolean {
  return now.getUTCMinutes() >= 15 && now.getUTCHours() === 0;
}

export function automationImportanceReason(category: string): string {
  const reasons: Record<string, string> = {
    economy_banking: "Relevant to banking, economy and financial-awareness questions.",
    punjab: "Relevant to Punjab state competitive examinations and state general awareness.",
    national: "Relevant to national current affairs and general-awareness sections.",
    appointments: "Important appointment and office-holder information is commonly tested in current affairs.",
    awards: "Awards and honours are recurring competitive-exam current-affairs areas.",
    reports_indices: "Reports, rankings and indices are commonly tested through factual current-affairs questions.",
    sports: "Major sports winners, tournaments and records are recurring current-affairs topics.",
    science_technology: "Science and technology developments are relevant to general-awareness sections.",
    space: "Space missions, launches and agencies are frequently tested in general awareness.",
    defence: "Defence exercises, systems and institutions are recurring current-affairs topics.",
    environment: "Environment and climate developments are relevant to general-awareness examinations.",
    international: "International organisations, agreements and major global developments are exam-relevant.",
    summits: "Major summits and international meetings are commonly tested in current affairs.",
  };
  return reasons[category] ?? "Selected as an exam-relevant verified current-affairs development.";
}
