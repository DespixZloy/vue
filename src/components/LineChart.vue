<template>
  <div>
    <div class="chart-controls" v-if="numericKeys?.length">
      <label>
        Поле для графика:
        <select v-model="model.selectedMetric">
          <option v-for="k in numericKeys" :key="k" :value="k">{{ k }}</option>
        </select>
      </label>
    </div>
    <Bar v-if="chartData" :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,
} from 'chart.js'
import { buildLineSeries } from '../composables/useChartData'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  items: { type: Array, required: true },
  dateKey: { type: String, default: null },
  numericKeys: { type: Array, default: () => [] },
  modelValue: {
    type: Object,
    default: () => ({ selectedMetric: null }),
  },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const chartData = computed(() => {
  if (!model.value.selectedMetric) return null
  const { labels, data } = buildLineSeries(props.items, props.dateKey, model.value.selectedMetric)
  return {
    labels,
    datasets: [
      {
        label: model.value.selectedMetric,
        backgroundColor: 'rgba(99, 132, 255, 0.5)',
        borderColor: 'rgba(99, 132, 255, 1)',
        data,
      },
    ],
  }
})

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: 'График по выбранному полю (агрегация по дням)' },
  },
}
</script>

<style>
.chart-controls { margin-bottom: 8px; }
</style>