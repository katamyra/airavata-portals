<template>
  <b-button variant="link-secondary" class="ml-2" size="sm" v-on:click="copy" v-b-tooltip.hover title="Copy">
    <b-icon icon="clipboard"/>
    <input style="position: fixed; top: -1000px;" type="text" :value="value" ref="copyValueRef">
  </b-button>
</template>

<script>
export default {
  name: "button-copy",
  props: {
    value: {}
  },
  methods: {
    copy() {
      this.$refs.copyValueRef.select();
      document.execCommand("copy");
    }
  }
}
</script>

<style scoped>

</style>