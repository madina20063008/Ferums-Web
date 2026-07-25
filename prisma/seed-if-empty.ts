// Runs during `vercel-build` after `prisma db push`. Seeds the admin user +
// starting content ONLY when the database is empty (ensureSeeded checks the
// user count), so redeploys never overwrite content edited in the admin.
// Never throws — a DB that isn't reachable just leaves the build to fall back
// to bundled content (see src/lib/site-data.ts).
import { ensureSeeded } from "../src/lib/seed-core";

ensureSeeded()
  .then(() => {
    console.log("✔ seed-if-empty complete");
    process.exit(0);
  })
  .catch((e) => {
    console.error("seed-if-empty skipped:", e?.message);
    process.exit(0);
  });
