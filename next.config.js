/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Exclude test files from the client-side build
    if (!isServer) {
      config.module.rules.push({
        test: /__tests__\/.*$/,
        loader: 'ignore-loader',
      });
    }

    return config;
  },
}

module.exports = nextConfig
