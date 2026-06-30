/* ============================================================
   ABDELRAHMAN MOHAMED — SHARED SITE BEHAVIOR
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- live clock in status bar ---- */
  const clockEl = document.getElementById('sb-clock');
  function tick(){
    if(!clockEl) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    const ss = String(d.getSeconds()).padStart(2,'0');
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);

  /* ---- scroll progress rail ---- */
  const fill = document.getElementById('progress-fill');
  const header = document.querySelector('header');
  function onScroll(){
    const h = document.documentElement;
    const scrolled = h.scrollTop;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (scrolled / max) * 100 : 0;
    if(fill) fill.style.width = pct + '%';
    if(header) header.classList.toggle('scrolled', scrolled > 8);
  }
  document.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---- mobile nav toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navEl = document.querySelector('nav.primary');
  if(toggle && navEl){
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      navEl.classList.toggle('open');
    });
    navEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        navEl.classList.remove('open');
      });
    });
  }

  /* ---- active nav link by current page ---- */
  const here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('nav.primary a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === here || (here === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  /* ---- scroll reveal ---- */
  const targets = document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(e.isIntersecting){
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.14 });
    targets.forEach(t => obs.observe(t));
  } else {
    targets.forEach(t => t.classList.add('in'));
  }

  /* ---- counters (data-count) ---- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length && 'IntersectionObserver' in window){
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const isFloat = el.dataset.count.includes('.');
        const dur = 1400;
        const t0 = performance.now();
        function step(now){
          const t = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = target * eased;
          el.textContent = isFloat ? val.toFixed(2) : Math.round(val);
          if(t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

});
