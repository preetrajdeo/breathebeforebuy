/**
 * Breathe Before You Buy - Welcome/Setup Page
 */

const breathCountSlider = document.getElementById('breath-count');
const breathValueDisplay = document.getElementById('breath-value');
const inhaleSlider = document.getElementById('inhale-seconds');
const inhaleValueDisplay = document.getElementById('inhale-value');
const exhaleSlider = document.getElementById('exhale-seconds');
const exhaleValueDisplay = document.getElementById('exhale-value');
const saveButton = document.getElementById('save-settings');

// Update breath count display
breathCountSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  breathValueDisplay.textContent = `${value} breath${value > 1 ? 's' : ''}`;
});

// Update inhale display
inhaleSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  inhaleValueDisplay.textContent = `${value} second${value > 1 ? 's' : ''}`;
});

// Update exhale display
exhaleSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  exhaleValueDisplay.textContent = `${value} second${value > 1 ? 's' : ''}`;
});

// Save settings and close welcome page
saveButton.addEventListener('click', () => {
  const settings = {
    enabled: true,
    breathCount: parseInt(breathCountSlider.value),
    inhaleSeconds: parseInt(inhaleSlider.value),
    exhaleSeconds: parseInt(exhaleSlider.value),
    delaySeconds: 3,
    pauseCount: 0,
    hasCompletedSetup: true
  };

  chrome.storage.local.set({ breatheSettings: settings }, () => {
    console.log('Welcome settings saved:', settings);
    // Show success message and close
    saveButton.textContent = '✓ Settings Saved!';
    saveButton.style.background = '#10b981';

    setTimeout(() => {
      window.close();
    }, 1000);
  });
});
