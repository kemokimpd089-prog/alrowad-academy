const WA = '20 10 02983212';
const PROGRAMS = { icdl: 'اختبارات ودورة ICDL الدولية', english: 'اللغة الإنجليزية والمحادثة', tech: 'البرمجة وتكنولوجيا المعلومات', medical: 'التمريض والتحاليل الطبية', surveying: 'المساحة والخرائط' };
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.getElementById('year').textContent = new Date().getFullYear();

/* Drawer */
function toggleDrawer() {
  const d = document.getElementById('drawer');
  d.classList.toggle('open');
  document.getElementById('menuIcon').className = d.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

/* Modals */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function openEnroll(key) {
  if (key && PROGRAMS[key]) document.getElementById('mProgram').value = PROGRAMS[key];
  openModal('enrollModal');
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal('enrollModal'); closeModal('accredModal'); } });

/* WhatsApp submit */
function submitForm(e, isModal) {
  e.preventDefault();
  const v = id => document.getElementById(id).value.trim();
  const name = isModal ? v('mName') : v('fName');
  const phone = isModal ? v('mPhone') : v('fPhone');
  const program = isModal ? v('mProgram') : v('fProgram');
  const notes = isModal ? '' : v('fNotes');
  let msg = `مرحباً أكاديمية الرواد، أرغب في التسجيل/الاستفسار:\n• الاسم: ${name}\n• رقم الهاتف: ${phone}\n• البرنامج: ${program}`;
  if (notes) msg += `\n• ملاحظات: ${notes}`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  toast('جاري تحويلك إلى واتساب الأكاديمية...');
  e.target.reset();
  if (isModal) closeModal('enrollModal');
}

/* Copy & toast */
function copyText(text, msg) {
  if (navigator.clipboard && isSecureContext) navigator.clipboard.writeText(text);
  else { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
  toast(msg || 'تم النسخ');
}
let tt;
function toast(msg) {
  const el = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  el.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => el.classList.remove('show'), 3800);
}

/* Reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* Count-up */
const cio = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target, end = +el.dataset.count, t0 = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / 1400, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
  cio.unobserve(el);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* Active nav link on scroll */
const links = document.querySelectorAll('.nav a');
const secIO = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => secIO.observe(s));
