<template>
  <vue-typeahead-bootstrap
      v-model="usernameSearch"
      :data="typeheadData"
      :serializer="item => item.username ? item.username : item.name"
      @hit="selectSearchResult"
  >
    <template slot="suggestion" slot-scope="{ data, htmlText }">
      <small v-if="!data.username" style="font-size: 10px">GROUP <br/></small>
      <span v-html="htmlText"></span>
    </template>
  </vue-typeahead-bootstrap>
</template>

<script>
export default {
  name: "user-tenant-roles-select",

}
</script>

<style scoped>

</style>