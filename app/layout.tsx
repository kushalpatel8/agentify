import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from '@clerk/nextjs'
import Provider from "./provider";

const outfit = Outfit({subsets:['latin']})

export const metadata: Metadata = {
  title: "AI Agent Builder",
  description: "The App where you build ai agents.",
};

export default function RootLayout({ children }:Readonly<{children: React.ReactNode}>) {
  return (
    <ClerkProvider>
    <html
      lang="en">
      <body 
      className={outfit.className}
      >
        <ConvexClientProvider>
          <Provider>
            {children}
          </Provider>
        </ConvexClientProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}
