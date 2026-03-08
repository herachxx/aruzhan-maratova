'use strict';

/* helpers */
const $  = id  => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qa = sel => [...document.querySelectorAll(sel)];

/* SIDE NAV */
function initNav() {
  const trigger = $('nav-trigger');
  const nav     = $('side-nav');
  const wrap    = $('site-wrap');
  if (!trigger || !nav) return;

  const isDesktop = () => window.innerWidth > 900;
  let isOpen = false;

  function open() {
    isOpen = true;
    nav.classList.add('open');
    trigger.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
    if (isDesktop() && wrap) wrap.classList.add('open');
  }

  function close() {
    isOpen = false;
    nav.classList.remove('open');
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
    if (wrap) wrap.classList.remove('open');
  }

  // open automatically on desktop
  if (isDesktop()) open();

  // toggle
  trigger.addEventListener('click', () => isOpen ? close() : open());

  // close on nav link click (mobile)
  qa('.side-nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      if (!isDesktop()) close();
    });
  });

  // escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
  });

  // click outside on mobile
  document.addEventListener('click', e => {
    if (!isDesktop() && isOpen &&
        !nav.contains(e.target) &&
        !trigger.contains(e.target)) {
      close();
    }
  });

  // resize: sync open state with layout
  window.addEventListener('resize', () => {
    if (isOpen) {
      if (isDesktop()) wrap?.classList.add('open');
      else             wrap?.classList.remove('open');
    }
  }, { passive: true });
}

/* SCROLL PROGRESS BAR */
function initProgress() {
  const bar = $('progress-bar');
  if (!bar) return;

  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(window.scrollY / total) * 100}%` : '0%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ACTIVE NAV LINK */
function initActiveLink() {
  const sections = qa('section[id], div[id].stats-bar');
  const links    = qa('.side-nav-links a[href^="#"]');
  if (!links.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = links.find(l => l.getAttribute('href') === `#${e.target.id}`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  qa('section[id]').forEach(s => observer.observe(s));
}

/* SCROLL REVEAL */
function initReveal() {
  const els = qa('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* STAGGER DELAYS */
function initStagger() {
  const groups = [
    '.top-skills .skill-card',
    '.ach-grid .ach-card',
    '.cert-row .cert-item',
    '.action-grid .media-card',
    '.nsri-stats .nsri-stat',
    '.goals-grid .goal-card',
    '.contacts-grid .contact-card',
    '.hobbies-grid .hobby-card',
    '.gallery-col .gallery-item',
  ];

  groups.forEach(sel => {
    qa(sel).forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });
}

/* SMOOTH SCROLL */
function initSmoothScroll() {
  qa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ANIMATED COUNTERS */
function parseNum(str) {
  const s = str.replace(/[$,+K]/g, '').trim();
  return parseFloat(s) || null;
}

function formatNum(original, val) {
  const r = Math.round(val);
  let out = '';
  if (original.includes('$')) out += '$';
  if (original.includes('K') && val >= 1000) return out + (val / 1000).toFixed(0) + 'K';
  if (original.includes(',')) return out + r.toLocaleString();
  out += r.toString();
  if (original.includes('+')) out += '+';
  return out;
}

function animateCounter(el) {
  const original = el.textContent.trim();
  const target   = parseNum(original);
  if (!target) return;

  const start = performance.now();
  const dur   = 1300;

  (function step(now) {
    const t = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = formatNum(original, e * target);
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = original;
  })(start);
}

function initCounters() {
  const els = qa('.stat-n, .nsri-n');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.7 });

  els.forEach(el => observer.observe(el));
}

/* HERO PHOTO PARALLAX (desktop only) */
function initParallax() {
  const wrap = $('photo-wrap');
  if (!wrap || window.innerWidth <= 900) return;

  let raf = false;

  document.addEventListener('mousemove', e => {
    if (raf) return;
    raf = true;
    requestAnimationFrame(() => {
      const rx = (e.clientX / window.innerWidth  - 0.5) * 2;
      const ry = (e.clientY / window.innerHeight - 0.5) * 2;
      wrap.style.transform = `perspective(900px) rotateY(${rx * 2.8}deg) rotateX(${-ry * 2}deg)`;
      raf = false;
    });
  });

  document.addEventListener('mouseleave', () => {
    wrap.style.transition = 'transform 0.55s ease';
    wrap.style.transform  = '';
    setTimeout(() => { wrap.style.transition = ''; }, 580);
  });
}

/* GALLERY LIGHTBOX */
function initLightbox() {
  // create lightbox DOM
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="lightbox-media"></div>
    </div>`;
  document.body.appendChild(lb);

  const lbMedia = lb.querySelector('.lightbox-media');
  const lbClose = lb.querySelector('.lightbox-close');

  function openLb(src, isVideo) {
    lbMedia.innerHTML = '';
    if (isVideo) {
      const v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      lbMedia.appendChild(v);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      lbMedia.appendChild(img);
    }
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    const v = lbMedia.querySelector('video');
    if (v) v.pause();
    setTimeout(() => { lbMedia.innerHTML = ''; }, 320);
  }

  // bind gallery items
  qa('.gallery-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const img   = item.querySelector('img');
      const video = item.querySelector('video source');
      if (video) openLb(video.src, true);
      else if (img) openLb(img.src, false);
    });
  });

  // close triggers
  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lb.classList.contains('open')) closeLb();
  });
}

/* VIDEO LAZY LOAD
   don't load video metadata until near viewport */
function initVideoLazy() {
  const videos = qa('video[preload="none"]');
  if (!videos.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.load();
        observer.unobserve(e.target);
      }
    });
  }, { rootMargin: '200px' });

  videos.forEach(v => observer.observe(v));
}

/* INIT */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initProgress();
  initActiveLink();
  initReveal();
  initStagger();
  initSmoothScroll();
  initCounters();
  initParallax();
  initLightbox();
  initVideoLazy();
});
