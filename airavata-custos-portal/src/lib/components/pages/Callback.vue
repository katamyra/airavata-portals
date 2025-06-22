<template>
  <p></p>
</template>

<script>

import store from "../../store";
import {custosService} from "../../store/util/custos.util";

export default {
  name: "Callback",
  store: store,
  methods: {
    async authenticate() {
      let code = this.$route.query.code
      let params = {code: code};
      await this.$store.dispatch('auth/authenticateUsingCode', params)
      await this.$store.dispatch("user/addRolesToUser", {
        clientId: custosService.clientId,
        username: this.$store.getters["auth/currentUsername"],
        realmRoles: ["tenant-requester"],
        clientLevel: false
      });
    }
  },
  async mounted() {
    await this.authenticate();
    await this.$router.push('/');
  }
}
</script>

<style scoped>

</style>