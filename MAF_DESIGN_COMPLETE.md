# MAF PROSPECT INTELLIGENCE - COMPLETE DESIGN SPECIFICATION

## EXACT DESIGN REPLICA FOR COPILOT INTEGRATION

---

## 1. LAYOUT STRUCTURE

### Root Container
```
<div className="flex flex-col h-screen bg-white">
  - HEADER
  - MAIN CONTENT (2-column layout)
    - LEFT SIDEBAR (Brand List)
    - RIGHT PANEL (Brand Details)
  - FOOTER
</div>
```

### Color Scheme
- Background: `bg-white`
- Text Primary: `text-gray-900`
- Text Secondary: `text-gray-600`
- Borders: `border-gray-200`
- Hover: `bg-gray-50`
- MAF Gold: `#d4a574` or `text-amber-700`

---

## 2. HEADER SECTION

### HTML Structure
```jsx
<header className="border-b border-gray-200 bg-white sticky top-0 z-50">
  <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between h-16 px-6">
      
      {/* LEFT: Logo + Title */}
      <div className="flex items-center gap-3">
        <img 
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/majid-al-futtaim-seeklogo-U91GuC9IEpYjfxu6VAGMy9yMhrQOUr.png"
          alt="Majid Al Futtaim"
          className="h-12 w-auto"
        />
        <span className="text-gray-300">|</span>
        <h1 className="text-sm font-semibold text-gray-700">
          Top 10 Brand Prospects
        </h1>
      </div>

      {/* RIGHT: Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search brands..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>
    </div>
  </div>
</header>
```

### Styling Details
- Height: `h-16` (64px)
- Sticky positioning: `sticky top-0 z-50`
- Border bottom: `border-b border-gray-200`
- Padding: `px-6` horizontal, centered with `mx-auto max-w-7xl`

---

## 3. MAIN CONTENT AREA

### Two-Column Layout
```jsx
<main className="flex flex-1 overflow-hidden">
  {/* LEFT SIDEBAR - Brand List */}
  <aside className="w-96 border-r border-gray-200 overflow-y-auto bg-white">
    {/* Brand Cards */}
  </aside>

  {/* RIGHT PANEL - Brand Details */}
  <article className="flex-1 overflow-y-auto bg-white">
    {/* Detail View */}
  </article>
</main>
```

### Proportions
- Left sidebar: Fixed `w-96` (384px)
- Right panel: Flexible `flex-1`
- Divider: `border-r border-gray-200`

---

## 4. LEFT SIDEBAR - BRAND CARDS LIST

### Card Container
```jsx
<div className="p-6 space-y-4">
  {/* Each brand card */}
</div>
```

### Individual Brand Card
```jsx
<div className={cn(
  "p-4 cursor-pointer rounded-lg border-2 transition-all",
  isSelected 
    ? "border-amber-600 bg-amber-50 shadow-md" 
    : "border-gray-200 hover:border-amber-300"
)}>
  
  {/* Rank + Temperature Badge */}
  <div className="flex justify-between items-start mb-3">
    <span className="text-2xl font-bold text-amber-700">#{rank}</span>
    <TemperatureBadge temperature={brand.temperature} />
  </div>

  {/* Brand Name + Category */}
  <h3 className="text-lg font-bold text-gray-900 mb-1">
    {brand.name}
  </h3>
  <p className="text-sm text-gray-600 mb-1">
    {brand.category} • {brand.origin_country}
  </p>
  <p className="text-xs text-gray-500 mb-4">
    {brand.market_presence_status}
  </p>

  {/* Score Grid */}
  <div className="grid grid-cols-2 gap-3 mb-4">
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <div className="text-xs text-gray-500 font-semibold">CRS</div>
      <div className={cn("text-sm font-bold font-mono", getScoreColorClass(brand.crs))}>
        {brand.crs}
      </div>
    </div>
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <div className="text-xs text-gray-500 font-semibold">MRS</div>
      <div className={cn("text-sm font-bold font-mono", getScoreColorClass(brand.mrs))}>
        {brand.mrs}
      </div>
    </div>
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <div className="text-xs text-gray-500 font-semibold">COMPAT%</div>
      <div className={cn("text-sm font-bold font-mono", getScoreColorClass(brand.compatibility_score))}>
        {brand.compatibility_score}
      </div>
    </div>
    <div className="bg-gray-50 p-3 rounded-lg text-center">
      <div className="text-xs text-gray-500 font-semibold">FINAL</div>
      <div className={cn("text-sm font-bold font-mono", getScoreColorClass(brand.final_score))}>
        {brand.final_score}
      </div>
    </div>
  </div>

  {/* Pre-Market Badge (if applicable) */}
  {brand.pre_market_flag && (
    <div className="bg-orange-100 border border-orange-300 rounded px-3 py-2 text-center">
      <span className="text-orange-700 font-semibold text-xs flex items-center justify-center gap-1">
        🔥 Pre-Market
      </span>
    </div>
  )}
</div>
```

### Score Color Classes
```
Score >= 85: text-green-600 (Green)
Score 70-84: text-amber-600 (Amber)
Score < 70: text-red-600 (Red)
```

### Temperature Badge Variants
```jsx
HOT:   bg-red-100 text-red-700 border-red-200   + Flame icon
WARM:  bg-amber-100 text-amber-700 border-amber-200 + Thermometer icon
WATCH: bg-blue-100 text-blue-700 border-blue-200 + Clock icon
COLD:  bg-slate-100 text-slate-600 border-slate-200 + Snowflake icon
```

---

## 5. RIGHT PANEL - BRAND DETAILS

### Detail Panel Container
```jsx
<div className="p-8 max-w-4xl">
  {/* Content sections */}
</div>
```

### Section 1: Header with Score
```jsx
<div className="mb-8">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h2 className="text-4xl font-bold text-gray-900">
        {brand.name}
      </h2>
      <TemperatureBadge temperature={brand.temperature} className="mt-3" />
    </div>
    <div className="text-right">
      <div className={cn("text-6xl font-bold font-mono", getScoreColorClass(brand.final_score))}>
        {brand.final_score}
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
        FINAL SCORE
      </div>
    </div>
  </div>

  {/* Metadata Grid */}
  <div className="space-y-2 text-sm mt-6">
    <div className="grid grid-cols-2 gap-8">
      <div>
        <span className="text-gray-500 text-xs">CATEGORY</span>
        <div className="font-bold text-gray-900">{brand.category}</div>
      </div>
      <div>
        <span className="text-gray-500 text-xs">SUBCATEGORY</span>
        <div className="font-bold text-gray-900">{brand.subcategory}</div>
      </div>
      <div>
        <span className="text-gray-500 text-xs">ORIGIN</span>
        <div className="font-bold text-gray-900">{brand.origin_country}</div>
      </div>
      <div>
        <span className="text-gray-500 text-xs">MARKET STATUS</span>
        <div className="font-bold text-gray-900">{brand.market_presence_status}</div>
      </div>
    </div>
  </div>
</div>
```

### Section 2: Score Cards Grid
```jsx
<div className="grid grid-cols-2 gap-4 mb-8">
  {scores.map(item => (
    <div key={item.label} className="bg-gray-50 rounded-lg p-6 text-center">
      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">
        {item.label}
      </div>
      <div className={cn("text-4xl font-bold font-mono", getScoreColorClass(item.value))}>
        {item.value}
      </div>
    </div>
  ))}
</div>
```

Score Items:
- CRS (Composite Readiness Score)
- MRS (Market Readiness Score)
- CAT GAP (Category Gap)
- CSS (Category Satisfaction Score)

### Section 3: Tabbed Content
```jsx
<div className="border-t border-gray-200">
  <Tabs defaultValue="overview">
    <TabsList className="bg-transparent border-b border-gray-200 rounded-none w-full justify-start gap-8 p-0">
      <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600">
        Overview
      </TabsTrigger>
      <TabsTrigger value="pillars" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600">
        Pillars ({brand.bis_pillars.length})
      </TabsTrigger>
      <TabsTrigger value="signals" className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600">
        Signals ({brand.signals.length})
      </TabsTrigger>
    </TabsList>

    <div className="pt-6 pb-8">
      {/* Tab Content */}
    </div>
  </Tabs>
</div>
```

### Tab 1: Overview
```jsx
<p className="text-sm text-gray-600 mb-6">
  {brand.engagement_note}
</p>

<div className="grid grid-cols-3 gap-4">
  {brand.bis_pillars.map(pillar => (
    <div key={pillar.name} className="bg-gray-50 p-4 rounded-lg">
      <div className="text-xs text-gray-500 font-semibold mb-2 line-clamp-2">
        {pillar.name}
      </div>
      <div className={cn("text-3xl font-bold font-mono", getScoreColorClass(pillar.score))}>
        {pillar.score}
      </div>
    </div>
  ))}
</div>
```

### Tab 2: Pillars
```jsx
{brand.bis_pillars.map(pillar => (
  <div key={pillar.name} className="pb-6 border-b border-gray-200">
    <div className="flex justify-between items-start mb-2">
      <div className="flex-1 pr-4">
        <h4 className="font-semibold text-gray-900 mb-1">{pillar.name}</h4>
        <p className="text-sm text-gray-600">{pillar.description}</p>
      </div>
      <div className={cn("text-2xl font-bold font-mono whitespace-nowrap", getScoreColorClass(pillar.score))}>
        {pillar.score}
      </div>
    </div>
    
    {/* Progress Bar */}
    <div className="mb-3">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={cn("h-2 rounded-full", getScoreBgClass(pillar.score))}
          style={{ width: `${pillar.score}%` }}
        />
      </div>
    </div>
    
    {pillar.source_url && (
      <a href={pillar.source_url} target="_blank" 
         className="text-xs text-amber-700 hover:underline inline-flex items-center gap-1">
        View Source →
      </a>
    )}
  </div>
))}
```

### Tab 3: Signals
```jsx
{brand.signals.map(signal => (
  <div key={signal.id} className="p-4 bg-gray-50 rounded-lg mb-4">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold text-gray-900 flex-1">{signal.title}</h4>
      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
        {signal.detected_at}
      </span>
    </div>
    
    <div className="mb-3">
      <span className="inline-block bg-white border border-gray-200 text-xs px-2 py-1 rounded">
        {signal.type}
      </span>
    </div>
    
    <a href={signal.source_url} target="_blank"
       className="text-xs text-amber-700 hover:underline inline-flex items-center gap-1">
      {signal.source_name} →
    </a>
  </div>
))}
```

---

## 6. FOOTER SECTION

```jsx
<footer className="border-t border-gray-200 bg-white py-6 text-center">
  <div className="flex items-center justify-center gap-3 mb-3">
    <img 
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/majid-al-futtaim-seeklogo-U91GuC9IEpYjfxu6VAGMy9yMhrQOUr.png"
      alt="Majid Al Futtaim"
      className="h-8 w-auto"
    />
  </div>
  <p className="text-sm text-gray-600">
    © 2026 MAF Prospect Intelligence. All rights reserved.
  </p>
</footer>
```

---

## 7. DATA STRUCTURE & PROPERTIES

### Brand Object Structure
```typescript
{
  id: string
  name: string
  category: string
  subcategory: string
  origin_country: string
  market_presence_status: 'DOMESTIC_ONLY' | 'REGIONAL' | 'INTERNATIONAL' | 'PRESENT'
  
  // Main Scores
  crs: number                    // Composite Readiness Score
  bis: number                    // Brand Intelligence Score
  bms: number                    // Brand Momentum Score
  mes: number                    // Market Expansion Score
  bes: number                    // Brand Equity Score
  mrs: number                    // Market Readiness Score
  
  // Derived Scores
  category_gap: number
  css: number                    // Category Satisfaction Score
  final_score: number
  compatibility_score: number
  pss: number                    // Proprietary Satisfaction Score
  
  // Status
  temperature: 'HOT' | 'WARM' | 'WATCH' | 'COLD'
  pre_market_flag: boolean
  
  // Content
  engagement_note: string
  engagement_timing: string
  
  // Pillars (score breakdowns)
  bis_pillars: ScorePillar[]
  bms_pillars: ScorePillar[]
  mes_pillars: ScorePillar[]
  bes_pillars: ScorePillar[]
  
  // Market Signals
  signals: Signal[]
}

// Pillar Object
{
  name: string
  score: number
  weight: number
  evidence: string
  source_url?: string
}

// Signal Object
{
  id: string
  category: string
  type: string
  description: string
  source_url: string
  source_name: string
  detected_at: string
  strength: 'strong' | 'moderate' | 'weak'
}
```

---

## 8. INTERACTIONS & BEHAVIOR

### Brand Card Selection
- Click card → Select brand
- Visual feedback: Border becomes `border-amber-600`, background becomes `bg-amber-50`
- Right panel updates with brand details
- Smooth transitions

### Search Functionality
- Real-time filtering as user types
- Filters by: name, category, origin_country
- Updates brand list instantly

### Tab Navigation
- Click tab → Switch content view
- Smooth content transition
- Active tab shows `border-amber-600` bottom border

### Hover States
- Brand cards: `hover:border-amber-300`
- Links: `hover:underline`
- Buttons: opacity/color changes

---

## 9. RESPONSIVE DESIGN

### Desktop (Default)
- Header: Full width with logo + search
- Main: 2-column (384px sidebar + flex right panel)
- Typography: Full sizes

### Tablet (md breakpoint)
- Similar to desktop
- Sidebar may collapse to icons-only

### Mobile
- Should stack vertically
- Full-width cards
- Search bar takes full width

---

## 10. COMPLETE DATA SET - 10 BRANDS

All 10 brands stored in `/lib/mock-data.ts` with complete scoring data.

### Brand IDs
1. brand-001: Zara
2. brand-002: Swarovski
3. brand-003: Lush
4. brand-004: Intimissimi
5. brand-005: Kiko Milano
6. brand-006: Byredo
7. brand-007: Rituals
8. brand-008: Aritzia
9. brand-009: Kayali
10. brand-010: Phlur

---

## 11. TAILWIND/CSS CLASSES USED

### Spacing
- `px-6`, `py-4`, `p-4`, `p-8`, `gap-3`, `gap-4`, `gap-8`, `mb-3`, `mb-4`, `mb-8`, `space-y-2`, `space-y-4`

### Layout
- `flex`, `flex-col`, `flex-1`, `w-96`, `h-screen`, `h-16`, `max-w-4xl`, `max-w-7xl`, `mx-auto`, `overflow-hidden`, `overflow-y-auto`

### Colors
- Text: `text-gray-900`, `text-gray-600`, `text-gray-500`, `text-green-600`, `text-amber-600`, `text-red-600`, `text-amber-700`
- Background: `bg-white`, `bg-gray-50`, `bg-amber-50`, `bg-red-100`, `bg-amber-100`
- Border: `border-gray-200`, `border-amber-600`, `border-red-200`, `border-amber-200`

### Typography
- Font size: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-2xl`, `text-3xl`, `text-4xl`, `text-6xl`
- Font weight: `font-bold`, `font-semibold`, `font-medium`
- Special: `font-mono` (for scores), `uppercase`, `tracking-wider`, `line-clamp-2`

### Borders & Shadows
- `border-b`, `border-r`, `border-l`, `border-2`, `rounded-lg`, `rounded-full`, `shadow-md`

### Effects
- `transition-all`, `transition-colors`, `duration-500`, `hover:*`, `data-[state=active]:*`

---

## 12. API INTEGRATION POINTS

### Data Fetching
- GET `/api/brands` - Fetch all brands
- GET `/api/brands/{id}` - Fetch brand details

### Currently Using Mock Data
- `/lib/mock-data.ts` - All brand data
- Replace with backend API calls

### State Management
- useState for: selectedBrand, searchTerm, filteredBrands
- Consider: useContext or React Query for complex state

---

## 13. FONTS & TYPOGRAPHY

- Font Family: System fonts (DM Sans in layout.tsx)
- Heading: `font-bold`, sizes up to `text-6xl`
- Body: `text-sm`, `text-base`
- Monospace: `font-mono` for scores

---

## 14. DEPLOYMENT METADATA

- Title: "MAF Prospect Intelligence | Majid Al Futtaim"
- Description: "Top 10 Brand Prospects Intelligence Platform - Majid Al Futtaim"
- Theme: Light mode (white background)
- No v0 or Vercel branding visible

---

## 15. KEY CHARACTERISTICS

✓ Clean, minimal light design
✓ Professional enterprise styling
✓ Color-coded scoring system (green/amber/red)
✓ Two-column layout with sticky header
✓ Tabbed detail view
✓ Responsive card-based brand list
✓ Real-time search
✓ Temperature-based status badges
✓ Progress bars and score rings
✓ Complete intelligence data with signals
✓ Source attribution and external links
✓ Smooth transitions and hover effects

