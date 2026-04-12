gsap.registerPlugin(ScrollTrigger);

// Hero entrance
gsap.timeline({ delay: 0.15 })
  .from('.hero-eyebrow',  { opacity:0, y:16, duration:.5, ease:'power3.out' })
  .from('.hero-headline', { opacity:0, y:36, duration:.8, ease:'power3.out' }, '-=.2')
  .from('.hero-sub',      { opacity:0, y:20, duration:.6 }, '-=.4')
  .from('.hero-chips .chip', { opacity:0, y:12, duration:.4, stagger:.08 }, '-=.3')
  .from('.hero-btns a',   { opacity:0, y:12, duration:.4, stagger:.1 }, '-=.2')
  .from('.hero-nums > div', { opacity:0, y:20, duration:.5, stagger:.1 }, '-=.2')
  .from('.hero-right',    { opacity:0, x:40, duration:.9, ease:'power3.out' }, '-=.7')
  .from('.hero-tag-float',{ opacity:0, y:16, duration:.5 }, '-=.3');

// Scroll reveals
gsap.utils.toArray('.gr').forEach(el => {
  gsap.from(el, { scrollTrigger:{ trigger:el, start:'top 88%' }, opacity:0, y:30, duration:.7, ease:'power3.out' });
});
gsap.utils.toArray('.gr-l').forEach(el => {
  gsap.from(el, { scrollTrigger:{ trigger:el, start:'top 88%' }, opacity:0, x:-36, duration:.8, ease:'power3.out' });
});
gsap.utils.toArray('.gr-r').forEach(el => {
  gsap.from(el, { scrollTrigger:{ trigger:el, start:'top 88%' }, opacity:0, x:36, duration:.8, ease:'power3.out' });
});

// Project cards stagger
gsap.utils.toArray('.proj-card').forEach((card, i) => {
  gsap.from(card, { scrollTrigger:{ trigger:card, start:'top 92%' }, opacity:0, y:32, duration:.6, delay:(i%2)*.1, ease:'power3.out' });
});

// Service cards stagger
gsap.utils.toArray('.svc-card').forEach((card, i) => {
  gsap.from(card, { scrollTrigger:{ trigger:card, start:'top 92%' }, opacity:0, y:24, duration:.5, delay:(i%3)*.08, ease:'power2.out' });
});

// Count up
function countUp(el, target) {
  let cur = 0;
  const step = target / 60;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = Math.floor(cur) + '+';
  }, 16);
}
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { countUp(e.target, parseInt(e.target.dataset.count)); obs.unobserve(e.target); } });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => obs.observe(el));

// Nav shadow on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 80 ? '0 2px 24px rgba(26,22,18,.08)' : 'none';
});
