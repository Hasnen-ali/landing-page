/**
 * Exhibition Highlights Slider
 * Desktop: 3-column grid, Tablet: 2, Mobile: 1
 * With optional autoplay, prev/next, dots
 */
(function () {
  'use strict';

  const track    = document.getElementById('highlightsTrack');
  if (!track) return;

  const cards    = track.querySelectorAll('.highlight-card');
  const dotsWrap = document.getElementById('highlightsDots');
  const prevBtn  = document.getElementById('highlightsPrev');
  const nextBtn  = document.getElementById('highlightsNext');
  const TOTAL    = cards.length;
  const INTERVAL = 4000;
  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current     = 0;
  let perPage     = 3;
  let maxIndex    = 0;
  let timer       = null;
  let touchStartX = 0;

  function getPerPage() {
    if (window.innerWidth < 600) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = Math.ceil(TOTAL / perPage);
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot-btn' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', `Highlights page ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    const page = Math.floor(current / perPage);
    dotsWrap.querySelectorAll('.dot-btn').forEach((d, i) => {
      d.classList.toggle('active', i === page);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = track.clientWidth / perPage;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  function next() {
    const page = Math.floor(current / perPage);
    const pages = Math.ceil(TOTAL / perPage);
    const nextPage = (page + 1) % pages;
    goTo(nextPage * perPage);
  }
  function prev() {
    const page = Math.floor(current / perPage);
    const pages = Math.ceil(TOTAL / perPage);
    const prevPage = (page - 1 + pages) % pages;
    goTo(prevPage * perPage);
  }

  function setup() {
    perPage = getPerPage();
    maxIndex = Math.max(0, TOTAL - perPage);

    // Apply flex layout
    track.style.display = 'flex';
    track.style.overflow = 'hidden';
    track.style.gap = '0';

    const pct = 100 / perPage;
    cards.forEach(c => {
      c.style.minWidth = `calc(${pct}% - ${(perPage - 1) * 1.5 / perPage}rem)`;
      c.style.margin = '0 0.75rem';
      c.style.flexShrink = '0';
    });

    buildDots();
    goTo(Math.min(current, maxIndex));
  }

  // Init
  setup();
  window.addEventListener('resize', setup);

  // Buttons
  prevBtn.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
  nextBtn.addEventListener('click', () => { next(); stopAuto(); startAuto(); });

  // Touch
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAuto();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  // Keyboard
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });

  // Pause on hover
  const wrap = document.querySelector('.highlights__slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
  }

  // Autoplay
  function startAuto() {
    if (reduced) return;
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }
  function stopAuto() { clearInterval(timer); }

  startAuto();

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  // Show nav
  document.querySelector('.highlights__nav').style.display = 'flex';

})();
