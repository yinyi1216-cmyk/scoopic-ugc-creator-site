import type { Metadata } from "next";
import "./globals.css";

const assetBasePath = process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "";
const iconPath = `${assetBasePath}/assets/scoopic-dog.png`;
const analyticsBootstrap = `
  (() => {
    const analyticsHostname = "scoopic-ambassador-site.scoopic-ai.workers.dev";

    if (window.location.hostname !== analyticsHostname) return;

    const beacon = document.createElement("script");
    beacon.type = "module";
    beacon.src = "https://static.cloudflareinsights.com/beacon.min.js";
    beacon.dataset.cfBeacon = JSON.stringify({
      token: "7ec9aab3389a481193a54cbc3df0d5a9",
    });
    document.head.append(beacon);
  })();
`;

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
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: analyticsBootstrap }} />
      </body>
    </html>
  );
}
