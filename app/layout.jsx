import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Providers from "./provider";
import SonnerProvider from "@/lib/SonnerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gram Aarogya | AI-Powered Rural Healthcare & Medical Assistance",
  description:
    "Gram Aarogya empowers villages with AI-driven healthcare assistance, helping users find nearby doctors, report health concerns, and access essential medical services instantly.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <SonnerProvider />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
