import Cusdis from "nextra-theme-blog/cusdis";

const YEAR = new Date().getFullYear();

const Comments = () => (
  <div id="comments-wrapper">
    <h2>Comments</h2>
    <Cusdis />
  </div>
);
/**
 * @type import("nextra-theme-blog").NextraBlogTheme
 */
export default {
  comments: <Comments />,
  head: ({ title, meta }) => (
    <>
      {meta.description && (
        <>
          <meta name="description" content={meta.description} />
          <meta name="og:description" content={meta.description} />
          <meta name="twitter:description" content={meta.description} />
        </>
      )}
      {meta.title && (
        <>
          <meta name="og:title" content={meta.title} />
          <meta name="twitter:title" content={meta.title} />
        </>
      )}
      {meta.tag && <meta name="keywords" content={meta.tag} />}
      <meta name="author" content="Rikki Schulte" />
      {meta.image && <meta name="og:image" content={meta.image} />}
      {meta.image_alt && <meta name="og:image:alt" content={meta.image_alt} />}
      {meta.image && <meta name="twitter:image" content={meta.image} />}
      {meta.image_alt && (
        <meta name="twitter:image:alt" content={meta.image_alt} />
      )}
      <meta name="ostrio-domain" content="c53xIOPRFZAw7AUZHFGjYW9RBf2sYdoOCtxfYyMH9aN"></meta>
    </>
  ),
  cusdis: {
    appId: "2d017102-38b5-4fc8-ba8b-1b0a45a305a2",
    lang: "en",
  },
  darkMode: true,
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Rikki Schulte. CC-By-SA
      </small>
      <div>
      <small>This blog is built with{" "}
        <a href="https://nextra.site">nextra & next.js</a>
        </small>
      </div>
      <div>
        <a className="feed-link" href="/feed.xml">RSS</a>
      </div>
      <style jsx>{`
        footer {
          margin-top: 8rem;
        }
        a.feed-link {
          float: right;
        }
      `}</style>
    </footer>
  ),
};
