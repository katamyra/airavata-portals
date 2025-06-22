import {ciLogonService} from "../util/ci-logon.util";


const getDefaultState = () => {
    return {
        institutionsList: null
    }
}

const state = getDefaultState()

const actions = {
    async fetchInstitutions({commit}) {
        let institutionsList = await ciLogonService.getInstitutions();

        institutionsList = institutionsList.map(({DisplayName, EntityID, OrganizationName, RandS}) => {
            return {
                displayName: DisplayName,
                entityId: EntityID,
                organizationName: OrganizationName,
                randS: RandS
            };
        });

        commit("SET_INSTITUTIONS_LIST", {institutionsList})
    }
}


const mutations = {
    // SET_INSTITUTION(state, {displayName, entityId, organizationName, randS}) {
    //     state.institutionsMap = {
    //         ...state.institutionsMap,
    //         [entityId]: {displayName, entityId, organizationName, randS}
    //     }
    // },
    SET_INSTITUTIONS_LIST(state, {institutionsList}) {
        state.institutionsList = institutionsList;
    }
}

const getters = {
    // getInstitution: (state) => ({entityId}) => {
    //     if (state.institutionsMap[entityId]) {
    //         return state.institutionsMap[entityId];
    //     } else {
    //         return null;
    //     }
    // },
    getInstitutions(state) {
        return () => {
            if (state.institutionsList) {
                return state.institutionsList;
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