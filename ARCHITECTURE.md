# Three-Stage LLM Architecture

## Overview
The AI Website Generator now uses a **three-stage LLM pipeline** for superior results:

```
User Input → Analysis LLM → Enhancement LLM → Generation LLM → Website
```

## Stage 1: Prompt Analysis (Meta-Intelligence)
**Model:** Groq Llama 3.1 70B  
**Purpose:** Analyze what's missing and identify enhancement opportunities

**Input Example:**
```
"Create a portfolio website for a photographer"
```

**Output Example:**
```
MISSING: Color scheme, navigation structure, specific gallery layout, contact method, 
social media presence.

VAGUE: Photography style (wedding, landscape, commercial?), target clients, 
brand personality.

ENHANCE WITH: Full-screen hero with featured work, masonry gallery with filtering, 
smooth animations, dark/elegant theme for photo emphasis, testimonials section.

AUDIENCE: Potential clients seeking professional photography services - needs 
trust signals and easy contact.

DIRECTION: Sophisticated, minimal interference with photos, emphasis on visual 
storytelling, elegant typography, professional polish.
```

## Stage 2: Prompt Enhancement (Detailed Specification)
**Model:** Groq Llama 3.1 70B  
**Purpose:** Transform brief requests into comprehensive specifications

**Input:**
- Original user prompt
- Strategic analysis from Stage 1

**Output Example:**
```
Create a modern, visually stunning portfolio website for a professional photographer. 
Use a dark theme (#1a1a1a background) with white text for elegance. Include a 
full-screen hero section with a striking gallery image carousel. Add a masonry-style 
photo gallery with 3 columns on desktop, 2 on tablet, 1 on mobile, with smooth hover 
zoom effects. Include an 'About' section with the photographer's bio and profile image. 
Add a contact form with name, email, project details fields, and a send button. 
Use a fixed navigation bar with smooth scroll links. Incorporate elegant serif fonts 
for headings (like Playfair Display style) and clean sans-serif for body text. 
Add subtle fade-in animations on scroll. Include social media icons in the footer. 
Add a testimonials section with client quotes. Make all images optimized with proper 
aspect ratios and lazy loading considerations.
```

## Stage 3: Website Generation (Code Production)
**Model:** User's choice (Groq Llama, OpenAI GPT, HuggingFace models)  
**Purpose:** Generate production-ready HTML/CSS/JS

**Input:** Enhanced prompt from Stage 2  
**Output:** Complete, responsive website code

## Benefits of Three-Stage Architecture

### 1. **Intelligent Gap Identification**
- Analysis LLM spots missing critical elements
- Identifies vague areas needing clarification
- Suggests modern best practices

### 2. **Context-Aware Enhancement**
- Enhancement LLM receives strategic guidance
- Knows exactly what to add and why
- Produces more focused, relevant details

### 3. **Superior Output Quality**
- Generation LLM receives comprehensive specifications
- Less guesswork, more precision
- Consistent, professional results

### 4. **Transparency**
- Users see the analysis reasoning
- Users see the enhanced prompt
- Educational value - learn what makes good prompts

### 5. **Fallback Safety**
- If Stage 1 fails → uses original prompt
- If Stage 2 fails → uses original prompt
- Graceful degradation ensures reliability

## Technical Implementation

### API Flow
```typescript
async function POST(request) {
  const { prompt, model, provider } = await request.json();
  
  // Stage 1: Analysis
  const analysis = await analyzePrompt(prompt);
  
  // Stage 2: Enhancement
  const enhancedPrompt = await enhancePrompt(prompt, analysis);
  
  // Stage 3: Generation
  const html = await generateWebsite(enhancedPrompt, model, provider);
  
  return { html, enhancedPrompt, analysis };
}
```

### UI Display
1. **Purple Box:** Shows AI analysis (what's missing, enhancement strategy)
2. **Blue Box:** Shows enhanced prompt (detailed specification)
3. **Preview:** Shows generated website

## Performance Considerations

- **Analysis:** ~2-3 seconds (300 tokens max)
- **Enhancement:** ~3-5 seconds (600 tokens max)
- **Generation:** ~10-30 seconds (4000 tokens max)
- **Total:** ~15-38 seconds for complete generation

All analysis and enhancement use **free Groq API** (fast Llama 3.1 70B)

## Future Enhancements

- [ ] Cache common analyses
- [ ] User feedback loop (thumbs up/down on analysis)
- [ ] A/B testing different analysis strategies
- [ ] Domain-specific analysis (e-commerce vs portfolio vs SaaS)
- [ ] Multi-language support
- [ ] Custom analysis templates
