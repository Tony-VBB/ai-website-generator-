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
1. MISSING ELEMENTS: What critical aspects are not mentioned (colors, layouts, specific sections, user flows)
2. VAGUE AREAS: What parts need more specificity (styling preferences, technical requirements, content structure)
3. ENHANCEMENT OPPORTUNITIES: What could make this website stand out (animations, unique features, modern trends)
4. TARGET AUDIENCE INSIGHTS: What the likely audience expects (professional, casual, young, corporate)
5. DESIGN DIRECTION: Specific style recommendations (minimalist, bold, elegant, playful)

Format your response as clear, actionable guidance for someone who will enhance this prompt.
Keep it concise (150 words max). Focus on WHAT to add, not HOW to add it.

Example:
Input: "Create a portfolio website for a photographer"
Output: "MISSING: Color scheme, navigation structure, specific gallery layout, contact method, social media presence. VAGUE: Photography style (wedding, landscape, commercial?), target clients, brand personality. ENHANCE WITH: Full-screen hero with featured work, masonry gallery with filtering, smooth animations, dark/elegant theme for photo emphasis, testimonials section for credibility. AUDIENCE: Potential clients seeking professional photography services - needs trust signals and easy contact. DIRECTION: Sophisticated, minimal interference with photos, emphasis on visual storytelling, elegant typography, professional polish."`;

const PROMPT_ENHANCEMENT_SYSTEM = `You are an expert prompt engineer specializing in website design briefs. 
You will receive:
1. The original user prompt
2. Strategic analysis of what's missing and how to enhance it

Your job is to create a comprehensive, detailed prompt for website generation incorporating the analysis.

RULES:
1. Keep the core intent of the original prompt
2. Address ALL points from the analysis
3. Add specific details: color codes, layout structures, component names, typography styles
4. Be concrete about design patterns and sections
5. Include technical details (responsive breakpoints, interactions, animations)
6. Keep under 400 words
7. Return ONLY the enhanced prompt - no explanations, no sections, just flowing text

Make it so detailed that a developer could build the exact website from your description."`;

const HTML_SYSTEM_PROMPT = `You are a senior full-stack web developer and UI/UX architect. Generate COMPLETE, production-ready single-page HTML websites.

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
DESIGN REQUIREMENTS
========================
- Responsive (mobile, tablet, desktop)
- Accessibility (ARIA, alt text, keyboard nav)
- Professional color schemes with good contrast
- Smooth animations and transitions
- Modern, clean aesthetic
- Hash-based navigation (#section-id) for smooth scrolling
- Form validation and interactivity

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

Make it production-ready, visually stunning, and fully functional in an iframe.`;

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
