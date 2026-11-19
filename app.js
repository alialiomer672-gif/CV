/* ============================================================
   سِيرَتي — Application Logic
   ============================================================ */
'use strict';

/* ---------------- Utilities ---------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const setPath = (obj, path, val) => {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((o, k) => (o[k] = o[k] ?? {}), obj);
  target[last] = val;
};

/* ---------------- State ---------------- */
const STORAGE_KEY = 'sirati.cv.v1';

const emptyState = () => ({
  personal: {
    name: '', title: '', email: '', phone: '', city: '', years: '',
    linkedin: '', portfolio: '', summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certs: [],
  settings: { monogram: true, footer: true, zoom: 1 }
});

const demoState = () => ({
  personal: {
    name: 'علي عمر علي باوكيع',
    title: 'مهندس برمجيات أول — تطوير الويب',
    email: 'alialiomer672@gmail.com',
    phone: '+966 556381636 ',
    city: 'جدة، السعودية',
    years: '7',
    linkedin: 'linkedin.com/in/alibawakeia',
    portfolio: 'alibawakeia.dev',
    summary: 'مهندس برمجيات أول بخبرة تتجاوز 7 سنوات في تصميم وبناء تطبيقات ويب قابلة للتوسع باستخدام JavaScript وReact وNode.js. قدت فرقاً هندسية من 6 مطورين، وأسهمت في تحسين أداء المنصات بنسبة 42% وتقليل زمن الإصدار بنسبة 35%. شغوف بكتابة كود نظيف قابل للاختبار، وبترجمة متطلبات الأعمال إلى حلول تقنية تحقق أثراً قابلاً للقياس.'
  },
  experience: [
    {
      id: uid(), role: 'مهندس برمجيات أول', company: 'شركة الحلول الرقمية المتقدمة',
      city: 'الرياض', start: 'يناير 2021', end: '', current: true,
      bullets: 'قدت فريقاً من 6 مهندسين لتطوير منصة خدمات رقمية تخدم أكثر من 250,000 مستخدم شهرياً.\nأعدت بناء واجهة المستخدم باستخدام React وTypeScript، ما خفّض زمن التحميل بنسبة 42%.\nصممت واجهات برمجية REST وGraphQL وربطتها بأنظمة الدفع، برفع معدل نجاح العمليات إلى 99.7%.\nأرسيت ثقافة اختبار آلي خفّضت الأخطاء في بيئة الإنتاج بنسبة 35% خلال ستة أشهر.'
    },
    {
      id: uid(), role: 'مهندس برمجيات', company: 'شركة تقنيات المستقبل',
      city: 'جدة', start: 'مارس 2018', end: 'ديسمبر 2020', current: false,
      bullets: 'طوّرت 12 وحدة برمجية للوحة تحكم تحليلية يستخدمها 40 عميلاً من قطاع التجزئة.\nحسّنت استعلامات قاعدة البيانات، مخفضاً زمن الاستجابة من 1.8 ثانية إلى 0.4 ثانية.\nشاركت في الانتقال إلى بيئة سحابية على AWS خفّضت تكاليف التشغيل بنسبة 28%.'
    }
  ],
  education: [
    { id: uid(), degree: 'بكالوريوس علوم الحاسب', school: 'جامعة الملك سعود', city: 'الرياض', start: '2013', end: '2017', gpa: '4.4 / 5' }
  ],
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'REST APIs', 'GraphQL', 'SQL', 'Docker', 'AWS', 'Git', 'Agile / Scrum', 'تحسين الأداء'],
  languages: [
    { id: uid(), name: 'العربية', level: 'اللغة الأم' },
    { id: uid(), name: 'الإنجليزية', level: 'متقدم (C1)' }
  ],
  projects: [
    { id: uid(), name: 'منصة تحليلات مفتوحة المصدر', desc: 'أداة لتصور بيانات المبيعات في الوقت الفعلي، حصدت 800 نجمة على GitHub ويستخدمها 30 شركة.', link: 'github.com/ahmed/analytics' }
  ],
  certs: [
    { id: uid(), name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' },
    { id: uid(), name: 'Professional Scrum Master I', issuer: 'Scrum.org', year: '2022' }
  ],
  settings: { monogram: true, footer: true, zoom: 1 }
});

let state = load() || demoState();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Object.assign(emptyState(), data, {
      personal: Object.assign(emptyState().personal, data.personal || {}),
      settings: Object.assign(emptyState().settings, data.settings || {})
    });
  } catch (e) { return null; }
}

let saveTimer;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }, 350);
}

/* ---------------- Toast ---------------- */
function toast(msg) {
  const wrap = $('#toastWrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${esc(msg)}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(8px)'; el.style.transition = '.3s'; }, 2400);
  setTimeout(() => el.remove(), 2800);
}

/* ---------------- Editor rendering ---------------- */
const listConfig = {
  experience: {
    title: 'خبرة عملية', num: true,
    fields: [
      { k: 'role', label: 'المسمى الوظيفي', ph: 'مثال: مهندس برمجيات أول', col: 2 },
      { k: 'company', label: 'اسم الشركة', ph: 'مثال: شركة الحلول الرقمية', col: 2 },
      { k: 'city', label: 'المدينة', ph: 'الرياض', col: 2 },
      { k: 'start', label: 'من', ph: 'يناير 2021', col: 2 },
      { k: 'end', label: 'إلى', ph: 'ديسمبر 2023', col: 2 },
      { k: 'bullets', label: 'الإنجازات (سطر لكل إنجاز)', ph: 'قدت فريقاً من 6 مهندسين…\nخفّضت زمن التحميل بنسبة 42%…', type: 'textarea', col: 2, hint: 'ابدأ كل سطر بفعل قوي وأضف رقماً أو نسبة.' }
    ],
    toggle: { k: 'current', label: 'أعمل هنا حالياً' }
  },
  education: {
    title: 'مؤهل علمي', num: true,
    fields: [
      { k: 'degree', label: 'الدرجة والتخصص', ph: 'بكالوريوس علوم الحاسب', col: 2 },
      { k: 'school', label: 'الجامعة / المؤسسة', ph: 'جامعة الملك سعود', col: 2 },
      { k: 'city', label: 'المدينة', ph: 'الرياض', col: 2 },
      { k: 'start', label: 'من', ph: '2013', col: 2 },
      { k: 'end', label: 'إلى', ph: '2017', col: 2 },
      { k: 'gpa', label: 'المعدل (اختياري)', ph: '4.4 / 5', col: 2 }
    ]
  },
  languages: {
    title: 'لغة', num: false,
    fields: [
      { k: 'name', label: 'اللغة', ph: 'الإنجليزية', col: 2 },
      { k: 'level', label: 'المستوى', ph: 'متقدم (C1)', col: 2 }
    ]
  },
  projects: {
    title: 'مشروع', num: true,
    fields: [
      { k: 'name', label: 'اسم المشروع', ph: 'منصة تحليلات', col: 2 },
      { k: 'link', label: 'الرابط', ph: 'github.com/…', col: 2, ltr: true },
      { k: 'desc', label: 'الوصف والأثر', ph: 'ما بنيته، التقنيات، والنتيجة الرقمية…', type: 'textarea', col: 2 }
    ]
  },
  certs: {
    title: 'شهادة', num: false,
    fields: [
      { k: 'name', label: 'اسم الشهادة', ph: 'AWS Certified Solutions Architect', col: 2 },
      { k: 'issuer', label: 'الجهة المانحة', ph: 'Amazon Web Services', col: 2 },
      { k: 'year', label: 'السنة', ph: '2023', col: 2 }
    ]
  }
};

function fieldHTML(cfg, item, i, key) {
  const v = item[cfg.k] ?? '';
  const id = `f-${key}-${i}-${cfg.k}`;
  const ltr = cfg.ltr ? 'dir="ltr" style="text-align:left"' : '';
  const input = cfg.type === 'textarea'
    ? `<textarea id="${id}" data-bind="${key}.${i}.${cfg.k}" rows="5" placeholder="${esc(cfg.ph || '')}">${esc(v)}</textarea>`
    : `<input type="text" id="${id}" data-bind="${key}.${i}.${cfg.k}" value="${esc(v)}" placeholder="${esc(cfg.ph || '')}" ${ltr}>`;
  return `<div class="field" style="grid-column:span ${cfg.col || 1};margin-bottom:0">
    <label for="${id}">${esc(cfg.label)}</label>${input}
    ${cfg.hint ? `<div class="hint">${esc(cfg.hint)}</div>` : ''}
  </div>`;
}

function renderList(key) {
  const wrap = $(`#list-${key}`);
  if (!wrap) return;
  const cfg = listConfig[key];
  const items = state[key] || [];
  if (!items.length) {
    wrap.innerHTML = `<div class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div>لا توجد عناصر بعد — اضغط «إضافة» للبدء.</div>
    </div>`;
    return;
  }
  wrap.innerHTML = items.map((item, i) => `
    <div class="card">
      <div class="card-head">
        <div class="card-title">${cfg.num ? `<span class="idx">${i + 1}</span>` : '<span class="idx">•</span>'}
          ${esc(item[cfg.fields[0].k] || cfg.title)}</div>
        <div class="card-actions">
          <button class="chip-del" data-del="${key}" data-index="${i}" title="حذف">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
      <div class="grid-2">${cfg.fields.map(f => fieldHTML(f, item, i, key)).join('')}</div>
      ${cfg.toggle ? `<div class="switch-row" style="margin:12px 0 0">
        <span>${esc(cfg.toggle.label)}</span>
        <label class="switch"><input type="checkbox" data-bind="${key}.${i}.${cfg.toggle.k}" ${item[cfg.toggle.k] ? 'checked' : ''}><i></i></label>
      </div>` : ''}
    </div>`).join('');
}

function renderAllLists() {
  Object.keys(listConfig).forEach(renderList);
}

/* Skills tags */
function renderSkillTags() {
  const wrap = $('#skillTags');
  if (!wrap) return;
  wrap.innerHTML = (state.skills || []).map((s, i) =>
    `<span class="tag">${esc(s)}<button data-skill-del="${i}" title="حذف">×</button></span>`
  ).join('') || `<span style="font-size:11.5px;color:var(--muted-2)">لم تُضف مهارات بعد.</span>`;
}

/* ---------------- Preview ---------------- */
function initials(name) {
  const skip = ['بن', 'بنت', 'ابن', 'ابنة', 'ال', 'آل'];
  const parts = String(name || '').trim().split(/\s+/)
    .filter(w => w && !skip.includes(normalizeAr(w).replace(/^ال/, 'ال')));
  if (!parts.length) return 'س';
  return (parts[0][0] || '') + (parts[1] ? parts[1][0] : '');
}

function dateRange(start, end, current) {
  const s = (start || '').trim();
  const e = current ? 'حتى الآن' : (end || '').trim();
  if (s && e) return `${s} — ${e}`;
  return s || e || '';
}

function bulletsFrom(text) {
  return String(text || '').split('\n').map(l => l.replace(/^[•\-\*\s]+/, '').trim()).filter(Boolean);
}

function renderPreview() {
  const p = state.personal;
  const name = p.name?.trim() || 'اسمك الكامل';
  const role = p.title?.trim() || 'المسمى الوظيفي المستهدف';

  const contactItems = [];
  if (p.email) contactItems.push(`<span dir="ltr">${esc(p.email)}</span>`);
  if (p.phone) contactItems.push(`<span dir="ltr">${esc(p.phone)}</span>`);
  if (p.city) contactItems.push(`<span class="ar">${esc(p.city)}</span>`);
  if (p.linkedin) contactItems.push(`<span dir="ltr">${esc(p.linkedin.replace(/^https?:\/\//, ''))}</span>`);
  if (p.portfolio) contactItems.push(`<span dir="ltr">${esc(p.portfolio.replace(/^https?:\/\//, ''))}</span>`);

  const head = `
    <div class="cv-head">
      <div class="cv-id">
        <h1 class="cv-name">${esc(name)}</h1>
        <p class="cv-role">${esc(role)}</p>
        <div class="cv-contact">${contactItems.join('<i></i>')}</div>
      </div>
      ${state.settings.monogram ? `<div class="monogram">${esc(initials(p.name))}</div>` : ''}
    </div>`;

  const sec = (title, body) => body ? `
    <section class="cv-section">
      <h2 class="cv-section-title"><span class="sq"></span>${esc(title)}</h2>
      ${body}
    </section>` : '';

  const summary = p.summary?.trim()
    ? sec('الملخص المهني', `<p class="cv-summary">${esc(p.summary)}</p>`) : '';

  const expHTML = (state.experience || []).filter(e => e.role || e.company).map(e => {
    const bl = bulletsFrom(e.bullets);
    return `<div class="cv-item">
      <div class="cv-item-top">
        <div>
          <h3 class="cv-item-title">${esc(e.role || 'المسمى الوظيفي')}</h3>
          <p class="cv-item-org">${esc([e.company, e.city].filter(Boolean).join(' · '))}</p>
        </div>
        <span class="cv-item-date">${esc(dateRange(e.start, e.end, e.current))}</span>
      </div>
      ${bl.length ? `<ul class="cv-bullets">${bl.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
    </div>`;
  }).join('');
  const experience = sec('الخبرة العملية', expHTML);

  const eduHTML = (state.education || []).filter(e => e.degree || e.school).map(e => `
    <div class="cv-item">
      <div class="cv-item-top">
        <div>
          <h3 class="cv-item-title">${esc(e.degree || 'الدرجة العلمية')}</h3>
          <p class="cv-item-org">${esc([e.school, e.city].filter(Boolean).join(' · '))}${e.gpa ? ` · المعدل: ${esc(e.gpa)}` : ''}</p>
        </div>
        <span class="cv-item-date">${esc(dateRange(e.start, e.end, false))}</span>
      </div>
    </div>`).join('');
  const education = sec('التعليم', eduHTML);

  const skillsHTML = (state.skills || []).length
    ? `<div class="cv-skills">${state.skills.map(s => `<span class="cv-skill">${esc(s)}</span>`).join('')}</div>` : '';
  const skills = sec('المهارات', skillsHTML);

  const projHTML = (state.projects || []).filter(x => x.name).map(x => `
    <div class="cv-item">
      <div class="cv-item-top">
        <h3 class="cv-item-title">${esc(x.name)}</h3>
        ${x.link ? `<span class="cv-item-date">${esc(x.link.replace(/^https?:\/\//, ''))}</span>` : ''}
      </div>
      ${x.desc ? `<p class="cv-item-desc">${esc(x.desc)}</p>` : ''}
    </div>`).join('');
  const projects = sec('المشاريع المختارة', projHTML);

  const certHTML = (state.certs || []).filter(x => x.name).map(x => `
    <div class="cv-item">
      <div class="cv-item-top">
        <h3 class="cv-item-title">${esc(x.name)}</h3>
        <span class="cv-item-date">${esc(x.year || '')}</span>
      </div>
      ${x.issuer ? `<p class="cv-item-org">${esc(x.issuer)}</p>` : ''}
    </div>`).join('');
  const certs = sec('الشهادات والاعتمادات', certHTML);

  const langHTML = (state.languages || []).filter(x => x.name)
    .map(x => `<span class="cv-lang"><b>${esc(x.name)}</b> <span>— ${esc(x.level || '')}</span></span>`).join('');
  const languages = sec('اللغات', langHTML ? `<div class="cv-langs">${langHTML}</div>` : '');

  const footer = state.settings.footer
    ? `<div class="cv-foot"><span>سيرة ذاتية احترافية · ${esc(p.title || '')}</span><span>تم الإنشاء بواسط م/ علي ابوكيع </span></div>` : '';

  $('#paper').innerHTML = `<div class="paper-inner">${head}${summary}${experience}${education}${skills}${projects}${certs}${languages}${footer}</div>`;

  renderATS();
  renderJDMatch();
}

/* ---------------- ATS Engine ---------------- */
const ACTION_VERBS = ['قدت','قاد','طورت','طوّر','أدرت','أدار','نفذت','نفّذ','حسنت','حسّن','خفّضت','خفّض','زدت','زاد','صممت','صمّم','أطلقت','أطلق','نسقت','نسّق','حللت','حلّل','دربت','درّب','أشرفت','أشرف','أتممت','أنجزت','أسست','أسّس','بنيت','بني','أعدت','أعد','راقبت','تابعت','وضعت','وضع','قمت','ساهمت','أسهمت','شاركت','طور','حقق','حققت','رفعت','قللت','قلّل','عززت','عزّز','ابتكرت','اقترحت','أشرفت','وجهت','خطّطت','خططت','أديت','قدمت','سلمت','نظمت','نظّمت','أعدت هيكلة','أتمتت'];

const STOPWORDS = new Set(('في من على إلى عن مع أن إن كان كانت هذا هذه ذلك التي الذي الذين ما لا لم لن قد كل بعض بين خلال بعد قبل عند حتى أو ثم كما هو هي هم نحن أنا انت أنت يكون تكون يتم تم وقد وكان وكانت هناك حيث أيضا أيضاً جدا جداً بشكل حول دون غير سوى أي أيها له لها لهم به بها عليه عليها إليه إليها ومن وفي وعلى وإلى وهو وهي أو غير مثل نحو منذ ضمن عبر ضد وفق حسب بناء بالإضافة إضافة جانب جانباً وذلك وهذا وهذه فإن وإن إذا لكن بل أما إما فقد لقد ذات ذو ذي بينما أثناء').split(/\s+/));

const ROLE_LIBRARY = [
  { keys: ['مهندس برمجيات','مطور','برمجة','software','developer','full stack','frontend','backend','web'],
    kws: ['JavaScript','TypeScript','React','Node.js','REST API','GraphQL','SQL','Git','Docker','AWS','CI/CD','Agile','Scrum','اختبار الوحدات','تحسين الأداء','قواعد البيانات','تصميم الأنظمة','TypeScript'] },
  { keys: ['بيانات','data','تحليل','analyst','ذكاء اصطناعي','AI','machine learning'],
    kws: ['تحليل البيانات','SQL','Python','Excel المتقدم','Power BI','Tableau','لوحات المعلومات','ETL','إحصاء','التنبؤ','Data Warehouse','A/B Testing','تصور البيانات','Scikit-learn'] },
  { keys: ['تسويق','marketing','محتوى','سوشيال','social'],
    kws: ['التسويق الرقمي','SEO','SEM','Google Analytics','إعلانات مدفوعة','وسائل التواصل الاجتماعي','تحليل الحملات','CRM','كتابة المحتوى','ROI','استهداف الجمهور','Meta Ads','Google Ads'] },
  { keys: ['موارد بشرية','HR','توظيف','recruit'],
    kws: ['التوظيف','الاستقطاب','إدارة الأداء','الرواتب والمزايا','سياسات الموارد البشرية','التدريب والتطوير','HRIS','علاقات الموظفين','تقييم الوظائف','الامتثال العمالي'] },
  { keys: ['مبيعات','sales','تطوير أعمال','business development'],
    kws: ['المبيعات','تطوير الأعمال','إدارة علاقات العملاء','CRM','التفاوض','تحقيق الأهداف','عروض الأسعار','Salesforce','التسويق التجاري','إدارة خط الأنابيب','خدمة العملاء'] },
  { keys: ['محاسب','محاسبة','مالي','finance','accountant','تدقيق'],
    kws: ['المحاسبة','القوائم المالية','التقارير المالية','المراجعة الداخلية','الضرائب','Excel المتقدم','ERP','SAP','التسوية البنكية','الميزانية العمومية','التدفقات النقدية','الامتثال'] },
  { keys: ['إدارة مشاريع','project manager','PMP','عمليات','operations'],
    kws: ['إدارة المشاريع','PMP','Agile','Scrum','إدارة الميزانية','إدارة المخاطر','أصحاب المصلحة','MS Project','Jira','تحسين العمليات','مؤشرات الأداء','إدارة التغيير'] },
  { keys: ['تصميم','design','UX','UI','جرافيك'],
    kws: ['تصميم واجهات المستخدم','تجربة المستخدم','Figma','Adobe XD','Photoshop','Illustrator','النماذج الأولية','اختبار قابلية الاستخدام','التصميم المتجاوب','نظام التصميم'] },
  { keys: ['هندسة','مهندس','engineering','مدني','كهرباء','ميكانيكا'],
    kws: ['إدارة المشاريع الهندسية','AutoCAD','مراجعة المخططات','إدارة الجودة','الصحة والسلامة','الميزانية','الجدول الزمني','التفتيش','إدارة المقاولين','الكود الهندسي'] },
  { keys: ['تعليم','معلم','teacher','تدريس'],
    kws: ['التخطيط التعليمي','إدارة الصف','تقييم الطلاب','المناهج','التعلم النشط','التكنولوجيا التعليمية','التطوير المهني','التواصل مع أولياء الأمور'] }
];

const GENERIC_KWS = ['العمل الجماعي','التواصل الفعّال','حل المشكلات','إدارة الوقت','القيادة','التفكير التحليلي','التخطيط','المبادرة','المرونة','الاهتمام بالتفاصيل','خدمة العملاء','إدارة المشاريع'];

function normalizeAr(s = '') {
  return String(s)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\w\u0600-\u06FF\s.+#/-]/g, ' ')
    .toLowerCase();
}

function cvText() {
  const p = state.personal;
  const parts = [p.name, p.title, p.summary, p.city];
  (state.experience || []).forEach(e => parts.push(e.role, e.company, e.bullets));
  (state.education || []).forEach(e => parts.push(e.degree, e.school));
  (state.projects || []).forEach(e => parts.push(e.name, e.desc));
  (state.certs || []).forEach(e => parts.push(e.name, e.issuer));
  parts.push((state.skills || []).join(' '), (state.languages || []).map(l => l.name).join(' '));
  return normalizeAr(parts.filter(Boolean).join(' '));
}

function roleKeywords() {
  const t = normalizeAr((state.personal.title || '') + ' ' + (state.personal.summary || ''));
  const found = ROLE_LIBRARY.find(r => r.keys.some(k => t.includes(normalizeAr(k))));
  return found ? found.kws : GENERIC_KWS;
}

function jdKeywords(jd, limit = 18) {
  const norm = normalizeAr(jd);
  const tokens = norm.split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
  const freq = {};
  tokens.forEach(t => freq[t] = (freq[t] || 0) + 1);
  // bigrams
  const bigrams = {};
  for (let i = 0; i < tokens.length - 1; i++) {
    const bg = tokens[i] + ' ' + tokens[i + 1];
    bigrams[bg] = (bigrams[bg] || 0) + 1;
  }
  const scored = [
    ...Object.entries(bigrams).filter(([, c]) => c >= 2).map(([k, c]) => [k, c * 2.2]),
    ...Object.entries(freq).map(([k, c]) => [k, c])
  ].sort((a, b) => b[1] - a[1]);
  const out = [];
  for (const [k] of scored) {
    if (out.length >= limit) break;
    if (!out.some(x => x.includes(k) || k.includes(x))) out.push(k);
  }
  return out;
}

function keywordCoverage(kws, text) {
  const t = normalizeAr(text);
  const hits = [], miss = [];
  kws.forEach(k => {
    const nk = normalizeAr(k);
    (t.includes(nk) ? hits : miss).push(k);
  });
  return { hits, miss, ratio: kws.length ? hits.length / kws.length : 0 };
}

function computeATS() {
  const p = state.personal;
  const checks = [];
  const add = (pts, status, title, detail) => checks.push({ pts, status, title, detail });

  // 1. Contact (14)
  let contact = 0;
  if (p.name?.trim()) contact += 3;
  if (p.title?.trim()) contact += 3;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((p.email || '').trim())) contact += 4;
  if ((p.phone || '').replace(/\D/g, '').length >= 8) contact += 3;
  if (p.city?.trim()) contact += 1;
  add(contact, contact >= 13 ? 'ok' : contact >= 8 ? 'warn' : 'bad',
    'بيانات الاتصال قابلة للقراءة الآلية',
    contact >= 13 ? 'الاسم والمسمى والبريد والهاتف مكتملة.' : 'أكمل الاسم، المسمى، بريداً صالحاً ورقم هاتف.');

  // 2. Sections (16)
  const hasSummary = (p.summary || '').trim().length > 20;
  const hasExp = (state.experience || []).some(e => e.role || e.company);
  const hasEdu = (state.education || []).some(e => e.degree || e.school);
  const hasSkills = (state.skills || []).length >= 3;
  let secPts = 0;
  if (hasSummary) secPts += 4;
  if (hasExp) secPts += 5;
  if (hasEdu) secPts += 4;
  if (hasSkills) secPts += 3;
  add(secPts, secPts >= 16 ? 'ok' : secPts >= 10 ? 'warn' : 'bad',
    'الأقسام الأساسية موجودة',
    secPts >= 16 ? 'ملخص، خبرة، تعليم ومهارات — جميعها موجودة.' : 'أضف الأقسام الناقصة: ' +
      [!hasSummary && 'الملخص', !hasExp && 'الخبرة', !hasEdu && 'التعليم', !hasSkills && 'المهارات'].filter(Boolean).join('، '));

  // 3. Summary quality (10)
  const words = (p.summary || '').trim().split(/\s+/).filter(Boolean).length;
  let sumPts = 0, sumStatus = 'bad', sumDetail = 'أضف ملخصاً مهنياً من 40 إلى 90 كلمة.';
  if (words >= 40 && words <= 90) { sumPts = 10; sumStatus = 'ok'; sumDetail = `طول الملخص مثالي (${words} كلمة).`; }
  else if (words >= 25 && words < 40) { sumPts = 6; sumStatus = 'warn'; sumDetail = `الملخص قصير (${words} كلمة) — وسّعه إلى 40–90.`; }
  else if (words > 90) { sumPts = 6; sumStatus = 'warn'; sumDetail = `الملخص طويل (${words} كلمة) — اختصره إلى 90 كلمة.`; }
  else if (words > 0) { sumPts = 2; sumStatus = 'bad'; sumDetail = `الملخص قصير جداً (${words} كلمة).`; }
  add(sumPts, sumStatus, 'ملخص مهني موجز ومركّز', sumDetail);

  // 4. Metrics (14)
  const allBullets = (state.experience || []).flatMap(e => bulletsFrom(e.bullets));
  const withNumbers = allBullets.filter(b => /\d/.test(b));
  const ratio = allBullets.length ? withNumbers.length / allBullets.length : 0;
  let mPts = Math.round(ratio * 14);
  if (!allBullets.length) mPts = 0;
  add(mPts, ratio >= 0.6 ? 'ok' : ratio >= 0.3 ? 'warn' : 'bad',
    'نتائج قابلة للقياس',
    allBullets.length ? `${withNumbers.length} من ${allBullets.length} نقاط تحتوي رقماً أو نسبة. أضف أثراً كمياً لكل إنجاز.`
      : 'لا توجد نقاط خبرة بعد — أضف إنجازاتك بصيغة فعل + نتيجة رقمية.');

  // 5. Action verbs (10)
  const strong = allBullets.filter(b => {
    const first = normalizeAr(b).split(/\s+/)[0] || '';
    return ACTION_VERBS.some(v => normalizeAr(v) === first || normalizeAr(b).startsWith(normalizeAr(v) + ' '));
  });
  const verbRatio = allBullets.length ? strong.length / allBullets.length : 0;
  add(Math.round(verbRatio * 10), verbRatio >= 0.7 ? 'ok' : verbRatio >= 0.4 ? 'warn' : 'bad',
    'أفعال قوية في بداية النقاط',
    allBullets.length ? `${strong.length} من ${allBullets.length} نقاط تبدأ بفعل إنجازي قوي.` : 'ابدأ كل نقطة بفعل مثل: قدت، طوّرت، خفّضت، أطلقت.');

  // 6. Skills (8)
  const sk = (state.skills || []).length;
  const skPts = sk >= 8 ? 8 : sk >= 5 ? 6 : sk >= 3 ? 3 : 0;
  add(skPts, sk >= 8 ? 'ok' : sk >= 5 ? 'warn' : 'bad', 'قائمة مهارات كافية',
    sk >= 8 ? `${sk} مهارة مدرجة — تغطية جيدة.` : `${sk} مهارة فقط؛ أضف حتى 10–14 مهارة من الوصف الوظيفي.`);

  // 7. Keywords (18)
  const jd = ($('#jdInput')?.value || '').trim();
  const kws = jd ? jdKeywords(jd) : roleKeywords();
  const cov = keywordCoverage(kws, cvText());
  add(Math.round(cov.ratio * 18), cov.ratio >= 0.65 ? 'ok' : cov.ratio >= 0.35 ? 'warn' : 'bad',
    jd ? 'مطابقة كلمات الوصف الوظيفي' : 'كلمات مفتاحية متوقعة لمجالك',
    `${cov.hits.length} من ${kws.length} مصطلحاً موجود في سيرتك (${Math.round(cov.ratio * 100)}%).`);

  // 8. Formatting (6)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((p.email || '').trim());
  const phoneOk = (p.phone || '').replace(/\D/g, '').length >= 8;
  const fmt = (emailOk ? 2 : 0) + (phoneOk ? 2 : 0) + (hasSkills ? 1 : 0) + (hasExp ? 1 : 0);
  add(fmt, fmt >= 5 ? 'ok' : 'warn', 'بنية آمنة لأنظمة ATS',
    'تصميم بعمود واحد، عناوين قياسية، بلا جداول أو صور — يُقرأ بسهولة.');

  // 9. Length (4)
  const totalWords = cvText().split(/\s+/).filter(Boolean).length;
  const lenPts = totalWords >= 250 && totalWords <= 750 ? 4 : totalWords >= 150 ? 2 : 0;
  add(lenPts, lenPts === 4 ? 'ok' : 'warn', 'طول مناسب للسيرة',
    `${totalWords} كلمة تقريباً — المثالي بين 250 و750.`);

  const score = Math.max(0, Math.min(100, checks.reduce((s, c) => s + c.pts, 0)));
  return { score, checks, kws, cov, jd };
}

function renderATS() {
  const { score, checks, kws, cov, jd } = computeATS();

  const fg = $('#gaugeFg');
  const C = 2 * Math.PI * 45;
  fg.setAttribute('stroke-dasharray', C.toFixed(1));
  fg.setAttribute('stroke-dashoffset', (C * (1 - score / 100)).toFixed(1));

  $('#atsScore').textContent = score;
  const mini = $('#miniScore');
  if (mini) mini.textContent = score;
  const verdict = score >= 85 ? 'ممتاز — جاهزة للATS' : score >= 70 ? 'جيدة — قابلة للتحسين' : score >= 50 ? 'مقبولة — تحتاج عملاً' : 'ضعيفة — ابدأ بالإصلاحات';
  $('#atsVerdict').textContent = verdict;
  $('#atsSub').textContent = score >= 85
    ? 'سيرتك تلبي معايير القراءة الآلية بشكل قوي. راجع الكلمات المفتاحية قبل كل تقديم.'
    : 'عالج النقاط الحمراء أدناه لرفع درجة التوافق.';

  $('#atsChecks').innerHTML = checks.map(c => `
    <div class="check ${c.status}">
      <span class="ic">${c.status === 'ok' ? '✓' : c.status === 'warn' ? '!' : '×'}</span>
      <span class="txt"><b>${esc(c.title)}</b><span>${esc(c.detail)}</span></span>
      <span class="pts">${c.pts}</span>
    </div>`).join('');

  const hitSet = new Set(cov.hits.map(normalizeAr));
  $('#jdResult').innerHTML = `
    <div class="hint" style="margin-bottom:4px">${jd ? 'مصطلحات مستخرجة من الوصف الوظيفي:' : 'مصطلحات متوقعة حسب مسماك الوظيفي:'}</div>
    <div class="kw-wrap">${kws.map(k => `<span class="kw ${hitSet.has(normalizeAr(k)) ? 'hit' : 'miss'}">${esc(k)}</span>`).join('')}</div>
    <div class="hint" style="margin-top:9px">${cov.miss.length ? `أضف ${cov.miss.length} مصطلحاً ناقصاً إلى مهاراتك أو نقاط خبرتك — لكن فقط إن كنت تملكها فعلاً.` : 'تغطية كاملة للمصطلحات المستهدفة.'}</div>`;
}

function renderJDMatch() { /* handled in renderATS */ }

/* ---------------- AI Assistant ---------------- */
let lastAI = { action: null, text: '' };

function topSkills(n = 6) {
  return (state.skills || []).slice(0, n).join('، ');
}

function bestMetric() {
  const all = (state.experience || []).flatMap(e => bulletsFrom(e.bullets)).filter(b => /\d/.test(b));
  return all[0] || '';
}

function genSummary() {
  const p = state.personal;
  const title = p.title?.trim() || 'متخصص';
  const years = p.years ? `${p.years} سنوات` : 'عدة سنوات';
  const sk = topSkills(5) || 'مهاراتي المهنية';
  const metric = bestMetric();
  const metricClean = metric.replace(/^[•\-\*\s]+/, '').replace(/\.$/, '');
  const templates = [
    `${title} بخبرة ${years} في ${sk}. ${metricClean ? metricClean + '.' : 'أعمل على تحويل المتطلبات إلى حلول عملية ذات أثر ملموس.'} أمتلك قدرة مثبتة على العمل ضمن فرق متعددة التخصصات، واتخاذ قرارات مبنية على البيانات، والالتزام بمعايير الجودة والمواعيد. أبحث عن دور يتيح لي توظيف خبرتي في ${sk.split('،')[0]} لتحقيق نتائج قابلة للقياس.`,
    `${title} يتمتع بخبرة ${years}، متخصص في ${sk}. ${metricClean ? 'من أبرز إنجازاتي: ' + metricClean + '.' : ''} أجمع بين الفهم التقني والعمل الجماعي، وأتميز بتحسين العمليات وتقليل الهدر ورفع كفاءة الفرق. أسعى إلى بيئة عمل طموحة تُقدّر الابتكار والنتائج.`,
    `محترف في مجال ${title} بخبرة ${years}، مع تركيز على ${sk}. ${metricClean ? metricClean + '.' : ''} أؤمن بأن النجاح يبدأ من وضوح الأهداف وقياس الأثر، ولذلك أعتمد مؤشرات أداء دقيقة في كل مشروع. أبحث عن فرصة تسهم فيها خبرتي في دفع نمو الفريق والمنظمة.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

function improveBullets() {
  const exp = (state.experience || []).find(e => bulletsFrom(e.bullets).length);
  if (!exp) return { text: 'لا توجد نقاط خبرة لتحسينها. أضف أولاً إنجازاتك في تبويب «الخبرة».', apply: null };
  const lines = bulletsFrom(exp.bullets);
  const improved = lines.map(line => {
    let l = line.replace(/^(مسؤول عن|مسؤولة عن|كنت أقوم بـ|قمت بـ|عملت على)\s*/i, '');
    const first = normalizeAr(l).split(/\s+/)[0] || '';
    const hasVerb = ACTION_VERBS.some(v => normalizeAr(v) === first);
    if (!hasVerb) l = 'أنجزت ' + l;
    if (!/\d/.test(l)) l += ' — [أضف رقماً: نسبة التحسين، عدد العملاء، أو قيمة التوفير]';
    if (l.length > 190) l = l.slice(0, 187).trim() + '…';
    return l.charAt(0).toUpperCase() + l.slice(1);
  });
  const text = improved.map(l => '• ' + l).join('\n') +
    '\n\nملاحظة: استبدل العناصر بين [ ] بأرقام حقيقية من عملك. الصياغة الحالية تتبع نمط «فعل + مهمة + نتيجة».';
  return { text, apply: improved.join('\n'), expId: exp.id };
}

function suggestKeywords() {
  const kws = roleKeywords();
  const cov = keywordCoverage(kws, cvText());
  const missing = cov.miss;
  const text = `الكلمات المفتاحية المقترحة لمجال «${state.personal.title || 'تخصصك'}»:\n\n` +
    kws.map(k => `${missing.includes(k) ? '○' : '●'} ${k}`).join('\n') +
    `\n\n● موجودة في سيرتك (${cov.hits.length}) · ○ ناقصة (${missing.length})` +
    `\n\nنصيحة: أدرج المصطلحات الناقصة التي تملكها فعلاً داخل «المهارات» أو ضمن نقاط الخبرة بصياغة طبيعية، لا كقائمة منفصلة فقط.`;
  return { text, apply: missing.length ? missing.join('، ') : null };
}

function fullReview() {
  const { score, checks } = computeATS();
  const bad = checks.filter(c => c.status !== 'ok').sort((a, b) => (b.pts !== undefined ? 0 : 0));
  const lines = [`درجة التوافق الحالية: ${score}/100`, ''];
  if (!bad.length) {
    lines.push('✓ لا توجد ملاحظات حرجة. سيرتك جاهزة، راجع فقط تطابق المصطلحات مع كل وصف وظيفي قبل الإرسال.');
  } else {
    lines.push('أولويات التحسين:');
    bad.forEach((c, i) => lines.push(`${i + 1}. ${c.title} — ${c.detail}`));
    lines.push('', 'نصيحة أخيرة: احفظ نسخة مخصصة لكل وظيفة، وغيّر المسمى والكلمات المفتاحية لتطابق الإعلان.');
  }
  return { text: lines.join('\n'), apply: null };
}

function runAI(action) {
  const out = $('#aiOutput');
  lastAI = { action, text: '', apply: null };
  out.innerHTML = '<span class="typing">جارٍ التحليل والصياغة…</span>';
  setTimeout(() => {
    let res;
    if (action === 'summary') { const t = genSummary(); res = { text: t, apply: t }; }
    else if (action === 'bullets') res = improveBullets();
    else if (action === 'keywords') res = suggestKeywords();
    else res = fullReview();
    lastAI = { action, text: res.text, apply: res.apply, expId: res.expId };
    out.textContent = res.text;
  }, 520);
}

/* ---------------- Zoom ---------------- */
function applyZoom(z) {
  z = Math.max(0.35, Math.min(1.6, z));
  state.settings.zoom = z;
  const paper = $('#paper');
  paper.style.zoom = z;
  $('#paperScaler').style.transform = 'none';
  $('#paperScaler').style.width = '';
  $('#paperScaler').style.height = '';
  $('#zoomVal').textContent = Math.round(z * 100) + '%';
  save();
}

function fitZoom() {
  const stage = $('#stage');
  const avail = stage.clientWidth - 40;
  applyZoom(Math.min(1, avail / 794));
}

/* ---------------- Events ---------------- */
function bindEvents() {
  // Tabs
  $('#tabs').addEventListener('click', e => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    $$('.tab').forEach(t => t.classList.toggle('active', t === tab));
    $$('.panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab.dataset.tab));
    if (tab.dataset.tab === 'ats') renderATS();
  });

  // Inputs (delegated)
  document.addEventListener('input', e => {
    const el = e.target.closest('[data-bind]');
    if (!el) return;
    const path = el.dataset.bind;
    const val = el.type === 'checkbox' ? el.checked : el.value;
    setPath(state, path, val);
    renderPreview();
    save();
    // live card title
    if (/^(experience|education|projects|certs|languages)\.\d+\./.test(path)) {
      const [key, idx] = path.split('.');
      const card = el.closest('.card');
      if (card && listConfig[key]) {
        const t = card.querySelector('.card-title');
        if (t) {
          const label = state[key][+idx][listConfig[key].fields[0].k] || listConfig[key].title;
          t.innerHTML = `${listConfig[key].num ? `<span class="idx">${+idx + 1}</span>` : '<span class="idx">•</span>'} ${esc(label)}`;
        }
      }
    }
  });

  // Add / delete list items
  document.addEventListener('click', e => {
    const addBtn = e.target.closest('[data-add]');
    if (addBtn) {
      const key = addBtn.dataset.add;
      const item = { id: uid() };
      listConfig[key].fields.forEach(f => item[f.k] = '');
      if (key === 'experience') item.current = false;
      state[key].push(item);
      renderList(key);
      renderPreview();
      save();
      const cards = $(`#list-${key}`).querySelectorAll('.card');
      cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cards[cards.length - 1]?.querySelector('input,textarea')?.focus();
      return;
    }
    const delBtn = e.target.closest('[data-del]');
    if (delBtn) {
      const key = delBtn.dataset.del;
      state[key].splice(+delBtn.dataset.index, 1);
      renderList(key);
      renderPreview();
      save();
      return;
    }
    const skillDel = e.target.closest('[data-skill-del]');
    if (skillDel) {
      state.skills.splice(+skillDel.dataset.skillDel, 1);
      renderSkillTags();
      renderPreview();
      save();
    }
  });

  // Skills
  const addSkill = () => {
    const input = $('#skillInput');
    const v = input.value.trim().replace(/,$/, '');
    if (!v) return;
    if (!state.skills.some(s => normalizeAr(s) === normalizeAr(v))) state.skills.push(v);
    input.value = '';
    renderSkillTags();
    renderPreview();
    save();
  };
  $('#addSkill').addEventListener('click', addSkill);
  $('#skillInput').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } });

  // Print
  $('#btnPrint').addEventListener('click', () => {
    if (!state.personal.name?.trim()) { toast('أضف اسمك أولاً قبل التحميل'); return; }
    window.print();
  });

  // Sample
  $('#btnSample').addEventListener('click', () => {
    if (!confirm('سيتم استبدال البيانات الحالية بنموذج جاهز. هل تريد المتابعة؟')) return;
    state = demoState();
    renderAllLists(); renderSkillTags(); renderPreview(); applyZoom(1);
    toast('تم تحميل النموذج الجاهز');
  });

  // Clear all
  $('#btnClear').addEventListener('click', () => {
    if (!confirm('سيتم مسح جميع بيانات السيرة نهائياً من هذا المتصفح. هل أنت متأكد؟')) return;
    state = emptyState();
    localStorage.removeItem(STORAGE_KEY);
    renderAllLists(); renderSkillTags(); renderPreview(); applyZoom(1);
    $$('.tab')[0].click();
    toast('تم بدء سيرة جديدة');
  });

  // Export / Import
  $('#btnExport').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `sirati-${(state.personal.name || 'cv').replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('تم تصدير البيانات');
  });
  $('#btnImport').addEventListener('click', () => $('#fileInput').click());
  $('#fileInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        state = Object.assign(emptyState(), data, {
          personal: Object.assign(emptyState().personal, data.personal || {}),
          settings: Object.assign(emptyState().settings, data.settings || {})
        });
        renderAllLists(); renderSkillTags(); renderPreview(); applyZoom(state.settings.zoom || 1);
        toast('تم استيراد البيانات بنجاح');
      } catch (err) { toast('ملف غير صالح — تأكد أنه JSON مُصدَّر من سِيرَتي'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Zoom
  $('#zoomIn').addEventListener('click', () => applyZoom((state.settings.zoom || 1) + 0.1));
  $('#zoomOut').addEventListener('click', () => applyZoom((state.settings.zoom || 1) - 0.1));
  $('#zoomFit').addEventListener('click', fitZoom);

  // JD
  let jdTimer;
  $('#jdInput').addEventListener('input', () => {
    clearTimeout(jdTimer);
    jdTimer = setTimeout(renderATS, 350);
  });
  $('#btnRescan').addEventListener('click', () => { renderATS(); toast('تم تحديث التحليل'); });
  $('#scorePill').addEventListener('click', () => {
    $('#tabs').querySelector('[data-tab="ats"]').click();
    $('.editor-scroll').scrollTo({ top: 0, behavior: 'smooth' });
  });

  // AI
  $('#aiFab').addEventListener('click', () => { $('#aiModal').classList.add('open'); });
  $('#aiClose').addEventListener('click', () => $('#aiModal').classList.remove('open'));
  $('#aiModal').addEventListener('click', e => { if (e.target.id === 'aiModal') $('#aiModal').classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') $('#aiModal').classList.remove('open'); });
  $$('.ai-act').forEach(b => b.addEventListener('click', () => runAI(b.dataset.ai)));

  $('#btnGenSummary').addEventListener('click', () => {
    $('#aiModal').classList.add('open');
    runAI('summary');
  });

  $('#aiCopy').addEventListener('click', async () => {
    if (!lastAI.text) return;
    try { await navigator.clipboard.writeText(lastAI.text); toast('تم النسخ'); }
    catch { toast('تعذّر النسخ — حدد النص يدوياً'); }
  });

  $('#aiApply').addEventListener('click', () => {
    if (!lastAI.apply) { toast('لا يوجد نص قابل للتطبيق لهذا الإجراء'); return; }
    if (lastAI.action === 'summary') {
      state.personal.summary = lastAI.apply;
      const ta = $('[data-bind="personal.summary"]');
      if (ta) ta.value = lastAI.apply;
      toast('تم تطبيق الملخص');
    } else if (lastAI.action === 'bullets') {
      const exp = state.experience.find(e => e.id === lastAI.expId);
      if (exp) {
        exp.bullets = lastAI.apply;
        const ta = $(`[data-bind="experience.${state.experience.indexOf(exp)}.bullets"]`);
        if (ta) ta.value = lastAI.apply;
      }
      toast('تم تحسين نقاط الخبرة');
    } else if (lastAI.action === 'keywords') {
      const missing = lastAI.apply.split('،').map(s => s.trim()).filter(Boolean);
      missing.forEach(k => { if (!state.skills.some(s => normalizeAr(s) === normalizeAr(k))) state.skills.push(k); });
      renderSkillTags();
      toast(`أُضيفت ${missing.length} مهارة`);
    }
    renderPreview();
    save();
    $('#aiModal').classList.remove('open');
  });

  // Mobile view switch
  $$('.mobile-switch button').forEach(b => b.addEventListener('click', () => {
    $$('.mobile-switch button').forEach(x => x.classList.toggle('active', x === b));
    document.body.classList.toggle('show-preview', b.dataset.view === 'preview');
    if (b.dataset.view === 'preview') setTimeout(fitZoom, 60);
  }));

  // Resize
  let rz;
  window.addEventListener('resize', () => {
    clearTimeout(rz);
    rz = setTimeout(() => { if (window.innerWidth < 860) fitZoom(); }, 200);
  });

  // Keyboard: Ctrl/Cmd+P handled natively; Ctrl+S export
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      $('#btnExport').click();
    }
  });
}

/* ---------------- Init ---------------- */
function init() {
  renderAllLists();
  renderSkillTags();
  renderPreview();
  bindEvents();
  requestAnimationFrame(() => {
    if (window.innerWidth < 860) fitZoom();
    else applyZoom(Math.min(1, (($('#stage').clientWidth - 48) / ($('#paper').offsetWidth || 794))));
  });
  // fonts may shift layout
  if (document.fonts?.ready) document.fonts.ready.then(() => { if (window.innerWidth < 860) fitZoom(); });
}

init();
