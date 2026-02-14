# Troubleshooting: Site Not Loading

## SSL Active But Site Not Showing

If SSL certificate is active in Vercel but `znossier.com` isn't loading your site, try these steps:

### 1. Check DNS Propagation

Even though nameservers are changed, DNS can take time to propagate globally.

**Test DNS:**
- Visit: https://www.whatsmydns.net/#A/znossier.com
- Check if A records are showing Vercel IPs
- If not, DNS hasn't fully propagated yet

**Quick Test:**
- Try accessing from different network (mobile data vs WiFi)
- Try incognito/private browsing mode

### 2. Clear Browser Cache

Your browser might be caching the old DNS or site:
- **Chrome/Edge**: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
- **Firefox**: Ctrl+Shift+Delete
- **Safari**: Cmd+Option+E
- Or use **Incognito/Private mode**

### 3. Verify Domain Configuration in Vercel

Check in Vercel dashboard:
1. Go to your project → **Settings** → **Domains**
2. Verify `znossier.com` shows:
   - ✅ **Valid Configuration** (not "Invalid" or "Pending")
   - ✅ Status should be "Active" or "Valid"
3. Check if there are any error messages

### 4. Check Domain Assignment

Make sure the domain is assigned to the correct deployment:
1. In Vercel dashboard, go to **Domains**
2. Click on `znossier.com`
3. Verify it's pointing to your project
4. Check if there's a production deployment

### 5. Try Direct IP Access (Temporary Test)

If you have Vercel IP addresses:
- You can temporarily test by editing your hosts file
- This bypasses DNS to test if Vercel is serving correctly

### 6. Check Vercel Deployment Status

1. Go to your project in Vercel
2. Check **Deployments** tab
3. Verify latest deployment is:
   - ✅ **Ready** (not "Building" or "Error")
   - ✅ **Production** deployment
4. Click on the deployment to see if it's live

### 7. Common Issues

**Issue: Domain shows "Invalid Configuration"**
- DNS records might not match exactly
- Wait a bit longer for DNS to propagate
- Double-check nameservers in GoDaddy

**Issue: "Domain not found" or "This site can't be reached"**
- DNS hasn't propagated yet (can take 24-48 hours)
- Try from different network/location
- Check DNS propagation status

**Issue: Site loads but shows old content**
- Browser cache - clear cache and hard refresh (Ctrl+F5 or Cmd+Shift+R)
- CDN cache - wait a few minutes for Vercel CDN to update

**Issue: SSL error or "Not Secure"**
- Wait a few more minutes for SSL to fully activate
- Try accessing `http://znossier.com` (should redirect to HTTPS)

### 8. Force DNS Refresh

**Windows:**
```bash
ipconfig /flushdns
```

**Mac/Linux:**
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

**Or use Google DNS:**
- Change your DNS to 8.8.8.8 and 8.8.4.4 temporarily
- This sometimes helps see changes faster

### 9. Check Vercel Project Settings

1. Go to **Settings** → **General**
2. Verify:
   - Production Branch: `main` (or your default branch)
   - Auto-deploy is enabled
3. Check if there are any build errors

### 10. Test Vercel URL

Try accessing your Vercel-provided URL:
- Should be something like: `znossier.vercel.app` or `znossier-xxx.vercel.app`
- If this works but custom domain doesn't, it's a DNS issue
- If this also doesn't work, there's a deployment issue

## Still Not Working?

If after trying all these steps the site still doesn't load:

1. **Check Vercel Status**: https://vercel-status.com
2. **Check Build Logs**: In Vercel dashboard, check if latest deployment succeeded
3. **Contact Support**: 
   - Vercel has great support in their dashboard
   - Or check their Discord/community

## Quick Checklist

- [ ] DNS propagation checked (whatsmydns.net)
- [ ] Browser cache cleared
- [ ] Tried incognito/private mode
- [ ] Verified domain status in Vercel (Valid/Active)
- [ ] Checked deployment status (Ready/Production)
- [ ] Tested Vercel URL (znossier.vercel.app)
- [ ] Waited at least 1-2 hours after nameserver change
- [ ] Tried from different network/device
