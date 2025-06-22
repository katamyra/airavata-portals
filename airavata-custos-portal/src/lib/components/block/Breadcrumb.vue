<template>
  <b-breadcrumb style="background: none;padding: 0px 0px;">
    <router-link v-for="(link, index) in links" :key="index" :to="link.to"
                 v-slot="{ href, route, navigate, isActive,isExactActive }" tag="">
      <b-breadcrumb-item :disabled="link.disabled === true" :href="href" :active="isExactActive" @click="navigate">
        {{ link.name }}
      </b-breadcrumb-item>
    </router-link>
  </b-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    links: {
      type: [Array],
      required: true
    }
  }
}
</script>

<style scoped>
ol {
  margin: 0px;
}

a.disabled, a.disabled:hover {
  text-decoration: line-through;
  color: #6c757d;
  cursor: initial;
}
</style>