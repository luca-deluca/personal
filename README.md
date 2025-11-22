# Luca G Deluca Landing Page

Single-page React/Tailwind landing site, all static (no build step). Open `index.html` directly or serve the folder.

- Assets: `index.html`, `styles.css`, `app.js`, `config.js` (CMS settings; copy from `config.example.js`).
- CMS (Contentful): configure `config.js` with `spaceId`, `environment`, `token`, `blogContentType`, `portfolioContentType`. If missing, fallback data renders.
- Deploy: any static host (e.g., GitHub Pages via branch `main`, folder `/`).
- Edit content in `app.js`, styling in `styles.css`.
