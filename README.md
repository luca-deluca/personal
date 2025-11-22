# Luca G Deluca Landing Page

Static single-page site matching the provided React/Tailwind sketch. Files are split so you can edit styles and JSX separately, powered by CDN scripts—no build tooling required (works opened from file:// or any static host).

## Run locally
- Open `index.html` in a browser (file:// works), or serve the folder (e.g., `python -m http.server 3000` then visit http://localhost:3000).

## Publish
- Drop the contents of this folder onto any static host (GitHub Pages, Netlify, Vercel static, S3, etc.). No environment variables or build steps needed.
- All assets: `index.html` (document + CDN links), `styles.css` (custom CSS), `app.js` (React + Framer Motion + HTM templates), `config.js` (CMS keys; copy from `config.example.js`).
- For GitHub Pages specifics, see `DEPLOY.md`.

## Customizing
- Update text, links, and placeholder images directly in `app.js`.
- Tweak custom styling in `styles.css` and keep Tailwind utility classes in JSX.
- Replace `#` links for projects/blog/socials with real URLs when ready.

## CMS hookup (Contentful example)
1) Create a Contentful space and add content types for portfolio and blog (e.g., `project` and `blogPost`).
2) Add fields:
   - Project: `title` (Text), `description` (Long Text), `tags` (Array of Text), `link` (Text), `image` (Asset).
   - Blog: `title` (Text), `date` (Date), `excerpt` (Long Text), `link` (Text), `image` (Asset).
3) Get your Space ID and Content Delivery API token from Contentful.
4) Copy `config.example.js` to `config.js` and fill in `spaceId`, `token`, `environment`, and content type IDs.
5) Deploy. If `config.js` is missing or empty, the site falls back to the hardcoded sample projects/posts.
