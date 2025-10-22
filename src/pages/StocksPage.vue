<template>
  <section>
    <h2>Stocks</h2>

    <FiltersBar
      :withDateTo="false"
      v-model="filters"
      @refresh="load"
    >
      <small>Stocks выгружается только за текущий день (dateFrom = сегодня)</small>
    </FiltersBar>

    <div v-if="error" class="err">Ошибка: {{ error }}</div>
    <div v-if="loading">Загрузка...</div>

    <LineChart
      v-if="!loading"
      :items="filteredItems"
      :dateKey="dateKey"
      :numericKeys="numericKeys"
      v-model="chartModel"
    />

    <DataTable :rows="filteredItems" />
    <Paginator
      :page="page"
      :hasPrev="hasPrev"
      :hasNext="hasNext"
      :lastPage="lastPage"
      @prev="prev"
      @next="next"
    />
  </section>
</template>

<script setup>
import FiltersBar from '../components/FiltersBar.vue'
import DataTable from '../components/DataTable.vue'
import LineChart from '../components/LineChart.vue'
import Paginator from '../components/Paginator.vue'
import { useEndpoint } from '../composables/useEndpoint'
import { reactive } from 'vue'

const {
  loading, error, filteredItems, page, hasPrev, hasNext, lastPage,
  prev, next, load, dateFrom, limit, search,
  numericKeys, selectedMetric, dateKey,
} = useEndpoint('stocks', { withDateTo: false, defaultDays: 0, initialLimit: 50 })

const filters = reactive({ dateFrom, limit, search })
const chartModel = reactive({ selectedMetric })
</script>

<style>
.err { color: #c00; margin: 8px 0; }
</style>