<template>
  <div class="filters">
    <div class="filters__row">
      <label>
        dateFrom:
        <input type="date" v-model="model.dateFrom" />
      </label>
      <label v-if="withDateTo">
        dateTo:
        <input type="date" v-model="model.dateTo" />
      </label>
      <label>
        limit:
        <select v-model.number="model.limit">
          <option :value="20">20</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="200">200</option>
          <option :value="500">500</option>
        </select>
      </label>
      <label>
        Поиск:
        <input type="text" placeholder="по строковым полям" v-model="model.search" />
      </label>
      <slot />
      <button @click="$emit('refresh')">Обновить</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Object, required: true },
  withDateTo: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue', 'refresh'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<style>
.filters { display:flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.filters__row { display:flex; flex-wrap: wrap; gap: 12px; align-items:center; }
.filters input, .filters select { padding: 4px 8px; }
</style>