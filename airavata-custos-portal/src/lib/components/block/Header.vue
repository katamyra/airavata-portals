<template>
  <div>
    <div class="header p-3">
      <div class="custos-logo">
        <img src="../../../assets/custos-logo_custos-logo-color-v1.png" style="width: 140px;">
      </div>
      <div class="user-details" v-if="this.authenticated && user">
        <div class="username">{{ user.firstName + " " + user.lastName }}</div>
        <div class="email">{{ user.email }}</div>
      </div>

      <b-dropdown v-if="this.authenticated" right class="ml-2" text="" no-caret toggle-class="user-avatar-button">
        <template v-slot:button-content v-if="user">
          <b-icon icon="person-fill"></b-icon>
        </template>
        <template v-slot:button-content v-else>
          <b-spinner small label="Spinning"></b-spinner>
        </template>

        <template v-slot:default v-if="user">
          <router-link :to="profileLink" v-slot="{href, navigate}">
            <b-dropdown-item :href="href" v-on:click="navigate">Profile</b-dropdown-item>
          </router-link>
          <b-dropdown-item v-on:click="logout">Logout</b-dropdown-item>
        </template>
      </b-dropdown>
      <div v-else right>
        <!--        <router-link to="/register" v-slot="{ href, route, navigate, isActive,isExactActive }" tag="">-->
        <!--          <b-button v-if="!isActive || !isExactActive" v-on:click="navigate" variant="outline-primary">Sign Up-->
        <!--          </b-button>-->
        <!--        </router-link>-->
        <router-link to="/" v-slot="{ href, route, navigate, isActive,isExactActive }" tag="">
          <b-button v-if="!isActive || !isExactActive" v-on:click="navigate" variant="primary" class="ml-3">Login
          </b-button>
        </router-link>

      </div>

    </div>
  </div>
</template>

<script>

import store from "../../store";
import {custosService} from "../../store/util/custos.util";

export default {
  name: "Header",
  store: store,
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"]
    },
    isAdmin() {
      return this.$store.getters["auth/isAdmin"]
    },
    currentUsername() {
      return this.$store.getters["auth/currentUsername"]
    },
    user() {
      return this.$store.getters["user/getUser"]({clientId: custosService.clientId, username: this.currentUsername});
    },
    profileLink() {
      return `/tenants/${custosService.clientId}/users/${this.currentUsername}`;
    }
  },
  methods: {
    logout: () => store.dispatch("auth/logout")
  },
  // watch: {
  //   authenticated() {
  //     if (this.authenticated) {
  //       this.$store.dispatch("user/fetchUsers", {username: this.currentUsername});
  //     }
  //   }
  // },
  // mounted() {
  //   if (this.authenticated) {
  //     this.$store.dispatch("user/fetchUsers", {username: this.currentUsername});
  //   }
  // }
}
</script>

<style>
.header {
  display: flex;
}

.header .custos-logo {
  flex: 1;
  display: flex;
}

.header .user-details .username {
  font-size: 15px;
  font-weight: 900;
  text-align: right;
  color: #afafae;
}

.header .user-details .email {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.07;
  text-align: right;
  color: #203a43;
}

.header .user-avatar-button {
  border-radius: 30px;
  width: 35px;
  height: 35px;
  padding: 0px;
  line-height: 0px;
  font-size: 15px;
  background-color: #4a4a4a;
}
</style>