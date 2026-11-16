// Astrolabe settings page: edits chrome.storage.local "settings" and saves/loads a config file.
const DEFAULTS = { apiKey: '', model: 'claude-opus-5-5', effort: 'medium', zodiac: 'tropical', ayanamsa: 'lahiri', houses: 'placidus', siderealHouses: 'whole', numerology: 'pythagorean', notify: false, notifyTime: '08:00', notifyPeople: [], journalRemind: false, journalTime: '21:00' };
const HOUSES = { placidus: 'Placidus', whole: 'Whole Sign', equal: 'Equal', porphyry: 'Porphyry', koch: 'Koch' };
const form = document.getElementById('form');
const statusEl = document.getElementById('status');
let dirty = false;

const get = keys => chrome.storage.local.get(keys);
const set = obj => chrome.storage.local.set(obj);
function status(msg, kind = 'ok') { statusEl.textContent = msg; statusEl.className = 'status ' + kind; }

for (const sel of document.querySelectorAll('select.houses')) sel.innerHTML = Object.entries(HOUSES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');

function fill(settings) {
  const s = { ...DEFAULTS, ...settings };
  for (const [k, v] of Object.entries(s)) {
    const el = form.elements[k];
    if (!el || !el.tagName) continue;
    if (el.type === 'checkbox') el.checked = !!v; else el.value = v;
  }
  get('profiles').then(({ profiles = [] }) => {
    document.getElementById('notify-people').innerHTML = profiles.map((p) => `<label class="check" style="margin-right:12px"><input type="checkbox" class="np" value="${p.id}" ${(s.notifyPeople || []).includes(p.id) ? 'checked' : ''}> ${p.name.replace(/[<>&"]/g, '')}</label>`).join('') || '<span class="muted small">Add people in the app first.</span>';
  });
  dirty = false;
}
function read() {
  const out = {};
  for (const k of Object.keys(DEFAULTS)) {
    if (k === 'notifyPeople') { out[k] = [...document.querySelectorAll('.np:checked')].map((x) => x.value); continue; }
    const el = form.elements[k];
    out[k] = el.type === 'checkbox' ? el.checked : (el.value || '').trim();
  }
  return out;
}
async function refreshCounts() {
  const { profiles = [], threads = [] } = await get(['profiles', 'threads']);
  document.getElementById('counts').textContent = `Currently stored: ${profiles.length} ${profiles.length === 1 ? 'person' : 'people'}, ${threads.length} conversation${threads.length === 1 ? '' : 's'}.`;
}

form.addEventListener('input', () => { dirty = true; status('Unsaved changes', ''); });
form.addEventListener('submit', async e => {
  e.preventDefault();
  const s = read();
  if (s.apiKey && !/^sk-ant-/.test(s.apiKey)) { status('That doesn’t look like an Anthropic key (it should start with sk-ant-).', 'bad'); return; }
  const { settings = {} } = await get('settings');
  await set({ settings: { ...settings, ...s } });
  dirty = false;
  status('Saved ✓');
});
document.getElementById('reset').addEventListener('click', () => {
  const key = form.elements.apiKey.value;
  fill({ ...DEFAULTS, apiKey: key });
  dirty = true; status('Defaults restored (API key kept) — click Save to apply.', '');
});
document.getElementById('toggle-key').addEventListener('click', e => {
  const i = form.elements.apiKey; i.type = i.type === 'password' ? 'text' : 'password';
  e.target.textContent = i.type === 'password' ? 'Show' : 'Hide';
});

document.getElementById('export').addEventListener('click', async () => {
  const { settings = {}, profiles = [], threads = [] } = await get(['settings', 'profiles', 'threads']);
  const cfg = { ...DEFAULTS, ...settings, ...(dirty ? read() : {}) };
  if (!document.getElementById('with-key').checked) delete cfg.apiKey;
  const file = { app: 'astrolabe', version: 1, exportedAt: new Date().toISOString(), settings: cfg };
  if (document.getElementById('with-data').checked) Object.assign(file, { profiles, threads });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' }));
  a.download = `astrolabe-config-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  status('Config file saved to your Downloads folder.');
});

document.getElementById('import').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  try {
    const j = JSON.parse(await f.text());
    if (j.app !== 'astrolabe' && !j.settings && !Array.isArray(j.profiles)) throw new Error('This isn’t an Astrolabe config file.');
    const cur = await get(['settings', 'profiles', 'threads']);
    const update = {};
    const msgs = [];
    if (j.settings && typeof j.settings === 'object') {
      const clean = Object.fromEntries(Object.entries(j.settings).filter(([k, v]) => k in DEFAULTS && typeof v === typeof DEFAULTS[k]));
      update.settings = { ...DEFAULTS, ...(cur.settings || {}), ...clean };
      if (!clean.apiKey && cur.settings?.apiKey) update.settings.apiKey = cur.settings.apiKey; // file without a key keeps the current one
      msgs.push('settings');
    }
    if (Array.isArray(j.profiles)) {
      const ids = new Set((cur.profiles || []).map(p => p.id));
      const add = j.profiles.filter(p => p && p.id && !ids.has(p.id));
      update.profiles = [...(cur.profiles || []), ...add];
      msgs.push(`${add.length} new ${add.length === 1 ? 'person' : 'people'}`);
    }
    if (Array.isArray(j.threads)) {
      const ids = new Set((cur.threads || []).map(t => t.id));
      const add = j.threads.filter(t => t && t.id && !ids.has(t.id));
      update.threads = [...(cur.threads || []), ...add];
      msgs.push(`${add.length} conversation${add.length === 1 ? '' : 's'}`);
    }
    await set(update);
    if (update.settings) fill(update.settings);
    refreshCounts();
    status(`Loaded ${msgs.join(', ')} ✓`);
  } catch (err) { status('Could not load file: ' + err.message, 'bad'); }
});

window.addEventListener('beforeunload', e => { if (dirty) e.preventDefault(); });
get('settings').then(({ settings }) => fill(settings || {}));
refreshCounts();

// ---- Voice & reading (stored separately under "tts"; the app picks changes up live) ----
const TTS_DEFAULT = { voice: '', rate: 1, pitch: 1, volume: 1, autoRead: false };
let tts = { ...TTS_DEFAULT };
const $id = (x) => document.getElementById(x);
const fmt = { rate: (v) => (+v).toFixed(2) + '×', pitch: (v) => (+v < 0.95 ? 'lower ' : +v > 1.05 ? 'higher ' : 'normal ') + (+v).toFixed(2), volume: (v) => Math.round(v * 100) + '%' };
function fillVoices() {
  if (typeof speechSynthesis === 'undefined') { $id('voice-card').insertAdjacentHTML('beforeend', '<p class="status bad">This browser has no text-to-speech voices.</p>'); return; }
  const all = $id('tts-all').checked, lang = (navigator.language || 'en').split('-')[0];
  const vs = speechSynthesis.getVoices().filter((v) => all || v.lang.toLowerCase().startsWith(lang) || v.voiceURI === tts.voice)
    .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
  $id('tts-voice').innerHTML = '<option value="">Automatic (best voice for my language)</option>' + vs.map((v) => `<option value="${v.voiceURI.replace(/"/g, '&quot;')}" ${v.voiceURI === tts.voice ? 'selected' : ''}>${v.name.replace(/[<>&]/g, '')} · ${v.lang}${/enhanced|premium|natural|neural/i.test(v.name) ? ' ★' : ''}${v.localService ? '' : ' (online)'}</option>`).join('');
}
function fillTTS() {
  for (const k of ['rate', 'pitch', 'volume']) { $id('tts-' + k).value = tts[k]; $id('tts-' + k + '-v').textContent = fmt[k](tts[k]); }
  $id('tts-auto').checked = !!tts.autoRead;
  fillVoices();
}
async function saveTTS() { await set({ tts }); status('Voice settings saved ✓'); }
for (const k of ['rate', 'pitch', 'volume']) {
  $id('tts-' + k).addEventListener('input', (e) => { $id('tts-' + k + '-v').textContent = fmt[k](e.target.value); e.stopPropagation(); });
  $id('tts-' + k).addEventListener('change', (e) => { tts[k] = +e.target.value; saveTTS(); e.stopPropagation(); });
}
for (const id of ['tts-voice', 'tts-auto', 'tts-all']) $id(id).addEventListener('input', (e) => e.stopPropagation(), true);
$id('tts-voice').addEventListener('change', (e) => { tts.voice = e.target.value; saveTTS(); });
$id('tts-auto').addEventListener('change', (e) => { tts.autoRead = e.target.checked; saveTTS(); });
$id('tts-all').addEventListener('change', fillVoices);
$id('tts-reset').addEventListener('click', () => { tts = { ...TTS_DEFAULT, autoRead: tts.autoRead }; fillTTS(); saveTTS(); });
$id('tts-test').addEventListener('click', () => {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance("Hi! I'm your Astrolabe reader. This is how I'll sound when I read your charts and readings.");
  const v = speechSynthesis.getVoices().find((x) => x.voiceURI === tts.voice);
  if (v) { u.voice = v; u.lang = v.lang; }
  u.rate = tts.rate; u.pitch = tts.pitch; u.volume = tts.volume;
  speechSynthesis.speak(u);
});
if (typeof speechSynthesis !== 'undefined') speechSynthesis.onvoiceschanged = fillVoices;
get('tts').then(({ tts: saved }) => { tts = { ...TTS_DEFAULT, ...(saved || {}) }; fillTTS(); });
