// CareNavigator MD — Client-side matching logic
// No data is stored, sent, or tracked.

const TOTAL_STEPS = 8;
let currentStep = 1;

// ── DOM refs ────────────────────────────────────────────────────────────────
const progressFill  = document.getElementById('progress-fill');
const progressLabel = document.getElementById('progress-label');
const btnNext       = document.getElementById('btn-next');
const btnBack       = document.getElementById('btn-back');
const btnSubmit     = document.getElementById('btn-submit');
const btnRestart    = document.getElementById('btn-restart');
const form          = document.getElementById('assessment-form');

// ── Step navigation ─────────────────────────────────────────────────────────
function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector(`[data-step="${n}"]`).classList.add('active');

  progressFill.style.width = `${(n / TOTAL_STEPS) * 100}%`;
  progressLabel.textContent = `Step ${n} of ${TOTAL_STEPS}`;

  btnBack.classList.toggle('hidden', n === 1);
  btnNext.classList.toggle('hidden', n === TOTAL_STEPS);
  btnSubmit.classList.toggle('hidden', n !== TOTAL_STEPS);
}

btnNext.addEventListener('click', () => {
  if (currentStep < TOTAL_STEPS) {
    currentStep++;
    showStep(currentStep);
  }
});

btnBack.addEventListener('click', () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
});

// Show disability type subquestion when "Yes" selected
document.querySelectorAll('[name="has_disability"]').forEach(r => {
  r.addEventListener('change', () => {
    const sub = document.getElementById('disability-type-q');
    sub.classList.toggle('hidden', r.value !== 'yes');
  });
});

// Show non-resident message
document.querySelectorAll('[name="maryland_resident"]').forEach(r => {
  r.addEventListener('change', () => {
    const msg = document.getElementById('not-resident-msg');
    msg.classList.toggle('hidden', r.value !== 'no');
    btnNext.disabled = r.value === 'no';
  });
});

// ── Collect answers ─────────────────────────────────────────────────────────
function collectAnswers() {
  const fd = new FormData(form);

  const income_monthly = parseFloat(fd.get('income')) || 0;
  const household_size = parseInt(fd.get('household_size')) || 1;
  const age = parseInt(fd.get('age')) || 0;
  const assetsVal = fd.get('assets');

  const assetMap = {
    'under2000': 1999,
    '2000to4500': 3000,
    'over4500': 10000,
  };

  return {
    is_maryland_resident:           fd.get('maryland_resident') === 'yes',
    age,
    has_disability:                 fd.get('has_disability') === 'yes',
    has_physical_disability:        fd.get('physical_disability') === 'on',
    has_developmental_disability:   fd.get('developmental_disability') === 'on',
    has_intellectual_disability:    fd.get('developmental_disability') === 'on',
    has_mental_health:              fd.get('mental_health') === 'on',
    has_als:                        fd.get('als') === 'on',
    has_esrd:                       fd.get('esrd') === 'on',
    has_brain_injury:               fd.get('brain_injury') === 'on',
    has_kidney_disease:             fd.get('kidney_disease') === 'on',
    has_ms:                         fd.get('ms') === 'on',
    has_epilepsy:                   fd.get('epilepsy') === 'on',
    has_medicare:                   fd.get('has_medicare') === 'on',
    is_veteran:                     fd.get('is_veteran') === 'on',
    has_service_connected_disability: fd.get('service_connected') === 'on',
    has_100_percent_va_rating:      fd.get('va_100_percent') === 'on',
    has_work_history:               fd.get('work_history') === 'yes',
    currently_working_full_time:    fd.get('currently_working') === 'yes',
    income_monthly,
    household_size,
    assets:                         assetMap[assetsVal] ?? 0,
    is_homeowner:                   fd.get('housing_status') === 'homeowner',
    receives_housing_voucher:       fd.get('has_housing_voucher') === 'on',
    needs_assisted_living:          fd.get('needs_assisted_living') === 'on',
    has_children_under_19:          fd.get('has_children') === 'on',
    has_dependent_children:         fd.get('has_children') === 'on',
    needs_daily_living_assistance:  fd.get('needs_daily_care') === 'on',
    needs_transportation:           fd.get('needs_transportation') === 'on',
    wants_to_work:                  fd.get('wants_to_work') === 'on',
    has_insurance:                  fd.get('no_insurance') !== 'on',
    has_ssdi:                       fd.get('has_ssdi') === 'on',
    has_ssi:                        fd.get('has_ssi') === 'on',
    disability_before_26:           fd.get('disability_before_26') === 'on',
    months_on_ssdi:                 fd.get('has_ssdi') === 'on' ? 25 : 0,
  };
}

// ── Match benefits ──────────────────────────────────────────────────────────
function matchBenefits(answers) {
  return BENEFITS.filter(b => {
    try { return b.eligibility(answers); }
    catch { return false; }
  });
}

// ── Render results ──────────────────────────────────────────────────────────
function renderResults(matched) {
  const section = document.getElementById('results-section');
  const grid    = document.getElementById('results-grid');
  const intro   = document.getElementById('results-intro');

  section.classList.remove('hidden');
  section.scrollIntoView({ behavior: 'smooth' });

  intro.textContent = `You may qualify for ${matched.length} program${matched.length !== 1 ? 's' : ''}. Review each one below.`;

  grid.innerHTML = matched.map(b => renderCard(b)).join('');
}

function badgeClass(type) {
  return `badge-${type}`;
}

function typeLabel(type) {
  const map = {
    federal:        'Federal',
    state:          'Maryland State',
    federal_state:  'Federal + State',
    nonprofit:      'Nonprofit',
    private:        'Private Foundation',
    state_nonprofit:'State / Nonprofit',
  };
  return map[type] || type;
}

function renderCard(b) {
  const cat = CATEGORIES[b.category] || {};
  return `
    <div class="result-card">
      <div class="card-badge ${badgeClass(b.type)}">${cat.icon || ''} ${typeLabel(b.type)}</div>
      <h3>${escHtml(b.name)}</h3>
      <div class="amount">${escHtml(b.amount)}</div>
      <p>${escHtml(b.description)}</p>
      <a href="${b.apply_url}" target="_blank" rel="noopener" class="apply-btn">Apply / Learn More</a>
      <p class="how-to">${escHtml(b.how_to_apply)}</p>
    </div>
  `;
}

function escHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str || ''));
  return d.innerHTML;
}

// ── Submit ──────────────────────────────────────────────────────────────────
btnSubmit.addEventListener('click', () => {
  const answers = collectAnswers();
  const matched = matchBenefits(answers);
  renderResults(matched);
});

// ── Restart ─────────────────────────────────────────────────────────────────
btnRestart.addEventListener('click', () => {
  form.reset();
  currentStep = 1;
  showStep(1);
  document.getElementById('disability-type-q').classList.add('hidden');
  document.getElementById('results-section').classList.add('hidden');
  document.getElementById('assessment').scrollIntoView({ behavior: 'smooth' });
});

// ── Browse all programs ─────────────────────────────────────────────────────
function renderAllPrograms(filter = 'all') {
  const grid = document.getElementById('programs-grid');
  const list = filter === 'all' ? BENEFITS : BENEFITS.filter(b => b.category === filter);
  grid.innerHTML = list.map(b => renderCard(b)).join('');
}

function renderFilters() {
  const bar = document.getElementById('filter-bar');
  const used = [...new Set(BENEFITS.map(b => b.category))];

  const allBtn = `<button class="filter-btn active" data-cat="all">All (${BENEFITS.length})</button>`;
  const catBtns = used.map(cat => {
    const c = CATEGORIES[cat] || {};
    const count = BENEFITS.filter(b => b.category === cat).length;
    return `<button class="filter-btn" data-cat="${cat}">${c.icon || ''} ${c.label || cat} (${count})</button>`;
  }).join('');

  bar.innerHTML = allBtn + catBtns;

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderAllPrograms(btn.dataset.cat);
  });
}

// ── Init ────────────────────────────────────────────────────────────────────
showStep(1);
renderFilters();
renderAllPrograms();
