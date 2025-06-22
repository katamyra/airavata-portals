<template>
  <div id="app">
    <Header/>
    <div class="w-100" id="nav">
      <Maintenance v-if="underMaintenance"/>
      <router-view v-else/>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from "./lib/components/block/Header";
import store from "./lib/store";
import Footer from "./lib/components/block/Footer";
import Maintenance from "./lib/components/pages/Maintenance";
import config from "./config";

export default {
  name: 'App',
  store: store,
  components: {Maintenance, Footer, Header},
  data() {
    return {
      underMaintenance: false
    }
  },
  methods: {
    redirectToLoginIfNotAuthenticated() {
      if (!this.authenticated && this.$router.currentRoute.path !== "/") {
        this.$router.push('/')
      }
    }
  },
  watch: {
    authenticated() {
      this.redirectToLoginIfNotAuthenticated()
    }
  },
  computed: {
    authenticated: () => store.getters["auth/authenticated"],
    currentUsername: () => store.getters["auth/currentUsername"]
  },
  mounted() {
    this.underMaintenance = config.value('underMaintenance');
    if (!this.underMaintenance) {
      this.redirectToLoginIfNotAuthenticated();
    }
  }
}
</script>

<style>
#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
}
</style>
