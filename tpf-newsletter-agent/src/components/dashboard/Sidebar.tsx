"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Database, Newspaper, BarChart3, Settings, Rss, Bot, Menu, LogOut, ArrowLeft } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/database", icon: Database, label: "Database" },
  { href: "/dashboard/digest", icon: Newspaper, label: "Weekly Digest" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/sources", icon: Rss, label: "Sources" },
  { href: "/dashboard/chat", icon: Bot, label: "AI Chat" },
]

export function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-white/[0.08] bg-white/[0.02] backdrop-blur-xl px-4 py-6 hidden lg:flex flex-col z-20 sticky top-0 h-screen">
      <div className="flex flex-col gap-4 mb-8 px-2 shrink-0">
        <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Newspaper className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight">TPF Research</span>
        </div>
      </div>
      
      <nav className="space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} isActive={pathname === item.href} />
        ))}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-white/[0.08] flex flex-col gap-1 shrink-0">
        <NavItem href="/dashboard/settings" icon={Settings} label="Settings" isActive={pathname === '/dashboard/settings'} />
        <Link 
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger 
        render={
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-400 hover:text-white" />
        }
      >
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 border-r border-white/[0.08] bg-[#030305]/95 backdrop-blur-xl p-4 text-white flex flex-col h-full">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col gap-4 mb-8 px-2 mt-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit text-sm font-medium">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Newspaper className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">TPF Research</span>
          </div>
        </div>
        <nav className="space-y-2 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} isActive={pathname === item.href} />
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-white/[0.08] flex flex-col gap-1 shrink-0">
          <NavItem href="/dashboard/settings" icon={Settings} label="Settings" isActive={pathname === '/dashboard/settings'} />
          <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function NavItem({ href, icon: Icon, label, isActive }: { href: string; icon: any; label: string; isActive?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 border ${
        isActive 
          ? "bg-white/[0.1] text-white border-white/[0.1] shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
          : "text-gray-400 border-transparent hover:text-white hover:bg-white/[0.06] hover:border-white/[0.05]"
      }`}
    >
      <Icon size={20} className={isActive ? "text-violet-400" : ""} />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  )
}
