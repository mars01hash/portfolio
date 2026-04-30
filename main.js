// ── Initialization ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();
});

// ── Neural Canvas Animation ──────────────────────────────────────
const canvas = document.getElementById('neuralCanvas');
const ctx = canvas.getContext('2d');
let nodes = [], W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initNodes(); });

function initNodes() {
  nodes = [];
  const count = Math.floor((W * H) / 18000);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1
    });
  }
}
initNodes();

function drawCanvas() {
  ctx.clearRect(0, 0, W, H);
  // Background gradient matching design tokens
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#030614');
  bg.addColorStop(1, '#050a24');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 150)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  // Nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(99,102,241,0.7)';
    ctx.fill();
    
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });

  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ── Navbar scroll & Burger ────────────────────────────────────────
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

burger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  const icon = burger.querySelector('i');
  if (navLinks.classList.contains('active')) {
    icon.setAttribute('data-lucide', 'x');
  } else {
    icon.setAttribute('data-lucide', 'menu');
  }
  lucide.createIcons();
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const icon = burger.querySelector('i');
    icon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
  });
});

// ── Counter animation ─────────────────────────────────────────────
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let cur = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) { el.textContent = target; clearInterval(timer); }
      else el.textContent = Math.floor(cur);
    }, 25);
  });
}

// ── Skill bars animation ──────────────────────────────────────────
function animateSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.style.width = bar.dataset.w + '%';
  });
}

// ── Intersection Observer ──────────────────────────────────────────
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -10% 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Trigger specific animations
      if (entry.target.id === 'hero') animateCounters();
      if (entry.target.id === 'skills') animateSkillBars();
      
      // Update Active Link
      const id = entry.target.getAttribute('id');
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  section.classList.add('fade-in-section');
  observer.observe(section);
});

// ── Contact form ──────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type=submit]');
  const originalContent = btn.innerHTML;
  
  btn.innerHTML = 'Message Sent! <i data-lucide="check"></i>';
  btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
  lucide.createIcons();
  
  setTimeout(() => {
    btn.innerHTML = originalContent;
    btn.style.background = '';
    this.reset();
    lucide.createIcons();
  }, 3000);
});
