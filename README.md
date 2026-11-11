# Table Ready: Business Dining Etiquette

A beginner-friendly website that teaches UA students how to handle business meals: what to do before, during and after.

**Live site:** https://henrychh06.github.io/dining-hw4/

Built for HW4 (Business Dining Etiquette Website) by Henry Gallegos. This is a student project and not an official University of Arizona website.

## What's on the site

| Page | Purpose |
| --- | --- |
| `index.html` | Home, five key rules, embedded video, links to every section |
| `before.html` | Research, restaurant choice, arrival, conversation prep |
| `at-the-table.html` | Numbered place-setting diagram, BMW memory tricks, do and avoid lists |
| `conversation.html` | Small talk, drinks, the bill, follow-up |
| `quiz.html` | Ten-question self-check quiz with instant feedback |
| `news.html` | Announcements and tips |
| `survey.html` | Ten survey questions about what students learned |
| `references.html` | Citations and further resources |

## Assignment checklist

- Internal links: navigation bar, section cards, "Next" buttons, in-text links
- External links: UA Career Services, University of Arizona, OpenTable, cited sources
- Graphic features: original SVG illustrations (logo badge, flying cloche, rotating seal), an interactive place-setting diagram, and photographs in `assets/img/photos/` (see `LEEME.md` there for the exact file list)
- Advanced features: embedded YouTube video, interactive quiz, announcements page, scroll-driven animations (assembling headline, widening type, parallax photos, marquee), full-screen menu
- Survey questions: `survey.html`
- Sources cited: `references.html`

## Tech

Plain HTML, CSS and vanilla JavaScript. No build step.

- `assets/css/styles.css`: poster-style design system (cream, red, mustard, cobalt, green; Archivo + Poppins)
- `assets/js/nav.js`: full-screen menu and a header that hides on scroll
- `assets/js/fx.js`: preloader, scroll reveals, scroll-driven type and parallax, photo placeholders, diagram highlights. Respects `prefers-reduced-motion`.
- `assets/js/quiz.js`: the self-check quiz

Until a photo is added to `assets/img/photos/`, its slot shows the exact file name and size it expects. To preview locally:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.
