# Website staging and counters

The website lives in `site/` on a feature branch until it is ready to publish. Do not merge the branch or enable GitHub Pages until the statistics endpoint and domain are configured. The GitHub Pages workflow runs only when manually started.

## What the numbers mean

- **Site visits** counts successful page load requests to `/api/visit`, including refreshes. It is not a count of unique people.
- **Download clicks** counts left clicks on the main installer button that successfully reach `/api/download`. It is not a count of completed downloads, portable downloads, or clicks on GitHub Releases.
- Counts begin at zero when the D1 database is created. Bots and automated requests can affect the totals. The Worker does not store IP addresses or visitor identifiers.
- If the statistics endpoint is unavailable, counters show `—` and the installer still opens.

## Deploy the counter API on Cloudflare

1. In the Cloudflare account that manages `mvr2avo.com`, create a D1 database named `mvr2avo-stats`.
2. Replace `REPLACE_WITH_D1_DATABASE_ID` in `stats-worker/wrangler.toml` with its actual ID. Apply `stats-worker/schema.sql` to the remote database with Wrangler (`npx wrangler d1 execute mvr2avo-stats --remote --file=stats-worker/schema.sql`).
3. Deploy from the `stats-worker/` directory with `npx wrangler deploy`. Assign a custom domain `stats.mvr2avo.com` to this Worker in Cloudflare. GitHub Pages will host the static site on `mvr2avo.com`.
4. Verify `https://stats.mvr2avo.com/api/stats` returns `{ "visits": 0, "downloads": 0 }` (or current totals). The page increments visits after loading; the blue installer button increments clicks before opening the GitHub asset.
5. When ready to launch, merge the site branch. In GitHub repository Settings → Pages select **GitHub Actions** as the build source, configure the custom domain `mvr2avo.com`, set the DNS records requested by GitHub, and enable HTTPS. Start the **Deploy website** workflow manually from Actions. It uploads only `site/`.

The app's installer remains a GitHub Releases asset. The Worker only stores two integer counters. Do not put secrets in this public repository.
