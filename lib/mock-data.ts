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

// Mock Brand Profiles (Top 10) - WITH CORRECTED MRS AND FINAL SCORES
export const mockBrands: BrandProfile[] = [
  // 1. Alo Yoga - INTERNATIONAL, CRS=89
  // MRS = 89 × 1.00 × 1.25 = 111 → cap 100
  // FinalScore = (89×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 35.6 + 30 + 6 + 8.1 = 79.7 → 80
  {
    id: "brand-001",
    name: "Alo Yoga",
    category: "Fashion & Lifestyle",
    subcategory: "Athleisure",
    origin_country: "USA",
    
    crs: 89,
    bis: 85,
    bms: 92,
    mes: 88,
    bes: 91,
    mrs: calculateMRS(89, "INTERNATIONAL"), // = 100 (capped)
    
    temperature: determineTemperature(calculateFinalScore(89, calculateMRS(89, "INTERNATIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: shouldShowPreMarket("INTERNATIONAL", calculateMRS(89, "INTERNATIONAL")),
    
    compatibility_score: 94,
    pss: 91,
    final_score: calculateFinalScore(89, calculateMRS(89, "INTERNATIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Premium athleisure brand with strong celebrity following. No UAE presence. Active GCC expansion signals detected. Ideal timing for first-mover pitch.",
    engagement_timing: "Immediate outreach recommended",
    
    bis_pillars: [
      { name: "Product Architecture", score: 88, weight: 0.15, evidence: "Clean product hierarchy: Studio, Wellness, Lifestyle", source_url: "https://www.aloyoga.com/collections" },
      { name: "Digital Presence", score: 91, weight: 0.15, evidence: "8.2M Instagram followers, strong engagement", source_url: "https://instagram.com/aloyoga" },
      { name: "Brand Story", score: 82, weight: 0.12, evidence: "Mindful movement positioning resonates with GCC wellness trend", source_url: "https://www.aloyoga.com/pages/about" },
      { name: "Price Architecture", score: 85, weight: 0.10, evidence: "Premium positioning AED 400-800 avg item", source_url: "https://www.aloyoga.com/collections/new-arrivals" },
      { name: "Visual Identity", score: 89, weight: 0.10, evidence: "Consistent minimal aesthetic across touchpoints" },
      { name: "Product Innovation", score: 87, weight: 0.13, evidence: "Patented Airbrush fabric technology", source_url: "https://www.aloyoga.com/pages/airbrush" },
      { name: "Category Leadership", score: 84, weight: 0.15, evidence: "#2 premium athleisure globally after Lululemon" },
      { name: "Sustainability", score: 78, weight: 0.10, evidence: "B Corp certified, recycled materials program" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 94, weight: 0.20, evidence: "42% YoY revenue growth 2024", source_url: "https://www.forbes.com/alo-yoga-growth" },
      { name: "Social Momentum", score: 93, weight: 0.18, evidence: "+1.2M followers in 6 months" },
      { name: "Search Trend", score: 89, weight: 0.15, evidence: "UAE search volume up 156% YoY", source_url: "https://trends.google.com/trends/explore?geo=AE&q=alo%20yoga" },
      { name: "PR Momentum", score: 88, weight: 0.12, evidence: "12 Arabic press mentions in 90 days" },
      { name: "Collaboration Activity", score: 91, weight: 0.15, evidence: "Kendall Jenner partnership announced" },
      { name: "Store Expansion Rate", score: 90, weight: 0.20, evidence: "18 new stores globally in 2024" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 92, weight: 0.25, evidence: "3 UAE retail manager positions posted", source_url: "https://www.linkedin.com/jobs/alo-yoga-uae" },
      { name: "Trademark Filing", score: 88, weight: 0.20, evidence: "UAE trademark filed March 2025", source_url: "https://www.mociuae.gov.ae/trademarks" },
      { name: "Regional Partnerships", score: 85, weight: 0.15, evidence: "In talks with Chalhoub Group" },
      { name: "Logistics Setup", score: 78, weight: 0.15, evidence: "MENA distribution center in planning" },
      { name: "Local Content", score: 72, weight: 0.10, evidence: "Arabic website not yet available" },
      { name: "Competitor Presence", score: 86, weight: 0.15, evidence: "Lululemon successful in UAE validates category" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 92, weight: 0.50, evidence: "Net Promoter Score 78 (excellent)" },
      { name: "Brand Equity Value", score: 90, weight: 0.50, evidence: "Estimated brand value $1.2B" }
    ],
    
    signals: [
      { id: "sig-001", category: "Hiring", type: "Job Posting", description: "Retail Store Manager - UAE posted on LinkedIn", source_url: "https://www.linkedin.com/jobs/view/3892847", source_name: "LinkedIn", detected_at: "2026-05-15", strength: "strong" },
      { id: "sig-002", category: "Legal", type: "Trademark", description: "Alo Yoga trademark application in UAE", source_url: "https://www.mociuae.gov.ae/trademarks/AY2025", source_name: "MOCIUAE", detected_at: "2026-03-20", strength: "strong" },
      { id: "sig-003", category: "Search", type: "Google Trends", description: "156% increase in UAE search volume", source_url: "https://trends.google.com/trends/explore?geo=AE&q=alo%20yoga", source_name: "Google Trends", detected_at: "2026-05-20", strength: "strong" },
      { id: "sig-004", category: "Press", type: "Arabic Media", description: "Feature in Vogue Arabia on wellness brands entering GCC", source_url: "https://en.vogue.me/fashion/alo-yoga-gcc", source_name: "Vogue Arabia", detected_at: "2026-04-10", strength: "moderate" },
      { id: "sig-005", category: "Social", type: "Influencer", description: "Multiple UAE influencers tagging brand", source_url: "https://instagram.com/p/C7xyz", source_name: "Instagram", detected_at: "2026-05-18", strength: "moderate" }
    ]
  },
  
  // 2. Vuori - INTERNATIONAL, CRS=86
  // MRS = 86 × 1.00 × 1.25 = 107.5 → cap 100
  // FinalScore = (86×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 34.4 + 30 + 6 + 8.1 = 78.5 → 79
  {
    id: "brand-002",
    name: "Vuori",
    category: "Fashion & Lifestyle",
    subcategory: "Performance Apparel",
    origin_country: "USA",
    
    crs: 86,
    bis: 83,
    bms: 89,
    mes: 85,
    bes: 87,
    mrs: calculateMRS(86, "INTERNATIONAL"), // = 100 (capped)
    
    temperature: determineTemperature(calculateFinalScore(86, calculateMRS(86, "INTERNATIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: shouldShowPreMarket("INTERNATIONAL", calculateMRS(86, "INTERNATIONAL")),
    
    compatibility_score: 91,
    pss: 88,
    final_score: calculateFinalScore(86, calculateMRS(86, "INTERNATIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "California-inspired performance lifestyle brand. Strong momentum post-$4B valuation. GCC expansion signals emerging. Men's athleisure gap in UAE.",
    engagement_timing: "Outreach within 30 days",
    
    bis_pillars: [
      { name: "Product Architecture", score: 85, weight: 0.15, evidence: "Strong men's focus, expanding women's", source_url: "https://vuoriclothing.com/collections" },
      { name: "Digital Presence", score: 87, weight: 0.15, evidence: "3.1M Instagram, high engagement", source_url: "https://instagram.com/vuoriclothing" },
      { name: "Brand Story", score: 84, weight: 0.12, evidence: "Coastal California lifestyle positioning" },
      { name: "Price Architecture", score: 82, weight: 0.10, evidence: "Premium but accessible AED 300-600" },
      { name: "Visual Identity", score: 86, weight: 0.10, evidence: "Consistent earthy, coastal aesthetic" },
      { name: "Product Innovation", score: 80, weight: 0.13, evidence: "Proprietary fabric technologies" },
      { name: "Category Leadership", score: 78, weight: 0.15, evidence: "Leader in men's athleisure" },
      { name: "Sustainability", score: 82, weight: 0.10, evidence: "Strong sustainability commitments" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 91, weight: 0.20, evidence: "Revenue doubled in 2024", source_url: "https://techcrunch.com/vuori-growth" },
      { name: "Social Momentum", score: 88, weight: 0.18, evidence: "Strong organic growth" },
      { name: "Search Trend", score: 85, weight: 0.15, evidence: "UAE searches up 89% YoY", source_url: "https://trends.google.com/trends/explore?geo=AE&q=vuori" },
      { name: "PR Momentum", score: 87, weight: 0.12, evidence: "$4B valuation news coverage" },
      { name: "Collaboration Activity", score: 84, weight: 0.15, evidence: "Active ambassador program" },
      { name: "Store Expansion Rate", score: 92, weight: 0.20, evidence: "25 new stores planned 2025" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 82, weight: 0.25, evidence: "EMEA expansion team hiring", source_url: "https://linkedin.com/jobs/vuori-emea" },
      { name: "Trademark Filing", score: 78, weight: 0.20, evidence: "GCC trademark search detected" },
      { name: "Regional Partnerships", score: 80, weight: 0.15, evidence: "Early partner discussions" },
      { name: "Logistics Setup", score: 75, weight: 0.15, evidence: "EU distribution established" },
      { name: "Local Content", score: 68, weight: 0.10, evidence: "No Arabic content yet" },
      { name: "Competitor Presence", score: 88, weight: 0.15, evidence: "Gap in men's premium athleisure" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 88, weight: 0.50, evidence: "NPS 72" },
      { name: "Brand Equity Value", score: 86, weight: 0.50, evidence: "$4B valuation" }
    ],
    
    signals: [
      { id: "sig-010", category: "Financial", type: "Valuation", description: "$4B valuation announced", source_url: "https://techcrunch.com/vuori-4b", source_name: "TechCrunch", detected_at: "2026-04-01", strength: "strong" },
      { id: "sig-011", category: "Hiring", type: "Job Posting", description: "EMEA Expansion Director role", source_url: "https://linkedin.com/jobs/vuori-emea", source_name: "LinkedIn", detected_at: "2026-05-10", strength: "moderate" }
    ]
  },
  
  // 3. Skims - REGIONAL, CRS=91
  // MRS = 91 × 0.50 × 1.25 = 56.875 → 57
  // FinalScore = (91×0.40) + (57×0.30) + (30×0.20) + (81×0.10) = 36.4 + 17.1 + 6 + 8.1 = 67.6 → 68
  {
    id: "brand-003",
    name: "Skims",
    category: "Fashion & Lifestyle",
    subcategory: "Intimates & Loungewear",
    origin_country: "USA",
    
    crs: 91,
    bis: 89,
    bms: 95,
    mes: 89,
    bes: 92,
    mrs: calculateMRS(91, "REGIONAL"), // = 57
    
    temperature: determineTemperature(calculateFinalScore(91, calculateMRS(91, "REGIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "REGIONAL",
    pre_market_flag: false, // REGIONAL = no pre-market
    
    compatibility_score: 88,
    pss: 92,
    final_score: calculateFinalScore(91, calculateMRS(91, "REGIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Kim Kardashian's shapewear brand. Already in Dubai Mall via popup. Seeking permanent UAE location. High demand confirmed but already regional.",
    engagement_timing: "Priority pitch - active site search",
    
    bis_pillars: [
      { name: "Product Architecture", score: 92, weight: 0.15, evidence: "Shapewear, loungewear, swim lines", source_url: "https://skims.com/collections" },
      { name: "Digital Presence", score: 94, weight: 0.15, evidence: "7.8M followers, viral campaigns", source_url: "https://instagram.com/skims" },
      { name: "Brand Story", score: 90, weight: 0.12, evidence: "Inclusive sizing, celebrity founder" },
      { name: "Price Architecture", score: 86, weight: 0.10, evidence: "Accessible luxury AED 150-500" },
      { name: "Visual Identity", score: 91, weight: 0.10, evidence: "Iconic neutral palette" },
      { name: "Product Innovation", score: 88, weight: 0.13, evidence: "Patented compression tech" },
      { name: "Category Leadership", score: 89, weight: 0.15, evidence: "Disrupted Spanx dominance" },
      { name: "Sustainability", score: 75, weight: 0.10, evidence: "Improving sustainability focus" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 96, weight: 0.20, evidence: "$750M revenue, 60% growth" },
      { name: "Social Momentum", score: 95, weight: 0.18, evidence: "Consistent viral moments" },
      { name: "Search Trend", score: 92, weight: 0.15, evidence: "Top searched brand in UAE", source_url: "https://trends.google.com/trends/explore?geo=AE&q=skims" },
      { name: "PR Momentum", score: 94, weight: 0.12, evidence: "Constant media coverage" },
      { name: "Collaboration Activity", score: 93, weight: 0.15, evidence: "Fendi, Swarovski collabs" },
      { name: "Store Expansion Rate", score: 94, weight: 0.20, evidence: "Aggressive retail expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 90, weight: 0.25, evidence: "UAE retail team building" },
      { name: "Trademark Filing", score: 92, weight: 0.20, evidence: "Full GCC trademark protection", source_url: "https://www.mociuae.gov.ae/trademarks" },
      { name: "Regional Partnerships", score: 88, weight: 0.15, evidence: "Confirmed regional partner" },
      { name: "Logistics Setup", score: 85, weight: 0.15, evidence: "MENA fulfillment active" },
      { name: "Local Content", score: 82, weight: 0.10, evidence: "Arabic social content live" },
      { name: "Competitor Presence", score: 90, weight: 0.15, evidence: "Clear market opportunity" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 93, weight: 0.50, evidence: "NPS 81" },
      { name: "Brand Equity Value", score: 91, weight: 0.50, evidence: "$4B valuation" }
    ],
    
    signals: [
      { id: "sig-020", category: "Retail", type: "Popup", description: "Dubai Mall popup extended due to demand", source_url: "https://gulfnews.com/skims-dubai", source_name: "Gulf News", detected_at: "2026-04-15", strength: "strong" }
    ]
  },
  
  // 4. Reformation - INTERNATIONAL, CRS=84
  // MRS = 84 × 1.00 × 1.25 = 105 → cap 100
  // FinalScore = (84×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 33.6 + 30 + 6 + 8.1 = 77.7 → 78
  {
    id: "brand-004",
    name: "Reformation",
    category: "Fashion & Lifestyle",
    subcategory: "Sustainable Fashion",
    origin_country: "USA",
    
    crs: 84,
    bis: 86,
    bms: 82,
    mes: 83,
    bes: 85,
    mrs: calculateMRS(84, "INTERNATIONAL"), // = 100 (capped)
    
    temperature: determineTemperature(calculateFinalScore(84, calculateMRS(84, "INTERNATIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: shouldShowPreMarket("INTERNATIONAL", calculateMRS(84, "INTERNATIONAL")),
    
    compatibility_score: 89,
    pss: 80,
    final_score: calculateFinalScore(84, calculateMRS(84, "INTERNATIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Sustainable fashion leader. Strong fit for MOE Fashion District. No GCC presence. EU expansion successful suggests MENA readiness.",
    engagement_timing: "Medium-term opportunity (Q4 2026)",
    
    bis_pillars: [
      { name: "Product Architecture", score: 87, weight: 0.15, evidence: "Dresses, denim, essentials", source_url: "https://www.thereformation.com/collections" },
      { name: "Digital Presence", score: 85, weight: 0.15, evidence: "3.5M followers", source_url: "https://instagram.com/reformation" },
      { name: "Brand Story", score: 89, weight: 0.12, evidence: "Strong sustainability narrative" },
      { name: "Price Architecture", score: 84, weight: 0.10, evidence: "Contemporary AED 400-1200" },
      { name: "Visual Identity", score: 86, weight: 0.10, evidence: "Feminine, sustainable aesthetic" },
      { name: "Product Innovation", score: 88, weight: 0.13, evidence: "RefScale sustainability metrics" },
      { name: "Category Leadership", score: 85, weight: 0.15, evidence: "Leader in sustainable fashion" },
      { name: "Sustainability", score: 92, weight: 0.10, evidence: "Carbon neutral, transparent supply chain" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 78, weight: 0.20, evidence: "Steady 18% growth" },
      { name: "Social Momentum", score: 82, weight: 0.18, evidence: "Strong engagement" },
      { name: "Search Trend", score: 80, weight: 0.15, evidence: "Growing UAE interest", source_url: "https://trends.google.com/trends/explore?geo=AE&q=reformation" },
      { name: "PR Momentum", score: 83, weight: 0.12, evidence: "Sustainability press coverage" },
      { name: "Collaboration Activity", score: 79, weight: 0.15, evidence: "Celebrity following" },
      { name: "Store Expansion Rate", score: 86, weight: 0.20, evidence: "UK expansion underway" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 72, weight: 0.25, evidence: "No direct signals yet" },
      { name: "Trademark Filing", score: 68, weight: 0.20, evidence: "No GCC filings detected" },
      { name: "Regional Partnerships", score: 75, weight: 0.15, evidence: "Partner discussions early stage" },
      { name: "Logistics Setup", score: 78, weight: 0.15, evidence: "EU logistics could extend" },
      { name: "Local Content", score: 65, weight: 0.10, evidence: "No Arabic presence" },
      { name: "Competitor Presence", score: 88, weight: 0.15, evidence: "Sustainability gap in market" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 86, weight: 0.50, evidence: "NPS 68" },
      { name: "Brand Equity Value", score: 84, weight: 0.50, evidence: "Strong brand recognition" }
    ],
    
    signals: [
      { id: "sig-030", category: "Expansion", type: "News", description: "UK flagship opening announced", source_url: "https://wwd.com/reformation-uk", source_name: "WWD", detected_at: "2026-03-20", strength: "moderate" }
    ]
  },
  
  // 5. Anine Bing - INTERNATIONAL, CRS=82
  // MRS = 82 × 1.00 × 1.25 = 102.5 → cap 100
  // FinalScore = (82×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 32.8 + 30 + 6 + 8.1 = 76.9 → 77
  {
    id: "brand-005",
    name: "Anine Bing",
    category: "Fashion & Lifestyle",
    subcategory: "Contemporary Fashion",
    origin_country: "USA",
    
    crs: 82,
    bis: 84,
    bms: 80,
    mes: 81,
    bes: 83,
    mrs: calculateMRS(82, "INTERNATIONAL"), // = 100 (capped)
    
    temperature: determineTemperature(calculateFinalScore(82, calculateMRS(82, "INTERNATIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: shouldShowPreMarket("INTERNATIONAL", calculateMRS(82, "INTERNATIONAL")),
    
    compatibility_score: 92,
    pss: 76,
    final_score: calculateFinalScore(82, calculateMRS(82, "INTERNATIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "LA-based contemporary brand. Perfect category fit for Fashion District. Strong wholesale presence but no UAE retail.",
    engagement_timing: "Q1 2027 approach",
    
    bis_pillars: [
      { name: "Product Architecture", score: 85, weight: 0.15, evidence: "Wardrobe essentials focus", source_url: "https://aninebing.com/collections" },
      { name: "Digital Presence", score: 83, weight: 0.15, evidence: "2.1M followers", source_url: "https://instagram.com/aninebing" },
      { name: "Brand Story", score: 86, weight: 0.12, evidence: "Founder-led, authentic voice" },
      { name: "Price Architecture", score: 82, weight: 0.10, evidence: "Premium contemporary" },
      { name: "Visual Identity", score: 84, weight: 0.10, evidence: "Scandinavian minimalism meets LA" },
      { name: "Product Innovation", score: 80, weight: 0.13, evidence: "Signature pieces strategy" },
      { name: "Category Leadership", score: 83, weight: 0.15, evidence: "Strong in contemporary segment" },
      { name: "Sustainability", score: 78, weight: 0.10, evidence: "Improving practices" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 76, weight: 0.20, evidence: "22% growth" },
      { name: "Social Momentum", score: 80, weight: 0.18, evidence: "Strong celebrity wearing" },
      { name: "Search Trend", score: 78, weight: 0.15, evidence: "Moderate UAE interest", source_url: "https://trends.google.com/trends/explore?geo=AE&q=anine%20bing" },
      { name: "PR Momentum", score: 79, weight: 0.12, evidence: "Regular press features" },
      { name: "Collaboration Activity", score: 82, weight: 0.15, evidence: "Brand collaborations active" },
      { name: "Store Expansion Rate", score: 84, weight: 0.20, evidence: "EU retail expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 68, weight: 0.25, evidence: "No direct signals" },
      { name: "Trademark Filing", score: 65, weight: 0.20, evidence: "No GCC filings" },
      { name: "Regional Partnerships", score: 78, weight: 0.15, evidence: "Wholesale relationships exist" },
      { name: "Logistics Setup", score: 76, weight: 0.15, evidence: "EU infrastructure" },
      { name: "Local Content", score: 62, weight: 0.10, evidence: "No Arabic content" },
      { name: "Competitor Presence", score: 85, weight: 0.15, evidence: "Category opportunity" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 84, weight: 0.50, evidence: "NPS 65" },
      { name: "Brand Equity Value", score: 82, weight: 0.50, evidence: "Growing recognition" }
    ],
    
    signals: []
  },
  
  // 6. Kith - REGIONAL, CRS=88
  // MRS = 88 × 0.50 × 1.25 = 55
  // FinalScore = (88×0.40) + (55×0.30) + (30×0.20) + (81×0.10) = 35.2 + 16.5 + 6 + 8.1 = 65.8 → 66
  {
    id: "brand-006",
    name: "Kith",
    category: "Fashion & Lifestyle",
    subcategory: "Streetwear",
    origin_country: "USA",
    
    crs: 88,
    bis: 87,
    bms: 90,
    mes: 86,
    bes: 89,
    mrs: calculateMRS(88, "REGIONAL"), // = 55
    
    temperature: determineTemperature(calculateFinalScore(88, calculateMRS(88, "REGIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "REGIONAL",
    pre_market_flag: false, // REGIONAL = no pre-market
    
    compatibility_score: 85,
    pss: 89,
    final_score: calculateFinalScore(88, calculateMRS(88, "REGIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Premium streetwear with retail theater expertise. Dubai store confirmed for 2026. MOE should pitch for expansion location. Already regional presence.",
    engagement_timing: "Immediate - expansion discussions",
    
    bis_pillars: [
      { name: "Product Architecture", score: 88, weight: 0.15, evidence: "Apparel, footwear, lifestyle", source_url: "https://kith.com/collections" },
      { name: "Digital Presence", score: 89, weight: 0.15, evidence: "3.8M followers, drop culture", source_url: "https://instagram.com/kith" },
      { name: "Brand Story", score: 87, weight: 0.12, evidence: "NYC heritage, founder story" },
      { name: "Price Architecture", score: 85, weight: 0.10, evidence: "Premium streetwear pricing" },
      { name: "Visual Identity", score: 88, weight: 0.10, evidence: "Iconic store design" },
      { name: "Product Innovation", score: 86, weight: 0.13, evidence: "Major brand collabs" },
      { name: "Category Leadership", score: 88, weight: 0.15, evidence: "Top streetwear retailer" },
      { name: "Sustainability", score: 75, weight: 0.10, evidence: "Developing initiatives" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 88, weight: 0.20, evidence: "Strong growth trajectory" },
      { name: "Social Momentum", score: 91, weight: 0.18, evidence: "Drop culture engagement" },
      { name: "Search Trend", score: 89, weight: 0.15, evidence: "High UAE interest", source_url: "https://trends.google.com/trends/explore?geo=AE&q=kith" },
      { name: "PR Momentum", score: 90, weight: 0.12, evidence: "Constant collab news" },
      { name: "Collaboration Activity", score: 92, weight: 0.15, evidence: "Nike, Versace, BMW" },
      { name: "Store Expansion Rate", score: 88, weight: 0.20, evidence: "International expansion active" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 88, weight: 0.25, evidence: "Dubai team building", source_url: "https://linkedin.com/jobs/kith-dubai" },
      { name: "Trademark Filing", score: 90, weight: 0.20, evidence: "UAE trademark registered", source_url: "https://www.mociuae.gov.ae/trademarks" },
      { name: "Regional Partnerships", score: 85, weight: 0.15, evidence: "Local partner confirmed" },
      { name: "Logistics Setup", score: 82, weight: 0.15, evidence: "Dubai logistics setup" },
      { name: "Local Content", score: 78, weight: 0.10, evidence: "GCC content beginning" },
      { name: "Competitor Presence", score: 86, weight: 0.15, evidence: "Streetwear demand high" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 90, weight: 0.50, evidence: "NPS 75" },
      { name: "Brand Equity Value", score: 88, weight: 0.50, evidence: "Strong brand value" }
    ],
    
    signals: [
      { id: "sig-060", category: "Retail", type: "Announcement", description: "Dubai flagship confirmed 2026", source_url: "https://hypebeast.com/kith-dubai", source_name: "Hypebeast", detected_at: "2026-05-01", strength: "strong" }
    ]
  },
  
  // 7. Rowing Blazers - INTERNATIONAL, CRS=79
  // MRS = 79 × 1.00 × 1.25 = 98.75 → 99
  // FinalScore = (79×0.40) + (99×0.30) + (30×0.20) + (81×0.10) = 31.6 + 29.7 + 6 + 8.1 = 75.4 → 75
  {
    id: "brand-007",
    name: "Rowing Blazers",
    category: "Fashion & Lifestyle",
    subcategory: "Preppy Streetwear",
    origin_country: "USA",
    
    crs: 79,
    bis: 81,
    bms: 78,
    mes: 76,
    bes: 80,
    mrs: calculateMRS(79, "INTERNATIONAL"), // = 99
    
    temperature: determineTemperature(calculateFinalScore(79, calculateMRS(79, "INTERNATIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: shouldShowPreMarket("INTERNATIONAL", calculateMRS(79, "INTERNATIONAL")),
    
    compatibility_score: 82,
    pss: 75,
    final_score: calculateFinalScore(79, calculateMRS(79, "INTERNATIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Cult preppy brand with unique positioning. Niche but passionate following. Would add variety to tenant mix.",
    engagement_timing: "Exploratory conversation Q2 2027",
    
    bis_pillars: [
      { name: "Product Architecture", score: 82, weight: 0.15, evidence: "Rugby, blazers, accessories", source_url: "https://rowingblazers.com/collections" },
      { name: "Digital Presence", score: 80, weight: 0.15, evidence: "500K engaged followers", source_url: "https://instagram.com/rowingblazers" },
      { name: "Brand Story", score: 84, weight: 0.12, evidence: "Authentic rowing heritage" },
      { name: "Price Architecture", score: 78, weight: 0.10, evidence: "Contemporary pricing" },
      { name: "Visual Identity", score: 83, weight: 0.10, evidence: "Distinctive preppy aesthetic" },
      { name: "Product Innovation", score: 79, weight: 0.13, evidence: "Unique collaborations" },
      { name: "Category Leadership", score: 80, weight: 0.15, evidence: "Preppy revival leader" },
      { name: "Sustainability", score: 76, weight: 0.10, evidence: "Basic initiatives" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 75, weight: 0.20, evidence: "Steady growth" },
      { name: "Social Momentum", score: 78, weight: 0.18, evidence: "Cult following" },
      { name: "Search Trend", score: 74, weight: 0.15, evidence: "Niche but growing UAE interest" },
      { name: "PR Momentum", score: 79, weight: 0.12, evidence: "Fashion press coverage" },
      { name: "Collaboration Activity", score: 82, weight: 0.15, evidence: "Active collabs" },
      { name: "Store Expansion Rate", score: 78, weight: 0.20, evidence: "Selective expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 62, weight: 0.25, evidence: "No signals" },
      { name: "Trademark Filing", score: 58, weight: 0.20, evidence: "No filings" },
      { name: "Regional Partnerships", score: 70, weight: 0.15, evidence: "Wholesale potential" },
      { name: "Logistics Setup", score: 72, weight: 0.15, evidence: "Basic international shipping" },
      { name: "Local Content", score: 55, weight: 0.10, evidence: "No local content" },
      { name: "Competitor Presence", score: 85, weight: 0.15, evidence: "No direct competition" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 81, weight: 0.50, evidence: "NPS 62" },
      { name: "Brand Equity Value", score: 79, weight: 0.50, evidence: "Growing recognition" }
    ],
    
    signals: []
  },
  
  // 8. Ganni - INTERNATIONAL, CRS=85
  // MRS = 85 × 1.00 × 1.25 = 106.25 → cap 100
  // FinalScore = (85×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 34 + 30 + 6 + 8.1 = 78.1 → 78
  {
    id: "brand-008",
    name: "Ganni",
    category: "Fashion & Lifestyle",
    subcategory: "Scandinavian Fashion",
    origin_country: "Denmark",
    
    crs: 85,
    bis: 86,
    bms: 84,
    mes: 84,
    bes: 86,
    mrs: calculateMRS(85, "INTERNATIONAL"), // = 100 (capped)
    
    temperature: determineTemperature(calculateFinalScore(85, calculateMRS(85, "INTERNATIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: shouldShowPreMarket("INTERNATIONAL", calculateMRS(85, "INTERNATIONAL")),
    
    compatibility_score: 90,
    pss: 82,
    final_score: calculateFinalScore(85, calculateMRS(85, "INTERNATIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Copenhagen-cool positioning. Strong wholesale in region but no UAE retail. Perfect Fashion District fit.",
    engagement_timing: "Q3 2026 outreach",
    
    bis_pillars: [
      { name: "Product Architecture", score: 87, weight: 0.15, evidence: "Ready-to-wear, accessories", source_url: "https://www.ganni.com/collections" },
      { name: "Digital Presence", score: 85, weight: 0.15, evidence: "2.8M followers", source_url: "https://instagram.com/gaborotorsk" },
      { name: "Brand Story", score: 88, weight: 0.12, evidence: "Scandinavian happy cool" },
      { name: "Price Architecture", score: 84, weight: 0.10, evidence: "Contemporary luxury" },
      { name: "Visual Identity", score: 87, weight: 0.10, evidence: "Playful, colorful aesthetic" },
      { name: "Product Innovation", score: 83, weight: 0.13, evidence: "Sustainability innovation" },
      { name: "Category Leadership", score: 86, weight: 0.15, evidence: "Scandi fashion leader" },
      { name: "Sustainability", score: 89, weight: 0.10, evidence: "Strong sustainability focus" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 82, weight: 0.20, evidence: "25% growth" },
      { name: "Social Momentum", score: 84, weight: 0.18, evidence: "Strong engagement" },
      { name: "Search Trend", score: 83, weight: 0.15, evidence: "Growing UAE searches", source_url: "https://trends.google.com/trends/explore?geo=AE&q=ganni" },
      { name: "PR Momentum", score: 85, weight: 0.12, evidence: "Regular features" },
      { name: "Collaboration Activity", score: 86, weight: 0.15, evidence: "Active collabs" },
      { name: "Store Expansion Rate", score: 84, weight: 0.20, evidence: "Global expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 75, weight: 0.25, evidence: "MENA interest signals" },
      { name: "Trademark Filing", score: 72, weight: 0.20, evidence: "Some GCC filings" },
      { name: "Regional Partnerships", score: 82, weight: 0.15, evidence: "Wholesale relationships" },
      { name: "Logistics Setup", score: 80, weight: 0.15, evidence: "EU logistics strong" },
      { name: "Local Content", score: 68, weight: 0.10, evidence: "Limited Arabic" },
      { name: "Competitor Presence", score: 88, weight: 0.15, evidence: "Gap in market" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 87, weight: 0.50, evidence: "NPS 70" },
      { name: "Brand Equity Value", score: 85, weight: 0.50, evidence: "Strong brand" }
    ],
    
    signals: [
      { id: "sig-080", category: "Retail", type: "News", description: "MENA expansion mentioned in investor call", source_url: "https://businessoffashion.com/ganni", source_name: "BoF", detected_at: "2026-04-25", strength: "moderate" }
    ]
  },
  
  // 9. Staud - INTERNATIONAL, CRS=80
  // MRS = 80 × 1.00 × 1.25 = 100
  // FinalScore = (80×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 32 + 30 + 6 + 8.1 = 76.1 → 76
  {
    id: "brand-009",
    name: "Staud",
    category: "Fashion & Lifestyle",
    subcategory: "Contemporary Fashion",
    origin_country: "USA",
    
    crs: 80,
    bis: 82,
    bms: 79,
    mes: 78,
    bes: 81,
    mrs: calculateMRS(80, "INTERNATIONAL"), // = 100
    
    temperature: determineTemperature(calculateFinalScore(80, calculateMRS(80, "INTERNATIONAL"), CATEGORY_GAP, CSS)),
    market_presence_status: "INTERNATIONAL",
    pre_market_flag: shouldShowPreMarket("INTERNATIONAL", calculateMRS(80, "INTERNATIONAL")),
    
    compatibility_score: 88,
    pss: 74,
    final_score: calculateFinalScore(80, calculateMRS(80, "INTERNATIONAL"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "LA-based contemporary with strong bags. Wholesale success but no MENA retail. Long-term opportunity.",
    engagement_timing: "Monitor - reach out Q1 2027",
    
    bis_pillars: [
      { name: "Product Architecture", score: 83, weight: 0.15, evidence: "RTW, bags, swim", source_url: "https://stfrancois.com/collections" },
      { name: "Digital Presence", score: 81, weight: 0.15, evidence: "1.2M followers", source_url: "https://instagram.com/staborotorsk" },
      { name: "Brand Story", score: 84, weight: 0.12, evidence: "California optimism" },
      { name: "Price Architecture", score: 80, weight: 0.10, evidence: "Accessible contemporary" },
      { name: "Visual Identity", score: 83, weight: 0.10, evidence: "Colorful, playful" },
      { name: "Product Innovation", score: 79, weight: 0.13, evidence: "Signature bags" },
      { name: "Category Leadership", score: 81, weight: 0.15, evidence: "Rising contemporary" },
      { name: "Sustainability", score: 77, weight: 0.10, evidence: "Developing practices" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 76, weight: 0.20, evidence: "Steady growth" },
      { name: "Social Momentum", score: 79, weight: 0.18, evidence: "Celebrity wearing" },
      { name: "Search Trend", score: 77, weight: 0.15, evidence: "Moderate interest" },
      { name: "PR Momentum", score: 80, weight: 0.12, evidence: "Regular coverage" },
      { name: "Collaboration Activity", score: 78, weight: 0.15, evidence: "Some collabs" },
      { name: "Store Expansion Rate", score: 82, weight: 0.20, evidence: "Selective expansion" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 60, weight: 0.25, evidence: "No signals" },
      { name: "Trademark Filing", score: 58, weight: 0.20, evidence: "No filings" },
      { name: "Regional Partnerships", score: 72, weight: 0.15, evidence: "Wholesale exists" },
      { name: "Logistics Setup", score: 74, weight: 0.15, evidence: "Basic international" },
      { name: "Local Content", score: 55, weight: 0.10, evidence: "No local content" },
      { name: "Competitor Presence", score: 85, weight: 0.15, evidence: "Category opportunity" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 82, weight: 0.50, evidence: "NPS 60" },
      { name: "Brand Equity Value", score: 80, weight: 0.50, evidence: "Growing recognition" }
    ],
    
    signals: []
  },
  
  // 10. Outdoor Voices - DOMESTIC_ONLY, CRS=77
  // MRS = 77 × 1.30 × 1.25 = 125.125 → cap 100
  // FinalScore = (77×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 30.8 + 30 + 6 + 8.1 = 74.9 → 75
  {
    id: "brand-010",
    name: "Outdoor Voices",
    category: "Fashion & Lifestyle",
    subcategory: "Athleisure",
    origin_country: "USA",
    
    crs: 77,
    bis: 79,
    bms: 76,
    mes: 75,
    bes: 78,
    mrs: calculateMRS(77, "DOMESTIC_ONLY"), // = 100 (capped)
    
    temperature: determineTemperature(calculateFinalScore(77, calculateMRS(77, "DOMESTIC_ONLY"), CATEGORY_GAP, CSS)),
    market_presence_status: "DOMESTIC_ONLY",
    pre_market_flag: false, // DOMESTIC_ONLY = no pre-market
    
    compatibility_score: 86,
    pss: 70,
    final_score: calculateFinalScore(77, calculateMRS(77, "DOMESTIC_ONLY"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Recreational athleisure brand. US-focused but international interest growing. Domestic-only brand with high MRS due to untapped market potential.",
    engagement_timing: "Long-term pipeline (2027+)",
    
    bis_pillars: [
      { name: "Product Architecture", score: 80, weight: 0.15, evidence: "Technical recreation", source_url: "https://outdoorvoices.com/collections" },
      { name: "Digital Presence", score: 78, weight: 0.15, evidence: "850K followers", source_url: "https://instagram.com/outdoorvoices" },
      { name: "Brand Story", score: 81, weight: 0.12, evidence: "Doing things philosophy" },
      { name: "Price Architecture", score: 77, weight: 0.10, evidence: "Mid-range athleisure" },
      { name: "Visual Identity", score: 80, weight: 0.10, evidence: "Colorful, approachable" },
      { name: "Product Innovation", score: 76, weight: 0.13, evidence: "Exercise dress viral" },
      { name: "Category Leadership", score: 78, weight: 0.15, evidence: "Recreational niche" },
      { name: "Sustainability", score: 79, weight: 0.10, evidence: "Recycled materials" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 72, weight: 0.20, evidence: "Recovery phase" },
      { name: "Social Momentum", score: 76, weight: 0.18, evidence: "Rebuilding" },
      { name: "Search Trend", score: 74, weight: 0.15, evidence: "Low UAE searches" },
      { name: "PR Momentum", score: 77, weight: 0.12, evidence: "Comeback coverage" },
      { name: "Collaboration Activity", score: 75, weight: 0.15, evidence: "Limited collabs" },
      { name: "Store Expansion Rate", score: 78, weight: 0.20, evidence: "Refocusing retail" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 55, weight: 0.25, evidence: "No signals" },
      { name: "Trademark Filing", score: 52, weight: 0.20, evidence: "No filings" },
      { name: "Regional Partnerships", score: 60, weight: 0.15, evidence: "No partnerships" },
      { name: "Logistics Setup", score: 65, weight: 0.15, evidence: "US only" },
      { name: "Local Content", score: 50, weight: 0.10, evidence: "No international" },
      { name: "Competitor Presence", score: 88, weight: 0.15, evidence: "Market gap" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 79, weight: 0.50, evidence: "NPS 58" },
      { name: "Brand Equity Value", score: 77, weight: 0.50, evidence: "Recovering value" }
    ],
    
    signals: [
      { id: "sig-100", category: "Business", type: "News", description: "New CEO announced, international expansion mentioned", source_url: "https://retaildive.com/outdoor-voices", source_name: "Retail Dive", detected_at: "2026-05-10", strength: "weak" }
    ]
  },
  
  // 11. Sephora - PRESENT, CRS=88
  // MRS = 88 × 0.25 × 1.25 = 27.5 → 28
  // FinalScore = (88×0.40) + (28×0.30) + (30×0.20) + (81×0.10) = 35.2 + 8.4 + 6 + 8.1 = 57.7 → 58
  {
    id: "brand-011",
    name: "Sephora",
    category: "Beauty & Wellness",
    subcategory: "Beauty Retail",
    origin_country: "France",
    
    crs: 88,
    bis: 90,
    bms: 87,
    mes: 86,
    bes: 89,
    mrs: calculateMRS(88, "PRESENT"), // = 28
    
    temperature: determineTemperature(calculateFinalScore(88, calculateMRS(88, "PRESENT"), CATEGORY_GAP, CSS)),
    market_presence_status: "PRESENT",
    pre_market_flag: false, // PRESENT = no pre-market
    
    compatibility_score: 78,
    pss: 60,
    final_score: calculateFinalScore(88, calculateMRS(88, "PRESENT"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Already present in UAE with multiple locations including MOE. Strong brand but limited expansion opportunity for new spaces.",
    engagement_timing: "Existing tenant - renewal discussions only",
    
    bis_pillars: [
      { name: "Product Architecture", score: 91, weight: 0.15, evidence: "Full beauty range", source_url: "https://www.sephora.ae" },
      { name: "Digital Presence", score: 92, weight: 0.15, evidence: "22M followers globally", source_url: "https://instagram.com/sephora" },
      { name: "Brand Story", score: 88, weight: 0.12, evidence: "Beauty authority" },
      { name: "Price Architecture", score: 87, weight: 0.10, evidence: "Multi-tier pricing" },
      { name: "Visual Identity", score: 90, weight: 0.10, evidence: "Black and white iconic" },
      { name: "Product Innovation", score: 89, weight: 0.13, evidence: "Exclusive brands" },
      { name: "Category Leadership", score: 91, weight: 0.15, evidence: "Global beauty leader" },
      { name: "Sustainability", score: 82, weight: 0.10, evidence: "Clean beauty focus" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 85, weight: 0.20, evidence: "Steady growth" },
      { name: "Social Momentum", score: 88, weight: 0.18, evidence: "Strong UAE engagement" },
      { name: "Search Trend", score: 86, weight: 0.15, evidence: "Top beauty searches", source_url: "https://trends.google.com/trends/explore?geo=AE&q=sephora" },
      { name: "PR Momentum", score: 87, weight: 0.12, evidence: "Constant coverage" },
      { name: "Collaboration Activity", score: 88, weight: 0.15, evidence: "Exclusive launches" },
      { name: "Store Expansion Rate", score: 84, weight: 0.20, evidence: "UAE network mature" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 90, weight: 0.25, evidence: "Active hiring", source_url: "https://www.sephora.ae/careers" },
      { name: "Trademark Filing", score: 95, weight: 0.20, evidence: "Full protection", source_url: "https://www.mociuae.gov.ae/trademarks" },
      { name: "Regional Partnerships", score: 92, weight: 0.15, evidence: "Chalhoub partnership" },
      { name: "Logistics Setup", score: 88, weight: 0.15, evidence: "Full MENA setup" },
      { name: "Local Content", score: 85, weight: 0.10, evidence: "Arabic site live" },
      { name: "Competitor Presence", score: 75, weight: 0.15, evidence: "Market leader already" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 90, weight: 0.50, evidence: "NPS 76" },
      { name: "Brand Equity Value", score: 88, weight: 0.50, evidence: "LVMH owned" }
    ],
    
    signals: []
  },
  
  // 12. Bayt Al Saboun - DOMESTIC_ONLY (UAE brand), CRS=74
  // MRS = 74 × 1.30 × 1.25 = 120.25 → cap 100
  // FinalScore = (74×0.40) + (100×0.30) + (30×0.20) + (81×0.10) = 29.6 + 30 + 6 + 8.1 = 73.7 → 74
  {
    id: "brand-012",
    name: "Bayt Al Saboun",
    category: "Beauty & Wellness",
    subcategory: "Natural Beauty",
    origin_country: "UAE",
    
    crs: 74,
    bis: 76,
    bms: 72,
    mes: 73,
    bes: 75,
    mrs: calculateMRS(74, "DOMESTIC_ONLY"), // = 100 (capped)
    
    temperature: determineTemperature(calculateFinalScore(74, calculateMRS(74, "DOMESTIC_ONLY"), CATEGORY_GAP, CSS)),
    market_presence_status: "DOMESTIC_ONLY",
    pre_market_flag: false, // DOMESTIC_ONLY = no pre-market
    
    compatibility_score: 80,
    pss: 72,
    final_score: calculateFinalScore(74, calculateMRS(74, "DOMESTIC_ONLY"), CATEGORY_GAP, CSS),
    category_gap: CATEGORY_GAP,
    
    engagement_note: "Local UAE natural beauty brand. Strong domestic following. Supports local brand initiative. High MRS due to domestic market fit.",
    engagement_timing: "Local brand priority - Q3 2026",
    
    bis_pillars: [
      { name: "Product Architecture", score: 78, weight: 0.15, evidence: "Natural soaps, skincare" },
      { name: "Digital Presence", score: 74, weight: 0.15, evidence: "250K followers" },
      { name: "Brand Story", score: 80, weight: 0.12, evidence: "Traditional Arabian beauty" },
      { name: "Price Architecture", score: 75, weight: 0.10, evidence: "Accessible natural" },
      { name: "Visual Identity", score: 77, weight: 0.10, evidence: "Arabian heritage aesthetic" },
      { name: "Product Innovation", score: 73, weight: 0.13, evidence: "Traditional recipes" },
      { name: "Category Leadership", score: 76, weight: 0.15, evidence: "Local leader" },
      { name: "Sustainability", score: 82, weight: 0.10, evidence: "Natural ingredients" }
    ],
    bms_pillars: [
      { name: "Revenue Growth", score: 70, weight: 0.20, evidence: "Steady local growth" },
      { name: "Social Momentum", score: 72, weight: 0.18, evidence: "Local engagement" },
      { name: "Search Trend", score: 71, weight: 0.15, evidence: "UAE searches stable" },
      { name: "PR Momentum", score: 73, weight: 0.12, evidence: "Local press" },
      { name: "Collaboration Activity", score: 70, weight: 0.15, evidence: "Local collabs" },
      { name: "Store Expansion Rate", score: 75, weight: 0.20, evidence: "Expanding locally" }
    ],
    mes_pillars: [
      { name: "GCC Hiring Activity", score: 78, weight: 0.25, evidence: "Local hiring" },
      { name: "Trademark Filing", score: 85, weight: 0.20, evidence: "UAE registered" },
      { name: "Regional Partnerships", score: 72, weight: 0.15, evidence: "Local partners" },
      { name: "Logistics Setup", score: 80, weight: 0.15, evidence: "UAE based" },
      { name: "Local Content", score: 90, weight: 0.10, evidence: "Arabic first" },
      { name: "Competitor Presence", score: 75, weight: 0.15, evidence: "Niche position" }
    ],
    bes_pillars: [
      { name: "Brand Equity Perception", score: 76, weight: 0.50, evidence: "NPS 55" },
      { name: "Brand Equity Value", score: 74, weight: 0.50, evidence: "Local brand value" }
    ],
    
    signals: []
  }
];
