// Astrolabe service worker: opens the app tab and makes API calls look like a plain client.
const APP = chrome.runtime.getURL('app.html');

chrome.action.onClicked.addListener(async () => {
  const [tab] = await chrome.tabs.query({ url: APP });
  if (tab) { await chrome.tabs.update(tab.id, { active: true }); await chrome.windows.update(tab.windowId, { focused: true }); }
  else await chrome.tabs.create({ url: APP });
});

const RULE_ID = 1;
async function installPlainClientRule() {
  const ua = `Astrolabe/${chrome.runtime.getManifest().version}`;
  const base = { id: RULE_ID, priority: 1, condition: { initiatorDomains: [chrome.runtime.id], resourceTypes: ['xmlhttprequest', 'other'] } };
  const full = ['origin', 'referer', 'sec-fetch-site', 'sec-fetch-mode', 'sec-fetch-dest', 'sec-ch-ua', 'sec-ch-ua-mobile', 'sec-ch-ua-platform'];
  const rule = headers => ({ ...base, action: { type: 'modifyHeaders', requestHeaders: [...headers.map(header => ({ header, operation: 'remove' })), { header: 'user-agent', operation: 'set', value: ua }] } });
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE_ID], addRules: [rule(full)] });
  } catch {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [RULE_ID], addRules: [rule(['origin', 'referer'])] }).catch(() => {});
  }
}
chrome.runtime.onInstalled.addListener(installPlainClientRule);
chrome.runtime.onStartup.addListener(installPlainClientRule);
installPlainClientRule();

// ---- Morning forecast notification ----
// The app stores 14 days of one-line forecasts in chrome.storage ("forecast"); this worker shows today's at the chosen time.
const ALARM = 'astrolabe-morning';
async function scheduleMorning() {
  const { settings = {} } = await chrome.storage.local.get('settings');
  await chrome.alarms.clear(ALARM);
  if (!settings.notify) return;
  const [h, m] = (settings.notifyTime || '08:00').split(':').map(Number);
  const next = new Date(); next.setHours(h, m, 0, 0);
  if (next <= new Date()) next.setDate(next.getDate() + 1);
  chrome.alarms.create(ALARM, { when: next.getTime(), periodInMinutes: 1440 });
}
async function showMorning() {
  const { forecast, settings = {} } = await chrome.storage.local.get(['forecast', 'settings']);
  if (!settings.notify) return;
  const d = new Date(), key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const items = forecast?.days?.[key];
  const message = items?.length
    ? items.map((x) => `${items.length > 1 ? x.name + ': ' : ''}${x.moon} · day ${x.day} · ${x.text}`).join('\n')
    : 'Open Astrolabe to see today\'s sky for you.';
  chrome.notifications.create(ALARM + ':' + key, { type: 'basic', iconUrl: 'icons/icon128.png', title: items?.length === 1 ? `Today for ${items[0].name}` : 'Your day in the stars', message, priority: 0 });
}
chrome.alarms.onAlarm.addListener((a) => { if (a.name === ALARM) showMorning(); });
chrome.notifications.onClicked.addListener(async (id) => {
  if (!id.startsWith(ALARM)) return;
  chrome.notifications.clear(id);
  const url = APP + '#today';
  const [tab] = await chrome.tabs.query({ url: APP + '*' });
  if (tab) { await chrome.tabs.update(tab.id, { active: true, url }); await chrome.windows.update(tab.windowId, { focused: true }); }
  else await chrome.tabs.create({ url });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.settings) return;
  const o = changes.settings.oldValue || {}, n = changes.settings.newValue || {};
  if (o.notify !== n.notify || o.notifyTime !== n.notifyTime) scheduleMorning();
});
chrome.runtime.onInstalled.addListener(scheduleMorning);
chrome.runtime.onStartup.addListener(scheduleMorning);

// ---- Daily journal reminder ----
const JALARM = 'astrolabe-journal';
async function scheduleJournal() {
  const { settings = {} } = await chrome.storage.local.get('settings');
  await chrome.alarms.clear(JALARM);
  if (!settings.journalRemind) return;
  const [h, m] = (settings.journalTime || '21:00').split(':').map(Number);
  const next = new Date(); next.setHours(h, m, 0, 0);
  if (next <= new Date()) next.setDate(next.getDate() + 1);
  chrome.alarms.create(JALARM, { when: next.getTime(), periodInMinutes: 1440 });
}
async function showJournalReminder() {
  const { settings = {}, journal = [] } = await chrome.storage.local.get(['settings', 'journal']);
  if (!settings.journalRemind) return;
  const d = new Date(), key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (journal.some((e) => e.date === key)) return; // already logged today
  chrome.notifications.create(JALARM + ':' + key, { type: 'basic', iconUrl: 'icons/icon128.png', title: 'How was your day?', message: 'Two taps to log your mood in Astrolabe \u2014 it saves the sky with it.', priority: 0 });
}
chrome.alarms.onAlarm.addListener((a) => { if (a.name === JALARM) showJournalReminder(); });
chrome.notifications.onClicked.addListener(async (id) => {
  if (!id.startsWith(JALARM)) return;
  chrome.notifications.clear(id);
  const url = APP + '#journal';
  const [tab] = await chrome.tabs.query({ url: APP + '*' });
  if (tab) { await chrome.tabs.update(tab.id, { active: true, url }); await chrome.windows.update(tab.windowId, { focused: true }); }
  else await chrome.tabs.create({ url });
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'local' || !changes.settings) return;
  const o = changes.settings.oldValue || {}, n = changes.settings.newValue || {};
  if (o.journalRemind !== n.journalRemind || o.journalTime !== n.journalTime) scheduleJournal();
});
chrome.runtime.onInstalled.addListener(scheduleJournal);
chrome.runtime.onStartup.addListener(scheduleJournal);
