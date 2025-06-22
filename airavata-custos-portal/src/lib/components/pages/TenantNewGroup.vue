<template>
  <TenantHome title="New Group" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <b-button variant="primary" v-on:click="create">Create</b-button>
    </template>
    <b-overlay :show="processing">
      <div class="p-2 text-center">
        <div class="w-100 text-left" style="max-width: 600px;display: inline-block;">
          <div class="pt-3">
            <label class="form-label" for="name">Group Name</label>
            <b-form-input
                v-model="name"
                :state="inputState.name"
                id="name"
                trim
                size="sm">
            </b-form-input>
            <b-form-invalid-feedback>
              Enter at least 2 letters
            </b-form-invalid-feedback>
          </div>
          <div class="pt-3">
            <label class="form-label" for="description">Description</label>
            <b-form-input
                v-model="description"
                :state="inputState.description"
                id="description"
                trim
                size="sm">
            </b-form-input>
          </div>
        </div>
      </div>
    </b-overlay>
  </TenantHome>
</template>

<script>
import store from "../../store"
import TenantHome from "./TenantHome";

export default {
  name: "TenantGroups",
  store: store,
  components: {TenantHome},
  data() {
    return {
      processing: false,
      errors: [],

      name: null,
      description: null,

      inputFieldsList: ["name", "description"]
    };
  },
  computed: {
    clientId() {
      return this.$route.params.clientId;
    },
    inputState() {
      return {
        name: this.name === null ? null : this.isValid.name,
        description: this.description === null ? null : this.isValid.description,
      }
    },
    isValid() {
      return {
        name: !!this.name && this.name.length >= 2,
        description: true
      }
    },
    isFormValid() {
      let _isFormValid = true;
      for (let i = 0; i < this.inputFieldsList.length; i++) {
        _isFormValid = _isFormValid && this.isValid[this.inputFieldsList[i]];
      }

      return _isFormValid;
    },
    breadcrumbLinks() {
      return [
        {to: `/tenants/${this.clientId}/groups`, name: "Groups"},
        {to: `/tenants/${this.clientId}/groups/new`, name: "New"}
      ];
    }
  },
  methods: {
    makeFormVisited() {
      for (let i = 0; i < this.inputFieldsList.length; i++) {
        if (this[this.inputFieldsList[i]] === null) this[this.inputFieldsList[i]] = "";
      }
    },
    async create() {
      this.makeFormVisited()

      if (this.isFormValid) {
        this.processing = true;

        try {
          const groupId = await this.$store.dispatch("group/createGroup", {
            clientId: this.clientId,
            name: this.name,
            description: this.description,
            ownerId: this.$store.getters["auth/currentUsername"]
          });
          await this.$router.push(`/tenants/${this.clientId}/groups/${groupId}`);
        } catch (error) {
          this.errors.push({
            title: "Unknown error when creating the group.",
            source: error, variant: "danger"
          });
        }

        this.processing = false;
      }
    }
  }
}
</script>

<style scoped>

</style>