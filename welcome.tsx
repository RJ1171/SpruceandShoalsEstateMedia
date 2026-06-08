"use client";

import Script from "next/script";
import posthog from "posthog-js";
import { useEffect } from "react";

export function Analytics() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

    if (key && typeof window !== "undefined") {
      posthog.init(key, {
        api_host: "https://app.posthog.com",
        capture_pageview: true
      });
    }
  }, []);

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return gaId ? (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  ) : null;
}
