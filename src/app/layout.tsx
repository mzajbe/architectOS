import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Architectos",
  description: "Canvas workspace for architectural systems thinking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full antialiased" lang="en">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
