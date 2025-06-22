import {custosService} from "../util/custos.util";

const getDefaultState = () => {
    return {
        permissionTypesMap: {},
        permissionTypesListMap: {},
        entityTypesMap: {},
        entityTypesListMap: {},
        entitySharedOwnersListMap: {},
        userHasAccessMap: {}
    }
};

const state = getDefaultState();

const actions = {
    async createPermissionType({commit}, {clientId, id, name, description = null}) {
        await custosService.sharing.createPermissionType({clientId, id, name, description});

        commit('SET_PERMISSION_TYPE', {clientId, id, name, description});
    },
    async deletePermissionType({commit}, {clientId, id, name, description = null}) {
        await custosService.sharing.deletePermissionType({clientId, id, name, description});

        commit('DELETE_PERMISSION_TYPE', {clientId, id, name, description});
    },
    async fetchPermissionTypes({commit}, {clientId}) {
        const permissionTypes = await custosService.sharing.getPermissionTypes({clientId});
        const permissionTypeIds = permissionTypes.map(({id, name, description}) => {
            commit('SET_PERMISSION_TYPE', {clientId, id, name, description});

            return {clientId, id};
        });

        commit('SET_PERMISSION_TYPES_LIST', {clientId, permissionTypeIds});
    },
    async createEntityType({commit}, {clientId, id, name, description = null}) {
        await custosService.sharing.createEntityType({clientId, id, name, description});

        commit('SET_ENTITY_TYPE', {clientId, id, name, description});
    },
    async deleteEntityType({commit}, {clientId, id, name, description = null}) {
        await custosService.sharing.deleteEntityType({clientId, id, name, description});

        commit('DELETE_ENTITY_TYPE', {clientId, id, name, description});
    },
    async fetchEntityTypes({commit}, {clientId}) {
        const entityTypes = await custosService.sharing.getEntityTypes({clientId});
        const entityTypeIds = entityTypes.map(({id, name, description}) => {
            commit('SET_ENTITY_TYPE', {clientId, id, name, description});

            return {clientId, id};
        });

        commit('SET_ENTITY_TYPES_LIST', {clientId, entityTypeIds});
    },
    async shareEntity(obj, {clientId, entityId, permissionTypeId, groupIds = [], usernames = [], sharedBy}) {
        await custosService.sharing.shareEntity({clientId, entityId, permissionTypeId, groupIds, usernames, sharedBy});
    },
    async dropEntitySharedOwner(obj, {clientId, entityId, permissionTypeId, groupIds = [], usernames = []}) {
        await custosService.sharing.dropEntitySharedOwner({clientId, entityId, permissionTypeId, groupIds, usernames});
    },
    async fetchSharedOwners({commit}, {clientId, entityId}) {
        let entitySharedUsersList = await custosService.sharing.getSharedOwners({clientId, entityId});
        entitySharedUsersList = entitySharedUsersList.map(({owner_id, owner_type, permissions}) => {
            return {ownerId: owner_id, ownerType: owner_type, permissions: permissions};
        });
        commit('SET_ENTITY_SHARED_USERS_LIST_MAP', {entityId, entitySharedUsersList});
    },
    async userHasAccess({commit}, {clientId, entityId, permissionTypeId, username}) {
        const queryString = JSON.stringify({clientId, entityId, permissionTypeId, username});
        const status = await custosService.sharing.userHasAccess({clientId, entityId, permissionTypeId, username});
        commit("SET_USER_HAS_ACCESS", {queryString, status});
    }
}

const mutations = {
    SET_USER_HAS_ACCESS(state, {queryString, status}) {
        state.userHasAccessMap = {
            ...state.userHasAccessMap,
            [queryString]: status
        };
    },
    SET_ENTITY_SHARED_USERS_LIST_MAP(state, {entityId, entitySharedUsersList}) {
        state.entitySharedOwnersListMap = {
            ...state.entitySharedOwnersListMap,
            [entityId]: entitySharedUsersList
        }
    },
    SET_PERMISSION_TYPE(state, {clientId, id, name, description}) {
        state.permissionTypesMap = {
            ...state.permissionTypesMap,
            [clientId]: {
                ...state.permissionTypesMap[clientId],
                [id]: {clientId, id, name, description}
            }
        };
    },
    DELETE_PERMISSION_TYPE(state, {clientId, id}) {
        state.permissionTypesListMap = {
            ...state.permissionTypesListMap,
            [clientId]: state.permissionTypesListMap[clientId].filter(permissionType => {
                return permissionType.id !== id;
            })
        };
    },
    SET_PERMISSION_TYPES_LIST(state, {clientId, permissionTypeIds}) {
        state.permissionTypesListMap = {
            ...state.permissionTypesListMap,
            [clientId]: permissionTypeIds
        };
    },
    SET_ENTITY_TYPE(state, {clientId, id, name, description}) {
        state.entityTypesMap = {
            ...state.entityTypesMap,
            [clientId]: {
                ...state.entityTypesMap[clientId],
                [id]: {clientId, id, name, description}
            }
        };
    },
    DELETE_ENTITY_TYPE(state, {clientId, id}) {
        state.entityTypesListMap = {
            ...state.entityTypesListMap,
            [clientId]: state.entityTypesListMap[clientId].filter(entityType => {
                return entityType.id !== id;
            })
        };
    },
    SET_ENTITY_TYPES_LIST(state, {clientId, entityTypeIds}) {
        state.entityTypesListMap = {
            ...state.entityTypesListMap,
            [clientId]: entityTypeIds
        };
    }
}

const getters = {
    getUserAccessStatus(state) {
        return ({clientId, entityId, permissionTypeId, username}) => {
            const queryString = JSON.stringify({clientId, entityId, permissionTypeId, username});
            if (state.userHasAccessMap[queryString]) {
                return state.userHasAccessMap[queryString];
            } else {
                return null;
            }
        }
    },
    getEntitySharedOwners(state) {
        return ({entityId}) => {
            if (state.entitySharedOwnersListMap[entityId]) {
                return state.entitySharedOwnersListMap[entityId];
            } else {
                return null;
            }
        }
    },
    getPermissionTypes(state, getters) {
        return ({clientId}) => {
            if (state.permissionTypesListMap[clientId]) {
                return state.permissionTypesListMap[clientId].map(({id}) => {
                    return getters.getPermissionType({clientId, id});
                });
            } else {
                return null;
            }
        }
    },
    getPermissionType(state) {
        return ({clientId, id}) => {
            if (state.permissionTypesMap[clientId] && state.permissionTypesMap[clientId][id]) {
                return state.permissionTypesMap[clientId][id];
            } else {
                return null;
            }
        }
    },
    getEntityTypes(state, getters) {
        return ({clientId}) => {
            if (state.entityTypesListMap[clientId]) {
                return state.entityTypesListMap[clientId].map(({id}) => {
                    return getters.getEntityType({clientId, id});
                });
            } else {
                return null;
            }
        }
    },
    getEntityType(state) {
        return ({clientId, id}) => {
            if (state.entityTypesMap[clientId] && state.entityTypesMap[clientId][id]) {
                return state.entityTypesMap[clientId][id];
            } else {
                return null;
            }
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
