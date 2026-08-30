/* ── THEME TOGGLE ── */
(function () {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');

  const applyTheme = (theme) => {
    if (theme === 'light') html.setAttribute('data-theme', 'light');
    else html.removeAttribute('data-theme');
  };

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem('nx-theme', next);
  });
})();

/* ── SCROLL PROGRESS ── */
const bar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  bar.style.width = pct + '%';
}, { passive: true });

/* ── NAV SOLID ON SCROLL ── */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('solid', window.scrollY > 64);
}, { passive: true });

/* ── HAMBURGER ── */
const burger = document.getElementById('burger');
const mobMenu = document.getElementById('mob-menu');
burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  mobMenu.classList.toggle('open', open);
});
mobMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobMenu.classList.remove('open');
  });
});
document.addEventListener('click', e => {
  if (!navEl.contains(e.target) && !mobMenu.contains(e.target)) {
    burger.classList.remove('open');
    mobMenu.classList.remove('open');
  }
});

/* ── HERO HEADING WORD-BY-WORD ANIMATION ── */
const words = [
  { text: 'Software',   cls: '' },
  { text: 'que',        cls: '' },
  { text: 'transforma', cls: 'gold' },
  { text: 'negocios',   cls: '' },
  { text: 'locales',    cls: 'outline' },
];
const h1 = document.getElementById('hero-h1');
if (h1) {
  words.forEach((w, i) => {
    const sp = document.createElement('span');
    sp.className = 'word' + (w.cls ? ' ' + w.cls : '');
    sp.textContent = w.text;
    sp.style.transitionDelay = (0.3 + i * 0.1) + 's';
    h1.appendChild(sp);
  });
  requestAnimationFrame(() => {
    h1.querySelectorAll('.word').forEach(w => {
      w.style.opacity = '1';
      w.style.transform = 'translateY(0)';
    });
  });
}

/* ── CANVAS PARTICLES ── */
(function () {
  const cv = document.getElementById('particles');
  if (!cv) return;
  const cx = cv.getContext('2d');
  let W, H, pts = [];
  const resize = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - .5) * .28;
      this.vy = (Math.random() - .5) * .28;
      this.r = Math.random() * 1.1 + .3;
      this.a = Math.random() * .32 + .06;
      this.gold = Math.random() > .6;
    }
    tick() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      cx.beginPath();
      cx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      if (light) {
        cx.fillStyle = this.gold
          ? `rgba(32,53,82,${this.a * .55})`
          : `rgba(61,96,153,${this.a * .4})`;
      } else {
        cx.fillStyle = this.gold
          ? `rgba(232,160,32,${this.a})`
          : `rgba(61,96,153,${this.a * .55})`;
      }
      cx.fill();
    }
  }

  for (let i = 0; i < 85; i++) pts.push(new P());

  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function connect() {
    const d = 105;
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < d) {
          const a = (1 - dist / d) * (light ? .04 : .07);
          cx.beginPath();
          cx.moveTo(pts[i].x, pts[i].y);
          cx.lineTo(pts[j].x, pts[j].y);
          cx.strokeStyle = light
            ? `rgba(61,96,153,${a * .9})`
            : ((pts[i].gold || pts[j].gold)
              ? `rgba(232,160,32,${a})`
              : `rgba(100,140,200,${a * .4})`);
          cx.lineWidth = .5;
          cx.stroke();
        }
      }
    }
  }

  function glow() {
    if (mx < 0) return;
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const g = cx.createRadialGradient(mx, my, 0, mx, my, 260);
    g.addColorStop(0, light ? `rgba(61,96,153,.06)` : `rgba(232,160,32,.045)`);
    g.addColorStop(1, 'transparent');
    cx.fillStyle = g;
    cx.fillRect(0, 0, W, H);
  }

  (function loop() {
    cx.clearRect(0, 0, W, H);
    glow();
    connect();
    pts.forEach(p => { p.tick(); p.draw(); });
    requestAnimationFrame(loop);
  })();
})();

/* ── SCROLL REVEAL ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: .1, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('.r').forEach(el => revealObs.observe(el));

/* ── COUNTER ANIMATION ── */
function runCounter(el) {
  const target = +el.dataset.target;
  const suffix = el.dataset.suffix || '';
  const dur = 1600;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      runCounter(e.target);
    }
  });
}, { threshold: .6 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

/* ── SERVICE CARD 3-D TILT ── */
document.querySelectorAll('.service-card:not(.dimmed)').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transition = 'transform .08s ease, border-color .4s, box-shadow .4s';
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform .5s ease, border-color .4s, box-shadow .4s';
    card.style.transform = '';
  });
});

/* ── HOW IT WORKS — line draw on scroll ── */
const lineEl = document.querySelector('.process-steps');
if (lineEl) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) e.target.classList.add('line-in');
  }, { threshold: .3 }).observe(lineEl);
}

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ── FORM SUBMIT ── */
const WEB3FORMS_KEY = 'f281ff29-4cc5-48b4-a88a-9c0bbaa160ce'; // ← reemplaza con tu clave de web3forms.com

async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const originalHTML = btn.innerHTML;

  btn.textContent = 'Enviando…';
  btn.disabled = true;

  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: 'Nueva consulta desde nexirium.tech — ' + (document.getElementById('f-service').value || 'Sin servicio seleccionado'),
    from_name: document.getElementById('f-name').value,
    email: document.getElementById('f-email').value,
    Negocio: document.getElementById('f-biz').value || '—',
    WhatsApp: document.getElementById('f-phone').value || '—',
    Servicio: document.getElementById('f-service').value || '—',
    Mensaje: document.getElementById('f-msg').value || '—',
  };

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    if (result.success) {
      btn.textContent = '✓ Mensaje enviado';
      btn.style.background = '#3DAA73';
      btn.style.boxShadow = '0 0 24px rgba(61,170,115,.3)';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
        e.target.reset();
      }, 3500);
    } else {
      throw new Error(result.message || 'Error desconocido');
    }
  } catch (err) {
    btn.textContent = 'Error al enviar — intenta de nuevo';
    btn.style.background = '#c0392b';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  }
}
