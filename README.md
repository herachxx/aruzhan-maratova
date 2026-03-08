# Aruzhan Maratova — Personal Portfolio

> Cybersecurity Researcher · CTF Player · NSRI Program Director · MIT Applicant  
> Aktobe, Kazakhstan · Grade 10 · Class of 2027

A personal portfolio website built to support university applications, scholarship submissions, and professional outreach. Showcases projects, competition achievements, skills, research work, and personal interests.

**Live site:** _[add your GitHub Pages URL here once published]_

---

## Contents

- [Overview](#overview)
- [Sections](#sections)
- [Project Structure](#project-structure)
- [Setup & Deployment](#setup--deployment)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Overview

This is a fully static, no-framework personal portfolio. Every section is written in plain HTML, styled with CSS custom properties, and animated with vanilla JavaScript — no build tools, no dependencies to install, no Node.js required. Just open `index.html` in a browser or push to GitHub Pages.

---

## Sections

| Section | Description |
|---|---|
| **Hero** | Name, title, short bio, and key focus areas |
| **About** | Background, personal info table, cybersecurity setup photos |
| **Skills** | Five core domains (Cybersecurity, Linux, Competitive Programming, CTF, Leadership) + secondary skill pills |
| **Projects** | Hardware and software builds with photos and videos: Automated Gate, RFID Reader, Raspberry Pi Lab, Radio Implementation, Circuit Soldering, PC Repair |
| **Achievements** | Competition results, awards, and certificates: World Space Olympiad (2nd), Programming Olympiads (1st, 3rd), iCode (31st/1000+), UAV Code Challenge, KazRoboDrone, and more |
| **NSRI** | National Student Research Institute — role, global stats, teaching work, research pathways |
| **Education** | Academic timeline from Grade 1 to present |
| **Gallery** | Photo and video gallery with lightbox viewer |
| **Hobbies** | Guitar, FPV Drones, Languages & IELTS prep, Electronics & Lock-picking |
| **Goals** | Academic targets for 2027: MIT, IELTS 7.5+, SAT 1500+, published research |
| **Contact** | Email, GitHub, LinkedIn, Instagram, YouTube |

---

## Project Structure

```
portfolio/
├── index.html          # All HTML — single page
├── styles.css          # All styles — CSS custom properties, responsive
├── app.js              # All JavaScript — no frameworks
└── assets/
    ├── aruzhan.jpeg    # Profile photo
    ├── nsri-logo.png   # NSRI logo
    ├── favicon.ico     # Browser tab icon
    ├── favicon.png     # Browser tab icon (PNG)
    └── media/          # 41 photos and videos
        ├── *.jpg
        ├── *.png
        └── *.mp4
```

---

## Setup & Deployment

### View locally

No installation needed. Just clone and open:

```bash
git clone https://github.com/herachxx/herachxx.github.io
cd herachxx.github.io
# Open index.html in any browser
```

### Deploy to GitHub Pages

1. Create a repository named `herachxx.github.io` (replace with your GitHub username)
2. Push all files to the `main` branch:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/herachxx/herachxx.github.io.git
git push -u origin main
```

3. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
4. Your site will be live at `https://herachxx.github.io` within a few minutes

> **Note:** The `assets/media/` folder contains ~133 MB of videos. GitHub's free LFS limit is 1 GB — you should be fine for now, but if you add more videos later, consider using [Git Large File Storage](https://git-lfs.com/) or hosting videos externally (YouTube, Cloudflare Stream) and embedding them instead.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Markup | HTML5 (semantic) | Clean, accessible, no framework overhead |
| Styles | CSS3 + Custom Properties | Full control, responsive, no Tailwind/Bootstrap |
| Scripts | Vanilla JavaScript (ES6+) | Zero dependencies, fast load |
| Icons | Font Awesome 6 | Brand icons (GitHub, LinkedIn, etc.) + UI icons |
| Fonts | Playfair Display · Outfit · JetBrains Mono | Google Fonts — serif display, clean body, monospace labels |
| Hosting | GitHub Pages | Free, fast, version-controlled |

**JavaScript features used:**
- `IntersectionObserver` — scroll-reveal animations + active nav link tracking
- `requestAnimationFrame` — counter animations + photo parallax
- CSS `transform` + `transition` — all animations, no JS animation libraries
- Lightbox — custom-built, no jQuery

---

## Features

- **Responsive** — works on all screen sizes from 360px mobile to 4K desktop
- **Side navigation** — opens automatically on desktop, slides over on mobile; hamburger animates to ×
- **Scroll progress bar** — thin gold line at the top of the page
- **Animated counters** — stats count up when they scroll into view
- **Gallery lightbox** — click any photo or video in the gallery to view fullscreen
- **Lazy loading** — all images use `loading="lazy"`, videos use `preload="none"` with IntersectionObserver
- **No cookies, no tracking, no analytics** — fully static, privacy-respecting
- **Accessible** — semantic HTML5, ARIA labels, keyboard navigation support

---

## Contact

- **Email:** aruzhanmaratova2009@gmail.com
- **GitHub:** [@herachxx](https://github.com/herachxx)
- **LinkedIn:** [aruzhan-maratova-or-herachxx](https://www.linkedin.com/in/aruzhan-maratova-or-herachxx/)
- **Instagram:** [@herachxx](https://www.instagram.com/herachxx/)
- **YouTube:** [@herachxx](https://www.youtube.com/@herachxx)

---

## License

The **code** (HTML, CSS, JS) is open source under the [MIT License](LICENSE) — you're welcome to use the structure as a template for your own portfolio.

The **media** (photos, videos, certificates) are personal and remain all rights reserved — please don't reuse them.

---

<p align="center">
  Built by Aruzhan Maratova · Aktobe, Kazakhstan · 2026
</p>
