<script setup>
import { computed } from 'vue'

const props = defineProps({
  uri: { type: String, required: true },
  tracklist: { type: Boolean, default: true }, // big (false) or smol (true)
})

const embedUrl = computed(() => {
  const match = props.uri.match(/spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)/)
    || props.uri.match(/spotify:(track|album|playlist|artist|episode|show):([a-zA-Z0-9]+)/)
  if (!match) return ''
  const [, type, id] = match
  // theme=0 asks Spotify for its neutral dark player instead of the background
  // color it normally extracts from the cover art
  return `https://open.spotify.com/embed/${type}/${id}?theme=0`
})
</script>

<template>
  <div class="spotify-embed" :class="{ 'spotify-embed--card': !tracklist }">
    <iframe
      v-if="embedUrl"
      :src="embedUrl"
      frameborder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  </div>
</template>

<style scoped>
.spotify-embed {
  --embed-scale: 1;
  --embed-w: 540px;
  --embed-h: 152px;

  position: fixed;
  left: 4rem;
  bottom: 10rem;
  z-index: 2;

  width: calc(var(--embed-w) * var(--embed-scale));
  height: calc(var(--embed-h) * var(--embed-scale));
  max-width: calc(100% - 2rem);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);

  /* with theme=0 the iframe paints no background of its own, so this shows
     through as the player's background */
  background: rgba(0, 0, 0, 0.5);

  opacity: 0.9;
}

/* stacked layout: art + title + "Save on Spotify" on top, tracks below.
   352px is the minimum height that triggers it */
.spotify-embed--card {
  --embed-w: 420px;
  --embed-h: 352px;
}

.spotify-embed iframe {
  display: block;
  border: none;

  width: var(--embed-w);
  height: var(--embed-h);
  transform: scale(var(--embed-scale));
  transform-origin: top left;

  /* keeps any uncovered canvas dark instead of defaulting to white */
  color-scheme: dark;
}
</style>
