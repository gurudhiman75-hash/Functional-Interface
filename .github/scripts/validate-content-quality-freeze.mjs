import fs from 'node:fs';

const read=(path)=>fs.readFileSync(path,'utf8');
const route=read('artifacts/api-server/src/routes/admin-content-quality.ts');
const ui=read('artifacts/admin-app/src/pages/analytics/ContentQualityPage.tsx');
const index=read('artifacts/api-server/src/routes/index.ts');
const app=read('artifacts/admin-app/src/App.tsx');
const nav=read('artifacts/admin-app/src/app/nav/navigation.ts');
const checks=[
  [route.includes('requireAdminPermission("content.questions.read")'),'read permission'],
  [route.includes('latest_resolution'),'latest comment resolution semantics'],
  [route.includes('unresolvedDuplicateCount'),'duplicate-risk aggregate'],
  [route.includes('freezeStale'),'stale freeze diagnostic'],
  [route.includes('agedAssignments')&&route.includes('overdueAssignments'),'review queue ageing'],
  [route.includes('content.validation_runs'),'validation signals'],
  [route.includes('content.question_translations'),'translation signals'],
  [route.includes('LIMIT 10000'),'bounded CSV'],
  [route.includes('/^[=+\\-@]/'),'CSV formula protection'],
  [!route.includes('identity.users u ON u.id=q.user_id'),'no student identity join'],
  [index.includes('router.use("/admin/analytics", adminContentQualityRouter)'),'API mount'],
  [app.includes("path: '/analytics/content-quality'"),'admin route'],
  [nav.includes("path: '/analytics/content-quality'")&&nav.includes("permission: 'content.questions.read'"),'live permission navigation'],
  [ui.includes("new Intl.NumberFormat('en-US')"),'en-US number formatting'],
  [!ui.includes('@/data/analytics')&&!ui.includes('demonstration data'),'no prototype analytics'],
];
const failed=checks.filter(([ok])=>!ok).map(([,name])=>name);
if(failed.length){console.error(`Content Quality freeze validation failed: ${failed.join(', ')}`);process.exit(1);}
console.log(`Content Quality freeze validation passed (${checks.length} checks).`);
