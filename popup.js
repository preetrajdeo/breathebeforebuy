/**
 * Breathe Before You Buy - Popup/Settings Script
 */

const enabledToggle = document.getElementById('enabled-toggle');
const breathCountInput = document.getElementById('breath-count');
const inhaleSecondsInput = document.getElementById('inhale-seconds');
const exhaleSecondsInput = document.getElementById('exhale-seconds');
const pauseCountEl = document.getElementById('pause-count');

// Default settings
let settings = {
  enabled: true,
  breathCount: 3,
  inhaleSeconds: 5,
  exhaleSeconds: 5,
  pauseCount: 0
};

// Load settings from storage
chrome.storage.local.get(['breatheSettings'], (result) => {
  if (result.breatheSettings) {
    settings = { ...settings, ...result.breatheSettings };
  }

  // Update UI
  updateUI();
});

/**
 * Update UI with current settings
 */
function updateUI() {
  // Toggle
  if (settings.enabled) {
    enabledToggle.classList.add('active');
  } else {
    enabledToggle.classList.remove('active');
  }

  // Inputs
  breathCountInput.value = settings.breathCount;
  inhaleSecondsInput.value = settings.inhaleSeconds;
  exhaleSecondsInput.value = settings.exhaleSeconds;

  // Stats
  pauseCountEl.textContent = settings.pauseCount || 0;
}

/**
 * Save settings to storage
 */
function saveSettings() {
  chrome.storage.local.set({ breatheSettings: settings }, () => {
    console.log('Settings saved:', settings);
  });
}

/**
 * Toggle enabled/disabled
 */
enabledToggle.addEventListener('click', () => {
  settings.enabled = !settings.enabled;
  updateUI();
  saveSettings();
});

/**
 * Breath count change
 */
breathCountInput.addEventListener('change', (e) => {
  let value = parseInt(e.target.value);

  // Validate
  if (value < 3) value = 3;
  if (value > 10) value = 10;

  settings.breathCount = value;
  e.target.value = value;
  saveSettings();
});

/**
 * Inhale duration change
 */
inhaleSecondsInput.addEventListener('change', (e) => {
  let value = parseInt(e.target.value);

  // Validate
  if (value < 4) value = 4;
  if (value > 8) value = 8;

  settings.inhaleSeconds = value;
  e.target.value = value;
  saveSettings();
});

/**
 * Exhale duration change
 */
exhaleSecondsInput.addEventListener('change', (e) => {
  let value = parseInt(e.target.value);

  // Validate
  if (value < 4) value = 4;
  if (value > 8) value = 8;

  settings.exhaleSeconds = value;
  e.target.value = value;
  saveSettings();
});
