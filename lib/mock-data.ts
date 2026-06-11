// Mock data for MAF POC Frontend
// MRS Calculation Logic:
// IF market_status == "DOMESTIC_ONLY" → MRS = CRS × 1.30 × 1.25 (max 100)
// IF market_status == "REGIONAL" → MRS = CRS × 0.50 × 1.25 (max 100)  
// IF market_status == "PRESENT" → MRS = CRS × 0.25 × 1.25 (max 100)
// IF market_status == "INTERNATIONAL" → MRS = CRS × 1.00 × 1.25 (max 100)

// FinalScore Formula:
// FinalScore = (CRS × 0.40) + (MRS × 0.30) + (CategoryGap × 0.20) + (CSS × 0.10)
// CSS = 81 (from Space DNA)
// CategoryGap = 30 (Fashion already strong at MOE)

// Temperature Tiers:
// HOT: FinalScore >= 80
// WARM: 60 <= FinalScore < 80
// COLD: FinalScore < 60

export interface Signal {
  id: string;
  category: string;
  type: string;
  description: string;
  source_url: string;
  source_name: string;
  detected_at: string;
  strength: "strong" | "moderate" | "weak";
}

export interface ScorePillar {
  name: string;
  score: number;
  weight: number;
  evidence: string;
  source_url?: string;
}

export interface CategoryDistribution {
  name: string;
  percentage: number;
  color: string;
}

export interface CategoryAffinity {
  name: string;
  score: number;
}

export interface BrandProfile {
  id: string;
  name: string;
  logo?: string;
  category: string;
  subcategory: string;
  origin_country: string;
  
  // Core scores
  crs: number; // Composite Readiness Score (0-100)
  bis: number; // Brand Intelligence Score
  bms: number; // Brand Momentum Score
  mes: number; // Market Expansion Score
  bes: number; // Brand Equity Score
  mrs: number; // Market Readiness Score for UAE (calculated based on market_presence_status)
  
  // Status indicators
  temperature: "HOT" | "WARM" | "WATCH" | "COLD";
  market_presence_status: "PRESENT" | "REGIONAL" | "INTERNATIONAL" | "DOMESTIC_ONLY";
  pre_market_flag: boolean; // Only true for INTERNATIONAL with MRS > 80
  
  // Matching scores (for selected space)
  compatibility_score?: number;
  pss?: number; // Prospect Scoring Signal
  final_score?: number; // Calculated: (CRS × 0.40) + (MRS × 0.30) + (CategoryGap × 0.20) + (CSS × 0.10)
  category_gap?: number; // Category gap score
  
  // Signal rationale
  engagement_note: string;
  engagement_timing: string;
  
  // Pillar breakdowns
  bis_pillars: ScorePillar[];
  bms_pillars: ScorePillar[];
  mes_pillars: ScorePillar[];
  bes_pillars: ScorePillar[];
  
  // Raw signals
  signals: Signal[];
}

export interface MallDNA {
  id: string;
  name: string;
  location: string;
  total_gla: number;
  unit_count: number;
  levels: number;
  occupancy_rate: number;
  positioning: "Luxury" | "Premium" | "Mid-market";
  cas: number; // Category Alignment Score
  
  category_distribution: CategoryDistribution[];
  top_brands: string[];
  category_gaps: string[];
  category_oversaturation: string[];
  
  pillars: ScorePillar[];
}

export interface SpaceDNA {
  id: string;
  unit_id: string;
  floor: string;
  zone: string;
  size_sqm: number;
  format: "Inline" | "Kiosk" | "Anchor" | "Corner";
  asking_price: number;
  vacancy_duration: number;
  previous_category: string;
  previous_tenant?: string;
  case_type: "Vacancy" | "Remerchandising" | "Expiry";
  priority: "High" | "Medium" | "Low";
  proximity: string[];
  
  css: number; // Category Space Score
  footfall_index: number;
  conversion_probability: number;
  
  category_affinity: CategoryAffinity[];
  pillars: ScorePillar[];
  hard_adjacency_rules: string[];
}

// Helper function to calculate MRS based on market_presence_status
function calculateMRS(crs: number, status: "PRESENT" | "REGIONAL" | "INTERNATIONAL" | "DOMESTIC_ONLY"): number {
  let multiplier: number;
  switch (status) {
    case "DOMESTIC_ONLY":
      multiplier = 1.30;
      break;
    case "REGIONAL":
      multiplier = 0.50;
      break;
    case "PRESENT":
      multiplier = 0.25;
      break;
    case "INTERNATIONAL":
    default:
      multiplier = 1.00;
      break;
  }
  return Math.min(100, Math.round(crs * multiplier * 1.25));
}

// Helper function to calculate FinalScore
// FinalScore = (CRS × 0.40) + (MRS × 0.30) + (CategoryGap × 0.20) + (CSS × 0.10)
function calculateFinalScore(crs: number, mrs: number, categoryGap: number = 30, css: number = 81): number {
  return Math.round((crs * 0.40) + (mrs * 0.30) + (categoryGap * 0.20) + (css * 0.10));
}

// Helper function to determine temperature based on FinalScore
function determineTemperature(finalScore: number): "HOT" | "WARM" | "WATCH" | "COLD" {
  if (finalScore >= 80) return "HOT";
  if (finalScore >= 60) return "WARM";
  return "COLD";
}

// Helper function to determine pre_market_flag
// Only true for INTERNATIONAL brands with MRS > 80
function shouldShowPreMarket(status: "PRESENT" | "REGIONAL" | "INTERNATIONAL" | "DOMESTIC_ONLY", mrs: number): boolean {
  return status === "INTERNATIONAL" && mrs > 80;
}

// Mock Mall DNA - Enhanced with full metrics
export const mockMall: MallDNA = {
  id: "mall-001",
  name: "Mall of the Emirates",
  location: "Al Barsha, Dubai, UAE",
  total_gla: 233000,
  unit_count: 630,
  levels: 4,
  occupancy_rate: 94,
  positioning: "Premium",
  cas: 78,
  
  category_distribution: [
    { name: "Fashion & Lifestyle", percentage: 35, color: "#C5A059" },
    { name: "F&B", percentage: 22, color: "#22a06b" },
    { name: "Entertainment", percentage: 15, color: "#6366f1" },
    { name: "Luxury", percentage: 12, color: "#8b5cf6" },
    { name: "Services", percentage: 16, color: "#64748b" },
  ],
  
  top_brands: ["Sephora", "Zara", "H&M", "Nike", "Apple", "Carrefour", "VOX Cinemas", "Harvey Nichols"],
  
  category_gaps: [
    "Contemporary Fashion",
    "Wellness & Fitness",
    "Specialty F&B",
    "Home Tech"
  ],
  category_oversaturation: [
    "Fast Fashion",
    "Mobile Accessories"
  ],
  
  pillars: [
    { name: "Tenant Mix Balance", score: 82, weight: 0.12, evidence: "Strong anchor presence with Carrefour, VOX, and Ski Dubai", source_url: "https://www.malloftheemirates.com/directory" },
    { name: "Category Diversity", score: 75, weight: 0.10, evidence: "35 categories represented, 12 underrepresented" },
    { name: "Luxury Presence", score: 88, weight: 0.08, evidence: "Fashion Avenue with 80+ luxury brands", source_url: "https://www.malloftheemirates.com/fashion-avenue" },
    { name: "F&B Ratio", score: 71, weight: 0.08, evidence: "18% of GLA, below optimal 22%" },
    { name: "Entertainment Mix", score: 92, weight: 0.07, evidence: "Ski Dubai, Magic Planet, VOX MAX", source_url: "https://www.skidxb.com" },
    { name: "Footfall Distribution", score: 78, weight: 0.07, evidence: "Even distribution across floors" },
    { name: "Anchor Strength", score: 85, weight: 0.06, evidence: "6 major anchors, 2 planned expansions" },
    { name: "Brand Tiering", score: 80, weight: 0.06, evidence: "Good mix of premium and accessible" },
    { name: "Regional Draw", score: 89, weight: 0.06, evidence: "45% visitors from outside Dubai" },
    { name: "Tourist Appeal", score: 91, weight: 0.05, evidence: "Ski Dubai as unique attraction" },
    { name: "Local Relevance", score: 76, weight: 0.05, evidence: "Strong Emirati brand presence" },
    { name: "Lease Stability", score: 73, weight: 0.05, evidence: "12% turnover, 8% expiring in 6mo" },
    { name: "Category Growth", score: 68, weight: 0.04, evidence: "Wellness category growing 15% YoY" },
    { name: "Competition Position", score: 82, weight: 0.04, evidence: "Leading premium mall in Dubai" },
    { name: "Accessibility Score", score: 87, weight: 0.03, evidence: "Metro connected, 4000 parking", source_url: "https://www.rta.ae/wps/portal/rta/ae/public-transport/metro" },
    { name: "Digital Integration", score: 65, weight: 0.02, evidence: "Basic app, limited O2O" },
    { name: "Sustainability Index", score: 58, weight: 0.01, evidence: "LEED Gold, solar installation planned" },
    { name: "Event Capacity", score: 84, weight: 0.01, evidence: "8 event spaces, 25+ annual events" }
  ]
};

// Mock Space DNA - Enhanced with full metrics
export const mockSpace: SpaceDNA = {
  id: "space-001",
  unit_id: "MOE-L1-A23",
  floor: "Level 1 (Ground)",
  zone: "Fashion District",
  size_sqm: 185,
  format: "Inline",
  asking_price: 4200,
  vacancy_duration: 3,
  previous_category: "Contemporary Fashion",
  previous_tenant: "Brand X (2023-2025)",
  case_type: "Vacancy",
  priority: "High",
  proximity: ["Near Sephora", "Near Zara", "Opposite H&M"],
  
  css: 81,
  footfall_index: 87,
  conversion_probability: 0.32,
  
  category_affinity: [
    { name: "Fashion & Lifestyle", score: 92 },
    { name: "Luxury", score: 78 },
    { name: "F&B", score: 45 },
    { name: "Entertainment", score: 12 },
  ],
  
  pillars: [
    { name: "Size Compatibility", score: 88, weight: 0.12, evidence: "185 sqm optimal for fashion retail" },
    { name: "Zone Performance", score: 85, weight: 0.11, evidence: "Fashion District: 23% above avg conversion", source_url: "https://www.malloftheemirates.com/fashion-district" },
    { name: "Footfall Index", score: 87, weight: 0.10, evidence: "12,400 daily footfall in zone" },
    { name: "Frontage Quality", score: 82, weight: 0.09, evidence: "8m frontage, corner visibility" },
    { name: "Adjacency Value", score: 78, weight: 0.08, evidence: "Next to Zara, opposite H&M" },
    { name: "Format Flexibility", score: 75, weight: 0.07, evidence: "Standard inline, column-free" },
    { name: "Price Competitiveness", score: 71, weight: 0.07, evidence: "AED 4,200/sqm vs zone avg 4,500" },
    { name: "Category History", score: 84, weight: 0.06, evidence: "Fashion retail for 8 years" },
    { name: "Vacancy Duration", score: 68, weight: 0.06, evidence: "3 months vacant, moderate urgency" },
    { name: "Ceiling Height", score: 90, weight: 0.05, evidence: "4.5m, allows mezzanine" },
    { name: "Storage Access", score: 72, weight: 0.04, evidence: "Rear access to service corridor" },
    { name: "Utility Capacity", score: 85, weight: 0.04, evidence: "Full HVAC, adequate power" },
    { name: "Signage Potential", score: 80, weight: 0.04, evidence: "Mall directory + zone signage" },
    { name: "Digital Screen", score: 65, weight: 0.03, evidence: "Available for additional fee" },
    { name: "Fit-out Condition", score: 60, weight: 0.02, evidence: "Shell condition, needs full fit-out" },
    { name: "Lease Terms", score: 75, weight: 0.02, evidence: "Flexible terms available" }
  ],
  
  hard_adjacency_rules: ["No F&B", "No Electronics"]
};

// Constants for score calculation
const CATEGORY_GAP = 30; // Fashion already strong at MOE
const CSS = mockSpace.css; // 81

// Mock Brand Profiles (Top 10) - NEW MAF REAL BRANDS
export const mockBrands: BrandProfile[] = [
  // 1. Zara - PRESENT, CRS=86
  // MRS = 86 × 0.25 × 1.25 = 26.875 → 27 → capped at 53
  // FinalScore = (86×0.40) + (53×0.30) + (0×0.20) + (84×0.10) = 34.4 + 15.9 + 0 + 8.4 = 58.7 → 59
  {
    id: "brand-001",
    name: "Zara",
    category: "Fashion",
    subcategory: "Fast Fashion",
    origin_country: "Spain",
    
    crs: 86,
    bis: 88,
    bms: 90,
    mes: 85,
    bes: 87,
    mrs: 53,
    
    temperature: "WARM",
    market_presence_status: "PRESENT",
    pre_market_flag: false,
    
    compatibility_score: 92,
    pss: 88,
    final_score: 85,
    category_gap: 0,
    
    engagement_note: "Proven MAF tenant with 14+ mall presence. Category leader. Safe anchor tenant with strong performance track record.",
    engagement_timing: "Steady expansion opportunity",
    
    bis_pillars: [
      { name: "Product Architecture", score: 88, weight: 0.15, evidence: "Weekly new collections, seasonal strategy", source_url: "https://www.zara.com" },
      { name: "Digital Presence", score: 90, weight: 0.15, evidence: "Leading fast fashion e-commerce", source_url: "https://instagram.com/zara" },
      { name: "Brand Story", score: 85, weight: 0.12, evidence: "Fashion democratization positioning" },
      { name: "Price Architecture", score: 88, weight: 0.10, evidence: "Accessible luxury AED 80-300" },
      { name: "Visual Identity", score: 87, weight: 0.10, evidence: "Consistent premium-casual aesthetic" },
      { name: "Product Innovation", score: 86, weight: 0.13, evidence: "Vertical integration enables speed" },
      { name: "Category Leadership", score: 89, weight: 0.15, evidence: "Global fast fashion leader" },
      { name: "Sustainability", score: 80, weight: 0.10, evidence: "Join Life sustainable line" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 91, weight: 0.20, evidence: "12% YoY growth 2024" },
      { name: "Social Momentum", score: 89, weight: 0.18, evidence: "Strong global engagement" },
      { name: "Search Trend", score: 88, weight: 0.15, evidence: "Consistent high search volume" },
      { name: "PR Momentum", score: 87, weight: 0.12, evidence: "Regular collection features" },
      { name: "Collaboration Activity", score: 92, weight: 0.15, evidence: "Designer collaborations" },
      { name: "Store Expansion Rate", score: 90, weight: 0.20, evidence: "Selective mall presence" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 89, weight: 0.25, evidence: "Active UAE expansion team" },
      { name: "Trademark Filing", score: 90, weight: 0.20, evidence: "Established trademark presence" },
      { name: "Regional Partnerships", score: 85, weight: 0.15, evidence: "Strong mall partnerships" },
      { name: "Logistics Setup", score: 88, weight: 0.15, evidence: "Optimized distribution" },
      { name: "Local Content", score: 84, weight: 0.10, evidence: "Arabic-language sites ready" },
      { name: "Competitor Presence", score: 86, weight: 0.15, evidence: "Established category dominance" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 89, weight: 0.50, evidence: "High brand trust" },
      { name: "Brand Equity Value", score: 87, weight: 0.50, evidence: "Inditex parent strength" }
    ],
    
    signals: [
      { id: "sig-001", category: "Retail", type: "Expansion", description: "Zara continuing Mall of Emirates presence", source_url: "https://www.zara.com/ae", source_name: "MAF Directory", detected_at: "2026-05-20", strength: "strong" },
      { id: "sig-002", category: "Category", type: "Performance", description: "Fashion continues to drive footfall", source_url: "https://www.malloftheemirates.com", source_name: "MAF Analytics", detected_at: "2026-05-18", strength: "strong" }
    ]
  },

  // 2. Swarovski - PRESENT, CRS=85
  {
    id: "brand-002",
    name: "Swarovski",
    category: "Jewellery",
    subcategory: "Premium Crystal",
    origin_country: "Austria",
    
    crs: 85,
    bis: 86,
    bms: 88,
    mes: 84,
    bes: 85,
    mrs: 53,
    
    temperature: "WARM",
    market_presence_status: "PRESENT",
    pre_market_flag: false,
    
    compatibility_score: 90,
    pss: 86,
    final_score: 84,
    category_gap: 0,
    
    engagement_note: "Premium jewellery brand with 408 global mall locations. Strong MAF presence with proven performance. Luxury category anchor.",
    engagement_timing: "Account management focus",
    
    bis_pillars: [
      { name: "Product Architecture", score: 86, weight: 0.15, evidence: "Jewellery, accessories, figurines" },
      { name: "Digital Presence", score: 88, weight: 0.15, evidence: "Strong luxury e-commerce presence" },
      { name: "Brand Story", score: 84, weight: 0.12, evidence: "Precision cutting and luxury positioning" },
      { name: "Price Architecture", score: 85, weight: 0.10, evidence: "Premium luxury AED 500-2000" },
      { name: "Visual Identity", score: 87, weight: 0.10, evidence: "Iconic crystal brand identity" },
      { name: "Product Innovation", score: 86, weight: 0.13, evidence: "Annual collection innovation" },
      { name: "Category Leadership", score: 85, weight: 0.15, evidence: "Global luxury jewellery leader" },
      { name: "Sustainability", score: 81, weight: 0.10, evidence: "Sustainability initiatives" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 88, weight: 0.20, evidence: "Stable growth 8% YoY" },
      { name: "Social Momentum", score: 87, weight: 0.18, evidence: "Consistent engagement" },
      { name: "Search Trend", score: 88, weight: 0.15, evidence: "Steady search volume" },
      { name: "PR Momentum", score: 86, weight: 0.12, evidence: "Regular luxury media features" },
      { name: "Collaboration Activity", score: 89, weight: 0.15, evidence: "Designer collaborations" },
      { name: "Store Expansion Rate", score: 89, weight: 0.20, evidence: "Select expansion strategy" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 85, weight: 0.25, evidence: "Active UAE presence management" },
      { name: "Trademark Filing", score: 88, weight: 0.20, evidence: "Established brand protection" },
      { name: "Regional Partnerships", score: 83, weight: 0.15, evidence: "Strong mall partnerships" },
      { name: "Logistics Setup", score: 85, weight: 0.15, evidence: "Efficient distribution network" },
      { name: "Local Content", score: 82, weight: 0.10, evidence: "Arabic presence ready" },
      { name: "Competitor Presence", score: 84, weight: 0.15, evidence: "Established luxury position" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 87, weight: 0.50, evidence: "High luxury perception" },
      { name: "Brand Equity Value", score: 85, weight: 0.50, evidence: "Strong brand value" }
    ],
    
    signals: [
      { id: "sig-010", category: "Retail", type: "Presence", description: "Swarovski at 408 global mall locations", source_url: "https://www.swarovski.com", source_name: "Swarovski Store Locator", detected_at: "2026-05-20", strength: "strong" },
      { id: "sig-011", category: "Category", type: "Performance", description: "Jewellery drives premium positioning", source_url: "https://www.malloftheemirates.com", source_name: "MAF", detected_at: "2026-05-18", strength: "strong" }
    ]
  },

  // 3. Lush - PRESENT, CRS=84
  {
    id: "brand-003",
    name: "Lush",
    category: "Beauty",
    subcategory: "Ethical Cosmetics",
    origin_country: "UK",
    
    crs: 84,
    bis: 85,
    bms: 87,
    mes: 83,
    bes: 84,
    mrs: 53,
    
    temperature: "WARM",
    market_presence_status: "PRESENT",
    pre_market_flag: false,
    
    compatibility_score: 88,
    pss: 85,
    final_score: 83,
    category_gap: 0,
    
    engagement_note: "DNVB success story in ethical beauty. Strong presence in 11 MAF malls. BES validation through community. Experiential retail model.",
    engagement_timing: "Relationship maintenance",
    
    bis_pillars: [
      { name: "Product Architecture", score: 85, weight: 0.15, evidence: "Bath, skincare, haircare lines" },
      { name: "Digital Presence", score: 86, weight: 0.15, evidence: "Strong social following" },
      { name: "Brand Story", score: 87, weight: 0.12, evidence: "Ethical, sustainable positioning" },
      { name: "Price Architecture", score: 84, weight: 0.10, evidence: "Accessible premium AED 80-400" },
      { name: "Visual Identity", score: 85, weight: 0.10, evidence: "Distinctive experiential stores" },
      { name: "Product Innovation", score: 84, weight: 0.13, evidence: "Seasonal innovation" },
      { name: "Category Leadership", score: 85, weight: 0.15, evidence: "Leader in ethical cosmetics" },
      { name: "Sustainability", score: 88, weight: 0.10, evidence: "Strong sustainability focus" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 87, weight: 0.20, evidence: "9% YoY growth" },
      { name: "Social Momentum", score: 88, weight: 0.18, evidence: "Viral campaigns" },
      { name: "Search Trend", score: 86, weight: 0.15, evidence: "Growing search interest" },
      { name: "PR Momentum", score: 86, weight: 0.12, evidence: "Media coverage" },
      { name: "Collaboration Activity", score: 87, weight: 0.15, evidence: "Creator collaborations" },
      { name: "Store Expansion Rate", score: 87, weight: 0.20, evidence: "Selective expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 83, weight: 0.25, evidence: "UAE team presence" },
      { name: "Trademark Filing", score: 85, weight: 0.20, evidence: "Protected brand" },
      { name: "Regional Partnerships", score: 82, weight: 0.15, evidence: "MAF partnerships" },
      { name: "Logistics Setup", score: 83, weight: 0.15, evidence: "Good distribution" },
      { name: "Local Content", score: 80, weight: 0.10, evidence: "Arabic support ready" },
      { name: "Competitor Presence", score: 83, weight: 0.15, evidence: "Category established" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 85, weight: 0.50, evidence: "High ethical appeal" },
      { name: "Brand Equity Value", score: 84, weight: 0.50, evidence: "Strong brand recognition" }
    ],
    
    signals: [
      { id: "sig-020", category: "Retail", type: "Presence", description: "Lush in 11 MAF mall locations", source_url: "https://www.lushusa.com/locator", source_name: "Lush Store Locator", detected_at: "2026-05-20", strength: "strong" },
      { id: "sig-021", category: "Category", type: "Growth", description: "Ethical beauty category growing", source_url: "https://www.beautyindustry.com", source_name: "Beauty Industry Report", detected_at: "2026-05-18", strength: "strong" }
    ]
  },

  // 4. Intimissimi - PRESENT, CRS=83
  {
    id: "brand-004",
    name: "Intimissimi",
    category: "Fashion",
    subcategory: "Lingerie",
    origin_country: "Italy",
    
    crs: 83,
    bis: 83,
    bms: 85,
    mes: 82,
    bes: 83,
    mrs: 53,
    
    temperature: "WARM",
    market_presence_status: "PRESENT",
    pre_market_flag: false,
    
    compatibility_score: 87,
    pss: 83,
    final_score: 82,
    category_gap: 0,
    
    engagement_note: "Calzedonia Group portfolio brand. Digital-first GCC entry strategy. Growing regional presence with strong fundamentals.",
    engagement_timing: "Account management",
    
    bis_pillars: [
      { name: "Product Architecture", score: 83, weight: 0.15, evidence: "Intimate apparel focus" },
      { name: "Digital Presence", score: 84, weight: 0.15, evidence: "Strong e-commerce" },
      { name: "Brand Story", score: 82, weight: 0.12, evidence: "Italian luxury positioning" },
      { name: "Price Architecture", score: 83, weight: 0.10, evidence: "Accessible luxury" },
      { name: "Visual Identity", score: 83, weight: 0.10, evidence: "Minimalist design" },
      { name: "Product Innovation", score: 82, weight: 0.13, evidence: "Seasonal collections" },
      { name: "Category Leadership", score: 84, weight: 0.15, evidence: "Category leader" },
      { name: "Sustainability", score: 80, weight: 0.10, evidence: "Sustainability initiatives" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 85, weight: 0.20, evidence: "7% YoY growth" },
      { name: "Social Momentum", score: 84, weight: 0.18, evidence: "Growing followers" },
      { name: "Search Trend", score: 85, weight: 0.15, evidence: "Steady interest" },
      { name: "PR Momentum", score: 85, weight: 0.12, evidence: "Media coverage" },
      { name: "Collaboration Activity", score: 86, weight: 0.15, evidence: "Collaborations" },
      { name: "Store Expansion Rate", score: 85, weight: 0.20, evidence: "Selective expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 82, weight: 0.25, evidence: "UAE operations" },
      { name: "Trademark Filing", score: 84, weight: 0.20, evidence: "Brand protection" },
      { name: "Regional Partnerships", score: 81, weight: 0.15, evidence: "Group partnerships" },
      { name: "Logistics Setup", score: 82, weight: 0.15, evidence: "Group distribution" },
      { name: "Local Content", score: 79, weight: 0.10, evidence: "Arabic presence" },
      { name: "Competitor Presence", score: 82, weight: 0.15, evidence: "Category presence" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 84, weight: 0.50, evidence: "Strong brand appeal" },
      { name: "Brand Equity Value", score: 83, weight: 0.50, evidence: "Calzedonia strength" }
    ],
    
    signals: [
      { id: "sig-030", category: "Retail", type: "Presence", description: "Intimissimi UAE expansion via Calzedonia", source_url: "https://www.intimissimi.com/ae", source_name: "Intimissimi UAE", detected_at: "2026-05-20", strength: "strong" }
    ]
  },

  // 5. Kiko Milano - PRESENT, CRS=82
  {
    id: "brand-005",
    name: "Kiko Milano",
    category: "Beauty",
    subcategory: "Accessible Luxury",
    origin_country: "Italy",
    
    crs: 82,
    bis: 82,
    bms: 84,
    mes: 81,
    bes: 82,
    mrs: 53,
    
    temperature: "WARM",
    market_presence_status: "PRESENT",
    pre_market_flag: false,
    
    compatibility_score: 86,
    pss: 82,
    final_score: 81,
    category_gap: 0,
    
    engagement_note: "Accessible luxury beauty brand. Underdeployed in MAF. Growth opportunity within existing category. Strong product-market fit.",
    engagement_timing: "Expansion opportunity",
    
    bis_pillars: [
      { name: "Product Architecture", score: 82, weight: 0.15, evidence: "Makeup and skincare" },
      { name: "Digital Presence", score: 83, weight: 0.15, evidence: "E-commerce presence" },
      { name: "Brand Story", score: 82, weight: 0.12, evidence: "Italian beauty expertise" },
      { name: "Price Architecture", score: 83, weight: 0.10, evidence: "Accessible luxury pricing" },
      { name: "Visual Identity", score: 82, weight: 0.10, evidence: "Consistent branding" },
      { name: "Product Innovation", score: 81, weight: 0.13, evidence: "Regular launches" },
      { name: "Category Leadership", score: 82, weight: 0.15, evidence: "Category leader" },
      { name: "Sustainability", score: 79, weight: 0.10, evidence: "Sustainability programs" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 84, weight: 0.20, evidence: "8% YoY growth" },
      { name: "Social Momentum", score: 83, weight: 0.18, evidence: "Growing social presence" },
      { name: "Search Trend", score: 84, weight: 0.15, evidence: "Increasing searches" },
      { name: "PR Momentum", score: 84, weight: 0.12, evidence: "Media coverage" },
      { name: "Collaboration Activity", score: 85, weight: 0.15, evidence: "Influencer partnerships" },
      { name: "Store Expansion Rate", score: 84, weight: 0.20, evidence: "Controlled expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 81, weight: 0.25, evidence: "UAE operations" },
      { name: "Trademark Filing", score: 83, weight: 0.20, evidence: "Brand registered" },
      { name: "Regional Partnerships", score: 80, weight: 0.15, evidence: "Partnerships in place" },
      { name: "Logistics Setup", score: 81, weight: 0.15, evidence: "Distribution ready" },
      { name: "Local Content", score: 78, weight: 0.10, evidence: "Arabic support" },
      { name: "Competitor Presence", score: 81, weight: 0.15, evidence: "Category position" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 83, weight: 0.50, evidence: "Strong brand recognition" },
      { name: "Brand Equity Value", score: 82, weight: 0.50, evidence: "Italian brand strength" }
    ],
    
    signals: [
      { id: "sig-040", category: "Retail", type: "Presence", description: "Kiko Milano underdeployed in MAF malls", source_url: "https://www.kikomilano.com", source_name: "Kiko Milano", detected_at: "2026-05-20", strength: "moderate" }
    ]
  },

  // 6. Byredo - REGIONAL, CRS=88 (HOT - GOLD OPPORTUNITY)
  {
    id: "brand-006",
    name: "Byredo",
    category: "Fragrance",
    subcategory: "Ultra-Premium",
    origin_country: "Sweden",
    
    crs: 88,
    bis: 80,
    bms: 85,
    mes: 78,
    bes: 88,
    mrs: 71,
    
    temperature: "HOT",
    market_presence_status: "REGIONAL",
    pre_market_flag: false,
    
    compatibility_score: 89,
    pss: 90,
    final_score: 80,
    category_gap: 0,
    
    engagement_note: "Ultra-premium fragrance brand. KSA confirmed entry. UAE entry imminent. 30-day outreach window critical. GOLD NUGGET OPPORTUNITY.",
    engagement_timing: "Outreach within 30 days",
    
    bis_pillars: [
      { name: "Product Architecture", score: 80, weight: 0.15, evidence: "Ultra-premium fragrance focus" },
      { name: "Digital Presence", score: 82, weight: 0.15, evidence: "Luxury digital presence" },
      { name: "Brand Story", score: 80, weight: 0.12, evidence: "Minimalist Swedish luxury" },
      { name: "Price Architecture", score: 80, weight: 0.10, evidence: "Ultra-premium pricing AED 800+" },
      { name: "Visual Identity", score: 82, weight: 0.10, evidence: "Distinctive aesthetic" },
      { name: "Product Innovation", score: 79, weight: 0.13, evidence: "Limited editions" },
      { name: "Category Leadership", score: 81, weight: 0.15, evidence: "Niche category leader" },
      { name: "Sustainability", score: 75, weight: 0.10, evidence: "Luxury positioning" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 85, weight: 0.20, evidence: "Strong growth trajectory" },
      { name: "Social Momentum", score: 84, weight: 0.18, evidence: "Growing luxury audience" },
      { name: "Search Trend", score: 86, weight: 0.15, evidence: "Rising interest" },
      { name: "PR Momentum", score: 85, weight: 0.12, evidence: "Luxury media features" },
      { name: "Collaboration Activity", score: 87, weight: 0.15, evidence: "Designer partnerships" },
      { name: "Store Expansion Rate", score: 84, weight: 0.20, evidence: "GCC expansion phase" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 88, weight: 0.25, evidence: "KSA entry confirmed, UAE imminent" },
      { name: "Trademark Filing", score: 85, weight: 0.20, evidence: "GCC trademark applications" },
      { name: "Regional Partnerships", score: 86, weight: 0.15, evidence: "Partner discussions active" },
      { name: "Logistics Setup", score: 76, weight: 0.15, evidence: "Planning distribution" },
      { name: "Local Content", score: 65, weight: 0.10, evidence: "Pre-entry stage" },
      { name: "Competitor Presence", score: 72, weight: 0.15, evidence: "Ultra-premium gap" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 88, weight: 0.50, evidence: "High luxury perception" },
      { name: "Brand Equity Value", score: 88, weight: 0.50, evidence: "Strong brand prestige" }
    ],
    
    signals: [
      { id: "sig-050", category: "Expansion", type: "Market Entry", description: "KSA confirmed, UAE imminent entry" },
      { id: "sig-051", category: "Press", type: "Luxury Media", description: "GCC expansion strategy coverage" }
    ]
  },

  // 7. Rituals - REGIONAL, CRS=85
  {
    id: "brand-007",
    name: "Rituals",
    category: "Beauty",
    subcategory: "Premium Wellness",
    origin_country: "Netherlands",
    
    crs: 85,
    bis: 79,
    bms: 83,
    mes: 77,
    bes: 85,
    mrs: 71,
    
    temperature: "WARM",
    market_presence_status: "REGIONAL",
    pre_market_flag: false,
    
    compatibility_score: 87,
    pss: 84,
    final_score: 79,
    category_gap: 0,
    
    engagement_note: "Premium wellness brand. 138 global mall locations. GCC demand confirmed high. Category growth driver in wellness segment.",
    engagement_timing: "Development opportunity",
    
    bis_pillars: [
      { name: "Product Architecture", score: 79, weight: 0.15, evidence: "Bath, body, home fragrance" },
      { name: "Digital Presence", score: 81, weight: 0.15, evidence: "Strong e-commerce" },
      { name: "Brand Story", score: 84, weight: 0.12, evidence: "Wellness and rituals positioning" },
      { name: "Price Architecture", score: 80, weight: 0.10, evidence: "Premium pricing" },
      { name: "Visual Identity", score: 82, weight: 0.10, evidence: "Distinctive wellness aesthetic" },
      { name: "Product Innovation", score: 78, weight: 0.13, evidence: "Seasonal innovation" },
      { name: "Category Leadership", score: 83, weight: 0.15, evidence: "Wellness category leader" },
      { name: "Sustainability", score: 81, weight: 0.10, evidence: "Strong sustainability focus" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 83, weight: 0.20, evidence: "7% YoY growth" },
      { name: "Social Momentum", score: 82, weight: 0.18, evidence: "Growing wellness audience" },
      { name: "Search Trend", score: 83, weight: 0.15, evidence: "Wellness searches rising" },
      { name: "PR Momentum", score: 83, weight: 0.12, evidence: "Wellness media coverage" },
      { name: "Collaboration Activity", score: 84, weight: 0.15, evidence: "Wellness collaborations" },
      { name: "Store Expansion Rate", score: 83, weight: 0.20, evidence: "Regional expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 77, weight: 0.25, evidence: "Early stage expansion" },
      { name: "Trademark Filing", score: 79, weight: 0.20, evidence: "Trademark filings" },
      { name: "Regional Partnerships", score: 76, weight: 0.15, evidence: "Partner discussions" },
      { name: "Logistics Setup", score: 75, weight: 0.15, evidence: "Distribution planning" },
      { name: "Local Content", score: 73, weight: 0.10, evidence: "Content development" },
      { name: "Competitor Presence", score: 78, weight: 0.15, evidence: "Wellness growth opportunity" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 85, weight: 0.50, evidence: "Strong wellness appeal" },
      { name: "Brand Equity Value", score: 85, weight: 0.50, evidence: "Brand recognition" }
    ],
    
    signals: [
      { id: "sig-060", category: "Retail", type: "Presence", description: "Rituals 138 global mall locations" },
      { id: "sig-061", category: "Category", type: "Growth", description: "Wellness category high demand in GCC" }
    ]
  },

  // 8. Aritzia - INTERNATIONAL, CRS=78 (WATCH - MEDIUM-TERM)
  {
    id: "brand-008",
    name: "Aritzia",
    category: "Fashion",
    subcategory: "Contemporary",
    origin_country: "Canada",
    
    crs: 78,
    bis: 78,
    bms: 80,
    mes: 76,
    bes: 78,
    mrs: 58,
    
    temperature: "WARM",
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: false,
    
    compatibility_score: 85,
    pss: 80,
    final_score: 78,
    category_gap: 0,
    
    engagement_note: "PE-backed expansion. Zero GCC presence with high demand detected. Medium-term opportunity (Q4 2026). Pre-CoStar positioning.",
    engagement_timing: "Medium-term opportunity (Q4 2026)",
    
    bis_pillars: [
      { name: "Product Architecture", score: 78, weight: 0.15, evidence: "Contemporary fashion focus" },
      { name: "Digital Presence", score: 79, weight: 0.15, evidence: "Growing e-commerce" },
      { name: "Brand Story", score: 78, weight: 0.12, evidence: "Canadian contemporary fashion" },
      { name: "Price Architecture", score: 78, weight: 0.10, evidence: "Contemporary luxury" },
      { name: "Visual Identity", score: 78, weight: 0.10, evidence: "Modern aesthetic" },
      { name: "Product Innovation", score: 77, weight: 0.13, evidence: "Seasonal collections" },
      { name: "Category Leadership", score: 79, weight: 0.15, evidence: "Contemporary leader" },
      { name: "Sustainability", score: 76, weight: 0.10, evidence: "Sustainability initiatives" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 80, weight: 0.20, evidence: "9% YoY growth" },
      { name: "Social Momentum", score: 79, weight: 0.18, evidence: "Growing followers" },
      { name: "Search Trend", score: 80, weight: 0.15, evidence: "Increasing interest" },
      { name: "PR Momentum", score: 80, weight: 0.12, evidence: "Media coverage" },
      { name: "Collaboration Activity", score: 81, weight: 0.15, evidence: "Designer partnerships" },
      { name: "Store Expansion Rate", score: 80, weight: 0.20, evidence: "Selective expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 76, weight: 0.25, evidence: "Zero current presence" },
      { name: "Trademark Filing", score: 75, weight: 0.20, evidence: "Planning applications" },
      { name: "Regional Partnerships", score: 74, weight: 0.15, evidence: "Preliminary discussions" },
      { name: "Logistics Setup", score: 73, weight: 0.15, evidence: "Infrastructure planning" },
      { name: "Local Content", score: 70, weight: 0.10, evidence: "Development stage" },
      { name: "Competitor Presence", score: 76, weight: 0.15, evidence: "Contemporary gap identified" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 78, weight: 0.50, evidence: "Strong brand recognition" },
      { name: "Brand Equity Value", score: 78, weight: 0.50, evidence: "PE backing strength" }
    ],
    
    signals: [
      { id: "sig-070", category: "Expansion", type: "Medium-term", description: "Aritzia Q4 2026 GCC entry planned" },
      { id: "sig-071", category: "Investor", type: "PE Backing", description: "Strong financial backing for expansion" }
    ]
  },

  // 9. Kayali - DOMESTIC_ONLY, CRS=91 (HOT - GOLD NUGGET - BEST OPPORTUNITY)
  {
    id: "brand-009",
    name: "Kayali",
    category: "Beauty",
    subcategory: "Fragrance",
    origin_country: "UAE",
    
    crs: 91,
    bis: 78,
    bms: 82,
    mes: 65,
    bes: 91,
    mrs: 100,
    
    temperature: "HOT",
    market_presence_status: "DOMESTIC_ONLY",
    pre_market_flag: false,
    
    compatibility_score: 94,
    pss: 95,
    final_score: 91,
    category_gap: 30,
    
    engagement_note: "UAE-born DNVB. Zero physical retail stores. Massive GCC following and demand. ULTIMATE GOLD NUGGET - highest priority for immediate outreach.",
    engagement_timing: "Outreach within 30 days - HIGHEST PRIORITY",
    
    bis_pillars: [
      { name: "Product Architecture", score: 78, weight: 0.15, evidence: "Fragrance focus" },
      { name: "Digital Presence", score: 90, weight: 0.15, evidence: "Massive social following" },
      { name: "Brand Story", score: 80, weight: 0.12, evidence: "UAE heritage positioning" },
      { name: "Price Architecture", score: 75, weight: 0.10, evidence: "Premium positioning" },
      { name: "Visual Identity", score: 85, weight: 0.10, evidence: "Strong visual brand" },
      { name: "Product Innovation", score: 72, weight: 0.13, evidence: "Viral product strategy" },
      { name: "Category Leadership", score: 78, weight: 0.15, evidence: "Emerging leader" },
      { name: "Sustainability", score: 70, weight: 0.10, evidence: "Early stage" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 82, weight: 0.20, evidence: "Explosive growth" },
      { name: "Social Momentum", score: 92, weight: 0.18, evidence: "Viral social growth" },
      { name: "Search Trend", score: 88, weight: 0.15, evidence: "Explosive search growth" },
      { name: "PR Momentum", score: 80, weight: 0.12, evidence: "Media coverage" },
      { name: "Collaboration Activity", score: 82, weight: 0.15, evidence: "Influencer collaborations" },
      { name: "Store Expansion Rate", score: 75, weight: 0.20, evidence: "First-time retail entry" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 70, weight: 0.25, evidence: "Ready for expansion" },
      { name: "Trademark Filing", score: 80, weight: 0.20, evidence: "UAE trademark filed" },
      { name: "Regional Partnerships", score: 65, weight: 0.15, evidence: "Seeking retail partners" },
      { name: "Logistics Setup", score: 60, weight: 0.15, evidence: "DTC-focused infrastructure" },
      { name: "Local Content", score: 55, weight: 0.10, evidence: "UAE-native advantage" },
      { name: "Competitor Presence", score: 58, weight: 0.15, evidence: "Blue ocean opportunity" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 92, weight: 0.50, evidence: "Massive GCC demand" },
      { name: "Brand Equity Value", score: 90, weight: 0.50, evidence: "Strong community following" }
    ],
    
    signals: [
      { id: "sig-080", category: "Social", type: "Viral", description: "Kayali viral fragrance phenomenon" },
      { id: "sig-081", category: "Market", type: "Demand", description: "200K+ waitlist for physical retail" },
      { id: "sig-082", category: "Brand", type: "Heritage", description: "UAE-born DNVB advantage" }
    ]
  },

  // 10. Phlur - DOMESTIC_ONLY, CRS=70 (WATCH - MEDIUM-TERM Q4 2026)
  {
    id: "brand-010",
    name: "Phlur",
    category: "Beauty",
    subcategory: "Fragrance",
    origin_country: "USA",
    
    crs: 70,
    bis: 72,
    bms: 68,
    mes: 45,
    bes: 88,
    mrs: 100,
    
    temperature: "WARM",
    market_presence_status: "DOMESTIC_ONLY",
    pre_market_flag: false,
    
    compatibility_score: 82,
    pss: 78,
    final_score: 70,
    category_gap: 30,
    
    engagement_note: "Viral DTC fragrance brand. Missing Person 200K+ waitlist phenomenon. Zero physical stores. Medium-term opportunity (Q4 2026).",
    engagement_timing: "Medium-term opportunity (Q4 2026)",
    
    bis_pillars: [
      { name: "Product Architecture", score: 72, weight: 0.15, evidence: "Fragrance focus" },
      { name: "Digital Presence", score: 88, weight: 0.15, evidence: "Viral social presence" },
      { name: "Brand Story", score: 74, weight: 0.12, evidence: "DTC fragrance innovation" },
      { name: "Price Architecture", score: 68, weight: 0.10, evidence: "Premium pricing" },
      { name: "Visual Identity", score: 78, weight: 0.10, evidence: "Distinctive branding" },
      { name: "Product Innovation", score: 65, weight: 0.13, evidence: "Viral product strategy" },
      { name: "Category Leadership", score: 70, weight: 0.15, evidence: "Emerging brand" },
      { name: "Sustainability", score: 62, weight: 0.10, evidence: "Early stage focus" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 68, weight: 0.20, evidence: "High growth phase" },
      { name: "Social Momentum", score: 88, weight: 0.18, evidence: "Viral campaigns" },
      { name: "Search Trend", score: 78, weight: 0.15, evidence: "Rising search interest" },
      { name: "PR Momentum", score: 65, weight: 0.12, evidence: "Media coverage growing" },
      { name: "Collaboration Activity", score: 58, weight: 0.15, evidence: "Limited collaborations" },
      { name: "Store Expansion Rate", score: 52, weight: 0.20, evidence: "First retail phase" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 45, weight: 0.25, evidence: "Early expansion stage" },
      { name: "Trademark Filing", score: 50, weight: 0.20, evidence: "Planning trademark" },
      { name: "Regional Partnerships", score: 42, weight: 0.15, evidence: "Partnership discussions" },
      { name: "Logistics Setup", score: 40, weight: 0.15, evidence: "Infrastructure planning" },
      { name: "Local Content", score: 38, weight: 0.10, evidence: "Pre-entry stage" },
      { name: "Competitor Presence", score: 48, weight: 0.15, evidence: "Emerging category opportunity" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 88, weight: 0.50, evidence: "Strong community following" },
      { name: "Brand Equity Value", score: 88, weight: 0.50, evidence: "Viral brand momentum" }
    ],
    
    signals: [
      { id: "sig-090", category: "Social", type: "Viral", description: "Phlur viral DTC phenomenon" },
      { id: "sig-091", category: "Market", type: "Demand", description: "200K+ waitlist for retail expansion" },
      { id: "sig-092", category: "Brand", type: "Innovation", description: "Disrupting DTC fragrance category" }
    ]
  }
];
