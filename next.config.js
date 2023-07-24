/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:false,
  env: {
    API_URL:"https://web.funnelliner.com/api/v1",
    Bkash_URL:"https://bkash.dev.funnelliner.com/api/bks/trx_list",
  },
  publicRuntimeConfig: {
    API_URL: "https://web.funnelliner.com/api/v1",
  },
  output: 'standalone',
}

module.exports = nextConfig