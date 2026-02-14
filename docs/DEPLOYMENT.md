# Deployment Guide for znossier.com

## Current Status

✅ Code is committed to Git  
✅ Production build is working  
✅ Vercel CLI is installed  

## Next Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to a Git repository**
   - Create a repository on GitHub, GitLab, or Bitbucket
   - Add the remote: `git remote add origin <your-repo-url>`
   - Push: `git push -u origin main`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in (or create account)
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Domain**
   - In your Vercel project dashboard, go to Settings → Domains
   - Add `znossier.com` as your domain
   - Add `www.znossier.com` (optional, for www redirect)
   - Vercel will provide DNS configuration instructions

4. **Update DNS Records**
   
   **Option A: Use Vercel Nameservers (Easiest)**
   - At your domain registrar, update nameservers to:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
   - Vercel will provide exact nameservers in the dashboard
   
   **Option B: Use A/CNAME Records**
   - Add A record: `@` → Vercel IP addresses (provided in dashboard)
   - Add CNAME: `www` → `cname.vercel-dns.com`

5. **Wait for DNS Propagation**
   - DNS changes can take 24-48 hours to propagate
   - Vercel will automatically provision SSL certificate once DNS is active

### Option 2: Deploy via Vercel CLI

Run these commands in the project directory:

```bash
# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Link to a project (if needed)
vercel link

# Add domain (requires Vercel account)
vercel domains add znossier.com
```

**Note:** Domain configuration still requires accessing the Vercel dashboard for DNS setup.

## Verification Checklist

- [ ] Code pushed to Git repository
- [ ] Project deployed to Vercel
- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured at registrar
- [ ] SSL certificate active (automatic via Vercel)
- [ ] Site accessible at znossier.com
- [ ] HTTPS working correctly
- [ ] All site features working (navigation, theme toggle, etc.)

## Troubleshooting

- **Build fails**: Check Vercel build logs in dashboard
- **Domain not working**: Verify DNS records are correct and propagated
- **SSL not active**: Wait for DNS propagation (up to 48 hours)
- **Site not updating**: Check if auto-deploy is enabled in Vercel settings

## Environment Variables

No environment variables are needed since Sanity CMS is not configured. The site uses mock data from `lib/mock-data.ts`.
