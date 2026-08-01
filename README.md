# Ranjit Pandey — Portfolio

A fast, dependency-free personal portfolio built with hand-written HTML5, CSS3 and vanilla JavaScript. No build step, no framework, no jQuery/Bootstrap — just open `index.html`.

## Design

A code-editor / terminal inspired theme, built around Python's own brand colors:

- **Blue** `#4d8fd6` — primary accent, links, borders
- **Yellow** `#ffd43b` — signature accent, CTAs, cursor
- **Green** `#7ee6a8` — git-diff "+" lines, success states

Typography: **Space Grotesk** (display), **Inter** (body), **JetBrains Mono** (code/data labels).

Signature elements: the hero renders as a fake code editor window with a typed-out REPL snippet; the About section presents quick facts as a JSON object; the Experience section reads like a `git log`, with achievements styled as diff `+` lines.

## Structure

```
index.html
css/styles.css      → design tokens + all styles, mobile-first
js/main.js           → theme toggle, nav, reveal/typing animation, form handling
assets/images/        → compressed JPEGs (resized + optimized from the originals)
```

## Running locally

No build step needed. Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customizing

- **Colors / fonts / spacing** — all defined as CSS custom properties at the top of `css/styles.css` under `:root` (dark) and `[data-theme="light"]`.
- **Copy** — all real content lives directly in `index.html`; there's no CMS or data file.
- **Résumé download** — the "Download Résumé" button currently points to the contact section. Drop your PDF into `assets/` (e.g. `assets/resume.pdf`) and update the `href` of `#resumeDownload` in `index.html`.
- **Contact form** — this is a static site, so the form opens the visitor's email client via a `mailto:` link pre-filled with their message (no backend required). If you'd like real form submissions without opening email, wire it up to a service like Formspree or EmailJS and swap the `submit` handler in `js/main.js`.

## Notes on what changed from the original template

- Removed jQuery, Bootstrap, Owl Carousel, AOS, Magnific Popup and animate.css — replaced with ~9KB of vanilla JS using `IntersectionObserver`, and CSS-only animations.
- Enabled the Projects section (it was commented out in the original and never rendered), including two projects that were nested inside that same disabled block.
- Replaced stat counters that didn't match the actual content ("1000 Mentored Students", "500 Cups of Coffee") with ones the résumé content supports.
- Removed the placeholder phone number; added an "Open to opportunities" availability card instead.
- Added a light/dark theme toggle (persisted via `localStorage`), full keyboard focus states, `prefers-reduced-motion` support, semantic landmarks, and `alt` text on every image.
- Compressed all images (proj_3.jpg alone went from 3970×2234 / 860KB down to 1000×562 / ~70KB) and added `loading="lazy"` + explicit dimensions to avoid layout shift.

## Suggested next steps

- Add your real résumé PDF and wire up the download button.
- Point the contact form at a real submission backend if you want to avoid relying on the visitor's email client.
- Add a proper Open Graph image (`og:image`) for link previews on LinkedIn/Twitter.
- Consider a `sitemap.xml` + `robots.txt` if you want this indexed and want the blog subdomain linked back here.
