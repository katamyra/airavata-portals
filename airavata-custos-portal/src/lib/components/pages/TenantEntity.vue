<template>
  <TenantHome :title="title" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <b-overlay :show="processingAddNewUsers" rounded spinner-small spinner-variant="primary" class="d-inline-block">
        <b-button variant="primary" v-b-modal="`modal-select-users-or-groups`">Share</b-button>
      </b-overlay>
      <modal-share-entity v-if="entity" :client-id="clientId" :entity-id="entityId"
                          :modal-id="`modal-select-users-or-groups`"
                          :title="`Share Entity '${entity.name}'`"
                          v-on:close="refreshData"/>
    </template>
    <entity-view :client-id="clientId" :entity-id="entityId"/>
  </TenantHome>
</template>

<script>
import TenantHome from "./TenantHome";
import store from "../../store";
import ModalShareEntity from "../modals/modal-share-entity";
import EntityView from "../block/entity-view/entity-view";

export default {
  name: "TenantEntity",
  components: {EntityView, ModalShareEntity, TenantHome},
  store: store,
  data() {
    return {
      processingRemoveUser: {},
      processingAddNewUsers: false,
      errors: []
    };
  },
  computed: {
    title() {
      if (this.entity) {
        return this.entity.name;
      } else {
        return "";
      }
    },
    breadcrumbLinks() {
      const _breadcrumbLinks = [{to: `/tenants/${this.clientId}/entities`, name: "Entities"}];

      if (this.entity) {
        _breadcrumbLinks.push({to: `/tenants/${this.clientId}/entities/${this.entityId}`, name: this.entity.name});
      }

      return _breadcrumbLinks;
    },
    clientId() {
      return this.$route.params.clientId;
    },
    entityId() {
      return this.$route.params.entityId;
    },
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