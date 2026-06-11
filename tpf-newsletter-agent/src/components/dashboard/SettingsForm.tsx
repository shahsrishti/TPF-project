"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { saveIntegrationSettings, toggleIntegration } from "@/app/actions/settings"
import { Loader2 } from "lucide-react"

export default function SettingsForm({ initialGoogle, initialNotion }: { initialGoogle: any, initialNotion: any }) {
  const [googleConfig, setGoogleConfig] = useState({
    spreadsheetId: initialGoogle?.config?.spreadsheetId || "",
    token: initialGoogle?.apiKey || "",
    isActive: initialGoogle?.isActive || false
  })
  
  const [notionConfig, setNotionConfig] = useState({
    databaseId: initialNotion?.config?.databaseId || "",
    token: initialNotion?.apiKey || "",
    isActive: initialNotion?.isActive || false
  })

  const [savingGoogle, setSavingGoogle] = useState(false)
  const [savingNotion, setSavingNotion] = useState(false)

  const handleSaveGoogle = async () => {
    setSavingGoogle(true)
    const result = await saveIntegrationSettings(
      "google-sheets", 
      { spreadsheetId: googleConfig.spreadsheetId },
      googleConfig.token,
      googleConfig.isActive
    )
    setSavingGoogle(false)
    if (result.success) {
      toast.success("Google Sheets configuration saved")
    } else {
      toast.error(result.error)
    }
  }

  const handleSaveNotion = async () => {
    setSavingNotion(true)
    const result = await saveIntegrationSettings(
      "notion", 
      { databaseId: notionConfig.databaseId },
      notionConfig.token,
      notionConfig.isActive
    )
    setSavingNotion(false)
    if (result.success) {
      toast.success("Notion configuration saved")
    } else {
      toast.error(result.error)
    }
  }

  const handleToggleGoogle = async (checked: boolean) => {
    setGoogleConfig(prev => ({ ...prev, isActive: checked }))
    await toggleIntegration("google-sheets", checked)
    toast.success(`Google Sheets integration ${checked ? 'enabled' : 'disabled'}`)
  }

  const handleToggleNotion = async (checked: boolean) => {
    setNotionConfig(prev => ({ ...prev, isActive: checked }))
    await toggleIntegration("notion", checked)
    toast.success(`Notion integration ${checked ? 'enabled' : 'disabled'}`)
  }

  return (
    <div className="grid gap-6">
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Google Sheets Sync</CardTitle>
              <CardDescription className="text-gray-400">Export curated articles directly to Google Sheets</CardDescription>
            </div>
            <Switch checked={googleConfig.isActive} onCheckedChange={handleToggleGoogle} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sheets-id">Spreadsheet ID</Label>
            <Input 
              id="sheets-id" 
              value={googleConfig.spreadsheetId}
              onChange={(e) => setGoogleConfig({ ...googleConfig, spreadsheetId: e.target.value })}
              placeholder="1BxiMVs0XRYFgwnLEUK..." 
              className="bg-white/5 border-white/10 rounded-xl focus:border-violet-500/50" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sheets-token">Service Account JSON</Label>
            <Input 
              id="sheets-token" 
              type="password" 
              value={googleConfig.token}
              onChange={(e) => setGoogleConfig({ ...googleConfig, token: e.target.value })}
              placeholder="Paste JSON here..." 
              className="bg-white/5 border-white/10 rounded-xl focus:border-violet-500/50" 
            />
          </div>
          <Button 
            onClick={handleSaveGoogle} 
            disabled={savingGoogle}
            className="bg-white text-black hover:bg-gray-200 rounded-xl"
          >
            {savingGoogle ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notion Integration</CardTitle>
              <CardDescription className="text-gray-400">Sync articles to a Notion Database</CardDescription>
            </div>
            <Switch checked={notionConfig.isActive} onCheckedChange={handleToggleNotion} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notion-token">Notion Internal Integration Token</Label>
            <Input 
              id="notion-token" 
              type="password" 
              value={notionConfig.token}
              onChange={(e) => setNotionConfig({ ...notionConfig, token: e.target.value })}
              placeholder="secret_..." 
              className="bg-white/5 border-white/10 rounded-xl focus:border-violet-500/50" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notion-db">Notion Database ID</Label>
            <Input 
              id="notion-db" 
              value={notionConfig.databaseId}
              onChange={(e) => setNotionConfig({ ...notionConfig, databaseId: e.target.value })}
              placeholder="1234567890abcdef..." 
              className="bg-white/5 border-white/10 rounded-xl focus:border-violet-500/50" 
            />
          </div>
          <Button 
            onClick={handleSaveNotion} 
            disabled={savingNotion}
            className="bg-white text-black hover:bg-gray-200 rounded-xl"
          >
            {savingNotion ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
