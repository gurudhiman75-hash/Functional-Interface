export type PublicationSnapshot = { language: string; payloadSha256: string };

export function evaluateMasterPackPublication(args: {
  hasActiveApproval: boolean;
  alreadyPublished: boolean;
  approved: PublicationSnapshot[];
  current: PublicationSnapshot[];
}) {
  const blockers: string[] = [];
  if (!args.hasActiveApproval) blockers.push("Approve this date's pack before publishing");
  if (args.alreadyPublished) blockers.push("This approved pack is already published");
  if (args.hasActiveApproval) {
    for (const language of ["en", "hi", "pa"]) {
      const approved = args.approved.find((item) => item.language === language);
      const current = args.current.find((item) => item.language === language);
      if (!approved || !current) blockers.push(`${language.toUpperCase()} pack is missing`);
      else if (approved.payloadSha256 !== current.payloadSha256) {
        blockers.push(`${language.toUpperCase()} pack changed after approval; approve it again`);
      }
    }
  }
  return { ready: blockers.length === 0, blockers };
}
