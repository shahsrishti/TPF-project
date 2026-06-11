import Link from 'next/link'
import { ArrowRight, Bot, Database, BarChart, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden text-white selection:bg-violet-500/30">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <nav className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
              <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">TPF Research</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="text-xs sm:text-sm font-medium bg-white text-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] whitespace-nowrap"
            >
              <span className="hidden sm:inline">Go to Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-violet-500/30 text-violet-300 text-sm font-medium shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Newsletter Research Agent</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 pb-2">
            Research AI & Product <br /> News on <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400 text-glow">Autopilot</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Automatically monitor, summarize, categorize, and generate weekly AI & Product insights from the industry's top sources.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/dashboard" 
              className="h-14 px-8 inline-flex items-center justify-center rounded-full bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-all gap-2 w-full sm:w-auto shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32 relative">
          <FeatureCard 
            icon={<Database className="h-6 w-6 text-violet-400" />}
            title="Automated Ingestion"
            description="Continuously monitors trusted sources like OpenAI, Anthropic, and Product Hunt for the latest updates."
          />
          <FeatureCard 
            icon={<Bot className="h-6 w-6 text-blue-400" />}
            title="AI Processing"
            description="Gemini API automatically extracts summaries, categorizes content, and scores relevance and impact."
          />
          <FeatureCard 
            icon={<BarChart className="h-6 w-6 text-emerald-400" />}
            title="Weekly Digests"
            description="One-click generation of beautifully formatted markdown newsletters ready for publishing."
          />
        </div>

        {/* Deep Dive Features */}
        <div className="mt-40 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Everything You Need</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A complete suite of tools designed specifically for creators, PMs, and researchers building in the AI space.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <DetailedFeatureCard 
              title="Overview Dashboard"
              description="A bird's-eye view of your research empire. Track background queue progress, monitor aggregated analytics, and view the top-scored stories of the week at a glance."
            />
            <DetailedFeatureCard 
              title="Article Database"
              description="A searchable, filterable repository of every article your agent has processed. Filter by category, AI-assigned importance score, or search for specific keywords."
            />
            <DetailedFeatureCard 
              title="Weekly Digest Generator"
              description="Transform hundreds of articles into a single, beautifully formatted Markdown newsletter. Perfect for exporting directly to Notion, Substack, or Beehiiv."
            />
            <DetailedFeatureCard 
              title="Deep Analytics"
              description="Visualize the news cycle. Interactive charts break down category trends over time, helping you spot the next big wave in AI before it peaks."
            />
            <DetailedFeatureCard 
              title="Custom Source Management"
              description="You aren't locked into our presets. Add any RSS feed from your favorite publications, competitor blogs, or niche subreddits to build a bespoke knowledge base."
            />
            <DetailedFeatureCard 
              title="AI Chat Interface"
              description="Talk directly to your ingested knowledge. Ask the agent to summarize recent trends, find specific articles, or brainstorm newsletter intro hooks based on the week's news."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#030305]/50 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-violet-400" />
            <span className="font-bold text-lg tracking-tight text-white">TPF Research</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} TPF Research Agent. Built for AI & Product Enthusiasts.
          </p>
          <div className="flex gap-6 text-sm font-medium">
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl glass-card group">
      <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-white/90">{title}</h3>
      <p className="text-gray-400/90 leading-relaxed">{description}</p>
    </div>
  )
}

function DetailedFeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-violet-500/30 transition-colors">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}
