<template>
  <b-button :variant="variant" :size="size" :disabled="disabled" v-on:click="onClickDelete" v-b-tooltip.hover
            :title="title">
    <slot>
      <b-icon icon="trash"/>
    </slot>
    <b-modal ref="delete-confirmation-modal" size="md">
      <template #modal-title>
        <slot name="delete-confirmation-modal-title">
          Delete Confirmation
        </slot>
      </template>
      <slot name="delete-confirmation-modal-body">
        <p>This action cannot be undone.</p>
      </slot>
      <template #modal-footer="{close}">
        <button-overlay :show="processing">
          <b-button variant="danger" size="sm" v-on:click="onClickProceedDelete">Delete</b-button>
        </button-overlay>
        <b-button variant="secondary" size="sm" @click="close">Cancel</b-button>
      </template>
    </b-modal>
  </b-button>
</template>

<script>
import ButtonOverlay from "../overlay/button-overlay";

export default {
  name: "button-delete-after-confirmation",
  components: {ButtonOverlay},
  props: {
    variant: {
      default: "default"
    },
    size: {
      default: ""
    },
    disabled: {
      default: false
    },
    title: {}
  },
  data() {
    return {
      processing: false
    }
  },
  methods: {
    onClickDelete() {
      this.$refs["delete-confirmation-modal"].show();
    },
    onClickProceedDelete() {
      this.processing = true;
      this.$emit("click");
      this.processing = false;

      this.$refs["delete-confirmation-modal"].hide();
    }
  }
}
</script>

<style scoped>

</style>