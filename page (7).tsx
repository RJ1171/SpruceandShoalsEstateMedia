import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { brand } from "../config/brand";
import { Analytics } from "../components/analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: `${brand.name} | AI Real Estate Media Platform`,
  description: brand.description,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: brand.name,
    description: brand.description,
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return content;
  }

  return (
    <ClerkProvider>
      {content}
    </ClerkProvider>
  );
}
