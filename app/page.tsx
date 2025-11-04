"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Film, Sparkles, Camera, ImageIcon } from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"

export default function LandingPage() {
  const router = useRouter()
  const { isAuthenticated, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, checkAuth, router])

  const features = [
    {
      icon: Film,
      title: "Script Analysis",
      description: "AI-powered analysis of your screenplay with feedback from multiple specialized agents",
    },
    {
      icon: Camera,
      title: "Expression Coaching",
      description: "Real-time facial expression coaching with AR overlays and performance metrics",
    },
    {
      icon: ImageIcon,
      title: "Poster Generation",
      description: "Create stunning movie posters with AI-powered design and customization",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-amber-500/10 via-transparent to-transparent blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-amber-500/10 via-transparent to-transparent blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative">
          {/* Navigation */}
          <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-8 h-8 text-amber-500" />
              <span className="text-2xl font-bold text-white">Lumin</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Button variant="ghost" onClick={() => router.push("/login")} className="text-zinc-300 hover:text-white">
                Login
              </Button>
              <Button onClick={() => router.push("/signup")} className="bg-amber-500 hover:bg-amber-600 text-zinc-950">
                Get Started
              </Button>
            </motion.div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 text-balance">
                Your AI-Powered
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                  Filmmaking Assistant
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto text-balance"
            >
              Analyze scripts, coach expressions, and generate stunning posters with cutting-edge AI technology
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4"
            >
              <Button
                size="lg"
                onClick={() => router.push("/signup")}
                className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-lg px-8"
              >
                Start Creating
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/login")}
                className="border-zinc-700 text-white hover:bg-zinc-800 text-lg px-8"
              >
                Sign In
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-white text-center mb-16"
        >
          Everything You Need to Create
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 hover:border-amber-500/50 transition-colors"
            >
              <feature.icon className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/20 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Filmmaking?</h2>
          <p className="text-xl text-zinc-400 mb-8">
            Join thousands of creators using Lumin to bring their vision to life
          </p>
          <Button
            size="lg"
            onClick={() => router.push("/signup")}
            className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-lg px-12"
          >
            Get Started Free
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500">
          <p>&copy; 2025 Lumin AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
