import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from "next";
import "./globals.css";
import Providers from './providers'

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
        <AntdRegistry>
          <Providers>
            {children}
          </Providers>
        </AntdRegistry>
      </body>
    </html>
  );
}
