/**
 * School Cards Slider (mobile)
 * Desktop: grid, Mobile: touch slider
 */
(function () {
  'use strict';

  const track    = document.getElementById('schoolsTrack');
  if (!track) return;

  const cards    = track.querySelectorAll('.school-card');
  const dotsWrap = document.getElementById('schoolsDots');
  const prevBtn  = document.getElementById('schoolsPrev');
  const nextBtn  = document.getElementById('schoolsNext');
  const TOTAL    = cards.length;

  let current    = 0;
  let isMobile   = false;
  let touchStartX = 0;

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < TOTAL; i++) {
      const btn = document.createElement('button');
      btn.className = 'dot-btn' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', `Go to card ${i + 1}`);
      btn.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.dot-btn').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, TOTAL - 1));
    const cardWidth = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  function checkMode() {
    const mobile = window.innerWidth < 768;
    if (mobile !== isMobile) {
      isMobile = mobile;
      if (isMobile) {
        // Enable slider
        track.style.display = 'flex';
        track.style.overflow = 'hidden';
        cards.forEach(c => {
          c.style.minWidth = '100%';
          c.style.flexShrink = '0';
        });
        buildDots();
        goTo(current);
      } else {
        // Disable slider — reset to grid
        track.style.transform = '';
        track.style.display = '';
        cards.forEach(c => {
          c.style.minWidth = '';
          c.style.flexShrink = '';
        });
      }
    }
    if (isMobile) goTo(current);
  }

  // Init
  buildDots();
  checkMode();
  window.addEventListener('resize', checkMode);

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Touch
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1) : goTo(current - 1);
  }, { passive: true });

  // Keyboard on focused cards
  track.addEventListener('keydown', (e) => {
    if (!isMobile) return;
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

})();
