// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     output: 'standalone',
// };

// module.exports = {
//     async rewrites() {
//       return [
//         {
//           source: '/api/:path*',
//           destination: 'http://localhost:8080/:path*'
//         }
//       ]
//     }
//   }

// export default nextConfig;

module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    output: "standalone",
    rewrites: async () => {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/:path*'
        }
      ]
    }
  }
  return nextConfig
}
