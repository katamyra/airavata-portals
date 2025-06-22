<template>
  <TenantHome :title="this.parentId?'New Child Entity':'New Entity'" :breadcrumb-links="breadcrumbLinks"
              :errors="errors">
    <template #header-right>
      <b-button variant="primary" v-on:click="create">Create</b-button>
    </template>
    <b-overlay :show="processing">
      <div class="p-2 text-center">
        <div class="w-100 text-left" style="max-width: 600px;display: inline-block;">
          <div v-if="this.parentId" class="pt-3">
            <label class="form-label" for="parentId"> Parent ID</label>
            <b-form-input
                :readonly="true"
                v-model="parentId"
                :state="this.parentId"
                id="parentId"
                trim
                size="sm">
            </b-form-input>
          </div>
          <div class="pt-3">
            <label class="form-label" for="name">Entity Name</label>
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

          <div class="pt-3">
            <label class="form-label" for="entityTypeId">Entity Type</label>
            <button-overlay :show="!entityTypes" class="w-100">
              <p class="w-100" v-if="entityTypes && entityTypes.length === 0">
                There's no entity types available.
                <router-link :to="`/tenants/${this.clientId}/entity-types/new`">Create New Entity Type</router-link>
              </p>
              <b-form-select
                  v-model="entityTypeId"
                  :state="inputState.entityTypeId"
                  id="entityTypeId"
                  trim
                  size="sm"
                  :disabled="entityTypes && entityTypes.length === 0">
                <b-form-select-option v-for="(entityType, entityTypeIndex) in entityTypes" :key="entityTypeIndex"
                                      :value="entityType.id">
                  {{ entityType.id }} - {{ entityType.name }} - {{ entityType.description }}
                </b-form-select-option>
              </b-form-select>
            </button-overlay>
          </div>

          <div class="pt-3" v-if="entityTypeId === 'SECRET'">
            <label class="form-label" for="secretType">Secret Type</label>
            <b-form-radio-group
                v-model="secretType"
                :options="availableSecretTypes"
                id="secretType"
                trim
                size="sm">
            </b-form-radio-group>
          </div>

          <div class="pt-3" v-if="secretType === 'PASSWORD'">
            <label class="form-label" for="password">Password</label>
            <b-form-input
                v-model="password"
                :state="inputState.password"
                id="password"
                type="password"
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
import ButtonOverlay from "../overlay/button-overlay";

export default {
  name: "TenantEntities",
  store: store,
  components: {ButtonOverlay, TenantHome},
  data() {
    return {
      processing: false,
      errors: [],

      name: null,
      description: null,
      entityTypeId: null,
      secretType: "SSH",

      password: null,

      availableSecretTypes: ["SSH", "PASSWORD"]
    };
  },
  computed: {
    inputFieldsList() {
      if (this.entityTypeId === "SECRET") {
        if (this.secretType === "PASSWORD") {
          return ["name", "description", "entityTypeId", "secretType", "password"]
        } else {
          return ["name", "description", "entityTypeId", "secretType"]
        }
      } else {
        return ["name", "description", "entityTypeId"];
      }
    },
    clientId() {
      return this.$route.params.clientId;
    },
    parentId() {
      return this.$route.query.entityId;
    },
    inputState() {
      return {
        name: this.name === null ? null : this.isValid.name,
        description: this.description === null ? null : this.isValid.description,
        entityTypeId: this.entityTypeId === null ? null : this.isValid.entityTypeId,
        password: this.password === null ? null : this.isValid.password,
        secretType: this.secretType === null ? null : this.isValid.secretType,
      }
    },
    isValid() {
      return {
        name: !!this.name && this.name.length >= 2,
        description: true,
        entityTypeId: !!this.entityTypeId,
        password: !!this.password,
        secretType: !!this.secretType
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
        {to: `/tenants/${this.clientId}/entities`, name: "Entities"},
        {to: `/tenants/${this.clientId}/entities/new`, name: "New"}
      ];
    },
    entityTypes() {
      return this.$store.getters["sharing/getEntityTypes"]({clientId: this.clientId});
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
          await this.$store.dispatch("entity/createEntity", {
            entityId: `${this.clientId}_${window.performance.now()}`,
            clientId: this.clientId,
            parentId: this.parentId,
            name: this.name,
            description: this.description,
            type: this.entityTypeId,
            ownerId: this.$store.getters["auth/currentUsername"],
            secretType: this.secretType,
            password: this.password
          });
          await this.$router.push(`/tenants/${this.clientId}/entities`);
        } catch (error) {
          this.errors.push({
            title: "Unknown error when creating the entity.",
            source: error, variant: "danger"
          });
        }

        this.processing = false;
      }
    }
  },
  beforeMount() {
    this.$store.dispatch("sharing/fetchEntityTypes", {clientId: this.clientId});
  }
}
</script>

<style scoped>

</style>