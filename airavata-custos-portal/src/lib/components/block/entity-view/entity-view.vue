<template>
  <table-overlay-info :rows="5" :columns="1" :data="entity ? [entity]: null">
    <div v-if="entity">
      <entity-view-default :entity-id="entityId" :client-id="clientId"/>

      <entity-view-secret v-if="entity.type === 'SECRET'" :entity-id="entityId" :client-id="clientId"/>
    </div>
  </table-overlay-info>
</template>

<script>
import store from "../../../store";
import TableOverlayInfo from "../../overlay/table-overlay-info";
import EntityViewDefault from "./entity-view-default";
import EntityViewSecret from "./entity-view-secret";

export default {
  name: "entity-view",
  components: {EntityViewSecret, EntityViewDefault, TableOverlayInfo},
  store: store,
  props: {
    clientId: {},
    entityId: {}
  },
  computed: {
    entity() {
      return this.$store.getters["entity/getEntity"]({entityId: this.entityId})
    }
  },
  methods: {
    refreshData() {
      this.$store.dispatch("entity/fetchEntity", {clientId: this.clientId, entityId: this.entityId});
    }
  },
  beforeMount() {
    this.refreshData();
  }
}
</script>

<style scoped>

</style>