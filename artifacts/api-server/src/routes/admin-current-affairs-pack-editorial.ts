import { randomUUID } from "node:crypto";
import { Router, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

function sendError(res: Response, error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  if (/approved|published|immutable|locked/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_PACK_EDITORIAL_LOCKED" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: message, code: "CURRENT_AFFAIRS_PACK_EDITORIAL_FAILED" });
}

function targetDate(value: unknown) {
  const date = typeof value === "string" ? value.trim() : "";
  if (!DATE_ONLY.test(date)) throw new Error("A valid Current Affairs pack date is required.");
  return date;
}

function editorialReason(value: unknown) {
  const reason = typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, 1000) : "";
  if (reason.length < 8) throw new Error("Pack editorial refresh requires a reason of at least 8 characters.");
  return reason;
}

router.use(authenticate);

router.post(
  "/production/master-pack/editorial-refresh",
  requireAdminPermission("content.questions.update"),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user?.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required.", code: "ADMIN_SESSION_REQUIRED" });
        return;
      }
      const date = targetDate(req.body?.date);
      const reason = editorialReason(req.body?.reason);

      // Keep the API startup graph light on the 512 MB production service.
      // Selected-pack materialization/approval pull in the full Current Affairs
      // processing graph, so load them only when an administrator explicitly
      // runs the governed pack editorial refresh.
      const [censusRuntime, selectedPackRuntime] = await Promise.all([
        import("../current-affairs/daily-discovery-census"),
        import("../current-affairs/selected-daily-master-pack"),
      ]);
      const census = await censusRuntime.loadDailyDiscoveryCensus(date);
      const result = await selectedPackRuntime.materializeSelectedDailyMasterPacks(
        date,
        census?.id ? String(census.id) : null,
      );

      if ((result as any)?.locked) {
        res.status(409).json({
          error: "This canonical Daily Master Pack is approved or published. Return it to editorial review before changing the rendered pack.",
          code: "CURRENT_AFFAIRS_PACK_EDITORIAL_LOCKED",
          result,
        });
        return;
      }
      if ((result as any)?.created !== true) {
        res.status(409).json({
          error: `The selected canonical pack could not be refreshed: ${String((result as any)?.reason ?? "selected_pack_not_ready")}. Resolve the reported authoring/localization/parity gate first.`,
          code: "CURRENT_AFFAIRS_PACK_EDITORIAL_REFRESH_WITHHELD",
          result,
        });
        return;
      }

      const refreshId = randomUUID();
      await sqlClient`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, effective_role_key, action_key,
          entity_type, entity_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          ${req.adminSession?.effectiveRoleKey ?? null},
          'current_affairs.master_pack.editorial_refresh',
          'current_affairs_master_pack_editorial_refresh',
          ${refreshId}::uuid,
          ${reason},
          ${`Refreshed admin-selected canonical Daily Master Pack for ${date} from current governed event authoring/localizations`},
          ${JSON.stringify({
            refreshId,
            targetDate: date,
            boundaryVersion: (result as any)?.boundaryVersion ?? null,
            membership: (result as any)?.membership ?? null,
            quality: (result as any)?.quality ?? null,
            localizationWarnings: (result as any)?.localizationWarnings ?? [],
            discoveryReplay: false,
            verificationAuthorityChanged: false,
            publicationAuthority: false,
            questionBankPromotionAuthority: false,
          })}::jsonb
        )
      `;

      const [masterPackRuntime, approvalRuntime] = await Promise.all([
        import("../current-affairs/daily-master-pack"),
        import("../current-affairs/selected-daily-master-pack-approval-runtime"),
      ]);
      const [packs, approvalCandidate] = await Promise.all([
        masterPackRuntime.loadDailyMasterPacks(date),
        approvalRuntime.loadDailyMasterPackApprovalCandidate(date),
      ]);

      res.status(201).json({
        targetDate: date,
        refreshId,
        result,
        masterPacks: packs,
        approvalReadiness: approvalCandidate.readiness,
        activeApproval: approvalCandidate.activeApproval,
        discoveryReplay: false,
        publicationAuthority: false,
        questionBankPromotionAuthority: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to refresh Current Affairs pack editorial state";
      if (/valid Current Affairs pack date|required|reason of at least/i.test(message)) {
        res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_PACK_EDITORIAL_INPUT" });
        return;
      }
      sendError(res, error, "Unable to refresh Current Affairs pack editorial state");
    }
  },
);

export default router;
