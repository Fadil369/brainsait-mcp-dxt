# BrainSAIT.io Domain Setup for Healthcare MCP Extension

## ✅ **Completed Domain Migration**

All references have been updated from `brainsait.com` to `brainsait.io` across:
- Landing page components
- API endpoints
- Email addresses
- SEO meta tags
- Documentation
- Configuration files

## 🌐 **Current Deployment Status**

### **Live URLs**
- **Primary Deployment**: https://058fca02.brainsait-mcp-landing.pages.dev
- **Branch Deployment**: https://alert-fix-1.brainsait-mcp-landing.pages.dev
- **Cloudflare Project**: `brainsait-mcp-landing`

## 🎯 **Required Custom Domain Setup**

### **Primary Domain Configuration**
Add these custom domains to the `brainsait-mcp-landing` Pages project:

1. **mcp.brainsait.io** (Primary Healthcare MCP Landing)
2. **hospital.brainsait.io** (Healthcare Portal)
3. **api.brainsait.io** (API Services)
4. **docs.brainsait.io** (Documentation)
5. **support.brainsait.io** (Support Portal)

### **Cloudflare Dashboard Setup Instructions**

#### **Step 1: Access Cloudflare Pages**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages** section
3. Select **brainsait-mcp-landing** project

#### **Step 2: Add Custom Domains**
For each domain above:
1. Click **Custom domains** tab
2. Click **Add custom domain**
3. Enter domain (e.g., `mcp.brainsait.io`)
4. Click **Continue**
5. Verify DNS settings if prompted

#### **Step 3: SSL/TLS Configuration**
- Ensure **Full (strict)** SSL mode is enabled
- Verify SSL certificates are active for all subdomains
- Enable **Always Use HTTPS**

#### **Step 4: DNS Configuration**
Ensure these CNAME records exist in brainsait.io DNS:
```
mcp.brainsait.io     CNAME   brainsait-mcp-landing.pages.dev
hospital.brainsait.io CNAME   brainsait-mcp-landing.pages.dev  
api.brainsait.io     CNAME   brainsait-mcp-landing.pages.dev
docs.brainsait.io    CNAME   brainsait-mcp-landing.pages.dev
support.brainsait.io CNAME   brainsait-mcp-landing.pages.dev
```

## 📊 **Current Project Status**

### **Existing brainsait.io Subdomains**
✅ Already configured and working:
- `givc.brainsait.io`
- `id.brainsait.io` 
- `doc.brainsait.io`
- `tawnia.brainsait.io`
- `solo-spark.brainsait.io`
- `givc-academy.brainsait.io`
- `wathq.brainsait.io`

### **Pages Projects Ready for Custom Domains**
- **brainsait-mcp-landing** ← 🎯 Current project
- brainsait-marketing
- brainsait-healthcare-platform
- brainsait-nhs

## 🔧 **Technical Configuration**

### **Environment Variables**
```toml
[env.production.vars]
ENVIRONMENT = "production"
DOMAIN = "brainsait.io"

[env.preview.vars]
ENVIRONMENT = "preview"
DOMAIN = "brainsait.io"
```

### **Security Headers**
- CSP updated to allow `api.brainsait.io`
- HTTPS redirects configured
- Security headers properly set

### **Redirects Configuration**
```
/api/* https://api.brainsait.io/:splat 200
/docs/* https://docs.brainsait.io/:splat 302
/support/* https://support.brainsait.io/:splat 302
```

## 🚀 **Post-Domain Setup Actions**

### **1. Verify Deployments**
After domain setup, verify these URLs load correctly:
- https://mcp.brainsait.io
- https://hospital.brainsait.io (will redirect to MCP for now)

### **2. Update DNS Records**
Ensure all CNAME records are properly configured

### **3. SSL Certificate Validation**
Verify SSL certificates are active and valid

### **4. Performance Testing**
- Test loading speeds across all domains
- Verify CDN performance
- Check mobile responsiveness

## 📝 **Repository Status**

### **Branch**: `alert-fix-1`
- ✅ All domain references updated
- ✅ Configuration files updated  
- ✅ Deployed successfully
- ✅ Ready for custom domain attachment

### **Files Modified**
- `src/components/ContactSection.jsx`
- `src/components/WebConnectorsDemo.jsx`
- `_redirects`
- `_headers`
- `index.html`
- `README.md`
- `wrangler.toml`

## 🎉 **Ready for Production**

The BrainSAIT Healthcare MCP Extension landing page is now:
- ✅ **Domain Ready**: All brainsait.io references updated
- ✅ **Deployed**: Live on Cloudflare Pages
- ✅ **Configured**: Security headers and redirects set
- ✅ **Optimized**: Performance-ready for production

**Next Step**: Add custom domains via Cloudflare Dashboard to complete the setup!

---

**Contact**: healthcare@brainsait.io  
**Documentation**: docs.brainsait.io  
**Support**: support.brainsait.io