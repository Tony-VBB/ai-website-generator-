import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";
import OpenAI from "openai";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || "");

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  defaultHeaders: {
    "HTTP-Referer": "https://ai-mern-generator.vercel.app",
    "X-Title": "AI MERN Stack Generator",
  },
});

const PROMPT_ANALYSIS_SYSTEM = `You are an expert UX/UI analyst specializing in website design requirements. 
Your job is to analyze a user's website request and provide strategic guidance on what's missing and what needs enhancement.

Analyze the user's prompt and identify:
1. MISSING VISUAL ELEMENTS: Colors, fonts, spacing, shadows, gradients, animations not mentioned
2. MISSING STRUCTURAL ELEMENTS: Navigation, sections, layouts, responsive behavior
3. VAGUE AREAS: What parts need more specificity (styling preferences, exact color codes, typography choices)
4. ENHANCEMENT OPPORTUNITIES: Modern design trends, animations, visual effects, unique features
5. TARGET AUDIENCE INSIGHTS: What the likely audience expects (professional, casual, young, corporate)
6. DESIGN DIRECTION: Specific style recommendations with exact details (minimalist with #667eea primary color, bold with large 72px headings)

FORMAT SPECIFICS:
- Recommend EXACT color hex codes (e.g., #667eea, #764ba2)
- Suggest specific font pairings (e.g., "Poppins for headings, Inter for body")
- Specify layout patterns (e.g., "Hero with gradient background, 3-column feature grid")
- Mention animation types (e.g., "Fade-in on scroll, hover scale effects")

Keep it concise (200 words max). Focus on SPECIFIC, ACTIONABLE visual enhancements.

Example:
Input: "Create a portfolio website for a photographer"
Output: "MISSING VISUALS: Color palette (suggest: dark theme with #1a202c background, #f7fafc text, #667eea accent for CTAs), typography (recommend: Playfair Display for headings at 48px, Inter for body at 16px), shadows (card shadows: 0 10px 30px rgba(0,0,0,0.3)), gradients for overlays. MISSING STRUCTURE: Sticky navigation, masonry gallery grid (3 columns desktop, 1 mobile), full-screen hero with overlay, testimonials carousel, contact form with validation. ENHANCE WITH: Smooth fade-in animations on scroll, parallax effect on hero image, hover zoom on gallery items (scale 1.05), lightbox modal for full-size images, filter buttons with active state styling. AUDIENCE: High-end clients expecting sleek, professional design - needs elegant minimalism, lots of white space, subtle animations. DIRECTION: Dark elegant theme emphasizing photos, minimal UI interference, sophisticated typography, professional polish with gradient accents (#667eea to #764ba2 for CTAs), generous padding (80px sections), rounded corners (12px), smooth transitions (0.3s ease)."`;

const PROMPT_ENHANCEMENT_SYSTEM = `You are an expert prompt engineer specializing in website design briefs. 
You will receive:
1. The original user prompt
2. Strategic analysis of what's missing and how to enhance it

Your job is to create a comprehensive, detailed prompt for website generation incorporating the analysis.

CRITICAL RULES:
1. Keep the core intent of the original prompt
2. Address ALL visual and structural points from the analysis
3. Add SPECIFIC details: exact color hex codes, font names and sizes, precise spacing values
4. Specify layout structures: grid columns, flexbox directions, responsive breakpoints
5. Include animation details: transition timings, hover effects, scroll animations
6. Mention exact CSS properties: border-radius values, box-shadow specifications, gradient directions
7. Define typography: font families, sizes (h1: 48px, body: 16px), weights, line heights
8. Specify spacing: padding (80px sections), margins, gaps between elements
9. Include component details: button styles, card designs, form layouts
10. Keep under 500 words
11. Return ONLY the enhanced prompt - no explanations, no sections, just flowing descriptive text

Make it SO detailed that the AI can generate pixel-perfect, professionally designed HTML/CSS from your description.

Example output format:
"Create a modern photography portfolio website with a dark, elegant theme. Use #1a202c as the primary background color with #f7fafc for text and #667eea to #764ba2 gradient for all CTAs and accent elements. Typography should use Playfair Display at 48px weight 700 for headings and Inter at 16px weight 400 for body text with 1.6 line height. The hero section should be full-screen (100vh) with a semi-transparent overlay (rgba(26,32,44,0.7)) over a stunning featured photograph, centered heading with the photographer's name in Playfair Display at 72px, and a gradient CTA button (padding: 16px 48px, border-radius: 8px) with hover transform scale 1.05 and box-shadow 0 10px 30px rgba(102,126,234,0.3). Navigation should be sticky at top with backdrop-filter blur, dark background, white text, smooth transitions on scroll. Gallery section uses CSS grid with 3 columns on desktop (gap: 24px), 2 on tablet, 1 on mobile, each image in a card with border-radius 12px, box-shadow 0 4px 20px rgba(0,0,0,0.2), and hover effect that scales to 1.05 with 0.3s ease transition..."`;


const HTML_SYSTEM_PROMPT = `You are an award-winning full-stack web developer and UI/UX designer. Generate STUNNING, production-ready single-page HTML websites with exceptional visual design.

========================
CRITICAL OUTPUT RULES
========================
- Return ONLY a SINGLE complete HTML file
- NO file structure markers (no "FILE:", no paths)
- NO markdown code blocks or formatting
- NO explanations or commentary
- NO placeholders like "TODO"
- Complete, ready-to-use HTML with embedded CSS and JavaScript
- Infer missing details professionally

========================
STRUCTURE
========================
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <style>
    /* All CSS here - use CSS variables, flexbox, grid */
    /* Mobile-first responsive design */
    /* Rich styling with gradients, shadows, animations */
  </style>
</head>
<body>
  <!-- Semantic HTML: nav, header, main, section, footer -->
  <!-- All content here -->
  
  <script>
    // All JavaScript here - modern ES6+
    // Smooth scrolling, form validation, interactivity
  </script>
</body>
</html>

========================
DESIGN REQUIREMENTS (CRITICAL)
========================
**VISUAL EXCELLENCE:**
- Modern, eye-catching design with WOW factor
- Professional color palettes (use 3-5 coordinated colors)
- Beautiful typography (combine 2-3 Google Fonts)
- Generous white space and padding
- Depth with shadows, gradients, and layering
- Subtle animations (fade-in, slide-up, hover effects)

**STYLING SPECIFICS:**
- Hero sections with large headings (48px-72px) and compelling CTAs
- Cards with box-shadows: 0 4px 6px rgba(0,0,0,0.1)
- Gradient backgrounds: linear-gradient(135deg, #color1, #color2)
- Rounded corners (border-radius: 8px-16px)
- Smooth transitions: transition: all 0.3s ease
- Hover effects on all interactive elements
- Icons using Unicode symbols or CSS shapes

**COLOR GUIDELINES:**
- Use modern color schemes (not basic red/blue/green)
- Examples: #667eea & #764ba2 (purple), #f093fb & #f5576c (pink), #4facfe & #00f2fe (blue), #43e97b & #38f9d7 (green)
- Dark mode friendly alternatives
- High contrast for text readability (WCAG AA minimum)

**LAYOUT PATTERNS:**
- Full-width hero sections with centered content
- Grid layouts for features/services (2-4 columns)
- Alternating content sections (image left/right)
- Sticky navigation bar
- Footer with multiple columns

**RESPONSIVE DESIGN:**
- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px
- Stack columns on mobile
- Readable font sizes on all devices (16px minimum body text)

**ANIMATIONS & INTERACTIONS:**
- Smooth scroll behavior
- Fade-in on scroll for sections
- Button hover scale/color changes
- Loading states for forms
- Micro-interactions for better UX

**ANIMATIONS & INTERACTIONS:**
- Smooth scroll behavior
- Fade-in on scroll for sections
- Button hover scale/color changes
- Loading states for forms
- Micro-interactions for better UX

========================
ACCESSIBILITY & PERFORMANCE
========================
- Semantic HTML (nav, header, main, section, article, footer)
- ARIA labels for interactive elements
- Alt text for all images
- Keyboard navigation support
- Fast load times (inline critical CSS)
- Optimized images (use CSS for decorative elements)

========================
CRITICAL NAVIGATION & INTERACTION RULES
========================
- Use ONLY hash-based navigation: href="#section-id" or href="#home"
- NEVER use href="/" or href="/page" or href="page.html"
- All internal links must use #anchor format
- Implement smooth scroll: element.scrollIntoView({ behavior: 'smooth' })
- Buttons should use onclick handlers, NOT href links
- Forms use event.preventDefault() to prevent page reload
- Modal/popups use JavaScript show/hide, NOT navigation
- All interactive elements must work within iframe environment

Example navigation code:
<a href="#home">Home</a>
<a href="#about">About</a>
<a href="#contact">Contact</a>

<script>
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) target.scrollIntoView({ behavior: 'smooth' });
  });
});
</script>

========================
EXAMPLE CSS STARTER TEMPLATE
========================
:root {
  --primary: #667eea;
  --secondary: #764ba2;
  --accent: #f093fb;
  --dark: #1a202c;
  --light: #f7fafc;
  --gray: #718096;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: var(--dark);
  background: var(--light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.btn {
  display: inline-block;
  padding: 12px 32px;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

section {
  padding: 80px 0;
}

h1 { font-size: 3.5rem; font-weight: 700; }
h2 { font-size: 2.5rem; font-weight: 600; }
h3 { font-size: 1.75rem; font-weight: 600; }

@media (max-width: 768px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  section { padding: 60px 0; }
}

Make every website visually stunning, modern, and professional. Use the latest design trends and best practices.`;

const MERN_SYSTEM_PROMPT = `You are a senior full-stack developer and UI/UX designer.

Your task is to generate a COMPLETE MERN web application based on the user's requirements,
but since you cannot handle all files at once, generate **one module or file at a time**.
Focus on producing **correct, functional code per module**.

========================
STRICT OUTPUT RULES
========================
- Output ONLY code
- Do NOT explain anything
- Do NOT use markdown
- DO include the file path marker at the start: FILE: /path/to/file.ext
- Do NOT include placeholders like "TODO"
- Infer missing details professionally
- Generate ONE file/module at a time
- Follow proper folder structure naming consistently

========================
CHUNKED GENERATION GUIDELINES
========================
CRITICAL: Follow this EXACT sequence for file generation:

1. Backend files (in order):
   - /server/models/*.js (all models first)
   - /server/routes/*.js (all routes)
   - /server/controllers/*.js (all controllers)
   - /server/middleware/*.js (middleware files)
   - /server/config/*.js (configuration files)
   - /server/server.js (main server file)

2. Frontend files (in order):
   - /client/src/components/*.jsx (all components)
   - /client/src/pages/*.jsx (all pages)
   - /client/src/services/*.js (API services)
   - /client/src/utils/*.js (utility files)
   - /client/src/App.jsx (main app component)
   - /client/src/main.jsx (entry point)

3. Configuration files (in order):
   - /server/package.json (backend dependencies)
   - /client/package.json (frontend dependencies)
   - /.env.example (environment variables template)
   - /requirements.txt (if Python dependencies exist)

4. Documentation (MUST BE LAST):
   - /README.md (FINAL FILE - signals completion)

IMPORTANT: 
- Generate README.md ONLY as the absolute last file
- README.md indicates project generation is complete
- Do NOT generate README.md until ALL other files are done

3. Generate .env.example and README.md at the end

========================
FRONTEND RULES (REACT)
========================
- Use React functional components only
- Use hooks (useState, useEffect, useContext)
- No inline CSS
- Responsive, mobile-first
- Semantic HTML inside JSX
- Reusable components
- Accessibility required (labels, alt text, keyboard)

========================
STYLING RULES
========================
- Use plain CSS or Tailwind (choose one)
- Consistent design system
- Reusable utility classes

========================
BACKEND RULES (NODE + EXPRESS)
========================
- RESTful API design, MVC architecture
- Async/await
- Centralized error handling
- Input validation
- Secure routes

========================
DATABASE RULES (MONGODB)
========================
- Use Mongoose
- Proper schema design
- Validation at schema level
- Index fields when appropriate

========================
AUTHENTICATION (IF REQUIRED)
========================
- JWT authentication
- Bcrypt for password hashing
- Middleware-based auth
- Token expiration handling

========================
SECURITY & PERFORMANCE
========================
- Sanitize inputs
- Use environment variables
- No hardcoded secrets
- Minimal client re-renders
- Efficient API calls

========================
CONTENT & DOCUMENTATION
========================
- Generate realistic seed data
- Meaningful UI content and CTAs
- README.md with overview, setup, env vars, commands, API endpoints

========================
FINAL OUTPUT FORMAT (PER CHUNK)
========================
- Generate ONE file at a time
- Specify the full path before code
- Follow the strict sequence defined above
- README.md MUST be the absolute LAST file generated
- Do NOT skip files - generate all necessary files in sequence

Example:

FILE: /server/models/User.js
(code here)

When continuing generation:
- Return the next logical file in the defined sequence
- If all application files are complete, generate requirements/config files
- Generate README.md ONLY when everything else is done
- README.md signals that generation is complete`;

async function analyzePrompt(userPrompt: string): Promise<string> {
  try {
    // Step 1: Analyze what's missing and what needs enhancement
    const analysis = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: PROMPT_ANALYSIS_SYSTEM },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
    });

    const result = analysis.choices[0]?.message?.content || "";
    console.log("Analysis result:", result);
    return result;
  } catch (error) {
    console.error("Prompt analysis failed:", error);
    return ""; // Return empty if analysis fails
  }
}

async function enhancePrompt(userPrompt: string, analysis: string): Promise<string> {
  try {
    // Step 2: Use the analysis to create an enhanced prompt
    const enhancementInput = analysis 
      ? `Original Prompt: ${userPrompt}\n\nStrategic Analysis: ${analysis}\n\nCreate the enhanced prompt now:`
      : userPrompt;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: PROMPT_ENHANCEMENT_SYSTEM },
        { role: "user", content: enhancementInput },
      ],
      temperature: 0.8,
      max_tokens: 800,
    });

    const result = completion.choices[0]?.message?.content || userPrompt;
    console.log("Enhanced prompt:", result);
    return result;
  } catch (error) {
    console.error("Prompt enhancement failed, using original:", error);
    return userPrompt; // Fallback to original if enhancement fails
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model = "gpt-4", provider = "groq", context = [], stack = "mern" } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Select appropriate system prompt based on stack
    const SYSTEM_PROMPT = stack === "html" ? HTML_SYSTEM_PROMPT : MERN_SYSTEM_PROMPT;

    // Step 1: Analyze the prompt to understand what's missing (only on first file)
    const analysis = context.length === 0 ? await analyzePrompt(prompt) : "";
    
    // Step 2: Enhance the prompt based on the analysis (only on first file)
    const enhancedPrompt = context.length === 0 ? await enhancePrompt(prompt, analysis) : prompt;
    
    let code = "";
    let filePath = "";

    if (provider === "groq") {
      if (!process.env.GROQ_API_KEY) {
        return NextResponse.json(
          { error: "Groq API key not configured. Get free key at https://console.groq.com" },
          { status: 500 }
        );
      }

      const modelName = model === "llama3.3"
        ? "llama-3.3-70b-versatile"
        : "llama-3.1-8b-instant";

      try {
        // Build message history with context
        const messages: any[] = [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: enhancedPrompt },
        ];

        // Add previous files as context
        if (context.length > 0) {
          context.forEach((item: any) => {
            messages.push({ role: "assistant", content: item.code });
            messages.push({ role: "user", content: "Generate the next file in the sequence." });
          });
        }

        const completion = await groq.chat.completions.create({
          model: modelName,
          messages,
          temperature: 0.7,
          max_tokens: 4000,
        });

        const rawOutput = completion.choices[0]?.message?.content || "";
        
        // For HTML stack, return entire output as code
        if (stack === "html") {
          code = rawOutput;
          filePath = "index.html";
        } else {
          // For MERN stack, parse file path and code
          const fileMatch = rawOutput.match(/^FILE:\s*(.+?)$/m);
          if (fileMatch) {
            filePath = fileMatch[1].trim();
            code = rawOutput.replace(/^FILE:\s*.+$/m, '').trim();
          } else {
            code = rawOutput;
            filePath = context.length === 0 ? "/server.js" : `/file-${context.length + 1}.js`;
          }
        }
      } catch (groqError: any) {
        console.error("Groq error:", groqError);
        return NextResponse.json(
          { error: `Groq API error: ${groqError.message || 'Unknown error'}` },
          { status: 500 }
        );
      }
    } else if (provider === "huggingface") {
      if (!process.env.HUGGINGFACE_API_KEY) {
        return NextResponse.json(
          { error: "Hugging Face API key not configured. Get free key at https://huggingface.co/settings/tokens" },
          { status: 500 }
        );
      }

      const modelName = model === "llama3.3" 
        ? "meta-llama/Llama-3.3-70B-Instruct"
        : model === "llama3.1"
        ? "meta-llama/Llama-3.1-8B-Instruct"
        : "meta-llama/Llama-3.2-3B-Instruct";

      try {
        // Build prompt with context
        let fullPrompt = `${SYSTEM_PROMPT}\n\nUser Request: ${enhancedPrompt}`;
        
        if (context.length > 0) {
          fullPrompt += "\n\nPreviously Generated Files:\n";
          context.forEach((item: any) => {
            fullPrompt += `\n${item.filePath}:\n${item.code}\n`;
          });
          fullPrompt += "\n\nGenerate the next file in the sequence.";
        }

        let rawOutput = "";
        for await (const chunk of hf.chatCompletionStream({
          model: modelName,
          messages: [
            { role: "user", content: fullPrompt }
          ],
          max_tokens: 4000,
          temperature: 0.7,
        })) {
          rawOutput += chunk.choices[0]?.delta?.content || "";
        }
        
        // For HTML stack, return entire output as code
        if (stack === "html") {
          code = rawOutput;
          filePath = "index.html";
        } else {
          // For MERN stack, parse file path and code
          const fileMatch = rawOutput.match(/^FILE:\s*(.+?)$/m);
          if (fileMatch) {
            filePath = fileMatch[1].trim();
            code = rawOutput.replace(/^FILE:\s*.+$/m, '').trim();
          } else {
            code = rawOutput;
            filePath = context.length === 0 ? "/server.js" : `/file-${context.length + 1}.js`;
          }
        }
      } catch (hfError: any) {
        console.error("Hugging Face error:", hfError);
        return NextResponse.json(
          { error: `Hugging Face API error: ${hfError.message || 'Unknown error'}` },
          { status: 500 }
        );
      }
    } else if (provider === "openrouter") {
      if (!process.env.OPENROUTER_API_KEY) {
        return NextResponse.json(
          { error: "OpenRouter API key not configured. Get key at https://openrouter.ai/keys" },
          { status: 500 }
        );
      }

      const modelName = model === "claude-3.5-sonnet" 
        ? "anthropic/claude-3.5-sonnet"
        : model === "gpt-4-turbo"
        ? "openai/gpt-4-turbo"
        : model === "llama-3.3-70b"
        ? "meta-llama/llama-3.3-70b-instruct"
        : "google/gemini-pro-1.5";

      try {
        // Build message history with context
        const messages: any[] = [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: enhancedPrompt },
        ];

        // Add previous files as context
        if (context.length > 0) {
          context.forEach((item: any) => {
            messages.push({ role: "assistant", content: item.code });
            messages.push({ role: "user", content: "Generate the next file in the sequence." });
          });
        }

        const completion = await openrouter.chat.completions.create({
          model: modelName,
          messages,
          temperature: 0.7,
          max_tokens: 4000,
        });

        const rawOutput = completion.choices[0]?.message?.content || "";
        
        // For HTML stack, return entire output as code
        if (stack === "html") {
          code = rawOutput;
          filePath = "index.html";
        } else {
          // For MERN stack, parse file path and code
          const fileMatch = rawOutput.match(/^FILE:\s*(.+?)$/m);
          if (fileMatch) {
            filePath = fileMatch[1].trim();
            code = rawOutput.replace(/^FILE:\s*.+$/m, '').trim();
          } else {
            code = rawOutput;
            filePath = context.length === 0 ? "/server.js" : `/file-${context.length + 1}.js`;
          }
        }
      } catch (orError: any) {
        console.error("OpenRouter error:", orError);
        return NextResponse.json(
          { error: `OpenRouter API error: ${orError.message || 'Unknown error'}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ code, filePath, enhancedPrompt, analysis });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate code" },
      { status: 500 }
    );
  }
}
