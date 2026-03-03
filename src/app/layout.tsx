import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jay Chauhan — Building Stuff.",
  description: "Jay Chauhan portfolio site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="w-full bg-black text-white border-b border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-6 font-mono">
            <a href="/" className="font-bold">
              JAY
            </a>
            <a href="/projects" className="opacity-80 hover:opacity-100">
              Projects
            </a>
            <a href="/blog" className="opacity-80 hover:opacity-100">
              Blog
            </a>
            <a href="/about" className="opacity-80 hover:opacity-100">
              About
            </a>
            <a href="/contact" className="opacity-80 hover:opacity-100">
              Contact
            </a>

            <div className="ml-auto">
              <a
                href="/resume.pdf"
                className="border border-white/20 px-3 py-1 hover:border-white/50"
              >
                Resume
              </a>
            </div>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}