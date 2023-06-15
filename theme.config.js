const YEAR = new Date().getFullYear();

export default {
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
    </>
  ),
  footer: (
    <footer>
      <small>
        <time>{YEAR}</time> © Rikki Schulte. CC-By-SA
        <a href="/feed.xml">RSS</a>
      </small>
      <style jsx>{`
        footer {
          margin-top: 8rem;
        }
        a {
          float: right;
        }
      `}</style>
    </footer>
  ),
};
