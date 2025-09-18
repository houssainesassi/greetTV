const defaultMsgs = {
  morning: 'Good morning 🌅',
  afternoon: 'Good afternoon ☀️',
  evening: 'Good evening 🌇',
  night: 'Good night 🌙'
};

// عناصر الـ DOM
const greetingText = document.getElementById('greetingText');
const timeText = document.getElementById('timeText');
const input = document.getElementById('customMsg');
const select = document.getElementById('periodSelect');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');

// Load stored or default
function loadStored() {
  const stored = JSON.parse(localStorage.getItem('greet_custom') || '{}');
  return Object.assign({}, defaultMsgs, stored);
}

// Save
function saveStored(obj) {
  localStorage.setItem('greet_custom', JSON.stringify(obj));
}

// Current period
function getCurrentPeriod() {
  const h = new Date().getHours();
  if (h >= 5 && h <= 11) return 'morning';
  if (h >= 12 && h <= 16) return 'afternoon';
  if (h >= 17 && h <= 21) return 'evening';
  return 'night';
}

// Format time HH:MM
function formatTime(date) {
  return String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0');
}

// Render greeting (Output page)
function renderGreeting(forcePeriod) {
  if (!greetingText || !timeText) return;

  const stored = loadStored();
  let period = forcePeriod || getCurrentPeriod();
  const msg = stored[period] || defaultMsgs[period];

  greetingText.textContent = msg;
  timeText.textContent = 'Time: ' + formatTime(new Date());
}

// Input page events
if (saveBtn && resetBtn && input && select) {
  saveBtn.addEventListener('click', () => {
    const txt = input.value.trim();
    const p = select.value;
    if (!txt) return;

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
    alert('Saved successfully!');
  });

  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('greet_custom');
    alert('All messages cleared!');
  });

  // Enter key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement === input) {
      saveBtn.click();
    }
  });
}

// Auto render Output page
if (greetingText && timeText) {
  renderGreeting();
  setInterval(renderGreeting, 20 * 1000);
}
