# Purchase Event Tracking Fix

## Problem Summary

Despite having 50+ ebook downloads in the database and 5000+ pixel impressions, only **1 Purchase event** was being recorded in Meta Pixel.

## Root Causes Identified

### 1. **Meta Pixel Event Deduplication**

Meta Pixel was treating all Purchase events as duplicates because:

- Events had identical parameters (same `content_name`, `value`, `currency`, etc.)
- No unique `event_id` or `eventID` parameter was being sent
- No timestamp differentiation between events

**Impact**: Meta's deduplication algorithm was filtering out what it thought were duplicate events, only counting the first one.

### 2. **Unstable Function References in TrackingProvider**

The `trackEbookDownload` function was being recreated on every render:

```tsx
// BEFORE: New function created on every render
const contextValue: TrackingContextType = {
  trackEbookDownload: (title, id, value, currency) =>
    trackingManager.trackEbookDownload(title, id, value, currency),
};
```

**Impact**: When used in `useEffect` dependency arrays, this caused unpredictable behavior - effects might fire multiple times or not at all.

### 3. **Problematic useEffect Dependency Array**

In `ThankYou.tsx`, the useEffect included the tracking function in its dependencies:

```tsx
// BEFORE: Function reference changes caused effect issues
useEffect(() => {
  // tracking code
}, [ebookId, ebookTitle, ebookPrice, currency, trackEbookDownload]);
```

**Impact**: Combined with issue #2, this could cause the effect to fire at the wrong times or skip firing entirely.

## Solutions Implemented

### ✅ 1. Added Unique Event IDs to Purchase Events

**File**: `E-Book-Client/src/lib/tracking.ts`

Added unique identifiers to each Purchase event:

```typescript
// Generate unique event ID: ebookId_timestamp_random
const eventId = `${ebookId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
const timestamp = Math.floor(Date.now() / 1000);

parameters: {
  // ... existing parameters
  eventID: eventId,        // Meta Pixel deduplication key
  event_id: eventId,       // Alternative parameter name
  event_time: timestamp,   // When the event occurred
  source_url: window.location.href,
}
```

**Benefits**:

- Each download gets a unique `eventID`, preventing Meta deduplication
- Timestamp tracking for analytics
- Source URL for debugging and tracking user journey

### ✅ 2. Memoized Tracking Functions with useCallback

**File**: `E-Book-Client/src/components/TrackingProvider.tsx`

Wrapped all tracking functions in `useCallback` to ensure stable references:

```typescript
const trackEbookDownload = useCallback(
  (ebookTitle: string, ebookId: string, value?: number, currency?: string) => {
    trackingManager.trackEbookDownload(ebookTitle, ebookId, value, currency);
  },
  []
);

const contextValue = useMemo(
  () => ({
    trackPageView,
    trackLead,
    trackEbookView,
    trackEbookDownload,
    trackRegistration,
  }),
  [
    trackPageView,
    trackLead,
    trackEbookView,
    trackEbookDownload,
    trackRegistration,
  ]
);
```

**Benefits**:

- Functions maintain the same reference across renders
- No more unnecessary re-renders
- Predictable behavior in useEffect dependencies

### ✅ 3. Fixed useEffect Implementation in Thank You Page

**File**: `E-Book-Client/src/components/ThankYou.tsx`

Improved the Purchase event tracking logic:

```typescript
const hasTracked = useRef(false); // Prevent double-firing

useEffect(() => {
  // Prevent double-firing in React StrictMode/development
  if (hasTracked.current) {
    console.log("⚠️ Purchase event already tracked, skipping...");
    return;
  }

  if (ebookId && ebookTitle && ebookPrice) {
    const price = parseFloat(ebookPrice);
    if (!isNaN(price)) {
      trackEbookDownload(ebookTitle, ebookId, price, currency);
      hasTracked.current = true;
    }
  }
}, []); // Empty dependency array - fire only once on mount
```

**Benefits**:

- Event fires exactly once per page visit
- Prevents double-firing in React StrictMode (development)
- Better error handling and logging
- No dependency issues

### ✅ 4. Enhanced Logging for Debugging

Added comprehensive console logging throughout the tracking flow:

```typescript
// In tracking.ts
console.log("🎯 Tracking Purchase Event:", {
  eventId,
  ebookTitle,
  ebookId,
  value,
  currency: validCurrency,
  timestamp: new Date().toISOString(),
});

// In ThankYou.tsx
console.log("📊 Thank You Page - Ebook Data:", {
  ebookId,
  ebookTitle,
  ebookPrice,
  currency,
});
```

**Benefits**:

- Easy debugging in browser console
- Track event flow in real-time
- Identify missing parameters quickly

## Testing Instructions

### 1. **Test in Browser Console**

1. Open your site and complete an ebook download
2. Open browser DevTools → Console
3. Look for these log messages:
   - `📊 Thank You Page - Ebook Data:` - Confirms thank-you page received parameters
   - `✅ Firing Purchase event with params:` - Confirms tracking attempt
   - `🎯 Tracking Purchase Event:` - Shows the actual event being sent with unique ID

### 2. **Verify in Meta Events Manager**

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager2)
2. Select your pixel
3. Go to "Test Events" tab
4. Complete a download on your site
5. You should see a **Purchase** event appear with:
   - `event_name`: Purchase
   - `content_name`: [Your ebook title]
   - `value`: [Price]
   - `currency`: BDT (or your currency)
   - `event_id`: [Unique ID]

### 3. **Test Multiple Downloads**

1. Download different ebooks or the same ebook multiple times
2. Each download should generate a **separate Purchase event** in Meta Pixel
3. Check that the `event_id` is different for each event

## Expected Behavior After Fix

### Before:

- ❌ 50+ downloads = 1 Purchase event

### After:

- ✅ Each download = 1 unique Purchase event
- ✅ Unique `event_id` prevents false deduplication
- ✅ All events tracked in Meta Events Manager
- ✅ Accurate conversion tracking

## Meta Pixel Event Deduplication Logic

Meta Pixel uses the following for deduplication:

1. **event_id/eventID**: If same event_id is sent multiple times within 48 hours, only counted once
2. **Event fingerprinting**: Similar events from same user/browser within short time window may be deduplicated

**Our fix**: Each download generates a unique `event_id` combining:

- Ebook ID
- Timestamp (milliseconds)
- Random string

This ensures **no two downloads** will have the same event_id.

## File Changes Summary

| File                   | Changes Made                                                              |
| ---------------------- | ------------------------------------------------------------------------- |
| `TrackingProvider.tsx` | ✅ Added `useCallback` and `useMemo` for stable function references       |
| `tracking.ts`          | ✅ Added unique `event_id`, `event_time`, and enhanced logging            |
| `ThankYou.tsx`         | ✅ Fixed `useEffect`, added `useRef` for tracking state, improved logging |

## Monitoring and Validation

### Console Logs to Watch For:

- ✅ `📊 Thank You Page - Ebook Data:` - Parameters received correctly
- ✅ `✅ Firing Purchase event with params:` - Event triggered
- ✅ `🎯 Tracking Purchase Event:` - Event sent with unique ID
- ⚠️ `⚠️ Purchase event already tracked, skipping...` - Duplicate prevention working
- ❌ `❌ Invalid price value:` - Price parsing issue
- ⚠️ `⚠️ Missing required parameters:` - URL parameters not passed

### Meta Pixel Network Requests:

1. Open DevTools → Network tab
2. Filter by `facebook.com/tr`
3. Complete a download
4. You should see a request with:
   - `ev=Purchase` parameter
   - Your unique `event_id`
   - All product data

## Additional Improvements Made

1. **Better error handling**: Invalid prices and missing parameters are logged
2. **React StrictMode compatibility**: `useRef` prevents double-firing in development
3. **Source URL tracking**: Helps identify which page triggered the event
4. **Timestamp tracking**: Unix timestamp for event occurrence

## Troubleshooting

### If Purchase events still don't appear:

1. **Check URL parameters**: Ensure `/thank-you` page receives `id`, `title`, `price`, `currency`
2. **Check console logs**: Look for error messages or warnings
3. **Verify Meta Pixel ID**: Ensure `NEXT_PUBLIC_META_PIXEL_ID` is set correctly
4. **Check Network tab**: Verify requests to `facebook.com/tr` are being sent
5. **Wait 1-2 minutes**: Events can take a moment to appear in Events Manager

### If events are duplicating:

- The `hasTracked` ref should prevent this
- Check if component is mounting multiple times
- Verify React StrictMode behavior in development vs. production

## Next Steps

1. **Deploy these changes** to your production environment
2. **Test with real downloads** to verify Purchase events are tracked
3. **Monitor Meta Events Manager** for 24-48 hours to confirm all events are coming through
4. **Compare database download count** with Meta Pixel Purchase count - they should match

## Questions or Issues?

If you still experience tracking issues after implementing these fixes:

1. Check the browser console for error messages
2. Use Meta Pixel Helper Chrome extension to verify pixel is firing
3. Check Network tab for Facebook tracking requests
4. Verify test event code (if using test mode)
