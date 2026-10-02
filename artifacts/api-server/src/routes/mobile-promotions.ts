import { Router } from "express";

import { sqlClient } from "../lib/db";

const router=Router();
const allowed=new Set(["home","login_popup","learn","tests","results"]);

router.get("/mobile/promotions",async(req,res)=>{
  try{
    const placement=typeof req.query.placement==="string"&&allowed.has(req.query.placement)?req.query.placement:"home";
    const rows=await sqlClient`
      SELECT
        id::text AS id,title,subtitle,cta_label AS "ctaLabel",image_url AS "imageUrl",placement,
        destination_type AS "destinationType",destination_value AS "destinationValue",
        campaign_kind AS "campaignKind",is_dismissible AS "isDismissible",
        frequency_cap_per_day AS "frequencyCapPerDay",audience,sort_order AS "sortOrder"
      FROM platform.mobile_promotions
      WHERE placement=${placement}
        AND is_active=true
        AND (start_at IS NULL OR start_at<=now())
        AND (end_at IS NULL OR end_at>=now())
      ORDER BY sort_order,updated_at DESC
      LIMIT 20
    `;
    res.setHeader("Cache-Control","public, max-age=60, stale-while-revalidate=300");
    res.json({promotions:rows,generatedAt:new Date().toISOString()});
  }catch(error){
    console.error("Unable to load mobile promotions",error);
    res.status(500).json({error:"Unable to load mobile promotions",code:"MOBILE_PROMOTIONS_PUBLIC_LOAD_FAILED"});
  }
});

export default router;
