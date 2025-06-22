<template>
  <div>
    <b-table-simple>
      <b-tbody>
        <b-tr>
          <b-th>Name</b-th>
          <b-td>{{ entity.name }}</b-td>
        </b-tr>
        <b-tr>
          <b-th>Description</b-th>
          <b-td>{{ entity.description }}</b-td>
        </b-tr>
        <b-tr>
          <b-th>Created At</b-th>
          <b-td>{{ entity.createdAt }}</b-td>
        </b-tr>
        <b-tr>
          <b-th>Last Updated At</b-th>
          <b-td>{{ entity.updatedAt }}</b-td>
        </b-tr>
        <b-tr>
          <b-th>Type</b-th>
          <b-td>{{ entity.type }}</b-td>
        </b-tr>
        <b-tr>
          <b-th>Shared Count</b-th>
          <b-td>{{ entity.sharedCount }}</b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </div>
</template>

<script>

import store from "../../../store";

export default {
  name: "entity-view-default",
  store: store,
  props: {
    clientId: {},
    entityId: {}
  },
  computed: {
    entity() {
      return this.$store.getters["entity/getEntity"]({entityId: this.entityId})
    }
  }
}
</script>

<style scoped>

</style>