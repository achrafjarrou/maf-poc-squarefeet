# MAF PROSPECT INTELLIGENCE - COPILOT INTEGRATION PROMPT

## FOR CONNECTING UI WITH BACKEND & INFRASTRUCTURE

Copy this exact prompt to Copilot/ChatGPT to integrate the MAF UI design with your backend and infrastructure:

---

## COMPLETE PROMPT FOR COPILOT

```
You are a React/Next.js expert. Your task is to integrate this exact UI design 
with backend API endpoints and infrastructure.

## EXISTING UI DESIGN
The application has been built with a complete light-mode UI design in Next.js 16.
Reference the complete design specification in: MAF_DESIGN_COMPLETE.md

## UI STRUCTURE (READ-ONLY - DO NOT CHANGE)
- File: /app/page.tsx (1317 lines)
- Framework: Next.js 16 with React 19
- Styling: Tailwind CSS v4 + shadcn/ui
- Icons: lucide-react
- State: useState/useEffect
- Data: Currently using /lib/mock-data.ts

## YOUR TASK: Connect to Backend

### Part 1: Replace Mock Data with API Calls

File: /lib/api-client.ts
```typescript
// Replace with your actual backend URLs

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.com/api';

export async function getBrands() {
  const response = await fetch(`${API_BASE}/brands`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  return response.json();
}

export async function getBrandById(id: string) {
  const response = await fetch(`${API_BASE}/brands/${id}`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  return response.json();
}

export async function searchBrands(query: string) {
  const response = await fetch(`${API_BASE}/brands/search?q=${query}`, {
    headers: { 'Authorization': `Bearer ${getAuthToken()}` }
  });
  return response.json();
}
```

### Part 2: Update page.tsx to Call Backend

Replace line in page.tsx where mock data is used:
```typescript
// OLD: import { mockBrands } from "@/lib/mock-data";
// NEW: import { getBrands, searchBrands } from "@/lib/api-client";

// In useEffect hook:
const loadBrands = async () => {
  try {
    const data = await getBrands();
    setBrands(data);
    setFilteredBrands(data);
    setSelectedBrand(data[0]);
  } catch (error) {
    console.error('Error fetching brands:', error);
    // Fallback to mock data if API fails
  }
};
```

### Part 3: Environment Variables

Create .env.local:
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
NEXT_PUBLIC_AUTH_TOKEN=your-bearer-token-here
```

Or add to Vercel project settings under Environment Variables.

### Part 4: Authentication (if needed)

Add auth interceptor to API client:
```typescript
function getAuthToken() {
  // Return from localStorage, cookies, or environment
  return process.env.NEXT_PUBLIC_AUTH_TOKEN || '';
}

// Add to all fetch calls in headers
headers: {
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
}
```

### Part 5: Expected API Response Format

Your backend must return this exact JSON structure:

```json
{
  "data": [
    {
      "id": "brand-001",
      "name": "Brand Name",
      "category": "Category",
      "subcategory": "Subcategory",
      "origin_country": "Country",
      "market_presence_status": "PRESENT|REGIONAL|INTERNATIONAL|DOMESTIC_ONLY",
      "crs": 86,
      "bis": 88,
      "bms": 90,
      "mes": 85,
      "bes": 87,
      "mrs": 53,
      "category_gap": 0,
      "css": 85,
      "final_score": 85,
      "compatibility_score": 92,
      "pss": 88,
      "temperature": "HOT|WARM|WATCH|COLD",
      "pre_market_flag": false,
      "engagement_note": "Text here",
      "engagement_timing": "Text here",
      "bis_pillars": [
        {
          "name": "Pillar Name",
          "score": 88,
          "weight": 0.15,
          "evidence": "Evidence text",
          "source_url": "https://..."
        }
      ],
      "bms_pillars": [...],
      "mes_pillars": [...],
      "bes_pillars": [...],
      "signals": [
        {
          "id": "sig-001",
          "category": "Category",
          "type": "Type",
          "description": "Description",
          "source_url": "https://...",
          "source_name": "Source",
          "detected_at": "2026-05-20",
          "strength": "strong|moderate|weak"
        }
      ]
    }
  ],
  "total": 10,
  "page": 1
}
```

### Part 6: Search Functionality Integration

```typescript
const handleSearch = async (term: string) => {
  setSearchTerm(term);
  
  if (!term.trim()) {
    setFilteredBrands(brands);
  } else {
    try {
      const results = await searchBrands(term);
      setFilteredBrands(results);
    } catch (error) {
      console.error('Search error:', error);
    }
  }
};
```

### Part 7: Error Handling

Add error state and UI:
```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const loadBrands = async () => {
  try {
    setIsLoading(true);
    setError(null);
    const data = await getBrands();
    setBrands(data);
  } catch (error) {
    setError('Failed to load brands. Please try again.');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

// In render:
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
    {error}
  </div>
)}
```

### Part 8: Caching Strategy

Use React Query or SWR:
```typescript
import useSWR from 'swr';

export function useBrands() {
  const { data, error, isLoading } = useSWR('/brands', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1 minute cache
  });
  
  return { brands: data || [], isLoading, error };
}
```

### Part 9: Pagination (if needed)

```typescript
const [page, setPage] = useState(1);
const pageSize = 10;

const loadBrands = async () => {
  const data = await fetch(
    \`\${API_BASE}/brands?page=\${page}&limit=\${pageSize}\`
  );
  return data.json();
};
```

### Part 10: TypeScript Types

File: /lib/types/brand.ts
```typescript
export interface BrandProfile {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  origin_country: string;
  market_presence_status: 'DOMESTIC_ONLY' | 'REGIONAL' | 'INTERNATIONAL' | 'PRESENT';
  crs: number;
  bis: number;
  bms: number;
  mes: number;
  bes: number;
  mrs: number;
  category_gap: number;
  css: number;
  final_score: number;
  compatibility_score: number;
  pss: number;
  temperature: 'HOT' | 'WARM' | 'WATCH' | 'COLD';
  pre_market_flag: boolean;
  engagement_note: string;
  engagement_timing: string;
  bis_pillars: ScorePillar[];
  bms_pillars: ScorePillar[];
  mes_pillars: ScorePillar[];
  bes_pillars: ScorePillar[];
  signals: Signal[];
}

export interface ScorePillar {
  name: string;
  score: number;
  weight: number;
  evidence: string;
  source_url?: string;
}

export interface Signal {
  id: string;
  category: string;
  type: string;
  description: string;
  source_url: string;
  source_name: string;
  detected_at: string;
  strength: 'strong' | 'moderate' | 'weak';
}
```

## INFRASTRUCTURE SETUP

### Database
- Ensure 10 brands are in database with all fields
- Ensure indexes on: name, category, market_presence_status
- Ensure full-text search configured

### API Endpoints
```
GET /api/brands           - List all brands
GET /api/brands/{id}      - Get specific brand
GET /api/brands/search    - Search brands by query
```

### Authentication
- Add JWT token validation if needed
- Use Authorization: Bearer header

### CORS
- Allow frontend domain
- Allow GET requests
- Allow OPTIONS for preflight

## DEPLOYMENT
1. Update NEXT_PUBLIC_API_URL in Vercel environment
2. Deploy to Vercel
3. Test all API calls in production
4. Monitor error logs

## TESTING CHECKLIST
✓ Load all 10 brands on initial page load
✓ Search filters brands correctly
✓ Click brand updates right panel
✓ All scores display correctly
✓ Pillars and signals load
✓ Source links work
✓ No console errors
✓ Loading states show
✓ Error states display properly
✓ Mobile responsive

DO NOT CHANGE:
- Layout structure (2-column design)
- Color scheme (light mode)
- Component styling
- Header and footer
- Logo and branding
- Typography and spacing
- Existing UI behavior

ONLY MODIFY:
- api-client.ts
- Data fetching logic
- Environment variables
- TypeScript types (if needed)
- Error handling
- Loading states
```

---

## HOW TO USE THIS PROMPT

1. Copy the text between the ``` markers above
2. Paste into ChatGPT / Copilot
3. Add your specific backend details:
   - Your API domain/URL
   - Authentication method
   - Database structure
   - Any custom fields or logic
4. Follow the generated code
5. Test each part as you integrate

---

## FILES TO PROVIDE TO BACKEND TEAM

1. `MAF_DESIGN_COMPLETE.md` - Full UI specification
2. `COPILOT_PROMPT.md` - This integration guide
3. `/app/page.tsx` - Current UI implementation
4. `/lib/mock-data.ts` - Data structure reference

---

## QUICK CHECKLIST

Before deployment:
- ✓ Backend APIs returning correct JSON format
- ✓ Environment variables configured
- ✓ CORS headers set
- ✓ Authentication working
- ✓ All 10 brands in database
- ✓ Search working
- ✓ Error handling tested
- ✓ Loading states working
- ✓ Production build passes
- ✓ No console errors

