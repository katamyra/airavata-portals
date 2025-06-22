<template>
  <div>
    <div v-if="entity.metadata.type === 'SSH'">
      <div style="flex: 1;" class="ml-2">
        <label class="form-label" for="passphrase">Passphrase</label>
        <div style="display: flex; flex-direction: row;">
          <button-view style="flex: 1;">
            <template #content-when-hide>
              <b-form-input
                  v-model="entity.ext.passphrase"
                  type="password"
                  id="clientId"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
            <template #content-when-view>
              <b-form-input
                  v-model="entity.ext.passphrase"
                  id="clientId"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
          </button-view>
          <button-copy :value="entity.ext.passphrase"/>
        </div>
        <b-form-invalid-feedback>
        </b-form-invalid-feedback>
      </div>

      <div style="flex: 1;" class="ml-2">
        <label class="form-label" for="public_key">Public Key</label>
        <div style="display: flex; flex-direction: row;">
          <button-view style="flex: 1;">
            <template #content-when-hide>
              <b-form-input
                  v-model="entity.ext.public_key"
                  type="password"
                  id="public_key"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
            <template #content-when-view>
              <b-form-input
                  v-model="entity.ext.public_key"
                  id="public_key"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
          </button-view>
          <button-copy :value="entity.ext.public_key"/>
        </div>
        <b-form-invalid-feedback>
        </b-form-invalid-feedback>
      </div>

      <div style="flex: 1;" class="ml-2">
        <label class="form-label" for="private_key">Private Key</label>
        <div style="display: flex; flex-direction: row;">
          <button-view style="flex: 1;">
            <template #content-when-hide>
              <b-form-input
                  v-model="entity.ext.private_key"
                  type="password"
                  id="private_key"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
            <template #content-when-view>
              <b-form-input
                  v-model="entity.ext.private_key"
                  id="private_key"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
          </button-view>
          <button-copy :value="entity.ext.private_key"/>
        </div>
        <b-form-invalid-feedback>
        </b-form-invalid-feedback>
      </div>

    </div>
    <div v-else-if="entity.metadata.type === 'PASSWORD'">
      <div style="flex: 1;" class="ml-2">
        <label class="form-label" for="password">Password</label>
        <div style="display: flex; flex-direction: row;">
          <button-view style="flex: 1;">
            <template #content-when-hide>
              <b-form-input
                  v-model="entity.ext.password"
                  type="password"
                  id="clientId"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
            <template #content-when-view>
              <b-form-input
                  v-model="entity.ext.password"
                  id="clientId"
                  size="sm"
                  readonly>
              </b-form-input>
            </template>
          </button-view>
          <button-copy :value="entity.ext.password"/>
        </div>
        <b-form-invalid-feedback>
        </b-form-invalid-feedback>
      </div>
    </div>
  </div>
</template>

<script>
import store from "../../../store";
import ButtonView from "../../button/button-view";
import ButtonCopy from "../../button/button-copy";

export default {
  name: "entity-view-secret",
  components: {ButtonView, ButtonCopy},
  store: store,
  props: {
    clientId: {},
    entityId: {}
  },
  computed: {
    entity() {
      return this.$store.getters["entity/getEntity"]({entityId: this.entityId})
    }
  }
}
</script>

<style scoped>

</style>