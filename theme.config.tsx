import { useRouter } from "next/router";
import { NextraBlogTheme } from "nextra-theme-blog";
import { ReactCusdis as Cusdis } from "react-cusdis";

const YEAR = new Date().getFullYear();

const Comments = () => {
  const { pathname } = useRouter();
  return (
    <div id="comments-wrapper">
      <h2>Comments</h2>
      <Cusdis
        attrs={{
          appId: "2d017102-38b5-4fc8-ba8b-1b0a45a305a2",
          host: "https://rikki.dev",
          pageId: pathname,
        }}
        lang="en"
      />
    </div>
  );
};

export default {
  comments: <Comments />,
  head: ({ title, meta }) => (
    <>
      <title>{title + " | the outputChannel"}</title>
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
      <meta
        name="ostrio-domain"
        content="c53xIOPRFZAw7AUZHFGjYW9RBf2sYdoOCtxfYyMH9aN"
      ></meta>
      <script
        async
        defer
        type="text/javascript"
        src="https://analytics.ostr.io/bTg9XFQo9HyiugJPN.js"
      ></script>
    </>
  ),
  darkMode: true,
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Rikki Schulte. CC-By-SA
      </small>
      <div>
        <small>
          This blog is built with{" "}
          <a href="https://nextra.site">nextra & next.js</a>
        </small>
      </div>
      <div>
        <a className="feed-link" href="/feed.xml">
          RSS
        </a>
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
} as NextraBlogTheme;
