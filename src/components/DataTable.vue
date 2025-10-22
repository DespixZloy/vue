<template>
  <div class="table-wrap">
    <table class="tbl" v-if="rows && rows.length">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, idx) in rows" :key="idx">
          <td v-for="col in columns" :key="col">
            {{ formatCell(r[col]) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty">Нет данных</div>
  </div>
</template>

<script setup>
const props = defineProps({
  rows: { type: Array, default: () => [] },
  maxCols: { type: Number, default: 12 },
})
const columns = computed(() => {
  const first = props.rows?.[0]
  if (!first) return []
  const keys = Object.keys(first)
  return keys.slice(0, props.maxCols)
})
function formatCell(v) {
  if (typeof v === 'object' && v !== null) {
    try { return JSON.stringify(v) } catch { return String(v) }
  }
  return v
}
</script>

<style>
.table-wrap { overflow: auto; max-width: 100%; border: 1px solid #eee; }
.tbl { border-collapse: collapse; width: 100%; font-size: 14px; }
.tbl th, .tbl td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
.tbl thead { background: #fafafa; position: sticky; top: 0; }
.empty { padding: 12px; color: #666; }
</style>