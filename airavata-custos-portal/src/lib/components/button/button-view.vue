<template>
  <div style="display: flex; flex-direction: row;">
    <div style="flex: 1;">
      <slot v-if="show" name="content-when-view"></slot>
      <slot v-else name="content-when-hide"></slot>
    </div>
    <b-button variant="link-secondary" class="ml-2" size="sm" v-on:click="show = !show" v-b-tooltip.hover
              :title="show? 'Hide' : 'Show'">
      <b-icon v-if="show" icon="eye-slash"/>
      <b-icon v-else icon="eye"/>
    </b-button>
  </div>
</template>

<script>
export default {
  name: "button-view",
  props: {
    value: {}
  },
  data() {
    return {
      show: false
    }
  }
}
</script>

<style scoped>

</style>