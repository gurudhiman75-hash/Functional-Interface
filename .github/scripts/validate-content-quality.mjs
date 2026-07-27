import fs from 'node:fs';

const read=(path)=>fs.readFileSync(path,'utf8');
const api=read('artifacts/api-server/src/routes/admin-content-quality.ts');
const index=read('artifacts/api-server/src/routes/index.ts');
const page=read('artifacts/admin-app/src/pages/analytics/ContentQualityPage.tsx');
const app=read('artifacts/admin-app/src/App.tsx');
const nav=read('artifacts/admin-app/src/app/nav/navigation.ts');
const checks=[
 ['read permission',api.includes('content.questions.read')],
 ['read-only routes',!/(INSERT INTO|UPDATE |DELETE FROM)/.test(api)],
 ['supported windows',api.includes('[7, 30, 90, 365]')],
 ['csv protection',api.includes('/^[=+\\-@]/')],
 ['bounded export',api.includes('LIMIT 10000')],
 ['no pii export',!api.includes('u.email')&&!api.includes('display_name')],
 ['mounted',index.includes('adminContentQualityRouter')&&index.includes('router.use("/admin/analytics", adminContentQualityRouter)')],
 ['live page',page.includes('/admin/analytics/content-quality')&&!page.includes('@/data/analytics')&&!page.includes('demonstration data')],
 ['en-US locale',page.includes("'en-US'")],
 ['route',app.includes("path: '/analytics/content-quality'" )],
 ['navigation',nav.includes("path: '/analytics/content-quality'")&&nav.includes("status: 'live'")&&nav.includes("permission: 'content.questions.read'" )],
];
const failed=checks.filter(([,ok])=>!ok);for(const[name,ok]of checks)console.log(`${ok?'PASS':'FAIL'} ${name}`);if(failed.length)process.exit(1);
console.log('Content Quality source freeze validator passed.');
