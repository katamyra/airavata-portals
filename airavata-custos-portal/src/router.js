import Vue from "vue";
import Router from "vue-router";
import Landing from "./lib/components/pages/Landing.vue";
import store from './lib/store'
import {custosService} from "./lib/store/util/custos.util";

Vue.use(Router)

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            name: "home",
            component: Landing,
            beforeEnter: async (to, from, next) => {
                await store.dispatch('auth/fetchUserinfo');
                next(true);
            }
        },
        {
            path: "/tenants/default",
            name: "tenants-default",
            beforeEnter: async (to, from, next) => {
                next(`/tenants/${custosService.clientId}`);
            }
        },
        {
            path: "/tenants/:clientId/child-tenants",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/ListTenants")
        },
        {
            path: "/tenants/:clientId/child-tenants/new",
            name: "tenants-new",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/NewTenant")
        },
        {
            path: "/tenants/:clientId",
            name: "tenants",
            // beforeEnter: async (to, from, next) => {
            //     next(`/tenants/${to.params.clientId}/profile`);
            // }
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, async (val) => {
                    if (val === true) {
                        await store.dispatch("tenant/fetchTenant", {clientId: to.params.clientId});
                        const superTenant = store.getters["tenant/getTenant"]({clientId: custosService.clientId});
                        const tenant = store.getters["tenant/getTenant"]({clientId: to.params.clientId});
                        if (superTenant.hasAdminPrivileges || tenant.hasAdminPrivileges || tenant.type === "CHILD_TENANT") {
                            next(`/tenants/${to.params.clientId}/profile`);
                        } else {
                            next(`/tenants/${to.params.clientId}/child-tenants`);
                        }
                    } else {
                        next(val);
                    }
                })

            },
            // component: () =>
            //     import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantHome")
        },
        {
            path: "/tenants/:clientId/profile",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantProfile")
        },
        {
            path: "/tenants/:clientId/users",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantUsers")
        },
        {
            path: "/tenants/:clientId/users/:username",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantUser")
        },
        {
            path: "/tenants/:clientId/groups",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantGroups")
        },
        {
            path: "/tenants/:clientId/groups/new",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantNewGroup")
        },
        {
            path: "/tenants/:clientId/groups/:groupId",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantGroup")
        },
        {
            path: "/tenants/:clientId/permission-types/new",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantNewPermissionType")
        },
        {
            path: "/tenants/:clientId/permission-types",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantPermissionTypes")
        },
        {
            path: "/tenants/:clientId/roles/new",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantNewRole")
        },
        {
            path: "/tenants/:clientId/roles",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantRoles")
        },
        {
            path: "/tenants/:clientId/entity-types/new",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantNewEntityType")
        },
        {
            path: "/tenants/:clientId/entity-types",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantEntityTypes")
        },
        {
            path: "/tenants/:clientId/entities/new",
            name: "create_entity",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantNewEntity")
        },
        {
            path: "/tenants/:clientId/entities",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantEntities")
        },
        {
            path: "/tenants/:clientId/entities/:entityId",
            name: "tenants",
            beforeEnter: async (to, from, next) => {
                await _validateAuthenticationBeforeEnter(to, from, next)
            },
            component: () =>
                import(/*webpackChunkName:"account"*/  "./lib/components/pages/TenantEntity")
        },
        {
            path: "*",
            name: "notFound",
            component: () =>
                import(/*webpackChunkName:"users"*/  "./lib/components/pages/404")
        }
    ]
})

async function _validateAuthenticationBeforeEnter(to, from, next) {
    await store.dispatch('auth/fetchUserinfo');
    const authenticated = store.getters['auth/authenticated'];

    if (!authenticated) {
        // next(true);
        next('/');
    } else {
        const username = store.getters["auth/currentUsername"];

        if (!store.getters["user/getUser"]({username, clientId: custosService.clientId})) {
            await store.dispatch('user/fetchUsers', {username, clientId: custosService.clientId});
        }

        if (!store.getters["tenant/getTenant"]({clientId: custosService.clientId})) {
            await store.dispatch("tenant/fetchTenant", {clientId: custosService.clientId});
        }

        next(true);
    }
}
