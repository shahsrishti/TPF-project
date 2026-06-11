"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Plus, RefreshCw, Rss } from "lucide-react"
import { addSource, toggleSource, triggerIngestion } from "@/app/actions/sources"

export default function SourcesManager({ initialSources }: { initialSources: any[] }) {
  const [sources, setSources] = useState(initialSources)
  const [isAdding, setIsAdding] = useState(false)
  const [isIngesting, setIsIngesting] = useState(false)
  const [newSource, setNewSource] = useState({ name: "", url: "", rssUrl: "" })
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.url || !newSource.rssUrl) {
      toast.error("Please fill in all fields")
      return
    }

    setIsAdding(true)
    const result = await addSource(newSource.name, newSource.url, newSource.rssUrl)
    setIsAdding(false)

    if (result.success) {
      toast.success("Source added successfully")
      setDialogOpen(false)
      setNewSource({ name: "", url: "", rssUrl: "" })
      // Real app would refetch, for now optimistic update is fine, but server action revalidates
      // we can just let Next.js refresh the layout. Wait, since it's initialSources passed as prop,
      // it might not auto-refresh state. It's better to force a router.refresh()
      window.location.reload()
    } else {
      toast.error(result.error)
    }
  }

  const handleToggle = async (id: string, checked: boolean) => {
    // Optimistic update
    setSources(prev => prev.map(s => s.id === id ? { ...s, isActive: checked } : s))
    const result = await toggleSource(id, checked)
    if (result.success) {
      toast.success(`Source ${checked ? 'enabled' : 'disabled'}`)
    } else {
      toast.error(result.error)
      // Revert optimistic update
      setSources(prev => prev.map(s => s.id === id ? { ...s, isActive: !checked } : s))
    }
  }

  const handleIngestion = async () => {
    setIsIngesting(true)
    const result = await triggerIngestion()
    setIsIngesting(false)
    if (result.success) {
      toast.success("Ingestion triggered successfully! Check back soon for new articles.")
    } else {
      toast.error(`Ingestion failed: ${result.error}`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sources</h2>
          <p className="text-gray-400">Manage RSS feeds being monitored</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleIngestion} 
            disabled={isIngesting}
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl"
          >
            {isIngesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
            Run Ingestion
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger 
              render={
                <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] rounded-xl border-0" />
              }
            >
              <Plus className="mr-2 h-4 w-4 inline-block" /> Add Source
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 text-white sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Source</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Source Name</Label>
                  <Input 
                    id="name" 
                    value={newSource.name} 
                    onChange={e => setNewSource({...newSource, name: e.target.value})} 
                    placeholder="e.g. TechCrunch" 
                    className="bg-white/5 border-white/10 text-white" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input 
                    id="url" 
                    value={newSource.url} 
                    onChange={e => setNewSource({...newSource, url: e.target.value})} 
                    placeholder="e.g. https://techcrunch.com" 
                    className="bg-white/5 border-white/10 text-white" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="rssUrl">RSS Feed URL</Label>
                  <Input 
                    id="rssUrl" 
                    value={newSource.rssUrl} 
                    onChange={e => setNewSource({...newSource, rssUrl: e.target.value})} 
                    placeholder="e.g. https://techcrunch.com/feed/" 
                    className="bg-white/5 border-white/10 text-white" 
                  />
                </div>
              </div>
              <Button onClick={handleAddSource} disabled={isAdding} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                {isAdding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Source
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/[0.02] border-b border-white/[0.08]">
              <TableRow className="border-transparent hover:bg-transparent">
                <TableHead className="w-[30%] text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">RSS URL</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-right text-gray-400">Articles Collected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sources.length === 0 ? (
                <TableRow className="hover:bg-transparent border-transparent">
                  <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Rss className="h-8 w-8 mb-2 opacity-50" />
                      <p>No sources added yet</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sources.map((source) => (
                  <TableRow key={source.id} className="border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                    <TableCell className="font-medium text-white">{source.name}</TableCell>
                    <TableCell className="text-gray-400 font-mono text-xs truncate max-w-[200px] sm:max-w-none" title={source.rssUrl}>
                      {source.rssUrl}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={source.isActive} onCheckedChange={(checked) => handleToggle(source.id, checked)} />
                        <Badge variant={source.isActive ? "default" : "secondary"} className={source.isActive ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-white/5 text-gray-400 border border-white/10"}>
                          {source.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-300">
                      {source._count.articles}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
