/**
 * Hero Slider – PSE Landing Page
 * Dual-axis with auto-play, swipe, keyboard, pause on blur
 */
(function () {
  'use strict';

  const slider      = document.getElementById('heroSlider');
  if (!slider) return;

  const slides      = slider.querySelectorAll('.hero__slide');
  const dots        = document.querySelectorAll('.hero__dot');
  const prevBtn     = document.getElementById('heroPrev');
  const nextBtn     = document.getElementById('heroNext');
  const TOTAL       = slides.length;
  const INTERVAL    = 5000;
  const reduced     = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current  = 0;
  let timer    = null;
  let touchStartX = 0;
  let touchStartY = 0;

  function goTo(index, dir = 'next') {
    if (index === current) return;

    // outgoing
    slides[current].classList.remove('active');
    slides[current].classList.add('exit');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    // clean exit class after transition
    const outgoing = slides[current];
    outgoing.addEventListener('transitionend', () => outgoing.classList.remove('exit'), { once: true });

    current = (index + TOTAL) % TOTAL;

    // incoming
    slides[current].classList.add('active');
    slides[current].setAttribute('aria-hidden', 'false');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1, 'next'); }
  function prev() { goTo(current - 1, 'prev'); }

  // Auto-play
  function startAuto() {
    if (reduced) return;
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }
  function stopAuto() {
    clearInterval(timer);
  }

  // Init
  slides.forEach((s, i) => s.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false'));
  startAuto();

  // Pause on hover
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  // Pause on tab visibility
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  // Buttons
  prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

  // Dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(+dot.dataset.slide);
      stopAuto(); startAuto();
    });
  });

  // Keyboard nav
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prev(); stopAuto(); startAuto(); }
    if (e.key === 'ArrowRight') { next(); stopAuto(); startAuto(); }
  });

  // Touch / Swipe
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    stopAuto();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    startAuto();
  }, { passive: true });

})();
