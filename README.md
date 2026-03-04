# BreatheBeforeYouBuy — A Mindful Pause at the Point of Purchase

> The most expensive second in e-commerce is the one before you click
> "Place Order." This extension makes you use it.

## The Problem

E-commerce is engineered for speed. One-click checkout, saved payment methods,
urgency timers — every design decision reduces friction between intent and
purchase. For impulse buyers, that friction removal is the problem.

Budgeting apps address spending after the fact. BreatheBeforeYouBuy intervenes
at the highest-leverage moment: the final checkout button.

## The Solution

A Chrome extension that detects final purchase buttons (not "Add to Cart" or
"Proceed to Checkout" — the actual "Place Order" moment) and triggers a 30-second
breathing exercise before re-enabling the button.

After breathing, users are asked: "Do you still want this?" That pause is the
product.

## Product Decisions & Tradeoffs

**Auto-trigger vs click-trigger** — I chose to trigger automatically on page load
rather than on button click. The behavioral reasoning: by the time your finger is
on "Buy Now," the decision is already made psychologically. Triggering earlier
creates actual reflection time. Tradeoff: more intrusive UX, higher chance of
user disabling the extension.

**3-second delay before overlay appears** — Gives users time to review the page
before the intervention. Without this, the overlay felt like a bug. This was
discovered in testing, not upfront — a lesson in not shipping without using the
product yourself.

**Disable buttons during breathing** — Users could dismiss the overlay and bypass
the exercise if buttons stayed enabled. Disabling them is the only way to enforce
the pause. It's paternalistic by design — which is the point.

**No purchase tracking by default** — Analytics would make this more compelling
as a product, but I prioritized user trust. The extension collects nothing by
default.

## Traction & What the Data Is Telling Me

**158 installs** since launching in late 2025. But the uninstall rate is high.

My leading hypothesis: the trigger is firing too broadly. The extension is
designed to intercept final checkout pages, but detection heuristics may be
matching earlier in the purchase funnel — product pages, cart pages — where the
intervention feels disruptive rather than helpful. Getting interrupted mid-browse
is annoying. Getting interrupted at "Place Order" is the point.

This is a classic precision problem: the right intervention at the wrong moment
destroys the experience. The data is telling me I need to tighten the trigger,
not the concept.

## Next Steps

Three directions I'm evaluating to improve retention:

**1. Replace breathing with a game or video**
The breathing exercise is the right behavioral mechanic (force a pause, create
space for reflection) but may not be the right format. Alternatives worth testing:
- A short micro-game the user has to complete before the button re-enables —
  more entertaining, same forced pause
- A funny or trending TikTok/YouTube clip that plays automatically — lightens
  the mood, disrupts the dopamine loop differently, and could become a shareable
  feature in itself

**2. User-controlled website allowlist**
Currently the extension triggers across all e-commerce sites. A better model:
let users choose which sites it activates on. Someone might want the intervention
on Amazon (high-impulse) but not on their regular grocery delivery. Giving users
control over scope reduces the "always on" annoyance while keeping the value for
the sites that matter most to them.

**3. Smarter trigger detection**
Before changing the intervention format, tighten the detection. The extension
should only fire when a "Place Order" / "Confirm and Pay" button is the primary
CTA — not on product listing pages or cart pages. This alone may significantly
reduce the perceived intrusiveness.

## Status

Published · 158 installs · Chrome Web Store · Launched late 2025

**Stack**: Vanilla JS · Chrome MV3 · MutationObserver (SPA navigation)
