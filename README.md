# $JANNY — janny.info

Static landing page for the $JANNY memecoin, rebuilt from a Wayback Machine
snapshot of the original `janny.biz` site (2025-01-08) and hosted on
GitHub Pages.

Contract: `0x5ff46696d6e4896137acb1628b06e28c10ee9634` (Ethereum)

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure

```
index.html          single-page site
assets/css/         stylesheet
assets/js/          vanilla JS (copy, Dexscreener widget)
assets/img/         logos, portraits, character strip
assets/video/       hero + feature MP4s
scripts/            helper scripts (not deployed)
CNAME               custom domain for GitHub Pages
.nojekyll           disables Jekyll processing on Pages
```

## Deployment

GitHub Pages serves the repository root on the `main` branch.
Custom domain `janny.info` is configured via the `CNAME` file plus
DNS records pointing to GitHub Pages IPs.
