
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./Providers";




export const metadata: Metadata = {
  title: "PIV Club Game Planer",
  description: "Plan Games for our lovely PIV Club members",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body suppressHydrationWarning className="min-h-dvh overflow-x-hidden">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

