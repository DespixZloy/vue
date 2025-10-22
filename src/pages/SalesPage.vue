<template>
  <section>
    <h2>Sales</h2>

    <FiltersBar
      :withDateTo="true"
      v-model="filters"
      @refresh="load"
    />

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
  prev, next, load, dateFrom, dateTo, limit, search,
  numericKeys, selectedMetric, dateKey,
} = useEndpoint('sales', { withDateTo: true, defaultDays: 7, initialLimit: 50 })

const filters = reactive({ dateFrom, dateTo, limit, search })
const chartModel = reactive({ selectedMetric })
</script>

<style>
.err { color: #c00; margin: 8px 0; }
</style>