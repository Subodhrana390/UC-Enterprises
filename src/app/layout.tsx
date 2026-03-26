import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UC Enterprises | India's Leading Electronic Component Distributor",
    template: "%s | UC Enterprises India",
  },
  description: "UC Enterprises is a premier global distributor of semiconductors and electronic components in India. Expert PCB fabrication, SMT assembly, and IoT solutions. Fastest shipping on Arduino, Raspberry Pi, and industrial parts.",
  keywords: [
    "semiconductors India",
    "electronic components distributor",
    "Arduino India",
    "Raspberry Pi distributor India",
    "PCB fabrication India",
    "SMT assembly services",
    "IoT prototyping",
    "microcontrollers",
    "industrial electronic parts",
    "UC Enterprises"
  ],
  authors: [{ name: "UC Enterprises" }],
  creator: "UC Enterprises",
  metadataBase: new URL("https://ucenterprises.co.in"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ucenterprises.co.in",
    title: "UC Enterprises | Leading Electronic Component Distributor in India",
    description: "Expert distributor of semiconductors, Arduino, Raspberry Pi, and industrial parts. Professional PCB & SMT services.",
    siteName: "UC Enterprises",
    images: [{
      url: "/logo.jpg",
      width: 1200,
      height: 630,
      alt: "UC Enterprises - Electronics & Engineering",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UC Enterprises | India's Trusted Component Partner",
    description: "Global quality semiconductors and components, distributed in India. PCB fabrication and assembly services.",
    images: ["/logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
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
              "url": "https://ucenterprises.co.in",
              "logo": "https://ucenterprises.co.in/logo.jpg",
              "description": "Premium distributor of semiconductors, electronic components, and industrial fabrication services in India.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://www.linkedin.com/company/uc-enterprises"
              ]
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface" suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        <Toaster position="top-right" closeButton richColors />
      </body>
    </html>
  );
}
