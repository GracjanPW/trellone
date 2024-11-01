import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

const interFont = Inter({
  subsets:["latin"]
})

export const metadata: Metadata = {
  title: {
    default:siteConfig.name,
    template:`%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons:[
    {
      url:"/logo.svg",
      href:"/logo.svg"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(`antialiased`,interFont.className)}
      >
        {children}
      </body>
    </html>
  );
}
