// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode:false,
//   env: {
//     API_URL:"https://web.funnelliner.com/api/v1",
//     Bkash_URL:"https://bkash.dev.funnelliner.com/api/bks/trx_list",
//   },
//   publicRuntimeConfig: {
//     API_URL: "https://web.funnelliner.com/api/v1",
//   },
//   output: 'standalone',
// }

// module.exports = nextConfig

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: !isProduction, // Enable Strict Mode in development, disable in production
  env: {
    API_URL: isProduction
      ? "http://staging.funnelliner.com/api/v1"
      : "http://staging.funnelliner.com/api/v1",
    Bkash_URL: isProduction
      ? "https://bkash.dev.funnelliner.com/api/bks/trx_list"
      : "http://staging.funnelliner.com/api/bks/trx_list",
  },
  publicRuntimeConfig: {
    API_URL: isProduction
      ? "http://staging.funnelliner.com/api/v1"
      : "http://staging.funnelliner.com/api/v1",
  },
  output: isProduction ? 'standalone' : undefined, // Set to 'standalone' in production, undefined in development
};

module.exports = nextConfig;

// http://staging.funnelliner.com/api/v1
