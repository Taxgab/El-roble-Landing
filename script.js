const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');

function setMenu(open) {
  navigation?.classList.toggle('open', open);
  if (menuButton) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  document.documentElement.style.overflow = open ? 'hidden' : '';
}

menuButton?.addEventListener('click', () => {
  setMenu(!navigation?.classList.contains('open'));
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  setMenu(false);
}));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation?.classList.contains('open')) {
    setMenu(false);
    menuButton?.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!navigation?.classList.contains('open')) return;
  if (navigation.contains(event.target) || menuButton?.contains(event.target)) return;
  setMenu(false);
});

const revealElements = document.querySelectorAll('.reveal');
let observer = null;
try {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  }
} catch (error) {
  observer = null;
}
if (observer) {
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const counters = document.querySelectorAll('[data-count]');
let countObserver = null;
try {
  if ('IntersectionObserver' in window) {
    countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        countObserver.unobserve(element);
        const target = Number(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          element.textContent = target + suffix;
          return;
        }
        const duration = 1300;
        const startTime = performance.now();
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.round(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
  }
} catch (error) {
  countObserver = null;
}
if (countObserver) {
  counters.forEach((element) => countObserver.observe(element));
} else {
  counters.forEach((element) => {
    element.textContent = Number(element.dataset.count) + (element.dataset.suffix || '');
  });
}
const yearElement = document.querySelector('#year');
if (yearElement) yearElement.textContent = new Date().getFullYear();
