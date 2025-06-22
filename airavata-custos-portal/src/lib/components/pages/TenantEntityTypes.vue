<template>
  <TenantHome title="Entity Types" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <router-link :to="`/tenants/${clientId}/entity-types/new`" v-slot="{href, navigate}" tag="">
        <b-button variant="primary" @click="navigate">Create New Entity Type</b-button>
      </router-link>
    </template>
    <table-overlay-info :rows="5" :columns="3" :data="entityTypes">
      <b-table-simple>
        <b-thead>
          <b-tr>
            <b-th>ID</b-th>
            <b-th>Name</b-th>
            <b-th>Description</b-th>
            <b-th></b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="entityType in entityTypes" :key="entityType.id">
            <b-td>{{ entityType.id }}
              <button-copy :value="entityType.id"/>
            </b-td>
            <b-td>{{ entityType.name }}</b-td>
            <b-td>{{ entityType.description }}</b-td>
            <b-td>
              <button-overlay :show="processingDelete[entityType.id]">
                <button-delete-after-confirmation variant="link" size="sm" v-on:click="onClickDelete(entityType)"
                                                  v-b-tooltip.hover title="Delete"
                                                  :disabled="disabledEntityTypes[entityType.id]">
                  <b-icon icon="trash"></b-icon>
                </button-delete-after-confirmation>
              </button-overlay>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </table-overlay-info>
  </TenantHome>
</template>

<script>
import TenantHome from "./TenantHome";
import store from "../../store";
import TableOverlayInfo from "../overlay/table-overlay-info";
import ButtonOverlay from "../overlay/button-overlay";
import ButtonCopy from "../button/button-copy";
import ButtonDeleteAfterConfirmation from "../button/button-delete-after-confirmation";

export default {
  name: "TenantEntityTypes",
  store: store,
  components: {ButtonDeleteAfterConfirmation, ButtonCopy, ButtonOverlay, TableOverlayInfo, TenantHome},
  data() {
    return {
      processingDelete: {},
      errors: [],

      disabledEntityTypes: {
        "SECRET": true
      }
    }
  },
  computed: {
    clientId() {
      return this.$route.params.clientId;
    },
    entityTypes() {
      return this.$store.getters["sharing/getEntityTypes"]({clientId: this.clientId})
    },
    breadcrumbLinks() {
      return [{to: `/tenants/${this.clientId}/entity-types`, name: "Entity Types"}];
    }
  },
  methods: {
    refreshData() {
      this.$store.dispatch("sharing/fetchEntityTypes", {clientId: this.clientId});
    },
    async onClickDelete({id, name, description}) {
      this.processingDelete = {...this.processingDelete, [id]: true};

      try {
        await this.$store.dispatch("sharing/deleteEntityType", {clientId: this.clientId, id, name, description});
        this.refreshData();
      } catch (error) {
        this.errors.push({
          title: `Unknown error when deleting the entity type '${id}'.`,
          source: error, variant: "danger"
        });
      }

      this.processingDelete = {...this.processingDelete, [id]: false};
    }
  },
  mounted() {
    this.refreshData();
  }
}
</script>

<style scoped>

</style>