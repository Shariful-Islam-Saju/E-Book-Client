# Meta Pixel Troubleshooting Guide

## 🚨 **IMMEDIATE STEPS TO FIX META PIXEL DETECTION**

### 1. **Check Environment Variables**

Make sure your `.env.local` file has the correct format:

```env
NEXT_PUBLIC_META_PIXEL_ID=1234567890123456
```

**Important:** No quotes, no spaces, just the number!

### 2. **Clear Browser Cache & Restart**

- Clear browser cache completely
- Restart your development server (`npm run dev` or `pnpm dev`)
- Open in incognito/private mode

### 3. **Check Console Logs**

Open browser console and look for:

```bash
✅ "Script loaded: meta-pixel-script"
✅ "Meta Pixel initialized with ID: 1234567890123456"
```

### 4. **Use Debug Utility**

In browser console, run:

```javascript
// Check Meta Pixel status
debugTracking.checkMetaPixel();

// Test Meta Pixel
debugTracking.testMetaPixel();

// Run all checks
debugTracking.runAllChecks();
```

---

## 🔍 **COMMON ISSUES & SOLUTIONS**

### **Issue 1: Meta Pixel Helper Shows "No Pixel Found"**

**Causes:**

- Environment variable not set correctly
- Script not loading
- Pixel ID format wrong

**Solutions:**

1. **Verify Environment Variable:**

   ```bash
   # In browser console
   console.log(process.env.NEXT_PUBLIC_META_PIXEL_ID);
   ```

2. **Check Script Loading:**

   ```bash
   # In browser console
   document.getElementById("meta-pixel-script");
   ```

3. **Verify Pixel ID Format:**
   - Should be 15-16 digits
   - No letters or special characters
   - Example: `1234567890123456`

### **Issue 2: Script Loads But No Events Fire**

**Causes:**

- fbq function not properly initialized
- Events not being called
- Timing issues

**Solutions:**

1. **Check fbq Function:**

   ```javascript
   // In browser console
   console.log(typeof window.fbq);
   console.log(window.fbq);
   ```

2. **Manual Event Test:**
   ```javascript
   // In browser console
   window.fbq("track", "PageView");
   ```

### **Issue 3: Development vs Production**

**Development Issues:**

- Environment variables not loaded
- Hot reload interfering
- Localhost not whitelisted

**Solutions:**

1. **Restart Development Server:**

   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   # or
   pnpm dev
   ```

2. **Check .env.local Location:**
   ```
   E-Book-Client/
   ├── .env.local          ← Should be here
   ├── src/
   └── package.json
   ```

---

## 🛠️ **STEP-BY-STEP DEBUGGING**

### **Step 1: Verify Environment Setup**

```bash
# 1. Check if .env.local exists
ls -la .env.local

# 2. Check content (don't commit this!)
cat .env.local

# 3. Restart server
npm run dev
```

### **Step 2: Browser Console Debugging**

```javascript
// 1. Check environment variable
console.log("Meta Pixel ID:", process.env.NEXT_PUBLIC_META_PIXEL_ID);

// 2. Check if fbq exists
console.log("fbq exists:", typeof window.fbq !== "undefined");

// 3. Check script element
const script = document.getElementById("meta-pixel-script");
console.log("Script exists:", !!script);
console.log("Script src:", script?.src);

// 4. Run debug utility
debugTracking.checkMetaPixel();
```

### **Step 3: Network Tab Verification**

1. Open DevTools → Network tab
2. Reload page
3. Look for: `connect.facebook.net/en_US/fbevents.js`
4. Check if it loads successfully (Status 200)

### **Step 4: Meta Pixel Helper Verification**

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Reload page
3. Click the extension icon
4. Should show your pixel ID and events

---

## 🚀 **QUICK FIXES**

### **Fix 1: Force Reinitialize**

```javascript
// In browser console
if (window.fbq) {
  window.fbq("init", "YOUR_PIXEL_ID");
  window.fbq("track", "PageView");
}
```

### **Fix 2: Check Pixel ID Validity**

- Go to [Facebook Business Manager](https://business.facebook.com/)
- Navigate to Events Manager → Data Sources → Pixels
- Copy the exact Pixel ID (no extra characters)

### **Fix 3: Test with Hardcoded ID**

Temporarily hardcode the pixel ID in `tracking.ts`:

```typescript
// In tracking.ts constructor
this.metaPixelId = "YOUR_ACTUAL_PIXEL_ID"; // Temporary hardcode
```

---

## 📊 **VERIFICATION CHECKLIST**

- [ ] Environment variable set correctly
- [ ] Development server restarted
- [ ] Browser cache cleared
- [ ] Console shows initialization logs
- [ ] Script loads in Network tab
- [ ] fbq function exists
- [ ] Meta Pixel Helper detects pixel
- [ ] Events fire in console

---

## 🆘 **STILL NOT WORKING?**

### **Last Resort: Manual Implementation**

Add this directly to your `layout.tsx` for testing:

```tsx
// Add this in <head> section of layout.tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
      fbq('track', 'PageView');
    `,
  }}
/>
```

---

## 📞 **GET HELP**

If still not working, provide this info:

1. Console logs from `debugTracking.runAllChecks()`
2. Screenshot of Meta Pixel Helper
3. Your `.env.local` format (without the actual ID)
4. Browser and version
5. Development server logs
