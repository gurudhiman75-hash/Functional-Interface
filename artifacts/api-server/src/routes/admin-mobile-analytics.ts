import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router=Router();
router.use(authenticate);
router.get("/",requireAdminPermission("content.taxonomy.read"),async(req,res)=>{
  try{
    const requested=Number(req.query.days);const days=Number.isFinite(requested)?Math.max(1,Math.min(90,Math.floor(requested))):30;
    const [summary,daily,events,topEntities,notificationSummary,promotionSummary]=await Promise.all([
      sqlClient`
        WITH bounds AS (SELECT now()-make_interval(days=>${days}) AS start_at)
        SELECT
          COUNT(*)::int AS "eventCount",
          COUNT(DISTINCT NULLIF(session_id,''))::int AS "sessions",
          COUNT(DISTINCT user_id)::int AS "knownUsers",
          COUNT(*) FILTER (WHERE event_name='app_open')::int AS "appOpens",
          COUNT(*) FILTER (WHERE event_name='home_view')::int AS "homeViews",
          COUNT(*) FILTER (WHERE event_name IN ('hero_click','promotion_click','content_plan_click'))::int AS "discoveryClicks"
        FROM platform.mobile_analytics_events,bounds
        WHERE occurred_at>=bounds.start_at
      `,
      sqlClient`
        WITH days AS (
          SELECT (current_date-g.day_offset)::date AS day
          FROM generate_series(0,${days-1}) AS g(day_offset)
        ), counts AS (
          SELECT (occurred_at AT TIME ZONE 'Asia/Kolkata')::date AS day,
            COUNT(*)::int AS events,
            COUNT(DISTINCT NULLIF(session_id,''))::int AS sessions,
            COUNT(*) FILTER (WHERE event_name='app_open')::int AS opens
          FROM platform.mobile_analytics_events
          WHERE occurred_at>=now()-make_interval(days=>${days})
          GROUP BY 1
        )
        SELECT days.day::text AS day,COALESCE(counts.events,0)::int AS events,COALESCE(counts.sessions,0)::int AS sessions,COALESCE(counts.opens,0)::int AS opens
        FROM days LEFT JOIN counts USING(day) ORDER BY days.day
      `,
      sqlClient`
        SELECT event_name AS "eventName",COUNT(*)::int AS count
        FROM platform.mobile_analytics_events
        WHERE occurred_at>=now()-make_interval(days=>${days})
        GROUP BY event_name ORDER BY count DESC,event_name
      `,
      sqlClient`
        SELECT entity_type AS "entityType",entity_id AS "entityId",placement,
          COUNT(*) FILTER (WHERE event_name LIKE '%impression')::int AS impressions,
          COUNT(*) FILTER (WHERE event_name LIKE '%click')::int AS clicks,
          COUNT(*) FILTER (WHERE event_name='promotion_dismiss')::int AS dismissals
        FROM platform.mobile_analytics_events
        WHERE occurred_at>=now()-make_interval(days=>${days})
          AND entity_id<>''
        GROUP BY entity_type,entity_id,placement
        ORDER BY clicks DESC,impressions DESC
        LIMIT 50
      `,
      sqlClient`
        SELECT
          COUNT(*)::int AS "deliveryCount",
          COUNT(*) FILTER (WHERE status='sent')::int AS "sentCount",
          COUNT(*) FILTER (WHERE status='failed')::int AS "failedCount",
          COUNT(*) FILTER (WHERE status='opened')::int AS "openedCount"
        FROM platform.mobile_notification_deliveries
        WHERE created_at>=now()-make_interval(days=>${days})
      `,
      sqlClient`
        SELECT
          COUNT(*) FILTER (WHERE event_name='promotion_impression')::int AS impressions,
          COUNT(*) FILTER (WHERE event_name='promotion_click')::int AS clicks,
          COUNT(*) FILTER (WHERE event_name='promotion_dismiss')::int AS dismissals
        FROM platform.mobile_analytics_events
        WHERE occurred_at>=now()-make_interval(days=>${days})
      `
    ]);
    res.json({days,summary:summary[0]??{},daily,events,topEntities,notificationSummary:notificationSummary[0]??{},promotionSummary:promotionSummary[0]??{},generatedAt:new Date().toISOString()});
  }catch(error){console.error("Unable to load mobile analytics",error);res.status(500).json({error:"Unable to load mobile analytics",code:"MOBILE_ANALYTICS_LOAD_FAILED"});}
});
export default router;
