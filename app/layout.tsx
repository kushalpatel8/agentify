import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const outfit = Outfit({subsets:['latin']})

export const metadata: Metadata = {
  title: "AI Agent Builder",
  description: "The App where you build ai agents.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en">
      <body 
      className={outfit.className}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
    </html>
  );
}
