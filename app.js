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
    else overlay?.classList.add('visible');
  }
  function closeNav() {
    open = false;
    nav.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    wrap?.classList.remove('is-pushed');
    overlay?.classList.remove('visible');
  }

  if (isWide()) openNav();

  btn.addEventListener('click', () => open ? closeNav() : openNav());
  overlay?.addEventListener('click', closeNav);

  $$('.sn-nav a').forEach(a => a.addEventListener('click', () => {
    if (!isWide()) closeNav();
  }));

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
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('.reveal').forEach(el => el.classList.add('on'));
    return;
  }
  const items = $$('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -28px 0px' });
  items.forEach(el => obs.observe(el));
}

/* STAGGER DELAYS */
function initStagger() {
  [
    '.skill-cards .skill-card', '.ach-grid .ach-card', '.cert-strip .cert-card',
    '.nsri-stats .ns', '.goals .goal', '.contacts .ccard',
    '.hobbies .hobby', '.masonry .gitem', '.tag-cloud .tag',
  ].forEach(sel => {
    $$(sel).forEach((el, i) => { el.style.transitionDelay = (i * 0.055) + 's'; });
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
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 20,
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
  const dur = 1200, start = performance.now();
  const step = now => {
    const p    = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const cur  = Math.round(ease * val);
    let out = '';
    if (raw.startsWith('$')) out += '$';
    out += raw.includes(',') ? cur.toLocaleString() : cur;
    if (raw.includes('+')) out += '+';
    if (raw.includes('K')) out += 'K';
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = raw;
  };
  requestAnimationFrame(step);
}
function initCounters() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const els = $$('.stat-n, .ns-n');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.6 });
  els.forEach(el => obs.observe(el));
}

/* PORTRAIT PARALLAX */
function initParallax() {
  const el = $('portrait');
  if (!el || window.innerWidth < 900) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let raf = false;
  document.addEventListener('mousemove', e => {
    if (raf) return; raf = true;
    requestAnimationFrame(() => {
      const rx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ry = (e.clientY / window.innerHeight - 0.5) * 2;
      el.style.transform = `perspective(900px) rotateY(${rx * 2.6}deg) rotateX(${-ry * 1.8}deg)`;
      raf = false;
    });
  });
  document.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .6s ease';
    el.style.transform  = '';
    setTimeout(() => { el.style.transition = ''; }, 620);
  });
}

/* VIDEO OVERLAYS */
function initVideoOverlays() {
  $$('video').forEach(vid => {
    const parent = vid.parentElement;
    let wrap;
    if (parent.classList.contains('vid-wrap')) {
      wrap = parent;
    } else {
      wrap = document.createElement('div');
      wrap.className = 'vid-wrap';
      parent.insertBefore(wrap, vid);
      wrap.appendChild(vid);
    }

    const btn = document.createElement('button');
    btn.className = 'vid-btn';
    btn.type = 'button';
    btn.innerHTML = '<span class="vid-btn-icon"><i class="fa-solid fa-play"></i></span>';
    btn.setAttribute('aria-label', 'Play video');
    wrap.appendChild(btn);

    const icon = btn.querySelector('i');

    const showPlay = () => {
      icon.className = 'fa-solid fa-play';
      btn.setAttribute('aria-label', 'Play video');
      btn.classList.remove('hidden');
    };
    const showPause = () => {
      icon.className = 'fa-solid fa-pause';
      btn.setAttribute('aria-label', 'Pause video');
      btn.classList.remove('hidden');
    };
    const hideOverlay = () => btn.classList.add('hidden');

    // start with PLAY icon
    showPlay();

    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (vid.paused || vid.ended) vid.play().catch(() => {});
      else vid.pause();
    });

    vid.addEventListener('play',   hideOverlay);
    vid.addEventListener('pause',  () => { if (!vid.ended) showPause(); });
    vid.addEventListener('ended',  showPlay);
  });
}

/* IN-PAGE VIEWER  (double-click any image or video → small modal) */
function initViewer() {
  const viewer   = $('viewer');
  const backdrop = $('viewer-backdrop');
  const closeBtn = $('viewer-close');
  const content  = $('viewer-content');
  if (!viewer) return;

  let activeVideo = null;

  function openViewer(src, isVideo) {
    content.innerHTML = '';
    if (isVideo) {
      const v = document.createElement('video');
      v.src = src; v.controls = true; v.autoplay = true;
      content.appendChild(v);
      activeVideo = v;
    } else {
      const img = document.createElement('img');
      img.src = src; img.alt = '';
      content.appendChild(img);
      activeVideo = null;
    }
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeViewer() {
    if (activeVideo) { activeVideo.pause(); activeVideo = null; }
    viewer.hidden = true;
    document.body.style.overflow = '';
    content.innerHTML = '';
  }

  // double-click: images and video overlays
  document.addEventListener('dblclick', e => {
    // image double-click
    const img = e.target.closest('img');
    if (img && !img.closest('#viewer') && !img.closest('.portrait-badge')) {
      openViewer(img.src, false);
      return;
    }
    // video area double-click (but not the vid-btn itself)
    const vw = e.target.closest('.vid-wrap');
    if (vw && !e.target.closest('.vid-btn') && !vw.closest('#viewer')) {
      const vid = vw.querySelector('video');
      const src = vid?.querySelector('source')?.src || vid?.currentSrc || vid?.src;
      if (src) openViewer(src, true);
    }
  });

  closeBtn?.addEventListener('click', closeViewer);
  backdrop?.addEventListener('click', closeViewer);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !viewer.hidden) closeViewer();
  });
}

/* GALLERY LIGHTBOX  (single-click .gitem → full-screen lightbox) */
function initLightbox() {
  const lb    = $('lb');
  const panel = $('lb-content');
  const close = $('lb-close');
  if (!lb) return;

  function openLb(src, isVideo) {
    panel.innerHTML = '';
    const el = document.createElement(isVideo ? 'video' : 'img');
    el.src = src;
    if (isVideo) { el.controls = true; el.autoplay = true; }
    el.alt = '';
    panel.appendChild(el);
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    close?.focus();
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    const v = panel.querySelector('video');
    if (v) v.pause();
    setTimeout(() => { panel.innerHTML = ''; }, 300);
  }

  $$('.gitem').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.closest('.vid-btn')) return;
      const vid = item.querySelector('video');
      const img = item.querySelector('img');
      const src = vid?.querySelector('source')?.src || vid?.currentSrc || vid?.src;
      if (src) openLb(src, true);
      else if (img) openLb(img.src, false);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
    });
  });

  close?.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
  });
}

/* LAZY-LOAD VIDEOS */
function initVideoLazy() {
  const vids = $$('video[preload="none"]');
  if (!vids.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.load(); obs.unobserve(e.target); } });
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
        fills.forEach((fill, i) => setTimeout(() => fill.classList.add('animated'), i * 180));
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  const card = document.querySelector('.proficiency-card');
  if (card) obs.observe(card);
}

/* KEYBOARD ACCESSIBILITY */
function initKeyboardNav() {
  $$('.skill-card, .ach-card, .goal').forEach(el => {
    if (el.tagName !== 'A') el.setAttribute('tabindex', '0');
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
  initVideoOverlays();  // wraps videos first
  initViewer();         // double-click modal
  initLightbox();       // gallery single-click lightbox
  initVideoLazy();
  initLangBars();
  initKeyboardNav();
});
