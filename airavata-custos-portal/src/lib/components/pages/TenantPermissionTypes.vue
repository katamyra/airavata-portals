<template>
  <TenantHome title="Permission Types" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <router-link :to="`/tenants/${clientId}/permission-types/new`" v-slot="{href, navigate}" tag="">
        <b-button variant="primary" @click="navigate">Create New Permission Type</b-button>
      </router-link>
    </template>
    <TableOverlayInfo :rows="5" :columns="3" :data="permissionTypes">
      <b-table-simple>
        <b-thead>
          <b-tr>
            <b-th>ID</b-th>
            <b-th>Name</b-th>
            <b-th>Description</b-th>
            <b-th>Actions</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="permissionType in permissionTypes" :key="permissionType.id">
            <b-td>{{ permissionType.id }}
              <button-copy :value="permissionType.id"/>
            </b-td>
            <b-td>{{ permissionType.name }}</b-td>
            <b-td>{{ permissionType.description }}</b-td>
            <b-td>
              <button-overlay :show="processingDelete[permissionType.id]">
                <button-delete-after-confirmation variant="link" size="sm" v-on:click="onClickDelete(permissionType)"
                                                  v-b-tooltip.hover title="Delete"
                                                  :disabled="disabledPermissionType[permissionType.id]">
                  <b-icon icon="trash"></b-icon>
                </button-delete-after-confirmation>
              </button-overlay>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </TableOverlayInfo>
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
  name: "TenantPermissionTypes",
  store: store,
  components: {ButtonDeleteAfterConfirmation, ButtonCopy, ButtonOverlay, TableOverlayInfo, TenantHome},
  data() {
    return {
      processingDelete: {},
      errors: [],

      disabledPermissionType: {
        "OWNER": true
      }
    }
  },
  computed: {
    clientId() {
      return this.$route.params.clientId;
    },
    permissionTypes() {
      return this.$store.getters["sharing/getPermissionTypes"]({clientId: this.clientId})
    },
    breadcrumbLinks() {
      return [{to: `/tenants/${this.clientId}/permission-types`, name: "Permission Types"}];
    }
  },
  methods: {
    refreshData() {
      this.$store.dispatch("sharing/fetchPermissionTypes", {clientId: this.clientId});
    },
    async onClickDelete({id, name, description}) {
      this.processingDelete = {...this.processingDelete, [id]: true};

      try {
        await this.$store.dispatch("sharing/deletePermissionType", {clientId: this.clientId, id, name, description});
        this.refreshData();
      } catch (error) {
        this.errors.push({
          title: `Unknown error when deleting the permission type '${id}'.`,
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