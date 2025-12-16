import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GIS Dashboard",
  description: "Spatial Data Visualization Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        {/* Main Content - Visible on all devices */}
        <div className="min-h-screen w-screen overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
