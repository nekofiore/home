<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// icons are imported
import xIcon from '../assets/icons/x.png'
import kofiIcon from '../assets/icons/kofi.png'

// icons per item:
// - `link`   : URL to open. Leave empty to have the icon link back to the current page.
// - `copyText`: set this INSTEAD of `link` to copy text to the clipboard on click, rather
//               than navigate anywhere (either/or — if `copyText` is set, `link` is ignored).
// - `shape`  : 'square' (default) or 'circle'.
// - `bgColor`: custom icon background color. Omit to use the default dark background.
// - `tooltip`: optional { header, description } shown on hover. Omit for no tooltip.
//              A "(Click to copy)" hint is added automatically when `copyText` is set.
const apps = [
  { label: 'X', icon: xIcon, link: 'https://x.com/tensofu',
    tooltip: { header: 'X', description: 'See my doodles and stuff here!' } },
  { label: 'Ko-fi', icon: kofiIcon, link: 'https://ko-fi.com/tensofu', bgColor: '#fff',
    tooltip: { header: 'Ko-fi', description: 'Support me by buying a coffee!' } },
]

const currentTime = ref('')
let clockInterval

function updateClock() {
  const now = new Date()
  currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

onMounted(() => {
  updateClock()
  clockInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(clockInterval)
  clearTimeout(toastTimer)
})

// holds just the label — the surrounding wording lives in the template so the
// label can be styled separately from the rest of the sentence
const toastLabel = ref('')
let toastTimer

async function copyToClipboard(app) {
  await navigator.clipboard.writeText(app.copyText)
  toastLabel.value = app.label
  // restart the countdown so rapid clicks keep the toast up rather than
  // letting an earlier timer dismiss it early
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastLabel.value = ''
  }, 2000)
}
</script>

<template>
  <!-- this class is for the overall bounding box -->
  <div class="bottom-menu">
    <div class="black-bar">
      <div class="accent-bar"></div>
      <div class="status">
        <span class="status-time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- icons: either a link, or a click-to-copy action (see `copyText` on each app) -->
    <div class="dock-items">
      <component
        :is="app.copyText ? 'button' : 'a'"
        v-for="app in apps"
        :key="app.label"
        class="dock-item"
        :type="app.copyText ? 'button' : undefined"
        :href="app.copyText ? undefined : (app.link || '/')"
        :target="app.copyText ? undefined : (app.link ? '_blank' : '_self')"
        :rel="app.copyText ? undefined : 'noopener noreferrer'"
        @click="app.copyText && copyToClipboard(app)"
      >
        <div
          class="dock-icon"
          :class="{ 'dock-icon--circle': app.shape === 'circle' }"
          :style="{ backgroundColor: app.bgColor || undefined }"
        >
          <img v-if="app.icon" :src="app.icon" :alt="app.label" />
        </div>
        <span class="dock-label">{{ app.label }}</span>

        <!-- only rendered for items that define a `tooltip` -->
        <span v-if="app.tooltip" class="dock-tooltip">
          <span class="tooltip-header">{{ app.tooltip.header }}</span>
          <span class="tooltip-description">{{ app.tooltip.description }}</span>
          <span v-if="app.copyText" class="tooltip-hint">(Click to copy)</span>
        </span>
      </component>
    </div>

    <Transition name="toast">
      <div v-if="toastLabel" class="copy-toast">
        <span class="toast-label">{{ toastLabel }}</span> copied to clipboard!
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.bottom-menu {
  position: absolute;
  inset: auto 0 0 0;
  margin: 0 16px;
  padding: 0 2rem 2rem;
  z-index: 2;

  height: 4rem;
  display: flex;
  align-items: center;
}

.black-bar {
  /* negative angle leans the bar like "/" — positive would lean it like "\" */
  --bar-skew: -25deg;

  width: 100%;
  height: 75%;
  min-height: 3.5rem;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 1.5rem;
  color: #fff;

  /* transparency lives in the color, not in `opacity` — an `opacity` here would
     also fade every child, so the accent bar could never be opaque */
  background-color: color-mix(in srgb, var(--bottom-bar-light) 85%, transparent);
  border-radius: 0.5rem;

  transform: skewX(var(--bar-skew));

  /* anchors the accent bar, and clips it to the bar's shape */
  position: relative;
  overflow: hidden;
}

.black-bar > .accent-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;

  width: 76%;
  background-color: var(--bottom-bar);

  /* the first skewX cancels the bar's lean, the second applies the opposite one */
  transform: translateX(-50%)
    skewX(calc(var(--bar-skew) * -1))
    skewX(calc(var(--bar-skew) * -1));
}

/* undo the skew on the contents so text/icons inside stay upright */
.black-bar > * {
  transform: skewX(calc(var(--bar-skew) * -1));
}

/* dock */
.dock-items {
  position: absolute;
  left: 2rem;
  bottom: 0.4rem;
  z-index: 1;

  display: flex;
  align-items: flex-end;
  gap: 3.25rem;

  padding: 0rem 3.5rem 3rem 3.5rem;
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;

  /* anchors this item's tooltip */
  position: relative;

  text-decoration: none;
  color: inherit;
  cursor: pointer;

  /* reset default <button> chrome so it matches the <a> version */
  border: none;
  background: none;
  font: inherit;
  padding: 0;
}

.dock-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background-color: var(--bottom-bar-light);
  overflow: hidden;
  transition: transform 0.1s ease;
}

.dock-item:active .dock-icon {
  transform: scale(0.9);
}

.dock-icon--circle {
  border-radius: 50%;
}

.dock-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dock-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
}

/* tooltip */
.dock-tooltip {
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  width: max-content;
  max-width: 14rem;
  padding: 0.6rem 0.8rem;
  text-align: left;

  background-color: var(--bottom-bar);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);

  /* hidden until hover; pointer-events off so it never blocks the icon */
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease, visibility 0.15s;
}

.dock-item:hover .dock-tooltip,
.dock-item:focus-visible .dock-tooltip {
  opacity: 1;
  visibility: visible;
}

/* lift the hovered item so its tooltip is not covered by neighbouring icons */
.dock-item:hover,
.dock-item:focus-within {
  z-index: 2;
}

.tooltip-header {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
}

.tooltip-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.tooltip-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
}

/* copy confirmation toast */
.copy-toast {
  position: fixed;
  bottom: 10rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  padding: 0.6rem 1.1rem;
  font-size: 0.9rem;
  white-space: nowrap;
  color: #fff;

  background-color: color-mix(in srgb, var(--bottom-bar) 90%, transparent);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
}

.toast-label {
  color: #7fc5f7;
  font-weight: 600;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  /* rises into place from below, now that it sits above the bar */
  transform: translateX(-50%) translateY(0.5rem);
}

.status {
  display: flex;
  align-items: center;
}

.status-time {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
}
</style>
