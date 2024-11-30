// @ts-check

const dotenvx = require("@dotenvx/dotenvx");
dotenvx.config({ path: `env/.env.app.${process.env.APP_ENV}` });

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  transpilePackages: ["@aragon/gov-ui-kit"],
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  output: "export",
};

module.exports = nextConfig;
