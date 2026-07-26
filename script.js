/* ============================================================
   Lucky Kumar — Portfolio JavaScript
   Handles: loader, navbar, typewriter, glitch, scroll reveal,
            skill bar animation, contact form, back-to-top
   ============================================================ */

'use strict';

/* ── Loader ──────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Give the fill animation time to complete (1.2s) then fade out
  setTimeout(() => {
    loader.classList.add('hidden');
    // Kick off entry animations after loader exits
    triggerHeroEntry();
  }, 1400);
});

/* ── Hero entry animation ────────────────────────────────────── */
function triggerHeroEntry() {
  const items = [
    '.hero-eyebrow',
    '.hero-name',
    '.hero-role',
    '.hero-tagline',
    '.hero-actions',
  ];
  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    // Force reflow then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ── Typewriter ──────────────────────────────────────────────── */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'full-stack web apps',
  'AI-powered tools',
  'elegant Python scripts',
  'interactive UIs',
  'generative AI systems',
];
let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;
let twDelay    = 2000; // pause at end of phrase

function typeWrite() {
  const current = phrases[phraseIdx];

  if (!isDeleting) {
    typewriterEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeWrite, twDelay);
      return;
    }
  } else {
    typewriterEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  setTimeout(typeWrite, isDeleting ? 50 : 80);
}

// Start typewriter after loader finishes
setTimeout(typeWrite, 1600);

/* ── Hero coding background animation ────────────────────────── */
function initHeroCodeBg() {
  const canvas = document.getElementById('heroCodeCanvas');
  const hero = document.getElementById('home');
  if (!canvas || !hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const fontFamily = '"JetBrains Mono", monospace';
  const fontSize = 13;
  const charSet = '{}[]();=><+-*/&|!?:.0123456789constletfnifelseforwhileasyncawaitimportexportreturnclassdefprint';
  const snippets = [
    'const build = () => {',
    'import React from "react"',
    'def train_model():',
    'async function fetchData()',
    'git push origin main',
    'npm run dev',
    'return res.json(data)',
    'useEffect(() => {}, [])',
    'class Portfolio {',
    'SELECT * FROM users',
    'docker compose up',
    'model.fit(X, y)',
    'try: except Exception:',
    'public static void main',
    'export default App',
    'console.log("debug")',
    'pip install torch',
    'if (response.ok) {',
  ];

  let width = 0;
  let height = 0;
  let animId = 0;
  let columns = 0;
  let drops = [];
  let floaters = [];
  let running = true;

  function createFloater(scattered) {
    return {
      x: Math.random() * width,
      y: scattered ? Math.random() * height : height + 24,
      text: snippets[Math.floor(Math.random() * snippets.length)],
      speed: 0.18 + Math.random() * 0.42,
      drift: (Math.random() - 0.5) * 0.1,
      opacity: 0.05 + Math.random() * 0.09,
      accent: Math.random() > 0.55,
      size: 11 + Math.random() * 4,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -120);

    const floaterCount = Math.min(16, Math.max(8, Math.floor(width / 85)));
    floaters = Array.from({ length: floaterCount }, () => createFloater(true));
  }

  function draw() {
    if (!running) return;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px ${fontFamily}`;
    for (let i = 0; i < columns; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const char = charSet[Math.floor(Math.random() * charSet.length)];
      const bright = Math.random() > 0.965;
      ctx.fillStyle = bright
        ? 'rgba(34, 211, 238, 0.42)'
        : 'rgba(129, 140, 248, 0.13)';
      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.985) drops[i] = 0;
      drops[i] += 0.32 + (i % 4) * 0.07;
    }

    floaters.forEach((floater, index) => {
      floater.y -= floater.speed;
      floater.x += floater.drift;
      if (floater.y < -28) floaters[index] = createFloater(false);

      ctx.font = `${floater.size}px ${fontFamily}`;
      ctx.fillStyle = floater.accent
        ? `rgba(34, 211, 238, ${floater.opacity})`
        : `rgba(129, 140, 248, ${floater.opacity})`;
      ctx.fillText(floater.text, floater.x, floater.y);
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(animId);
    } else {
      running = true;
      draw();
    }
  });
}

initHeroCodeBg();

/* ── Navbar scroll styling ───────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
  toggleBackToTop();
});

/* ── Hamburger menu ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ── Active nav link tracking ────────────────────────────────── */
const sections = document.querySelectorAll('main section[id]');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (!link) return;
    const inView = sec.offsetTop <= scrollPos &&
                   sec.offsetTop + sec.offsetHeight > scrollPos;
    link.classList.toggle('active', inView);
  });
}

/* ── Scroll reveal ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger reveals within a group
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.in-view)')];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Skill bar animation ─────────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const target = fill.getAttribute('data-w');
      fill.style.width = `${target}%`;
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(f => skillObserver.observe(f));

/* ── Back to top ─────────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Contact form validation ─────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

function showError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.add('error');
  error.textContent = msg;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.remove('error');
  error.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Live clearing of errors on input
['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => clearError(id, `${id}Error`));
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  // Reset all errors
  ['name', 'email', 'subject', 'message'].forEach(id => clearError(id, `${id}Error`));

  if (!name) {
    showError('name', 'nameError', 'Please enter your name.');
    valid = false;
  }
  if (!email) {
    showError('email', 'emailError', 'Please enter your email.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  }
  if (!subject) {
    showError('subject', 'subjectError', 'Please enter a subject.');
    valid = false;
  }
  if (!message || message.length < 10) {
    showError('message', 'messageError', 'Message must be at least 10 characters.');
    valid = false;
  }

  if (!valid) return;

  // Simulate submit (replace with real API / Formspree / EmailJS)
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Sending…';

  setTimeout(() => {
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Send Message';
    contactForm.reset();
    const successEl = document.getElementById('formSuccess');
    successEl.classList.add('visible');
    setTimeout(() => successEl.classList.remove('visible'), 5000);
  }, 1200);
});

/* ── Smooth scroll for all anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
