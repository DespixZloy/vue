<template>
  <div class="paginator">
    <button :disabled="!hasPrev" @click="$emit('prev')">Prev</button>
    <span>Page {{ page }}</span>
    <button :disabled="!hasNext" @click="$emit('next')">Next</button>
    <span v-if="lastPage">/ {{ lastPage }}</span>
  </div>
</template>

<script setup>
defineProps({
  page: { type: Number, required: true },
  hasPrev: { type: Boolean, required: true },
  hasNext: { type: Boolean, required: true },
  lastPage: { type: Number, default: null },
})
defineEmits(['prev', 'next'])
</script>

<style>
.paginator { display:flex; gap: 8px; align-items:center; margin-top: 12px; }
</style>