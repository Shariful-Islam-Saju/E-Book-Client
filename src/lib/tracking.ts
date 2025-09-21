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
    value?: number;
    currency?: string;
    content_ids?: string[];
    num_items?: number;
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
  private metaPixelId: string | null = null;
  private tiktokPixelId: string | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || null;
      this.tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || null;
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
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

      document.head.appendChild(script);
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === "undefined") {
      return;
    }

    try {
      // Initialize Meta Pixel
      if (this.metaPixelId) {
        // Set up fbq function before loading script
        window.fbq =
          window.fbq ||
          function (...args: any[]) {
            (window.fbq.q = window.fbq.q || []).push(args);
          };

        // Load the script
        await this.loadScript(
          `https://connect.facebook.net/en_US/fbevents.js`,
          "meta-pixel-script"
        );

        // Wait a bit for script to fully load
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Initialize Meta Pixel
        window.fbq("init", this.metaPixelId);

        // Track PageView
        window.fbq("track", "PageView");
      }

      // Initialize TikTok Pixel
      if (this.tiktokPixelId) {
        // Set up ttq function before loading script
        window.ttq =
          window.ttq ||
          function (...args: any[]) {
            (window.ttq.q = window.ttq.q || []).push(args);
          };

        // Load the script
        await this.loadScript(
          `https://analytics.tiktok.com/i18n/pixel/events.js`,
          "tiktok-pixel-script"
        );

        // Wait a bit for script to fully load
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Initialize TikTok Pixel
        window.ttq("init", this.tiktokPixelId);
        window.ttq("track", "ViewContent");
      }

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize tracking pixels:", error);
    }
  }

  trackMetaPixel(event: MetaPixelEvent): void {
    if (!this.isInitialized || !window.fbq || !this.metaPixelId) {
      return;
    }

    try {
      window.fbq("track", event.event, event.parameters);
    } catch (error) {
      console.error("Failed to track Meta Pixel event:", error);
    }
  }

  trackTikTok(event: TikTokEvent): void {
    if (!this.isInitialized || !window.ttq || !this.tiktokPixelId) {
      return;
    }

    try {
      window.ttq("track", event.event, event.parameters);
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
    this.trackBoth({
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

  trackEbookView(ebookTitle: string, ebookId: string): void {
    this.trackBoth({
      event: "ViewContent",
      parameters: {
        content_name: ebookTitle,
        content_category: "Ebook",
        content_ids: [ebookId],
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
export const trackEbookView = (ebookTitle: string, ebookId: string) =>
  trackingManager.trackEbookView(ebookTitle, ebookId);
export const trackEbookDownload = (
  ebookTitle: string,
  ebookId: string,
  value?: number
) => trackingManager.trackEbookDownload(ebookTitle, ebookId, value);
export const trackRegistration = () => trackingManager.trackRegistration();
