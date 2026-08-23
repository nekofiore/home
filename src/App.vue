<script setup>
import AppBackground from './components/AppBackground.vue'
import BottomBar from './components/BottomBar.vue';
import SpotifyEmbed from './components/SpotifyEmbed.vue';

// imported so Vite bundles it
import cometBg from './assets/bg/comet.webp'
</script>

<template>
  <AppBackground :images="[cometBg]" />

  <!-- spotify embed (playlist) -->
  <SpotifyEmbed uri="https://open.spotify.com/playlist/7yRrtolJ7vPzVzQ120Tiys?si=204b22bbd3cd4728" />

  <BottomBar/>

</template>
