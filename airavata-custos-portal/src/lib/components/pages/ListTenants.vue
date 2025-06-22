<template>
  <TenantHome :title="title" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <router-link :to="`/tenants/${clientId}/child-tenants/new`" v-slot="{ href, route, navigate}" tag="">
        <b-button variant="primary" @click="navigate">Create New Tenant</b-button>
      </router-link>
    </template>
    <div class="w-100">
      <table-overlay-info :rows="5" :columns="5" :data="tenants">
        <b-table-simple small>
          <b-thead>
            <b-tr>
              <!--              <b-th>-->
              <!--                <b-checkbox/>-->
              <!--              </b-th>-->
              <b-th>Custos OAuth Client ID</b-th>
              <b-th>Name</b-th>
              <b-th>Domain</b-th>
              <b-th>Status</b-th>
              <b-th colspan="2">Actions</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr v-for="childTenant in tenants" :key="childTenant.tenantId">
              <!--              <b-td>-->
              <!--                <b-checkbox/>-->
              <!--              </b-td>-->
              <b-td>
                <router-link :to="getTenantLink(childTenant)"
                             v-slot="{ href, route, navigate}" tag="">
                  <b-link @click="navigate" :href="href">
                    {{ childTenant.clientId }}
                  </b-link>
                </router-link>
                <button-copy :value="childTenant.clientId"/>
              </b-td>
              <b-td>{{ childTenant.name }}</b-td>
              <b-td>{{ childTenant.domain }}</b-td>
              <b-td>
                <b-tag v-if="childTenant.status === 'ACTIVE'" no-remove variant="success">Active</b-tag>
                <b-tag v-else-if="childTenant.status === 'REQUESTED'" no-remove variant="warning">Requested
                </b-tag>
                <b-tag v-else-if="childTenant.status === 'DEACTIVATED'" no-remove variant="secondary">Deactivated
                </b-tag>
                <b-tag v-else-if="childTenant.status === 'CANCELLED'" no-remove variant="danger">Cancelled
                </b-tag>
              </b-td>
              <b-td>
                <b-overlay :show="processingActivate[childTenant.clientId]"
                           v-if="tenant.hasAdminPrivileges && childTenant.status !== 'ACTIVE'"
                           rounded spinner-small spinner-variant="primary" class="d-inline-block">
                  <b-button variant="outline-primary" size="sm" v-on:click="activateTenant(childTenant)">Activate
                  </b-button>
                </b-overlay>
                <b-overlay :show="processingDeactivate[childTenant.clientId]"
                           v-if="tenant.hasAdminPrivileges && childTenant.status === 'ACTIVE'"
                           rounded spinner-small spinner-variant="primary" class="d-inline-block">
                  <b-button variant="outline-primary" size="sm" v-on:click="deactivateTenant(childTenant)"
                            :class="{'ml-2':childTenant.status !== 'ACTIVE'}">
                    Deactivate
                  </b-button>
                </b-overlay>
              </b-td>
              <b-td>
                <b-overlay :show="processingDelete[childTenant.clientId]" v-if="childTenant.status === 'REQUESTED'"
                           rounded spinner-small spinner-variant="primary" class="d-inline-block">
                  <button-delete-after-confirmation variant="link" size="sm" v-on:click="deleteTenant(childTenant)"
                                                    v-b-tooltip.hover title="Delete">
                    <b-icon icon="trash"></b-icon>
                  </button-delete-after-confirmation>
                </b-overlay>
              </b-td>
            </b-tr>

          </b-tbody>
        </b-table-simple>
        <b-pagination
            v-if="tenantsPagination"
            size="sm"
            class="float-right"
            v-model="activePage"
            :total-rows="tenantsPagination.totalRows"
            :per-page="tenantsPagination.perPage"
            aria-controls="my-table"
            :value="activePage"
        ></b-pagination>

        <template #empty>
          <div class="w-100 text-center" style="color: #203A43;padding-top: 100px;">
            <p style="max-width: 600px;display: inline-block;">
              <img :src="svgNotFound" style="width: 70px;margin-bottom: 30px;"/><br/>
              You have no tenants. Start by clicking on Create New Tenant Button.
              Visit
              <b-link href="https://cwiki.apache.org/confluence/display/CUSTOS/Home" target="_blank">documentation
              </b-link>
              more information.
            </p>
          </div>
        </template>
      </table-overlay-info>

    </div>
  </TenantHome>
</template>

<script>

import store from "../../store"
import svgNotFound from "../../../assets/not-found-icon.svg"
import TenantHome from "./TenantHome";
import {custosService} from "../../store/util/custos.util";
import TableOverlayInfo from "../overlay/table-overlay-info";
import ButtonCopy from "../button/button-copy";
import ButtonDeleteAfterConfirmation from "../button/button-delete-after-confirmation";

export default {
  name: "ListTenants",
  store: store,
  components: {ButtonDeleteAfterConfirmation, ButtonCopy, TableOverlayInfo, TenantHome},
  data() {
    return {
      processingDelete: {},
      processingActivate: {},
      processingDeactivate: {},
      errors: [],

      activePage: 1,
      svgNotFound: svgNotFound,
      limit: 10
    }
  },
  computed: {
    title() {
      if (this.tenant && this.tenant.type === "SUPER_TENANT") {
        return "Admin Tenants";
      } else if (this.tenant && this.tenant.type === "ADMIN_TENANT") {
        return "Child Tenants";
      } else {
        return "Tenants";
      }
    },
    breadcrumbLinks() {
      return [{to: `/tenants/${this.clientId}/child-tenants`, name: this.title}];
    },
    clientId() {
      if (this.$route.params.clientId) {
        return this.$route.params.clientId;
      } else {
        return custosService.clientId;
      }
    },
    tenant() {
      return this.$store.getters["tenant/getTenant"]({clientId: this.clientId});
    },
    offset() {
      return (this.activePage - 1) * this.limit;
    },
    tenantsPagination() {
      return this.$store.getters["tenant/getTenantsPagination"](this.tenantsListParams);
    },
    tenants() {
      let activeTenants = this.$store.getters["tenant/getTenants"](this.tenantsListParams);

      // TODO remove later. A temporary fix for tenants that has issues.
      if (activeTenants) {
        activeTenants = activeTenants.filter(tenant => !!tenant);
      }

      return activeTenants;
    },
    currentUser() {
      return this.$store.getters["user/getUser"]({
        clientId: this.clientId,
        username: this.$store.getters["auth/currentUsername"]
      });
    },
    requesterEmail() {
      if (this.currentUser) {
        return this.currentUser.email;
      } else {
        return null;
      }
    },
    tenantsListParams() {
      const params = {
        parentClientId: this.clientId,
        limit: this.limit, offset: this.offset
      }

      if (this.tenant && !this.tenant.hasAdminPrivileges) {
        params.requesterEmail = this.requesterEmail;
      }

      return params;
    }
  },
  watch: {
    activePage() {
      this.refreshData();
    },
    clientId() {
      this.resetPagination();
      this.refreshData();
    },
    requesterEmail() {
      this.resetPagination();
      this.refreshData();
    }
  },
  mounted() {
    this.resetPagination();
    this.refreshData();
  },
  methods: {
    resetPagination() {
      this.activePage = 1;
    },
    refreshData() {
      this.$store.dispatch("tenant/fetchTenants", this.tenantsListParams);
    },
    getTenantLink({clientId}) {
      return `/tenants/${clientId}`;
    },
    async activateTenant({clientId}) {
      this.processingActivate = {...this.processingActivate, [clientId]: true};
      try {
        await this.$store.dispatch("tenant/updateTenantStatus", {clientId, status: "ACTIVE"});
      } catch (error) {
        this.errors.push({
          title: `Unknown error when activating the tenant '${name}'`,
          source: error, variant: "danger"
        });
      }
      this.processingActivate = {...this.processingActivate, [clientId]: false};
    },
    async deactivateTenant({clientId}) {
      this.processingDeactivate = {...this.processingDeactivate, [clientId]: true};
      try {
        await this.$store.dispatch("tenant/updateTenantStatus", {clientId, status: "DEACTIVATED"});
      } catch (error) {
        this.errors.push({
          title: `Unknown error when deactivating the tenant '${name}'`,
          source: error, variant: "danger"
        });
      }
      this.processingDeactivate = {...this.processingDeactivate, [clientId]: false};
    },
    async deleteTenant({clientId, name}) {
      this.processingDelete = {...this.processingDelete, [clientId]: true};
      try {
        await this.$store.dispatch("tenant/updateTenantStatus", {clientId, status: "CANCELLED"})
      } catch (error) {
        this.errors.push({
          title: `Unknown error when deleting the tenant '${name}'`,
          source: error, variant: "danger"
        });
      }
      this.refreshData();
      this.processingDelete = {...this.processingDelete, [clientId]: false};
    },
  }
};
</script>

<style scoped>

</style>