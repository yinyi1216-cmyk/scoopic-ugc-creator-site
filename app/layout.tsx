import type { Metadata } from "next";
import "./globals.css";

const assetBasePath = process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "";
const iconPath = `${assetBasePath}/assets/scoopic-dog.png`;

export const metadata: Metadata = {
  title: "Scoopic Student Ambassador Program",
  description:
    "Apply to become a Scoopic Student Ambassador, learn what Scoopic is, see the program, watch creator examples, and review common questions.",
  icons: {
    icon: iconPath,
    shortcut: iconPath,
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
