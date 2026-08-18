/* ============================================================
   Lucky Kumar — Portfolio JavaScript
   Handles: loader, navbar, typewriter, glitch, scroll reveal,
            skill bar animation, contact form, back-to-top
   ============================================================ */

'use strict';

/* ── Loader ──────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Give the fill animation time to complete (1.2s) then fade out
  setTimeout(() => {
    loader.classList.add('hidden');
    // Kick off entry animations after loader exits
    triggerHeroEntry();
  }, 1400);
});

/* ── Hero entry animation ────────────────────────────────────── */
function triggerHeroEntry() {
  const items = [
    '.hero-eyebrow',
    '.hero-name',
    '.hero-role',
    '.hero-tagline',
    '.hero-actions',
  ];
  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    // Force reflow then animate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ── Typewriter ──────────────────────────────────────────────── */
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'full-stack web apps',
  'AI-powered tools',
  'elegant Python scripts',
  'interactive UIs',
  'generative AI systems',
];
let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;
let twDelay    = 2000; // pause at end of phrase

function typeWrite() {
  const current = phrases[phraseIdx];

  if (!isDeleting) {
    charIdx++;
    typewriterEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeWrite, twDelay);
      return;
    }
  } else {
    charIdx--;
    typewriterEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }

  setTimeout(typeWrite, isDeleting ? 50 : 80);
}

// Start typewriter after loader finishes
setTimeout(typeWrite, 1600);

/* ── Hero coding background animation ────────────────────────── */
function initHeroCodeBg() {
  const canvas = document.getElementById('heroCodeCanvas');
  const hero = document.getElementById('home');
  if (!canvas || !hero) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  const fontFamily = '"JetBrains Mono", monospace';
  const fontSize = 13;
  const charSet = '{}[]();=><+-*/&|!?:.0123456789constletfnifelseforwhileasyncawaitimportexportreturnclassdefprint';
  const snippets = [
    'const build = () => {',
    'import React from "react"',
    'def train_model():',
    'async function fetchData()',
    'git push origin main',
    'npm run dev',
    'return res.json(data)',
    'useEffect(() => {}, [])',
    'class Portfolio {',
    'SELECT * FROM users',
    'docker compose up',
    'model.fit(X, y)',
    'try: except Exception:',
    'public static void main',
    'export default App',
    'console.log("debug")',
    'pip install torch',
    'if (response.ok) {',
  ];

  let width = 0;
  let height = 0;
  let animId = 0;
  let columns = 0;
  let drops = [];
  let floaters = [];
  let running = true;

  function createFloater(scattered) {
    return {
      x: Math.random() * width,
      y: scattered ? Math.random() * height : height + 24,
      text: snippets[Math.floor(Math.random() * snippets.length)],
      speed: 0.18 + Math.random() * 0.42,
      drift: (Math.random() - 0.5) * 0.1,
      opacity: 0.05 + Math.random() * 0.09,
      accent: Math.random() > 0.55,
      size: 11 + Math.random() * 4,
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.offsetWidth;
    height = hero.offsetHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    columns = Math.ceil(width / fontSize);
    drops = Array.from({ length: columns }, () => Math.random() * -120);

    const floaterCount = Math.min(16, Math.max(8, Math.floor(width / 85)));
    floaters = Array.from({ length: floaterCount }, () => createFloater(true));
  }

  function draw() {
    if (!running) return;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px ${fontFamily}`;
    for (let i = 0; i < columns; i++) {
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      const char = charSet[Math.floor(Math.random() * charSet.length)];
      const bright = Math.random() > 0.965;
      ctx.fillStyle = bright
        ? 'rgba(34, 211, 238, 0.42)'
        : 'rgba(129, 140, 248, 0.13)';
      ctx.fillText(char, x, y);

      if (y > height && Math.random() > 0.985) drops[i] = 0;
      drops[i] += 0.32 + (i % 4) * 0.07;
    }

    floaters.forEach((floater, index) => {
      floater.y -= floater.speed;
      floater.x += floater.drift;
      if (floater.y < -28) floaters[index] = createFloater(false);

      ctx.font = `${floater.size}px ${fontFamily}`;
      ctx.fillStyle = floater.accent
        ? `rgba(34, 211, 238, ${floater.opacity})`
        : `rgba(129, 140, 248, ${floater.opacity})`;
      ctx.fillText(floater.text, floater.x, floater.y);
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  draw();

  let resizeTimeout;
  const resizeObserver = new ResizeObserver(() => {
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(resize);
  });
  resizeObserver.observe(hero);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(animId);
    } else {
      running = true;
      draw();
    }
  });
}

initHeroCodeBg();

/* ── Navbar scroll styling ───────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
  toggleBackToTop();
});

/* ── Hamburger menu ──────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks.classList.contains('open'));
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

/* ── Active nav link tracking ────────────────────────────────── */
const sections = document.querySelectorAll('main section[id]');

function updateActiveNav() {
  const scrollPos = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    if (!link) return;
    const inView = sec.offsetTop <= scrollPos &&
                   sec.offsetTop + sec.offsetHeight > scrollPos;
    link.classList.toggle('active', inView);
  });
}

/* ── Scroll reveal ───────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger reveals within a group
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.in-view)')];
      const delay = siblings.indexOf(entry.target) * 80;
      setTimeout(() => {
        entry.target.classList.add('in-view');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Skill bar animation ─────────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const target = fill.getAttribute('data-w');
      fill.style.width = `${target}%`;
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(f => skillObserver.observe(f));

/* ── Back to top ─────────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Contact form validation ─────────────────────────────────── */
const contactForm = document.getElementById('contactForm');

function showError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.add('error');
  error.textContent = msg;
}

function clearError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  field.classList.remove('error');
  error.textContent = '';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Live clearing of errors on input
['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => clearError(id, `${id}Error`));
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  // Reset all errors
  ['name', 'email', 'subject', 'message'].forEach(id => clearError(id, `${id}Error`));

  if (!name) {
    showError('name', 'nameError', 'Please enter your name.');
    valid = false;
  }
  if (!email) {
    showError('email', 'emailError', 'Please enter your email.');
    valid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  }
  if (!subject) {
    showError('subject', 'subjectError', 'Please enter a subject.');
    valid = false;
  }
  if (!message || message.length < 10) {
    showError('message', 'messageError', 'Message must be at least 10 characters.');
    valid = false;
  }

  if (!valid) return;

  // Simulate submit (replace with real API / Formspree / EmailJS)
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.querySelector('.btn-text').textContent = 'Sending…';

  setTimeout(() => {
    btn.disabled = false;
    btn.querySelector('.btn-text').textContent = 'Send Message';
    contactForm.reset();
    const successEl = document.getElementById('formSuccess');
    successEl.classList.add('visible');
    setTimeout(() => successEl.classList.remove('visible'), 5000);
  }, 1200);
});

/* ── Smooth scroll for all anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-h'), 10) || 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── AI Healthcare Assistant (Tars & RAG) Interactive Modal Logic ─ */
function initTarsHealthcareModal() {
  const modal = document.getElementById('tarsHealthcareModal');
  if (!modal) return;

  const openBtns = document.querySelectorAll('.open-modal-btn[data-modal="tarsHealthcareModal"]');
  const closeBtn = modal.querySelector('.modal-close');
  const tabBtns = modal.querySelectorAll('.tab-btn');
  const tabPanes = modal.querySelectorAll('.tab-pane');
  let lastActiveElement = null;

  // Open modal
  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      lastActiveElement = document.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Tab switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const activePane = document.getElementById(`tab-${targetTab}`);
      if (activePane) activePane.classList.add('active');
    });
  });

  /* ── Tab 1: RAG Interactive Chat Engine ── */
  const ragForm = document.getElementById('ragChatForm');
  const ragInput = document.getElementById('ragQueryInput');
  const ragMessages = document.getElementById('ragChatMessages');
  const presetBtns = modal.querySelectorAll('.preset-btn');
  
  const similarityFill = document.getElementById('similarityFill');
  const similarityText = document.getElementById('similarityText');
  const retrievedDocBadge = document.getElementById('retrievedDocBadge');
  const retrievedChunkText = document.getElementById('retrievedChunkText');
  const promptSnippet = document.getElementById('promptTemplateSnippet');

  const ragKnowledgeBase = [
    {
      keywords: ['hour', 'time', 'open', 'emergency', 'working', 'rule'],
      docId: 'DOC-124',
      docName: 'Outpatient Operating Hours & Doctor Rosters',
      chunk: 'OPD hours are Mon-Sat 8:00 AM - 8:00 PM. Emergency Triage operates 24/7 with immediate trauma care.',
      score: 0.952,
      response: 'Our Outpatient Department (OPD) is open Monday through Saturday from 8:00 AM to 8:00 PM. Emergency and critical care consultation is available 24/7 with immediate trauma team availability.'
    },
    {
      keywords: ['chest', 'pain', 'discomfort', 'heart', 'breath', 'cardio'],
      docId: 'DOC-001',
      docName: 'Acute Chest Discomfort & Cardiac Protocols',
      chunk: 'Patients exhibiting acute chest discomfort, radiating left arm pain, or dyspnea require immediate priority level 1 triage. Direct patient to ER or book urgent Cardiology consult.',
      score: 0.968,
      response: '⚠️ <strong>Urgent Alert:</strong> Chest discomfort and shortness of breath require immediate medical evaluation. We have flagged this as Priority Triage Level 1 and scheduled an urgent Cardiology notification with Dr. Sharma.'
    },
    {
      keywords: ['mri', 'prep', 'scan', 'test', 'radiology', 'abdominal'],
      docId: 'DOC-042',
      docName: 'MRI & CT Scan Patient Preparation Guidelines',
      chunk: 'Fast for 4-6 hours prior to abdominal MRI. Remove all metallic objects, jewelry, and wear cotton clinic attire.',
      score: 0.914,
      response: 'For an abdominal MRI scan: Please fast (no food/drink except water) for 4 to 6 hours before your appointment. Ensure all metal objects, watches, and magnetic accessories are removed before entering the scanning bay.'
    },
    {
      keywords: ['existing', 'pat-', 'id', 'sharma', 'follow-up', 'neurology'],
      docId: 'DOC-088',
      docName: 'Existing Patient Record Lookup & Workflow',
      chunk: 'Patient PAT-9428 verified: Last visit 2026-05-12 in Neurology under Dr. Sharma. Eligible for fast-track follow-up slot.',
      score: 0.935,
      response: 'Welcome back! Patient ID <strong>PAT-9428</strong> has been verified in our EHR registry. Your medical records from your previous Neurology visit with Dr. Sharma have been fetched to fast-track your follow-up appointment.'
    }
  ];

  function handleRagQuery(queryText) {
    if (!queryText.trim()) return;

    // Append User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-user"></i></div>
      <div class="msg-content"><p>${escapeHtml(queryText)}</p></div>
    `;
    ragMessages.appendChild(userMsg);
    ragMessages.scrollTop = ragMessages.scrollHeight;

    // Match Query with RAG Knowledge Base
    const lower = queryText.toLowerCase();
    let matched = ragKnowledgeBase.find(kb => kb.keywords.some(k => lower.includes(k)));
    if (!matched) {
      matched = {
        docId: 'DOC-210',
        docName: 'General Healthcare Assistant FAQ Index',
        chunk: 'General medical query routed to primary care triage. Synthesizing answer using 200+ indexed clinic docs.',
        score: 0.885,
        response: `Thank you for your query about "${escapeHtml(queryText)}". Based on our 200+ indexed medical documents, our primary care consultants can assist you during OPD hours or schedule a specialist appointment.`
      };
    }

    // Update Vector Retriever Panel
    if (similarityFill && similarityText) {
      const pct = Math.round(matched.score * 100);
      similarityFill.style.width = `${pct}%`;
      similarityText.innerHTML = `Cosine Similarity Score: <strong>${matched.score}</strong> (${pct > 90 ? 'High Relevance' : 'Moderate Match'})`;
    }

    if (retrievedDocBadge && retrievedChunkText) {
      retrievedDocBadge.textContent = `${matched.docId} — ${matched.docName}`;
      retrievedChunkText.textContent = `"${matched.chunk}"`;
    }

    if (promptSnippet) {
      promptSnippet.textContent = `SYSTEM: You are Tars AI Medical Assistant.\nCONTEXT RETRIEVED: [${matched.docId}]\nQUERY: "${queryText}"\nOUTPUT: Grounded response using prompt template v3.2`;
    }

    // Simulate typing delay for bot response
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.innerHTML = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-content"><p>${matched.response}</p></div>
      `;
      ragMessages.appendChild(botMsg);
      ragMessages.scrollTop = ragMessages.scrollHeight;
    }, 600);
  }

  if (ragForm) {
    ragForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = ragInput.value;
      ragInput.value = '';
      handleRagQuery(text);
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      handleRagQuery(q);
    });
  });

  /* ── Tab 2: Appointment & Patient Type Switcher ── */
  const ptypeNew = document.getElementById('ptypeNew');
  const ptypeExisting = document.getElementById('ptypeExisting');
  const existingRow = document.getElementById('existingPatientIdRow');
  const tracePatientType = document.getElementById('tracePatientType');
  const verifyPatientBtn = document.getElementById('verifyPatientBtn');
  const verifyStatusText = document.getElementById('verifyStatusText');

  let currentPatientType = 'New Patient';

  if (ptypeNew && ptypeExisting) {
    ptypeNew.addEventListener('click', () => {
      ptypeNew.classList.add('active');
      ptypeExisting.classList.remove('active');
      existingRow.style.display = 'none';
      currentPatientType = 'New Patient Registration';
      if (tracePatientType) tracePatientType.textContent = currentPatientType;
      updateLeadSimulation();
    });

    ptypeExisting.addEventListener('click', () => {
      ptypeExisting.classList.add('active');
      ptypeNew.classList.remove('active');
      existingRow.style.display = 'block';
      currentPatientType = 'Existing Patient Follow-Up';
      if (tracePatientType) tracePatientType.textContent = currentPatientType;
      updateLeadSimulation();
    });
  }

  if (verifyPatientBtn) {
    verifyPatientBtn.addEventListener('click', () => {
      const pid = document.getElementById('patientIdInput').value.trim();
      verifyStatusText.textContent = `✓ Patient ${pid || 'PAT-9428'} verified! EHR History Loaded (3 Past Consultations found).`;
    });
  }

  const aptForm = document.getElementById('appointmentWorkflowForm');
  if (aptForm) {
    aptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('aptName').value;
      const dept = document.getElementById('aptSpecialty').value;
      const date = document.getElementById('aptDate').value;
      const time = document.getElementById('aptTime').value;

      document.getElementById('receiptRef').textContent = `TARS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      document.getElementById('receiptName').textContent = name;
      document.getElementById('receiptDept').textContent = dept;
      document.getElementById('receiptDateTime').textContent = `${date} @ ${time}`;

      const receipt = document.getElementById('bookingReceipt');
      receipt.style.animation = 'none';
      receipt.offsetHeight; // trigger reflow
      receipt.style.animation = 'pulse-glow 0.8s ease 2';
    });
  }

  /* ── Tab 3: Salesforce Lead Temperature Calculation ── */
  const crmUrgency = document.getElementById('crmUrgency');
  const crmInsurance = document.getElementById('crmInsuranceFactor');
  const leadTempBadge = document.getElementById('leadTempBadge');
  const tempBarFill = document.getElementById('tempBarFill');
  const tempDescText = document.getElementById('tempDescText');
  const jsonPayloadEl = document.getElementById('salesforceJsonPayload');
  const copyJsonBtn = document.getElementById('copyJsonBtn');

  function updateLeadSimulation() {
    if (!crmUrgency || !crmInsurance) return;
    const urgency = crmUrgency.value;
    const ins = crmInsurance.value;

    let score = 50;
    if (urgency === 'High') score += 35;
    else if (urgency === 'Medium') score += 15;

    if (ins === 'Verified') score += 15;
    else if (ins === 'SelfPay') score += 5;

    score = Math.min(score, 98);

    let temp = 'COLD';
    let icon = '❄️';
    let colorClass = '#3B82F6'; // blue
    let desc = 'Low conversion urgency: Patient seeking general hospital inquiries.';

    if (score >= 80) {
      temp = 'HOT';
      icon = '🔥';
      colorClass = '#EF4444'; // red
      desc = 'High priority lead: Urgent specialist consultation request with verified insurance.';
    } else if (score >= 60) {
      temp = 'WARM';
      icon = '☀️';
      colorClass = '#F59E0B'; // amber
      desc = 'Moderate intent lead: Standard checkup request scheduled within upcoming days.';
    }

    if (leadTempBadge) {
      leadTempBadge.style.borderColor = colorClass;
      leadTempBadge.style.background = `${colorClass}22`;
      leadTempBadge.style.color = colorClass;
      leadTempBadge.innerHTML = `<span class="temp-icon">${icon}</span> <span class="temp-label">${temp} LEAD</span> <span class="temp-score">(Score: ${score}/100)</span>`;
    }

    if (tempBarFill) {
      tempBarFill.style.width = `${score}%`;
      if (score >= 80) tempBarFill.style.background = 'linear-gradient(90deg, #F59E0B, #EF4444)';
      else if (score >= 60) tempBarFill.style.background = 'linear-gradient(90deg, #3B82F6, #F59E0B)';
      else tempBarFill.style.background = 'linear-gradient(90deg, #1E40AF, #3B82F6)';
    }

    if (tempDescText) tempDescText.textContent = desc;

    if (jsonPayloadEl) {
      const rawName = (document.getElementById('aptName')?.value || 'Rahul Verma').trim();
      const nameParts = rawName ? rawName.split(/\s+/) : ['Rahul', 'Verma'];
      const firstName = nameParts[0] || 'Rahul';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'N/A';

      const payloadObj = {
        attributes: {
          type: 'Lead',
          url: '/services/data/v58.0/sobjects/Lead/00Q5g000003K8x2EAC'
        },
        FirstName: firstName,
        LastName: lastName,
        Phone: document.getElementById('aptPhone')?.value || '+91 98765 43210',
        LeadSource: 'Tars_RAG_Healthcare_Assistant',
        Medical_Specialty__c: document.getElementById('aptSpecialty')?.value || 'Cardiology',
        Lead_Temperature__c: temp,
        Urgency_Score__c: score,
        Patient_Type__c: currentPatientType.replace(/\s+/g, '_'),
        Insurance_Provider__c: document.getElementById('aptInsurance')?.value || 'Star Health',
        RAG_Context_Summary__c: `Calculated ${temp} lead with ${urgency} urgency and ${ins} insurance.`,
        Status: 'Working - Contacted'
      };
      jsonPayloadEl.textContent = JSON.stringify(payloadObj, null, 2);
    }
  }

  if (crmUrgency) crmUrgency.addEventListener('change', updateLeadSimulation);
  if (crmInsurance) crmInsurance.addEventListener('change', updateLeadSimulation);

  if (copyJsonBtn && jsonPayloadEl) {
    copyJsonBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(jsonPayloadEl.textContent).then(() => {
        copyJsonBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => copyJsonBtn.innerHTML = '<i class="fas fa-copy"></i> Copy JSON', 2000);
      });
    });
  }

  /* ── Tab 4: Vector Document Search Filter ── */
  const docSearchInput = document.getElementById('docIndexSearch');
  const docItems = modal.querySelectorAll('.doc-item');

  if (docSearchInput) {
    docSearchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      docItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(term) ? 'block' : 'none';
      });
    });
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Initialize Tars Healthcare Modal
document.addEventListener('DOMContentLoaded', initTarsHealthcareModal);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  initTarsHealthcareModal();
}

