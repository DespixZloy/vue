<template>
  <section>
    <h2>Orders</h2>

    <FiltersBar
      :withDateTo="true"
      v-model="filters"
      @refresh="load"
    >
      <!-- тут можно добавить дополнительные фильтры под конкретные поля -->
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
import { reactive, watch } from 'vue'

const {
  loading, error, filteredItems, page, hasPrev, hasNext, lastPage,
  prev, next, load, dateFrom, dateTo, limit, search,
  numericKeys, selectedMetric, dateKey,
} = useEndpoint('orders', { withDateTo: true, defaultDays: 7, initialLimit: 50 })

// Двухсторонняя привязка к FiltersBar
const filters = reactive({
  dateFrom,
  dateTo,
  limit,
  search,
})

const chartModel = reactive({ selectedMetric })

// При изменении фильтров сбрасываем страницу и перезагружаем
watch([() => filters.dateFrom.value, () => filters.dateTo.value, () => filters.limit.value], () => {
  // load() уже дергается внутри useEndpoint через watch, оставим на месте
})
</script>

<style>
.err { color: #c00; margin: 8px 0; }
</style>