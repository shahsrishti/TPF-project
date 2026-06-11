"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { Badge } from "@/components/ui/badge"

const COLORS = ['#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#F5F3FF', '#4C1D95', '#5B21B6', '#6D28D9', '#EED2EE'];

export function AnalyticsCharts({ 
  categoryData, 
  sourceData, 
  keywordData, 
  growthData, 
  topTpf, 
  topImportance 
}: any) {
  
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-16 px-4 text-center">
        <h4 className="text-lg font-medium text-white mb-2">No data available</h4>
        <p className="text-gray-400 text-sm max-w-sm">
          Run ingestion and process articles to see analytics.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top row: Category and Source */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Articles by Category</CardTitle>
            <CardDescription className="text-gray-400">Distribution of topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1f2937' }} />
                  <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Source Distribution</CardTitle>
            <CardDescription className="text-gray-400">Top sources by article volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {sourceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1f2937' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle row: Weekly Growth and Trending Keywords */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Weekly Growth</CardTitle>
            <CardDescription className="text-gray-400">Articles processed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => val.split("-").slice(1).join("/")} />
                  <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1f2937' }} />
                  <Line type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Trending Keywords</CardTitle>
            <CardDescription className="text-gray-400">Most frequent topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={keywordData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} hide />
                  <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} width={100} />
                  <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1f2937' }} />
                  <Bar dataKey="value" fill="#A78BFA" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Top 10 lists */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Top 10 High-Impact Articles</CardTitle>
            <CardDescription className="text-gray-400">Ranked by general importance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topImportance.map((article: any, idx: number) => (
                <div key={article.id} className="flex items-start gap-4">
                  <div className="font-bold text-xl text-violet-500 w-6 text-right shrink-0">{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate"><a href={article.url} target="_blank" className="hover:underline">{article.title}</a></p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">{article.source.name}</Badge>
                      <span className="text-xs text-violet-400 font-semibold">Score: {article.importanceScore}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Top 10 TPF Relevant Articles</CardTitle>
            <CardDescription className="text-gray-400">Ranked by community relevance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTpf.map((article: any, idx: number) => (
                <div key={article.id} className="flex items-start gap-4">
                  <div className="font-bold text-xl text-indigo-500 w-6 text-right shrink-0">{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate"><a href={article.url} target="_blank" className="hover:underline">{article.title}</a></p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] bg-white/5 border-white/10">{article.source.name}</Badge>
                      <span className="text-xs text-indigo-400 font-semibold">Score: {article.tpfRelevanceScore}/10</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
