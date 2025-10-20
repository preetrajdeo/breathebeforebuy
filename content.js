/**
 * Breathe Before You Buy - Content Script
 * Detects final checkout pages and triggers breathing intervention
 */

// Final checkout page detection patterns
const CHECKOUT_PATTERNS = {
  // Button text patterns - ONLY final purchase buttons
  // These indicate we're on the FINAL checkout page
  buttonPatterns: [
    /place\s+your\s+order/i,         // Amazon's "Place your order"
    /place\s*order/i,                // Generic "Place order"
    /complete\s*purchase/i,
    /buy\s*now/i,
    /confirm\s*order/i,
    /pay\s*now/i,
    /submit\s*order/i,
    /complete\s*order/i,
    /finalize\s*order/i,
    /confirm\s*and\s*pay/i,
    /order\s*with\s*obligation/i     // Amazon's alternative text
  ],

  // URL patterns for final checkout pages
  urlPatterns: [
    /checkout.*review/i,
    /checkout.*confirm/i,
    /checkout.*place.*order/i,
    /order.*review/i,
    /review.*order/i,
    /place.*order/i
  ]
};

let breathingOverlayActive = false;
let hasTriggeredOnThisPage = false; // Prevent multiple triggers on same page
let settings = {
  enabled: true,
  breathCount: 3,
  inhaleSeconds: 5,
  exhaleSeconds: 5,
  delaySeconds: 3  // Delay before showing overlay
};

// Load settings from storage
chrome.storage.local.get(['breatheSettings'], (result) => {
  if (result.breatheSettings) {
    settings = { ...settings, ...result.breatheSettings };
  }
});

/**
 * Get a unique identifier for the current cart/order
 * This helps track if we've already shown overlay for THIS specific checkout
 */
function getCartIdentifier() {
  const url = window.location.href;

  // Extract order/cart identifiers from URL
  // Amazon examples:
  // - /gp/buy/spc/handlers/display.html?hasWorkingJavascript=1
  // - /checkout/spc/place-order?...
  // - /gp/cart/view.html?ref_=nav_cart

  // Try to extract session/cart ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session-id') || urlParams.get('sessionId');

  // For Amazon, the pathname often changes between steps but parameters might have IDs
  // We'll use a combination of path and any session identifier
  const pathBase = window.location.pathname.split('/').slice(0, 4).join('/'); // e.g., /gp/buy/spc

  // Create identifier from path + session (if available)
  const identifier = sessionId ? `${pathBase}-${sessionId}` : pathBase;

  return identifier;
}

/**
 * Check if current page is a FINAL checkout page
 * Returns true if we detect "Place Order" type buttons on the page
 */
function isFinalCheckoutPage() {
  const url = window.location.href;
  const pathname = window.location.pathname;

  // Check URL patterns first (for efficiency)
  for (const pattern of CHECKOUT_PATTERNS.urlPatterns) {
    if (pattern.test(url) || pattern.test(pathname)) {
      console.log('Breathe Before You Buy: Final checkout URL detected');
      return true;
    }
  }

  // Check if page has final purchase buttons
  const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"]');

  console.log('Breathe Before You Buy: Found', buttons.length, 'buttons on page');

  // Debug: Log all buttons found
  const buttonTexts = [];
  for (const button of buttons) {
    const text = button.textContent || button.value || button.getAttribute('aria-label') || '';
    const cleanText = text.trim().substring(0, 100); // Limit to 100 chars
    if (cleanText) {
      buttonTexts.push(cleanText);
    }

    for (const pattern of CHECKOUT_PATTERNS.buttonPatterns) {
      if (pattern.test(text)) {
        console.log('Breathe Before You Buy: Final checkout page detected (found button:', text.trim() + ')');
        return true;
      }
    }
  }

  // Log first 10 button texts for debugging
  console.log('Breathe Before You Buy: Sample buttons:', buttonTexts.slice(0, 10));

  return false;
}

/**
 * Disable purchase buttons temporarily while breathing overlay is active
 */
function disablePurchaseButtons() {
  const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"]');

  buttons.forEach(button => {
    const text = button.textContent || button.value || button.getAttribute('aria-label') || '';

    for (const pattern of CHECKOUT_PATTERNS.buttonPatterns) {
      if (pattern.test(text)) {
        console.log('Breathe Before You Buy: Disabling purchase button:', text.trim());
        button.dataset.breatheOriginalDisabled = button.disabled;
        button.disabled = true;
        button.style.opacity = '0.5';
        button.style.cursor = 'not-allowed';
      }
    }
  });
}

/**
 * Re-enable purchase buttons after breathing exercise
 */
function enablePurchaseButtons() {
  const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a[role="button"]');

  buttons.forEach(button => {
    if (button.dataset.breatheOriginalDisabled !== undefined) {
      button.disabled = button.dataset.breatheOriginalDisabled === 'true';
      delete button.dataset.breatheOriginalDisabled;
      button.style.opacity = '';
      button.style.cursor = '';
    }
  });
}

/**
 * Create and show the breathing overlay
 */
function showBreathingOverlay() {
  if (breathingOverlayActive || !settings.enabled || hasTriggeredOnThisPage) return;

  // Check if we've already triggered for this specific cart/order
  const cartId = getCartIdentifier();
  const triggeredCartId = sessionStorage.getItem('breathe-triggered-cart');

  if (triggeredCartId === cartId) {
    console.log('Breathe Before You Buy: Already triggered for this cart:', cartId);
    return;
  }

  console.log('Breathe Before You Buy: New cart detected, showing overlay for:', cartId);

  breathingOverlayActive = true;
  hasTriggeredOnThisPage = true;

  // Store the cart ID to prevent re-triggering for same cart
  sessionStorage.setItem('breathe-triggered-cart', cartId);

  // Disable purchase buttons while overlay is active
  disablePurchaseButtons();

  // Create overlay container
  const overlay = document.createElement('div');
  overlay.id = 'breathe-before-buy-overlay';
  overlay.className = 'breathe-overlay';

  // Create content
  overlay.innerHTML = `
    <a href="#" class="breathe-skip" id="breathe-skip-btn">Skip</a>

    <div class="breathe-settings-panel">
      <h3 class="settings-title">Settings</h3>

      <div class="setting-group">
        <label class="setting-label">
          <span>Count of Breaths</span>
          <span class="setting-value" id="breath-count-value">${settings.breathCount}</span>
        </label>
        <input type="range" id="breath-count-slider" min="3" max="10" value="${settings.breathCount}" class="setting-slider">
      </div>

      <div class="setting-group">
        <label class="setting-label">
          <span>Inhale (sec)</span>
          <span class="setting-value" id="inhale-value">${settings.inhaleSeconds}</span>
        </label>
        <input type="range" id="inhale-slider" min="4" max="8" value="${settings.inhaleSeconds}" class="setting-slider">
      </div>

      <div class="setting-group">
        <label class="setting-label">
          <span>Exhale (sec)</span>
          <span class="setting-value" id="exhale-value">${settings.exhaleSeconds}</span>
        </label>
        <input type="range" id="exhale-slider" min="4" max="8" value="${settings.exhaleSeconds}" class="setting-slider">
      </div>
    </div>

    <div class="breathe-content">
      <h1 class="breathe-title">Take a Moment to Breathe</h1>
      <p class="breathe-subtitle">Before completing your purchase, let's pause for ${settings.breathCount} deep breaths</p>

      <div class="breathe-instruction-top">Breathe In</div>

      <div class="breathe-circle-container">
        <svg class="breathe-circle" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" />
        </svg>
        <div class="breathe-emoji">
          <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
            <!-- Background circle -->
            <circle cx="60" cy="60" r="55" fill="#f5d5c8" opacity="0.6"/>

            <!-- Body -->
            <ellipse cx="60" cy="75" rx="25" ry="20" fill="#a8c9a5"/>

            <!-- Upper body/chest -->
            <path d="M 45 65 Q 60 55 75 65 L 75 75 Q 60 70 45 75 Z" fill="#d4a574"/>

            <!-- Head -->
            <circle cx="60" cy="45" r="18" fill="#fde5d8"/>

            <!-- Hair buns -->
            <circle cx="50" cy="32" r="8" fill="#2c2c2c"/>
            <circle cx="70" cy="32" r="8" fill="#2c2c2c"/>
            <ellipse cx="60" cy="28" rx="12" ry="8" fill="#2c2c2c"/>

            <!-- Crown -->
            <path d="M 55 26 L 60 22 L 65 26" stroke="#d4a574" stroke-width="2" fill="none"/>

            <!-- Closed eyes -->
            <path d="M 52 43 Q 54 45 56 43" stroke="#2c2c2c" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            <path d="M 64 43 Q 66 45 68 43" stroke="#2c2c2c" stroke-width="1.5" fill="none" stroke-linecap="round"/>

            <!-- Gentle smile -->
            <path d="M 54 50 Q 60 52 66 50" stroke="#ff9999" stroke-width="1" fill="none" stroke-linecap="round" opacity="0.6"/>

            <!-- Bindi -->
            <circle cx="60" cy="40" r="1.5" fill="#c9574a"/>

            <!-- Meditation hands -->
            <path d="M 40 68 Q 50 65 60 68" fill="#fde5d8" opacity="0.9"/>
            <path d="M 60 68 Q 70 65 80 68" fill="#fde5d8" opacity="0.9"/>

            <!-- Sitting position -->
            <ellipse cx="45" cy="88" rx="15" ry="8" fill="#a8c9a5"/>
            <ellipse cx="75" cy="88" rx="15" ry="8" fill="#a8c9a5"/>
          </svg>
        </div>
        <div class="breathe-counter">${settings.breathCount} breaths remaining</div>
      </div>

      <div class="breathe-progress">
        <div class="breathe-progress-bar"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Start breathing animation
  startBreathingAnimation();

  // Add skip button handler
  document.getElementById('breathe-skip-btn').addEventListener('click', (e) => {
    e.preventDefault();
    removeBreathingOverlay();
  });

  // Add settings sliders handlers
  const breathCountSlider = document.getElementById('breath-count-slider');
  const inhaleSlider = document.getElementById('inhale-slider');
  const exhaleSlider = document.getElementById('exhale-slider');

  breathCountSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    settings.breathCount = value;
    document.getElementById('breath-count-value').textContent = value;
    chrome.storage.local.set({ breatheSettings: settings });
  });

  inhaleSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    settings.inhaleSeconds = value;
    document.getElementById('inhale-value').textContent = value;
    chrome.storage.local.set({ breatheSettings: settings });
  });

  exhaleSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    settings.exhaleSeconds = value;
    document.getElementById('exhale-value').textContent = value;
    chrome.storage.local.set({ breatheSettings: settings });
  });
}

/**
 * Start the breathing animation cycle
 */
function startBreathingAnimation() {
  const circle = document.querySelector('.breathe-circle circle');
  const instruction = document.querySelector('.breathe-instruction-top');
  const counter = document.querySelector('.breathe-counter');
  const progressBar = document.querySelector('.breathe-progress-bar');

  let currentBreath = 0;
  const totalBreaths = settings.breathCount;
  const cycleDuration = (settings.inhaleSeconds + settings.exhaleSeconds) * 1000;

  function breathCycle() {
    if (currentBreath >= totalBreaths) {
      // Breathing complete
      showContinueButton();
      return;
    }

    currentBreath++;
    counter.textContent = `${totalBreaths - currentBreath + 1} breath${totalBreaths - currentBreath + 1 > 1 ? 's' : ''} remaining`;

    // Update progress bar
    const progress = (currentBreath / totalBreaths) * 100;
    progressBar.style.width = progress + '%';

    // Inhale phase
    instruction.textContent = 'Breathe In';
    instruction.classList.add('inhale');

    // Animate circle expansion with correct timing
    circle.style.animation = `expand ${settings.inhaleSeconds}s ease-in-out`;
    circle.classList.add('expand');

    setTimeout(() => {
      // Exhale phase
      instruction.textContent = 'Breathe Out';
      instruction.classList.remove('inhale');
      instruction.classList.add('exhale');
      circle.classList.remove('expand');

      // Animate circle contraction with correct timing
      circle.style.animation = `contract ${settings.exhaleSeconds}s ease-in-out`;
      circle.classList.add('contract');

      setTimeout(() => {
        // Reset for next cycle
        circle.classList.remove('contract');
        instruction.classList.remove('exhale');
        circle.style.animation = '';

        // Start next breath
        setTimeout(breathCycle, 500);
      }, settings.exhaleSeconds * 1000);
    }, settings.inhaleSeconds * 1000);
  }

  // Start first breath
  breathCycle();
}

/**
 * Show continue button after breathing is complete
 */
function showContinueButton() {
  const overlay = document.getElementById('breathe-before-buy-overlay');
  if (!overlay) return;

  const content = overlay.querySelector('.breathe-content');
  content.innerHTML = `
    <h1 class="breathe-title">✓ Great Job!</h1>
    <p class="breathe-subtitle">You've taken a moment to breathe. How do you feel about this purchase now?</p>

    <div class="breathe-buttons">
      <button class="breathe-continue" id="breathe-continue-btn">Continue to Checkout</button>
      <button class="breathe-cancel" id="breathe-cancel-btn">I'll think about it</button>
    </div>
  `;

  document.getElementById('breathe-continue-btn').addEventListener('click', () => {
    removeBreathingOverlay();
  });

  document.getElementById('breathe-cancel-btn').addEventListener('click', () => {
    removeBreathingOverlay();
    // Optionally: go back or close tab
    window.history.back();
  });
}

/**
 * Remove the breathing overlay
 */
function removeBreathingOverlay() {
  const overlay = document.getElementById('breathe-before-buy-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
      breathingOverlayActive = false;
      // Re-enable purchase buttons
      enablePurchaseButtons();
    }, 300);
  }
}

/**
 * Initialize extension - automatically trigger on final checkout pages
 */
function init() {
  console.log('Breathe Before You Buy: Checking if this is a final checkout page...');

  // For Amazon and other SPAs, check multiple times as buttons load dynamically
  let checkAttempts = 0;
  const maxAttempts = 5;

  function checkForCheckout() {
    checkAttempts++;
    console.log(`Breathe Before You Buy: Check attempt ${checkAttempts}/${maxAttempts}`);

    if (isFinalCheckoutPage() && !hasTriggeredOnThisPage) {
      console.log('Breathe Before You Buy: Final checkout detected! Triggering in', settings.delaySeconds, 'seconds...');

      // Wait configured delay before showing overlay
      setTimeout(() => {
        if (!hasTriggeredOnThisPage) {
          console.log('Breathe Before You Buy: Showing breathing overlay...');
          showBreathingOverlay();
        }
      }, settings.delaySeconds * 1000);
    } else if (checkAttempts < maxAttempts) {
      // Try again in 1 second (buttons might still be loading)
      console.log('Breathe Before You Buy: Not detected yet, will check again...');
      setTimeout(checkForCheckout, 1000);
    } else {
      console.log('Breathe Before You Buy: Not a final checkout page after', maxAttempts, 'attempts, standing by...');
    }
  }

  // Start checking after 1 second
  setTimeout(checkForCheckout, 1000);

  // Also watch for page changes (for SPAs)
  const observer = new MutationObserver(() => {
    if (isFinalCheckoutPage() && !hasTriggeredOnThisPage && !breathingOverlayActive) {
      console.log('Breathe Before You Buy: Final checkout detected after page change! Triggering in', settings.delaySeconds, 'seconds...');

      setTimeout(() => {
        if (!hasTriggeredOnThisPage) {
          showBreathingOverlay();
        }
      }, settings.delaySeconds * 1000);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
