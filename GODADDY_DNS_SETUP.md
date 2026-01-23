# GoDaddy DNS Configuration for znossier.com

## Step-by-Step Guide

### Option 1: Use Vercel Nameservers (Recommended - Easiest)

This method gives Vercel full control over your DNS, which is the simplest approach.

#### Steps:

1. **Get Vercel Nameservers**
   - After adding `znossier.com` in Vercel dashboard (Settings → Domains)
   - Vercel will display nameservers like:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
   - Copy these nameservers

2. **Update Nameservers in GoDaddy**
   - Log in to [GoDaddy.com](https://godaddy.com)
   - Go to **My Products** → **Domains**
   - Find `znossier.com` and click **DNS** (or **Manage DNS**)
   - Scroll down to **Nameservers** section
   - Click **Change** button
   - Select **Custom** (not "GoDaddy Nameservers")
   - Delete the existing nameservers
   - Add Vercel's nameservers:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`
   - Click **Save**

3. **Wait for Propagation**
   - Changes can take 24-48 hours to propagate
   - Vercel will automatically provision SSL certificate once DNS is active
   - Check status in Vercel dashboard

---

### Option 2: Use A/CNAME Records (Keep GoDaddy DNS)

Use this if you want to keep using GoDaddy's DNS management.

#### Steps:

1. **Get DNS Records from Vercel**
   - After adding `znossier.com` in Vercel dashboard
   - Vercel will show required DNS records:
     - **A Record**: `@` → IP addresses (usually 2-4 IPs)
     - **CNAME Record**: `www` → `cname.vercel-dns.com`

2. **Add Records in GoDaddy**
   - Log in to [GoDaddy.com](https://godaddy.com)
   - Go to **My Products** → **Domains**
   - Find `znossier.com` and click **DNS** (or **Manage DNS**)
   - Scroll to **Records** section

3. **Add A Record for Root Domain**
   - Click **Add** button
   - Select **A** record type
   - **Name**: `@` (or leave blank, or enter `znossier.com`)
   - **Value**: Enter the first IP address from Vercel
   - **TTL**: `600` (or default)
   - Click **Save**
   - **Repeat** for each additional IP address Vercel provides (add multiple A records with same name `@`)

4. **Add CNAME Record for www**
   - Click **Add** button
   - Select **CNAME** record type
   - **Name**: `www`
   - **Value**: `cname.vercel-dns.com` (or what Vercel specifies)
   - **TTL**: `600` (or default)
   - Click **Save**

5. **Remove Conflicting Records** (if any)
   - If there are existing A or CNAME records for `@` or `www`, delete them first
   - Old records can conflict with Vercel's setup

6. **Wait for Propagation**
   - DNS changes can take 24-48 hours
   - Vercel will provision SSL automatically once DNS is active

---

## Verification

### Check DNS Propagation

You can check if DNS has propagated using:
- [whatsmydns.net](https://www.whatsmydns.net) - Enter `znossier.com` and check A records
- [dnschecker.org](https://dnschecker.org) - Check global DNS propagation

### Check in Vercel Dashboard

1. Go to your project in Vercel
2. Settings → Domains
3. You'll see the status of `znossier.com`:
   - ⏳ **Pending** - DNS not yet configured/propagated
   - ✅ **Valid** - DNS configured correctly, SSL provisioning
   - ✅ **Active** - Fully configured and live

---

## Common Issues

### Issue: "Invalid Configuration" in Vercel
- **Solution**: Double-check DNS records match exactly what Vercel shows
- Make sure you removed old conflicting records

### Issue: Site Not Loading After 48 Hours
- **Solution**: 
  - Verify DNS records are correct in GoDaddy
  - Check DNS propagation status
  - Contact GoDaddy support if records aren't updating

### Issue: SSL Certificate Not Active
- **Solution**: 
  - SSL is automatic once DNS propagates
  - Wait for full DNS propagation (can take up to 48 hours)
  - Check Vercel dashboard for SSL status

### Issue: www.znossier.com Not Working
- **Solution**: 
  - Make sure CNAME record for `www` is added
  - Value should point to `cname.vercel-dns.com` (or Vercel's specified value)

---

## Quick Reference: GoDaddy DNS Location

1. GoDaddy.com → Sign In
2. **My Products** (top menu)
3. **Domains** (left sidebar)
4. Find `znossier.com`
5. Click **DNS** button (or **Manage DNS**)

---

## After Configuration

Once DNS is configured and propagated:
- ✅ `znossier.com` will load your site
- ✅ `www.znossier.com` will redirect to `znossier.com` (if configured)
- ✅ HTTPS/SSL will be active automatically
- ✅ Future Git pushes will auto-deploy to your domain

## Need Help?

- **Vercel Support**: Check project dashboard for error messages
- **GoDaddy Support**: Contact if DNS records aren't saving
- **DNS Issues**: Use DNS checker tools to verify propagation
