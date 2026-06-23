/* ============================================================
   script.js — Portfolio Language Toggle & UI Animations
   ============================================================ */

// ── State ────────────────────────────────────────────────────
let currentLang = 'en';
let isAnimating = false;

// ── Language Toggle ──────────────────────────────────────────
function toggleLanguage() {
  if (isAnimating) return;
  isAnimating = true;

  const btn = document.getElementById('lang-toggle-btn');
  const allElements = document.querySelectorAll('[data-en][data-jp]');

  // Fade out all translatable elements simultaneously
  allElements.forEach(el => {
    el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(5px)';
  });

  // Button pulse feedback
  btn.style.transform = 'scale(0.93)';
  btn.style.transition = 'transform 0.15s ease';

  setTimeout(() => {
    // Flip language state
    currentLang = currentLang === 'en' ? 'jp' : 'en';

    // Update all text content
    allElements.forEach(el => {
      const newText = el.getAttribute(`data-${currentLang}`);
      if (newText) {
        el.innerHTML = newText;
      }
    });

    // Update document lang attribute
    document.documentElement.setAttribute('lang', currentLang === 'en' ? 'en' : 'ja');

    // Update page title
    const titleEl = document.querySelector('title');
    if (titleEl) {
      titleEl.textContent = titleEl.getAttribute(`data-${currentLang}`) || titleEl.textContent;
    }

    // Update button label
    btn.textContent = currentLang === 'en' ? 'EN / JP' : 'JP / EN';
    btn.style.color = currentLang === 'jp' ? '#7DD3FC' : '#A5B4FC';

    // Fade elements back in with slight stagger feel
    allElements.forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, Math.min(i * 4, 60)); // Stagger up to 60ms max
    });

    // Reset button
    btn.style.transform = 'scale(1)';

    setTimeout(() => {
      isAnimating = false;
    }, 400);

  }, 260);
}

// ── Mobile Menu ──────────────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  menu.classList.toggle('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobile-menu');
  const btn = document.getElementById('mobile-menu-btn');
  if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── Scroll Reveal ────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Navbar Scroll Effect ─────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Add shadow/depth at scroll
  if (currentScrollY > 20) {
    navbar.style.borderBottomColor = 'rgba(99, 102, 241, 0.18)';
  } else {
    navbar.style.borderBottomColor = 'rgba(99, 102, 241, 0.12)';
  }

  // Auto-hide on scroll down, reveal on scroll up (mobile UX)
  if (window.innerWidth < 768) {
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      navbar.style.transform = 'translateY(-100%)';
      navbar.style.transition = 'transform 0.3s ease';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
  } else {
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollY = currentScrollY;
}, { passive: true });

// ── Smooth Scrolling for Nav Links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── PCB Trace Animation on Load ──────────────────────────────
window.addEventListener('load', () => {
  // Animate PCB traces on hero section
  const traces = document.querySelectorAll('.pcb-trace');
  traces.forEach((trace, i) => {
    setTimeout(() => {
      trace.classList.add('animated');
    }, 600 + i * 300);
  });

  // Animate hero content
  const heroContent = document.querySelector('#hero .relative.z-10');
  if (heroContent) {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(20px)';
    heroContent.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    setTimeout(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    }, 150);
  }
});

// ── Skill Chip Micro-interaction ─────────────────────────────
document.querySelectorAll('.skill-chip').forEach(chip => {
  chip.addEventListener('mouseenter', function () {
    this.style.letterSpacing = '0.02em';
  });
  chip.addEventListener('mouseleave', function () {
    this.style.letterSpacing = '';
  });
});

// ── Active Nav Highlight on Scroll ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}`) {
            link.style.color = '#A5B4FC';
          } else {
            link.style.color = '';
          }
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

// ── Project Card Glow on Hover ───────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(99,102,241,0.08) 0%, rgba(30,41,59,0.6) 60%)`;
  });
  card.addEventListener('mouseleave', function () {
    this.style.background = '';
  });
});

// ── Keyboard Accessibility ───────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('mobile-menu');
    if (menu.classList.contains('open')) {
      menu.classList.remove('open');
    }
  }
  // Alt + L shortcut for language toggle
  if (e.altKey && e.key === 'l') {
    toggleLanguage();
  }
});

// ── Reduced Motion Respect ───────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.classList.add('visible');
  });
  document.querySelectorAll('[style*="transition"]').forEach(el => {
    el.style.transition = 'none';
  });
}

// ── Console easter egg ───────────────────────────────────────
console.log(
  '%c⚡ ECE Portfolio %c\nElectronics & Communication Engineer\nHardware · AI · Bilingual JP/EN\nPress Alt+L to toggle language quickly!',
  'background: linear-gradient(135deg, #6366F1, #38BDF8); color: white; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold;',
  'color: #94A3B8; font-family: monospace;'
);
