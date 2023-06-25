/** @type {import('next').NextConfig} */
const path = require('path');
const workspaceRoot = path.resolve(__dirname, '../..');
const projectRoot = __dirname;
const nextConfig = {
  transpilePackages: [
    '@moneytracker/common',
    'material-ui'
  ],
  webpack: (config) => {
    config.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', ...config.resolve.extensions];
    config.resolve.modules = [path.resolve(projectRoot, 'node_modules'), path.resolve(workspaceRoot, 'node_modules')];
    return config;
  }
}

module.exports = nextConfig
