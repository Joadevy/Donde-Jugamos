/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.handlebars$/,
        loader: "handlebars-loader",
      });
    }

    return config;
  },
};

module.exports = nextConfig;
