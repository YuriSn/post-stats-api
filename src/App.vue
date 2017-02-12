<template>
  <div id="app">
    <CSVDownload :preload="preload"></CSVDownload>
    <Preloader v-if="showPreloader">
  </div>
</template>

<script>
  import CSVDownload from './components/CSVDownload';
  import Preloader from './components/Preloader';

  export default {
    name: 'app',
    data() {
      return {
        showPreloader: false,
      };
    },

    components: {
      CSVDownload,
      Preloader,
    },

    methods: {
      preload(value) {
        this.showPreloader = value;
      },
    },
  };
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 2rem;
  }
</style>
