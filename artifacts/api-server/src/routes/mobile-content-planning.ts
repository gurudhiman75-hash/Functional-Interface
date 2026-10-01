import { Router } from "express";
import { sqlClient } from "../lib/db";
const router=Router();
router.get("/mobile/content-plan",async(req,res)=>{
  try{
    const slot=typeof req.query.slot==="string"?req.query.slot.trim().slice(0,80):"";
    const language=typeof req.query.language==="string"?req.query.language.trim().slice(0,20):"";
    const rows=await sqlClient`
      SELECT
        item.id::text AS id,
        item.slot_key AS "slotKey",
        item.entity_type AS "entityType",
        item.entity_id::text AS "entityId",
        item.label_override AS "labelOverride",
        COALESCE(
          NULLIF(item.label_override,''),
          family.name,
          series.name,
          resource.title,
          CASE
            WHEN release.public_code IS NOT NULL
              THEN 'Current Affairs · ' || release.public_code
            ELSE NULL
          END,
          'Featured content'
        ) AS "displayLabel",
        item.badge_text AS "badgeText",
        item.language_code AS "languageCode",
        item.sort_order AS "sortOrder"
      FROM platform.mobile_content_plan_items item
      LEFT JOIN catalog.exam_families family
        ON item.entity_type='exam_family' AND family.id=item.entity_id
      LEFT JOIN assessment.test_series series
        ON item.entity_type='test_series' AND series.id=item.entity_id AND series.deleted_at IS NULL
      LEFT JOIN content.learning_resources resource
        ON item.entity_type='learning_resource' AND resource.id=item.entity_id AND resource.status='published'
      LEFT JOIN content.current_affairs_releases release
        ON item.entity_type='current_affairs_release' AND release.id=item.entity_id AND release.status='approved'
      WHERE item.is_active=true
        AND (${slot}='' OR item.slot_key=${slot})
        AND (${language}='' OR item.language_code='' OR item.language_code=${language})
        AND (item.start_at IS NULL OR item.start_at<=now())
        AND (item.end_at IS NULL OR item.end_at>=now())
      ORDER BY item.slot_key,item.sort_order,item.updated_at DESC
      LIMIT 100
    `;
    res.setHeader("Cache-Control","public, max-age=60, stale-while-revalidate=300");
    res.json({items:rows,generatedAt:new Date().toISOString()});
  }catch(error){console.error("Unable to load public mobile content plan",error);res.status(500).json({error:"Unable to load mobile content plan",code:"MOBILE_CONTENT_PLAN_PUBLIC_LOAD_FAILED"});}
});
export default router;