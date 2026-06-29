import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// 1. Loading custom web fonts elegantly directly from Google
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
}); 

// 2. Head configuration for SEO (Search Engine Optimization)
export const metadata = {
  title: "ThreadCounty Sandbox",
  description: "Learning the modern web development stack",
};

// 3. The SINGLE true Default Export for the whole application layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body 
        className={`${spaceGrotesk.variable} ${plexSans.variable} ${plexMono.variable} font-body bg-ink text-ecru`}
      >
        {children}
      </body>
    </html>
  );
}