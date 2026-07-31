import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scoopic Student Ambassador Program",
  description:
    "Apply to become a Scoopic Student Ambassador, learn what Scoopic is, see the program, watch creator examples, and review common questions.",
  icons: {
    icon: "/assets/scoopic-dog.png",
    shortcut: "/assets/scoopic-dog.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
