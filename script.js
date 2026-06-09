/**
 * J&C – Junita and Crochet
 * Main JavaScript file
 * Features: navigation, scroll effects, testimonial carousel,
 *           contact form validation, reveal animations, back-to-top
 */

'use strict';

/* ============================================================
   DOM HELPERS
   ============================================================ */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

/* ============================================================
   1. NAVIGATION
   ============================================================ */
(function initNavigation() {
  const header    = $('#header');
  const toggle    = $('#nav-toggle');
  const navList   = $('#nav-list');
  const navLinks  = $$('.nav__link');
  let   menuOpen  = false;

  // Toggle mobile menu
  function setMenu(open) {
    menuOpen = open;
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));

    if (open) {
      navList.classList.add('is-open');
      navList.style.display = 'flex'; // ensure display before animation
    } else {
      navList.classList.remove('is-open');
    }

    // Prevent body scroll when menu open
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', () => setMenu(!menuOpen));

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuOpen) setMenu(false);
    });
  });

  // Close on outside click (backdrop)
  document.addEventListener('click', (e) => {
    if (menuOpen && !navList.contains(e.target) && !toggle.contains(e.target)) {
      setMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) setMenu(false);
  });

  // Header scroll state
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Active link highlight based on scroll position
  const sections = $$('main section[id]');

  function updateActiveLink() {
    const scrollMid = window.scrollY + window.innerHeight / 2;

    let current = sections[0]?.id ?? '';

    sections.forEach(section => {
      if (section.offsetTop <= scrollMid) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active-link', href === current);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();

/* ============================================================
   2. REVEAL ON SCROLL (Intersection Observer)
   ============================================================ */
(function initReveal() {
  const revealItems = $$('.reveal');

  if (!revealItems.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12,
  });

  revealItems.forEach(el => observer.observe(el));
})();

/* ============================================================
   3. TESTIMONIAL CAROUSEL
   ============================================================ */
(function initTestimonials() {
  const track    = $('#testimonials-track');
  const prevBtn  = $('#prev-btn');
  const nextBtn  = $('#next-btn');
  const dotsWrap = $('#testimonials-dots');

  if (!track) return;

  const cards = $$('.testimonial-card', track);
  const total  = cards.length;
  let   index  = 0;
  let   autoId = null;

  // Calculate slides per view
  function slidesPerView() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const perView = slidesPerView();
    const dotCount = Math.ceil(total / perView);

    for (let i = 0; i < dotCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'testimonial-dot';
      btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) btn.classList.add('is-active');
      btn.addEventListener('click', () => goTo(i * perView));
      dotsWrap.appendChild(btn);
    }
  }

  // Update active dot
  function updateDots() {
    const perView  = slidesPerView();
    const dotIndex = Math.floor(index / perView);
    $$('.testimonial-dot', dotsWrap).forEach((dot, i) => {
      dot.classList.toggle('is-active', i === dotIndex);
    });
  }

  // Calculate offset and apply
  function goTo(i) {
    const perView   = slidesPerView();
    const maxIndex  = Math.max(0, total - perView);
    index = Math.min(Math.max(i, 0), maxIndex);

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap       = 24; // matches CSS gap (--space-md)
    const offset    = index * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateButtons();
  }

  function updateButtons() {
    const perView  = slidesPerView();
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index >= total - perView;
    prevBtn.style.opacity = index === 0 ? '0.4' : '1';
    nextBtn.style.opacity = index >= total - perView ? '0.4' : '1';
  }

  prevBtn.addEventListener('click', () => {
    goTo(index - slidesPerView());
    resetAuto();
  });

  nextBtn.addEventListener('click', () => {
    goTo(index + slidesPerView());
    resetAuto();
  });

  // Auto-play
  function startAuto() {
    autoId = setInterval(() => {
      const perView  = slidesPerView();
      const maxIndex = total - perView;
      goTo(index >= maxIndex ? 0 : index + perView);
    }, 4500);
  }

  function resetAuto() {
    clearInterval(autoId);
    startAuto();
  }

  // Touch / swipe support
  let touchStartX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    const threshold = 50;

    if (Math.abs(delta) > threshold) {
      if (delta > 0) goTo(index + slidesPerView());
      else            goTo(index - slidesPerView());
      resetAuto();
    }
  }, { passive: true });

  // Re-init on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildDots();
      goTo(0);
    }, 200);
  });

  // Init
  buildDots();
  goTo(0);
  startAuto();
})();

/* ============================================================
   4. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form        = $('#contact-form');
  if (!form) return;

  const successMsg  = $('#form-success');
  const fields      = {
    name:    { el: $('#name'),    error: $('#name-error'),    validate: v => v.trim().length >= 2  ? '' : 'Please enter your name (min. 2 characters).' },
    email:   { el: $('#email'),   error: $('#email-error'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    subject: { el: $('#subject'), error: $('#subject-error'), validate: v => v  ? '' : 'Please select a topic.' },
    message: { el: $('#message'), error: $('#message-error'), validate: v => v.trim().length >= 10 ? '' : 'Please enter a message (min. 10 characters).' },
  };

  function validateField(key) {
    const { el, error, validate } = fields[key];
    const msg = validate(el.value);
    error.textContent = msg;
    el.classList.toggle('is-error', !!msg);
    return !msg;
  }

  // Live validation on blur
  Object.keys(fields).forEach(key => {
    const { el } = fields[key];
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => {
      // clear error once user starts correcting
      if (el.classList.contains('is-error')) validateField(key);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields).map(validateField).every(Boolean);

    if (!allValid) return;

    // Simulate sending (no backend in this static site)
    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('.btn__text');

    submitBtn.disabled = true;
    btnText.textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      successMsg.classList.add('is-visible');

      // Hide success after 6 seconds
      setTimeout(() => successMsg.classList.remove('is-visible'), 6000);
    }, 1200);
  });
})();

/* ============================================================
   5. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   6. FOOTER YEAR
   ============================================================ */
(function setYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   7. SMOOTH ANCHOR SCROLL (fallback for older browsers)
   ============================================================ */
(function initSmoothScroll() {
  // Modern browsers handle this with CSS scroll-behavior: smooth
  // This is a JS fallback for older browsers / hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight ?? 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   8. GALLERY LIGHTBOX (simple fullscreen view)
   ============================================================ */
(function initLightbox() {
  const galleryItems = $$('.gallery__item');
  if (!galleryItems.length) return;

  // Create lightbox element
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Image preview');
  lightbox.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <div class="lightbox__content">
      <img class="lightbox__img" src="" alt="" />
      <button class="lightbox__close" aria-label="Close preview">&times;</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  // Inject lightbox styles dynamically
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .lightbox.is-open {
      opacity: 1;
      pointer-events: auto;
    }
    .lightbox__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.88);
      backdrop-filter: blur(4px);
    }
    .lightbox__content {
      position: relative;
      z-index: 1;
      max-width: min(90vw, 900px);
      max-height: 90svh;
      border-radius: 12px;
      overflow: hidden;
      transform: scale(0.92);
      transition: transform 0.3s ease;
    }
    .lightbox.is-open .lightbox__content {
      transform: scale(1);
    }
    .lightbox__img {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 90svh;
      object-fit: contain;
    }
    .lightbox__close {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      color: #fff;
      font-size: 1.4rem;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .lightbox__close:hover { background: rgba(255,255,255,0.3); }
  `;
  document.head.appendChild(style);

  const lbImg   = lightbox.querySelector('.lightbox__img');
  const lbClose = lightbox.querySelector('.lightbox__close');

  function open(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => open(img.src, img.alt));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(img.src, img.alt);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View ${img.alt}`);
  });

  lbClose.addEventListener('click', close);
  lightbox.querySelector('.lightbox__backdrop').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ============================================================
   9. FLOATING ANIMATION FOR HERO VISUAL
   ============================================================ */
(function initHeroFloat() {
  const heroCard = document.querySelector('.hero__card--main');
  if (!heroCard) return;

  // Add CSS keyframes for floating
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatY {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-10px); }
    }
    @media (min-width: 900px) {
      .hero__card--main {
        animation: floatY 5s ease-in-out infinite;
      }
      .hero__card--accent {
        animation: floatY 5s ease-in-out 1.2s infinite;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .hero__card--main,
      .hero__card--accent {
        animation: none;
      }
    }
  `;
  document.head.appendChild(style);
})();
