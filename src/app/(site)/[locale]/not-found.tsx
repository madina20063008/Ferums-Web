import Link from "next/link";

// Locale-scoped 404 (rendered inside the site shell). Middleware guarantees a
// locale prefix, so unknown paths land here in the right language.
export default function NotFound() {
  return (
    <section className="section" style={{ paddingTop: 120 }}>
      <div className="container">
        <div className="eyebrow" style={{ marginBottom: 16 }}>404</div>
        <h1 className="h1" style={{ maxWidth: 640 }}>Page not found</h1>
        <p className="lead" style={{ marginTop: 20 }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div style={{ marginTop: 30 }}>
          <Link href="/en" className="btn btn-primary">Go to homepage</Link>
        </div>
      </div>
    </section>
  );
}
