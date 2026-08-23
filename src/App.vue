<script setup>
import AppBackground from './components/AppBackground.vue'
import BottomBar from './components/BottomBar.vue';
import SpotifyEmbed from './components/SpotifyEmbed.vue';
</script>

<template>
  <AppBackground :images="[
      '/src/assets/bg/comet.png',
    ]" />

  <!-- spotify embed (playlist) -->
  <SpotifyEmbed uri="https://open.spotify.com/playlist/7yRrtolJ7vPzVzQ120Tiys?si=204b22bbd3cd4728" />

  <BottomBar/>

</template>
