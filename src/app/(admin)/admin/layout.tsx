import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "FERUMS Admin",
  robots: { index: false, follow: false },
};

// Root layout for the /admin section (its own <html>/<body>, always light UI,
// never indexed).
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <div className="admin-scope min-h-screen bg-neutral-50 text-neutral-900">{children}</div>
      </body>
    </html>
  );
}
