// ===== Initialize Lucide Icons =====
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  initStarField();
  initNavbar();
  initScrollAnimations();
  initCounters();
  initContactForm();
  initSmoothScroll();
  initActiveNavLink();
  initCustomCursor();
});

// ===== STAR FIELD =====
function initStarField() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 220;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create stars
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.005 + 0.002,
      phase: Math.random() * Math.PI * 2,
      drift: (Math.random() - 0.5) * 0.15
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = performance.now() * 0.001;
    stars.forEach(s => {
      const twinkle = 0.4 + 0.6 * Math.sin(time * s.speed * 60 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 180, 255, ${twinkle * 0.8})`;
      ctx.fill();
      // Subtle glow on bigger stars
      if (s.r > 1) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 130, 255, ${twinkle * 0.12})`;
        ctx.fill();
      }
      s.y += s.drift * 0.3;
      if (s.y > canvas.height) s.y = 0;
      if (s.y < 0) s.y = canvas.height;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay) || 0;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ===== COUNTER ANIMATION =====
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ===== ACTIVE NAV LINK =====
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  window.addEventListener('scroll', () => {
    let current = '';
    
    // 1. Bottom of Page Edge-Case
    // If the user has scrolled to the very bottom, activate the last section (Contact)
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10) {
      if (sections.length > 0) {
        current = sections[sections.length - 1].id;
      }
    } else {
      // 2. Normal scroll logic
      sections.forEach(section => {
        // Adjust the offset to trigger when section is in the upper part of viewport
        const top = section.offsetTop - 150; 
        if (window.scrollY >= top) {
          current = section.id;
        }
      });
    }

    // Update active class on nav links
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });
}

// ===== CONTACT FORM (EmailJS) =====
// ╔══════════════════════════════════════════════════════════════════╗
// ║  EMAILJS CONFIGURATION — REPLACE THESE WITH YOUR ACTUAL VALUES  ║
// ║                                                                  ║
// ║  1. Sign up at https://www.emailjs.com (free tier = 200/month)  ║
// ║  2. Add an Email Service (Gmail) → copy the SERVICE_ID          ║
// ║  3. Create an Email Template → copy the TEMPLATE_ID             ║
// ║     Template variables: {{from_name}}, {{from_email}}, {{message}} ║
// ║  4. Copy your PUBLIC_KEY from Account > API Keys                ║
// ║                                                                  ║
// ║  If deploying on Vercel, add these as Environment Variables:    ║
// ║    EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY  ║
// ╚══════════════════════════════════════════════════════════════════╝
const EMAILJS_SERVICE_ID  = 'service_yik1k5w';
const EMAILJS_TEMPLATE_ID = 'template_xbn2b97';
const EMAILJS_PUBLIC_KEY   = 'eA0w3VIhxgG1TdGeO';

function initContactForm() {
  // Initialize EmailJS with v4 syntax
  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    console.log('✅ EmailJS initialized successfully');
  } else {
    console.warn('⚠️ EmailJS SDK not loaded');
  }

  const form = document.getElementById('contactForm');
  const btn = document.getElementById('contactSubmit');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // ── Field-level validation ──
    let hasError = false;

    if (!name) {
      nameInput.closest('.input-wrapper').classList.add('input-error');
      hasError = true;
    }
    if (!email) {
      emailInput.closest('.input-wrapper').classList.add('input-error');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.closest('.input-wrapper').classList.add('input-error');
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!message) {
      messageInput.closest('.input-wrapper').classList.add('input-error');
      hasError = true;
    }

    if (hasError) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // ── Set loading state ──
    btn.disabled = true;
    btn.classList.add('btn-loading');
    btn.innerHTML = '<span>Sending...</span><span class="btn-spinner"></span>';

    try {
      if (!window.emailjs) {
        throw new Error('EmailJS SDK not loaded. Check your internet connection.');
      }

      // Template params must EXACTLY match your EmailJS template variables
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message
      };

      console.log('📧 Sending email with params:', templateParams);

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log('✅ Email sent successfully');
      showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
      form.reset();
    } catch (err) {
      // Detailed error logging for debugging
      console.log('❌ EmailJS Error:', err);
      console.log('Error status:', err?.status);
      console.log('Error text:', err?.text);

      let errorMsg = 'Failed to send message. Please try again or email me directly.';
      if (err?.text) {
        errorMsg += ' (' + err.text + ')';
      }
      showToast(errorMsg, 'error');
    } finally {
      // ── Restore button ──
      btn.disabled = false;
      btn.classList.remove('btn-loading');
      btn.innerHTML = '<span>Send Message</span><i data-lucide="send"></i>';
      if (window.lucide) lucide.createIcons();
    }
  });

  // Remove error highlight on input focus
  [nameInput, emailInput, messageInput].forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.input-wrapper').classList.remove('input-error');
    });
  });
}

// ===== TOAST NOTIFICATION =====
let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastIcon = document.getElementById('toastIcon');
  const toastMsg = document.getElementById('toastMessage');

  // Clear any existing timer
  if (toastTimer) clearTimeout(toastTimer);

  // Set content
  toastMsg.textContent = message;
  toastIcon.innerHTML = type === 'success' ? '✓' : '✕';

  // Set type classes
  toast.className = 'toast toast-' + type;

  // Trigger show
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Auto-hide after 5 seconds
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 5000);
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  const canvas = document.getElementById('cursor-trail');
  if (!dot || !ring || !canvas) return;

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  document.body.classList.add('has-custom-cursor');

  let mouseX = width / 2;
  let mouseY = height / 2;
  let ringX = width / 2;
  let ringY = height / 2;

  const particles = [];

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!dot.classList.contains('visible')) {
      dot.classList.add('visible');
      ring.classList.add('visible');
    }

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    
    // Add particle
    particles.push({
      x: mouseX,
      y: mouseY,
      size: Math.random() * 2.5 + 1,
      life: 1,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5
    });
  });

  // Hover states
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .project-card, .nav-link');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hover');
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hover');
      ring.classList.remove('hover');
    });
  });

  // Click state
  window.addEventListener('mousedown', () => ring.classList.add('clicking'));
  window.addEventListener('mouseup', () => ring.classList.remove('clicking'));

  function render() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life -= 0.025;
      p.x += p.vx;
      p.y += p.vy;
      p.size *= 0.96;

      if (p.life <= 0) {
        particles.splice(i, 1);
        i--;
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(189, 164, 251, ${p.life * 0.6})`;
      ctx.fill();
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
