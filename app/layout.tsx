import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from '@clerk/nextjs'
import Provider from "./provider";
import { Toaster } from "@/components/ui/toast";

const outfit = Outfit({subsets:['latin']})

export const metadata: Metadata = {
  title: "AI Agent Builder",
  description: "The App where you build ai agents.",
};

import { ThemeProvider } from "@/components/ThemeProvider"

export default function RootLayout({ children }:Readonly<{children: React.ReactNode}>) {
  return (
    <ClerkProvider>
    <html
      lang="en" suppressHydrationWarning>
      <body 
      className={outfit.className}
      >
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
          <ConvexClientProvider>
            <Provider>
              {children}
              <Toaster />
            </Provider>
          </ConvexClientProvider>
        </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}
