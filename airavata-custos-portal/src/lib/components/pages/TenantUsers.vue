<template>
  <TenantHome title="Users" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <table-overlay-info :rows="5" :columns="6" :data="users">
      <b-table-simple>
        <b-thead>
          <b-tr>
            <b-th>Username</b-th>
            <b-th>Email</b-th>
            <!--            <b-th>Client Roles</b-th>-->
            <b-th>Roles</b-th>
            <b-th>Status</b-th>
            <b-th>Actions</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="user in users" :key="user.username">
            <b-td>
              <router-link :to="`/tenants/${clientId}/users/${user.username}`" v-slot="{href, navigate}">
                <b-link :href="href" v-on:click="navigate">{{ user.username }}</b-link>
              </router-link>
            </b-td>
            <b-td>{{ user.email }}</b-td>
            <!--            <b-td>-->
            <!--              {{ user.clientRoles.join(", ") }}-->
            <!--              &lt;!&ndash;              <b-form-tags v-model="user.clientRoles" separator=" " no-tag-remove no-outer-focus&ndash;&gt;-->
            <!--              &lt;!&ndash;                           ignore-input-focus-selector=""></b-form-tags>&ndash;&gt;-->
            <!--            </b-td>-->
            <b-td>
              {{ user.realmRoles.join(", ") }}
              <!--              <b-button variant="link-secondary" size="sm" v-for="role in user.realmRoles" :key="role" href="#">-->
              <!--                {{ role }}-->
              <!--              </b-button>-->
            </b-td>
            <b-td>
              <b-tag v-if="user.status === 'ACTIVE'" no-remove variant="success">Enabled</b-tag>
              <b-tag v-else-if="user.status === 'PENDING_CONFIRMATION'" no-remove variant="warning">Pending</b-tag>
              <b-tag v-else-if="user.status === 'CONFIRMED'" no-remove variant="danger">Disabled</b-tag>
            </b-td>
            <b-td>
              <b-overlay :show="processingEnableUser[user.username]" v-if="user.status !== 'ACTIVE'"
                         rounded spinner-small spinner-variant="primary" class="d-inline-block">
                <b-button variant="outline-primary" size="sm" v-on:click="enableUser(user)">
                  Enable
                </b-button>
              </b-overlay>
              <b-overlay :show="processingDisableUser[user.username]" v-if="user.status === 'ACTIVE'"
                         rounded spinner-small spinner-variant="primary" class="d-inline-block">
                <b-button variant="outline-primary" size="sm" v-on:click="disableUser(user)"
                          :disabled="user.username === tenant.adminUsername">
                  Disable
                </b-button>
              </b-overlay>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <!--    <b-pagination-->
      <!--        size="sm"-->
      <!--        class="float-right"-->
      <!--        v-model="activePage"-->
      <!--        :total-rows="tenantsPagination.totalRows"-->
      <!--        :per-page="tenantsPagination.perPage"-->
      <!--        aria-controls="my-table"-->
      <!--        :value="activePage"-->
      <!--    ></b-pagination>-->
    </table-overlay-info>
  </TenantHome>
</template>

<script>
import store from "../../store"
import TenantHome from "./TenantHome";
import TableOverlayInfo from "../overlay/table-overlay-info";

export default {
  name: "TenantUsers",
  store: store,
  components: {TableOverlayInfo, TenantHome},
  data() {
    return {
      processingEnableUser: {},
      processingDisableUser: {},
      errors: [],

      // TODO fix once the pagination is fixed.
      // https://github.com/apache/airavata-custos/issues/174
      limit: 100000
    }
  },
  computed: {
    clientId() {
      return this.$route.params.clientId;
    },
    tenant() {
      return this.$store.getters["tenant/getTenant"]({clientId: this.clientId});
    },
    users() {
      return this.$store.getters["user/getUsers"]({clientId: this.clientId, limit: this.limit})
    },
    breadcrumbLinks() {
      return [{to: `/tenants/${this.clientId}/users`, name: "Users"}];
    },
  },
  methods: {
    async enableUser({username}) {
      this.processingEnableUser = {...this.processingEnableUser, [username]: true};
      try {
        await this.$store.dispatch("user/enableUser", {clientId: this.clientId, username});
      } catch (error) {
        this.errors.push({
          title: `Unknown error when enabling the user '${username}'`,
          source: error, variant: "danger"
        });
      }
      this.processingEnableUser = {...this.processingEnableUser, [username]: false};
    },
    async disableUser({username}) {
      this.processingDisableUser = {...this.processingDisableUser, [username]: true};
      try {
        await this.$store.dispatch("user/disableUser", {clientId: this.clientId, username});
      } catch (error) {
        this.errors.push({
          title: `Unknown error when disabling the user '${username}'`,
          source: error, variant: "danger"
        });
      }
      this.processingDisableUser = {...this.processingDisableUser, [username]: false};
    }
  },
  beforeMount() {
    this.$store.dispatch("user/fetchUsers", {clientId: this.clientId, limit: this.limit});
  }
}
</script>

<style scoped>

</style>