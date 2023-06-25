import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-blog',
  themeConfig: './theme.config.jsx',
  unstable_staticImage: true,
  staticImage: true,
  readingTime: true
  // optional: add `unstable_staticImage: true` to enable Nextra's auto image import
})


export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  output: 'export',
  images: {
    unoptimized: true
  }
  // any configs you need
})
