import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ClientLayout from "./client-layout";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Workbrand Premium",
  description: "Premium analytics and insights for your company's Workbrand score",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        {/* Tech Pattern Background */}
        <div className="tech-pattern"></div>
        
        {/* Footer Gradient */}
        <div className="footer-gradient"></div>
        
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
