# AI Website Generator - Project Guide

## Project Overview
An AI-powered website generator built with Next.js 14, TypeScript, and Tailwind CSS. Users describe websites in natural language, and the AI generates complete HTML/CSS/JS code using OpenAI's GPT models.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS 3.4
- **AI**: OpenAI API (GPT-4/GPT-3.5)
- **Export**: JSZip for downloads
- **Deployment**: Vercel-ready

## Features Implemented
- Natural language prompt input with examples
- AI model selection (GPT-4 vs GPT-3.5)
- Real-time website generation via API route
- Live preview in iframe
- Code view with syntax highlighting
- Copy to clipboard functionality
- Download as ZIP file
- Responsive split-pane UI
- Error handling and loading states

## Project Structure
```
├── app/
│   ├── api/generate/route.ts    # OpenAI integration
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main UI
│   └── globals.css              # Tailwind imports
├── components/
│   ├── PromptInput.tsx          # Left panel
│   └── PreviewPanel.tsx         # Right panel
├── lib/
│   ├── api.ts                   # API client
│   └── utils.ts                 # Export utilities
├── .env.example                 # Environment template
└── README.md                    # Full documentation

## Setup Instructions
1. Copy `.env.example` to `.env.local`
2. Add your OpenAI API key: `OPENAI_API_KEY=sk-...`
3. Run `npm run dev`
4. Open http://localhost:3000

## Development Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## Architecture Notes
- App Router with server/client components
- API route handles OpenAI calls server-side
- System prompt engineered for responsive HTML output
- Component patterns: nav, hero, features, gallery, contact, footer
- All generated sites are single-file HTML with embedded CSS/JS

## Future Enhancements
- Database integration for saving projects
- User authentication
- Template library
- Multi-page generation
- Custom component builder
- Direct deployment to subdomain
