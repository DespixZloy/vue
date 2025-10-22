<template>
  <div class="app">
    <header class="app__header">
      <h1>WB API SPA</h1>
      <nav class="nav">
        <router-link to="/orders">Orders</router-link>
        <router-link to="/sales">Sales</router-link>
        <router-link to="/stocks">Stocks</router-link>
        <router-link to="/incomes">Incomes</router-link>
      </nav>
    </header>
    <main class="app__main">
      <router-view />
    </main>
  </div>
</template>

<style>
.app { font-family: system-ui, Arial, sans-serif; padding: 16px; }
.app__header { display:flex; gap:16px; align-items:center; justify-content:space-between; }
.nav { display:flex; gap:12px; }
.nav a.router-link-active { font-weight: bold; text-decoration: underline; }
.app__main { margin-top: 16px; }
</style>