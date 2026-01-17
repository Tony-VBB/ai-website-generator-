# Deployment Guide

This guide covers deploying the AI Website Generator to Vercel and Render.

## Prerequisites

Before deploying, ensure you have:

1. **MongoDB Atlas Database** (free tier available)
   - Get connection string from https://www.mongodb.com/cloud/atlas
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

2. **AI API Keys** (at least one required):
   - Groq: https://console.groq.com/keys (free)
   - OpenRouter: https://openrouter.ai/keys (free credits)
   - HuggingFace: https://huggingface.co/settings/tokens (free)
   - OpenAI: https://platform.openai.com/api-keys (paid)

3. **NextAuth Secret**: Generate with:
   ```bash
   openssl rand -base64 32
   ```

---

## Deploy to Vercel (Recommended)

Vercel is the easiest option for Next.js applications with automatic deployments.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/ai-website-generator.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Configure **Environment Variables**:

   | Variable | Value | Example |
   |----------|-------|---------|
   | `MONGODB_URI` | Your MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
   | `NEXTAUTH_SECRET` | Random 32-char string | `edQB4u86CRZHzrnqDhoG7fxaXOYvNMcA` |
   | `NEXTAUTH_URL` | Your Vercel URL | `https://your-app.vercel.app` |
   | `GROQ_API_KEY` | Your Groq API key | `gsk_...` |
   | `OPENROUTER_API_KEY` | Your OpenRouter key | `sk-or-v1-...` |
   | `HUGGINGFACE_API_KEY` | Your HuggingFace token | `hf_...` |
   | `OPENAI_API_KEY` | (Optional) OpenAI key | `sk-...` |

6. Click **"Deploy"**

### Step 3: Update NEXTAUTH_URL

After first deployment:
1. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Update `NEXTAUTH_URL` to your actual Vercel URL
4. Redeploy from **Deployments** tab

### Auto Deployments

Every push to `main` branch will automatically deploy to Vercel.

---

## Deploy to Render

Render offers free hosting with automatic deployments from GitHub.

### Step 1: Push to GitHub

Same as Vercel step 1 above.

### Step 2: Create Web Service

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **"New+"** → **"Web Service"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` configuration

### Step 3: Configure Manually (if not using render.yaml)

If using manual configuration:

- **Name**: `ai-website-generator`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Instance Type**: `Free`

### Step 4: Add Environment Variables

In the Render dashboard, go to **Environment** tab and add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `NEXTAUTH_SECRET` | Random 32-char string |
| `NEXTAUTH_URL` | Your Render URL (e.g., `https://ai-website-generator.onrender.com`) |
| `GROQ_API_KEY` | Your Groq API key |
| `OPENROUTER_API_KEY` | Your OpenRouter key |
| `HUGGINGFACE_API_KEY` | Your HuggingFace token |
| `OPENAI_API_KEY` | (Optional) Your OpenAI key |
| `NODE_VERSION` | `18.17.0` |

### Step 5: Deploy

Click **"Create Web Service"** and wait for deployment (5-10 minutes for first deploy).

### Important Notes for Render

- Free tier instances spin down after inactivity (slow first load)
- Update `NEXTAUTH_URL` after deployment with actual URL
- Deployments are automatic on every push to `main`

---

## Environment Variables Reference

### Required Variables

```env
# Database (Required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-website-gen?retryWrites=true&w=majority

# Authentication (Required)
NEXTAUTH_SECRET=your-random-32-character-secret
NEXTAUTH_URL=https://your-deployed-url.com

# AI Provider (At least one required)
GROQ_API_KEY=gsk_your_groq_key
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key
HUGGINGFACE_API_KEY=hf_your_huggingface_token
```

### Optional Variables

```env
# OpenAI (Optional - only if using OpenAI models)
OPENAI_API_KEY=sk-your_openai_key
```

---

## Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] `NEXTAUTH_URL` matches deployed URL
- [ ] MongoDB Atlas allows connections from anywhere (`0.0.0.0/0` in Network Access)
- [ ] Test user registration
- [ ] Test website generation with different AI models
- [ ] Test project save/load functionality
- [ ] Test chat history feature

---

## Troubleshooting

### "Internal Server Error" after login

**Solution**: Check that `NEXTAUTH_URL` matches your deployed URL exactly (including `https://`).

### "Database connection failed"

**Solutions**:
1. Verify `MONGODB_URI` is correct
2. In MongoDB Atlas, go to **Network Access** → Add IP: `0.0.0.0/0` (allow all)
3. Check database user has read/write permissions

### "Failed to generate website"

**Solutions**:
1. Verify at least one AI API key is configured
2. Check API key is valid and has credits/quota
3. Try different AI provider from dropdown

### Slow first load (Render)

This is normal on Render's free tier - instances spin down after inactivity.

### Build fails

**Solutions**:
1. Check Node version is 18+ (`NODE_VERSION=18.17.0`)
2. Clear build cache and redeploy
3. Check all dependencies in `package.json` are valid

---

## Cost Breakdown

### Free Tier Limits

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ Yes | 100GB bandwidth/month, serverless functions |
| **Render** | ✅ Yes | 750 hours/month, spins down after inactivity |
| **MongoDB Atlas** | ✅ Yes | 512MB storage, shared cluster |
| **Groq** | ✅ Yes | Rate limits apply |
| **OpenRouter** | ✅ Credits | $1 free credit |
| **HuggingFace** | ✅ Yes | Rate limits apply |
| **OpenAI** | ❌ No | Pay per token |

### Recommended for Production

- **Hosting**: Vercel (better performance, no spin-down)
- **Database**: MongoDB Atlas M10+ (dedicated cluster)
- **AI**: Groq + OpenRouter (best free options)

---

## Updating Your Deployment

### Vercel
```bash
git add .
git commit -m "Update feature"
git push origin main
# Auto-deploys to Vercel
```

### Render
Same as Vercel - push to GitHub triggers automatic deployment.

### Manual Deployment
If you need to redeploy without code changes:
- **Vercel**: Go to Deployments → Click "Redeploy"
- **Render**: Go to Manual Deploy → Click "Deploy latest commit"

---

## Custom Domain Setup

### Vercel
1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `myapp.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to use custom domain

### Render
1. Go to **Settings** → **Custom Domain**
2. Add your domain
3. Configure DNS records as instructed
4. Update `NEXTAUTH_URL` to use custom domain

---

## Security Best Practices

1. **Never commit** `.env.local` to git (already in `.gitignore`)
2. **Rotate secrets** periodically (especially `NEXTAUTH_SECRET`)
3. **MongoDB**: Use strong passwords and whitelist IPs when possible
4. **API Keys**: Regenerate if accidentally exposed
5. **HTTPS only**: Both Vercel and Render provide free SSL certificates

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/
