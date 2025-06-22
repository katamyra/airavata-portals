import {custosService} from "../util/custos.util";

const getDefaultState = () => {
    return {
        userMap: {},
        userListMap: {}
    }
}

const state = getDefaultState()

const actions = {
    async fetchUsers({commit}, {username = null, offset = 0, limit = 10, groupId = null, tenantId = null, clientId = null}) {
        const params = {username, offset, limit, groupId, tenantId, clientId};
        const queryString = JSON.stringify(params);
        const users = await custosService.users.findUsers(params);

        const usernames = users.map((
            {id, username, first_name, last_name, email, realm_roles, client_roles, attributes, membership_type, state}
        ) => {
            commit("SET_USER", {
                clientId,
                id,
                username,
                firstName: first_name,
                lastName: last_name,
                email,
                realmRoles: realm_roles,
                clientRoles: client_roles,
                attributes,
                membershipType: membership_type,
                status: state
            });

            return username;
        });

        commit("SET_USER_LIST", {clientId, queryString, usernames})
    },
    async enableUser({commit}, {clientId, username}) {
        await custosService.users.enableUser({clientId, username});
        commit("SET_USER_STATUS", {clientId, username, status: "ACTIVE"});
    },
    async disableUser({commit}, {clientId, username}) {
        await custosService.users.disableUser({clientId, username});
        commit("SET_USER_STATUS", {clientId, username, status: "CONFIRMED"});
    },
    async addRolesToUser(obj, {clientId, username, realmRoles, clientLevel}) {
        await custosService.users.addRolesToUser({
            clientId,
            roles: realmRoles,
            usernames: [username],
            clientLevel: clientLevel
        });
    },
    async updateUser({commit, getters}, {clientId, username, firstName, lastName, email, realmRoles, clientRoles, attributes, deletedAttributes}) {
        if (deletedAttributes && deletedAttributes.length > 0) {
            await custosService.users.deleteUserAttributes({
                clientId,
                attributes: deletedAttributes,
                usernames: [username]
            });
        }

        if (attributes && attributes.length > 0) {
            await custosService.users.addUserAttribute({clientId, attributes, usernames: [username]});
        }

        if (realmRoles && realmRoles.length > 0) {
            await custosService.users.addRolesToUser({
                clientId,
                roles: realmRoles,
                usernames: [username],
                clientLevel: false
            });

            const realmRolesToBeDeleted = getters.getUser({
                clientId, username
            }).realmRoles.filter(realmRole => realmRoles.indexOf(realmRole) < 0);

            if (realmRolesToBeDeleted.length > 0) {
                await custosService.users.deleteRolesFromUser({
                    clientId,
                    roles: realmRolesToBeDeleted,
                    username: username,
                    clientLevel: false
                });
            }
        }

        if (clientRoles && clientRoles.length > 0) {
            await custosService.users.addRolesToUser({
                clientId,
                roles: clientRoles,
                usernames: [username],
                clientLevel: true
            });

            const clientRolesToBeDeleted = getters.getUser({
                clientId, username
            }).clientRoles.filter(clientRole => clientRoles.indexOf(clientRole) < 0);

            if (clientRolesToBeDeleted.length) {
                await custosService.users.deleteRolesFromUser({
                    clientId,
                    roles: clientRolesToBeDeleted,
                    username: username,
                    clientLevel: true
                });
            }
        }

        let updatedUser = await custosService.users.updateProfile({clientId, username, firstName, lastName, email});
        commit("SET_USER", {
            clientId,
            id: updatedUser.id,
            username: updatedUser.username,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            email: updatedUser.email,
            realmRoles: updatedUser.realm_roles,
            clientRoles: updatedUser.client_roles,
            attributes: updatedUser.attributes.map(({key, values}) => {
                return {key, values};
            }),
            membershipType: updatedUser.membership_type,
            status: updatedUser.state
        });
    }
}


const mutations = {
    SET_USER(state, {clientId, id, username, firstName, lastName, email, realmRoles, clientRoles, attributes, membershipType, status}) {
        state.userMap = {
            ...state.userMap,
            [clientId]: {
                ...state.userMap[clientId],
                [username]: {
                    id,
                    username,
                    firstName,
                    lastName,
                    email,
                    realmRoles,
                    clientRoles,
                    attributes,
                    membershipType,
                    status
                }
            }
        }
    },
    SET_USER_STATUS(state, {clientId, username, status}) {
        state.userMap = {
            ...state.userMap,
            [clientId]: {
                ...state.userMap[clientId],
                [username]: {
                    ...state.userMap[clientId][username],
                    status: status
                }
            }
        }
    },
    SET_USER_LIST(state, {clientId, queryString, usernames}) {
        state.userListMap = {
            ...state.userListMap,
            [clientId]: {
                ...state.userListMap[clientId],
                [queryString]: usernames
            }
        }
    }
}

const getters = {
    getUser: (state) => ({clientId, username}) => {
        if (state.userMap[clientId] && state.userMap[clientId][username]) {
            return state.userMap[clientId][username];
        } else {
            return null;
        }
    },
    getUsers(state, getters) {
        return ({username = null, offset = 0, limit = 10, groupId = null, tenantId = null, clientId = null}) => {
            const params = {username, offset, limit, groupId, tenantId, clientId};
            const queryString = JSON.stringify(params);
            if (state.userListMap[clientId] && state.userListMap[clientId][queryString]) {
                const usernames = state.userListMap[clientId][queryString];
                return usernames.map(username => getters.getUser({clientId, username}));
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