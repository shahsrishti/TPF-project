import { DesktopSidebar, MobileNav } from "@/components/dashboard/Sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen text-white selection:bg-violet-500/30">
      <DesktopSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 w-full overflow-hidden">
        <header className="h-16 border-b border-white/[0.08] flex items-center gap-4 px-4 md:px-8 bg-white/[0.02] backdrop-blur-md sticky top-0 z-10 shrink-0">
          <MobileNav />
          <h1 className="text-sm font-medium text-gray-400">AI & Product Research Agent</h1>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
