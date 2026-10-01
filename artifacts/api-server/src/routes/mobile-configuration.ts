import { Router } from "express";
import { sqlClient } from "../lib/db";
const router=Router();
router.get("/mobile/config",async(_req,res)=>{
  try{
    const rows=await sqlClient`SELECT configuration,updated_at AS "updatedAt" FROM platform.mobile_app_configuration WHERE singleton_key='default' LIMIT 1`;
    res.setHeader("Cache-Control","public, max-age=60, stale-while-revalidate=300");
    res.json({configuration:rows[0]?.configuration??{},updatedAt:rows[0]?.updatedAt??null,generatedAt:new Date().toISOString()});
  }catch(error){console.error("Unable to load public mobile config",error);res.status(500).json({error:"Unable to load mobile app configuration",code:"MOBILE_CONFIG_PUBLIC_LOAD_FAILED"});}
});
export default router;