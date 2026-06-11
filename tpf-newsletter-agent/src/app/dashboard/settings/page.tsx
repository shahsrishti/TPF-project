import SettingsForm from "@/components/dashboard/SettingsForm"
import { getIntegration } from "@/app/actions/settings"

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const [googleData, notionData] = await Promise.all([
    getIntegration("google-sheets"),
    getIntegration("notion")
  ])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings & Integrations</h2>
        <p className="text-gray-400">Manage API keys and database exports</p>
      </div>

      <SettingsForm initialGoogle={googleData} initialNotion={notionData} />
    </div>
  )
}
