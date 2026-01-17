# Generated Website Deployment Guide

This feature allows you to deploy your AI-generated websites to live hosting platforms with one click.

## Supported Platforms

### 1. GitHub Gist (Recommended for Testing)
- **Free**: ✅ Yes
- **Setup Required**: GitHub Personal Access Token
- **Speed**: Instant deployment
- **Best For**: Quick testing, sharing demos

**Setup Instructions:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: `gist` and `repo`
4. Copy the token
5. Add to `.env.local`:
   ```env
   GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

### 2. Netlify
- **Free**: ✅ Yes (100GB bandwidth/month)
- **Setup Required**: Netlify Access Token
- **Speed**: Fast deployment with global CDN
- **Best For**: Production websites

**Setup Instructions:**
1. Sign up at https://netlify.com
2. Go to https://app.netlify.com/user/applications#personal-access-tokens
3. Click "New access token"
4. Copy the token
5. Add to `.env.local`:
   ```env
   NETLIFY_ACCESS_TOKEN=your_netlify_token_here
   ```

### 3. Vercel
- **Free**: ✅ Yes (100GB bandwidth/month)
- **Setup Required**: Vercel Access Token
- **Speed**: Fast deployment with edge network
- **Best For**: Production websites

**Setup Instructions:**
1. Sign up at https://vercel.com
2. Go to https://vercel.com/account/tokens
3. Create a new token
4. Copy the token
5. Add to `.env.local`:
   ```env
   VERCEL_ACCESS_TOKEN=your_vercel_token_here
   ```

## How to Deploy

1. **Generate a website** using the AI Website Generator
2. Click the **"Deploy Live"** button in the preview panel
3. **Choose a platform** from the deployment dialog
4. Enter a project name (optional)
5. Click the platform button to deploy
6. **Get your live URL** - share it with anyone!

## Deployment Features

- ✅ **One-click deployment** - No manual file uploads
- ✅ **Live URLs** - Instantly accessible websites
- ✅ **SSL/HTTPS** - All platforms provide free SSL certificates
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Version control** - Deploy multiple versions
- ✅ **Custom names** - Choose your project name

## Environment Variables

Add these to your `.env.local` file (optional - only for platforms you want to use):

```env
# GitHub Gist deployment
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# Netlify deployment
NETLIFY_ACCESS_TOKEN=your_netlify_token_here

# Vercel deployment
VERCEL_ACCESS_TOKEN=your_vercel_token_here
```

**Note**: If a platform is not configured, the deployment button will show an error message with setup instructions.

## Troubleshooting

### "GitHub deployment not configured"
- Add `GITHUB_PERSONAL_ACCESS_TOKEN` to your environment variables
- Ensure the token has `gist` and `repo` scopes
- Restart your development server

### "Netlify deployment not configured"
- Add `NETLIFY_ACCESS_TOKEN` to your environment variables
- Verify the token is valid at netlify.com
- Restart your development server

### "Vercel deployment not configured"
- Add `VERCEL_ACCESS_TOKEN` to your environment variables
- Ensure the token has deployment permissions
- Restart your development server

### Deployment takes too long
- GitHub Gist: Usually instant
- Netlify: 10-30 seconds (includes build and CDN distribution)
- Vercel: 10-30 seconds (includes edge network deployment)

### "Failed to deploy"
- Check that your API tokens are valid and not expired
- Ensure you have available deployment quota (free tiers have limits)
- Try a different platform
- Check the browser console for detailed error messages

## Deployment Limits (Free Tiers)

| Platform | Deployments/Month | Bandwidth | Build Minutes |
|----------|-------------------|-----------|---------------|
| **GitHub Gist** | Unlimited | N/A | N/A |
| **Netlify** | Unlimited | 100 GB | 300 minutes |
| **Vercel** | Unlimited | 100 GB | 6000 minutes |

## Security Notes

1. **API Tokens**: Never commit tokens to Git (they're in `.gitignore`)
2. **Token Permissions**: Use minimum required scopes
3. **Token Rotation**: Regenerate tokens periodically
4. **Public Websites**: All deployed sites are publicly accessible
5. **Content Review**: Review AI-generated content before deploying

## Production Deployment

For production use of the AI Website Generator app itself:

1. Add deployment tokens to your hosting platform's environment variables
2. Update `NEXTAUTH_URL` to match your domain
3. Ensure MongoDB allows connections from your hosting provider
4. See [DEPLOYMENT.md](./DEPLOYMENT.md) for full app deployment guide

## Advanced: Custom Domains

### Netlify
1. Deploy your site
2. Go to Site Settings → Domain Management
3. Add custom domain
4. Update DNS records as instructed

### Vercel
1. Deploy your site
2. Go to Project Settings → Domains
3. Add custom domain
4. Configure DNS

### GitHub Pages (Gist)
- GitHub Gists don't support custom domains directly
- Use a service like Cloudflare Workers or Netlify redirects

## FAQ

**Q: Can I edit deployed websites?**
A: No, each deployment creates a new immutable version. Generate a new version and deploy again.

**Q: How long do deployed sites stay live?**
A: Permanently, unless you manually delete them from the platform dashboard.

**Q: Can I see deployment history?**
A: Yes, check your dashboard on each platform (Netlify, Vercel, GitHub Gists).

**Q: Are there any costs?**
A: Free tiers are generous. You may need paid plans for high-traffic sites.

**Q: Can I deploy to my own server?**
A: Yes, download the ZIP and upload to any web host that serves static HTML.

**Q: Which platform should I choose?**
A: 
- **Testing/Demos**: GitHub Gist (instant, free, easy)
- **Production**: Netlify or Vercel (CDN, analytics, custom domains)
- **No account**: Download ZIP and use any static host

## Support

- **GitHub**: https://docs.github.com/en/rest/gists
- **Netlify**: https://docs.netlify.com/
- **Vercel**: https://vercel.com/docs
