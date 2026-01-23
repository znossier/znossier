# Vercel Deployment Steps

## ✅ Completed
- Code committed to Git
- Code pushed to GitHub: https://github.com/z-nossier/znossier
- Production build verified

## Next Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"** or **"Import Project"**
3. Select **"Import Git Repository"**
4. Choose **GitHub** as your Git provider
5. Find and select the **z-nossier/znossier** repository
6. Click **"Import"**

### 2. Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:
- **Framework Preset**: Next.js ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅
- **Root Directory**: `./` (leave as default)

**Environment Variables**: None needed (Sanity CMS not configured)

### 3. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at a Vercel URL like: `znossier.vercel.app`

### 4. Add Custom Domain

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `znossier.com`
4. Click **"Add"**
5. Vercel will show DNS configuration instructions

### 5. Configure DNS at Your Domain Registrar

**Option A: Use Vercel Nameservers (Recommended - Easiest)**

1. In Vercel dashboard, you'll see nameservers like:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
2. Go to your domain registrar (where you bought znossier.com)
3. Find DNS/Nameserver settings
4. Replace existing nameservers with Vercel's nameservers
5. Save changes

**Option B: Use A/CNAME Records**

1. In Vercel dashboard, you'll see DNS records needed:
   - A record: `@` → Vercel IP addresses
   - CNAME: `www` → `cname.vercel-dns.com`
2. At your domain registrar, add these DNS records
3. Save changes

### 6. Wait for DNS Propagation

- DNS changes can take **24-48 hours** to fully propagate
- Vercel will automatically provision an SSL certificate once DNS is active
- You can check DNS status in Vercel dashboard

### 7. Verify Deployment

Once DNS propagates:
- ✅ Visit `znossier.com` - should load your site
- ✅ Check HTTPS is working (SSL certificate active)
- ✅ Test all features:
  - Navigation
  - Theme toggle (light/dark mode)
  - Smooth scrolling
  - Responsive design
  - All sections loading correctly

## Automatic Deployments

Vercel will automatically deploy when you push to the `main` branch:
```bash
git push origin main
```

## Troubleshooting

- **Build fails**: Check build logs in Vercel dashboard
- **Domain not working**: Verify DNS records are correct
- **SSL not active**: Wait for DNS propagation (up to 48 hours)
- **Site not updating**: Ensure auto-deploy is enabled in project settings

## Support

If you encounter issues:
1. Check Vercel dashboard for error messages
2. Review build logs
3. Verify DNS records are correct
4. Check Vercel status page: https://vercel-status.com
