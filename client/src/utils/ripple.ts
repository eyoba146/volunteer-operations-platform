/**
 * Material-style ripple effect utility for VTS.
 * 
 * Expands a circle from the exact click/tap point (or from the center on keyboard activation)
 * and fades out over 550ms.
 * - Filled/dark buttons: white at 30% opacity.
 * - Outlined/light/text/icon buttons: text colour at 15% opacity.
 * - Respects prefers-reduced-motion.
 * - Never delays or prevents clicks, navigation, or form submissions.
 */

function parseRgb(colorStr: string): [number, number, number] {
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return [17, 17, 17];
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}

function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function triggerRipple(
  target: HTMLElement,
  clientX?: number,
  clientY?: number,
  isKeyboard = false
) {
  if (typeof window === 'undefined') return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Do not trigger on disabled elements
  if (
    target.hasAttribute('disabled') ||
    target.getAttribute('aria-disabled') === 'true' ||
    target.classList.contains('disabled')
  ) {
    return;
  }

  const rect = target.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  // Determine click coordinates relative to target
  let x = rect.width / 2;
  let y = rect.height / 2;

  if (!isKeyboard && clientX !== undefined && clientY !== undefined) {
    x = clientX - rect.left;
    y = clientY - rect.top;
  }

  // Ensure target has relative positioning and hidden overflow for clipping
  const computedStyle = window.getComputedStyle(target);
  if (computedStyle.position === 'static') {
    target.style.position = 'relative';
  }
  if (computedStyle.overflow !== 'hidden') {
    target.style.overflow = 'hidden';
  }

  // Determine ripple color based on target background luminance
  let bgLuminance = 1; // default to light background
  let cur: HTMLElement | null = target;
  while (cur && cur !== document.documentElement) {
    const bg = window.getComputedStyle(cur).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      const rgb = parseRgb(bg);
      bgLuminance = getLuminance(rgb[0], rgb[1], rgb[2]);
      break;
    }
    cur = cur.parentElement;
  }

  // Check if target is dark or filled
  let rippleColor = 'rgba(17, 17, 17, 0.15)';
  if (bgLuminance < 0.45) {
    // Dark or saturated filled button -> white ripple at 30%
    rippleColor = 'rgba(255, 255, 255, 0.3)';
  } else {
    // Outlined / light / icon button -> text color at 15%
    const textColor = computedStyle.color || 'rgb(17, 17, 17)';
    const textRgb = parseRgb(textColor);
    rippleColor = `rgba(${textRgb[0]}, ${textRgb[1]}, ${textRgb[2]}, 0.15)`;
  }

  // Size circle large enough to cover the furthest corner from click point
  const maxDim = Math.max(rect.width, rect.height);
  const size = maxDim * 2.2;

  const ripple = document.createElement('span');
  ripple.className = 'vts-ripple-wave';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x - size / 2}px`;
  ripple.style.top = `${y - size / 2}px`;
  ripple.style.backgroundColor = rippleColor;

  target.appendChild(ripple);

  // Clean up wave when animation completes
  const cleanup = () => {
    if (ripple.parentElement) {
      ripple.remove();
    }
  };

  ripple.addEventListener('animationend', cleanup, { once: true });
  setTimeout(cleanup, 600);
}

/**
 * Initializes global delegated event listeners so every button and button-like
 * element automatically ripples on pointerdown and Enter/Space keydown.
 */
export function initGlobalRipple() {
  if (typeof document === 'undefined') return;

  const selector =
    'button, a, [role="button"], [role="tab"], input[type="submit"], input[type="button"], .vts-ripple-target, .ticket-pass-clickable';

  let lastPointerTarget: HTMLElement | null = null;
  let lastPointerTime = 0;

  // Pointer down (mouse, pen, touch)
  document.addEventListener(
    'pointerdown',
    (e: PointerEvent) => {
      // Primary click only (left mouse or touch)
      if (e.button !== 0) return;

      const target = (e.target as HTMLElement)?.closest(selector) as HTMLElement | null;
      if (!target) return;

      lastPointerTarget = target;
      lastPointerTime = Date.now();
      triggerRipple(target, e.clientX, e.clientY, false);
    },
    { passive: true, capture: true }
  );

  // Click fallback (ensures ripple triggers on synthetic clicks or click-based automation)
  document.addEventListener(
    'click',
    (e: MouseEvent) => {
      if (e.button !== 0) return;

      const target = (e.target as HTMLElement)?.closest(selector) as HTMLElement | null;
      if (!target) return;

      // Skip if pointerdown already triggered within last 400ms on this element
      if (lastPointerTarget === target && Date.now() - lastPointerTime < 400) {
        return;
      }

      triggerRipple(target, e.clientX, e.clientY, false);
    },
    { passive: true, capture: true }
  );

  // Keyboard activation (Enter or Space)
  document.addEventListener(
    'keydown',
    (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.repeat) return;

      const target = (e.target as HTMLElement)?.closest(selector) as HTMLElement | null;
      if (!target) return;

      // Avoid double trigger on text inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const type = (target as HTMLInputElement).type;
        if (type !== 'button' && type !== 'submit') return;
      }

      triggerRipple(target, undefined, undefined, true);
    },
    { passive: true, capture: true }
  );
}
