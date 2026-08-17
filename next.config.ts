import type { NextConfig } from "next";

const assetBasePath = process.env.NEXT_PUBLIC_ASSET_BASE_PATH ?? "";

const nextConfig: NextConfig = assetBasePath
  ? {
      assetPrefix: assetBasePath,
      basePath: assetBasePath,
    }
  : {};

export default nextConfig;
