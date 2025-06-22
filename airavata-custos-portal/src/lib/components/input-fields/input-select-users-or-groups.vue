<template>
  <div>
    <vue-typeahead-bootstrap
        v-model="usernameSearch"
        :data="typeheadData"
        :min-matching-chars="0"
        :serializer="item => item.username ? item.username : item.name"
        @hit="selectSearchResult"
    >
      <template slot="suggestion" slot-scope="{ data, htmlText }">
        <small v-if="!data.username" style="font-size: 10px">GROUP <br/></small>
        <span v-html="htmlText"></span>
      </template>
    </vue-typeahead-bootstrap>
  </div>
</template>

<script>
import store from "../../store";
import {custosService} from "../../store/util/custos.util";

export default {
  name: "input-select-users-or-groups",
  store: store,
  props: {
    clientId: {
      default: custosService.clientId
    },
    allowUsers: {default: true},
    allowGroups: {default: true}
  },
  data() {
    return {
      usernameSearch: ""
    }
  },
  computed: {
    typeheadData() {
      let _typeheadData = [];

      if (this.groups) {
        _typeheadData = _typeheadData.concat(this.groups);
      }

      if (this.users) {
        _typeheadData = _typeheadData.concat(this.users);
      }

      return _typeheadData;
    },
    users() {
      if (this.allowUsers) {
        return this.$store.getters["user/getUsers"]({
          clientId: this.clientId,
          limit: 5,
          offset: 0,
          username: this.usernameSearch
        });
      } else {
        return [];
      }
    },
    groups() {
      if (this.allowGroups) {
        return this.$store.getters["group/getGroups"]({
          clientId: this.clientId,
          limit: 5,
          offset: 0,
          groupId: this.usernameSearch
        });
      } else {
        return [];
      }
    }
  },
  watch: {
    usernameSearch() {
      if (!this.users || !this.groups) {
        this.refreshList();
      }
    }
  },
  methods: {
    selectSearchResult(user) {
      // this.usernameSearch = user.username;
      this.$emit("change", user);
      this.usernameSearch = ""
    },
    refreshList() {
      if (this.usernameSearch.length > -1) {

        if (this.allowUsers) {
          this.$store.dispatch("user/fetchUsers", {
            clientId: this.clientId,
            limit: 5,
            offset: 0,
            username: this.usernameSearch
          });
        }

        if (this.allowGroups) {
          this.$store.dispatch("group/fetchGroups", {
            clientId: this.clientId,
            limit: 5,
            offset: 0,
            groupId: this.usernameSearch
          });
        }

      }
    }
  },
  beforeMount() {
    this.refreshList();
  }
}
</script>

<style scoped>

</style>