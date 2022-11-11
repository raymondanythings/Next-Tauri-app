/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 주의: 이 실험적 기능은 SSG 모드에서 NextJS Image 기능을 쓰기 위해 필요합니다.
  // https://nextjs.org/docs/messages/export-image-api 에서 또다른 해결책을 확인할 수 있습니다.
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
