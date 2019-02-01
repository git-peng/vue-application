<template>
  <div id="app">
    <div class="header">
      BritePay
    </div>
    <DataTable />
  </div>
</template>

<script>
import DataTable from './components/DataTable.vue'

export default {
  name: 'app',
  components: {
    DataTable
  }
}
</script>

<style>

.header{
  text-align: left;
  font-size: 22px;
  font-weight: 700;
  height: 3em;
  display: flex;
  align-items: center;
  width: 85%;
  margin: auto;
  padding: 0 15px;
  box-sizing: border-box;
}

@media screen and (max-width: 786px) {
    .header {
        width: 100%;
        margin: auto;
    }
}

body{
  margin: 0;
  background-color: #FEFEFE;
}

#app {
  font-family: "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
