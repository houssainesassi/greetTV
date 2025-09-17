const defaultMsgs = {
  morning: 'Good morning 🌅',
  afternoon: 'Good afternoon ☀️',
  evening: 'Good evening 🌇',
  night: 'Good night 🌙'
};

const greetingText = document.getElementById('greetingText');
const timeText = document.getElementById('timeText');
const input = document.getElementById('customMsg');
const select = document.getElementById('periodSelect');
const saveBtn = document.getElementById('saveBtn');
const showBtn = document.getElementById('showBtn');
const resetBtn = document.getElementById('resetBtn');

function loadStored() {
  const stored = JSON.parse(localStorage.getItem('greet_custom') || '{}');
  return Object.assign({}, defaultMsgs, stored);
}

function saveStored(obj) {
  localStorage.setItem('greet_custom', JSON.stringify(obj));
}

function getCurrentPeriod() {
  const d = new Date();
  const h = d.getHours();
  if (h >= 5 && h <= 11) return 'morning';
  if (h >= 12 && h <= 16) return 'afternoon';
  if (h >= 17 && h <= 21) return 'evening';
  return 'night';
}

function formatTime(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return hh + ':' + mm;
}

function renderGreeting(forcePeriod) {
  const stored = loadStored();
  const period = forcePeriod || getCurrentPeriod();
  const msg = stored[period] || defaultMsgs[period];
  greetingText.textContent = msg;
  timeText.textContent = 'Time: ' + formatTime(new Date());
}

saveBtn.addEventListener('click', () => {
  const txt = input.value.trim();
  const p = select.value;
  if (!txt) return; // ignore if empty
  const stored = JSON.parse(localStorage.getItem('greet_custom') || '{}');
  if (p === 'all') {
    stored.morning = txt;
    stored.afternoon = txt;
    stored.evening = txt;
    stored.night = txt;
  } else {
    stored[p] = txt;
  }
  saveStored(stored);
  input.value = '';
  renderGreeting();
});

showBtn.addEventListener('click', () => {
  const p = select.value;
  // if "all" → just use current time period
  renderGreeting(p === "all" ? getCurrentPeriod() : p);
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem('greet_custom');
  renderGreeting();
});

renderGreeting();
setInterval(renderGreeting, 20 * 1000);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.activeElement === input) {
      saveBtn.click();
    } else {
      showBtn.click();
    }
  }
});
