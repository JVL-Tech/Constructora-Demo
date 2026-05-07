'use strict';
/* ============================================================
   ELITE CONSTRUCTION HUB — main.js
   Vanilla JS, sin dependencias externas
   ============================================================ */

/* ============================================================
   STICKY HEADER + SCROLL CLASS
   ============================================================ */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ============================================================
   MOBILE MENU
   ============================================================ */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-overlay';
  document.body.appendChild(overlay);

  // Reestructurar contenido del nav: cabecera + links + footer (botón CTA)
  const originalLinks = Array.from(mobileNav.children);
  const ctaBtn = originalLinks.find(el => el.classList.contains('btn'));
  const links = originalLinks.filter(el => !el.classList.contains('btn'));

  mobileNav.innerHTML = '';

  // Cabecera con logo y botón cerrar
  const navHeader = document.createElement('div');
  navHeader.className = 'mobile-nav-header';
  const headerLogo = document.querySelector('.logo');
  if (headerLogo) {
    const logoClone = headerLogo.cloneNode(true);
    navHeader.appendChild(logoClone);
  }
  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-nav-close';
  closeBtn.setAttribute('aria-label', 'Cerrar menú');
  closeBtn.innerHTML = '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  navHeader.appendChild(closeBtn);
  mobileNav.appendChild(navHeader);

  // Links
  const linksWrap = document.createElement('div');
  linksWrap.className = 'mobile-nav-links';
  links.forEach(el => linksWrap.appendChild(el));
  mobileNav.appendChild(linksWrap);

  // Footer con CTA
  if (ctaBtn) {
    const navFooter = document.createElement('div');
    navFooter.className = 'mobile-nav-footer';
    navFooter.appendChild(ctaBtn);
    mobileNav.appendChild(navFooter);
  }

  // Toggle
  function openNav() {
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeNav() : openNav();
  });

  closeBtn.addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });
})();

/* ============================================================
   ACTIVE NAV LINK
   ============================================================ */
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ============================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ============================================================ */
(function () {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */
(function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  function animateCounter(el, target, duration) {
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.counter, 10);
        animateCounter(entry.target, target, 2000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   GOOGLE REVIEWS — CARRUSEL EN MÓVIL
   ============================================================ */
(function () {
  const grid = document.querySelector('.google-reviews-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.greview-card'));
  if (cards.length < 2) return;

  // Crear controles
  const controls = document.createElement('div');
  controls.className = 'greview-controls';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'greview-btn';
  prevBtn.setAttribute('aria-label', 'Anterior');
  prevBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>';

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'greview-dots';
  const dots = cards.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'greview-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Reseña ' + (i + 1));
    dotsWrap.appendChild(d);
    return d;
  });

  const nextBtn = document.createElement('button');
  nextBtn.className = 'greview-btn';
  nextBtn.setAttribute('aria-label', 'Siguiente');
  nextBtn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>';

  controls.appendChild(prevBtn);
  controls.appendChild(dotsWrap);
  controls.appendChild(nextBtn);
  grid.parentElement.appendChild(controls);

  let current = 0;
  let timer;
  const MOBILE = () => window.innerWidth <= 768;

  function goTo(i) {
    current = (i + cards.length) % cards.length;
    if (MOBILE()) {
      cards.forEach((c, idx) => {
        if (idx === current) {
          // Re-disparar animación quitando y volviendo a poner la clase
          c.classList.remove('greview-active');
          void c.offsetWidth; // reflow para reiniciar animation
          c.classList.add('greview-active');
        } else {
          c.classList.remove('greview-active');
        }
      });
    } else {
      cards.forEach(c => c.classList.remove('greview-active'));
    }
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetTimer(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetTimer(); });
  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetTimer(); }));

  // Swipe táctil
  let startX = 0;
  grid.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  grid.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
  }, { passive: true });

  // Init y resize
  function init() {
    if (MOBILE()) {
      goTo(current);
      controls.style.display = 'flex';
      resetTimer();
    } else {
      clearInterval(timer);
      cards.forEach(c => c.classList.remove('greview-active'));
      controls.style.display = 'none';
    }
  }

  window.addEventListener('resize', init);
  init();
})();

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ============================================================
   PORTFOLIO FILTER
   ============================================================ */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      btns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
})();

/* ============================================================
   MULTI-STEP FORM
   ============================================================ */
(function () {
  const form = document.querySelector('.multistep-form');
  if (!form) return;

  const steps     = Array.from(form.querySelectorAll('.form-step'));
  const dotItems  = Array.from(document.querySelectorAll('.progress-step-item'));
  const bar       = document.querySelector('.progress-bar-fill');
  let   current   = 0;

  function updateUI() {
    steps.forEach((s, i) => s.classList.toggle('active', i === current));
    dotItems.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.classList.toggle('completed', i < current);
    });
    if (bar) bar.style.width = `${(current / (steps.length - 1)) * 100}%`;
  }

  function validateStep(idx) {
    let ok = true;
    steps[idx].querySelectorAll('[required]').forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group && group.classList.add('has-error');
        ok = false;
      } else {
        group && group.classList.remove('has-error');
      }
    });
    return ok;
  }

  form.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(current) && current < steps.length - 1) {
        current++;
        updateUI();
        window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      }
    });
  });

  form.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) { current--; updateUI(); }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (validateStep(current)) {
      const msg = document.querySelector('.form-success-msg');
      if (msg) {
        msg.style.display = 'flex';
        form.style.opacity = '0.4';
        form.style.pointerEvents = 'none';
      }
    }
  });

  // Clear errors on input
  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', function () {
      const group = this.closest('.form-group');
      if (group && this.value.trim()) group.classList.remove('has-error');
    });
  });

  updateUI();
})();

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let ok = true;

    this.querySelectorAll('[required]').forEach(input => {
      const group = input.closest('.form-group');
      if (!input.value.trim()) {
        group && group.classList.add('has-error');
        ok = false;
      } else {
        group && group.classList.remove('has-error');
      }
    });

    const email = this.querySelector('input[type="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest('.form-group')?.classList.add('has-error');
      ok = false;
    }

    if (ok) {
      const msg = document.querySelector('.form-success-msg');
      if (msg) { msg.style.display = 'flex'; }
      this.reset();
      setTimeout(() => { if (msg) msg.style.display = 'none'; }, 6000);
    }
  });

  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', function () {
      const group = this.closest('.form-group');
      if (group && this.value.trim()) group.classList.remove('has-error');
    });
  });
})();

/* ============================================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    }
  });
});

/* ============================================================
   FAQ CATEGORY FILTER (Página FAQ)
   ============================================================ */
(function () {
  const catBtns = document.querySelectorAll('.faq-cat-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  if (!catBtns.length) return;

  catBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      catBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.category;

      faqItems.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
        if (!show) item.classList.remove('open');
      });
    });
  });
})();
