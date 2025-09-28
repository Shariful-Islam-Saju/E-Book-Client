# Meta Pixel and TikTok Integration Setup

This document provides comprehensive instructions for setting up Meta Pixel and TikTok tracking in your e-book client application.

## Overview

The tracking system includes:

- **Meta Pixel (Facebook)**: Tracks user interactions for Facebook advertising optimization
- **TikTok Pixel**: Tracks user interactions for TikTok advertising optimization
- **Production-ready implementation** with error handling and environment configuration

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Base URL for API calls
NEXT_PUBLIC_BASE_URL=your_api_base_url

# Meta Pixel Configuration
# Get your Pixel ID from Facebook Business Manager > Events Manager > Data Sources > Pixels
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id
# Optional test event code for Events Manager real-time view
NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE=your_test_event_code
# Explicitly toggle Meta Pixel test mode (defaults to on in non-production when a test code is set)
NEXT_PUBLIC_META_PIXEL_ENABLE_TEST_MODE=false

# TikTok Pixel Configuration
# Get your Pixel ID from TikTok Ads Manager > Assets > Events > Web Events
NEXT_PUBLIC_TIKTOK_PIXEL_ID=your_tiktok_pixel_id

# Optional: Enable/disable tracking in development
NEXT_PUBLIC_ENABLE_TRACKING=true
```

## Getting Your Pixel IDs

### Meta Pixel ID

1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to **Events Manager** > **Data Sources** > **Pixels**
3. Create a new pixel or select an existing one
4. Copy the Pixel ID (format: 1234567890123456)

### TikTok Pixel ID

1. Go to [TikTok Ads Manager](https://ads.tiktok.com/)
2. Navigate to **Assets** > **Events** > **Web Events**
3. Create a new pixel or select an existing one
4. Copy the Pixel ID (format: C1234567890ABCDEF)

## Implementation Details

### Files Added/Modified

1. **`src/lib/tracking.ts`** - Core tracking utilities
2. **`src/components/TrackingProvider.tsx`** - React context provider
3. **`src/app/layout.tsx`** - Integration in root layout
4. **`src/components/LeadForm.tsx`** - Lead generation tracking
5. **`src/components/ebook/EBooksPage.tsx`** - Ebook view tracking
6. **`src/app/page.tsx`** - Home page tracking
7. **`src/app/ebooks/page.tsx`** - Ebooks list tracking
8. **`src/app/ebooks/[id]/page.tsx`** - Individual ebook tracking
9. **`next.config.ts`** - Next.js configuration updates

### Tracking Events Implemented

#### Automatic Events

- **PageView**: Tracked on every page load
- **ViewContent**: Tracked when users view ebook details
- **Lead**: Tracked when users submit the download form
- **Purchase**: Tracked when users successfully download an ebook

#### Event Parameters

- `content_name`: Ebook title or page name
- `content_category`: "Ebook" for ebook-related events
- `content_ids`: Array containing ebook ID
- `value`: Monetary value (0 for free ebooks)
- `currency`: "USD" (configurable)

## Usage

### Using the Tracking Hook

```tsx
import { useTracking } from "@/components/TrackingProvider";

function MyComponent() {
  const { trackPageView, trackLead, trackEbookView, trackEbookDownload } =
    useTracking();

  // Track page view
  useEffect(() => {
    trackPageView("My Page");
  }, [trackPageView]);

  // Track lead generation
  const handleFormSubmit = () => {
    trackLead("Contact Form");
  };

  // Track ebook view
  const handleEbookView = (title: string, id: string) => {
    trackEbookView(title, id);
  };

  // Track download
  const handleDownload = (title: string, id: string, value: number) => {
    trackEbookDownload(title, id, value);
  };
}
```

### Direct API Usage

```tsx
import { trackingManager } from "@/lib/tracking";

// Track custom events
trackingManager.trackMetaPixel({
  event: "CustomEvent",
  parameters: { custom_param: "value" },
});

trackingManager.trackTikTok({
  event: "CustomEvent",
  parameters: { custom_param: "value" },
});

// Track both platforms
trackingManager.trackBoth({
  event: "CustomEvent",
  parameters: { custom_param: "value" },
});
```

## Production Considerations

### Performance

- Scripts are loaded asynchronously to prevent blocking
- Error handling prevents tracking failures from affecting user experience
- Lazy initialization only occurs on client-side

### Privacy & Compliance

- Tracking only occurs when pixel IDs are provided
- No personal data is sent to tracking platforms
- Consider implementing cookie consent if required by your jurisdiction

### Error Handling

- All tracking calls are wrapped in try-catch blocks
- Failed tracking attempts are logged to console in development
- Tracking failures don't affect application functionality

### Testing

- Use browser developer tools to verify pixel firing
- Check Facebook Pixel Helper extension for Meta Pixel
- Check TikTok Pixel Helper for TikTok Pixel
- Test in incognito mode to avoid cached data

## Verification

### Meta Pixel Verification

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc).
2. Visit your website in a fresh browser session (no ad blockers) and interact with tracked features.
3. Confirm the helper reports your pixel ID and the expected events (PageView, Lead, Purchase, etc.).
4. To monitor real-time activity in Events Manager, set a `NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE` and turn on test mode. All queued events automatically enrich themselves with your test code until you disable test mode or remove the code.
5. Before launching, update the `.env` so that `NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE` is empty (or unset) and `NEXT_PUBLIC_META_PIXEL_ENABLE_TEST_MODE` is `false`. Otherwise Facebook will classify production events as test traffic.

### TikTok Pixel Verification

1. Install [TikTok Pixel Helper](https://chrome.google.com/webstore/detail/tiktok-pixel-helper/ckjdnjnkddfjihjcdjfjldkckncijfdc) Chrome extension
2. Visit your website
3. Check that events are firing correctly

### Console Verification

Open browser console and look for:

- `trackingManager` initialization logs or warnings about missing pixel IDs
- No errors related to blocked scripts or missing `fbq` / `ttq`
- Optional: run `debugTracking.runAllChecks()` in the console to emit a full suite of test events (includes the configured test event code automatically)

## Troubleshooting

### Common Issues

1. **Pixels not firing**

   - Check environment variables are set correctly
   - Verify pixel IDs are valid
   - Check browser console for errors

2. **TypeScript errors**

   - Ensure all dependencies are installed
   - Check that @types/node is installed

3. **Script loading issues**
   - Check network connectivity
   - Verify external script URLs are accessible
   - Check for ad blockers

### Debug Mode

Set `NEXT_PUBLIC_ENABLE_TRACKING=false` in development to disable tracking for testing.

## Security Notes

- Never commit `.env.local` file to version control
- Use environment-specific pixel IDs for staging/production
- Regularly audit tracking implementation for compliance
- Consider implementing data retention policies

## Support

For issues related to:

- **Meta Pixel**: Check [Facebook Business Help Center](https://www.facebook.com/business/help)
- **TikTok Pixel**: Check [TikTok Ads Help Center](https://ads.tiktok.com/help)
- **Implementation**: Review this documentation and code comments
