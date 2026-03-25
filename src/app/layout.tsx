import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UC Enterprises | Engineering Precision",
    template: "%s | UC Enterprises",
  },
  description: "Global distributor of semiconductors and electronic components. Trusted by engineers for over 25 years with high-quality parts and fast shipping.",
  keywords: ["semiconductors", "electronic components", "microcontrollers", "engineering parts", "UC Enterprises"],
  authors: [{ name: "UC Enterprises" }],
  creator: "UC Enterprises",
  metadataBase: new URL("https://ucenterprises.com"), // Replace with your real domain
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ucenterprises.com",
    title: "UC Enterprises | Engineering Precision",
    description: "Global distributor of semiconductors and electronic components.",
    siteName: "UC Enterprises",
    images: [{
      url: "/logo.jpg",
      width: 1200,
      height: 630,
      alt: "UC Enterprises Logo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UC Enterprises | Engineering Precision",
    description: "Global distributor of semiconductors and electronic components.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "UC Enterprises",
              "url": "https://ucenterprises.com",
              "logo": "https://ucenterprises.com/logo.jpg",
              "description": "Global distributor of semiconductors and electronic components.",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-xxx-xxx-xxxx",
                "contactType": "customer service"
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface" suppressHydrationWarning>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
