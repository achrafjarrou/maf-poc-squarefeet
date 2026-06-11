# MAF POC - QUICK REFERENCE FOR COPILOT

## Files to Share with Copilot

### 1. DESIGN SPECIFICATION
- File: `MAF_DESIGN_COMPLETE.md` (595 lines)
- Contains: Complete UI structure, every component, all styling, interactions
- Use for: Understanding exact visual design

### 2. COPILOT INTEGRATION PROMPT
- File: `COPILOT_PROMPT.md` (397 lines)
- Contains: Step-by-step integration guide with code examples
- Use for: Connecting UI to backend API

### 3. QUICK REFERENCE (this file)
- Quick snippets and key information

---

## Key Commands

### Start Dev Server
```bash
npm run dev
```
Visit: http://localhost:3000

### Build for Production
```bash
npm run build
npm start
```

### TypeScript Check
```bash
npm run type-check
```

---

## Project Structure

```
/app
  ├── page.tsx          (Main UI - 1317 lines)
  ├── layout.tsx        (Root layout)
  └── globals.css       (Tailwind styles)

/lib
  ├── mock-data.ts      (10 brands data)
  ├── api-client.ts     (API calls - TO MODIFY)
  ├── types/
  │   └── brand.ts      (TypeScript interfaces)
  └── utils.ts          (Helper functions)

/components
  └── ui/               (shadcn components)

/public
  └── logo-maf-official.png

/node_modules
package.json
tsconfig.json
tailwind.config.ts
next.config.mjs
```

---

## 10 Brands in System

1. **Zara** - Fashion, Spain, PRESENT
2. **Swarovski** - Jewellery, Austria, PRESENT
3. **Lush** - Beauty, UK, PRESENT
4. **Intimissimi** - Fashion, Italy, PRESENT
5. **Kiko Milano** - Beauty, Italy, PRESENT
6. **Byredo** - Fragrance, Sweden, REGIONAL (HOT)
7. **Rituals** - Beauty, Netherlands, REGIONAL
8. **Aritzia** - Fashion, Canada, INTERNATIONAL
9. **Kayali** - Fragrance, UAE, DOMESTIC_ONLY (HOT - GOLD)
10. **Phlur** - Fragrance, USA, DOMESTIC_ONLY

---

## Main UI Components

### 1. Header
- Logo: MAF official
- Title: "Top 10 Brand Prospects"
- Search bar (real-time filtering)

### 2. Left Sidebar (Brand Cards)
- 10 cards, one per brand
- Shows: Rank, Name, Temperature badge, Category, Scores
- Click to select
- Selected: Border amber-600, bg-amber-50

### 3. Right Panel (Brand Details)
- Brand name + Final Score
- Metadata: Category, Origin, Status
- 4 score cards: CRS, MRS, CAT GAP, CSS
- 3 tabs: Overview, Pillars, Signals

### 4. Footer
- MAF logo
- Copyright text

---

## Color System

### Text Colors
- Primary: `text-gray-900`
- Secondary: `text-gray-600`
- Tertiary: `text-gray-500`
- Gold: `text-amber-700`
- Green (Score ≥85): `text-green-600`
- Amber (Score 70-84): `text-amber-600`
- Red (Score <70): `text-red-600`

### Background Colors
- Base: `bg-white`
- Hover: `bg-gray-50`
- Selected: `bg-amber-50`
- Temperature: HOT=red, WARM=amber, WATCH=blue, COLD=slate

### Borders
- Default: `border-gray-200`
- Focus: `border-amber-600`
- All borders: 1px

---

## Scoring System

### Main Scores (0-100)
- **CRS**: Composite Readiness Score
- **BIS**: Brand Intelligence Score
- **BMS**: Brand Momentum Score
- **MES**: Market Expansion Score
- **BES**: Brand Equity Score
- **MRS**: Market Readiness Score (0-110 capped)

### Derived Scores
- **CSS**: Category Satisfaction Score
- **Final Score**: Calculated from above
- **Compatibility**: Brand fit percentage

### Color Coding
- Green: ≥85 (Excellent)
- Amber: 70-84 (Good)
- Red: <70 (Needs attention)

---

## Temperature Badges

| Status | Color | Icon | Meaning |
|--------|-------|------|---------|
| HOT | Red | Flame | Priority outreach |
| WARM | Amber | Thermometer | Active opportunity |
| WATCH | Blue | Clock | Monitor situation |
| COLD | Slate | Snowflake | Low priority |

---

## Data Flow

```
App loads
  ↓
useEffect triggers
  ↓
Fetch /api/brands (or mock data)
  ↓
setBrands() + setFilteredBrands()
  ↓
setSelectedBrand() = brands[0]
  ↓
Render list + details
  ↓
User searches
  ↓
filterBrands(searchTerm)
  ↓
Update list
  ↓
User clicks card
  ↓
setSelectedBrand(brand)
  ↓
Update right panel
```

---

## API Integration Points

### Current (Mock)
```typescript
import { mockBrands } from "@/lib/mock-data";
```

### After Integration
```typescript
import { getBrands, searchBrands } from "@/lib/api-client";
```

### Required Endpoints
```
GET /api/brands
GET /api/brands/{id}
GET /api/brands/search?q={query}
```

### Response Format
```json
{
  "data": [{ /* brand object */ }],
  "total": 10,
  "page": 1
}
```

---

## Environment Variables

```
NEXT_PUBLIC_API_URL=https://your-backend.com/api
NEXT_PUBLIC_AUTH_TOKEN=your-token-here
NODE_ENV=production
```

---

## Deployment Checklist

Before deploying to Vercel:

- [ ] All API endpoints working
- [ ] Environment variables set in Vercel
- [ ] CORS headers configured
- [ ] Authentication working
- [ ] All 10 brands in database
- [ ] Search working
- [ ] Error handling tested
- [ ] Loading states working
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors
- [ ] No console warnings/errors
- [ ] Production build tested locally

---

## Common Issues & Fixes

### Issue: API not returning data
**Fix**: Check API_BASE URL, authentication headers, CORS

### Issue: Search not working
**Fix**: Verify search endpoint, check query parameter

### Issue: Brands not loading
**Fix**: Check network tab, verify API response format matches type definitions

### Issue: Styling broken
**Fix**: Ensure Tailwind classes are correct, check tailwind.config.ts

### Issue: TypeScript errors
**Fix**: Run `npm run type-check`, update types in /lib/types/brand.ts

---

## Useful Tailwind Classes (Already Used)

Flexbox:
- `flex`, `flex-col`, `flex-1`, `items-center`, `justify-between`

Spacing:
- `px-6`, `py-4`, `p-4`, `p-8`, `gap-3`, `gap-4`, `mb-3`, `mb-4`

Layout:
- `w-96`, `w-64`, `h-screen`, `h-16`, `overflow-y-auto`, `max-w-4xl`

Typography:
- `text-xs`, `text-sm`, `text-lg`, `text-2xl`, `text-4xl`, `font-bold`

Colors:
- `text-gray-900`, `bg-white`, `border-gray-200`, `text-amber-700`

Effects:
- `rounded-lg`, `border-2`, `shadow-md`, `transition-all`, `hover:*`

---

## Key React Hooks Used

```typescript
useState()           // Component state
useEffect()         // Side effects, data fetching
useRef()            // DOM references
cn()               // Tailwind className helper
getScoreColor()    // Score-based color logic
```

---

## Next Steps

1. **Get the 2 documents**: 
   - `MAF_DESIGN_COMPLETE.md`
   - `COPILOT_PROMPT.md`

2. **Prepare backend details**:
   - API domain/URL
   - Authentication method
   - Database schema
   - Any custom fields

3. **Copy prompt to Copilot**:
   - Follow step-by-step guide
   - Implement each part
   - Test as you go

4. **Deploy to Vercel**:
   - Set environment variables
   - Run production build
   - Test all features
   - Monitor logs

---

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind Docs: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev

