import {custosService} from "../util/custos.util";
import custosPortalService from "../../service/custos-portal-services";

const state = {
    userinfo: null
};

const actions = {
    async init() {
        // TODO
    },
    async fetchAuthorizationEndpoint() {
        const {data: {authorization_endpoint}} = await custosService.identity.getOpenIdConfig();

        window.location.href = authorization_endpoint;
    },
    async authenticateUsingCode(o, {code}) {
        await custosService.identity.getToken({code});
    },
    async authenticateLocally(o, {username, password}) {
        await custosService.identity.localLogin({
            username, password
        });
    },
    async logout() {
        await custosService.identity.logout();
    },
    async refreshAuthentication() {
        await custosService.identity.getTokenUsingRefreshToken();
    },
    async fetchUserinfo({commit, state}) {
        if (!state.userinfo) {
            await custosPortalService.fetchUserinfo()
                .catch(() => commit("CLEAR_USERINFO"))
                .then((data) => {
                    if (!data) {
                        commit("CLEAR_USERINFO");
                    } else {
                        commit("SET_USERINFO", data);
                    }
                });
        }
    }
}

const mutations = {
    SET_USERINFO(state, userinfo) {
        state.userinfo = userinfo;
    },
    CLEAR_USERINFO(state) {
        state.userinfo = null;
    }
}

const getters = {
    authenticated(state) {
        return !!state.userinfo;
    },
    isAdmin(state) {
        if (state.userinfo) {
            try {
                let {realm_access: {roles}} = state.userinfo;
                return roles.indexOf("admin") >= 0;
            } catch (err) {
                return false;
            }
        } else {
            return null
        }
    },
    currentUsername(state) {
        if (state.userinfo) {
            try {
                let {preferred_username} = state.userinfo;
                return preferred_username;
            } catch (err) {
                return null;
            }
        } else {
            return null;
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
