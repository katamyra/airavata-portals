<template>
  <TenantHome title="New Entity Types" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <b-button variant="primary" v-on:click="onSaveClick">Save</b-button>
    </template>
    <b-overlay :show="processing">
      <div class="p-2 text-center">
        <div class="w-100 text-left" style="max-width: 500px;display: inline-block">
          <div class="pt-3">
            <label class="form-label" for="name">ID</label>
            <b-form-input
                v-model="id"
                :state="inputState.id"
                id="id"
                trim
                size="sm">
            </b-form-input>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>
          <div class="pt-3">
            <label class="form-label" for="name">Name</label>
            <b-form-input
                v-model="name"
                :state="inputState.name"
                id="name"
                trim
                size="sm">
            </b-form-input>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>
          <div class="pt-3">
            <label class="form-label" for="description">Description</label>
            <b-form-input
                v-model="description"
                :state="inputState.description"
                type="email"
                id="description"
                trim
                size="sm">
            </b-form-input>
            <b-form-invalid-feedback>
            </b-form-invalid-feedback>
          </div>
        </div>
      </div>
    </b-overlay>
  </TenantHome>
</template>

<script>
import TenantHome from "./TenantHome";
import store from "../../store";

export default {
  name: "TenantNewEntityType",
  components: {TenantHome},
  store: store,
  data() {
    return {
      processing: false,
      errors: [],

      id: null,
      name: null,
      description: null,

      inputFieldsList: ["id", "name", "description"]
    }
  },
  computed: {
    clientId() {
      return this.$route.params.clientId;
    },
    breadcrumbLinks() {
      return [
        {to: `/tenants/${this.clientId}/entity-types`, name: "Entity Types"},
        {to: `/tenants/${this.clientId}/entity-types/new`, name: "New"}
      ];
    },
    inputState() {
      return {
        id: this.id === null ? null : this.isValid.id,
        name: this.name === null ? null : this.isValid.name,
        description: this.description === null ? null : this.isValid.description
      }
    },
    isValid() {
      return {
        id: !!this.id && this.id.length > 0,
        name: !!this.name && this.name.length > 0,
        description: true
      }
    },
    isFormValid() {
      let _isFormValid = true;
      for (let i = 0; i < this.inputFieldsList.length; i++) {
        _isFormValid = _isFormValid && this.isValid[this.inputFieldsList[i]];
      }

      return _isFormValid;
    }
  },
  methods: {
    makeFormVisited() {
      for (let i = 0; i < this.inputFieldsList.length; i++) {
        if (this[this.inputFieldsList[i]] === null) this[this.inputFieldsList[i]] = "";
      }
    },
    async onSaveClick() {
      this.makeFormVisited();
      if (this.isFormValid) {
        this.processing = true;

        try {
          await this.$store.dispatch("sharing/createEntityType", {
            clientId: this.clientId,
            id: this.id,
            name: this.name,
            description: this.description
          });
          await this.$router.push(`/tenants/${this.clientId}/entity-types`);
        } catch (error) {
          this.errors.push({
            title: "Unknown error when creating the entity type.",
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