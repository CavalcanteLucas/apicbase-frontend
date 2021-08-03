<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/ingredients">Ingredients</router-link> |
      <router-link to="/recipes">Recipes</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #9A224E;
}

body {
  background-color: #e5e5e5;
}

html, body {
  height: 100%;
}

table.table-hovering tr:hover {
  background-color: #8DC799;
}

.error {
  color: #EB2D3E;
  font-size: small;
  font-weight: bold;
}
</style>
