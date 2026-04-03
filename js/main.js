/* ============================================
   main.js — Photographer Portfolio
   共通JavaScript
   ============================================ */

'use strict';

/* ============================================
   PAGE TRANSITION
   ============================================ */

const overlay = document.getElementById('page-overlay');

// ページロード時：フェードイン
window.addEventListener('load', () => {
  document.body.classList.remove('is-loading');
  if (overlay) {
    overlay.classList.remove('active');
  }
});

// リンククリック時：フェードアウト → 遷移
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a');
  if (!anchor) return;
  
  const href = anchor.getAttribute('href');
  if (!href) return;
  
  // 外部リンク・mailto・#アンカーはスキップ
  if (href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || href.startsWith('tel')) return;
  
  e.preventDefault();
  
  if (overlay) {
    overlay.classList.add('active');
  }
  
  setTimeout(() => {
    window.location.href = href;
  }, 500);
});

// ブラウザバック時もフェードイン
window.addEventListener('pageshow', (e) => {
  if (e.persisted && overlay) {
    overlay.classList.remove('active');
  }
});


/* ============================================
   CUSTOM CURSOR
   ============================================ */

const cursor = document.getElementById('cursor');

if (cursor && window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;
  let isHovering = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateCursor = () => {
    const ease = isHovering ? 0.18 : 1.0;
    curX += (mouseX - curX) * ease;
    curY += (mouseY - curY) * ease;
    cursor.style.left = curX + 'px';
    cursor.style.top  = curY + 'px';
    requestAnimationFrame(animateCursor);
  };
  animateCursor();

  const hoverEls = document.querySelectorAll('a, button, [data-cursor]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => { isHovering = true;  cursor.classList.add('is-hovering'); });
    el.addEventListener('mouseleave', () => { isHovering = false; cursor.classList.remove('is-hovering'); });
  });
}


/* ============================================
   INTERSECTION OBSERVER — フェードイン
   ============================================ */

const observeFade = (selector, options = {}) => {
  const defaultOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
    ...options
  };
  
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // 一度だけ発火
      }
    });
  }, defaultOptions);
  
  elements.forEach(el => observer.observe(el));
};

// ページ別に適用
observeFade('.work-item');
observeFade('.detail-gallery__item');
observeFade('.detail-body');
observeFade('.contact-page', { threshold: 0.01 });
observeFade('.about-split__text-col', { threshold: 0.2 });


/* ============================================
   LAZY LOADING IMAGES
   ============================================ */

const lazyImages = document.querySelectorAll('img[data-src]');

if (lazyImages.length) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        img.addEventListener('load', () => {
          img.removeAttribute('data-src');
          img.classList.add('is-loaded');
        });
        
        imgObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '200px 0px', // 200px手前で先読み
    threshold: 0
  });
  
  lazyImages.forEach(img => imgObserver.observe(img));
}

// Aboutページの画像（即時ロード対象）
const aboutImg = document.querySelector('.about-split__img');
if (aboutImg) {
  if (aboutImg.complete) {
    aboutImg.classList.add('is-loaded');
  } else {
    aboutImg.addEventListener('load', () => aboutImg.classList.add('is-loaded'));
  }
}

// Detailページのヒーロー画像
const heroWrap = document.querySelector('.detail-hero');
const heroImg  = document.querySelector('.detail-hero__img');
if (heroImg && heroWrap) {
  if (heroImg.complete) {
    heroWrap.classList.add('is-loaded');
  } else {
    heroImg.addEventListener('load', () => heroWrap.classList.add('is-loaded'));
  }
}


/* ============================================
   NAVのスクロール時スタイル変化
   ============================================ */

const nav = document.querySelector('.nav');
if (nav) {
  const updateNav = () => {
    nav.style.setProperty('--nav-opacity', window.scrollY > 80 ? '1' : '0.9');
  };
  window.addEventListener('scroll', updateNav, { passive: true });
}


/* ============================================
   ACTIVE NAV LINK
   ============================================ */

const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link').forEach(link => {
  const linkPath = link.getAttribute('href');
  if (
    linkPath === currentPath ||
    (currentPath === '' && linkPath === 'index.html') ||
    (currentPath.startsWith('detail') && linkPath === 'index.html')
  ) {
    link.classList.add('is-active');
  }
});


/* ============================================
   SCROLL TO TOP (footer)
   ============================================ */

const topBtn = document.querySelector('.site-footer__top');
if (topBtn) {
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
/* ============================================
   HAMBURGER MENU
   ============================================ */

const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('is-open');
    navLinks.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // メニュー内リンクをタップしたら閉じる
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-open');
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}