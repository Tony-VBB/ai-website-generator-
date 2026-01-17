# Three-Stage LLM Pipeline Visualization

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INPUT                                  │
│   "Create a portfolio website for a photographer"                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    STAGE 1: ANALYSIS LLM                            │
│                   (Groq Llama 3.1 70B)                              │
│                                                                      │
│  System Prompt: "Analyze what's missing, what's vague,              │
│                  what could be enhanced..."                         │
│                                                                      │
│  Output Example:                                                    │
│  ┌────────────────────────────────────────────────────────┐        │
│  │ MISSING: Color scheme, navigation, gallery layout       │        │
│  │ VAGUE: Photography style, target audience               │        │
│  │ ENHANCE: Dark theme, hero section, animations           │        │
│  │ DIRECTION: Sophisticated, minimal, professional         │        │
│  └────────────────────────────────────────────────────────┘        │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  STAGE 2: ENHANCEMENT LLM                           │
│                   (Groq Llama 3.1 70B)                              │
│                                                                      │
│  Input: Original Prompt + Analysis                                  │
│                                                                      │
│  System Prompt: "Create comprehensive specification                │
│                  addressing all analysis points..."                 │
│                                                                      │
│  Output Example:                                                    │
│  ┌────────────────────────────────────────────────────────┐        │
│  │ Create a modern portfolio website for a professional   │        │
│  │ photographer. Use dark theme (#1a1a1a background) with │        │
│  │ white text. Include full-screen hero with carousel,    │        │
│  │ masonry gallery (3 cols desktop, 2 tablet, 1 mobile)   │        │
│  │ with hover zoom, About section, contact form with      │        │
│  │ name/email/details fields, fixed nav, serif headings,  │        │
│  │ sans-serif body, fade-in animations, social icons...   │        │
│  └────────────────────────────────────────────────────────┘        │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 STAGE 3: GENERATION LLM                             │
│          (User's Choice: Groq/OpenAI/HuggingFace)                   │
│                                                                      │
│  Input: Enhanced Prompt                                             │
│                                                                      │
│  System Prompt: "Generate complete production-ready HTML/CSS/JS..." │
│                                                                      │
│  Output: Complete Website Code                                      │
│  ┌────────────────────────────────────────────────────────┐        │
│  │ <!DOCTYPE html>                                         │        │
│  │ <html lang="en">                                        │        │
│  │ <head>                                                  │        │
│  │   <meta charset="UTF-8">                                │        │
│  │   <title>Photographer Portfolio</title>                │        │
│  │   <style>                                               │        │
│  │     body { background: #1a1a1a; color: #fff; ... }      │        │
│  │     .hero { height: 100vh; ... }                        │        │
│  │     .gallery { display: grid; ... }                     │        │
│  │   </style>                                              │        │
│  │ </head>                                                 │        │
│  │ <body>...</body>                                        │        │
│  │ </html>                                                 │        │
│  └────────────────────────────────────────────────────────┘        │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      RESPONSE TO USER                               │
│                                                                      │
│  🟣 Analysis Box       (Shows Stage 1 output)                       │
│  🔵 Enhanced Prompt Box (Shows Stage 2 output)                      │
│  🌐 Live Preview       (Renders Stage 3 output)                     │
│  💾 Download/Copy      (Export Stage 3 output)                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Comparison: Single-Stage vs Three-Stage

### Traditional Single-Stage Approach

```
User: "Create a portfolio for a photographer"
         ↓
      [LLM]
         ↓
    [Website]
```

**Problems:**
- ❌ LLM guesses what user wants
- ❌ May miss critical features
- ❌ Inconsistent styling choices
- ❌ Vague specifications
- ❌ Generic output

### Our Three-Stage Approach

```
User: "Create a portfolio for a photographer"
         ↓
   [Analysis LLM] → Identifies gaps & opportunities
         ↓
  [Enhancement LLM] → Creates detailed specification
         ↓
  [Generation LLM] → Produces precise implementation
         ↓
    [Website]
```

**Benefits:**
- ✅ Systematic gap analysis
- ✅ Comprehensive specifications
- ✅ Consistent design decisions
- ✅ Professional output quality
- ✅ Transparent process

## Performance Metrics

| Stage | Model | Avg Time | Max Tokens | Cost (Groq) |
|-------|-------|----------|------------|-------------|
| Analysis | Llama 3.1 70B | 2-3s | 300 | Free |
| Enhancement | Llama 3.1 70B | 3-5s | 600 | Free |
| Generation | User's choice | 10-30s | 4000 | Varies |
| **Total** | - | **15-38s** | **4900** | **~Free** |

## Error Handling & Fallbacks

```
┌─────────────┐
│ Stage 1 Fail├──┐
└─────────────┘  │
                 ├──→ Use Original Prompt
┌─────────────┐  │
│ Stage 2 Fail├──┘
└─────────────┘

If analysis or enhancement fails, the system gracefully 
falls back to using the original user prompt.
```

## Code Architecture

```typescript
// Route: app/api/generate/route.ts

export async function POST(request) {
  const { prompt } = await request.json();
  
  // Stage 1: Analyze
  const analysis = await analyzePrompt(prompt);
  
  // Stage 2: Enhance
  const enhanced = await enhancePrompt(prompt, analysis);
  
  // Stage 3: Generate
  const html = await generateWebsite(enhanced);
  
  // Return all stages for transparency
  return { html, analysis, enhanced };
}
```

## UI Components

```typescript
// components/PromptInput.tsx

<div>
  {analysis && (
    <div className="bg-purple-50">
      <p>🔍 AI Analysis:</p>
      <p>{analysis}</p>
    </div>
  )}
  
  {enhancedPrompt && (
    <div className="bg-blue-50">
      <p>✨ Enhanced Prompt:</p>
      <p>{enhancedPrompt}</p>
    </div>
  )}
</div>
```
