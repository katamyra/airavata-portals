<template>
  <TenantHome title="Entities" :breadcrumb-links="breadcrumbLinks" :errors="errors">
    <template #header-right>
      <router-link :to="`/tenants/${clientId}/entities/new`" v-slot="{href, navigate}" tag="">
        <b-button variant="primary" @click="navigate">Create New Entity</b-button>
      </router-link>
    </template>
    <table-overlay-info :rows="5" :columns="1" :data="entityIds">
      <b-table-simple>
        <b-thead>
          <b-tr>
            <b-th>Entity ID</b-th>
            <b-th>Name</b-th>
            <b-th>Type</b-th>
            <b-th>Description</b-th>
            <b-th>Created</b-th>
            <b-th>Last Updated</b-th>
            <b-th>Owner</b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <template v-for="(entityId, entityIndex) in entityIds">
            <b-tr :key="entityIndex" v-if="entityChildrenExpanded[entityMap[entityId].parentId]">
              <!-- column One -->
              <b-td>
                <div style="display: flex; flex-direction: row;">
                  <div :style="`padding-right: ${entityIndent[entityId] * 20}px;`"></div>
                  <div style="width: 36px;">
                    <div v-if="hasChildren(entityMap[entityId])">
                      <b-button v-if="entityChildrenExpanded[entityId]" variant="link" size="sm"
                                v-on:click="onClickCollapse(entityMap[entityId])" v-b-tooltip.hover title="Collapse">
                        <b-icon icon="chevron-down"></b-icon>
                      </b-button>
                      <b-button v-else variant="link" size="sm" v-on:click="onClickExpand(entityMap[entityId])"
                                v-b-tooltip.hover title="Collapse">
                        <b-icon icon="chevron-right"></b-icon>
                      </b-button>
                    </div>
                  </div>
                  <div style="flex: 1;">
                    <router-link :to="`/tenants/${clientId}/entities/${entityId}`" v-slot="{href, navigate}">
                      <b-link :href="href" v-on:click="navigate">{{ entityId }}</b-link>
                    </router-link>
                  </div>
                  <button-copy :value="entityId"/>
                </div>
              </b-td>
              <!-- Column Two -->
              <b-td>{{ entityMap[entityId].name }}</b-td>
              <!-- Column Three -->
              <b-td>{{ entityMap[entityId].type }}</b-td>
              <!-- Column Four -->
              <b-td>{{ entityMap[entityId].description }}</b-td>
              <!-- Column Five -->
              <b-td>{{ entityMap[entityId].createdAt }}</b-td>
              <!-- Column Six -->
              <b-td>{{ entityMap[entityId].updatedAt }}</b-td>
              <!-- Column Seven -->
              <b-td>{{ entityMap[entityId].ownerId }}</b-td>
              <!-- Column Eight -->
              <b-td>
                <div style="display: flex; flex-direction: row;">
                  <div>
                    <!-- Create Child Entity Button -->
                    <router-link :to="{name:'create_entity', query:{ entityId:`${entityId}`}}"
                                 v-slot="{href, navigate}"
                                 tag="">
                      <b-button variant="link" size="sm" v-on:click="navigate" v-b-tooltip.hover
                                title="Create Child Entity">
                        <b-icon icon="folder-plus"></b-icon>
                        <!-- <v-icon>mdi-pl?us</v-icon> -->
                      </b-button>
                    </router-link>
                  </div>
                  <div>
                    <!-- Share Entity Button -->
                    <b-button variant="link" size="sm" v-b-modal="`modal-select-users-or-groups-${entityIndex}`"
                              v-b-tooltip.hover
                              title="Share">
                      <span style="display: flex; flex-direction: row;">
                        <span style="padding-right: 4px;">{{ entityMap[entityId].sharedCount }}</span>
                      <b-icon icon="share"></b-icon>
                      </span>
                    </b-button>
                    <!-- Modal Share Entity -->
                    <modal-share-entity
                        :client-id="clientId" :entity-id="entityId"
                        :modal-id="`modal-select-users-or-groups-${entityIndex}`"
                        :title="`Share Entity '${entityMap[entityId].name}'`"
                        v-on:close="refreshData"
                    />
                  </div>
                  <div>
                    <!-- Delete Entity Button -->
                    <button-overlay :show="processingDelete[entityId]">
                      <button-delete-after-confirmation variant="link" size="sm"
                                                        v-on:click="onClickDelete(entityMap[entityId])"
                                                        v-b-tooltip.hover title="Delete">
                        <b-icon icon="trash"></b-icon>
                      </button-delete-after-confirmation>
                    </button-overlay>
                  </div>
                </div>


              </b-td>
            </b-tr>
          </template>
        </b-tbody>
      </b-table-simple>

      <!--    <b-pagination-->
      <!--        size="sm"-->
      <!--        class="float-right"-->
      <!--        v-model="activePage"-->
      <!--        :total-rows="tenantsPagination.totalRows"-->
      <!--        :per-page="tenantsPagination.perPage"-->
      <!--        aria-controls="my-table"-->
      <!--        :value="activePage"-->
      <!--    ></b-pagination>-->
    </table-overlay-info>
  </TenantHome>
</template>

<script>
import store from "../../store"
import TenantHome from "./TenantHome";
import TableOverlayInfo from "../overlay/table-overlay-info";
import ModalShareEntity from "../modals/modal-share-entity";
import ButtonOverlay from "../overlay/button-overlay";
import ButtonCopy from "../button/button-copy";
import ButtonDeleteAfterConfirmation from "../button/button-delete-after-confirmation";

export default {
  name: "TenantEntities",
  store: store,
  components: {
    ButtonDeleteAfterConfirmation,
    ButtonCopy,
    ButtonOverlay,
    ModalShareEntity,
    TableOverlayInfo,
    TenantHome
  },
  data() {
    return {
      processingDelete: {},
      errors: [],

      entityIds: null,
      entityMap: {},
      entityIndent: {},
      entityChildrenIds: {},
      entityChildrenMapped: {},
      entityChildrenExpanded: {
        [""]: true
      }
    }
  },
  computed: {
    clientId() {
      return this.$route.params.clientId;
    },
    allEntities() {
      return this.$store.getters["entity/getEntities"]({clientId: this.clientId, ownerId: this.currentUsername});
    },
    breadcrumbLinks() {
      return [{to: `/tenants/${this.clientId}/entities`, name: "Entities"}];
    },
    currentUsername() {
      return this.$store.getters["auth/currentUsername"];
    }
  },
  watch: {
    allEntities() {
      const entityIds = [];
      const entityMap = {};
      const entityIndent = {};
      const entityChildrenIds = {};
      const entityChildrenMapped = {};
      if (this.allEntities) {
        for (let i = 0; i < this.allEntities.length; i++) {
          const entity = this.allEntities[i];
          entityMap[entity.entityId] = entity;
          entityChildrenMapped[entity.entityId] = false;
          if (!entityChildrenIds[entity.parentId]) {
            entityChildrenIds[entity.parentId] = [entity.entityId];
          } else {
            entityChildrenIds[entity.parentId].push(entity.entityId);
          }

          if (!entity.parentId) {
            entityIds.push(entity.entityId);
            entityIndent[entity.entityId] = 0;
          }
        }
      }

      this.entityIds = entityIds;
      this.entityMap = entityMap;
      this.entityIndent = entityIndent;
      this.entityChildrenIds = entityChildrenIds;
      this.entityChildrenMapped = entityChildrenMapped;

    }
  },
  methods: {
    rootEntities() {
      return this.childEntities({entityId: null});
    },
    hasChildren(parentEntity) {
      return this.entityChildrenIds[parentEntity.entityId] && this.entityChildrenIds[parentEntity.entityId].length > 0;
    },
    childEntities(parentEntity) {
      return this.entities ? [] :
          this.entities.filter((entity) => {
            return entity.parentId === parentEntity.entityId;
          });
    },
    onClickExpand({entityId}) {
      if (!this.entityChildrenMapped[entityId]) {
        let entityIds = [];
        let entityIndent = {...this.entityIndent};
        for (let i = 0; i < this.entityIds.length; i++) {
          entityIds.push(this.entityIds[i]);
          if (this.entityIds[i] === entityId && this.hasChildren(this.entityMap[this.entityIds[i]])) {
            for (let j = 0; j < this.entityChildrenIds[entityId].length; j++) {
              entityIds.push(this.entityChildrenIds[entityId][j]);
              entityIndent[this.entityChildrenIds[entityId][j]] = entityIndent[entityId] + 1;
            }
          }
        }
        this.entityIds = entityIds;
        this.entityIndent = entityIndent;
        this.entityChildrenMapped = {...this.entityChildrenMapped, [entityId]: true};
      }
      this.entityChildrenExpanded = {...this.entityChildrenExpanded, [entityId]: true};
    },
    onClickCollapse({entityId}) {
      this.entityChildrenExpanded = {...this.entityChildrenExpanded, [entityId]: false};
    },
    async onClickDelete({entityId, name, description, type, ownerId}) {
      this.processingDelete = {...this.processingDelete, [entityId]: true};

      try {
        await this.$store.dispatch("entity/deleteEntity", {
          clientId: this.clientId,
          entityId,
          name,
          description,
          type,
          ownerId
        });
        this.refreshData();
      } catch (error) {
        this.errors.push({
          title: `Unknown error when deleting the entity '${entityId}'.`,
          source: error, variant: "danger"
        });
      }

      this.processingDelete = {...this.processingDelete, [entityId]: false};
    },
    refreshData() {
      this.$store.dispatch("entity/fetchEntities", {clientId: this.clientId, ownerId: this.currentUsername});
    }
  },
  mounted() {
    this.refreshData();
  }
}
</script>

<style scoped>

</style>