import { DashboardView } from '@/features/dashboard/components/dashboard-view'
import { getDashboardData } from '@/features/dashboard/services/dashboard.service'

export default async function HomeDashboardPage() {
  const dashboardData = await getDashboardData()

  return <DashboardView data={dashboardData} />
}
