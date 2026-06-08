/**
 * main.js – PSE Landing Page
 * Header scroll, hamburger, marquee pause, form validation,
 * back-to-top, fade-in observer
 */
(function () {
  'use strict';

  /* ---- HEADER SCROLL ---- */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* ---- HAMBURGER ---- */
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    const open = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!open));
    hamburger.classList.toggle('open');
    mobileNav.hidden = open;
  });

  // Close on mobile nav link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
      mobileNav.hidden = true;
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
      mobileNav.hidden = true;
    }
  });

  /* ---- BACK TO TOP ---- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- FADE-IN OBSERVER ---- */
  const fadeEls = document.querySelectorAll(
    '.about__inner, .section-header, .school-card, .highlight-card, .city-card, .testi-card, .statsbar__item'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    fadeEls.forEach(el => obs.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('visible'));
  }

  /* ---- FORM VALIDATION ---- */
  const form = document.getElementById('ctaForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = [
        { id: 'fname',  errId: 'fname-err',  msg: 'Please enter your name.' },
        { id: 'fphone', errId: 'fphone-err', msg: 'Please enter a valid 10-digit mobile number.', pattern: /^[0-9]{10}$/ },
        { id: 'fcity',  errId: 'fcity-err',  msg: 'Please select your city.' },
      ];

      fields.forEach(({ id, errId, msg, pattern }) => {
        const el  = document.getElementById(id);
        const err = document.getElementById(errId);
        el.classList.remove('error');
        err.textContent = '';

        const val = el.value.trim();
        if (!val || (pattern && !pattern.test(val))) {
          el.classList.add('error');
          err.textContent = msg;
          valid = false;
        }
      });

      if (valid) {
        // Success feedback
        const btn = form.querySelector('button[type=submit]');
        btn.textContent = '✓ Registered Successfully!';
        btn.style.background = '#27ae60';
        btn.style.borderColor = '#27ae60';
        form.reset();
        setTimeout(() => {
          btn.textContent = 'Register for Free';
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 3500);
      }
    });

    // Clear error on input
    form.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => {
        el.classList.remove('error');
        const errEl = document.getElementById(el.id + '-err');
        if (errEl) errEl.textContent = '';
      });
    });
  }

  /* ---- ACTIVE NAV LINK (scroll spy) ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header__nav a');

  function updateActiveNav() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
