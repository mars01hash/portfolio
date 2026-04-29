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
  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#050818');
  bg.addColorStop(1, '#0a0f2e');
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
    // Glow
    const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 4);
    grd.addColorStop(0, 'rgba(99,102,241,0.3)');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
    ctx.fill();

    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });

  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// Mouse interaction
window.addEventListener('mousemove', e => {
  nodes.forEach(n => {
    const dx = e.clientX - n.x;
    const dy = e.clientY - n.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 120) {
      n.vx -= dx * 0.0003;
      n.vy -= dy * 0.0003;
    }
  });
});

// ── Navbar scroll ─────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Burger menu ───────────────────────────────────────────────────
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
burger.addEventListener('click', () => {
  navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
  if (navLinks.style.display === 'flex') {
    navLinks.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:64px;left:0;right:0;background:rgba(5,8,24,.98);backdrop-filter:blur(20px);padding:20px;border-bottom:1px solid #1e293b';
  }
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => { navLinks.style.display = 'none'; });
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

// ── Skill bars on scroll ──────────────────────────────────────────
function animateSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    bar.style.width = bar.dataset.w + '%';
  });
}

// ── Intersection Observer ──────────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      if (e.target.id === 'hero') animateCounters();
      if (e.target.id === 'skills') animateSkillBars();
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

// Observe all sections for skill bars / counters; fade handled separately
document.querySelectorAll('section').forEach(s => io.observe(s));

// ── Section fade-in ───────────────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  section.fade-section { opacity: 0; transform: translateY(30px); transition: opacity .7s ease, transform .7s ease; }
  section.fade-section.visible { opacity: 1; transform: none; }
`;
document.head.appendChild(style);
// Apply fade to non-hero sections
document.querySelectorAll('section:not(#hero)').forEach(s => s.classList.add('fade-section'));

// ── Contact form ──────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type=submit]');
  btn.textContent = '✅ Message Sent!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => {
    btn.textContent = 'Send Message ✈️';
    btn.style.background = '';
    this.reset();
  }, 3000);
});

// ── Smooth active nav link ────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop, h = sec.offsetHeight;
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + h) link.style.color = '#6366f1';
      else link.style.color = '';
    }
  });
});
