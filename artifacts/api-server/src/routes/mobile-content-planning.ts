import { Router } from "express";
import { sqlClient } from "../lib/db";
const router=Router();
router.get("/mobile/content-plan",async(req,res)=>{
  try{
    const slot=typeof req.query.slot==="string"?req.query.slot.trim().slice(0,80):"";
    const language=typeof req.query.language==="string"?req.query.language.trim().slice(0,20):"";
    const rows=await sqlClient`
      SELECT id::text AS id,slot_key AS "slotKey",entity_type AS "entityType",entity_id::text AS "entityId",label_override AS "labelOverride",badge_text AS "badgeText",language_code AS "languageCode",sort_order AS "sortOrder"
      FROM platform.mobile_content_plan_items
      WHERE is_active=true
        AND (${slot}='' OR slot_key=${slot})
        AND (${language}='' OR language_code='' OR language_code=${language})
        AND (start_at IS NULL OR start_at<=now())
        AND (end_at IS NULL OR end_at>=now())
      ORDER BY slot_key,sort_order,updated_at DESC
      LIMIT 100
    `;
    res.setHeader("Cache-Control","public, max-age=60, stale-while-revalidate=300");
    res.json({items:rows,generatedAt:new Date().toISOString()});
  }catch(error){console.error("Unable to load public mobile content plan",error);res.status(500).json({error:"Unable to load mobile content plan",code:"MOBILE_CONTENT_PLAN_PUBLIC_LOAD_FAILED"});}
});
export default router;