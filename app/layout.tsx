import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import OnboardingWrapper from "@/components/OnboardingWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "TimeSpeak - Premium AI English Learning",
  description: "Learn English with AI-powered personalized lessons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <OnboardingWrapper>
          <div className="mobile-app">
            <ConditionalLayout>{children}</ConditionalLayout>
          </div>
        </OnboardingWrapper>
      </body>
    </html>
  );
}
