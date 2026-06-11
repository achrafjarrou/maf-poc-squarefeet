"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Search,
  Building2,
  LayoutGrid,
  Target,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  Flame,
  Thermometer,
  Snowflake,
  MapPin,
  Square,
  Loader2,
  Zap,
  BarChart3,
  Users,
  Globe,
  Shield,
  Star,
  Activity,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockBrands,
  mockMall,
  mockSpace,
  type BrandProfile,
  type MallDNA,
  type SpaceDNA,
  type ScorePillar,
  type Signal,
  type CategoryAffinity,
} from "@/lib/mock-data";

// Score color helper
function getScoreColor(score: number): string {
  if (score >= 85) return "#22a06b";
  if (score >= 70) return "#ff8b00";
  return "#de350b";
}

function getScoreColorClass(score: number): string {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-amber-600";
  return "text-red-600";
}

function getScoreBgClass(score: number): string {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-amber-500";
  return "bg-red-500";
}

// Temperature badge component
function TemperatureBadge({ temperature }: { temperature: string }) {
  const config: Record<
    string,
    { icon: React.ReactNode; className: string; label: string }
  > = {
    HOT: {
      icon: <Flame className="h-3 w-3" />,
      className: "bg-red-100 text-red-700 border-red-200",
      label: "HOT",
    },
    WARM: {
      icon: <Thermometer className="h-3 w-3" />,
      className: "bg-amber-100 text-amber-700 border-amber-200",
      label: "WARM",
    },
    WATCH: {
      icon: <Clock className="h-3 w-3" />,
      className: "bg-blue-100 text-blue-700 border-blue-200",
      label: "WATCH",
    },
    COLD: {
      icon: <Snowflake className="h-3 w-3" />,
      className: "bg-slate-100 text-slate-600 border-slate-200",
      label: "COLD",
    },
  };

  const { icon, className, label } = config[temperature] || config.COLD;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border",
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}

// Score ring component with dynamic colors
function ScoreRing({
  score,
  size = "md",
  label,
  showLabel = true,
}: {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  showLabel?: boolean;
}) {
  const sizeConfig = {
    sm: { outer: 44, stroke: 4, text: "text-sm", labelText: "text-[10px]" },
    md: { outer: 56, stroke: 5, text: "text-base", labelText: "text-xs" },
    lg: { outer: 72, stroke: 6, text: "text-lg", labelText: "text-xs" },
    xl: { outer: 88, stroke: 7, text: "text-xl", labelText: "text-sm" },
  };

  const { outer, stroke, text, labelText } = sizeConfig[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  // Use semantic color coding
  const strokeColor = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: outer, height: outer }}>
        <svg className="transform -rotate-90" width={outer} height={outer}>
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="#e5e5e5"
            strokeWidth={stroke}
          />
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold",
            text,
            getScoreColorClass(score)
          )}
        >
          {score}
        </div>
      </div>
      {showLabel && label && (
        <span className={cn("text-muted-foreground font-medium", labelText)}>
          {label}
        </span>
      )}
    </div>
  );
}

// Pillar breakdown component with source links
function PillarBreakdown({
  pillars,
  title,
  maxVisible = 6,
}: {
  pillars: ScorePillar[];
  title: string;
  maxVisible?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const displayPillars = expanded ? pillars : pillars.slice(0, maxVisible);

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="space-y-2.5">
        {displayPillars.map((pillar, idx) => (
          <div key={idx} className="group">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                {pillar.name}
              </span>
              <span className={cn("font-semibold tabular-nums", getScoreColorClass(pillar.score))}>
                {pillar.score}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getScoreBgClass(pillar.score)
                )}
                style={{ width: `${pillar.score}%` }}
              />
            </div>
            {pillar.evidence && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                {pillar.evidence}
              </p>
            )}
            {pillar.source_url && (
              <a
                href={pillar.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                Source <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>
      {pillars.length > maxVisible && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          {expanded ? "Show less" : `Show ${pillars.length - maxVisible} more`}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
      )}
    </div>
  );
}

// Signal list component with source links
function SignalList({ signals }: { signals: Signal[] }) {
  if (signals.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No recent signals detected for this brand.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 mb-4">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700">
            All signals are sourced from verified data providers. Click the link icon to view the original source.
          </p>
        </div>
      </div>
      {signals.map((signal) => (
        <div
          key={signal.id}
          className="p-4 bg-secondary/50 rounded-lg border border-border hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                    signal.strength === "strong" &&
                      "bg-green-100 text-green-700",
                    signal.strength === "moderate" &&
                      "bg-amber-100 text-amber-700",
                    signal.strength === "weak" && "bg-slate-100 text-slate-600"
                  )}
                >
                  {signal.category}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {signal.type}
                </span>
              </div>
              <p className="text-sm text-foreground">{signal.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{signal.source_name}</span>
                <span>·</span>
                <span>{signal.detected_at}</span>
              </div>
            </div>
            <a
              href={signal.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors shrink-0"
              title="View source"
            >
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// Brand card component
function BrandCard({
  brand,
  rank,
  onClick,
  selected,
}: {
  brand: BrandProfile;
  rank: number;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border text-left transition-all duration-200",
        selected
          ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20"
          : "bg-card border-border hover:border-primary/40 hover:shadow-sm"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Rank badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-foreground">{brand.name}</h3>
            <TemperatureBadge temperature={brand.temperature} />
            {/* Only show PRE-MARKET for INTERNATIONAL with MRS > 80 */}
            {brand.pre_market_flag && (
              <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-semibold border border-primary/20">
                PRE-MARKET
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {brand.subcategory} · {brand.origin_country}
          </p>
          {/* Market status badge */}
          <div className="mt-1">
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-semibold",
                brand.market_presence_status === "PRESENT" &&
                  "bg-green-100 text-green-700",
                brand.market_presence_status === "REGIONAL" &&
                  "bg-blue-100 text-blue-700",
                brand.market_presence_status === "INTERNATIONAL" &&
                  "bg-purple-100 text-purple-700",
                brand.market_presence_status === "DOMESTIC_ONLY" &&
                  "bg-slate-100 text-slate-600"
              )}
            >
              {brand.market_presence_status.replace("_", " ")}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className={cn("text-2xl font-bold", getScoreColorClass(brand.final_score || 0))}>
            {brand.final_score}
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">
            FinalScore
          </span>
        </div>
      </div>

      {/* Score grid */}
      <div className="mt-3 pt-3 border-t border-border grid grid-cols-4 gap-2">
        {[
          { label: "CRS", value: brand.crs },
          { label: "MRS", value: brand.mrs },
          { label: "Compat", value: brand.compatibility_score },
          { label: "PSS", value: brand.pss },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className={cn("text-sm font-semibold", getScoreColorClass(item.value || 0))}>
              {item.value}
            </div>
            <div className="text-[10px] text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
    </button>
  );
}

// Brand detail panel component
function BrandDetailPanel({ brand }: { brand: BrandProfile }) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "pillars" | "signals"
  >("overview");

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="p-5 bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{brand.name}</h2>
              <TemperatureBadge temperature={brand.temperature} />
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {brand.category} · {brand.subcategory} · {brand.origin_country}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-semibold border",
                  brand.market_presence_status === "PRESENT" &&
                    "bg-green-100 text-green-700 border-green-200",
                  brand.market_presence_status === "REGIONAL" &&
                    "bg-blue-100 text-blue-700 border-blue-200",
                  brand.market_presence_status === "INTERNATIONAL" &&
                    "bg-purple-100 text-purple-700 border-purple-200",
                  brand.market_presence_status === "DOMESTIC_ONLY" &&
                    "bg-slate-100 text-slate-600 border-slate-200"
                )}
              >
                <Globe className="h-3 w-3 inline mr-1" />
                {brand.market_presence_status.replace("_", " ")}
              </span>
              {/* Only show PRE-MARKET OPPORTUNITY for INTERNATIONAL with MRS > 80 */}
              {brand.pre_market_flag && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  <Zap className="h-3 w-3 inline mr-1" />
                  PRE-MARKET OPPORTUNITY
                </span>
              )}
            </div>
          </div>
          <ScoreRing
            score={brand.final_score || 0}
            size="xl"
            label="FinalScore"
          />
        </div>

        {/* Core scores grid with semantic colors */}
        <div className="flex items-center justify-between gap-2 py-4 border-t border-border">
          <ScoreRing score={brand.crs} size="sm" label="CRS" />
          <ScoreRing score={brand.bis} size="sm" label="BIS" />
          <ScoreRing score={brand.bms} size="sm" label="BMS" />
          <ScoreRing score={brand.mes} size="sm" label="MES" />
          <ScoreRing score={brand.bes} size="sm" label="BES" />
          <ScoreRing score={brand.mrs} size="sm" label="MRS" />
        </div>

        {/* Match scores */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Score Breakdown
          </h4>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className={cn("text-lg font-bold", getScoreColorClass(brand.crs))}>
                {brand.crs}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                CRS
              </div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className={cn("text-lg font-bold", getScoreColorClass(brand.mrs))}>
                {brand.mrs}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                MRS
              </div>
            </div>
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <div className="text-lg font-bold text-foreground">
                {brand.category_gap || 30}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Gap
              </div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className={cn("text-lg font-bold", getScoreColorClass(brand.final_score || 0))}>
                {brand.final_score}
              </div>
              <div className="text-xs text-primary font-medium">Final</div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement note */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Clock className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {brand.engagement_timing}
            </p>
            <p className="text-sm text-amber-700 mt-1">{brand.engagement_note}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-lg">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "pillars", label: "Pillars", icon: LayoutGrid },
          { id: "signals", label: "Signals", icon: Zap },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5 bg-card rounded-xl border border-border max-h-[450px] overflow-y-auto">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Category", value: brand.category, icon: Target },
                { label: "Subcategory", value: brand.subcategory, icon: LayoutGrid },
                { label: "Origin Country", value: brand.origin_country, icon: Globe },
                { label: "Market Status", value: brand.market_presence_status.replace("_", " "), icon: MapPin },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <item.icon className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            
            {/* MRS Calculation Explanation */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                MRS Calculation Logic
              </h4>
              <p className="text-xs text-blue-700">
                MRS = CRS x Multiplier x 1.25 (max 100)
                <br />
                <span className="font-semibold">
                  {brand.market_presence_status === "DOMESTIC_ONLY" && "DOMESTIC: x1.30 (untapped potential)"}
                  {brand.market_presence_status === "INTERNATIONAL" && "INTERNATIONAL: x1.00 (standard)"}
                  {brand.market_presence_status === "REGIONAL" && "REGIONAL: x0.50 (already expanding)"}
                  {brand.market_presence_status === "PRESENT" && "PRESENT: x0.25 (already in market)"}
                </span>
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                Score Summary
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Composite Retail Score (CRS)", value: brand.crs, desc: "Overall brand readiness for retail expansion" },
                  { label: "Brand Intelligence (BIS)", value: brand.bis, desc: "Product architecture, digital presence, brand story" },
                  { label: "Brand Momentum (BMS)", value: brand.bms, desc: "Revenue growth, social momentum, expansion rate" },
                  { label: "Market Expansion (MES)", value: brand.mes, desc: "GCC readiness, trademark, hiring activity" },
                  { label: "Brand Equity (BES)", value: brand.bes, desc: "Brand perception and valuation" },
                  { label: "Market Readiness (MRS)", value: brand.mrs, desc: `UAE-specific readiness (${brand.market_presence_status})` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-2 hover:bg-secondary/50 rounded transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <span className={cn("text-lg font-bold tabular-nums", getScoreColorClass(item.value))}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "pillars" && (
          <div className="space-y-8">
            <PillarBreakdown
              pillars={brand.bis_pillars}
              title="Brand Intelligence Score (BIS) Pillars"
              maxVisible={4}
            />
            <PillarBreakdown
              pillars={brand.bms_pillars}
              title="Brand Momentum Score (BMS) Pillars"
              maxVisible={4}
            />
            <PillarBreakdown
              pillars={brand.mes_pillars}
              title="Market Expansion Score (MES) Pillars"
              maxVisible={4}
            />
            <PillarBreakdown
              pillars={brand.bes_pillars}
              title="Brand Equity Score (BES) Pillars"
              maxVisible={4}
            />
          </div>
        )}

        {activeTab === "signals" && <SignalList signals={brand.signals} />}
      </div>
    </div>
  );
}

// Mall DNA panel component - Enhanced with full metrics
function MallDNAPanel({ mall }: { mall: MallDNA }) {
  return (
    <div className="space-y-4">
      <div className="p-5 bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">{mall.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {mall.location}
            </p>
          </div>
          <ScoreRing score={mall.cas} size="lg" label="CAS" />
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-3 py-4 border-t border-border">
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {mall.total_gla.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">GLA (sqm)</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {mall.levels}
            </div>
            <div className="text-xs text-muted-foreground">Levels</div>
          </div>
          <div className="text-center p-3 bg-secondary/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {mall.unit_count}+
            </div>
            <div className="text-xs text-muted-foreground">Units</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-lg font-bold text-green-700">
              {mall.occupancy_rate}%
            </div>
            <div className="text-xs text-green-600">Occupancy</div>
          </div>
        </div>

        {/* Positioning */}
        <div className="pt-4 border-t border-border">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            {mall.positioning} Positioning
          </span>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Category Distribution
        </h3>
        <div className="space-y-3">
          {mall.category_distribution.map((cat) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{cat.name}</span>
                <span className="font-semibold">{cat.percentage}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Brands Present */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          Top Brands Present
        </h3>
        <div className="flex flex-wrap gap-2">
          {mall.top_brands.map((brand) => (
            <span
              key={brand}
              className="px-3 py-1.5 bg-secondary text-foreground rounded-full text-xs font-medium"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Category gaps */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Category Gaps (Opportunities)
        </h3>
        <div className="flex flex-wrap gap-2">
          {mall.category_gaps.map((gap) => (
            <span
              key={gap}
              className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200"
            >
              {gap}
            </span>
          ))}
        </div>
      </div>

      {/* Oversaturation */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          Saturated Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {mall.category_oversaturation.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <div className="p-5 bg-card rounded-xl border border-border max-h-[350px] overflow-y-auto">
        <PillarBreakdown
          pillars={mall.pillars}
          title="18 Mall DNA Pillars (CAS Breakdown)"
          maxVisible={8}
        />
      </div>
    </div>
  );
}

// Space DNA panel component - Enhanced with full metrics
function SpaceDNAPanel({ space }: { space: SpaceDNA }) {
  return (
    <div className="space-y-4">
      <div className="p-5 bg-card rounded-xl border border-border shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Square className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {space.unit_id}
              </h2>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-semibold",
                  space.priority === "High" && "bg-red-100 text-red-700",
                  space.priority === "Medium" && "bg-amber-100 text-amber-700",
                  space.priority === "Low" && "bg-green-100 text-green-700"
                )}
              >
                {space.priority} Priority
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {space.floor} · {space.zone} · {space.case_type}
            </p>
          </div>
          <ScoreRing score={space.css} size="lg" label="CSS" />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 py-4 border-t border-border">
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {space.size_sqm} sqm
            </div>
            <div className="text-xs text-muted-foreground">Size</div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              {space.format}
            </div>
            <div className="text-xs text-muted-foreground">Format</div>
          </div>
          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="text-lg font-bold text-foreground">
              AED {space.asking_price.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Asking Price/sqm</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="text-lg font-bold text-amber-700">
              {space.vacancy_duration}mo
            </div>
            <div className="text-xs text-amber-600">Vacant</div>
          </div>
        </div>

        {/* Proximity */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Proximity
          </h4>
          <div className="flex flex-wrap gap-2">
            {space.proximity.map((p) => (
              <span
                key={p}
                className="px-2 py-1 bg-secondary text-foreground rounded text-xs font-medium"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Previous Tenant */}
        {space.previous_tenant && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Previous Occupant
            </h4>
            <p className="text-sm text-foreground">{space.previous_tenant}</p>
          </div>
        )}

        {/* Performance metrics */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Performance Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">
                  Footfall Index
                </span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {space.footfall_index}
              </div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-700 font-medium">
                  Conversion Prob.
                </span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {(space.conversion_probability * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Affinity with scores */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Category Affinity
        </h3>
        <div className="space-y-3">
          {space.category_affinity.map((cat: CategoryAffinity) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{cat.name}</span>
                <span className={cn("font-semibold", getScoreColorClass(cat.score))}>
                  {(cat.score / 100).toFixed(2)}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", getScoreBgClass(cat.score))}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjacency rules */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="h-4 w-4 text-red-600" />
          Hard Adjacency Rules
        </h3>
        <div className="flex flex-wrap gap-2">
          {space.hard_adjacency_rules.map((rule) => (
            <span
              key={rule}
              className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-200"
            >
              {rule}
            </span>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <div className="p-5 bg-card rounded-xl border border-border max-h-[350px] overflow-y-auto">
        <PillarBreakdown
          pillars={space.pillars}
          title="16 Space DNA Pillars (CSS Breakdown)"
          maxVisible={8}
        />
      </div>
    </div>
  );
}

// Main dashboard component
export default function MAFPOCDashboard() {
  const [selectedBrand, setSelectedBrand] = useState<BrandProfile>(
    mockBrands[0]
  );
  const [activePanel, setActivePanel] = useState<"brand" | "mall" | "space">(
    "brand"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditedBrand, setAuditedBrand] = useState<BrandProfile | null>(null);
  const [auditTime, setAuditTime] = useState(0);
  const auditTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sort brands by final score
  const sortedBrands = [...mockBrands].sort(
    (a, b) => (b.final_score || 0) - (a.final_score || 0)
  );

  // Handle live audit with timer
  const handleLiveAudit = async () => {
    if (!searchQuery.trim()) return;

    setIsAuditing(true);
    setAuditedBrand(null);
    setAuditTime(0);

    // Start timer
    auditTimerRef.current = setInterval(() => {
      setAuditTime((prev) => prev + 1);
    }, 1000);

    // Simulate audit process (3-5 seconds)
    const auditDuration = 3000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, auditDuration));

    // Stop timer
    if (auditTimerRef.current) {
      clearInterval(auditTimerRef.current);
    }

    // Calculate scores
    const crs = Math.floor(Math.random() * 30) + 60;
    const mrs = Math.min(100, Math.round(crs * 1.00 * 1.25)); // INTERNATIONAL by default
    const categoryGap = 30;
    const css = 81;
    const finalScore = Math.round((crs * 0.40) + (mrs * 0.30) + (categoryGap * 0.20) + (css * 0.10));

    // Create a mock audited brand
    const newBrand: BrandProfile = {
      id: `audited-${Date.now()}`,
      name: searchQuery,
      category: "Fashion & Lifestyle",
      subcategory: "Retail",
      origin_country: "Global",
      crs,
      bis: Math.floor(Math.random() * 30) + 60,
      bms: Math.floor(Math.random() * 30) + 60,
      mes: Math.floor(Math.random() * 30) + 55,
      bes: Math.floor(Math.random() * 30) + 60,
      mrs,
      temperature: finalScore >= 80 ? "HOT" : finalScore >= 60 ? "WARM" : "COLD",
      market_presence_status: "INTERNATIONAL",
      pre_market_flag: mrs > 80,
      compatibility_score: Math.floor(Math.random() * 25) + 70,
      pss: Math.floor(Math.random() * 25) + 65,
      final_score: finalScore,
      category_gap: categoryGap,
      engagement_note: `Live audit completed for ${searchQuery}. Analysis based on real-time signal detection across multiple data sources.`,
      engagement_timing: "Review analysis and determine next steps",
      bis_pillars: [
        { name: "Product Architecture", score: Math.floor(Math.random() * 20) + 70, weight: 0.15, evidence: "Product range analysis completed" },
        { name: "Digital Presence", score: Math.floor(Math.random() * 20) + 70, weight: 0.15, evidence: "Social media presence analyzed" },
        { name: "Brand Story", score: Math.floor(Math.random() * 20) + 65, weight: 0.12, evidence: "Brand positioning evaluated" },
      ],
      bms_pillars: [
        { name: "Revenue Growth", score: Math.floor(Math.random() * 20) + 70, weight: 0.20, evidence: "Financial signals detected" },
        { name: "Social Momentum", score: Math.floor(Math.random() * 20) + 70, weight: 0.18, evidence: "Social growth tracked" },
      ],
      mes_pillars: [
        { name: "GCC Hiring Activity", score: Math.floor(Math.random() * 20) + 60, weight: 0.25, evidence: "Job postings scanned" },
        { name: "Trademark Filing", score: Math.floor(Math.random() * 20) + 55, weight: 0.20, evidence: "Registry search completed" },
      ],
      bes_pillars: [
        { name: "Brand Equity Perception", score: Math.floor(Math.random() * 20) + 70, weight: 0.50, evidence: "Sentiment analysis completed" },
        { name: "Brand Equity Value", score: Math.floor(Math.random() * 20) + 65, weight: 0.50, evidence: "Valuation estimated" },
      ],
      signals: [
        {
          id: `sig-live-${Date.now()}`,
          category: "Search",
          type: "Google Trends",
          description: `Search interest analysis for ${searchQuery} in UAE region`,
          source_url: `https://trends.google.com/trends/explore?geo=AE&q=${encodeURIComponent(searchQuery)}`,
          source_name: "Google Trends",
          detected_at: new Date().toISOString().split("T")[0],
          strength: "moderate",
        },
      ],
    };

    setAuditedBrand(newBrand);
    setSelectedBrand(newBrand);
    setActivePanel("brand");
    setIsAuditing(false);
  };

  // Format audit time
  const formatAuditTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (auditTimerRef.current) {
        clearInterval(auditTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo-maf.png"
                alt="MAF - Majid Al Futtaim"
                width={160}
                height={48}
                className="h-10 w-auto"
                priority
              />
              <div className="hidden sm:block h-8 w-px bg-border" />
              <div className="hidden sm:block">
                <h1 className="text-base font-bold text-foreground">
                  MAF Prospect Intelligence
                </h1>
                <p className="text-xs text-muted-foreground">
                  Top 10 Brands Analysis
                </p>
              </div>
            </div>

            {/* Live Audit Search */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Live brand audit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLiveAudit()}
                  className="pl-9 pr-4 py-2 w-64 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <button
                onClick={handleLiveAudit}
                disabled={isAuditing || !searchQuery.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {isAuditing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Auditing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Audit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        {/* Asset context bar */}
        <div className="mb-6 p-4 bg-card rounded-xl border border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {mockMall.name}
                </p>
                <p className="text-xs text-muted-foreground">{mockMall.location}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <Square className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {mockSpace.unit_id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {mockSpace.floor} · {mockSpace.zone} · {mockSpace.size_sqm} sqm
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
              {mockSpace.case_type}
            </span>
            <span
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                mockSpace.priority === "High" && "bg-red-100 text-red-700",
                mockSpace.priority === "Medium" && "bg-amber-100 text-amber-700",
                mockSpace.priority === "Low" && "bg-green-100 text-green-700"
              )}
            >
              {mockSpace.priority} Priority
            </span>
          </div>
        </div>

        {/* Audit loading state with timer */}
        {isAuditing && (
          <div className="mb-6 p-6 bg-primary/5 rounded-xl border border-primary/20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Auditing &ldquo;{searchQuery}&rdquo;...
                </p>
                <p className="text-xs text-muted-foreground">
                  Running signal detection across multiple data sources.
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">{formatAuditTime(auditTime)}</p>
                {auditTime > 300 && (
                  <p className="text-xs text-amber-600 font-medium">
                    Taking longer than expected
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Left column - Brand list */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  Top 10 Prospects
                </h2>
                <span className="text-xs text-muted-foreground">
                  Ranked by FinalScore
                </span>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {auditedBrand && (
                  <div className="relative">
                    <div className="absolute -left-2 top-4 px-2 py-0.5 bg-primary text-primary-foreground rounded-r text-[10px] font-semibold">
                      LIVE AUDIT
                    </div>
                    <BrandCard
                      brand={auditedBrand}
                      rank={0}
                      onClick={() => {
                        setSelectedBrand(auditedBrand);
                        setActivePanel("brand");
                      }}
                      selected={selectedBrand.id === auditedBrand.id}
                    />
                  </div>
                )}

                {sortedBrands.slice(0, 10).map((brand, index) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    rank={index + 1}
                    onClick={() => {
                      setSelectedBrand(brand);
                      setActivePanel("brand");
                    }}
                    selected={selectedBrand.id === brand.id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Detail panels */}
          <div className="col-span-12 lg:col-span-8">
            {/* Panel tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: "brand", label: "Brand Profile", icon: Star },
                { id: "mall", label: "Mall DNA", icon: Building2 },
                { id: "space", label: "Space DNA", icon: Square },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id as typeof activePanel)}
                  className={cn(
                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    activePanel === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-card text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Panel content */}
            {activePanel === "brand" && (
              <BrandDetailPanel brand={selectedBrand} />
            )}
            {activePanel === "mall" && <MallDNAPanel mall={mockMall} />}
            {activePanel === "space" && <SpaceDNAPanel space={mockSpace} />}
          </div>
        </div>
      </main>

      {/* Footer - Updated per specs */}
      <footer className="mt-12 py-8 border-t border-border bg-card">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-maf.png"
                alt="MAF - Majid Al Futtaim"
                width={120}
                height={36}
                className="h-7 w-auto"
              />
              <p className="text-sm text-muted-foreground">
                © 2026 MAF Prospect Intelligence. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Powered by</span>
              <span className="font-semibold text-foreground">Squarefeet Intelligence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
