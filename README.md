# Edwin Olaez — Portfolio

Static, interactive portfolio (HTML/CSS/JS, no build step) hosted on GitHub Pages.

## Edit content

- Projects, contact email, and form settings: top of `script.js` (`CONFIG` and `PROJECTS`)
- Text sections: `index.html`
- Colors and layout: `styles.css`

## Preview locally

```powershell
npx serve .
```

## Deploy to GitHub Pages

```powershell
gh repo create edwinolaez.github.io --public --source . --push
```

Then in the repo: **Settings → Pages → Deploy from branch → `main` / root**.
The site will be live at `https://edwinolaez.github.io`.

## Contact form

Leave `formspreeId` empty to use a `mailto:` fallback, or create a free form at
[formspree.io](https://formspree.io) and paste its ID into `CONFIG.formspreeId`.
