/** @type {import('next').NextConfig} */

// const withAntdLess = require('next-plugin-antd-less');

// module.exports = withAntdLess({
//   reactStrictMode: true,
//   // modifyVars: { '@primary-color': '#04f' },
//   lessVarsFilePath: './styles/variables.less',
//   webpack(config) {
//     return config;
//   },
// });

// const nextConfig = {
//   reactStrictMode: false,
// }

// module.exports = nextConfig

// module.exports = {
//   images: {
//     domains: ['res.cloudinary.com'],
//   },
// };
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
})
module.exports = withBundleAnalyzer({
    images: {
      domains: ['res.cloudinary.com'],
    },
})