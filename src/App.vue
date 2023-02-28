<template>
  <div id="app">
    <MyCard />
  </div>
</template>

<script>
import MyCard from './components/MyCard.vue';


export default {
  name: 'App',
  components: {
    MyCard,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  height: 100vh;
  color: white;
}

*,
body {
  margin: 0;
}
</style>
