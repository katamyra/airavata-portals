import {custosService} from "../util/custos.util";

const getDefaultState = () => {
    return {
        entityMap: {},
        entityListMap: {}
    }
};

const state = getDefaultState();

const actions = {
    async fetchEntities({commit}, {clientId, ownerId}) {
        const params = {clientId, ownerId};
        const queryString = JSON.stringify(params);
        const entities = await custosService.entities.getEntities(params);
        const entityIds = entities.map(({id, type, name, description, parent_id, owner_id, created_at, updated_at, shared_count, full_text, binary_data}) => {
            commit('SET_ENTITY', {
                clientId,
                entityId: id,
                type,
                name,
                description,
                parentId: parent_id,
                ownerId: owner_id,
                createdAt: new Date(parseInt(created_at)).toLocaleString(),
                updatedAt: new Date(parseInt(updated_at)).toLocaleString(),
                sharedCount: shared_count,
                fullText: full_text,
                binaryData: binary_data
            });

            return id;
        });

        commit('SET_ENTITY_LIST', {queryString, entityIds});
    },
    async fetchEntity({commit}, {clientId, entityId}) {
        const params = {clientId, entityId};
        const entity = await custosService.entities.getEntity(params);
        commit('SET_ENTITY', {
            clientId,
            entityId: entity.id,
            type: entity.type,
            name: entity.name,
            description: entity.description,
            parentId: entity.parent_id,
            ownerId: entity.owner_id,
            createdAt: new Date(parseInt(entity.created_at)).toLocaleString(),
            updatedAt: new Date(parseInt(entity.updated_at)).toLocaleString(),
            sharedCount: entity.shared_count,
            fullText: entity.full_text,
            binaryData: entity.binary_data,
            metadata: entity.metadata,
            ext: entity.ext
        });
    },
    async createEntity(obj, {clientId, entityId, parentId, name, description, type, ownerId, fullText, binaryData, secretType, password}) {
        return await custosService.entities.createEntity({
            clientId, entityId, parentId, name, description, type, ownerId, fullText, binaryData, secretType, password
        });
    },
    async updateEntity(obj, {clientId, entityId, name, description, type, ownerId, fullText, binaryData}) {
        await custosService.entities.updateEntity({
            clientId, entityId, name, description, type, ownerId, fullText, binaryData
        });
    },
    async deleteEntity(obj, {clientId, entityId, name, description, type, ownerId}) {
        await custosService.entities.deleteEntity({clientId, entityId, name, description, type, ownerId});
    },
}

const mutations = {
    SET_ENTITY(state, {clientId, entityId, type, name, description, parentId, ownerId, createdAt, updatedAt, sharedCount, fullText, binaryData, metadata = {}, ext = {}}) {
        state.entityMap = {
            ...state.entityMap,
            [entityId]: {
                clientId,
                entityId,
                type,
                name,
                description,
                parentId,
                ownerId,
                createdAt,
                updatedAt,
                sharedCount,
                fullText,
                binaryData,
                metadata,
                ext
            }
        };
    },
    SET_ENTITY_LIST(state, {queryString, entityIds}) {
        state.entityListMap = {
            ...state.entityListMap,
            [queryString]: entityIds
        };
    }
}

const getters = {
    getEntity(state) {
        return ({entityId}) => {
            if (state.entityMap[entityId]) {
                return state.entityMap[entityId];
            } else {
                return null;
            }
        }
    },
    getEntities(state, getters) {
        return ({clientId, ownerId}) => {
            const params = {clientId, ownerId};
            const queryString = JSON.stringify(params);
            if (state.entityListMap[queryString]) {
                return state.entityListMap[queryString].map(entityId => getters.getEntity({entityId}));
            } else {
                return null;
            }
        }
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
