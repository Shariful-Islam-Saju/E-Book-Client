// Debug utility for Meta Pixel and TikTok tracking
export const debugTracking = {
  // Check if Meta Pixel is loaded and working
  checkMetaPixel: () => {
    console.log("=== META PIXEL DEBUG ===");
    console.log("Window.fbq exists:", typeof window.fbq !== "undefined");
    console.log("Window.fbq.q exists:", window.fbq?.q ? "Yes" : "No");
    console.log("Queue length:", window.fbq?.q?.length || 0);
    console.log("Pixel ID from env:", process.env.NEXT_PUBLIC_META_PIXEL_ID);

    if (window.fbq) {
      console.log("Meta Pixel function:", window.fbq.toString());
    }

    // Check if script is loaded
    const script = document.getElementById("meta-pixel-script");
    console.log("Script element exists:", !!script);
    if (script) {
      console.log("Script src:", script.getAttribute("src"));
      console.log("Script loaded:", script.readyState || "unknown");
    }
  },

  // Check if TikTok Pixel is loaded and working
  checkTikTokPixel: () => {
    console.log("=== TIKTOK PIXEL DEBUG ===");
    console.log("Window.ttq exists:", typeof window.ttq !== "undefined");
    console.log("Window.ttq.q exists:", window.ttq?.q ? "Yes" : "No");
    console.log("Queue length:", window.ttq?.q?.length || 0);
    console.log("Pixel ID from env:", process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);

    if (window.ttq) {
      console.log("TikTok Pixel function:", window.ttq.toString());
    }

    // Check if script is loaded
    const script = document.getElementById("tiktok-pixel-script");
    console.log("Script element exists:", !!script);
    if (script) {
      console.log("Script src:", script.getAttribute("src"));
      console.log("Script loaded:", script.readyState || "unknown");
    }
  },

  // Test Meta Pixel with a simple event
  testMetaPixel: () => {
    if (window.fbq) {
      console.log("Testing Meta Pixel...");
      window.fbq("track", "TestEvent", {
        content_name: "Debug Test",
        test: true,
      });
      console.log("Meta Pixel test event sent");
    } else {
      console.error("Meta Pixel not available for testing");
    }
  },

  // Test TikTok Pixel with a simple event
  testTikTokPixel: () => {
    if (window.ttq) {
      console.log("Testing TikTok Pixel...");
      window.ttq("track", "TestEvent", {
        content_name: "Debug Test",
        test: true,
      });
      console.log("TikTok Pixel test event sent");
    } else {
      console.error("TikTok Pixel not available for testing");
    }
  },

  // Run all debug checks
  runAllChecks: () => {
    console.log("🔍 RUNNING TRACKING DEBUG CHECKS...");
    this.checkMetaPixel();
    this.checkTikTokPixel();
    console.log("✅ Debug checks complete");
  },
};

// Make it available globally for easy debugging
if (typeof window !== "undefined") {
  (window as any).debugTracking = debugTracking;
}
