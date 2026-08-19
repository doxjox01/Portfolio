/* ============================================================
   DHRUV CHANANA PORTFOLIO — script.js
   Animations, interactions, particle background
   ============================================================ */

// ─── CURSOR GLOW ───────────────────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ─── PARTICLE CANVAS BACKGROUND ────────────────────────────
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.4 + 0.05;
    const hues = [260, 190, 280, 200];
    this.hue   = hues[Math.floor(Math.random() * hues.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── NAVBAR SCROLL EFFECT ──────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ─── HAMBURGER MENU ────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const navLinksEl  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});
navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

// ─── TYPEWRITER EFFECT ─────────────────────────────────────
const roles = [
  'things with React & Node',
  'full-stack web apps',
  'projects that actually work',
  'cool stuff with Python',
  'AI & ML projects',
];
let roleIndex   = 0;
let charIndex   = 0;
let isDeleting  = false;
const typeEl    = document.getElementById('typewriter');

function type() {
  const currentRole = roles[roleIndex];
  if (isDeleting) {
    typeEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 400;
  }
  setTimeout(type, delay);
}
type();

// ─── SCROLL REVEAL ─────────────────────────────────────────
const revealEls = document.querySelectorAll(
  '.skill-category, .project-card, .timeline-item, .cert-card, ' +
  '.contact-card, .info-card, .about-text, .about-info-cards'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * (Array.from(entry.target.parentNode.children).indexOf(entry.target)));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── SCORE BAR ANIMATION ON SCROLL ────────────────────────
const scoreObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = 'fillBar 1.5s ease both';
      scoreObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.score-fill').forEach(bar => {
  scoreObserver.observe(bar);
});

// ─── CONTACT FORM HANDLER ─────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const btn     = document.getElementById('send-msg-btn');

  // Simulate sending (open mailto)
  const name    = document.getElementById('senderName').value;
  const email   = document.getElementById('senderEmail').value;
  const subject = document.getElementById('messageSubject').value || 'Portfolio Inquiry';
  const message = document.getElementById('messageBody').value;

  const mailtoLink = `mailto:Dhruvchanana7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Dhruv,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`)}`;
  window.open(mailtoLink, '_blank');

  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';

  setTimeout(() => {
    form.reset();
    success.style.display = 'block';
    btn.textContent = 'Send Message ✈️';
    btn.style.opacity = '1';
    setTimeout(() => { success.style.display = 'none'; }, 5000);
  }, 1000);
}

// ─── SMOOTH SCROLL FOR NAV LINKS ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── SKILL TAG HOVER RIPPLE ────────────────────────────────
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function () {
    this.style.transform = 'scale(1.05)';
  });
  tag.addEventListener('mouseleave', function () {
    this.style.transform = 'scale(1)';
  });
});

// ─── COUNTER ANIMATION FOR STATS ──────────────────────────
function animateCounter(el, target, suffix = '', duration = 1500) {
  let start = 0;
  const startTime = performance.now();
  const isFloat   = target % 1 !== 0;
  function update(time) {
    const elapsed  = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = isFloat
      ? (eased * target).toFixed(2)
      : Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = entry.target.querySelectorAll('.stat-num');
      const targets  = [8.22, 2, 3];
      const suffixes = ['', '+', '+'];
      statNums.forEach((el, i) => {
        animateCounter(el, targets[i], suffixes[i]);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── PAGE LOAD FADE-IN ─────────────────────────────────────
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
