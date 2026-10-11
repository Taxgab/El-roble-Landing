const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.nav');

const menuFocusables = () => {
  const links = navigation ? Array.from(navigation.querySelectorAll('a')) : [];
  return menuButton ? [menuButton, ...links] : links;
};

function setMenu(open, restoreFocus) {
  const wasOpen = navigation?.classList.contains('open');
  navigation?.classList.toggle('open', open);
  if (menuButton) {
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  document.documentElement.style.overflow = open ? 'hidden' : '';
  if (open && !wasOpen) {
    const items = menuFocusables();
    (items[1] || items[0])?.focus();
  } else if (!open && wasOpen && restoreFocus) {
    menuButton?.focus();
  }
}

menuButton?.addEventListener('click', () => {
  setMenu(!navigation?.classList.contains('open'), false);
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  setMenu(false, false);
}));

document.addEventListener('keydown', (event) => {
  if (!navigation?.classList.contains('open')) return;
  if (event.key === 'Escape') {
    setMenu(false, true);
    return;
  }
  if (event.key !== 'Tab') return;
  const items = menuFocusables();
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  } else if (!items.includes(active)) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!navigation?.classList.contains('open')) return;
  if (navigation.contains(event.target) || menuButton?.contains(event.target)) return;
  setMenu(false, false);
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
