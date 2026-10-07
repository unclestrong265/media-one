/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default {
  output: 'export',
  env: { NEXT_PUBLIC_BASE_PATH: isGitHubPages ? '/media-one' : '' },
  trailingSlash: true,
  basePath: isGitHubPages ? '/media-one' : '',
  assetPrefix: isGitHubPages ? '/media-one/' : '',
};
