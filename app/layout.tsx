import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "网盘",
  description: "网盘市场",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
