# Purchase Event Implementation for Ebook Downloads

## Overview

This document describes the implementation of Facebook Meta Pixel Purchase events for tracking ebook downloads on the `/ebooks/:id` page. The implementation ensures proper tracking of download conversions with accurate pricing and currency information.

## Implementation Details

### 1. Enhanced Tracking Function

The `trackEbookDownload` function has been updated to properly handle Purchase events:

```typescript
trackEbookDownload(
  ebookTitle: string,
  ebookId: string,
  value?: number,
  currency: string = "BDT"
): void {
  this.trackBoth({
    event: "Purchase",
    parameters: {
      content_name: ebookTitle,
      content_category: "Ebook",
      content_ids: [ebookId],
      value: value || 0,
      currency: currency,
    },
  });
}
```

### 2. Updated Component Props

The `LeadForm` component now accepts pricing information:

```typescript
interface LeadFormProps {
  ebookId: string;
  downloadUrl?: string;
  ebookTitle?: string;
  ebookPrice?: number; // NEW: Price for tracking
  currency?: string; // NEW: Currency (defaults to BDT)
}
```

### 3. Event Triggering

The Purchase event is triggered when:

1. User successfully submits the lead form
2. The download link is available
3. The actual file download begins

```typescript
// Track successful download as Purchase event
trackEbookDownload(ebookTitle || "Ebook", ebookId, ebookPrice || 0, currency);
```

### 4. Price Calculation

The price passed to the tracking function is calculated as:

```typescript
ebookPrice={file.bookPrice - file.discount}
```

This ensures the tracked value reflects the actual price paid by the customer.

## Event Parameters

The Purchase event includes the following parameters:

| Parameter          | Type     | Description           | Example                    |
| ------------------ | -------- | --------------------- | -------------------------- |
| `content_name`     | string   | Ebook title           | "Health & Wellness Guide"  |
| `content_category` | string   | Product category      | "Ebook"                    |
| `content_ids`      | string[] | Array of ebook IDs    | ["ebook-123"]              |
| `value`            | number   | Purchase value in BDT | 1200                       |
| `currency`         | string   | Currency code         | "BDT"                      |
| `test_event_code`  | string   | Test mode identifier  | "TEST72918" (in test mode) |

## Testing

### Manual Testing

1. **Open browser console** on any ebook page
2. **Run debug function**:
   ```javascript
   debugTracking.testPurchase();
   ```
3. **Check Facebook Events Manager** for real-time events

### Production Verification

1. **Install Facebook Pixel Helper** Chrome extension
2. **Visit an ebook page** and complete a download
3. **Check the extension** for Purchase events
4. **Verify in Facebook Events Manager** that events appear with correct pricing

### Debug Commands

```javascript
// Test Purchase event specifically
debugTracking.testPurchase();

// Run all tracking tests
debugTracking.runAllChecks();

// Check Meta Pixel status
debugTracking.checkMetaPixel();
```

## Production Considerations

### Currency Consistency

- **Default Currency**: BDT (Bangladeshi Taka)
- **Price Format**: Integer values (e.g., 1200 for ৳1200)
- **Currency Code**: Follows ISO 4217 standard

### Test Mode

When `NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE` is set:

- All Purchase events include `test_event_code` parameter
- Events appear in Facebook Events Manager Test Events section
- Useful for development and testing

### Error Handling

- If `ebookPrice` is not provided, defaults to 0
- If `currency` is not specified, defaults to "BDT"
- Failed tracking attempts are logged to console in development

## Monitoring & Analytics

### Facebook Events Manager

1. **Navigate to**: Events Manager → Data Sources → Pixels
2. **Select your pixel**
3. **Check Test Events** (if in test mode) or **Live Events**
4. **Filter by event type**: "Purchase"

### Key Metrics to Monitor

- **Conversion Rate**: Downloads per page view
- **Revenue Tracking**: Total value of downloads
- **Popular Content**: Which ebooks generate most downloads
- **Geographic Performance**: Download patterns by location

### Custom Audiences

Use Purchase events to create custom audiences:

- **Website Purchasers**: Users who downloaded ebooks
- **High-Value Customers**: Users who downloaded multiple ebooks
- **Lookalike Audiences**: Similar to existing purchasers

## Troubleshooting

### Common Issues

1. **Events not appearing in Facebook Events Manager**

   - Check pixel ID is correct
   - Verify test event code (if in test mode)
   - Wait 1-2 minutes for events to appear

2. **Incorrect pricing in events**

   - Verify `ebookPrice` prop is passed correctly
   - Check price calculation in EBooksPage component
   - Ensure currency parameter is set

3. **Events firing multiple times**
   - Check for duplicate form submissions
   - Verify tracking function is called only once per download

### Debug Steps

1. **Check console logs** for tracking function calls
2. **Verify network requests** to Facebook in DevTools
3. **Test with Facebook Pixel Helper** extension
4. **Run debug functions** in browser console

## Security & Privacy

- **No Personal Data**: Only ebook metadata is tracked
- **GDPR Compliance**: Consider implementing cookie consent
- **Data Retention**: Review Facebook's data retention policies
- **User Consent**: Ensure compliance with local privacy laws

## Future Enhancements

1. **Enhanced Parameters**: Add more detailed product information
2. **Custom Events**: Track additional user interactions
3. **A/B Testing**: Compare different ebook presentations
4. **Attribution**: Track download sources and campaigns
5. **Revenue Optimization**: Use Purchase data for pricing strategies

---

**Last Updated**: $(date)
**Version**: 1.0
**Status**: Production Ready
