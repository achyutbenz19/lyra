import type { Metadata } from "next";
import "./globals.css";
import { AI } from "./api/actions";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "lyra",
  description: "start exploring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className={GeistSans.className}>
          <AI>
            <ThemeProvider attribute="class">
              <div className="flex flex-col min-h-screen">
                <main className="flex flex-col flex-1 bg-muted/50 dark:bg-background">
                  {children}
                  <Analytics />
                </main>
              </div>
            </ThemeProvider>
          </AI>
        </body>
      </ClerkProvider>
    </html>
  );
}
