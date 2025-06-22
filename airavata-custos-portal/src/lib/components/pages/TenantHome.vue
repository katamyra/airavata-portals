<template>
  <div class="w-100">
    <div class="w-100 bg-light" style="display: flex;padding: 10px 40px;">
      <div style="flex: 1;">
        <div style="font-size: 1.4rem;" v-if="tenant">{{ tenant.name }}</div>
        <Breadcrumb :links="commonBreadcrumbLinks.concat(breadcrumbLinks)"/>
      </div>
      <!--      <div>-->
      <!--        <router-link to="/tenants" v-slot="{ href, route, navigate}" tag="">-->
      <!--          <b-button variant="secondary" @click="navigate">Back</b-button>-->
      <!--        </router-link>-->
      <!--      </div>-->
    </div>

    <div class="w-100" v-if="tenant" style="display: flex; flex-direction: row;">
      <div style="width: 200px;padding-top: 15px;">
        <ul>
          <li v-if="tenant.hasAdminPrivileges || appTenant.hasAdminPrivileges">
            <router-link :to="`/tenants/${clientId}/profile`" v-slot="{ href, route, navigate}" tag="">
              <b-link @click="navigate" :href="href">Profile</b-link>
            </router-link>
            <ul v-if="tenant.hasAdminPrivileges && tenant.status === 'ACTIVE'">
              <li>
                <router-link :to="`/tenants/${clientId}/roles`" v-slot="{ href, route, navigate}"
                             tag="">
                  <b-link @click="navigate" :href="href">Roles</b-link>
                </router-link>
              </li>
              <li>
                <router-link :to="`/tenants/${clientId}/permission-types`" v-slot="{ href, route, navigate}"
                             tag="">
                  <b-link @click="navigate" :href="href">Permission Types</b-link>
                </router-link>
              </li>
              <li>
                <router-link :to="`/tenants/${clientId}/entity-types`" v-slot="{ href, route, navigate}"
                             tag="">
                  <b-link @click="navigate" :href="href">Entity Types</b-link>
                </router-link>
              </li>
            </ul>
          </li>
          <!--          <li>-->
          <!--            <router-link :to="`/tenants/${clientId}/users`" v-slot="{ href, route, navigate}" tag="">-->
          <!--              <b-link @click="navigate" :href="href">User Management</b-link>-->
          <!--            </router-link>-->
          <!--            <ul>&lt;!&ndash;&ndash;&gt;-->
          <li v-if="tenant.hasAdminPrivileges  && tenant.status === 'ACTIVE'">
            <router-link :to="`/tenants/${clientId}/users`" v-slot="{ href, route, navigate}"
                         tag="">
              <b-link @click="navigate" :href="href">Users</b-link>
            </router-link>
          </li>
          <li v-if="tenant.hasAdminPrivileges  && tenant.status === 'ACTIVE'">
            <router-link :to="`/tenants/${clientId}/groups`" v-slot="{ href, route, navigate}"
                         tag="">
              <b-link @click="navigate" :href="href">Groups</b-link>
            </router-link>
          </li>

          <!--          <li>-->
          <!--            <router-link :to="`/tenants/${tenant.tenantId}/user-management/users`" v-slot="{ href, route, navigate}"-->
          <!--                         tag="">-->
          <!--              <b-link @click="navigate" :href="href">Permissions</b-link>-->
          <!--            </router-link>-->
          <!--          </li>-->
          <!--            </ul>-->
          <!--          </li>-->
          <!--          <li>-->
          <!--            <router-link :to="`/tenants/${tenant}/audits`" v-slot="{ href, route, navigate}" tag="">-->
          <!--              <b-link @click="navigate" :href="href">Audits</b-link>-->
          <!--            </router-link>-->
          <!--          </li>-->

          <li v-if="tenant.hasAdminPrivileges && tenant.status === 'ACTIVE'">
            <router-link :to="`/tenants/${clientId}/entities`" v-slot="{ href, route, navigate}" tag="">
              <b-link @click="navigate" :href="href">Entities</b-link>
            </router-link>
          </li>
          <!--          <li v-if="tenant.hasAdminPrivileges && tenant.status === 'ACTIVE'">-->
          <!--            <router-link :to="`/tenants/${clientId}/audits`" v-slot="{ href, route, navigate}" tag="">-->
          <!--              <b-link @click="navigate" :href="href">Secrets</b-link>-->
          <!--            </router-link>-->
          <!--          </li>-->
          <!--          <ul>-->
          <!--            <li>-->
          <!--              <router-link :to="`/tenants/${clientId}/audits`" v-slot="{ href, route, navigate}" tag="">-->
          <!--                <b-link @click="navigate" :href="href">Docs</b-link>-->
          <!--              </router-link>-->
          <!--            </li>-->
          <!--            <li>-->
          <!--              <router-link :to="`/tenants/${clientId}/audits`" v-slot="{ href, route, navigate}" tag="">-->
          <!--                <b-link @click="navigate" :href="href">Images</b-link>-->
          <!--              </router-link>-->
          <!--            </li>-->
          <!--          </ul>-->

          <li v-if="tenant.status === 'ACTIVE' && tenant.type !== 'CHILD_TENANT'">
            <router-link :to="`/tenants/${tenant.clientId}/child-tenants`" v-slot="{ href, route, navigate}" tag="">
              <b-link @click="navigate" :href="href" v-if="tenant.type === 'SUPER_TENANT'">Admin Tenants</b-link>
              <b-link @click="navigate" :href="href" v-if="tenant.type === 'ADMIN_TENANT'">Child Tenants</b-link>
            </router-link>
          </li>

        </ul>
      </div>
      <div style="flex: 1;padding: 10px 20px;">
        <div class="w-100" style="display: flex; flex-direction: row;">
          <div style="flex: 1;font-weight: 500;font-size: 23px;padding-top: 15px;">{{ title }}</div>
          <div style="padding: 10px">
            <slot name="header-right"></slot>
          </div>
        </div>
        <div class="w-100">
          <b-alert v-for="(error, errorIndex) in errors" :key="errorIndex" show dismissible :variant="error.variant">
            {{ error.title }}
          </b-alert>
        </div>
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>

import store from "../../store"
import Breadcrumb from "../block/Breadcrumb";
import {custosService} from "../../store/util/custos.util";

export default {
  name: "TenantHome",
  store: store,
  components: {Breadcrumb},
  props: {
    title: {},
    breadcrumbLinks: {
      default() {
        return [];
      }
    },
    errors: {
      default() {
        return [];
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    commonBreadcrumbLinks() {
      const _breadcrumbLinks = [];

      if (this.appTenant) {
        _breadcrumbLinks.push({to: `/tenants/${this.appTenant.clientId}`, name: this.appTenant.name});
      }

      if (this.clientId !== custosService.clientId && this.tenant) {
        _breadcrumbLinks.push({to: `/tenants/${this.clientId}`, name: this.tenant.name})
      }

      return _breadcrumbLinks;
    },
    currentUsername() {
      return this.$store.getters["auth/currentUsername"]
    },
    clientId() {
      if (this.$route.params.clientId) {
        return this.$route.params.clientId;
      } else {
        return custosService.clientId;
      }
    },
    appTenant() {
      return this.$store.getters["tenant/getTenant"]({clientId: custosService.clientId});
    },
    tenant() {
      return this.$store.getters["tenant/getTenant"]({clientId: this.clientId});
    }
  },
  beforeMount() {
    this.$store.dispatch("tenant/fetchTenant", {clientId: this.clientId});
  },
  methods: {}
};
</script>

<style scoped>
ul {
  list-style: none;
}

ul li ul {
  margin-left: 30px;
  padding: 0px;
}

ul li a {
  background-color: #e2e3e46e;
  width: 100%;
  display: block;
  padding: 5px 15px;
  border-radius: 7px;
  margin-top: 7px;
}

ul li ul li a {
  background-color: transparent;
  padding: 0px;
  margin-top: 0px;
}
</style>