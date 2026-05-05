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

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
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
   TESTIMONIAL CAROUSEL
   ============================================================ */
(function () {
  const track   = document.querySelector('.testimonials-track');
  if (!track) return;

  const slides  = Array.from(track.querySelectorAll('.testimonial-card'));
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots    = Array.from(document.querySelectorAll('.carousel-dot'));
  let   current = 0;
  let   timer;

  function goTo(i) {
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    current = i;
  }

  function next() { goTo((current + 1) % slides.length); }
  function prev() { goTo((current - 1 + slides.length) % slides.length); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetTimer(); }));

  goTo(0);
  resetTimer();
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
