// Meta Pixel and TikTok tracking utilities
declare global {
  interface Window {
    fbq: any;
    ttq: any;
  }
}

export interface TrackingEvent {
  event: string;
  parameters?: Record<string, any>;
}

export interface MetaPixelEvent extends TrackingEvent {
  event:
    | "PageView"
    | "ViewContent"
    | "Lead"
    | "Purchase"
    | "AddToCart"
    | "InitiateCheckout"
    | "CompleteRegistration";
  parameters?: {
    content_name?: string;
    content_category?: string;
    content_type?: string;
    value?: number;
    currency?: string;
    content_ids?: string[];
    contents?: Array<{
      id: string;
      quantity: number;
      item_price?: number;
    }>;
    num_items?: number;
    delivery_category?: string;
    test_event_code?: string;
    [key: string]: any;
  };
}

export interface TikTokEvent extends TrackingEvent {
  event:
    | "ViewContent"
    | "ClickButton"
    | "SubmitForm"
    | "CompleteRegistration"
    | "Purchase"
    | "AddToCart"
    | "Lead";
  parameters?: {
    content_name?: string;
    content_category?: string;
    value?: number;
    currency?: string;
    content_id?: string;
    [key: string]: any;
  };
}

class TrackingManager {
  private metaPixelId: string | null =
    process.env.NEXT_PUBLIC_META_PIXEL_ID ?? null;
  private tiktokPixelId: string | null =
    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? null;
  private isInitializing = false;
  private testEventCode: string | null =
    process.env.NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE ?? null;
  private useMetaTestMode: boolean;
  private metaEventQueue: MetaPixelEvent[] = [];
  private tiktokEventQueue: TikTokEvent[] = [];
  private metaReady = false;
  private tiktokReady = false;
  private metaRetryTimer: number | null = null;
  private tiktokRetryTimer: number | null = null;

  constructor() {
    const explicitTestMode =
      process.env.NEXT_PUBLIC_META_PIXEL_ENABLE_TEST_MODE === "true";

    this.useMetaTestMode =
      explicitTestMode ||
      (!explicitTestMode &&
        process.env.NODE_ENV !== "production" &&
        !!this.testEventCode);
  }

  private getMetaEventParameters(
    parameters?: MetaPixelEvent["parameters"]
  ): MetaPixelEvent["parameters"] | undefined {
    const shouldAttachTestCode = this.useMetaTestMode && this.testEventCode;

    if (!shouldAttachTestCode) {
      return parameters;
    }

    return {
      ...parameters,
      test_event_code: this.testEventCode!,
    };
  }

  private emitMetaPixelEvent(event: MetaPixelEvent): void {
    if (typeof window === "undefined" || !window.fbq) {
      return;
    }

    const parameters = this.getMetaEventParameters(event.parameters);

    if (parameters && Object.keys(parameters).length > 0) {
      window.fbq("track", event.event, parameters);
    } else {
      window.fbq("track", event.event);
    }
  }

  private flushMetaEventQueue(): void {
    if (typeof window === "undefined" || !window.fbq) {
      return;
    }

    while (this.metaEventQueue.length > 0) {
      const queuedEvent = this.metaEventQueue.shift();
      if (queuedEvent) {
        this.emitMetaPixelEvent(queuedEvent);
      }
    }
  }

  private emitTikTokEvent(event: TikTokEvent): void {
    if (typeof window === "undefined" || !window.ttq) {
      return;
    }

    window.ttq("track", event.event, event.parameters);
  }

  private flushTikTokEventQueue(): void {
    if (typeof window === "undefined" || !window.ttq) {
      return;
    }

    while (this.tiktokEventQueue.length > 0) {
      const queuedEvent = this.tiktokEventQueue.shift();
      if (queuedEvent) {
        this.emitTikTokEvent(queuedEvent);
      }
    }
  }

  private loadScript(src: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById(id)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

      document.head.appendChild(script);
    });
  }

  private async initMetaPixel(): Promise<void> {
    if (!this.metaPixelId || this.metaReady) {
      return;
    }

    if (!window.fbq) {
      if (!this.metaRetryTimer) {
        this.metaRetryTimer = window.setTimeout(() => {
          this.metaRetryTimer = null;
          void this.initMetaPixel();
        }, 200);
      }
      return;
    }

    this.metaReady = true;
    this.flushMetaEventQueue();
  }

  private async initTikTokPixel(): Promise<void> {
    if (!this.tiktokPixelId || this.tiktokReady) {
      return;
    }

    window.ttq =
      window.ttq ||
      function (...args: any[]) {
        (window.ttq.q = window.ttq.q || []).push(args);
      };

    try {
      await this.loadScript(
        `https://analytics.tiktok.com/i18n/pixel/events.js`,
        "tiktok-pixel-script"
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      window.ttq("init", this.tiktokPixelId);
      window.ttq("track", "ViewContent");

      this.tiktokReady = true;
      this.flushTikTokEventQueue();
    } catch (error) {
      console.error("Failed to initialize TikTok pixel:", error);
      this.tiktokReady = false;
      if (!this.tiktokRetryTimer) {
        this.tiktokRetryTimer = window.setTimeout(() => {
          this.tiktokRetryTimer = null;
          void this.initTikTokPixel();
        }, 1000);
      }
      throw error;
    }
  }

  async initialize(): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    if (this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      await Promise.allSettled([this.initMetaPixel(), this.initTikTokPixel()]);
    } catch (error) {
      console.error("Tracking initialization failed:", error);
    } finally {
      this.isInitializing = false;
    }
  }

  trackMetaPixel(event: MetaPixelEvent): void {
    if (typeof window === "undefined") {
      return;
    }

    if (!this.metaPixelId) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[tracking] Meta Pixel ID not configured. Skipping event "${event.event}".`
        );
      }
      return;
    }

    if (!this.metaReady || !window.fbq) {
      this.metaEventQueue.push(event);
      void this.initialize();
      return;
    }

    try {
      this.emitMetaPixelEvent(event);
    } catch (error) {
      console.error("Failed to track Meta Pixel event:", error);
    }
  }

  trackTikTok(event: TikTokEvent): void {
    if (typeof window === "undefined") {
      return;
    }

    if (!this.tiktokPixelId) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[tracking] TikTok Pixel ID not configured. Skipping event "${event.event}".`
        );
      }
      return;
    }

    if (!this.tiktokReady || !window.ttq) {
      this.tiktokEventQueue.push(event);
      void this.initialize();
      return;
    }

    try {
      this.emitTikTokEvent(event);
    } catch (error) {
      console.error("Failed to track TikTok event:", error);
    }
  }

  trackBoth(event: MetaPixelEvent & TikTokEvent): void {
    this.trackMetaPixel(event);
    this.trackTikTok(event);
  }

  // Convenience methods for common events
  trackPageView(pageName?: string): void {
    this.trackMetaPixel({
      event: "PageView",
      parameters: pageName ? { content_name: pageName } : undefined,
    });
    // Track ViewContent for TikTok
    this.trackTikTok({
      event: "ViewContent",
      parameters: pageName ? { content_name: pageName } : undefined,
    });
  }

  trackLead(formName?: string): void {
    this.trackBoth({
      event: "Lead",
      parameters: formName ? { content_name: formName } : undefined,
    });
  }

  trackEbookView(
    ebookTitle: string,
    ebookId: string,
    price?: number,
    currency: string = "BDT"
  ): void {
    this.trackBoth({
      event: "ViewContent",
      parameters: {
        content_name: ebookTitle,
        content_category: "Ebook",
        content_type: "product",
        content_ids: [ebookId],
        value: price || 0,
        currency: currency,
        contents: price
          ? [
              {
                id: ebookId,
                quantity: 1,
                item_price: price,
              },
            ]
          : undefined,
        delivery_category: "digital_download",
      },
    });
  }

  trackEbookDownload(
    ebookTitle: string,
    ebookId: string,
    value?: number
  ): void {
    this.trackBoth({
      event: "Purchase",
      parameters: {
        content_name: ebookTitle,
        content_category: "Ebook",
        content_ids: [ebookId],
        value: value || 0,
        currency: "USD",
      },
    });
  }

  trackRegistration(): void {
    this.trackBoth({
      event: "CompleteRegistration",
    });
  }
}

// Export singleton instance
export const trackingManager = new TrackingManager();

// Export convenience functions
export const trackPageView = (pageName?: string) =>
  trackingManager.trackPageView(pageName);
export const trackLead = (formName?: string) =>
  trackingManager.trackLead(formName);
export const trackEbookView = (
  ebookTitle: string,
  ebookId: string,
  price?: number,
  currency: string = "BDT"
) => trackingManager.trackEbookView(ebookTitle, ebookId, price, currency);
export const trackEbookDownload = (
  ebookTitle: string,
  ebookId: string,
  value?: number
) => trackingManager.trackEbookDownload(ebookTitle, ebookId, value);
export const trackRegistration = () => trackingManager.trackRegistration();
