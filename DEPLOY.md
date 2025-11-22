# Deploying to GitHub Pages

This site is static: just HTML/CSS/JS and your `config.js`.

1) Push to GitHub  
   - `git init`  
   - `git add . && git commit -m "Initial site"`  
   - `git remote add origin https://github.com/USER/REPO.git`  
   - `git push -u origin main`

2) Enable Pages  
   - In GitHub: Settings → Pages.  
   - Source: `Deploy from a branch`.  
   - Branch: `main` and folder `/ (root)`.  
   - Save. Your site will appear at `https://USER.github.io/REPO/` after a minute.

3) CMS config (`config.js`)  
   - Contentful CDA tokens are public-readable; if you prefer to keep yours private, add `config.js` to `.gitignore` and upload it manually to your host. For GitHub Pages (no build), a public CDA token is fine.  
   - `config.example.js` shows the shape; `config.js` is the live one.

4) Local preview  
   - Open `index.html` directly, or run `python -m http.server 3000` and browse `http://localhost:3000`.

5) Updates  
   - Edit `app.js`/`styles.css`/`config.js`, commit, and push. GitHub Pages redeploys automatically from `main`.
