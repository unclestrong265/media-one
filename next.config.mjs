/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default {
  output: 'export',
  trailingSlash: true,
  basePath: isGitHubPages ? '/media-one' : '',
  assetPrefix: isGitHubPages ? '/media-one/' : '',
};
