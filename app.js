'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];

/* PROGRESS BAR */
function initProgress() {
  const bar = $('prog');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* SIDE NAV */
function initNav() {
  const btn     = $('nav-btn');
  const nav     = $('sidenav');
  const wrap    = $('wrap');
  const close   = $('sn-close');
  const overlay = $('nav-overlay');
  if (!btn || !nav) return;

  const isWide = () => window.innerWidth >= 900;
  let open = false;

  function openNav() {
    open = true;
    nav.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    nav.setAttribute('aria-hidden', 'false');
    if (isWide()) wrap?.classList.add('is-pushed');
    else if (overlay) overlay.classList.add('visible');
  }
  function closeNav() {
    open = false;
    nav.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    wrap?.classList.remove('is-pushed');
    if (overlay) overlay.classList.remove('visible');
  }

  // auto-open on desktop
  if (isWide()) openNav();

  btn.addEventListener('click', () => open ? closeNav() : openNav());
  close?.addEventListener('click', closeNav);
  overlay?.addEventListener('click', closeNav);

  // close on link click (mobile)
  $$('.sn-nav a').forEach(a => a.addEventListener('click', () => {
    if (!isWide()) closeNav();
  }));

  // escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) closeNav();
  });

  window.addEventListener('resize', () => {
    if (isWide()) {
      overlay?.classList.remove('visible');
      if (open) wrap?.classList.add('is-pushed');
    } else {
      wrap?.classList.remove('is-pushed');
    }
  }, { passive: true });
}

/* ACTIVE NAV LINK */
function initActiveLink() {
  const links = $$('.sn-nav a[href^="#"]');
  if (!links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = links.find(l => l.getAttribute('href') === '#' + e.target.id);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' });

  $$('section[id]').forEach(s => obs.observe(s));
}

/* SCROLL REVEAL */
function initReveal() {
  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.reveal').forEach(el => el.classList.add('on'));
    return;
  }
  const items = $$('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -28px 0px' });
  items.forEach(el => obs.observe(el));
}

/* STAGGER DELAYS */
function initStagger() {
  [
    '.skill-cards .skill-card',
    '.ach-grid .ach-card',
    '.cert-strip .cert-card',
    '.nsri-stats .ns',
    '.goals .goal',
    '.contacts .ccard',
    '.hobbies .hobby',
    '.masonry .gitem',
    '.tag-cloud .tag',
  ].forEach(sel => {
    $$(sel).forEach((el, i) => {
      el.style.transitionDelay = (i * 0.055) + 's';
    });
  });
}

/* SMOOTH SCROLL */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const offset = window.innerWidth >= 900 ? 20 : 12;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });
}

/* COUNTER ANIMATION */
function countUp(el) {
  const raw = el.textContent.trim();
  const val = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(val)) return;

  const dur = 1200;
  const start = performance.now();

  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const cur = Math.round(ease * val);

    let out = '';
    if (raw.startsWith('$')) out += '$';
    if (raw.includes(',')) out += cur.toLocaleString();
    else out += cur;
    if (raw.includes('+')) out += '+';
    if (raw.includes('K')) out += 'K';

    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = raw; // restore exact original
  };

  requestAnimationFrame(step);
}

function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = $$('.stat-n, .ns-n');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.6 });
  els.forEach(el => obs.observe(el));
}

/* PORTRAIT PARALLAX (desktop only) */
function initParallax() {
  const el = $('portrait');
  if (!el || window.innerWidth < 900) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let raf = false;

  document.addEventListener('mousemove', e => {
    if (raf) return;
    raf = true;
    requestAnimationFrame(() => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ry = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `perspective(900px) rotateY(${rx * 2.6}deg) rotateX(${-ry * 1.8}deg)`;
      raf = false;
    });
  });

  document.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .6s ease';
    el.style.transform = '';
    setTimeout(() => { el.style.transition = ''; }, 620);
  });
}

/* GALLERY LIGHTBOX */
function initLightbox() {
  const lb    = $('lb');
  const panel = $('lb-content');
  const close = $('lb-close');
  if (!lb) return;

  function open(src, isVideo) {
    panel.innerHTML = '';
    const el = document.createElement(isVideo ? 'video' : 'img');
    el.src = src;
    if (isVideo) { el.controls = true; el.autoplay = true; el.setAttribute('aria-label', 'Media viewer'); }
    el.alt = '';
    panel.appendChild(el);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    close.focus();
  }

  function shut() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    const v = panel.querySelector('video');
    if (v) v.pause();
    setTimeout(() => { panel.innerHTML = ''; }, 300);
  }

  $$('.gitem').forEach(item => {
    item.addEventListener('click', () => {
      const vs  = item.querySelector('video source');
      const img = item.querySelector('img');
      if (vs) open(vs.src, true);
      else if (img) open(img.src, false);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  close?.addEventListener('click', shut);
  lb.addEventListener('click', e => { if (e.target === lb) shut(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) shut();
  });
}

/* LAZY-LOAD VIDEOS */
function initVideoLazy() {
  const vids = $$('video[preload="none"]');
  if (!vids.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.load();
        obs.unobserve(e.target);
      }
    });
  }, { rootMargin: '300px' });
  vids.forEach(v => obs.observe(v));
}

/* LANGUAGE BAR ANIMATION */
function initLangBars() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.prof-fill').forEach(el => el.classList.add('animated'));
    return;
  }
  const fills = $$('.prof-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Stagger the fills
        fills.forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 180);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const card = document.querySelector('.proficiency-card');
  if (card) obs.observe(card);
}

/* BACK TO TOP on double-click logo */
function initLogoClick() {
  const brand = document.querySelector('.sn-brand');
  if (!brand) return;
  brand.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* HERO VIDEO PLAY on hover (gallery items) */
function initHoverVideos() {
  $$('.gitem video').forEach(vid => {
    const item = vid.closest('.gitem');
    if (!item) return;
    item.addEventListener('mouseenter', () => { vid.play().catch(() => {}); });
    item.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
  });
}

/* KEYBOARD NAVIGATION IMPROVEMENTS */
function initKeyboardNav() {
  // Make skill cards focusable for keyboard users
  $$('.skill-card, .ach-card, .goal, .ccard').forEach(el => {
    if (!el.hasAttribute('tabindex') && el.tagName !== 'A') {
      el.setAttribute('tabindex', '0');
    }
  });
}

/* COPY EMAIL ON CLICK */
function initCopyEmail() {
  const emailCard = document.querySelector('a[href^="mailto:"]');
  if (!emailCard) return;
  emailCard.addEventListener('click', e => {
    const email = emailCard.href.replace('mailto:', '');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
  });
}

/* BOOT */
document.addEventListener('DOMContentLoaded', () => {
  initProgress();
  initNav();
  initActiveLink();
  initReveal();
  initStagger();
  initSmoothScroll();
  initCounters();
  initParallax();
  initLightbox();
  initVideoLazy();
  initLangBars();
  initLogoClick();
  initHoverVideos();
  initKeyboardNav();
});
