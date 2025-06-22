import Vue from "vue";
import Vuex from "vuex";
import {custosService} from "./custos.util";
import auth from "../modules/auth.store";
import user from "../modules/user.store";
import group from "../modules/group.store";
import tenant from "../modules/tenant.store";
import sharing from "../modules/sharing.store";
import entity from "../modules/entity.store";
import ciLogon from "../modules/ci-logon.store";
import {createLogger} from "vuex";

export function createCustosStore(vuex = Vuex, vue = Vue) {
    vue.use(vuex);

    const debug = process.env.NODE_ENV !== 'production';

    const custosSessionPlugin = store => {
        store.dispatch('auth/init')
        custosService.identity.onChange(() => store.dispatch('auth/init'))
    }

    return new vuex.Store({
        modules: {
            auth,
            user,
            group,
            tenant,
            sharing,
            entity,
            ciLogon
        },
        strict: debug,
        plugins: debug ? [createLogger(), custosSessionPlugin] : [custosSessionPlugin],
    })
}