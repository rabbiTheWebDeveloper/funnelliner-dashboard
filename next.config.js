const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction
  ? "https://staging.funnelliner.com/api/v1"
  : "https://staging.funnelliner.com/api/v1";

const bkashUrl = isProduction
  ? "http://bkash.dev.funnelliner.com/api/bks/trx_list"
  : "http://staging.funnelliner.com/api/bks/trx_list";

const nextConfig = {
  reactStrictMode: !isProduction,
  env: {
    API_URL: apiUrl,
    Bkash_URL: bkashUrl,
  },
  publicRuntimeConfig: {
    API_URL: apiUrl,
  },
  output: isProduction ? 'standalone' : undefined,
};

module.exports = nextConfig;
