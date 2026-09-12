import './App.css';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AdminLayout } from '@/app/layout/AdminLayout';
import { ThemeProvider } from '@/app/theme/ThemeProvider';
import { MathRenderingProvider } from '@/components/shared/MathRenderingProvider';
import { Toaster } from '@/components/ui/sonner';
import { ContentReviewPage } from '@/pages/content/ContentReviewPage';
import { QuestionBankWorkspacePage } from '@/pages/content/QuestionBankWorkspacePage';
import { QuestionDetailPage } from '@/pages/content/QuestionDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { PendingWorkspacePage } from '@/pages/PendingWorkspacePage';
import { LiveDashboardPage } from '@/pages/overview/LiveDashboardPage';
import { TestDetailPage } from '@/pages/tests/TestDetailPage';
import { TestQAWorkspacePage } from '@/pages/tests/TestQAWorkspacePage';
import { TestsPage } from '@/pages/tests/TestsPage';
const QuestionStudioPage=lazy(()=>import('@/pages/content/QuestionStudioOperationsPage').then(m=>({default:m.QuestionStudioOperationsPage})));
const NotesStudioPage=lazy(()=>import('@/pages/content/NotesStudioHubPage').then(m=>({default:m.NotesStudioHubPage})));
const NotesStudioV2Page=lazy(()=>import('@/features/notes-studio-v2/pages/NotesStudioPage').then(m=>({default:m.NotesStudioPage})));
const NotesStudioV2PeriodPage=lazy(()=>import('@/features/notes-studio-v2/pages/PeriodWorkspacePage').then(m=>({default:m.PeriodWorkspacePage})));
const LearningResourcesPage=lazy(()=>import('@/pages/content/LearningResourcesHubPage').then(m=>({default:m.LearningResourcesHubPage})));
const CurrentAffairsEditorialQueuePage=lazy(()=>import('@/pages/content/CurrentAffairsEditorialQueuePage').then(m=>({default:m.CurrentAffairsEditorialQueuePage})));
const CurrentAffairsEditorialEventPage=lazy(()=>import('@/pages/content/CurrentAffairsEditorialEventPage').then(m=>({default:m.CurrentAffairsEditorialEventPage})));
const CurrentAffairsEditorialQuestionPage=lazy(()=>import('@/pages/content/CurrentAffairsEditorialQuestionPage').then(m=>({default:m.CurrentAffairsEditorialQuestionPage})));
const CurrentAffairsProductionReadinessPage=lazy(()=>import('@/pages/content/CurrentAffairsProductionReadinessPage').then(m=>({default:m.CurrentAffairsProductionReadinessPage})));
const TaxonomyPage=lazy(()=>import('@/pages/content/TaxonomyWorkspacePage').then(m=>({default:m.TaxonomyWorkspacePage})));
const CoveragePage=lazy(()=>import('@/pages/content/CoveragePlannerPage').then(m=>({default:m.CoveragePlannerPage})));
const TestBuilderPage=lazy(()=>import('@/pages/tests/TestBuilderRecoveryPage').then(m=>({default:m.TestBuilderRecoveryPage})));
const PublishingCalendarPage=lazy(()=>import('@/pages/tests/PublishingCalendarPage').then(m=>({default:m.PublishingCalendarPage})));
const ExamBlueprintsPage=lazy(()=>import('@/pages/tests/ExamBlueprintsWorkspacePage').then(m=>({default:m.ExamBlueprintsWorkspacePage})));
const TestSeriesPage=lazy(()=>import('@/pages/tests/TestSeriesWorkspacePage').then(m=>({default:m.TestSeriesWorkspacePage})));
const PackagesPage=lazy(()=>import('@/pages/commerce/PackagesWorkspacePage').then(m=>({default:m.PackagesWorkspacePage})));
const PackageDetailPage=lazy(()=>import('@/pages/commerce/PackagesWorkspacePage').then(m=>({default:m.PackageDetailPage})));
const OrdersPaymentsPage=lazy(()=>import('@/pages/commerce/OrdersPaymentsWorkspacePage').then(m=>({default:m.OrdersPaymentsWorkspacePage})));
const OrderPaymentDetailPage=lazy(()=>import('@/pages/commerce/OrdersPaymentsWorkspacePage').then(m=>({default:m.OrderPaymentDetailPage})));
const CouponsPage=lazy(()=>import('@/pages/commerce/CouponsWorkspacePage').then(m=>({default:m.CouponsWorkspacePage})));
const EntitlementsPage=lazy(()=>import('@/pages/commerce/EntitlementsWorkspacePage').then(m=>({default:m.EntitlementsWorkspacePage})));
const BusinessAnalyticsPage=lazy(()=>import('@/pages/analytics/BusinessAnalyticsPage').then(m=>({default:m.BusinessAnalyticsPage})));
const ContentQualityPage=lazy(()=>import('@/pages/analytics/ContentQualityPage').then(m=>({default:m.ContentQualityPage})));
const TestAnalyticsPage=lazy(()=>import('@/pages/analytics/TestAnalyticsPage').then(m=>({default:m.TestAnalyticsPage})));
const TestAnalyticsDetailPage=lazy(()=>import('@/pages/analytics/TestAnalyticsPage').then(m=>({default:m.TestAnalyticsDetailPage})));
const TestAnalyticsQualityPage=lazy(()=>import('@/pages/analytics/TestAnalyticsQualityPage').then(m=>({default:m.TestAnalyticsQualityPage})));
const QuestionAnalyticsPage=lazy(()=>import('@/pages/analytics/QuestionAnalyticsPage').then(m=>({default:m.QuestionAnalyticsPage})));
const QuestionAnalyticsDetailPage=lazy(()=>import('@/pages/analytics/QuestionAnalyticsPage').then(m=>({default:m.QuestionAnalyticsDetailPage})));
const QuestionAnalyticsQualityPage=lazy(()=>import('@/pages/analytics/QuestionAnalyticsQualityPage').then(m=>({default:m.QuestionAnalyticsQualityPage})));
const SystemHealthPage=lazy(()=>import('@/pages/analytics/SystemHealthWorkspacePage').then(m=>({default:m.SystemHealthWorkspacePage})));
const RequestFailuresPage=lazy(()=>import('@/pages/analytics/RequestFailuresPage').then(m=>({default:m.RequestFailuresPage})));
const ExamConfigurationPage=lazy(()=>import('@/pages/settings/ExamConfigurationPage').then(m=>({default:m.ExamConfigurationPage})));
const LanguagesPage=lazy(()=>import('@/pages/settings/LanguagesPage').then(m=>({default:m.LanguagesPage})));
const AdminTeamPage=lazy(()=>import('@/pages/users/AdminTeamWorkspacePage').then(m=>({default:m.AdminTeamWorkspacePage})));
const StudentsPage=lazy(()=>import('@/pages/users/StudentsWorkspacePage').then(m=>({default:m.StudentsWorkspacePage})));
const StudentProfilePage=lazy(()=>import('@/pages/users/StudentProfileWorkspacePage').then(m=>({default:m.StudentProfileWorkspacePage})));
const RecoveryRequestsPage=lazy(()=>import('@/pages/users/RecoveryRequestsPage').then(m=>({default:m.RecoveryRequestsPage})));
const AttemptsPage=lazy(()=>import('@/pages/users/AttemptsWorkspacePage').then(m=>({default:m.AttemptsWorkspacePage})));
const AttemptDetailPage=lazy(()=>import('@/pages/users/AttemptsWorkspacePage').then(m=>({default:m.AttemptDetailPage})));
const AttemptInvestigationsPage=lazy(()=>import('@/pages/users/AttemptInvestigationsPage').then(m=>({default:m.AttemptInvestigationsPage})));
const AttemptExportsPage=lazy(()=>import('@/pages/users/AttemptExportsPage').then(m=>({default:m.AttemptExportsPage})));
const RolesPermissionsPage=lazy(()=>import('@/pages/settings/RolesPermissionsWorkspacePage').then(m=>({default:m.RolesPermissionsWorkspacePage})));
const AuditLogsPage=lazy(()=>import('@/pages/settings/AuditLogsWorkspacePage').then(m=>({default:m.AuditLogsWorkspacePage})));
function RouteFallback(){return <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">Loading canonical admin workspace…</div>}
const router=createBrowserRouter([{element:<AdminLayout/>,children:[
{index:true,element:<Navigate to="/dashboard" replace/>},{path:'/dashboard',element:<LiveDashboardPage/>},{path:'/content/questions/generate',element:<QuestionStudioPage/>},{path:'/content/studio',element:<Navigate to="/content/questions/generate" replace/>},{path:'/content/notes-studio-v2',element:<NotesStudioV2Page/>},{path:'/content/notes-studio-v2/periods/:periodId',element:<NotesStudioV2PeriodPage/>},{path:'/content/notes-studio',element:<NotesStudioPage/>},{path:'/content/questions/:id',element:<QuestionDetailPage/>},{path:'/content/questions',element:<QuestionBankWorkspacePage/>},{path:'/content/review',element:<ContentReviewPage/>},{path:'/content/learning-resources',element:<LearningResourcesPage/>},{path:'/content/current-affairs/events/:eventId',element:<CurrentAffairsEditorialEventPage/>},{path:'/content/current-affairs/questions/:generationItemId',element:<CurrentAffairsEditorialQuestionPage/>},{path:'/content/current-affairs/production-readiness',element:<CurrentAffairsProductionReadinessPage/>},{path:'/content/current-affairs',element:<CurrentAffairsEditorialQueuePage/>},{path:'/content/coverage',element:<CoveragePage/>},{path:'/content/taxonomy',element:<TaxonomyPage/>},{path:'/content/sets',element:<PendingWorkspacePage/>},{path:'/content/media',element:<PendingWorkspacePage/>},
{path:'/tests/builder',element:<TestBuilderPage/>},{path:'/tests/test-builder',element:<Navigate to="/tests/builder" replace/>},{path:'/tests/qa',element:<TestQAWorkspacePage/>},{path:'/tests/series',element:<TestSeriesPage/>},{path:'/tests/blueprints',element:<ExamBlueprintsPage/>},{path:'/tests/calendar',element:<PublishingCalendarPage/>},{path:'/tests/:id',element:<TestDetailPage/>},{path:'/tests',element:<TestsPage/>},
{path:'/commerce/entitlements',element:<EntitlementsPage/>},{path:'/commerce/coupons',element:<CouponsPage/>},{path:'/commerce/orders/:orderId',element:<OrderPaymentDetailPage/>},{path:'/commerce/orders',element:<OrdersPaymentsPage/>},{path:'/commerce/packages/:productId',element:<PackageDetailPage/>},{path:'/commerce/packages',element:<PackagesPage/>},{path:'/commerce/*',element:<PendingWorkspacePage/>},
{path:'/users/attempt-exports',element:<AttemptExportsPage/>},{path:'/users/attempt-investigations',element:<AttemptInvestigationsPage/>},{path:'/users/attempts/:id',element:<AttemptDetailPage/>},{path:'/users/attempts',element:<AttemptsPage/>},{path:'/users/students/:id',element:<StudentProfilePage/>},{path:'/users/students',element:<StudentsPage/>},{path:'/users/recovery',element:<RecoveryRequestsPage/>},{path:'/users/team',element:<AdminTeamPage/>},{path:'/users/*',element:<PendingWorkspacePage/>},
{path:'/analytics/business',element:<BusinessAnalyticsPage/>},{path:'/analytics/content-quality',element:<ContentQualityPage/>},{path:'/analytics/tests/quality',element:<TestAnalyticsQualityPage/>},{path:'/analytics/tests/:publicationId',element:<TestAnalyticsDetailPage/>},{path:'/analytics/tests',element:<TestAnalyticsPage/>},{path: '/analytics/questions/quality',element:<QuestionAnalyticsQualityPage/>},{path: '/analytics/questions/:questionVersionId',element:<QuestionAnalyticsDetailPage/>},{path: '/analytics/questions',element:<QuestionAnalyticsPage/>},{path:'/analytics/request-failures',element:<RequestFailuresPage/>},{path:'/analytics/system-health',element:<SystemHealthPage/>},{path:'/analytics/*',element:<PendingWorkspacePage/>},
{path:'/settings/exam-config',element:<ExamConfigurationPage/>},{path:'/settings/languages',element:<LanguagesPage/>},{path:'/settings/roles',element:<RolesPermissionsPage/>},{path:'/settings/audit-logs',element:<AuditLogsPage/>},{path:'/settings/*',element:<PendingWorkspacePage/>},{path:'*',element:<NotFoundPage/>}
]}],{basename:'/admin'});
export default function App(){return <MathRenderingProvider><ThemeProvider><Suspense fallback={<RouteFallback/>}><RouterProvider router={router}/></Suspense><Toaster/></ThemeProvider></MathRenderingProvider>}
