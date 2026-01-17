# AI Website Generator

An intelligent AI-powered website generator with **user authentication** and **project persistence**, using a **three-stage LLM pipeline** to transform simple prompts into professional, production-ready websites.

## ✨ What Makes This Special

### User Authentication & Project Management
- **Secure Authentication**: NextAuth.js with email/password login
- **Save Projects**: Store generated websites to MongoDB
- **Project Library**: Access all your saved projects anytime
- **Load & Edit**: Open previous projects to continue working
- **User Profiles**: Each user has their own isolated workspace

### Three-Stage AI Pipeline
1. **Analysis LLM**: Analyzes your prompt to identify what's missing and what could be enhanced
2. **Enhancement LLM**: Transforms your brief idea into a comprehensive design specification
3. **Generation LLM**: Creates production-ready HTML/CSS/JS based on the enhanced specification

This multi-stage approach produces **significantly better results** than single-pass generation.

## Features

- **🔐 User Authentication**: Secure login/signup system with NextAuth.js
- **💾 Project Persistence**: Save and manage all your generated websites
- **📚 Project Library**: Browse and load your previous creations
- **🧠 Intelligent Prompt Enhancement**: AI analyzes and expands your ideas automatically
- **👀 Full Transparency**: See the AI's analysis and enhanced prompt
- **🎨 Natural Language Input**: Describe your website in plain English
- **⚡ Multiple AI Providers**: Choose from Groq (fast & free), OpenRouter, or Hugging Face
- **📱 Responsive Design**: All generated sites work on mobile, tablet, and desktop
- **👁️ Live Preview**: See your generated website in real-time
- **💻 Code View**: Inspect and modify the generated code
- **📦 Export Options**: Download as ZIP file or copy code to clipboard
- **🚀 One-Click Deployment**: Deploy to GitHub, Netlify, or Vercel instantly
- **💬 Chat History**: Track and reload previous AI conversations
- **📐 Resizable Panels**: Adjust workspace to your preference

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3.4
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with bcryptjs password hashing
- **AI Providers**: 
  - **Groq**: Llama 3.3 70B, Llama 3.1 8B (Free & Fast)
  - **OpenRouter**: Claude 3.5 Sonnet, GPT-4, Llama 3.3, Gemini Pro
  - **Hugging Face**: Llama 3.3, 3.2, 3.1 (Open Source)
- **Export**: JSZip for file downloads

## Getting Started

### Prerequisites

- Node.js 18+ installed
- **MongoDB Atlas account** (free at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas))
- **Groq API key** (free at [https://console.groq.com](https://console.groq.com)) - **Recommended!**
- OR **OpenRouter API key** (get at [https://openrouter.ai/keys](https://openrouter.ai/keys))
- OR **Hugging Face API key** (free at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB:
   - Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

3. Create a `.env.local` file in the root directory:
```bash
# MongoDB (required for saving projects)
MONGODB_URI=your_mongodb_connection_string_here

# NextAuth (required for authentication)
NEXTAUTH_SECRET=your_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# AI API Keys (at least one required)
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
```

**Generate NEXTAUTH_SECRET:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploying Generated Websites

You can deploy your AI-generated websites with one click! See [WEBSITE-DEPLOYMENT.md](./WEBSITE-DEPLOYMENT.md) for:
- Setting up GitHub, Netlify, or Vercel deployment
- Getting API tokens
- Deploying to live URLs
- Managing deployed sites

**Quick Setup** (Optional - only if you want to deploy generated websites):
```env
# Add to .env.local
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
NETLIFY_ACCESS_TOKEN=your_netlify_token  
VERCEL_ACCESS_TOKEN=your_vercel_token
```

## How It Works: Three-Stage AI Pipeline

### Stage 1: Prompt Analysis 🔍
The first LLM analyzes your prompt to identify:
- **Missing elements** (colors, layouts, specific features)
- **Vague areas** (styling preferences, content structure)
- **Enhancement opportunities** (animations, modern trends)
- **Target audience insights**

**Example Input:** "Create a portfolio website for a photographer"

**Analysis Output:**
```
MISSING: Color scheme, navigation, gallery layout, contact method
VAGUE: Photography style, target clients, brand personality
ENHANCE: Full-screen hero, masonry gallery, smooth animations, dark theme
AUDIENCE: Professional clients seeking photography services
DIRECTION: Sophisticated, minimal, emphasis on visual storytelling
```

### Stage 2: Prompt Enhancement ✨
Using the analysis, the second LLM creates a comprehensive specification:

**Enhanced Prompt:**
```
Create a modern, visually stunning portfolio website for a professional 
photographer. Use a dark theme (#1a1a1a) with white text. Include a 
full-screen hero with image carousel, masonry-style gallery (3 columns 
desktop, 2 tablet, 1 mobile) with hover zoom. Add About section, contact 
form (name, email, details), fixed navigation, elegant serif headings, 
clean sans-serif body text, fade-in scroll animations, social media icons, 
and testimonials section.
```

### Stage 3: Website Generation 🚀
The third LLM receives the detailed specification and generates production-ready code.

**Why This Works Better:**
- ✅ More comprehensive specifications
- ✅ Fewer missing elements
- ✅ Consistent design decisions
- ✅ Better context for the generation model
- ✅ Educational - see how AI thinks

## Usage

1. **Enter a prompt**: Describe the website you want in the text area
   - Example: "Create a portfolio website for a photographer with a gallery and contact form"
   - Keep it brief - the AI will enhance it!
   
2. **Select AI provider**: Choose between Groq (free, fast), Hugging Face, or OpenAI

3. **Select model**: 
   - Groq: Llama 3.1 70B (recommended - fast & free)
   - Hugging Face: Zephyr 7B or other models
   - OpenAI: GPT-4 (best quality) or GPT-3.5 (faster)

4. **Click Generate**: Watch the three-stage process:
   - Analysis appears in purple box
   - Enhanced prompt appears in blue box
   - Website generates in preview

5. **Review**: 
   - Check the AI's analysis
   - Read the enhanced prompt
   - View the generated website

6. **Export**: Download as ZIP or copy the code

## Example Prompts

- "Create a portfolio website for a photographer with a gallery and contact form"
- "Build an e-commerce site for handmade jewelry with product cards"
- "Design a landing page for a SaaS product with pricing tiers"
- "Create a restaurant website with menu and reservation form"

## Project Structure

```
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts         # API endpoint for AI generation
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main page
│   └── globals.css              # Global styles
├── components/
│   ├── PromptInput.tsx          # Input panel component
│   └── PreviewPanel.tsx         # Preview/code view component
├── lib/
│   ├── api.ts                   # API client functions
│   └── utils.ts                 # Utility functions (download, copy)
└── package.json
```

## Architecture

### AI Generation Flow

1. User submits a prompt through the UI
2. Request sent to `/api/generate` endpoint
3. OpenAI API processes the prompt with system instructions
4. Complete HTML/CSS/JS returned as a single file
5. Frontend displays in preview iframe
6. User can download or copy the generated code

### Component System

The AI is instructed to use common web component patterns:
- Navigation bars (fixed/sticky headers)
- Hero sections (banners with CTAs)
- Feature grids (service/product showcases)
- Image galleries (responsive grids)
- Contact forms (with validation styling)
- Footers (multi-column layouts)
- Call-to-action sections
- Testimonials
- Pricing tables

## Model Selection

### Hugging Face (Open Source - Recommended)
- **Free tier available** with API key
- **Mixtral 8x7B**: High-quality, fast, excellent for web generation
- **Llama 2 70B**: Very capable, good alternative
- No usage costs on free tier (rate limited)

### OpenAI (Proprietary)
- **GPT-4**: Best quality, more accurate design interpretation
- **GPT-3.5**: Faster generation, lower cost
- Requires paid API key with usage-based billing

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add your `HUGGINGFACE_API_KEY` (and optionally `OPENAI_API_KEY`) in the Vercel dashboard under Environment Variables.

### Other Platforms

This Next.js app can be deployed to:
- Netlify
- Railway
- Render
- AWS Amplify

Ensure you set the `OPENAI_API_KEY` environment variable in your deployment platform.

## Deployment

Deploy to Vercel (recommended) or Render with one click:

### Quick Deploy

**Vercel** (Recommended):
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-website-generator)

**Render**:
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### Manual Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on:
- Deploying to Vercel
- Deploying to Render  
- Environment variable configuration
- Custom domain setup
- Troubleshooting

**Production Build:**
```bash
npm run build
npm run start
```

### Environment Variables for Production

Copy all variables from `.env.local` to your hosting platform and update:
- `NEXTAUTH_URL` - Set to your deployed URL (e.g., `https://your-app.vercel.app`)
- `MONGODB_URI` - Ensure MongoDB Atlas allows connections from `0.0.0.0/0`

See [.env.production](./.env.production) for template.

## Future Enhancements

- [x] Database integration (MongoDB with projects and chat history)
- [x] User authentication (NextAuth.js)
- [x] Chat history with conversation tracking
- [x] Project save/load functionality
- [x] Resizable UI panels
- [ ] Template library
- [ ] Multiple page generation
- [ ] Custom component library
- [ ] Direct deployment to subdomain
- [ ] Image generation integration
- [ ] SEO optimization suggestions
- [ ] Accessibility audit

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Notes

- Generated websites are single-page HTML files with embedded CSS/JS
- All AI-generated content is placeholder and should be reviewed
- OPENAI_API_KEY must be kept secure and never committed to version control
