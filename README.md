# 🧘‍♂️ Breathe Before Buy

A Chrome extension that helps you make mindful purchasing decisions by triggering a breathing exercise before completing online checkouts.

## 🎯 What It Does

When you land on a final checkout page, this extension:
1. **Detects final checkout pages** - Monitors for "Place Order" / "Buy Now" buttons
2. **Waits 3-5 seconds** - Gives you time to review the page
3. **Automatically triggers** - Shows full-screen breathing overlay BEFORE you can click
4. **Guides breathing** - Beautiful animated breathing circle with progress tracking
5. **Disables buttons** - Purchase buttons are disabled during the breathing exercise
6. **Makes you reflect** - After breathing, asks if you still want to proceed

This automatic pause helps reduce impulse buying and saves you money!

---

## 🚀 How to Test/Install

### 1. Load Extension in Chrome

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer Mode** (toggle in top right)
3. **Click "Load unpacked"**
4. **Select the folder**: `/Users/preetrajdeo/Desktop/BreatheBeforeYouBuy`
5. The extension icon should appear in your toolbar

### 2. Test on Shopping Sites

The extension triggers when you click **final purchase buttons** with text like:
- "Place Order", "Buy Now", "Complete Purchase", "Confirm Order", "Pay Now"
- **Does NOT trigger** on "Proceed to Checkout" or "Add to Cart" buttons

**Test Sites:**
- **Amazon**: Go to cart → Proceed to checkout → Click "Place your order" (final button)
- **eBay**: Add item → Checkout → Click "Confirm and pay"
- **Etsy**: Add to cart → Purchase → Click final "Place order" button
- **Any Shopify store**: Add to cart → Checkout → Click "Complete order"

### 3. Trigger the Breathing Overlay

1. Navigate to a final checkout page (with "Place Order" button visible)
2. Wait 3-5 seconds after the page loads
3. The breathing overlay should automatically appear
4. Purchase buttons will be disabled during breathing
5. Follow the breathing animation for 3 cycles
6. Choose to continue or cancel the purchase

---

## ⚙️ Settings

Click the extension icon in Chrome toolbar to access settings:

- **Enable/Disable** - Turn breathing intervention on/off
- **Number of Breaths** - Choose 3-10 breath cycles
- **Inhale Duration** - 3-10 seconds
- **Exhale Duration** - 3-10 seconds
- **Purchase Stats** - See how many times you've paused

---

## 📁 Project Structure

```
BreatheBeforeYouBuy/
├── manifest.json         # Extension configuration
├── content.js           # Checkout detection & overlay injection
├── breathing.css        # Beautiful breathing animation styles
├── popup.html           # Settings popup UI
├── popup.js             # Settings logic
├── icon-128.png         # Extension icon
└── README.md            # This file
```

---

## 🎨 How It Works

### Automatic Triggering

The extension automatically detects final checkout pages and triggers breathing:

1. **Page Detection**
   - Scans page for final purchase buttons: "Place Order", "Buy Now", "Complete Purchase"
   - **Does NOT trigger** on preliminary "Proceed to Checkout" pages
   - Uses both URL patterns and button text matching

2. **Automatic Trigger Flow**
   - Waits 1 second for page to fully load
   - Checks if final purchase buttons are present
   - Waits configured delay (3-5 seconds) to give you time to review
   - Automatically shows breathing overlay BEFORE you can click
   - Disables purchase buttons during breathing exercise
   - Re-enables buttons after completion

3. **Smart Prevention**
   - Only triggers once per page load
   - Respects user's enable/disable setting
   - Works with single-page applications (SPAs)

### Breathing Animation

- **Expanding Circle**: Inhale phase (5 seconds default)
- **Contracting Circle**: Exhale phase (5 seconds default)
- **Smooth Transitions**: CSS animations with easing
- **Progress Bar**: Shows how many breaths remaining
- **Completion Screen**: Reflection question before continuing

---

## 🧪 Testing Checklist

- [ ] Extension loads without errors
- [ ] Icon appears in Chrome toolbar
- [ ] Settings popup opens and saves changes
- [ ] Detects Amazon checkout page
- [ ] Intercepts "Place Order" button click
- [ ] Breathing overlay appears with animation
- [ ] Circle expands/contracts smoothly
- [ ] Counter counts down breaths
- [ ] Progress bar fills up
- [ ] "Continue" button works after breathing
- [ ] "Skip" button works (removes overlay)
- [ ] "I'll Think About It" goes back

---

## 🐛 Known Issues / TODO

- [ ] May not work on all checkout pages (detection needs refinement)
- [ ] Some sites use custom button elements (need more patterns)
- [ ] No analytics yet (track how many purchases prevented)
- [ ] Could add "reflection questions" after breathing
- [ ] Could add spending stats/tracking
- [ ] Icon is placeholder (need custom breathing icon)

---

## 🎯 Next Steps

1. **Test on more sites** - Amazon, eBay, Etsy, Shopify stores
2. **Refine detection** - Add more URL/button patterns
3. **Add analytics** - Track effectiveness
4. **Improve UX** - Better animations, reflection questions
5. **Chrome Web Store** - Polish and submit

---

## 💡 Ideas for Future

- **Cooling-off period**: Force 24-hour wait for big purchases
- **Price threshold**: Only trigger for purchases over $X
- **Spending analytics**: Track monthly spending, show trends
- **Reflection questions**: "Do you really need this?", "Can you afford this?"
- **Budget integration**: Connect with Mint, YNAB
- **Social features**: Share savings with friends
- **Custom breathing patterns**: Box breathing, 4-7-8, etc.

---

## 🙏 Credits

Made with ❤️ for mindful spending

**Inspiration:**
- Behavioral economics research on impulse buying
- Mindfulness and breathing exercises
- Financial wellness movement

---

## 📝 License

MIT License - Feel free to use, modify, and distribute!
