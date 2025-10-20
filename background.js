/**
 * Breathe Before You Buy - Background Service Worker
 * Handles first-time installation and setup
 */

// Open welcome page on first install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Check if user has already completed setup
    chrome.storage.local.get(['breatheSettings'], (result) => {
      if (!result.breatheSettings || !result.breatheSettings.hasCompletedSetup) {
        // Open welcome page for first-time setup
        chrome.tabs.create({
          url: chrome.runtime.getURL('welcome.html')
        });
      }
    });
  }
});
