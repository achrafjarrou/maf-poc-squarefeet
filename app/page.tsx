"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BarChart3, Target } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-maf.png"
              alt="MAF"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
            <span className="text-white font-bold text-lg hidden sm:inline">MAF Prospect Intelligence</span>
          </div>
          <Button
            onClick={() => router.push("/maf")}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
          >
            Launch App <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Intelligent Brand Matching
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Discover, analyze, and match premium brands with prime retail spaces. 
                Powered by advanced intelligence scoring and market insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => router.push("/maf")}
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                >
                  Explore Top 10 Prospects
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent rounded-lg blur-2xl" />
              <div className="relative bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <Image
                  src="/logo-maf.png"
                  alt="MAF Logo"
                  width={280}
                  height={80}
                  className="w-full h-auto opacity-80 mb-8"
                />
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white">Real-Time Analysis</h3>
                      <p className="text-sm text-slate-400">Advanced scoring engine for brand intelligence</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white">Detailed Insights</h3>
                      <p className="text-sm text-slate-400">Comprehensive pillars and market signals</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-white">Precision Matching</h3>
                      <p className="text-sm text-slate-400">Data-driven brand-space compatibility scores</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              { label: "Top Prospects", value: "10" },
              { label: "Market Status", value: "5" },
              { label: "Avg Final Score", value: "81.4" },
              { label: "Temperature", value: "HOT/WARM" }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center">
                <p className="text-amber-500 text-3xl font-bold mb-2">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Brand Profiles",
                description: "Comprehensive intelligence on 10 premium prospects with detailed scoring"
              },
              {
                title: "Market Signals",
                description: "Real-time market indicators and expansion signals for informed decisions"
              },
              {
                title: "Compatibility",
                description: "Advanced matching algorithm for optimal brand-space partnerships"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-amber-500/50 transition-colors">
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-maf.png"
              alt="MAF"
              width={100}
              height={30}
              className="h-6 w-auto opacity-70"
            />
            <span className="text-slate-500 text-sm">© 2026 MAF Prospect Intelligence</span>
          </div>
          <Button
            onClick={() => router.push("/maf")}
            variant="ghost"
            size="sm"
            className="text-amber-500 hover:text-amber-400"
          >
            Enter Application →
          </Button>
        </div>
      </footer>
    </div>
  );
}
