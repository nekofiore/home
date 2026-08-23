<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: { type: Array, required: true }
})

const currentIndex = ref(0)
const direction = ref('next')

const currentImage = computed(() => props.images[currentIndex.value])
const transitionName = computed(() => `bg-slide-${direction.value}`)

function next() {
  direction.value = 'next'
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev() {
  direction.value = 'prev'
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}
</script>

<template>
  <Transition :name="transitionName">
    <div
      class="app-background"
      :key="currentImage"
      :style="{ backgroundImage: `url(${currentImage})` }"
    />
  </Transition>

  <button class="bg-arrow bg-arrow-left" type="button" aria-label="Previous background" @click="prev">
    ‹
  </button>
  <button class="bg-arrow bg-arrow-right" type="button" aria-label="Next background" @click="next">
    ›
  </button>
</template>

<style scoped>
.app-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-size: cover;
  background-position: center;
  background-color: var(--bg);
}

.bg-slide-next-enter-active,
.bg-slide-next-leave-active,
.bg-slide-prev-enter-active,
.bg-slide-prev-leave-active {
  transition: transform 0.6s ease;
}

/* right arrow (next): current slides out left, new enters from the right */
.bg-slide-next-enter-from {
  transform: translateX(100%);
}
.bg-slide-next-leave-to {
  transform: translateX(-100%);
}

/* left arrow (prev): current slides out right, new enters from the left */
.bg-slide-prev-enter-from {
  transform: translateX(-100%);
}
.bg-slide-prev-leave-to {
  transform: translateX(100%);
}

.bg-arrow {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: var(--accent-bg);
  color: var(--text-h);
  font-size: 24px;
  line-height: 1;

  /* soft translucent shadow so the chevron stays legible over light backgrounds */
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.55),
    0 0 8px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.bg-arrow:hover {
  background: var(--accent-border);
}

.bg-arrow-left {
  left: 16px;
}
.bg-arrow-right {
  right: 16px;
}
</style>
