import fs from "node:fs/promises";
import path from "node:path";
import RSS from "rss";
import matter from "gray-matter";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generate() {
  const feed = new RSS({
    title: "rikki.dev - the output channel",
    site_url: "https://rikki.dev",
    feed_url: "https://rikki.dev/feed.xml",
  });

  const posts = await fs.readdir(path.join(__dirname, "..", "pages", "posts"));

  await Promise.all(
    posts.map(async (name) => {
      if (name.startsWith("index.")) return;

      const postPath = path.join(__dirname, "..", "pages", "posts", name);
      let content;
      let frontmatter;
      if ((await fs.lstat(postPath)).isFile()) {
        content = await fs.readFile(postPath);
        frontmatter = matter(content);
      } else {
        const files = await fs.readdir(postPath);
        const fileName = files.find((file) => file.startsWith("index."));
        content = await fs.readFile(path.join(postPath, fileName));
        frontmatter = matter(content);
      }
      feed.item({
        title: frontmatter.data.title,
        url: "/posts/" + name.replace(/\.mdx?/, ""),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tag?.split(", "),
        author: frontmatter.data.author,
      });
    })
  );

  await fs.writeFile("./public/feed.xml", feed.xml({ indent: true }));
}

generate();
