import nextra from "nextra";
import blog from "nextra-theme-blog";

const withNextra = nextra({
  theme: blog,
  themeConfig: "./theme.config.jsx",
  staticImage: true,
  readingTime: true,
});

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  output: "export",
  images: { unoptimized: true },
});
