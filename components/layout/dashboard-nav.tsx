"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sparkles, Film, Camera, ImageIcon, LogOut, Menu, X } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "sonner"

interface DashboardNavProps {
  activeModule: "script" | "coaching" | "poster"
  onModuleChange: (module: "script" | "coaching" | "poster") => void
}

export function DashboardNav({ activeModule, onModuleChange }: DashboardNavProps) {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/")
  }

  const modules = [
    { id: "script" as const, label: "Script Analysis", icon: Film },
    { id: "coaching" as const, label: "Expression Coaching", icon: Camera },
    { id: "poster" as const, label: "Poster Generation", icon: ImageIcon },
  ]

  return (
    <nav className="bg-zinc-900/50 border-b border-zinc-800 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold text-white">Lumin</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <Button
                  key={module.id}
                  variant="ghost"
                  onClick={() => onModuleChange(module.id)}
                  className={`relative ${activeModule === module.id ? "text-white" : "text-zinc-400 hover:text-white"}`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {module.label}
                  {activeModule === module.id && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
                  )}
                </Button>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-zinc-400 text-sm">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-zinc-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            {modules.map((module) => {
              const Icon = module.icon
              return (
                <Button
                  key={module.id}
                  variant="ghost"
                  onClick={() => {
                    onModuleChange(module.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full justify-start ${
                    activeModule === module.id ? "bg-amber-500/20 text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {module.label}
                </Button>
              )
            })}
            <div className="pt-4 border-t border-zinc-800">
              <div className="px-4 py-2 text-zinc-400 text-sm">{user?.name}</div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-zinc-400 hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
