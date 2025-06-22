import {custosService} from "../util/custos.util";
import config from "../../../config";

const getDefaultState = () => {
    return {
        tenantsMap: {},
        clientIdToTenantIdMap: {},
        tenantsListMap: {},
        tenantsListPaginationMap: {},
        tenantRolesMap: {},
        tenantRolesListMap: {}
    }
};

const state = getDefaultState();

const actions = {
    async fetchTenantSecret({commit}, {clientId}) {
        const clientSecret = await custosService.identity.getClientSecret({clientId});

        commit('SET_TENANT_SECRET', {clientId, clientSecret});
    },
    async fetchTenants({commit, rootGetters}, {limit, offset, status, requesterEmail, parentTenantId, parentClientId}) {
        const params = {limit, offset, status, requesterEmail, parentTenantId, parentClientId};
        const queryString = JSON.stringify(params);

        let {tenant, total_num_of_tenants} = await custosService.tenants.fetchTenants(params);
        const tenantIds = tenant.map(({tenant_id, tenant_status, client_name, domain, client_id, parent_tenant_id, admin_username, requester_email}) => {
            let type = "CHILD_TENANT";
            let hasAdminPrivileges = false;
            let currentUsername = rootGetters["auth/currentUsername"];

            // TODO fix
            if (client_id === config.value('superClientId')) {
                type = "SUPER_TENANT";
            } else if (parent_tenant_id === "0") {
                type = "ADMIN_TENANT";
            }

            if (currentUsername === admin_username) {
                hasAdminPrivileges = true;
            }

            commit('SET_TENANT', {
                tenantId: tenant_id,
                status: tenant_status,
                name: client_name,
                domain,
                clientId: client_id,
                type,
                hasAdminPrivileges,
                adminUsername: admin_username,
                requesterEmail: requester_email
            });

            return tenant_id;
        });
        commit('SET_TENANT_LIST', {queryString, tenantIds});

        const pagination = {totalRows: total_num_of_tenants, perPage: limit, activePage: offset + 1};
        commit('SET_TENANT_LIST_PAGINATION', {queryString, pagination});
    },


    async fetchTenant({commit, rootGetters}, {clientId}) {
        let tenant = await custosService.tenants.fetchTenant({clientId});

        const {
            admin_username, admin_first_name, admin_last_name, admin_email,
            tenant_id, tenant_status, client_name, domain,
            redirect_uris, scope, client_uri, logo_uri, comment, application_type,
            parent_tenant_id, requester_email
        } = tenant;

        let type = "CHILD_TENANT";
        let hasAdminPrivileges = false;
        let currentUsername = rootGetters["auth/currentUsername"];

        // TODO fix
        if (clientId === config.value('superClientId')) {
            type = "SUPER_TENANT";
        } else if (parent_tenant_id === "0") {
            type = "ADMIN_TENANT";
        }

        if (currentUsername === admin_username) {
            hasAdminPrivileges = true;
        }

        commit('SET_TENANT', {
            username: admin_username, firstName: admin_first_name, lastName: admin_last_name, email: admin_email,
            tenantId: tenant_id, status: tenant_status, name: client_name, domain, clientId,
            redirectUris: redirect_uris, scope: scope, clientUri: client_uri,
            logoUri: logo_uri, comment: comment, applicationType: application_type,
            type, hasAdminPrivileges,
            adminUsername: admin_username, requesterEmail: requester_email
        });
    },
    async createTenantRole({commit}, {clientId, name, description, composite = false, clientLevel = false}) {
        const {id} = await custosService.tenants.createTenantRole({
            clientId, name, description, composite, clientLevel
        });

        commit('SET_TENANT_ROLE', {
            tenantRoleId: id,
            name,
            description,
            composite
        });
    },
    async deleteTenantRole(obj, {clientId, name, clientLevel = false}) {
        await custosService.tenants.deleteTenantRole({
            clientId, name, clientLevel
        });
    },
    async fetchTenantRoles({commit}, {clientId, clientLevel = false}) {
        const DEFAULT_CUSTOS_ROLES = [
            // "admin-read-only", "admin", "gateway-provider", "gateway-user", "offline_access",
            // "uma_authorization", "user-pending"
        ];

        let queryString = JSON.stringify({clientId, clientLevel});

        let {data: {roles}} = await custosService.tenants.fetchTenantRoles({clientId, clientLevel});
        const tenantRoleIds = roles.filter(({name}) => {
            return DEFAULT_CUSTOS_ROLES.indexOf(name) < 0
        }).map(({id, name, description, composite}) => {
            const tenantRoleId = id
            commit('SET_TENANT_ROLE', {tenantRoleId, name, description, composite});

            return tenantRoleId;
        });
        commit('SET_TENANT_ROLES_LIST', {queryString, tenantRoleIds});
    },
    async createTenant(o, {username, firstName, lastName, email, password, tenantName, redirectUris, scope, domain, clientUri, logoUri, comment, applicationType, parentClientId, parentClientSecret}) {
        const res = await custosService.tenants.createTenant({
            username,
            firstName,
            lastName,
            email,
            password,
            tenantName,
            redirectUris,
            scope,
            domain,
            clientUri,
            logoUri,
            comment,
            applicationType,
            parentClientId,
            parentClientSecret
        });

        const {client_id, client_secret} = res.data;

        return {clientId: client_id, clientSecret: client_secret}
    },

    async updateTenant(o, {tenantId, clientId, username, firstName, lastName, email, password, tenantName, redirectUris, scope, domain, clientUri, logoUri, comment, applicationType, requesterEmail}) {
        await custosService.tenants.updateTenant({
            tenantId,
            clientId,
            username,
            firstName,
            lastName,
            email,
            password,
            tenantName,
            redirectUris,
            scope,
            domain,
            clientUri,
            logoUri,
            comment,
            applicationType,
            requesterEmail
        });
    },
    async updateTenantStatus({commit}, {clientId, status}) {
        await custosService.tenants.updateTenantStatus({clientId, status});
        commit('SET_TENANT_STATUS', {clientId, status});
    }

}

const mutations = {
    SET_TENANT(state, {
        username = null, firstName = null, lastName = null, email = null,
        tenantId, status, name, domain, clientId, redirectUris = null, scope = null,
        clientUri = null, logoUri = null, comment = null, applicationType = null,
        type, hasAdminPrivileges, adminUsername, requesterEmail
    }) {
        state.tenantsMap = {
            ...state.tenantsMap,
            [clientId]: {
                ...state.tenantsMap[clientId],
                username, firstName, lastName, email,
                tenantId, status, name, domain, clientId,
                redirectUris, scope, clientUri, logoUri, comment, applicationType,
                type, hasAdminPrivileges, adminUsername, requesterEmail
            }
        };
        state.clientIdToTenantIdMap = {
            ...state.clientIdToTenantIdMap,
            [tenantId]: clientId
        };
    },
    SET_TENANT_SECRET(state, {clientId, clientSecret}) {
        state.tenantsMap = {
            ...state.tenantsMap,
            [clientId]: {
                ...state.tenantsMap[clientId],
                clientSecret
            }
        };
    },
    SET_TENANT_STATUS(state, {clientId, status}) {
        state.tenantsMap = {
            ...state.tenantsMap,
            [clientId]: {
                ...state.tenantsMap[clientId],
                status
            }
        };
    },
    SET_TENANT_LIST(state, {queryString, tenantIds}) {
        state.tenantsListMap = {
            ...state.tenantsListMap,
            [queryString]: tenantIds
        }
    },
    SET_TENANT_LIST_PAGINATION(state, {queryString, pagination}) {
        state.tenantsListPaginationMap = {
            ...state.tenantsListPaginationMap,
            [queryString]: pagination
        }
    },
    SET_TENANT_ROLE(state, {tenantRoleId, name, description, composite}) {
        state.tenantRolesMap = {
            ...state.tenantRolesMap,
            [tenantRoleId]: {tenantRoleId, name, description, composite}
        };
    },
    SET_TENANT_ROLES_LIST(state, {queryString, tenantRoleIds}) {
        state.tenantRolesListMap = {
            ...state.tenantRolesListMap,
            [queryString]: tenantRoleIds
        }
    }
}

const getters = {
    getTenants(state, getters) {
        return ({limit, offset, status, requesterEmail, parentTenantId, parentClientId}) => {
            const queryString = JSON.stringify({limit, offset, status, requesterEmail, parentTenantId, parentClientId});
            if (state.tenantsListMap[queryString]) {
                const r = state.tenantsListMap[queryString].map(tenantId => getters.getTenant({tenantId}));

                return r
            } else {
                return null;
            }
        }
    },
    getTenantsPagination(state) {
        return ({limit, offset, status, requesterEmail, parentTenantId, parentClientId}) => {
            const queryString = JSON.stringify({limit, offset, status, requesterEmail, parentTenantId, parentClientId});
            if (state.tenantsListPaginationMap[queryString]) {
                return state.tenantsListPaginationMap[queryString];
            } else {
                return null;
            }
        }
    },
    getTenant(state) {
        return ({tenantId, clientId}) => {
            if (state.clientIdToTenantIdMap[tenantId]) {
                return state.tenantsMap[state.clientIdToTenantIdMap[tenantId]];
            } else if (state.tenantsMap[clientId]) {
                return state.tenantsMap[clientId];
            } else {
                return null;
            }
        }
    },
    getTenantRoles(state, getters) {
        return ({clientId, clientLevel = false}) => {
            const queryString = JSON.stringify({clientId, clientLevel});
            if (state.tenantRolesListMap[queryString]) {
                return state.tenantRolesListMap[queryString].map(tenantRoleId => getters.getTenantRole({tenantRoleId}));
            } else {
                return null;
            }
        }
    },
    getTenantRole(state) {
        return ({tenantRoleId}) => {
            if (state.tenantRolesMap[tenantRoleId]) {
                return state.tenantRolesMap[tenantRoleId];
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
