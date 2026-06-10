# CloudFront Cache Invalidation

## Key Insight

When using Vite (or Webpack with content hashing), **you only need to invalidate `/index.html`** on each deployment.

## Why?

- Build tools like Vite produce **content-hashed filenames** for JS, CSS, and fonts (e.g., `index-BwAi0kHW.js`)
- Every new build generates a **new filename** — CloudFront treats it as a brand new object (cache miss, fetches from origin)
- The only file that keeps the **same path** across deployments is `index.html`
- `index.html` references the new hashed assets — invalidating it forces the browser to fetch the updated HTML, which then pulls the new assets

## The Chain

```
Deploy → New hashed assets uploaded → Invalidate /index.html
       → Browser fetches new HTML → HTML references new JS/CSS filenames
       → CloudFront fetches new assets (cache miss due to new filename)
```

## What About API URLs?

- API base URLs are typically baked into the JS bundle at build time
- Since each build produces a **new hashed JS file**, the new API URL is automatically served once `index.html` is invalidated
- No separate invalidation needed for API URL changes

## Invalidation Strategy Comparison

| Strategy | When to Use |
|----------|-------------|
| `/index.html` only | Vite/Webpack builds with content-hashed assets (recommended) |
| `/index.html` + `/static/*` | If some static assets don't have hashes in filenames |
| `/*` (everything) | Avoid — unnecessarily wipes entire cache including images/media |

## Cost Considerations

- AWS gives **1,000 free invalidation paths per month** per distribution
- Invalidating a single path (`/index.html`) per deployment is negligible
- `/*` counts as one path but clears everything — wasteful for hashed assets
- If deploying frequently across environments, confirm with infra team whether all environments need automated invalidation

## Automation

Typically done via AWS CLI in the CI/CD deploy step:

```bash
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/index.html"
```
