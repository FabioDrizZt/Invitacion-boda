/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'Invitacion-boda';

const nextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : '',
  },
  images: {
    unoptimized: true,
  },
  reactCompiler: true,
};

export default nextConfig;
