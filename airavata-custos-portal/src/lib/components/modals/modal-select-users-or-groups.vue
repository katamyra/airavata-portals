<template>
  <b-modal :id="modalId" :title="title" v-on:show="reset">
    <input-select-users-or-groups :client-id="clientId" v-on:change="onSelect" :allow-groups="false"
                                  :allow-users="true"/>
    <ul class="list-inline d-inline-block mb-2 p-4">
      <li v-for="user in selectedUsers" :key="user.username" class="list-inline-item">
        <b-form-tag
            :title="user.username"
            variant="info"
        >{{ user.username }}
        </b-form-tag>
      </li>
      <li v-for="group in selectedGroups" :key="group.name" class="list-inline-item">
        <b-form-tag
            :title="group.name"
            variant="info"
        >{{ group.name }}
        </b-form-tag>
      </li>
    </ul>
    <template #modal-footer="{close}">
      <b-button variant="primary" size="sm" v-on:click="onClickAdd">Add</b-button>
      <b-button variant="secondary" size="sm" @click="close">Cancel</b-button>
    </template>
  </b-modal>
</template>

<script>
import store from "../../store";
import InputSelectUsersOrGroups from "../input-fields/input-select-users-or-groups";
import {custosService} from "../../store/util/custos.util";

export default {
  name: "modal-select-users-or-groups",
  components: {InputSelectUsersOrGroups},
  store: store,
  props: {
    modalId: {},
    clientId: {
      default: custosService.clientId
    },
    title: {
      default: "Select Users or Groups"
    }
  },
  data() {
    return {
      selectedUsersMap: {},
      selectedGroupsMap: {}
    }
  },
  computed: {
    selectedUsers() {
      const _selectedUsers = [];
      for (let username in this.selectedUsersMap) {
        if (this.selectedUsersMap[username]) {
          _selectedUsers.push(this.$store.getters["user/getUser"]({clientId: this.clientId, username}));
        }
      }

      return _selectedUsers;
    },
    selectedGroups() {
      const _selectedGroups = [];
      for (let groupId in this.selectedGroupsMap) {
        if (this.selectedGroupsMap[groupId]) {
          _selectedGroups.push(this.$store.getters["group/getGroup"]({groupId}));
        }
      }

      return _selectedGroups;
    }
  },
  methods: {
    onSelect(obj) {
      if (obj.username) {
        this.selectedUsersMap = {
          ...this.selectedUsersMap,
          [obj.username]: true
        };
      } else if (obj.groupId) {
        this.selectedGroupsMap = {
          ...this.selectedGroupsMap,
          [obj.groupId]: true
        };
      }
    },
    onClickAdd() {
      this.$emit("users", this.selectedUsers);
      this.$emit("groups", this.selectedGroups);
      this.$bvModal.hide(this.modalId);
    },
    reset() {
      this.selectedUsersMap = {};
      this.selectedGroupsMap = {};
    }
  }
}
</script>

<style scoped>

</style>
