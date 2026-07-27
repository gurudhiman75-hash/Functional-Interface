import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
router.use(authenticate);
router.use(requireAdminPermission("content.questions.read"));

const WINDOWS = new Set([7, 30, 90, 365]);
function windowDays(value: unknown): number { const parsed = Number(value); return WINDOWS.has(parsed) ? parsed : 30; }
function csvCell(value: unknown): string { const text = String(value ?? ""); const guarded = /^[=+\-@]/.test(text) ? `'${text}` : text; return `"${guarded.replace(/"/g, '""')}"`; }

router.get("/content-quality", async (req, res) => {
  const days = windowDays(req.query.window);
  try {
    const [summaryRows, throughput, statuses, chapters, reviewers, validationRows, translationRows, qualityRows] = await Promise.all([
      sqlClient`
        WITH bounds AS (SELECT now()-make_interval(days=>${days}) AS start_at),
        touched AS (
          SELECT q.id,q.status::text AS status FROM content.questions q,bounds b
          WHERE q.deleted_at IS NULL AND q.updated_at>=b.start_at
        ), added AS (
          SELECT id FROM platform.audit_events,bounds b
          WHERE action_key='content.review.comment.added' AND occurred_at>=b.start_at
        ), latest_resolution AS (
          SELECT DISTINCT ON (metadata->>'commentId') metadata->>'commentId' AS comment_id,metadata->>'resolved' AS resolved
          FROM platform.audit_events
          WHERE action_key='content.review.comment.resolution.changed' AND metadata ? 'commentId'
          ORDER BY metadata->>'commentId',occurred_at DESC,id DESC
        )
        SELECT COUNT(*)::int AS "questionCount",
          COUNT(*) FILTER (WHERE status IN ('approved','published'))::int AS "approvedCount",
          COUNT(*) FILTER (WHERE status='needs_fix')::int AS "needsFixCount",
          COUNT(*) FILTER (WHERE status='rejected')::int AS "rejectedCount",
          COUNT(*) FILTER (WHERE status='under_review')::int AS "underReviewCount",
          (SELECT COUNT(*)::int FROM added) AS "commentCount",
          (SELECT COUNT(*)::int FROM added a LEFT JOIN latest_resolution r ON r.comment_id=a.id::text WHERE COALESCE(r.resolved,'false')<>'true') AS "openCommentCount"
        FROM touched
      `,
      sqlClient`
        WITH days AS (SELECT generate_series(current_date-(${days-1})::int,current_date,interval '1 day')::date AS day),
        events AS (
          SELECT occurred_at::date AS day,
            COUNT(*) FILTER (WHERE action_key IN ('content.question.approved','content.generation.item.approved'))::int AS approved,
            COUNT(*) FILTER (WHERE action_key IN ('content.question.rejected','content.generation.item.rejected'))::int AS rejected,
            COUNT(*) FILTER (WHERE action_key='content.review.comment.added')::int AS comments,
            COUNT(*) FILTER (WHERE action_key='content.review.comment.resolution.changed' AND metadata->>'resolved'='true')::int AS resolved
          FROM platform.audit_events WHERE occurred_at>=current_date-(${days-1})::int AND action_key LIKE 'content.%' GROUP BY 1
        )
        SELECT d.day,COALESCE(e.approved,0)::int AS approved,COALESCE(e.rejected,0)::int AS rejected,COALESCE(e.comments,0)::int AS comments,COALESCE(e.resolved,0)::int AS resolved
        FROM days d LEFT JOIN events e ON e.day=d.day ORDER BY d.day
      `,
      sqlClient`SELECT q.status::text AS status,COUNT(*)::int AS count FROM content.questions q WHERE q.deleted_at IS NULL GROUP BY q.status ORDER BY count DESC`,
      sqlClient`
        WITH RECURSIVE roots AS (
          SELECT id,code,name FROM catalog.taxonomy_nodes WHERE deleted_at IS NULL AND is_active=true AND node_type IN ('chapter'::taxonomy_node_type,'subtopic'::taxonomy_node_type)
        ), hierarchy(root_id,descendant_id) AS (
          SELECT id,id FROM roots UNION SELECT h.root_id,e.child_id FROM hierarchy h JOIN catalog.taxonomy_edges e ON e.parent_id=h.descendant_id
        ), linked AS (
          SELECT r.id,r.code,r.name,q.id AS question_id,q.status::text AS status,v.stem,v.explanation
          FROM roots r JOIN hierarchy h ON h.root_id=r.id
          LEFT JOIN content.question_taxonomy_links l ON l.taxonomy_node_id=h.descendant_id
          LEFT JOIN content.questions q ON COALESCE(q.current_draft_version_id,q.approved_version_id,q.published_version_id)=l.question_version_id AND q.deleted_at IS NULL
          LEFT JOIN content.question_versions v ON v.id=l.question_version_id
        ), aggregates AS (
          SELECT id,code,name,COUNT(DISTINCT question_id)::int AS question_count,
            COUNT(DISTINCT question_id) FILTER (WHERE status IN ('approved','published'))::int AS approved_count,
            COUNT(DISTINCT question_id) FILTER (WHERE COALESCE(stem,'') ~ '\\{\\{[^}]+\\}\\}' OR COALESCE(explanation,'') ~ '\\{\\{[^}]+\\}\\}')::int AS placeholder_count
          FROM linked GROUP BY id,code,name HAVING COUNT(DISTINCT question_id)>0
        )
        SELECT a.id::text AS "chapterId",a.code,a.name,a.question_count AS "questionCount",a.approved_count AS "approvedCount",a.placeholder_count AS "placeholderCount",
          COALESCE(target.target_coverage,0)::int AS "targetCoverage",
          COALESCE(duplicates.unresolved,0)::int AS "unresolvedDuplicateCount",
          freeze.occurred_at AS "freezeChangedAt",COALESCE(freeze.metadata->>'frozen','false')='true' AS frozen,
          CASE WHEN freeze.occurred_at IS NOT NULL AND EXISTS (
            SELECT 1 FROM content.questions changed JOIN content.question_taxonomy_links cl ON cl.question_version_id=COALESCE(changed.current_draft_version_id,changed.approved_version_id,changed.published_version_id)
            JOIN hierarchy ch ON ch.descendant_id=cl.taxonomy_node_id WHERE ch.root_id=a.id AND changed.updated_at>freeze.occurred_at
          ) THEN true ELSE false END AS "freezeStale"
        FROM aggregates a
        LEFT JOIN LATERAL (SELECT MAX(target_coverage)::int AS target_coverage FROM catalog.exam_taxonomy_nodes WHERE taxonomy_node_id=a.id AND is_active=true) target ON true
        LEFT JOIN LATERAL (
          SELECT COUNT(*) FILTER (WHERE COALESCE(event.metadata->>'decision','unresolved')='unresolved')::int AS unresolved
          FROM platform.audit_events event WHERE event.entity_type='taxonomy_node' AND event.entity_id=a.id AND event.action_key='content.duplicate.decision.recorded'
        ) duplicates ON true
        LEFT JOIN LATERAL (
          SELECT occurred_at,metadata FROM platform.audit_events event WHERE event.entity_type='taxonomy_node' AND event.entity_id=a.id AND event.action_key='content.chapter.freeze.changed' ORDER BY occurred_at DESC,id DESC LIMIT 1
        ) freeze ON true
        ORDER BY a.placeholder_count DESC,"unresolvedDuplicateCount" DESC,"freezeStale" DESC,(a.approved_count::float/NULLIF(a.question_count,0)),a.name LIMIT 200
      `,
      sqlClient`
        WITH assignments AS (
          SELECT DISTINCT ON (entity_type,entity_id) entity_type,entity_id,occurred_at,metadata->>'assignedReviewerUserId' AS reviewer_id
          FROM platform.audit_events WHERE action_key='content.review.assignment.changed' ORDER BY entity_type,entity_id,occurred_at DESC,id DESC
        )
        SELECT u.id::text AS "reviewerId",COALESCE(u.display_name,u.email) AS name,u.email,
          COUNT(*) FILTER (WHERE event.action_key='content.review.assignment.changed' AND event.metadata->>'assignedReviewerUserId'=u.id::text)::int AS assignments,
          COUNT(*) FILTER (WHERE event.actor_user_id=u.id AND event.action_key='content.review.comment.added')::int AS comments,
          COUNT(*) FILTER (WHERE event.actor_user_id=u.id AND event.action_key='content.review.comment.resolution.changed' AND event.metadata->>'resolved'='true')::int AS resolutions,
          COALESCE((SELECT COUNT(*) FROM assignments a WHERE a.reviewer_id=u.id::text AND a.occurred_at<now()-interval '48 hours'),0)::int AS "agedAssignments",
          COALESCE((SELECT COUNT(*) FROM assignments a WHERE a.reviewer_id=u.id::text AND a.occurred_at<now()-interval '96 hours'),0)::int AS "overdueAssignments"
        FROM identity.admin_profiles p JOIN identity.users u ON u.id=p.user_id
        LEFT JOIN platform.audit_events event ON event.occurred_at>=now()-make_interval(days=>${days}) AND event.action_key LIKE 'content.%'
        WHERE p.is_suspended=false AND u.deleted_at IS NULL GROUP BY u.id ORDER BY "overdueAssignments" DESC,assignments DESC,comments DESC,name LIMIT 100
      `,
      sqlClient`
        SELECT COUNT(*)::int AS "runCount",
          COUNT(*) FILTER (WHERE status::text IN ('failed','error'))::int AS "failedRunCount",
          COUNT(*) FILTER (WHERE status::text IN ('passed','completed','succeeded'))::int AS "passedRunCount",
          COUNT(*) FILTER (WHERE completed_at IS NULL)::int AS "incompleteRunCount"
        FROM content.validation_runs WHERE created_at>=now()-make_interval(days=>${days})
      `,
      sqlClient`
        SELECT COUNT(*)::int AS "translationCount",
          COUNT(*) FILTER (WHERE status::text IN ('approved','published'))::int AS "readyTranslationCount",
          COUNT(*) FILTER (WHERE status::text IN ('draft','needs_fix','rejected'))::int AS "blockedTranslationCount",
          COUNT(DISTINCT question_version_id)::int AS "translatedQuestionCount"
        FROM content.question_translations WHERE updated_at>=now()-make_interval(days=>${days})
      `,
      sqlClient`
        SELECT
          COUNT(*) FILTER (WHERE q.current_draft_version_id IS NULL AND q.approved_version_id IS NULL AND q.published_version_id IS NULL)::int AS "questionsWithoutCurrentVersion",
          COUNT(*) FILTER (WHERE q.status IN ('approved','published') AND q.approved_version_id IS NULL AND q.published_version_id IS NULL)::int AS "approvedWithoutImmutableVersion",
          COUNT(*) FILTER (WHERE NOT EXISTS (SELECT 1 FROM content.question_taxonomy_links l WHERE l.question_version_id=COALESCE(q.current_draft_version_id,q.approved_version_id,q.published_version_id)))::int AS "questionsWithoutTaxonomy"
        FROM content.questions q WHERE q.deleted_at IS NULL
      `,
    ]);
    res.json({ windowDays:days,generatedAt:new Date().toISOString(),summary:summaryRows[0],throughput,statuses,chapters,reviewers,validation:validationRows[0],translations:translationRows[0],quality:qualityRows[0],scope:{readOnly:true,piiExport:false,duplicateDecisions:"aggregate_only",chapterFreeze:"diagnostic_only",scanBounded:true} });
  } catch (error) { console.error("Unable to load content quality analytics",error); res.status(500).json({error:"Unable to load content quality analytics",code:"CONTENT_QUALITY_ANALYTICS_FAILED"}); }
});

router.get("/content-quality.csv",async(req,res)=>{const days=windowDays(req.query.window);try{const rows=await sqlClient`
  SELECT q.public_code AS "publicCode",q.status::text AS status,q.updated_at AS "updatedAt",v.difficulty::text AS difficulty,v.question_type::text AS "questionType",COALESCE(n.code,'') AS "taxonomyCode",COALESCE(n.name,'') AS "taxonomyName"
  FROM content.questions q JOIN content.question_versions v ON v.id=COALESCE(q.current_draft_version_id,q.approved_version_id,q.published_version_id)
  LEFT JOIN content.question_taxonomy_links l ON l.question_version_id=v.id AND l.is_primary=true LEFT JOIN catalog.taxonomy_nodes n ON n.id=l.taxonomy_node_id
  WHERE q.deleted_at IS NULL AND q.updated_at>=now()-make_interval(days=>${days}) ORDER BY q.updated_at DESC LIMIT 10000`;
  const header=["public_code","status","updated_at","difficulty","question_type","taxonomy_code","taxonomy_name"];
  const lines=[header.join(","),...rows.map(row=>[row.publicCode,row.status,new Date(String(row.updatedAt)).toISOString(),row.difficulty,row.questionType,row.taxonomyCode,row.taxonomyName].map(csvCell).join(","))];
  res.setHeader("Content-Type","text/csv; charset=utf-8");res.setHeader("Content-Disposition",`attachment; filename="content-quality-${days}d.csv"`);res.send(`\uFEFF${lines.join("\n")}`);
}catch(error){console.error("Unable to export content quality analytics",error);res.status(500).json({error:"Unable to export content quality analytics",code:"CONTENT_QUALITY_EXPORT_FAILED"});}});

export default router;
