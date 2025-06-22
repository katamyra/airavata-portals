import CustosService from "./index";
import config from "../../../config";

export default class CustosTenants {
    /**
     * @type {CustosService}
     */
    _custosService = null;

    constructor(custosService) {
        this._custosService = custosService;
    }

    get custosService() {
        return this._custosService;
    }

    fetchTenants({limit, offset, parentClientId, requesterEmail}) {
        let url = `${CustosService.ENDPOINTS.TENANTS}/tenants`
        const params = {
            limit: limit,
            offset: offset,
            // status: status,
            // requester_email: requesterEmail
        };

        // TODO fix.
        if (parentClientId !== config.value('superClientId')) {
            url = `${CustosService.ENDPOINTS.TENANTS}/child/tenants`;
            params["parent_client_id"] = parentClientId;
        } else {
            params["type"] = "ADMIN";
        }

        if (requesterEmail) {
            params["requester_email"] = requesterEmail;
        }

        return this.custosService.axiosInstance.get(
            url, {params: params}
        ).then(({data}) => data)


    }

    /**
     * Create tenant role
     * @param {string} name
     * @param {string} description
     * @param {boolean} composite
     * @return {Promise<AxiosResponse<any>>}
     */
    createTenantRole({clientId, name, description, composite = false, clientLevel = false}) {
        return this.custosService.axiosInstance.post(
            `${CustosService.ENDPOINTS.TENANTS}/roles`,
            {
                "roles": [{name, description}],
                "client_level": clientLevel,
                "client_id": clientId,
                "composite": composite
            }
        ).then(({data}) => data);
    }

    deleteTenantRole({clientId, name, clientLevel = false}) {
        return this.custosService.axiosInstance.delete(
            `${CustosService.ENDPOINTS.TENANTS}/role`,
            {
                data: {
                    "role": {"id": name},
                    "client_level": clientLevel,
                    "client_id": clientId
                }
            }
        ).then(({data}) => data);
    }

    /**
     * Fetch tenant roles
     * @return {Promise<AxiosResponse<any>>}
     */
    async fetchTenantRoles({clientId, clientLevel = false}) {
        const axiosInstance = await this.custosService.axiosInstance;
        return axiosInstance.get(
            `${CustosService.ENDPOINTS.TENANTS}/roles`,
            {
                params: {
                    "client_id": clientId,
                    "client_level": clientLevel
                }
            }
        );
    }

    async createTenant({username, firstName, lastName, email, password, tenantName, redirectUris, scope, domain, clientUri, logoUri, comment, applicationType, parentClientId}) {
        let axiosInstance;
        if (parentClientId !== config.value('superClientId')) {
            axiosInstance = await this.custosService.axiosInstance;
        } else {
            axiosInstance = this.custosService.axiosInstance;
        }

        return axiosInstance.post(
            `${CustosService.ENDPOINTS.TENANTS}/oauth2/tenant`,
            {
                "client_name": tenantName,
                "requester_email": email,
                "admin_username": username,
                "admin_first_name": firstName,
                "admin_last_name": lastName,
                "admin_email": email,
                "contacts": [email],
                "redirect_uris": redirectUris,
                "scope": scope.join(" ").trim(),
                "domain": domain,
                "admin_password": password,
                "client_uri": clientUri,
                "logo_uri": logoUri,
                "application_type": applicationType,
                "comment": comment,
                "parent_client_id": parentClientId
            }
        );
    }

    updateTenant({username, firstName, lastName, email, tenantId, clientId, tenantName, redirectUris, scope, domain, clientUri, logoUri, comment, applicationType, requesterEmail}) {
        let axiosInstance = this.custosService.axiosInstance;

        return axiosInstance.put(
            `${CustosService.ENDPOINTS.TENANTS}/oauth2/tenant`,
            {
                "id": tenantId,
                "client_id": clientId,
                "client_name": tenantName,
                "requesterEmail": requesterEmail,
                "admin_username": username,
                "admin_first_name": firstName,
                "admin_last_name": lastName,
                "admin_email": email,
                "contacts": [email],
                "redirect_uris": redirectUris,
                "scope": scope.join(" ").trim(),
                "domain": domain,
                "client_uri": clientUri,
                "logo_uri": logoUri,
                "application_type": applicationType,
                "comment": comment
            }
        );
    }

    fetchTenant({clientId}) {
        return this.custosService.axiosInstance.get(
            `${CustosService.ENDPOINTS.TENANTS}/oauth2/tenant`,
            {
                params: {
                    client_id: clientId
                }
            }
        ).then(({data}) => data)
    }

    updateTenantStatus({clientId, status}) {
        return this.custosService.axiosInstance.post(
            `${CustosService.ENDPOINTS.TENANTS}/status`,
            {
                client_id: clientId,
                status: status
            }
        ).then(({data}) => data)
    }

}
